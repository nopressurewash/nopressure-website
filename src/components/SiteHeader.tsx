import Link from "next/link";
import BrandMark from "./BrandMark";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-white/80 hover:text-white transition text-sm tracking-wide"
  >
    {children}
  </Link>
);

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--np-black)]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
        <BrandMark />

        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:0411076785"
            className="hidden sm:inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 hover:text-white hover:border-white/30 transition"
          >
            Call 0411 076 785
          </a>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-np-gold px-4 py-2 text-sm font-semibold text-black hover:brightness-110 transition"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
