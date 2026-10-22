import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { createQuoteHandler, type Mail } from "../src/lib/quote-handler.ts";

const valid = () => ({ name: "Website QA — not a customer", phone: "0400000000", email: "qa@example.com", suburb: "Gold Coast", service: "Driveway Pressure Cleaning", message: "Automated local test only.", website: "", submissionId: randomUUID() });
const config = () => ({ apiKey: "test-only-not-a-real-key", to: "hi@nopressure.au", from: "No Pressure Website <quotes@nopressure.au>" });
function request(body: unknown = valid(), headers: Record<string, string> = {}) {
  return new Request("https://nopressure.au/api/quote", { method: "POST", headers: { "content-type": "application/json", origin: "https://nopressure.au", ...headers }, body: JSON.stringify(body) });
}
const accepted = async () => ({ data: { id: "test-provider-request" }, error: null });

test("provider acceptance returns 202, never a delivered claim", async () => {
  let mail: Mail | undefined;
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
  const send = async (_mail: Mail, key: string) => { keys.push(key); return accepted(); };
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

test("enquiry HTML is escaped and only attribution allowlist is included", async () => {
  let mail: Mail | undefined;
  const handler = createQuoteHandler({ config, send: async (value) => { mail = value; return accepted(); } });
  const response = await handler(request({ ...valid(), message: '<script>alert("test")</script>', attribution: { utm_source: "google", gclid: "test-click-only", arbitrary: "do not retain", utm_campaign: "x".repeat(201) } }));
  assert.equal(response.status, 202);
  assert.ok(mail?.html.includes("&lt;script&gt;"));
  assert.equal(mail?.html.includes("<script>"), false);
  assert.ok(mail?.text.includes("utm_source: google"));
  assert.equal(mail?.text.includes("do not retain"), false);
  assert.equal(mail?.text.includes("utm_campaign"), false);
});

test("unconfigured or onboarding sender fails closed before contacting Resend", async () => {
  for (const settings of [{}, { ...config(), to: "invalid" }, { ...config(), from: "onboarding@resend.dev" }, { ...config(), from: "quotes@nopressure.au.attacker.example" }]) {
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
