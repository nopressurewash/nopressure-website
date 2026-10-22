"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import SocialLinks from "./SocialLinks";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const isDrivewayLandingPage = usePathname() === "/driveway-cleaning-gold-coast";
  const quoteHref = isDrivewayLandingPage ? "#quote" : "/contact#quote";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isMenuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setIsMenuOpen(false); menuButton.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-np-black/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 py-3 flex items-center justify-between gap-3 min-h-[72px]">
        {/* Logo: wordmark on desktop, icon on mobile */}
        <Link
          href="/"
          prefetch={isDrivewayLandingPage ? false : undefined}
          className="flex items-center"
          aria-label="No Pressure Home"
          onClick={handleLinkClick}
        >
          <img
            src="/brand/navbar-logo.svg"
            alt="No Pressure Exterior Specialists"
            className="h-[30px] md:h-[40px] w-auto object-contain select-none"
            draggable="false"
            loading="eager"
            width="40" height="40"
          />
        </Link>

        {/* Navigation (desktop) */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2 lg:gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-np-gold transition-colors text-base font-medium px-3 py-1 rounded tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button + Mobile toggle */}
        <div className="flex items-center gap-2">
          <SocialLinks className="hidden lg:flex" size="sm" />
          <a href="tel:0411076785" className="md:hidden inline-flex min-h-11 items-center rounded-full border border-np-gold/50 px-3 text-sm font-semibold text-np-gold" aria-label="Call 0411 076 785">Call</a>
          <a href={quoteHref} onClick={handleLinkClick} className="md:hidden inline-flex min-h-11 items-center rounded-full bg-np-gold px-3 text-sm font-semibold text-black">Free quote</a>
          <Button
            href={quoteHref}
            variant="gold"
            size="md"
            className="hidden md:inline-flex shadow-none"
          >
            Get a Free Quote
          </Button>

          {/* Mobile menu button */}
          <button
            ref={menuButton}
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-sm p-2 text-white/80 hover:text-np-gold hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-np-gold focus-visible:ring-offset-2 focus-visible:ring-offset-np-black transition-colors"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="relative block h-[18px] w-[22px]">
              <span className="absolute left-0 top-0 h-[2px] w-full bg-white" />
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white" />
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-white" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        hidden={!isMenuOpen}
        className={clsx(
          "md:hidden border-t border-white/10 bg-np-black/95 backdrop-blur-sm transition-[max-height,opacity] duration-200 ease-out overflow-hidden",
          isMenuOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        )}
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="w-full rounded-md px-3 py-3 text-base font-medium tracking-wide text-white hover:text-np-gold hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-np-gold focus-visible:ring-offset-2 focus-visible:ring-offset-np-black transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <SocialLinks
            className="mt-3 justify-center gap-1"
            size="md"
            onLinkClick={handleLinkClick}
          />

          <Button
            href={quoteHref}
            variant="gold"
            size="lg"
            className="mt-2 w-full justify-center"
            onClick={handleLinkClick}
          >
            Get a Free Quote
          </Button>
        </div>
      </div>
    </header>
  );
}
