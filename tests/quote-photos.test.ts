import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import sharp from "sharp";
import { Resend } from "resend";
import { createQuoteHandler, type QuoteMail } from "../src/lib/quote-handler.ts";
import { MAX_QUOTE_PHOTO_BYTES, MAX_QUOTE_UPLOAD_BYTES } from "../src/lib/quote-photo-limits.ts";

const fields = () => ({ name: "Photo QA only", phone: "0400000000", email: "qa@example.com", suburb: "Gold Coast", service: "Driveway Pressure Cleaning", message: "Automated test; not a customer.", website: "", submissionId: randomUUID() });
const config = () => ({ apiKey: "test-only-not-a-real-key", to: "hi@nopressure.au" });
const accepted = async () => ({ data: { id: "test-photo-acceptance" }, error: null });
const photo = async (format: "jpeg" | "png" | "webp" = "jpeg", background = "#777") => sharp({ create: { width: 24, height: 16, channels: 3, background } }).toFormat(format).toBuffer();
function formRequest(values: Record<string, string>, files: { bytes: Uint8Array; type?: string; name?: string; field?: string }[] = [], headers: Record<string, string> = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.append(key, value);
  for (const file of files) form.append(file.field || "photos", new Blob([new Uint8Array(file.bytes)], { type: file.type || "image/jpeg" }), file.name || "customer-photo.jpg");
  return new Request("https://nopressure.au/api/quote", { method: "POST", headers: { origin: "https://nopressure.au", ...headers }, body: form });
}

test("multipart enquiries without photos keep the accepted contract and no attachments", async () => {
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  const response = await handler(formRequest(fields()));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).status, "accepted");
  assert.equal(mail?.attachments, undefined);
});

test("all supported image types decode into safe named JPEG email attachments", async () => {
  let mail: QuoteMail | undefined;
  const files = await Promise.all((["jpeg", "png", "webp"] as const).map(async (format) => ({ bytes: await photo(format), type: `image/${format}`, name: `private-address-${format}.${format}` })));
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  assert.equal((await handler(formRequest(fields(), files))).status, 202);
  assert.equal(mail?.attachments?.length, 3);
  for (const [index, attachment] of mail!.attachments!.entries()) {
    assert.equal(attachment.filename, `job-photo-${index + 1}.jpg`);
    assert.equal(attachment.contentType, "image/jpeg");
    assert.equal((await sharp(attachment.content).metadata()).format, "jpeg");
  }
  assert.ok(mail?.text.includes("Photos: 3 attached"));
  assert.equal(JSON.stringify(mail).includes("private-address"), false);
});

test("photo EXIF is stripped and orientation applied before attachment", async () => {
  const bytes = await sharp(await photo()).withMetadata({ orientation: 6 }).withExifMerge({ IFD0: { Artist: "PRIVATE TEST METADATA" }, IFD3: { GPSLatitudeRef: "S", GPSLatitude: "27/1 0/1 0/1" } }).toBuffer();
  assert.ok((await sharp(bytes).metadata()).exif);
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  assert.equal((await handler(formRequest(fields(), [{ bytes }]))).status, 202);
  const metadata = await sharp(mail!.attachments![0].content).metadata();
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
  assert.equal(metadata.orientation, undefined);
  assert.equal(metadata.width, 16);
  assert.equal(metadata.height, 24);
});

