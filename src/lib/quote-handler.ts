import { createHash, randomBytes } from "node:crypto";
import { SERVICES } from "./business.ts";

const MAX_BYTES = 16_384;
const WINDOW = 15 * 60_000;
const RETRY_MESSAGE = "Your request could not be submitted. Please try again or call 0411 076 785.";
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "landing_page"] as const;
export type Quote = { name: string; phone: string; email: string; suburb: string; service: string; message: string };
type Payload = Quote & { submissionId: string; attribution: Record<string, string> };
export type Mail = { from: string; to: string; replyTo: string; subject: string; text: string; html: string };
type ProviderResponse = { data: { id: string } | null; error: { name?: string; message?: string } | null };
type Dependencies = {
  config: () => { apiKey?: string; to?: string; from?: string };
  send: (mail: Mail, idempotencyKey: string) => Promise<ProviderResponse>;
  now?: () => number;
  report?: (code: string) => void;
};

export function validateQuote(body: unknown): Payload | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const value = body as Record<string, unknown>;
  if (value.website !== undefined && value.website !== "") return null;
  const limits = { name: 120, phone: 32, email: 254, suburb: 120, service: 80, message: 4000 };
  const quote = {} as Quote;
  for (const key of Object.keys(limits) as (keyof Quote)[]) {
    if (typeof value[key] !== "string") return null;
    const text = (value[key] as string).trim();
    if (!text || text.length > limits[key] || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) return null;
    if (key !== "message" && /[\r\n]/.test(text)) return null;
    quote[key] = text;
  }
  if (!EMAIL.test(quote.email) || !/^[+\d() .-]+$/.test(quote.phone) || !/^\d{8,15}$/.test(quote.phone.replace(/\D/g, ""))) return null;
  if (!(SERVICES as readonly string[]).includes(quote.service) || typeof value.submissionId !== "string" || !UUID.test(value.submissionId)) return null;
  const attribution: Record<string, string> = {};
  if (value.attribution && typeof value.attribution === "object" && !Array.isArray(value.attribution)) {
    const source = value.attribution as Record<string, unknown>;
    for (const key of ATTRIBUTION_KEYS) {
      if (typeof source[key] === "string" && source[key].length <= 200 && !/[\r\n\u0000]/.test(source[key])) attribution[key] = source[key];
    }
  }
  return { ...quote, submissionId: value.submissionId, attribution };
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function mailFor(payload: Payload, from: string, to: string): Mail {
  const fields = { Name: payload.name, Phone: payload.phone, Email: payload.email, Suburb: payload.suburb, Service: payload.service, Message: payload.message, ...payload.attribution };
  return { from, to, replyTo: payload.email, subject: "New Quote Request — No Pressure Exterior Specialists",
    text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n\n"),
    html: `<h2>New Quote Request</h2><table>${Object.entries(fields).map(([key, value]) => `<tr><th style="text-align:left;padding:8px;vertical-align:top">${escapeHtml(key)}</th><td style="padding:8px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table>` };
}
function json(body: object, status: number, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}
async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const result = await reader.read();
      if (result.done) break;
      length += result.value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(result.value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

// Bounded, best-effort instance-local abuse protection. No raw IP or enquiry is retained.
// Provider idempotency protects same-request retries across instances for 24 hours.
export function createQuoteHandler({ config, send, now = Date.now, report = () => {} }: Dependencies) {
  const salt = randomBytes(16).toString("hex");
  const attempts = new Map<string, { count: number; expires: number }>();
  const requests = new Map<string, { expires: number; result: Promise<Response> }>();
  const fingerprints = new Map<string, { expires: number; key: string }>();
  return async function handle(request: Request): Promise<Response> {
    const time = now();
    for (const map of [attempts, requests, fingerprints]) for (const [key, value] of map) if (value.expires <= time) map.delete(key);
    const origin = request.headers.get("origin");
    if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") return json({ error: "Please submit the form from this website." }, 403);
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const client = createHash("sha256").update(`${salt}:${ip}`).digest("hex");
    const attempt = attempts.get(client);
    if (attempt && attempt.count >= 5) return json({ error: "Too many attempts. Please wait a few minutes or call 0411 076 785." }, 429, { "Retry-After": String(Math.ceil((attempt.expires - time) / 1000)) });
    if (attempts.size >= 2000 && !attempt) return json({ error: RETRY_MESSAGE }, 503, { "Retry-After": "60" });
    attempts.set(client, { count: (attempt?.count || 0) + 1, expires: attempt?.expires || time + WINDOW });
    if (!/^application\/json(?:;|$)/i.test(request.headers.get("content-type") || "")) return json({ error: "Please use the quote form to submit your request." }, 415);
    let body: unknown;
    try { body = await readBody(request); }
    catch (error) { return json({ error: error instanceof RangeError ? "Your request is too long. Please shorten the job details." : "The request could not be read. Please try again." }, error instanceof RangeError ? 413 : 400); }
    const payload = validateQuote(body);
    if (!payload) return json({ error: "Please check every field, including a valid email and phone number, and try again." }, 400);
    const settings = config();
    const sender = settings.from?.match(/^(?:No Pressure Website\s*)?<([^<>]+)>$/)?.[1] || settings.from || "";
    if (!settings.apiKey || !settings.to || !EMAIL.test(settings.to) || !EMAIL.test(sender) || !/@(?:[a-z0-9-]+\.)*nopressure\.au$/i.test(sender)) {
      report("quote_configuration_missing_or_invalid");
      return json({ error: "Online enquiries are temporarily unavailable. Please call 0411 076 785 or email hi@nopressure.au." }, 503);
    }
    const quote = { name: payload.name, phone: payload.phone, email: payload.email, suburb: payload.suburb, service: payload.service, message: payload.message };
    const fingerprint = createHash("sha256").update(JSON.stringify(quote)).digest("hex");
    const key = createHash("sha256").update(`${payload.submissionId}:${fingerprint}`).digest("hex");
    const existing = requests.get(fingerprints.get(fingerprint)?.key || key);
    if (existing) return (await existing.result).clone();
    if (requests.size >= 2000) return json({ error: RETRY_MESSAGE }, 503);
    const result = (async () => {
      try {
        const response = await send(mailFor(payload, settings.from!, settings.to!), `quote/${key}`);
        if (response.error || !response.data?.id) {
          report("quote_provider_rejected");
          requests.delete(key); fingerprints.delete(fingerprint);
          return json({ error: RETRY_MESSAGE }, 502);
        }
        return json({ success: true, status: "accepted", requestId: response.data.id }, 202);
      } catch {
        // Ambiguous network failures must be retried with the same provider key.
        report("quote_provider_unavailable");
        requests.delete(key); fingerprints.delete(fingerprint);
        return json({ error: RETRY_MESSAGE }, 502);
      }
    })();
    requests.set(key, { expires: time + WINDOW, result });
    fingerprints.set(fingerprint, { expires: time + 60_000, key });
    return (await result).clone();
  };
}
