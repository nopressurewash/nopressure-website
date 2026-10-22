import type { Metadata } from "next";

export const BUSINESS = {
  name: "No Pressure Exterior Specialists", url: "https://nopressure.au",
  phone: "0411 076 785", telephone: "tel:0411076785", email: "hi@nopressure.au",
};
export const SERVICES = ["Driveway Pressure Cleaning", "Concrete Surface Cleaning", "Footpaths & Walkways", "Patios & Outdoor Areas", "Exterior House Soft Wash", "Other"] as const;
export const PRICE_NOTE = "Starting price only. Your quote depends on size, condition, access and any treatment needed.";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, locale: "en_AU", type: "website", siteName: BUSINESS.name },
    twitter: { card: "summary_large_image", title, description } };
}
