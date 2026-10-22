import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: process.env.VERCEL_ENV === "preview" ? undefined : "/", disallow: process.env.VERCEL_ENV === "preview" ? "/" : "/api/" }, sitemap: "https://nopressure.au/sitemap.xml", host: "https://nopressure.au" };
}
