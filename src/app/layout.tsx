
import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "No Pressure | Exterior Specialists",
  description: "Premium driveway, footpath & exterior cleaning. Gold Coast, Australia.",
  metadataBase: new URL("https://nopressure.au"),
  openGraph: {
    title: "No Pressure | Exterior Specialists",
    description: "Premium driveway, footpath & exterior cleaning. Gold Coast, Australia.",
    type: "website",
    locale: "en_AU",
    url: "https://nopressure.au",
    siteName: "No Pressure",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Pressure | Exterior Specialists",
    description: "Premium driveway, footpath & exterior cleaning. Gold Coast, Australia.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-np-black text-white antialiased">
      <body className="min-h-screen flex flex-col font-sans bg-np-black">
        <SiteHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
