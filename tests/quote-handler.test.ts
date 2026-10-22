import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { createQuoteHandler, type QuoteMail } from "../src/lib/quote-handler.ts";

const valid = () => ({ name: "Website QA — not a customer", phone: "0400000000", email: "qa@example.com", suburb: "Gold Coast", service: "Driveway Pressure Cleaning", message: "Automated local test only.", website: "", submissionId: randomUUID() });
const config = () => ({ apiKey: "test-only-not-a-real-key", to: "hi@nopressure.au", from: "No Pressure Website <quotes@nopressure.au>" });
function request(body: unknown = valid(), headers: Record<string, string> = {}) {
  return new Request("https://nopressure.au/api/quote", { method: "POST", headers: { "content-type": "application/json", origin: "https://nopressure.au", ...headers }, body: JSON.stringify(body) });
}
const accepted = async () => ({ data: { id: "test-provider-request" }, error: null });

test("provider acceptance returns 202, never a delivered claim", async () => {
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  const response = await handler(request());
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { success: true, status: "accepted", requestId: "test-provider-request" });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(mail?.to, "hi@nopressure.au");
  assert.equal(mail?.replyTo, "qa@example.com");
});

test("Resend returned error cannot produce success or expose provider details", async () => {
  const handler = createQuoteHandler({ config, send: async () => ({ data: null, error: { name: "validation_error", message: "private provider detail" } }) });
  const response = await handler(request());
  assert.equal(response.status, 502);
  assert.equal((await response.text()).includes("private provider detail"), false);
});

test("missing provider message ID is a failure", async () => {
  const handler = createQuoteHandler({ config, send: async () => ({ data: null, error: null }) });
  assert.equal((await handler(request())).status, 502);
});

test("network failure can be retried with the same idempotency key", async () => {
  const keys: string[] = [];
  const handler = createQuoteHandler({ config, send: async (_mail, key) => { keys.push(key); if (keys.length === 1) throw new Error("private network details"); return accepted(); } });
  const body = valid();
  assert.equal((await handler(request(body))).status, 502);
  assert.equal((await handler(request(body))).status, 202);
  assert.equal(keys[0], keys[1]);
});

test("concurrent submissions and immediate duplicate with a new ID send only once", async () => {
  let sends = 0;
  let release: (() => void) | undefined;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const handler = createQuoteHandler({ config, send: async () => { sends++; await gate; return accepted(); } });
  const body = valid();
  const first = handler(request(body));
  const second = handler(request(body));
  release!();
  assert.equal((await first).status, 202);
  assert.equal((await second).status, 202);
  assert.equal((await handler(request({ ...body, submissionId: randomUUID() }))).status, 202);
  assert.equal(sends, 1);
});

test("identical retry across independent server instances uses the same provider key", async () => {
  const keys: string[] = [];
  const send = async (_mail: QuoteMail, key: string) => { keys.push(key); return accepted(); };
  const body = valid();
  await createQuoteHandler({ config, send })(request(body));
  await createQuoteHandler({ config, send })(request(body));
  assert.equal(keys[0], keys[1]);
});

test("server rejects invalid fields, unoffered service, header injection and spam", async () => {
  for (const invalid of [{ email: "not-an-email" }, { phone: "123" }, { phone: "+garbage0400000000" }, { name: " " }, { name: "x".repeat(121) }, { service: "Roof Cleaning" }, { email: "qa@example.com\r\nBcc: other@example.com" }, { website: "spam.example" }, { message: 12 }, { submissionId: "invalid-id" }]) {
    let sends = 0;
    const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
    assert.equal((await handler(request({ ...valid(), ...invalid }))).status, 400, JSON.stringify(invalid));
    assert.equal(sends, 0);
  }
});

test("enquiry HTML is escaped, contact links remain usable and unknown fields are ignored", async () => {
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  const response = await handler(request({ ...valid(), message: '<script>alert("test")</script>', attribution: { utm_source: "google", gclid: "test-click-only", arbitrary: "do not retain", utm_campaign: "x".repeat(201) } }));
  assert.equal(response.status, 202);
  assert.ok(mail?.html.includes("&lt;script&gt;"));
  assert.equal(mail?.html.includes("<script>"), false);
  assert.ok(mail?.html.includes('href="tel:0400000000"'));
  assert.ok(mail?.html.includes('href="mailto:qa@example.com"'));
  assert.equal(mail?.text.includes("utm_source"), false);
  assert.equal(mail?.text.includes("do not retain"), false);
  assert.equal(mail?.text.includes("utm_campaign"), false);
});

