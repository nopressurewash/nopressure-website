
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";

const WHY_CARDS = [
  { title: "Fully Insured", desc: "Professional service and peace of mind." },
  { title: "Professional Equipment", desc: "Premium tools for premium results." },
  { title: "Premium Results", desc: "A finish that stands out instantly." },
  { title: "Attention to Detail", desc: "Every job, every time." },
  { title: "Reliable & On Time", desc: "Clear communication and punctuality." },
];

const SERVICES = [
  {
    title: "Driveway Pressure Cleaning",
    desc: "Deep concrete cleaning that restores colour and contrast.",
  },
  {
    title: "Footpaths & Walkways",
    desc: "Walkways, pavers and entryways — clean lines and a premium finish.",
  },
  {
    title: "Exterior House Soft Wash",
    desc: "Safe exterior washing for walls and surfaces.",
  },
];



export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
<Section
  size="large"
  className="relative overflow-hidden bg-np-black flex items-center justify-center py-28 md:py-36"
  containerClassName="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
>
  <div className="relative z-10 flex flex-col items-center text-center w-full">
    
    <img
      src="/logos/logo-wordmark.png"
      alt="No Pressure Exterior Specialists"
      style={{ height: '480px', width: 'auto', maxWidth: '95vw', display: 'block' }}
      className="mx-auto object-contain mb-10 md:mb-12 select-none"
      draggable="false"
      loading="eager"
    />

    <div className="text-sm md:text-base text-np-muted font-medium mb-2">
      Gold Coast &amp; surrounding suburbs
    </div>

    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight md:leading-[1.1] text-white mb-4">
      Premium Driveway &amp; Exterior Cleaning
    </h1>

    <p className="text-base md:text-xl text-white/80 font-medium max-w-xl mx-auto mb-6">
      Driveways • Footpaths • Exterior Walls • Soft Washing • Concrete Surfaces
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button href="/contact" variant="gold" size="lg">
        Get a Free Quote
      </Button>
      <Button href="tel:0411076785" variant="outline" size="lg">
        Call 0411 076 785
      </Button>
    </div>

  </div>
</Section>

      {/* WHY CHOOSE US SECTION */}
      <Section size="medium" className="bg-np-black border-t border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide text-center mb-10">Why Choose Us</h2>
          <div className="grid gap-8 md:grid-cols-5">
            {WHY_CARDS.map((card) => (
              <Card key={card.title} goldBorder className="p-8 min-h-[170px] flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/5 to-np-black/80">
                <div className="text-np-gold font-bold text-lg mb-2 tracking-wide">{card.title}</div>
                <div className="text-white/80 text-sm font-medium">{card.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES PREVIEW SECTION */}
      <Section size="medium" className="bg-np-black">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="OUR SERVICES"
            title="Premium exterior cleaning"
            subtitle="Focused services that deliver a clean, high-end finish for your property."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {SERVICES.map((service) => (
              <Card key={service.title} goldBorder className="p-8 min-h-[200px] flex flex-col justify-between hover:shadow-lg hover:shadow-np-gold/20 transition-shadow">
                <div>
                  <div className="text-np-gold font-semibold text-lg mb-2 tracking-wide">{service.title}</div>
                  <div className="text-white/80 text-base">{service.desc}</div>
                </div>
                <Button href="/contact" variant="flat" size="md" className="mt-6">Get a Free Quote</Button>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* TRUST / PREMIUM STATEMENT SECTION */}
      <Section size="small" className="bg-np-black">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <span className="inline-block w-24 h-1 rounded-full bg-gradient-to-r from-np-gold via-np-purple to-np-gold" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-np-gold mb-3 tracking-wide">Craftsmanship, always.</h2>
          <p className="text-np-muted text-base md:text-lg font-medium">
            Every job is completed with care, precision, and a premium finish. That’s the No Pressure standard.
          </p>
        </div>
      </Section>
    </>
  );
}
