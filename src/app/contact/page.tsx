import Button from "@/components/Button";
import { pageMetadata } from "@/lib/business";
export const metadata = pageMetadata("Free Cleaning Quote | No Pressure Gold Coast", "Request a free driveway, patio, footpath or house soft washing quote on the Gold Coast. Call 0411 076 785 or send your job details.", "/contact");
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import QuoteForm from "@/components/QuoteForm";

export default function ContactPage() {
  return (
    <Container>
      <div id="quote" className="py-14 md:py-18">
        <SectionHeading
          as="h1"
          eyebrow="CONTACT"
          title="Get a Free Quote"
          subtitle="Send through a few details and we'll get back to you fast. For the quickest quote, include your suburb and what needs cleaning."
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button href="tel:0411076785" variant="outline">Call 0411 076 785</Button><a href="mailto:hi@nopressure.au" className="inline-flex min-h-11 items-center justify-center text-np-gold underline">Email hi@nopressure.au</a></div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <QuoteForm />

          <div className="rounded-3xl border border-white/10 bg-[var(--np-black)] p-7 md:p-9">
            <div className="text-white/60 text-sm tracking-widest">DIRECT</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
              Prefer to call?
            </h2>

            <div className="mt-5 space-y-3 text-white/80">
              <a className="flex min-h-11 items-center hover:text-white" href="tel:0411076785">
                0411 076 785
              </a>
              <a className="flex min-h-11 items-center hover:text-white" href="mailto:hi@nopressure.au">
                hi@nopressure.au
              </a>
              <div className="text-white/60 text-sm pt-2">
                Gold Coast &amp; surrounding suburbs.
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/75">Want to show us the area? Email your photos to hi@nopressure.au with your name and suburb. This form does not accept attachments.</p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                <div className="text-white font-semibold tracking-wide mb-4">What Happens Next</div>
                <ol className="space-y-3">
                  {[
                    "Send your request",
                    "We review the details",
                    "We discuss the job and confirm your quote",
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
