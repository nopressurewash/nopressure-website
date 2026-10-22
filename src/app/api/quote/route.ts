import { Resend } from "resend";
import { createQuoteHandler } from "@/lib/quote-handler";

export const runtime = "nodejs";
export const POST = createQuoteHandler({
  config: () => ({
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.QUOTE_TO_EMAIL,
    from: process.env.QUOTE_FROM_EMAIL,
  }),
  send: async (mail, idempotencyKey) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send(mail, { idempotencyKey });
  },
  // No personal details, API keys or raw provider errors in application logs.
  report: (code) => console.error(code),
});
