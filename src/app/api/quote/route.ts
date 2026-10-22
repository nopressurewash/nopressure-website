import { NextResponse } from "next/server";
import { Resend } from "resend";

const REQUIRED_FIELDS = ["name", "phone", "email", "suburb", "service", "message"] as const;

type QuotePayload = Record<(typeof REQUIRED_FIELDS)[number], string>;

function validate(body: unknown): body is QuotePayload {
  if (!body || typeof body !== "object") return false;
  const obj = body as Record<string, unknown>;
  return REQUIRED_FIELDS.every(
    (f) => typeof obj[f] === "string" && (obj[f] as string).trim().length > 0,
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!validate(body)) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const { name, phone, email, suburb, service, message } = body;

    const toEmail = process.env.QUOTE_TO_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;
    if (!toEmail || !apiKey) {
      console.error("Quote email configuration is missing");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "No Pressure Website <onboarding@resend.dev>",
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

    if (error || !data?.id) {
      console.error("Quote email provider rejected the request");
      return NextResponse.json(
        { error: "Your request could not be submitted. Please try again or call 0411 076 785." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Quote API request failed");
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 500 },
    );
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
