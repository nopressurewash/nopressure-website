import Link from "next/link";
import Container from "./Container";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <Container>
        <div className="py-10 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <Image
              src="/logos/logo-wordmark.png"
              alt="No Pressure – Exterior Specialists"
              width={220}
              height={44}
              className="w-full max-w-[280px] md:max-w-[220px] h-auto object-contain drop-shadow-[0_2px_12px_rgba(255,215,0,0.12)]"
              style={{ marginBottom: '0.5rem' }}
              priority
            />
            <div className="text-xs text-white/60 tracking-[0.25em] mb-2">
              EXTERIOR SPECIALISTS
            </div>
            <p className="text-sm text-white/70 mt-2 max-w-sm">
              Premium driveway, footpath and exterior cleaning. Gold Coast, Australia.
            </p>
          </div>

          <div className="text-sm">
            <div className="text-white/60 mb-3">Quick Links</div>
            <div className="flex flex-col gap-2">
              <Link href="/services" className="text-white/80 hover:text-white">Services</Link>
              <Link href="/gallery" className="text-white/80 hover:text-white">Gallery</Link>
              <Link href="/contact" className="text-white/80 hover:text-white">Contact / Quote</Link>
            </div>
          </div>

          <div className="text-sm">
            <div className="text-white/60 mb-3">Contact</div>
            <div className="flex flex-col gap-2 text-white/80">
              <a className="hover:text-white" href="tel:0411076785">0411 076 785</a>
              <a className="hover:text-white" href="mailto:hi@nopressure.au">hi@nopressure.au</a>
              <a className="hover:text-white" href="https://nopressure.au">nopressure.au</a>
            </div>
          </div>
        </div>

        <div className="py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} No Pressure. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
