
import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleTracking from "@/components/GoogleTracking";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "No Pressure Exterior Specialists | Gold Coast",
  description: "Premium exterior cleaning across the Gold Coast. No Pressure Exterior Specialists deliver professional driveway cleaning, pressure washing, soft washing and exterior surface restoration with high-end equipment and attention to detail.",
  metadataBase: new URL("https://nopressure.au"),
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
  other: { "theme-color": "#000000" },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon180x180.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    title: "No Pressure Exterior Specialists | Gold Coast",
    description: "Premium exterior cleaning across the Gold Coast. No Pressure Exterior Specialists deliver professional driveway cleaning, pressure washing, soft washing and exterior surface restoration with high-end equipment and attention to detail.",
    type: "website",
    locale: "en_AU",
    url: "https://nopressure.au",
    siteName: "No Pressure",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Pressure Exterior Specialists | Gold Coast",
    description: "Premium exterior cleaning across the Gold Coast. No Pressure Exterior Specialists deliver professional driveway cleaning, pressure washing, soft washing and exterior surface restoration with high-end equipment and attention to detail.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className="bg-np-black text-white antialiased">
      <body className="min-h-screen flex flex-col font-sans bg-np-black">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${BUSINESS.url}/#business`, name: BUSINESS.name, url: BUSINESS.url, telephone: "+61411076785", email: BUSINESS.email, logo: `${BUSINESS.url}/brand/hero-wordmark-web.png`, areaServed: { "@type": "City", name: "Gold Coast" } }).replace(/</g, "\\u003c") }} />
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col outline-none">{children}</main>
        <SiteFooter />
        <GoogleTracking />
      </body>
    </html>
  );
}
