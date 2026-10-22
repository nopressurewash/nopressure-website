import assert from "node:assert/strict";
import { test } from "node:test";
import { requireQuoteAcceptance } from "../src/lib/quote-response.ts";

test("client accepts an explicit provider-accepted response", async () => {
  assert.equal(await requireQuoteAcceptance(Response.json({ success: true, status: "accepted", requestId: "test-request-id" }, { status: 202 })), "test-request-id");
});

test("client does not report success for an incomplete or misleading 2xx body", async () => {
  for (const body of [{}, null, { success: true }, { success: true, status: "accepted" }, { success: true, status: "accepted", requestId: " " }, { success: false, status: "accepted", requestId: "test" }]) {
    await assert.rejects(requireQuoteAcceptance(Response.json(body)), /could not confirm/);
  }
});

test("client surfaces a failed API response and rejects success data on an error status", async () => {
  await assert.rejects(requireQuoteAcceptance(Response.json({ error: "Please wait and try again." }, { status: 429 })), /Please wait and try again/);
  await assert.rejects(requireQuoteAcceptance(Response.json({ success: true, status: "accepted", requestId: "test" }, { status: 500 })), /could not confirm/);
});

test("client handles malformed responses and non-string errors safely", async () => {
  await assert.rejects(requireQuoteAcceptance(new Response("<html>unavailable</html>", { status: 502 })), /could not confirm/);
  await assert.rejects(requireQuoteAcceptance(Response.json({ error: { internal: "private detail" } }, { status: 500 })), /could not confirm/);
});