test("missing credentials, invalid recipient or unapproved sender fails before contacting Resend", async () => {
  for (const settings of [{}, { ...config(), to: "invalid" }, { ...config(), from: "quotes@other.example" }, { ...config(), from: "quotes@nopressure.au.attacker.example" }]) {
    let sends = 0;
    const handler = createQuoteHandler({ config: () => settings, send: async () => { sends++; return accepted(); } });
    assert.equal((await handler(request())).status, 503);
    assert.equal(sends, 0);
  }
});

test("cross-origin requests cannot send email", async () => {
  const handler = createQuoteHandler({ config, send: accepted });
  assert.equal((await handler(request(valid(), { origin: "https://other.example" }))).status, 403);
  assert.equal((await handler(request(valid(), { "sec-fetch-site": "cross-site" }))).status, 403);
});

test("body is bounded even when content-length is absent or false", async () => {
  const handler = createQuoteHandler({ config, send: accepted });
  assert.equal((await handler(request({ ...valid(), message: "x".repeat(20_000) }))).status, 413);
  assert.equal((await handler(request(valid(), { "content-length": "20000" }))).status, 413);
  const malformed = new Request("https://nopressure.au/api/quote", { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  assert.equal((await handler(malformed)).status, 400);
  assert.equal((await handler(request(valid(), { "content-type": "text/plain" }))).status, 415);
});

test("rapid attempts are limited and the window expires", async () => {
  let time = 1_000;
  const handler = createQuoteHandler({ config, send: accepted, now: () => time });
  for (let n = 0; n < 5; n++) assert.equal((await handler(request())) .status, 202);
  const blocked = await handler(request());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("retry-after"), "900");
  time += 900_001;
  assert.equal((await handler(request())).status, 202);
});

test("current test sender remains available until a verified domain is configured", async () => {
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config: () => ({ apiKey: "test-only-not-real", to: "hi@nopressure.au" }), send: async (value) => { mail = value; return accepted(); } });
  assert.equal((await handler(request())).status, 202);
  assert.equal(mail?.from, "No Pressure Website <onboarding@resend.dev>");
});

test("a configured No Pressure subdomain sender is used exactly as configured", async () => {
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config: () => ({ ...config(), from: "No Pressure Website <quotes@mail.nopressure.au>" }), send: async (value) => { mail = value; return accepted(); } });
  assert.equal((await handler(request())).status, 202);
  assert.equal(mail?.from, "No Pressure Website <quotes@mail.nopressure.au>");
});

test("an already-open older form still submits without a request identity or honeypot", async () => {
  const body: Record<string, unknown> = valid();
  delete body.submissionId; delete body.website;
  const handler = createQuoteHandler({ config, send: accepted });
  assert.equal((await handler(request(body))).status, 202);
});

test("legacy simultaneous duplicates are collapsed", async () => {
  let sends = 0;
  const body: Record<string, unknown> = valid(); delete body.submissionId;
  const handler = createQuoteHandler({ config, send: async () => { sends++; return accepted(); } });
  await Promise.all([handler(request(body)), handler(request(body))]);
  assert.equal(sends, 1);
});

test("synchronous delivery exceptions do not poison the retry cache", async () => {
  let attempts = 0;
  const handler = createQuoteHandler({ config, send: () => { if (++attempts === 1) throw new Error("private detail"); return accepted(); } });
  const body = valid();
  assert.equal((await handler(request(body))).status, 502);
  assert.equal((await handler(request(body))).status, 202);
  assert.equal(attempts, 2);
});

test("provider rejection can be corrected and retried without a stale failure result", async () => {
  let attempts = 0;
  const handler = createQuoteHandler({ config, send: async () => ++attempts === 1 ? { data: null, error: { message: "private provider rejection" } } : accepted() });
  const body = valid();
  assert.equal((await handler(request(body))).status, 502);
  assert.equal((await handler(request(body))).status, 202);
  assert.equal(attempts, 2);
});

