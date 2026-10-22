import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import DrivewayOffer from "@/components/DrivewayOffer";
import DrivewayPhotos from "@/components/DrivewayPhotos";
import QuoteForm from "@/components/QuoteForm";
import { BUSINESS, pageMetadata } from "@/lib/business";

export const metadata = pageMetadata("Driveway Cleaning Gold Coast | From $169 | No Pressure", "Concrete driveway pressure cleaning on the Gold Coast. Packages from $169, genuine before and after photos and free quotes. Call 0411 076 785.", "/driveway-cleaning-gold-coast");
const FAQS = [
  ["Will my driveway cost $169?", "Driveway cleaning packages start from $169. The final quote depends on the size, condition, access and treatment needed. Send us a few details so we can quote your job."],
  ["Can you remove every stain?", "Built-up surface dirt and grime can often be cleaned away. Oil marks, rust, discolouration and other deep stains may remain. Existing cracks and surface damage are not repaired by cleaning. We’ll discuss what’s realistic for your driveway."],
  ["Which areas do you service?", "We service the Gold Coast and surrounding serviceable suburbs. Include your suburb when asking for a quote so we can confirm availability."],
  ["Do I need to know the exact size?", "A rough size or description is a useful start. We can discuss any extra details needed before confirming the quote. You can also email photos to hi@nopressure.au."],
  ["Do you clean patios and house exteriors too?", "Yes — we also clean footpaths, patios and suitable exterior house surfaces. House soft washing uses a lower-pressure approach where appropriate. We do not currently offer roof cleaning."],
];
const serviceSchema = { "@context": "https://schema.org", "@type": "Service", name: "Driveway pressure cleaning", serviceType: "Concrete driveway cleaning", areaServed: { "@type": "City", name: "Gold Coast" }, provider: { "@id": `${BUSINESS.url}/#business` }, url: `${BUSINESS.url}/driveway-cleaning-gold-coast` };

export default function DrivewayPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
    <section className="relative overflow-hidden border-b border-white/10 bg-np-black py-10 md:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-np-purple/10 via-transparent to-np-gold/5" />
      <Container><div className="relative max-w-3xl">
        <img src="/brand/hero-wordmark-web.png" alt="No Pressure Exterior Specialists" width="1400" height="229" className="mb-7 h-auto w-[280px] max-w-full sm:w-[380px]" />
        <p className="mb-3 text-sm font-medium text-np-gold">Gold Coast &amp; surrounding suburbs</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">Driveway Pressure Cleaning Gold Coast</h1>
        <p className="mt-4 text-lg text-white/85">Make your home look a million bucks without spending a fortune.</p>
        <DrivewayOffer />
        <div className="flex flex-col gap-3 sm:flex-row"><Button href="#quote" size="lg">Get a Free Quote</Button><Button href="tel:0411076785" variant="outline" size="lg">Call 0411 076 785</Button></div>
      </div></Container>
    </section>
    <Container>
      <section className="py-12 md:py-16" aria-labelledby="real-results"><h2 id="real-results" className="text-2xl font-bold md:text-3xl">Real driveway. Real cleaning results.</h2><p className="mb-7 mt-3 max-w-2xl leading-relaxed text-white/80">This concrete driveway had a build-up of surface grime. Here it is before and after our clean, with the existing cracks and surrounding surfaces still visible.</p><DrivewayPhotos showLink={false} /></section>
      <section className="border-t border-white/10 py-12" aria-labelledby="cleaning-details"><h2 id="cleaning-details" className="text-2xl font-bold md:text-3xl">A proper clean, suited to your driveway</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">{[
          ["Concrete driveway cleaning", "Pressure cleaning to lift built-up surface dirt and grime from concrete driveways."],
          ["Attention to problem areas", "Tell us about stains, mould or other build-up. We’ll discuss suitable treatments and what can reasonably be improved."],
          ["A clear quote first", "We consider the surface, size, condition and access, then confirm the work and price with you."],
        ].map(([title, text]) => <div key={title} className="rounded-2xl border border-np-gold/30 bg-white/5 p-6"><h3 className="font-semibold text-np-gold">{title}</h3><p className="mt-3 leading-relaxed text-white/80">{text}</p></div>)}</div>
        <p className="mt-5 text-sm text-white/70">Treatments depend on the surface and the job. Permanent stains, wear and cracks may remain.</p>
      </section>
      <section className="border-t border-white/10 py-12"><h2 className="text-2xl font-bold md:text-3xl">Local service. Straightforward communication.</h2><ul className="mt-5 grid gap-4 text-white/80 sm:grid-cols-2"><li>Gold Coast exterior cleaning</li><li>Professional cleaning equipment</li><li>Pressure and care appropriate to the surface</li><li>Clear discussion of the job and price</li></ul></section>
      <section id="quote" className="scroll-mt-24 border-t border-white/10 py-12 md:py-16">
        <SectionHeading eyebrow="LET’S GET IT CLEAN" title="Get a free driveway cleaning quote" subtitle="Tell us your suburb and a little about your driveway. We’ll review the details, discuss what’s needed and confirm a quote before booking." />
        <div className="mt-7 grid gap-7 md:grid-cols-2"><QuoteForm /><div className="rounded-3xl border border-white/10 p-6 md:p-9"><h3 className="text-xl font-bold">Prefer a quick chat?</h3><Button href="tel:0411076785" variant="outline" className="mt-5">Call 0411 076 785</Button><ol className="mt-7 list-decimal space-y-4 pl-5 text-white/80"><li>Send your suburb and job details.</li><li>We discuss the work and confirm the quote.</li><li>Agree on a time that suits.</li></ol><p className="mt-7 text-sm leading-relaxed text-white/70">Have photos? Email them to <a href="mailto:hi@nopressure.au" className="text-np-gold underline">hi@nopressure.au</a> with your name and suburb.</p></div></div>
      </section>
      <section className="border-t border-white/10 py-12"><h2 className="text-2xl font-bold md:text-3xl">A few common questions</h2><div className="mt-6 divide-y divide-white/15">{FAQS.map(([question, answer]) => <details key={question} className="py-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-np-gold">{question}</summary><p className="max-w-3xl pb-2 pt-3 leading-relaxed text-white/80">{answer}</p></details>)}</div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button href="#quote">Get a Free Quote</Button><Button href="/services" variant="flat">See our other cleaning services</Button></div></section>
    </Container>
  </>;
}
