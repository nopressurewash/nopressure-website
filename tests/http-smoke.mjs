import { spawn } from "node:child_process";
import { once } from "node:events";
import assert from "node:assert/strict";

// Run after npm run build. This child deliberately has no mail credentials.
const port = process.env.QUOTE_SMOKE_PORT || "3085";
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port], {
  env: { ...process.env, RESEND_API_KEY: "", QUOTE_TO_EMAIL: "", QUOTE_FROM_EMAIL: "" },
  stdio: ["ignore", "pipe", "pipe"],
});
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Test server did not become ready")), 10_000);
    child.stdout.on("data", (chunk) => { if (String(chunk).includes("Ready")) { clearTimeout(timer); resolve(); } });
    child.on("error", (error) => { clearTimeout(timer); reject(error); });
    child.on("exit", (code) => { clearTimeout(timer); if (code) reject(new Error(`Test server exited ${code}`)); });
  });
  const base = `http://127.0.0.1:${port}`;
  const body = { name: "Local QA only", phone: "0400000000", email: "qa@example.com", suburb: "Gold Coast", service: "Driveway Pressure Cleaning", message: "Local HTTP test only.", submissionId: crypto.randomUUID(), website: "" };
  async function post(payload, extra = {}, raw = false) {
    return fetch(`${base}/api/quote`, { method: "POST", headers: { "content-type": "application/json", origin: base, "x-vercel-forwarded-for": "192.0.2.1", ...extra }, body: raw ? payload : JSON.stringify(payload) });
  }
  assert.equal((await fetch(base)).status, 200);
  const contact = await fetch(`${base}/contact`);
  assert.equal(contact.status, 200);
  const html = (await contact.text()).toLowerCase();
  for (const id of ["qf-name", "qf-phone", "qf-email", "qf-suburb", "qf-service", "qf-message"]) assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('autocomplete="tel"'));
  assert.ok(html.includes('maxlength="4000"'));
  assert.equal((await fetch(`${base}/gallery`)).status, 200);
  assert.equal((await fetch(`${base}/api/quote`)).status, 405);
  assert.equal((await post("{", {}, true)).status, 400);
  const unavailable = await post(body);
  assert.equal(unavailable.status, 503);
  assert.ok((await unavailable.json()).error.includes("0411 076 785"));
  assert.equal((await post({ ...body, website: "spam.example" })).status, 400);
  assert.equal((await post({ ...body, message: "x".repeat(20_000) })).status, 413);
  assert.equal((await post(body, { origin: "https://other.example" })).status, 403);
  assert.equal((await post(body, { "content-type": "text/plain" })).status, 415);
  const limited = await post(body);
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  console.log("HTTP checks passed: page renders and API 405/400/503/413/403/415/429 responses. No real mail credentials loaded.");
} finally {
  if (child.exitCode === null && child.signalCode === null) {
    const stopped = once(child, "exit");
    child.kill("SIGTERM");
    await stopped;
  }
}
