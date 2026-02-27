import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const Pill = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
    <span className="h-1.5 w-1.5 rounded-full bg-np-purple" />
    {children}
  </div>
);

const ServiceCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition">
    <div className="text-np-gold font-semibold">{title}</div>
    <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>
    <div className="mt-5">
      <Link
        href="/contact"
        className="text-sm text-white/85 hover:text-white underline decoration-white/30 hover:decoration-white transition"
      >
        Get a quote →
      </Link>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-np-purple blur-[140px] opacity-30" />
          <div className="absolute -bottom-60 left-1/2 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-np-gold blur-[160px] opacity-15" />
        </div>

        <Container>
          <div className="relative py-16 md:py-24">
            <div className="max-w-2xl flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                <Pill>Fully insured</Pill>
                <Pill>Professional equipment</Pill>
                <Pill>Fast quotes</Pill>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]">
                <span className="text-np-gold">Premium</span> driveway & footpath cleaning.
              </h1>

              <p className="text-base md:text-lg text-white/75 leading-relaxed">
                High-end results with professional high-pressure cleaning and safe exterior soft washing — no roofs, no ladders, just clean.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-np-gold px-6 py-3 font-semibold text-black hover:brightness-110 transition"
                >
                  Get a Free Quote
                </Link>
                <a
                  href="tel:0411076785"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white/90 hover:text-white hover:border-white/30 transition"
                >
                  Call 0411 076 785
                </a>
              </div>

              <div className="mt-2 text-sm text-white/60">
                Gold Coast & surrounding suburbs.
              </div>
            </div>

            <div className="mt-10 md:mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-[var(--np-black)] p-5">
                  <div className="text-np-gold font-semibold">Driveways</div>
                  <div className="mt-2 text-sm text-white/70">Deep concrete cleaning that restores colour and contrast.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[var(--np-black)] p-5">
                  <div className="text-np-gold font-semibold">Footpaths</div>
                  <div className="mt-2 text-sm text-white/70">Walkways, pavers and entryways — clean lines.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[var(--np-black)] p-5">
                  <div className="text-np-gold font-semibold">Soft Wash</div>
                  <div className="mt-2 text-sm text-white/70">Safe exterior washing for walls and surfaces.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[var(--np-black)] p-5">
                  <div className="text-np-gold font-semibold">No Roofs</div>
                  <div className="mt-2 text-sm text-white/70">Ground-level exterior cleaning only.</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-18">
        <Container>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <SectionHeading
              eyebrow="SERVICES"
              title="What we clean"
              subtitle="Concrete, paths and exterior surfaces — done properly, with a premium finish."
            />
            <Link
              href="/services"
              className="text-sm text-white/80 hover:text-white underline decoration-white/20 hover:decoration-white/60 transition"
            >
              View all services →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ServiceCard
              title="Driveway Pressure Cleaning"
              desc="Deep concrete cleaning that removes built-up grime and lifts street appeal."
            />
            <ServiceCard
              title="Footpaths & Entryways"
              desc="High-traffic walkways, pavers and entries restored to a clean, sharp look."
            />
            <ServiceCard
              title="Exterior House Soft Wash"
              desc="Safe exterior rinsing and soft wash for walls and surfaces — no roof work."
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <Container>
          <div className="py-12 grid gap-8 md:grid-cols-2 items-center">
            <SectionHeading
              eyebrow="PREMIUM STANDARD"
              title="Clean, consistent, professional."
              subtitle="We focus on ground-level exterior cleaning that looks premium when it’s finished — with a process that respects your property."
            />

            <div className="rounded-3xl border border-white/10 bg-[var(--np-black)] p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Fast Quotes", "Send photos and we’ll respond quickly."],
                  ["Fully Insured", "Professional service and peace of mind."],
                  ["Premium Finish", "Results that stand out instantly."],
                  ["Reliable Service", "Clear communication and tidy work."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-np-gold font-semibold">{t}</div>
                    <div className="mt-1 text-white/70">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 p-8 md:p-12">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready for a premium clean?
              </h3>
              <p className="mt-3 text-white/75 leading-relaxed">
                Get a fast quote for your driveway, footpath, or exterior wash.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-np-gold px-6 py-3 font-semibold text-black hover:brightness-110 transition"
                >
                  Get a Free Quote
                </Link>
                <a
                  href="tel:0411076785"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white/90 hover:text-white hover:border-white/30 transition"
                >
                  Call 0411 076 785
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
