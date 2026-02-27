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
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
                  placeholder="Brandon"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/70">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
                  placeholder="0411 076 785"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/70">Suburb</label>
                <input
                  value={form.suburb}
                  onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
                  placeholder="Gold Coast"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/70">Service</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/70">Details</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="min-h-[120px] rounded-xl bg-[var(--np-black)] border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
                  placeholder="What needs cleaning? Any stains or problem areas?"
                />
              </div>

              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-full bg-np-gold px-6 py-3 font-semibold text-black hover:brightness-110 transition"
              >
                Send Quote Request
              </a>

              <div className="text-xs text-white/55">
                This button opens your email app with the details filled in.
                Later, we can upgrade this to a proper form that sends submissions automatically.
              </div>
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
                <div className="text-np-gold font-semibold">Note</div>
                <div className="mt-2">
                  We currently focus on driveways, footpaths and exterior surfaces.
                  We do not offer roof cleaning at this time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
