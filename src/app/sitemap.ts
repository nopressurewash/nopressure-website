import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/driveway-cleaning-gold-coast", "/services", "/gallery", "/contact", "/privacy"].map((path) => ({ url: `https://nopressure.au${path}` }));
}
