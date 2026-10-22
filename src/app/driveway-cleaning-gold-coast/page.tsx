import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import Container from "@/components/Container";
import DrivewayOffer from "@/components/DrivewayOffer";
import DrivewayPhotos from "@/components/DrivewayPhotos";
import QuoteForm from "@/components/QuoteForm";

const TITLE = "Driveway Cleaning Gold Coast from $169 | No Pressure";
const DESCRIPTION = "Concrete driveway pressure cleaning on the Gold Coast. Packages from $169, with pricing based on size, condition, access and treatment. Get a free quote.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/driveway-cleaning-gold-coast" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/driveway-cleaning-gold-coast",
  },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const CLEANING_DETAILS = [
  {
    title: "Concrete driveway cleaning",
    text: "Pressure cleaning to lift built-up surface dirt and grime from concrete driveways.",
  },
  {
    title: "Attention to problem areas",
    text: "Tell us about stains, mould or heavy build-up. We’ll discuss suitable treatment and what can reasonably be improved.",
  },
  {
    title: "Care for the surface",
    text: "Pressure and products chosen for the surface and its condition. Cleaning does not repair cracks or existing damage.",
  },
];

const STEPS = [
  ["Send the details", "Include your suburb and a short description of the driveway."],
  ["Get a clear quote", "We’ll get in touch to discuss the surface, access and work needed."],
  ["Arrange your clean", "Happy with the quote? We’ll agree on a time for the job."],
];

const FAQS = [
  {
    question: "Will my driveway cost $169?",
    answer: "Driveway cleaning packages start from $169. The final quote depends on size, condition, access and any treatment needed. We’ll confirm the work and price with you before booking.",
  },
  {
    question: "Can you remove every stain?",
    answer: "Results depend on the surface and its condition. Oil marks, rust, discolouration and other deep stains may remain. Cleaning does not repair cracks or surface damage. We’ll discuss what’s realistic for your driveway.",
  },
  {
    question: "Which areas do you service?",
    answer: "The Gold Coast and surrounding serviceable suburbs. Include your suburb in the enquiry so we can confirm availability for your property.",
  },
  {
    question: "Can you clean my paths or patio too?",
    answer: "Yes. Let us know about any footpaths, walkways or patios you’d like quoted along with the driveway. You can include those details in the same enquiry.",
  },
];

export default function DrivewayCleaningPage() {
  return (
    <>
      <div className="border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-np-black">
        <Container>
          <div className="grid min-w-0 gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14 lg:py-16">
            <section aria-labelledby="driveway-heading" className="min-w-0">
              <Image
                src="/brand/hero-wordmark-web.png"
                alt="No Pressure Exterior Specialists"
                width={1400}
                height={229}
                priority
                className="mb-8 h-auto w-[250px] max-w-full select-none sm:w-[300px]"
              />
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-np-gold">
                Gold Coast &amp; surrounds
              </p>
              <h1 id="driveway-heading" className="max-w-[16ch] text-balance text-[2rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                Driveway pressure cleaning.
              </h1>
              <p className="mt-4 text-base text-white/80 sm:text-lg">
                A fresh first impression.
              </p>
              <DrivewayOffer align="left" />
              <div className="flex max-w-xs flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
                <Button href="#quote" size="lg" className="min-h-12 text-base shadow-none">
                  Get a Free Quote
                </Button>
                <a href="tel:0411076785" className="inline-flex min-h-11 items-center justify-center text-base font-medium text-white/85 underline decoration-np-gold/60 underline-offset-4 hover:text-np-gold">
                  Call 0411 076 785
                </a>
              </div>
            </section>

            <section aria-labelledby="results-heading" className="min-w-0">
              <h2 id="results-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
                A real driveway clean.
              </h2>
              <p className="mb-6 mt-3 max-w-xl text-sm leading-relaxed text-white/75">
                Built-up grime removed from this concrete driveway. These are our original job photographs.
              </p>
              <DrivewayPhotos showLink={false} />
            </section>
          </div>
        </Container>
      </div>

      <Container>
        <section aria-labelledby="cleaning-heading" className="py-12 sm:py-16">
          <h2 id="cleaning-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A clean that suits your driveway.
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {CLEANING_DETAILS.map(({ title, text }) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/[0.03] p-6">
                <h3 className="font-semibold text-np-gold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/70">
            Any treatment needed is discussed as part of your quote. Have paths, a patio or a house exterior to clean too?{" "}
            <a href="/services" className="inline-flex min-h-11 items-center text-np-gold underline underline-offset-4 hover:text-white">
              See all cleaning services
            </a>.
          </p>
        </section>

        <section aria-labelledby="local-heading" className="border-t border-white/10 py-10 sm:py-12">
          <h2 id="local-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Local service. Straightforward communication.
          </h2>
          <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-white/80 sm:grid-cols-3">
            {[
              "Gold Coast exterior cleaning, with local availability confirmed for your suburb.",
              "Professional cleaning equipment, with pressure and treatment appropriate to the surface.",
              "A clear discussion of the job and price before you book.",
            ].map((reason) => (
              <li key={reason} className="border-l-2 border-np-purple pl-4">{reason}</li>
            ))}
          </ul>
        </section>

        <section id="quote" aria-labelledby="quote-heading" className="border-t border-white/10 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-np-gold">Free quote</p>
          <h2 id="quote-heading" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tell us about your driveway.
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/75">
            Include your suburb, a rough driveway size if you know it, and any stains or access issues.
          </p>
          <div className="mt-8 grid min-w-0 items-start gap-8 md:grid-cols-2 md:gap-10">
            <QuoteForm />
            <div className="min-w-0 rounded-3xl border border-white/10 p-7 md:p-9">
              <h3 className="text-xl font-semibold">How it works</h3>
              <ol className="mt-6 space-y-6">
                {STEPS.map(([title, text], index) => (
                  <li key={title} className="flex gap-4">
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-np-gold/10 text-sm font-semibold text-np-gold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="font-medium">Prefer a quick chat?</p>
                <a href="tel:0411076785" className="mt-2 inline-flex min-h-11 items-center text-lg font-semibold text-np-gold underline underline-offset-4 hover:text-white">
                  Call 0411 076 785
                </a>
                <a href="mailto:hi@nopressure.au" className="flex min-h-11 w-fit items-center text-sm text-white/80 underline underline-offset-4 hover:text-np-gold">
                  hi@nopressure.au
                </a>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-heading" className="border-t border-white/10 py-12 sm:py-16">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A few common questions.
          </h2>
          <div className="mt-6 divide-y divide-white/15">
            {FAQS.map(({ question, answer }) => (
              <details key={question} className="py-3">
                <summary className="min-h-11 cursor-pointer py-3 pr-3 font-medium text-np-gold">{question}</summary>
                <p className="max-w-3xl pb-3 pt-1 text-sm leading-relaxed text-white/75">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="ready-heading" className="border-t border-white/10 py-12 sm:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h2 id="ready-heading" className="text-2xl font-semibold tracking-tight">Let’s freshen up your driveway.</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <Button href="#quote" className="min-h-12 shadow-none">Get a Free Quote</Button>
              <a href="tel:0411076785" className="inline-flex min-h-11 items-center justify-center font-medium text-white/85 underline decoration-np-gold/60 underline-offset-4 hover:text-np-gold">
                Call 0411 076 785
              </a>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
