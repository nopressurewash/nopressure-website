"use client";

import { useState } from "react";

type FormData = {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  message: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const SERVICES = [
  "Driveway Pressure Cleaning",
  "Footpaths & Walkways",
  "Exterior House Soft Wash",
  "Other",
];

const INPUT_CLASS =
  "rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200";

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  suburb: "",
  service: SERVICES[0],
  message: "",
};

export default function QuoteForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9 flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-np-gold/10">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-np-gold" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Sent</h3>
        <p className="text-white/70 max-w-sm">
          Thanks — your quote request has been sent. We'll be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-np-gold hover:text-white transition-colors"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9"
    >
      <div className="grid gap-5">
        <div className="grid gap-1.5">
          <label htmlFor="qf-name" className="text-sm font-medium text-white/70 tracking-wide">Full Name</label>
          <input
            id="qf-name"
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
            type="tel"
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
            type="email"
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
            required
            value={form.message}
            onChange={set("message")}
            className={`${INPUT_CLASS} min-h-[120px]`}
            placeholder="What needs cleaning? Any stains or problem areas?"
          />
        </div>

        {status === "error" && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMsg || "Something went wrong. Please try again."}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
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
            "Get a Free Quote"
          )}
        </button>

        <p className="text-center text-xs text-white/45 tracking-wide">
          Fast response &bull; No obligation &bull; Gold Coast local
        </p>
      </div>
    </form>
  );
}
