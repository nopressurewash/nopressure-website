import { pageMetadata } from "@/lib/business";
import DrivewayOffer from "@/components/DrivewayOffer";
import DrivewayPhotos from "@/components/DrivewayPhotos";

export const metadata = pageMetadata("Driveway Cleaning Gold Coast | From $169 | No Pressure", "Gold Coast driveway pressure cleaning from $169. See real before and after work, get a free quote or call No Pressure on 0411 076 785.", "/");

import Button from "@/components/Button";
import Card from "@/components/Card";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";

const WHY_CARDS = [
  {
    title: "Care for Your Surfaces",
    desc: "Pressure and products chosen to suit the surface and its condition.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12.2l2.2 2.2 4.8-4.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Premium Results",
    desc: "A finish that stands out instantly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.2 6.1 6.5.2-5.1 3.8 1.9 6.2L12 16.7 6.5 19.3 8.4 13 3.3 9.3l6.5-.2L12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Attention to Detail",
    desc: "Every job, every time.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M10.5 4.5h3l1.2 2.4 2.6.4-.8 2.6 1.8 2-1.8 2 .8 2.6-2.6.4-1.2 2.4h-3l-1.2-2.4-2.6-.4.8-2.6-1.8-2 1.8-2-.8-2.6 2.6-.4 1.2-2.4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.4 12.2l1.6 1.6 3.6-3.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Reliable & On Time",
    desc: "Clear communication and punctuality.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Gold Coast Local",
    desc: "Local exterior cleaning with straightforward communication.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 2l8 4v6c0 5.5-3.4 10-8 11.5C7.4 22 4 17.5 4 12V6l8-4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const SERVICES = [
  {
    title: "Driveway Pressure Cleaning",
    desc: "Lift built-up dirt and grime from concrete driveways.",
  },
  {
    title: "Footpaths & Walkways",
    desc: "Walkways, pavers and entryways — clean lines and a premium finish.",
  },
  {
    title: "Exterior House Soft Wash",
    desc: "Low-pressure washing for suitable exterior walls and surfaces.",
  },
];



export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden bg-np-black py-10 md:py-16">
        {/* Full-width background image */}
        <img
          src="/images/hero-image-web.webp"
          width="1280" height="853" fetchPriority="high"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <img
            src="/brand/hero-wordmark-web.png"
            alt="No Pressure Exterior Specialists"
            width="1400" height="229"
            className="mx-auto mb-6 h-auto w-[280px] max-w-full select-none object-contain sm:w-[420px] md:w-[500px]"
            draggable="false"
            loading="eager"
          />

          <div className="text-sm md:text-base text-np-muted font-medium mb-3">
            Gold Coast &amp; surrounding suburbs
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight md:leading-[1.1] text-white mb-4">
            Driveway Pressure Cleaning Gold Coast
          </h1>

          <p className="text-base md:text-xl text-white/90 max-w-xl">
            Make your home look a million bucks without spending a fortune.
          </p>

          <DrivewayOffer />

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/contact#quote" variant="gold" size="lg">
              Get a Free Quote
            </Button>
            <Button
              href="tel:0411076785"
              variant="outline"
              size="lg"
            >
              Call 0411 076 785
            </Button>
          </div>
          <p className="mt-5 text-sm text-white/80">Also cleaning footpaths, patios and suitable house exteriors. <a href="/services" className="underline text-np-gold">See all services</a></p>
          <a href="https://m.me/61588346376881" target="_blank" rel="noopener noreferrer" className="mt-2 min-h-11 inline-flex items-center text-sm text-white/80 underline">Prefer Messenger? Message us</a>
        </div>
      </section>

      <Section size="medium" className="border-b border-white/10 bg-np-black">
        <SectionHeading eyebrow="REAL WORK" title="A cleaner driveway. A better first impression." subtitle="Built-up grime can make a whole frontage look tired. Here’s a genuine No Pressure driveway clean." />
        <div className="mt-8"><DrivewayPhotos /></div>
      </Section>

      {/* WHY CHOOSE NO PRESSURE SECTION */}
      <Section size="medium" className="bg-np-black border-t border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide text-center mb-10">Why Choose No Pressure</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            {WHY_CARDS.map((card) => (
              <Card
                key={card.title}
                className="group relative overflow-hidden h-full p-8 min-h-[220px] flex flex-col items-center text-center bg-gradient-to-b from-white/7 via-white/4 to-np-black/85 border-white/10 rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.55)] transition-all duration-300 hover:shadow-[0_22px_75px_rgba(0,0,0,0.65)] hover:ring-1 hover:ring-np-gold/45 after:content-[''] after:absolute after:left-6 after:right-6 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-np-purple/55 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-np-gold">
                  {card.icon}
                </div>
                <div className="text-np-gold font-semibold text-lg mb-2 tracking-wide">{card.title}</div>
                <div className="text-white/75 text-sm font-medium leading-relaxed">{card.desc}</div>
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
                <Button href="/contact#quote" variant="flat" size="md" className="mt-6">Get a Free Quote</Button>
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
          <h2 className="text-xl md:text-2xl font-bold text-np-gold mb-3 tracking-wide">Ready to freshen up your place?</h2>
          <p className="text-np-muted text-base md:text-lg font-medium">
            Tell us what needs cleaning and your suburb. We’ll discuss the job and give you a clear quote.
          </p>
          <Button href="/contact#quote" size="lg" className="mt-6">Get a Free Quote</Button>
        </div>
      </Section>
    </>
  );
}
