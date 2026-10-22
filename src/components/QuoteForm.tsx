"use client";

import { useRef, useState } from "react";
import { QUOTE_LIMITS, QUOTE_SERVICES, type QuoteFields } from "@/lib/quote-fields";
import { requireQuoteAcceptance } from "@/lib/quote-response";
import QuotePhotos from "@/components/QuotePhotos";

type Status = "idle" | "submitting" | "success" | "error";

const SERVICES = QUOTE_SERVICES;

const INPUT_CLASS =
  "min-w-0 w-full rounded-xl bg-[var(--np-black)] border border-white/20 px-4 py-3 text-base text-white placeholder:text-white/50 outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200";

const INITIAL: QuoteFields = {
  name: "",
  phone: "",
  email: "",
  suburb: "",
  service: SERVICES[0],
  message: "",
};

export default function QuoteForm() {
  const [form, setForm] = useState<QuoteFields>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [website, setWebsite] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [preparingPhotos, setPreparingPhotos] = useState(false);
  const inFlight = useRef(false);
  const submission = useRef<{ body: string; photos: File[]; id: string } | null>(null);
  const feedback = useRef<HTMLDivElement>(null);

  const set = (field: keyof QuoteFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current || preparingPhotos) return;
    inFlight.current = true;
    setStatus("submitting");
    setErrorMsg("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      const body = JSON.stringify(form);
      // Keep the request identity after an error/timeout so a retry cannot send twice.
      if (submission.current?.body !== body || submission.current.photos !== photos) submission.current = { body, photos, id: crypto.randomUUID() };
      const data = new FormData();
      for (const [key, value] of Object.entries(form)) data.append(key, value);
      data.append("website", website);
      data.append("submissionId", submission.current!.id);
      for (const [index, photo] of photos.entries()) data.append("photos", photo, `job-photo-${index + 1}.jpg`);
      const res = await fetch("/api/quote", {
        method: "POST",
        signal: controller.signal,
        body: data,
      });

      await requireQuoteAcceptance(res);

      setStatus("success");
      setForm(INITIAL);
      setPhotos([]);
      submission.current = null;
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.name === "AbortError"
          ? "We could not confirm your request in time. Please retry or call 0411 076 785."
          : err instanceof TypeError
            ? "We could not connect. Please check your connection and retry, or call 0411 076 785."
            : err instanceof Error ? err.message : "We could not confirm your request. Please retry or call 0411 076 785.",
      );
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div ref={feedback} role="status" tabIndex={-1} className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9 flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-np-gold/10">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-np-gold" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request submitted</h3>
        <p className="text-white/70 max-w-sm">
          Thanks for the details. We&apos;ll get in touch to discuss the job and your quote.
        </p>
        <p className="mt-3 text-sm text-white/70">Need to speak to us? <a href="tel:0411076785" className="text-np-gold underline">Call 0411 076 785</a>.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 min-h-11 text-sm text-np-gold hover:text-white transition-colors"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Free quote request"
      aria-busy={status === "submitting"}
      className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9"
    >
      <fieldset disabled={status === "submitting"} className="grid min-w-0 gap-5">
        <legend className="sr-only">Your contact and cleaning details</legend>
        <div className="grid gap-1.5">
          <label htmlFor="qf-name" className="text-sm font-medium text-white/70 tracking-wide">Full Name</label>
          <input
            id="qf-name"
            name="name"
            autoComplete="name"
            maxLength={QUOTE_LIMITS.name}
            required
            value={form.name}
            onChange={set("name")}
            className={INPUT_CLASS}
            placeholder="Your name"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="qf-phone" className="text-sm font-medium text-white/70 tracking-wide">Phone Number</label>
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            minLength={8}
            maxLength={QUOTE_LIMITS.phone}
            required
            value={form.phone}
            onChange={set("phone")}
            className={INPUT_CLASS}
            placeholder="Your phone number"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="qf-email" className="text-sm font-medium text-white/70 tracking-wide">Email Address</label>
          <input
            id="qf-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={QUOTE_LIMITS.email}
            required
            value={form.email}
            onChange={set("email")}
            className={INPUT_CLASS}
            placeholder="you@example.com"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="qf-suburb" className="text-sm font-medium text-white/70 tracking-wide">Suburb</label>
          <input
            id="qf-suburb"
            name="suburb"
            autoComplete="address-level2"
            maxLength={QUOTE_LIMITS.suburb}
            required
            value={form.suburb}
            onChange={set("suburb")}
            className={INPUT_CLASS}
            placeholder="Your suburb"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="qf-service" className="text-sm font-medium text-white/70 tracking-wide">Service Needed</label>
          <select
            id="qf-service"
            name="service"
            required
            value={form.service}
            onChange={set("service")}
            className={`${INPUT_CLASS} appearance-none bg-[length:16px_16px] bg-[position:right_16px_center] bg-no-repeat`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='rgba(255,255,255,0.4)'%3E%3Cpath d='M4.5 6l3.5 4 3.5-4'/%3E%3C/svg%3E\")",
            }}
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="qf-message" className="text-sm font-medium text-white/70 tracking-wide">Message / Job Details</label>
          <textarea
            id="qf-message"
            name="message"
            maxLength={QUOTE_LIMITS.message}
            required
            value={form.message}
            onChange={set("message")}
            className={`${INPUT_CLASS} min-h-[120px]`}
            placeholder="What needs cleaning? Any stains or problem areas?"
          />
        </div>

        <QuotePhotos photos={photos} onChange={setPhotos} onPreparing={setPreparingPhotos} />

        <div className="hidden" aria-hidden="true">
          <label htmlFor="qf-website">Leave this field empty</label>
          <input id="qf-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={status === "submitting" || preparingPhotos}
          className="mt-1 inline-flex items-center justify-center rounded-full bg-np-gold px-6 py-3.5 font-semibold text-black shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:brightness-110 hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : (
            preparingPhotos ? "Preparing photos…" : "Get a Free Quote"
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-white/65">
          No obligation. Your details and optional photos are sent to No Pressure via Resend to respond to your enquiry. Photos are not published. Please avoid including people or sensitive documents.
        </p>
      </fieldset>
      {status === "submitting" && <p role="status" className="mt-4 text-sm text-white/80">Submitting your request. Please keep this page open.</p>}
      {status === "error" && (
        <div ref={feedback} role="alert" tabIndex={-1} className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg} <a href="tel:0411076785" className="underline">Call us</a> or <a href="mailto:hi@nopressure.au" className="underline">email us</a>.
        </div>
      )}
    </form>
  );
}
