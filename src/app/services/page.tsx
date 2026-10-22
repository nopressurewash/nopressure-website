import { pageMetadata } from "@/lib/business";
import DrivewayOffer from "@/components/DrivewayOffer";
export const metadata = pageMetadata("Pressure Cleaning & House Soft Washing | Gold Coast", "Driveway, concrete, footpath and patio cleaning plus house soft washing across the Gold Coast. Driveway packages from $169. Free quotes from No Pressure.", "/services");
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
    <h2 className="text-np-gold font-semibold">{title}</h2>
    <ul className="mt-4 space-y-2 text-sm text-white/75">
      {bullets.map((b) => (
        <li key={b}>• {b}</li>
      ))}
    </ul>
    {note ? <div className="mt-4 text-xs text-white/55">{note}</div> : null}
  </div>
);

export default function ServicesPage() {
  return (
    <Container>
      <div className="py-14 md:py-18">
        <SectionHeading
          as="h1"
          eyebrow="SERVICES"
          title="Gold Coast Pressure Cleaning Specialists"
          subtitle="Professional pressure cleaning services for driveways, paths, patios and house washing across Oxenford and the Gold Coast. Reliable service, quality equipment and free quotes."
        />

        <DrivewayOffer />
        <Link href="/driveway-cleaning-gold-coast" className="inline-flex min-h-11 items-center text-np-gold underline">Driveway cleaning: see the results and request a quote</Link>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <ServiceBlock
            title="Driveway Pressure Cleaning"
            bullets={[
              "Deep concrete cleaning",
              "Mould & grime removal",
              "Stain reduction where possible",
              "Pressure and treatment suited to the surface",
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
              "Low-pressure washing for suitable surfaces",
              "Mould and built-up dirt reduction",
              "Gentle on paintwork where suitable",
            ]}
            note="Note: We do not offer roof cleaning at this time."
          />
          <ServiceBlock title="Patios & Outdoor Areas" bullets={["Concrete patios and outdoor areas", "Surface dirt and grime removal", "Cleaning method suited to the material"]} note="Ask us about access, surface condition and any stains when requesting your quote." />
          <div className="rounded-3xl border border-np-gold/25 bg-[var(--np-black)] p-7 md:p-9 shadow-[0_4px_36px_rgba(212,175,55,0.08)]">
            <div className="text-white/60 text-sm tracking-widest">PROCESS</div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight">
              Simple, fast, professional.
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div>1. Tell us your suburb and what needs cleaning</div>
              <div>2. We discuss the details and confirm a quote</div>
              <div>3. Agree on a time and we get to work</div>
            </div>

            <p className="mt-8 mb-4 text-sm font-medium text-np-gold/65">
              Ready to get started?
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
