import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import QuoteForm from "@/components/QuoteForm";

export default function ContactPage() {
  return (
    <Container>
      <div id="quote" className="py-14 md:py-18">
        <SectionHeading
          eyebrow="CONTACT"
          title="Get a Free Quote"
          subtitle="Send through a few details and we'll get back to you fast. For the quickest quote, include your suburb and what needs cleaning."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <QuoteForm />

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
                Gold Coast &amp; surrounding suburbs.
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                <div className="text-white font-semibold tracking-wide mb-4">What Happens Next</div>
                <ol className="space-y-3">
                  {[
                    "Send your request",
                    "We review the details",
                    "You receive your quote",
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
