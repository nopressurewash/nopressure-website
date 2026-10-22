import { createHash, randomBytes } from "node:crypto";
import { QUOTE_LIMITS, QUOTE_SERVICES, type QuoteFields } from "./quote-fields.ts";
import { MAX_QUOTE_UPLOAD_BYTES } from "./quote-photo-limits.ts";
import { quoteAttachments, readQuotePhotos, QuotePhotoError, type QuoteAttachment } from "./quote-photos-server.ts";

const MAX_BYTES = 16_384;
const WINDOW_MS = 15 * 60_000;
const DUPLICATE_WINDOW_MS = 60_000;
const EMAIL = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RETRY_MESSAGE = "We could not confirm your request. Please try again or call 0411 076 785.";
// Preserve the owner-confirmed delivery path until a domain sender is verified and approved.
export const DEFAULT_QUOTE_FROM = "No Pressure Website <onboarding@resend.dev>";

type Payload = QuoteFields & { submissionId?: string };
export type QuoteMail = { from: string; to: string; replyTo: string; subject: string; text: string; html: string; attachments?: QuoteAttachment[] };
type ProviderResponse = { data: { id: string } | null; error: { name?: string; message?: string } | null };
type Config = { apiKey?: string; to?: string; from?: string };
type Dependencies = {
  config: () => Config;
  send: (mail: QuoteMail, idempotencyKey: string) => Promise<ProviderResponse>;
  now?: () => number;
  report?: (code: string) => void;
};

function validateQuote(body: unknown): { payload: Payload } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "Please check your details and try again." };
  const value = body as Record<string, unknown>;
  if (value.website !== undefined && value.website !== "") return { error: "Your request could not be submitted. Please call 0411 076 785." };
  const payload = {} as Payload;
  for (const key of Object.keys(QUOTE_LIMITS) as (keyof QuoteFields)[]) {
    if (typeof value[key] !== "string") return { error: "Please complete every field." };
    const text = (value[key] as string).trim();
    if (!text || text.length > QUOTE_LIMITS[key] || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) return { error: "Please check every field and keep the job details under 4,000 characters." };
    if (key !== "message" && /[\r\n]/.test(text)) return { error: "Please keep contact details on a single line." };
    payload[key] = text;
  }
  if (!EMAIL.test(payload.email)) return { error: "Please enter a valid email address." };
  if (!/^[+\d() .-]+$/.test(payload.phone) || !/^\d{8,15}$/.test(payload.phone.replace(/\D/g, ""))) return { error: "Please enter a valid phone number, including the area code where needed." };
  if (!(QUOTE_SERVICES as readonly string[]).includes(payload.service)) return { error: "Please choose one of the listed services." };
  if (value.submissionId !== undefined) {
    if (typeof value.submissionId !== "string" || !UUID.test(value.submissionId)) return { error: "Please refresh the page and try again." };
    payload.submissionId = value.submissionId;
  }
  return { payload };
}

