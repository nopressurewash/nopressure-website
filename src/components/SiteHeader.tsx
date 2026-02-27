
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-np-black/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        {/* Logo: wordmark on desktop, icon on mobile */}
        <Link href="/" className="flex items-center" aria-label="No Pressure Home">
          <span className="block md:hidden">
            <Image src="/logos/logo-icon.png" alt="No Pressure Logo" width={40} height={40} priority />
          </span>
          <span className="hidden md:block">
            <Image src="/logos/logo-wordmark.png" alt="No Pressure Wordmark" width={170} height={40} priority />
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-np-gold transition-colors text-base font-medium px-2 py-1 rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <Button
            href="/contact"
            variant="gold"
            size="md"
            className="hidden md:inline-flex shadow-none"
          >
            Get a Free Quote
          </Button>
        </div>
      </div>
    </header>
  );
}
