
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
      <Section className="relative overflow-hidden bg-np-black pt-10 pb-20 md:pt-20 md:pb-32">
        {/* Glowing metallic hero logo effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="relative flex flex-col items-center">
            <span className="block">
              <span className="relative z-10">
                <Image
                  src="/logos/logo-wordmark.png"
                  alt="No Pressure Wordmark"
                  width={340}
                  height={80}
                  className="hidden md:block"
                  priority
                />
                <Image
                  src="/logos/logo-icon.png"
                  alt="No Pressure Icon"
                  width={80}
                  height={80}
                  className="block md:hidden"
                  priority
                />
              </span>
              {/* Glowing metallic effect (CSS only) */}
              <span className="absolute inset-0 z-0 blur-2xl opacity-60 pointer-events-none">
                <span className="block w-full h-full bg-gradient-to-br from-np-gold/60 via-np-purple/40 to-np-gold/30 rounded-full animate-pulse" />
              </span>
            </span>
          </div>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-7 mt-32 md:mt-40">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
            <span className="text-np-gold">Exterior Specialists</span> for the Gold Coast
          </h1>
          <p className="text-lg md:text-2xl text-white/80 font-medium max-w-xl mx-auto">
            Premium driveway, footpath and exterior cleaning. High-end results, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <Button href="/contact" variant="gold" size="lg">Get a Free Quote</Button>
            <Button href="tel:0411076785" variant="outline" size="lg">Call 0411 076 785</Button>
          </div>
        </div>
      </Section>

      {/* WHY CHOOSE US SECTION */}
      <Section className="bg-np-black border-t border-b border-white/10">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-5">
          {WHY_CARDS.map((card) => (
            <Card key={card.title} goldBorder className="p-6 text-center flex flex-col items-center bg-gradient-to-b from-white/5 to-np-black/80">
              <div className="text-np-gold font-bold text-lg mb-2">{card.title}</div>
              <div className="text-white/80 text-sm font-medium">{card.desc}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SERVICES PREVIEW SECTION */}
      <Section className="bg-np-black">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="OUR SERVICES"
            title="Premium exterior cleaning"
            subtitle="Focused services that deliver a clean, high-end finish for your property."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map((service) => (
              <Card key={service.title} goldBorder className="p-7 hover:shadow-lg hover:shadow-np-gold/20 transition-shadow">
                <div className="text-np-gold font-semibold text-lg mb-2">{service.title}</div>
                <div className="text-white/80 text-base">{service.desc}</div>
                <Button href="/contact" variant="flat" size="md" className="mt-6">Get a Free Quote</Button>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* TRUST / PREMIUM STATEMENT SECTION */}
      <Section className="bg-np-black">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <span className="inline-block w-24 h-1 rounded-full bg-gradient-to-r from-np-gold via-np-purple to-np-gold" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-np-gold mb-2">Craftsmanship, always.</h3>
          <p className="text-white/80 text-lg font-medium">
            Every job is completed with care, precision, and a premium finish. That’s the No Pressure standard.
          </p>
        </div>
      </Section>
    </>
  );
}