function resolveMailConfig(settings: Config): { from: string; to: string } | null {
  const from = settings.from?.trim() || DEFAULT_QUOTE_FROM;
  const to = settings.to?.trim() || "";
  const sender = from.match(/^(?:[^<>\r\n]+\s*)?<([^<>\r\n]+)>$/)?.[1] || from;
  const permittedSender = sender === "onboarding@resend.dev" || /@(?:[a-z0-9-]+\.)*nopressure\.au$/i.test(sender);
  if (!settings.apiKey || !EMAIL.test(to) || to.length > 254 || !EMAIL.test(sender) || !permittedSender || /[\r\n]/.test(from)) return null;
  return { from, to };
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function mailFor(payload: Payload, config: { from: string; to: string }): QuoteMail {
  const fields = { Name: payload.name, Phone: payload.phone, Email: payload.email, Suburb: payload.suburb, Service: payload.service, Message: payload.message };
  const rows = Object.entries(fields).map(([key, value]) => {
    let rendered = escapeHtml(value);
    if (key === "Phone") rendered = `<a href="tel:${escapeHtml(value.replace(/[^+\d]/g, ""))}">${rendered}</a>`;
    if (key === "Email") rendered = `<a href="mailto:${escapeHtml(value)}">${rendered}</a>`;
    return `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#555">${key}</th><td style="padding:8px 12px;white-space:pre-wrap">${rendered}</td></tr>`;
  }).join("");
  return {
    ...config, replyTo: payload.email,
    subject: "New Quote Request — No Pressure Exterior Specialists",
    text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n\n"),
    html: `<h2>New Quote Request</h2><table style="border-collapse:collapse;width:100%;max-width:500px">${rows}</table>`,
  };
}

function json(body: object, status: number, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

async function readBody(request: Request, multipart: boolean): Promise<{ body: unknown; files: File[] }> {
  const limit = multipart ? MAX_QUOTE_UPLOAD_BYTES : MAX_BYTES;
  if (Number(request.headers.get("content-length")) > limit) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const result = await reader.read();
      if (result.done) break;
      length += result.value.byteLength;
      if (length > limit) { await reader.cancel(); throw new RangeError(); }
      chunks.push(result.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = Buffer.concat(chunks);
  if (!multipart) return { body: JSON.parse(bytes.toString("utf8")), files: [] };
  // Parse only after the streamed byte cap, rather than buffering unbounded formData().
  const form = await new Response(new Uint8Array(bytes), { headers: { "content-type": request.headers.get("content-type")! } }).formData();
  const body: Record<string, string> = Object.create(null);
  const files: File[] = [];
  let textBytes = 0;
  for (const [key, value] of form) {
    if (typeof value !== "string") {
      if (key !== "photos") throw new QuotePhotoError("Please use the photo field to attach JPG, PNG or WebP photos.");
      if (value.size || value.name) files.push(value);
    } else {
      if (key === "photos" || Object.hasOwn(body, key)) throw new QuotePhotoError("The request could not be read. Please try again.");
      textBytes += Buffer.byteLength(value, "utf8");
      if (textBytes > MAX_BYTES) throw new RangeError();
      body[key] = value;
    }
  }
  return { body, files };
}

function hasAllowedOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    // Next.js can construct request.url using an internal host. Host identifies the
    // site the browser requested; do not trust a customer-supplied forwarded-host.
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    const forwardedProtocol = request.headers.get("x-forwarded-proto");
    const protocol = forwardedProtocol === "https" || forwardedProtocol === "http" ? `${forwardedProtocol}:` : url.protocol;
    return origin === new URL(`${protocol}//${host}`).origin;
  } catch { return false; }
}

// These bounded limits are best-effort per server instance, not a distributed firewall.
// State contains salted IP digests, request digests and acceptance responses, not enquiry fields.
// Resend idempotency also deduplicates a new form's retry across instances for 24 hours.
export function createQuoteHandler({ config, send, now = Date.now, report = () => {} }: Dependencies) {
  const salt = randomBytes(16).toString("hex");
  const attempts = new Map<string, { count: number; expires: number }>();
  const requests = new Map<string, { expires: number; result: Promise<Response> }>();
  const fingerprints = new Map<string, { expires: number; key: string }>();

  return async function handle(request: Request): Promise<Response> {
    const time = now();
    for (const map of [attempts, requests, fingerprints]) {
      for (const [key, value] of map) if (value.expires <= time) map.delete(key);
    }
    if (!hasAllowedOrigin(request)) return json({ error: "Please submit the form from this website." }, 403);

    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const client = createHash("sha256").update(`${salt}:${ip}`).digest("hex");
    const attempt = attempts.get(client);
    if (attempt && attempt.count >= 5) return json({ error: "Too many attempts. Please wait a few minutes or call 0411 076 785." }, 429, { "Retry-After": String(Math.ceil((attempt.expires - time) / 1000)) });
    if (attempts.size >= 2000 && !attempt) return json({ error: RETRY_MESSAGE }, 503, { "Retry-After": "60" });
    attempts.set(client, { count: (attempt?.count || 0) + 1, expires: attempt?.expires || time + WINDOW_MS });

    const contentType = request.headers.get("content-type") || "";
    const multipart = /^multipart\/form-data(?:;|$)/i.test(contentType);
    if (!multipart && !/^application\/json(?:;|$)/i.test(contentType)) return json({ error: "Please use the quote form to submit your request." }, 415);
    let input: Awaited<ReturnType<typeof readBody>>;
    let photos: Awaited<ReturnType<typeof readQuotePhotos>>;
    try {
      input = await readBody(request, multipart);
      photos = await readQuotePhotos(input.files);
    } catch (error) {
      return json({ error: error instanceof QuotePhotoError ? error.message : error instanceof RangeError ? (multipart ? "Your request is too large. Remove a photo or shorten the job details." : "Your request is too long. Please shorten the job details.") : "The request could not be read. Please try again." }, error instanceof RangeError ? 413 : 400);
    }
    const validation = validateQuote(input.body);
    if ("error" in validation) return json({ error: validation.error }, 400);
    const payload = validation.payload;
    const mailConfig = resolveMailConfig(config());
    if (!mailConfig) {
      report("quote_configuration_missing_or_invalid");
      return json({ error: "Online enquiries are temporarily unavailable. Please call 0411 076 785 or email hi@nopressure.au." }, 503);
    }

    const fields = { name: payload.name, phone: payload.phone, email: payload.email, suburb: payload.suburb, service: payload.service, message: payload.message };
    // Preserve keys for already-open text-only forms; changed photo bytes identify a new enquiry.
    const fingerprint = createHash("sha256").update(JSON.stringify(fields));
    for (const photo of photos) fingerprint.update(`:${photo.digest}`);
    const digest = fingerprint.digest("hex");
    // Old already-open forms still work. New forms use a stable UUID for reliable retries.
    const identity = payload.submissionId || `legacy-${Math.floor(time / 300_000)}`;
    const key = createHash("sha256").update(`${identity}:${digest}`).digest("hex");
    const existing = requests.get(fingerprints.get(digest)?.key || key);
    if (existing) return (await existing.result).clone();
    if (requests.size >= 1000) return json({ error: RETRY_MESSAGE }, 503, { "Retry-After": "60" });

    // Defer the send by a microtask so even a synchronously throwing dependency is cached first.
    const result = Promise.resolve().then(async () => {
      try {
        const attachments = await quoteAttachments(photos);
        const mail = mailFor(payload, mailConfig);
        if (attachments.length) {
          mail.attachments = attachments;
          mail.text += `\n\nPhotos: ${attachments.length} attached for this quote enquiry. Resized copies; originals remain with the customer.`;
          mail.html += `<p>Photos: ${attachments.length} attached for this quote enquiry. Resized copies; originals remain with the customer.</p>`;
        }
        const response = await send(mail, `quote/${key}`);
        if (response.error || typeof response.data?.id !== "string" || !response.data.id.trim()) {
          report("quote_provider_rejected");
          requests.delete(key); fingerprints.delete(digest);
          return json({ error: RETRY_MESSAGE }, 502);
        }
        return json({ success: true, status: "accepted", requestId: response.data.id }, 202);
      } catch (error) {
        if (error instanceof QuotePhotoError) {
          requests.delete(key); fingerprints.delete(digest);
          return json({ error: error.message }, 400);
        }
        // An interrupted response is ambiguous; keep the same provider key when retrying.
        report("quote_provider_unavailable");
        requests.delete(key); fingerprints.delete(digest);
        return json({ error: RETRY_MESSAGE }, 502);
      }
    });
    requests.set(key, { expires: time + WINDOW_MS, result });
    fingerprints.set(digest, { expires: time + DUPLICATE_WINDOW_MS, key });
    return (await result).clone();
  };
}