test("non-images, spoofed MIME, SVG, and truncated images cannot reach email provider", async () => {
  for (const file of [
    { bytes: Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'></svg>"), type: "image/svg+xml" },
    { bytes: Buffer.from("MZ executable content"), type: "image/jpeg" },
    { bytes: await photo("png"), type: "image/jpeg" },
    { bytes: Buffer.from([255, 216, 255, 224, 0]), type: "image/jpeg" },
    { bytes: Buffer.alloc(0), type: "image/jpeg" },
  ]) {
    let sends = 0;
    const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
    const response = await handler(formRequest(fields(), [file]));
    assert.equal(response.status, 400);
    assert.equal(sends, 0);
    assert.equal((await response.text()).includes("libvips"), false);
  }
});

test("more than three photos or an oversized file is rejected without sending", async () => {
  const bytes = await photo();
  for (const files of [Array.from({ length: 4 }, () => ({ bytes })), [{ bytes: Buffer.alloc(MAX_QUOTE_PHOTO_BYTES + 1) }]]) {
    let sends = 0;
    const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
    assert.equal((await handler(formRequest(fields(), files))).status, 400);
    assert.equal(sends, 0);
  }
});

test("multipart byte limit applies without content-length and with a false small value", async () => {
  for (const headers of [{}, { "content-length": "10" }]) {
    const handler = createQuoteHandler({ config, send: accepted });
    const encoded = formRequest(fields(), [{ bytes: Buffer.alloc(MAX_QUOTE_UPLOAD_BYTES + 1) }]);
    const bytes = new Uint8Array(await encoded.arrayBuffer());
    const stream = new ReadableStream({ start(controller) {
      for (let offset = 0; offset < bytes.length; offset += 65_536) controller.enqueue(bytes.slice(offset, offset + 65_536));
      controller.close();
    } });
    const request = new Request(encoded.url, { method: "POST", headers: { "content-type": encoded.headers.get("content-type")!, ...headers }, body: stream, duplex: "half" } as RequestInit);
    const response = await handler(request);
    assert.equal(response.status, 413);
  }
});

test("image dimensions are bounded independently of compressed file size", async () => {
  for (const [width, height] of [[1601, 1], [2000, 2000]]) {
    const bytes = await sharp({ create: { width, height, channels: 3, background: "#777" } }).png().toBuffer();
    assert.ok(bytes.length < MAX_QUOTE_PHOTO_BYTES);
    let sends = 0;
    const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
    assert.equal((await handler(formRequest(fields(), [{ bytes, type: "image/png" }]))).status, 400);
    assert.equal(sends, 0);
  }
});

test("animated WebP uploads are rejected rather than attaching hidden frames", async () => {
  const raw = Buffer.concat([Buffer.alloc(12 * 8 * 3, 50), Buffer.alloc(12 * 8 * 3, 200)]);
  const bytes = await sharp(raw, { raw: { width: 12, height: 16, channels: 3, pageHeight: 8 } }).webp({ loop: 0, delay: [100, 100] }).toBuffer();
  assert.equal((await sharp(bytes).metadata()).pages, 2);
  let sends = 0;
  const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
  assert.equal((await handler(formRequest(fields(), [{ bytes, type: "image/webp" }]))).status, 400);
  assert.equal(sends, 0);
});

test("dense valid photos stay below the email byte cap after server re-encoding", async () => {
  const bytes = await sharp({ create: { width: 1600, height: 1600, channels: 3, background: "#777", noise: { type: "gaussian", mean: 128, sigma: 45 } } }).jpeg({ quality: 25 }).toBuffer();
  assert.ok(bytes.length <= MAX_QUOTE_PHOTO_BYTES);
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  assert.equal((await handler(formRequest(fields(), [{ bytes }]))).status, 202);
  assert.ok(mail!.attachments![0].content.length <= MAX_QUOTE_PHOTO_BYTES);
  assert.equal((await sharp(mail!.attachments![0].content).metadata()).exif, undefined);
});

test("unexpected file fields, duplicate scalar fields, missing boundary and invalid fields fail", async () => {
  const duplicate = new FormData();
  for (const [key, value] of Object.entries(fields())) duplicate.append(key, value);
  duplicate.append("email", "other@example.com");
  const requests = [
    formRequest(fields(), [{ bytes: await photo(), field: "document" }]),
    formRequest({ ...fields(), email: "invalid" }),
    formRequest({ ...fields(), website: "spam.example" }),
    new Request("https://nopressure.au/api/quote", { method: "POST", body: duplicate }),
    new Request("https://nopressure.au/api/quote", { method: "POST", headers: { "content-type": "multipart/form-data" }, body: "bad multipart" }),
  ];
  for (const request of requests) {
    let sends = 0;
    const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
    assert.equal((await handler(request)).status, 400);
    assert.equal(sends, 0);
  }
});

test("photo enquiries preserve origin checks and rate limiting", async () => {
  const handler = createQuoteHandler({ config, send: accepted });
  assert.equal((await handler(formRequest(fields(), [], { origin: "https://other.example" }))).status, 403);
  for (let i = 0; i < 5; i++) assert.equal((await handler(formRequest(fields()))).status, 202);
  assert.equal((await handler(formRequest(fields()))).status, 429);
});

test("the same photos and retry identity deduplicate across instances; changed photos do not", async () => {
  const keys: string[] = [];
  const send = async (_mail: QuoteMail, key: string) => { keys.push(key); return accepted(); };
  const values = fields();
  const file = { bytes: await photo() };
  await createQuoteHandler({ config, send })(formRequest(values, [file]));
  await createQuoteHandler({ config, send })(formRequest(values, [{ ...file, name: "different-name.jpg" }]));
  await createQuoteHandler({ config, send })(formRequest(values, [{ bytes: await photo("jpeg", "#222") }]));
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});

test("simultaneous photo submissions and immediate new-ID duplicates send once", async () => {
  let sends = 0;
  const values = fields();
  const file = { bytes: await photo() };
  const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
  const results = await Promise.all([handler(formRequest(values, [file])), handler(formRequest(values, [file]))]);
  assert.deepEqual(results.map((result) => result.status), [202, 202]);
  assert.equal((await handler(formRequest({ ...values, submissionId: randomUUID() }, [file]))).status, 202);
  assert.equal(sends, 1);
});

test("Resend SDK serializes sanitized attachment bytes and rejected attachments never show success", async (context) => {
  const bodies: Record<string, unknown>[] = [];
  const keys: (string | null)[] = [];
  context.mock.method(globalThis, "fetch", async (_input: unknown, init: RequestInit) => {
    keys.push(new Headers(init.headers).get("idempotency-key"));
    bodies.push(JSON.parse(String(init.body)));
    return bodies.length === 1 ? Response.json({ name: "validation_error", message: "private attachment rejection" }, { status: 422 }) : Response.json({ id: "sdk-photo-test-only" });
  });
  const handler = createQuoteHandler({ config, send: (mail, key) => new Resend("test-only-not-real").emails.send(mail, { idempotencyKey: key }) });
  const values = fields();
  const file = { bytes: await photo() };
  const rejected = await handler(formRequest(values, [file]));
  assert.equal(rejected.status, 502);
  assert.equal((await rejected.text()).includes("private attachment rejection"), false);
  assert.equal((await handler(formRequest(values, [file]))).status, 202);
  assert.equal(keys[0], keys[1]);
  const attachments = bodies[1].attachments as { filename: string; content: string; content_type: string }[];
  assert.equal(attachments[0].filename, "job-photo-1.jpg");
  assert.equal(attachments[0].content_type, "image/jpeg");
  assert.equal((await sharp(Buffer.from(attachments[0].content, "base64")).metadata()).format, "jpeg");
});
