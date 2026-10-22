"use client";

import { useRef, useState } from "react";
import { SERVICES } from "@/lib/business";
import { getAttribution, trackQuoteAccepted } from "@/lib/tracking";

type FormData = { name: string; phone: string; email: string; suburb: string; service: string; message: string };
type Status = "idle" | "submitting" | "success" | "error";
const INITIAL: FormData = { name: "", phone: "", email: "", suburb: "", service: SERVICES[0], message: "" };
const INPUT_CLASS = "min-w-0 w-full rounded-xl bg-[var(--np-black)] border border-white/20 px-4 py-3 text-base text-white placeholder:text-white/50 outline-none focus:border-np-gold focus:ring-1 focus:ring-np-gold transition-colors";

export default function QuoteForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [website, setWebsite] = useState("");
  const inFlight = useRef(false);
  const submission = useRef<{ body: string; id: string } | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("submitting"); setErrorMsg("");
    const body = JSON.stringify(form);
    // Preserve this identity after a timeout/error, so retrying cannot send another email.
    if (submission.current?.body !== body) submission.current = { body, id: crypto.randomUUID() };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch("/api/quote", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...form, website, submissionId: submission.current!.id, attribution: getAttribution() }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success !== true || data?.status !== "accepted" || typeof data?.requestId !== "string" || !data.requestId) {
        throw new Error(data?.error || "Your request could not be confirmed. Please try again or call 0411 076 785.");
      }
      setStatus("success"); setForm(INITIAL); submission.current = null;
      // Analytics failure must never change the result of a successful enquiry.
      try { trackQuoteAccepted(data.requestId); } catch { /* Optional measurement. */ }
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error && error.name !== "AbortError" ? error.message : "We could not confirm your request in time. Please retry or call 0411 076 785.");
    } finally {
      clearTimeout(timeout); inFlight.current = false;
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }

  if (status === "success") return (
    <div ref={feedback} tabIndex={-1} role="status" className="rounded-3xl border border-np-gold/30 bg-white/5 p-7 md:p-9 text-center outline-none">
      <h3 className="text-xl font-bold text-white">Thanks — your request is submitted.</h3>
      <p className="mt-3 text-white/80">Our email service has accepted it for sending. We’ll review your details and get in touch to discuss the job and your quote.</p>
      <p className="mt-3 text-sm text-white/70">Need to speak to us? <a href="tel:0411076785" className="text-np-gold underline">Call 0411 076 785</a>.</p>
      <button type="button" onClick={() => setStatus("idle")} className="mt-5 min-h-11 text-np-gold underline">Send another request</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} aria-label="Free quote request" aria-busy={status === "submitting"} className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 md:p-9">
      <fieldset disabled={status === "submitting"} className="grid min-w-0 gap-5">
        <legend className="sr-only">Your contact and cleaning details</legend>
        <div className="grid gap-1.5"><label htmlFor="qf-name" className="text-sm font-medium text-white/80">Full Name</label><input id="qf-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={set("name")} className={INPUT_CLASS} placeholder="Your name" /></div>
        <div className="grid gap-1.5"><label htmlFor="qf-phone" className="text-sm font-medium text-white/80">Phone Number</label><input id="qf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={32} minLength={8} title="Enter a phone number using digits, spaces, brackets or a plus sign." value={form.phone} onChange={set("phone")} className={INPUT_CLASS} placeholder="Your phone number" /></div>
        <div className="grid gap-1.5"><label htmlFor="qf-email" className="text-sm font-medium text-white/80">Email Address</label><input id="qf-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={set("email")} className={INPUT_CLASS} placeholder="you@example.com" /></div>
        <div className="grid gap-1.5"><label htmlFor="qf-suburb" className="text-sm font-medium text-white/80">Suburb</label><input id="qf-suburb" name="suburb" autoComplete="address-level2" required maxLength={120} value={form.suburb} onChange={set("suburb")} className={INPUT_CLASS} placeholder="Your suburb" /></div>
        <div className="grid gap-1.5"><label htmlFor="qf-service" className="text-sm font-medium text-white/80">Service Needed</label><select id="qf-service" name="service" required value={form.service} onChange={set("service")} className={INPUT_CLASS}>{SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}</select></div>
        <div className="grid gap-1.5"><label htmlFor="qf-message" className="text-sm font-medium text-white/80">Message / Job Details</label><textarea id="qf-message" name="message" required maxLength={4000} value={form.message} onChange={set("message")} className={`${INPUT_CLASS} min-h-[120px]`} placeholder="What needs cleaning? Rough size, stains and any tricky access are helpful." /><p className="text-xs leading-relaxed text-white/65">A rough description is fine. We can discuss any extra details before quoting.</p></div>
        <div className="hidden" aria-hidden="true"><label htmlFor="qf-website">Leave this field empty</label><input id="qf-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
        <button type="submit" className="min-h-12 rounded-full bg-np-gold px-6 py-3 font-semibold text-black hover:brightness-110 disabled:opacity-60 disabled:cursor-wait">{status === "submitting" ? "Submitting…" : "Get a Free Quote"}</button>
      </fieldset>
      {status === "submitting" && <p role="status" className="mt-4 text-sm text-white/80">Submitting your request. Please keep this page open.</p>}
      {status === "error" && <div ref={feedback} tabIndex={-1} role="alert" className="mt-4 rounded-xl border border-red-400/50 bg-red-500/10 p-4 text-sm text-red-200 outline-none">{errorMsg} <a href="tel:0411076785" className="underline">Call us</a> or <a href="mailto:hi@nopressure.au" className="underline">email us</a>.</div>}
      <p className="mt-5 text-center text-xs leading-relaxed text-white/65">No obligation. Your details are used to respond to your enquiry. <a href="/privacy" className="text-np-gold underline">Privacy</a></p>
    </form>
  );
}
