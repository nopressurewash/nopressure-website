"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

type FormState = {
  name: string;
  phone: string;
  suburb: string;
  service: string;
  message: string;
};

const services = [
  "Driveway Pressure Cleaning",
  "Footpaths & Entryways",
  "Exterior House Soft Wash",
  "Not sure — tell us what you need",
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    suburb: "",
    service: services[0],
    message: "",
  });

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("No Pressure — Quote Request");
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Suburb: ${form.suburb}`,
        `Service: ${form.service}`,
        "",
        `Details:`,
        form.message || "(none provided)",
      ].join("\n")
    );
    return `mailto:hi@nopressure.au?subject=${subject}&body=${body}`;
  }, [form]);

  return (
    <Container>
      <div className="py-14 md:py-18">
        <SectionHeading
          eyebrow="CONTACT"
          title="Get a free quote"
          subtitle="Send through a few details and we’ll get back to you fast. For the quickest quote, include your suburb and what needs cleaning."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9">
            <div className="grid gap-5">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-white/70 tracking-wide">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200"
                  placeholder="Your name"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-white/70 tracking-wide">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200"
                  placeholder="Your phone number"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-white/70 tracking-wide">Suburb</label>
                <input
                  value={form.suburb}
                  onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200"
                  placeholder="Your suburb"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-white/70 tracking-wide">Service</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="appearance-none rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200 bg-[length:16px_16px] bg-[position:right_16px_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='rgba(255,255,255,0.4)'%3E%3Cpath d='M4.5 6l3.5 4 3.5-4'/%3E%3C/svg%3E\")" }}
                >
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-white/70 tracking-wide">Details</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="min-h-[120px] rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-np-gold/50 focus:ring-1 focus:ring-np-gold/20 transition-all duration-200"
                  placeholder="What needs cleaning? Any stains or problem areas?"
                />
              </div>

              <a
                href={mailtoHref}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-np-gold px-6 py-3.5 font-semibold text-black shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:brightness-110 hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)] transition-all duration-200"
              >
                Get My Free Quote
              </a>

              <p className="text-center text-xs text-white/45 tracking-wide">
                Fast response • No obligation • Gold Coast local
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[var(--np-black)] p-7 md:p-9">
            <div className="text-white/60 text-sm tracking-widest">DIRECT</div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight">
              Prefer to call?
            </div>

            <div className="mt-5 space-y-3 text-white/80">
              <a className="block hover:text-white" href="tel:0411076785">
                0411 076 785
              </a>
              <a className="block hover:text-white" href="mailto:hi@nopressure.au">
                hi@nopressure.au
              </a>
              <div className="text-white/60 text-sm pt-2">
                Gold Coast & surrounding suburbs.
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                <div className="text-white font-semibold tracking-wide mb-4">What Happens Next</div>
                <ol className="space-y-3">
                  {[
                    "Send your request",
                    "We review the details",
                    "You receive your quote",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-np-gold/10 text-np-gold text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
