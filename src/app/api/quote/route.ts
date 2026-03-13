import { NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const { name, phone, email, suburb, service, message } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.QUOTE_TO_EMAIL;

    if (!apiKey || !toEmail) {
      console.error("Missing env: RESEND_API_KEY or QUOTE_TO_EMAIL");
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "No Pressure <quotes@nopressure.au>",
      to: toEmail,
      subject: "New Quote Request — No Pressure Exterior Specialists",
      replyTo: email,
      html: `
        <h2>New Quote Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px 12px;font-weight:600;color:#555">Name</td><td style="padding:8px 12px">${esc(name)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#555">Phone</td><td style="padding:8px 12px"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#555">Email</td><td style="padding:8px 12px"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#555">Suburb</td><td style="padding:8px 12px">${esc(suburb)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#555">Service</td><td style="padding:8px 12px">${esc(service)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Message</td><td style="padding:8px 12px;white-space:pre-wrap">${esc(message)}</td></tr>
        </table>
      `,
    });

    await sendSmsNotification({ name, phone, suburb, service });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 500 },
    );
  }
}

async function sendSmsNotification(lead: {
  name: string;
  phone: string;
  suburb: string;
  service: string;
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.TWILIO_TO_NUMBER;

  if (!accountSid || !authToken || !from || !to) {
    console.warn("Twilio env vars missing — SMS notification skipped");
    return;
  }

  try {
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      from,
      to,
      body: [
        "New No Pressure Quote",
        "",
        `Name: ${lead.name}`,
        `Phone: ${lead.phone}`,
        `Suburb: ${lead.suburb}`,
        `Service: ${lead.service}`,
        "",
        `Tap to call:`,
        `tel:${lead.phone}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Twilio SMS error (email was sent successfully):", err);
  }
}

const REQUIRED_FIELDS = ["name", "phone", "email", "suburb", "service", "message"] as const;
type QuotePayload = Record<(typeof REQUIRED_FIELDS)[number], string>;

function isValidPayload(body: unknown): body is QuotePayload {
  if (!body || typeof body !== "object") return false;
  const obj = body as Record<string, unknown>;
  return REQUIRED_FIELDS.every(
    (f) => typeof obj[f] === "string" && (obj[f] as string).trim().length > 0,
  );
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