test("a deliberate new request after the duplicate window can be sent", async () => {
  let time = 1000, sends = 0;
  const handler = createQuoteHandler({ config, now: () => time, send: async () => { sends++; return accepted(); } });
  const body = valid();
  await handler(request(body));
  time += 60_001;
  await handler(request({ ...body, submissionId: randomUUID() }));
  assert.equal(sends, 2);
});

test("a new identity with different job details is a separate enquiry", async () => {
  const keys: string[] = [];
  const handler = createQuoteHandler({ config, send: async (_mail, key) => { keys.push(key); return accepted(); } });
  const body = valid();
  await handler(request(body));
  await handler(request({ ...body, message: "Also need a patio quote.", submissionId: randomUUID() }));
  assert.equal(keys.length, 2);
  assert.notEqual(keys[0], keys[1]);
});

test("rate limit is isolated between visitors on the same server instance", async () => {
  const handler = createQuoteHandler({ config, send: accepted });
  for (let n = 0; n < 5; n++) await handler(request(valid(), { "x-vercel-forwarded-for": "192.0.2.1" }));
  assert.equal((await handler(request(valid(), { "x-vercel-forwarded-for": "192.0.2.1" }))).status, 429);
  assert.equal((await handler(request(valid(), { "x-vercel-forwarded-for": "192.0.2.2" }))).status, 202);
});

test("contact and message whitespace is normalized without losing message line breaks", async () => {
  let mail: QuoteMail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  await handler(request({ ...valid(), name: "  Test Customer  ", message: "  Driveway\nPatio  ", phone: "+61 (411) 000-000" }));
  assert.ok(mail?.text.includes("Name: Test Customer"));
  assert.ok(mail?.text.includes("Message: Driveway\nPatio"));
  assert.ok(mail?.html.includes('href="tel:+61411000000"'));
});

test("installed Resend SDK sends an idempotency header and returns provider errors", async (context) => {
  const { Resend } = await import("resend");
  const calls: { key: string | null; payload: Record<string, unknown> }[] = [];
  context.mock.method(globalThis, "fetch", async (_input: unknown, init: RequestInit) => {
    calls.push({ key: new Headers(init.headers).get("idempotency-key"), payload: JSON.parse(String(init.body)) });
    return calls.length === 1 ? Response.json({ id: "test-sdk-acceptance" }) : Response.json({ name: "validation_error", message: "test-only provider rejection" }, { status: 422 });
  });
  const handler = createQuoteHandler({ config, send: (mail, idempotencyKey) => new Resend("test-only-not-a-real-key").emails.send(mail, { idempotencyKey }) });
  const first = await handler(request());
  assert.equal(first.status, 202);
  assert.equal((await first.json()).requestId, "test-sdk-acceptance");
  const second = await handler(request({ ...valid(), message: "Different test enquiry." }));
  assert.equal(second.status, 502);
  assert.match(calls[0].key || "", /^quote\/[a-f0-9]{64}$/);
  assert.equal(calls[0].payload.from, "No Pressure Website <quotes@nopressure.au>");
  assert.equal(calls[0].payload.to, "hi@nopressure.au");
});

test("empty acceptance IDs cannot report server success", async () => {
  for (const id of ["", " "]) {
    const handler = createQuoteHandler({ config, send: async () => ({ data: { id }, error: null }) });
    assert.equal((await handler(request())).status, 502);
  }
});

test("legitimate browser origins work when Next.js uses an internal request URL", async () => {
  const handler = createQuoteHandler({ config, send: accepted });
  const local = new Request("http://localhost:3085/api/quote", { method: "POST", headers: { host: "127.0.0.1:3085", origin: "http://127.0.0.1:3085", "content-type": "application/json" }, body: JSON.stringify(valid()) });
  assert.equal((await handler(local)).status, 202);
  const hosted = new Request("http://localhost:3000/api/quote", { method: "POST", headers: { host: "nopressure.au", origin: "https://nopressure.au", "x-forwarded-proto": "https", "content-type": "application/json" }, body: JSON.stringify(valid()) });
  assert.equal((await handler(hosted)).status, 202);
});

test("a spoofed forwarded-host cannot authorize an unrelated browser origin", async () => {
  const handler = createQuoteHandler({ config, send: accepted });
  assert.equal((await handler(request(valid(), { host: "nopressure.au", "x-forwarded-host": "other.example", origin: "https://other.example" }))).status, 403);
});
