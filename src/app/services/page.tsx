import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const ServiceBlock = ({
  title,
  bullets,
  note,
}: {
  title: string;
  bullets: string[];
  note?: string;
}) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9">
    <div className="text-np-gold font-semibold">{title}</div>
    <ul className="mt-4 space-y-2 text-sm text-white/75">
      {bullets.map((b) => (
        <li key={b}>• {b}</li>
      ))}
    </ul>
    {note ? <div className="mt-4 text-xs text-white/55">{note}</div> : null}
    <div className="mt-6">
      <Link
        href="/contact#quote"
        className="inline-flex rounded-full bg-np-gold px-5 py-2.5 text-sm font-semibold text-black hover:brightness-110 transition"
      >
        Get a Free Quote
      </Link>
    </div>
  </div>
);

export default function ServicesPage() {
  return (
    <Container>
      <div className="py-14 md:py-18">
        <SectionHeading
          eyebrow="SERVICES"
          title="Gold Coast Pressure Cleaning Specialists"
          subtitle="Professional pressure cleaning services for driveways, paths, patios and house washing across Oxenford and the Gold Coast. Reliable service, quality equipment and free quotes."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <ServiceBlock
            title="Driveway Pressure Cleaning"
            bullets={[
              "Deep concrete cleaning",
              "Mould & grime removal",
              "Stain reduction where possible",
              "Fresh, even finish",
            ]}
          />
          <ServiceBlock
            title="Footpaths & Entryways"
            bullets={[
              "Footpaths, paths, pavers",
              "High-traffic walkways",
              "Entry/porch areas",
              "Clean lines and contrast",
            ]}
          />
          <ServiceBlock
            title="Exterior House Soft Wash"
            bullets={[
              "Walls and exterior surfaces",
              "Safe soft washing approach",
              "Mould and built-up dirt reduction",
              "Gentle on paintwork where suitable",
            ]}
            note="Note: We do not offer roof cleaning at this time."
          />
          <div className="rounded-3xl border border-white/10 bg-[var(--np-black)] p-7 md:p-9">
            <div className="text-white/60 text-sm tracking-widest">PROCESS</div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight">
              Simple, fast, professional.
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div>1. Send photos (or request an inspection)</div>
              <div>2. Fast quote and booking confirmation</div>
              <div>3. We clean — you get the premium finish</div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact#quote"
                className="inline-flex items-center justify-center rounded-full bg-np-gold px-6 py-3 font-semibold text-black hover:brightness-110 transition"
              >
                Get a Free Quote
              </Link>
              <a
                href="https://m.me/61588346376881"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white/90 hover:text-white hover:border-white/30 transition"
              >
                Message Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
