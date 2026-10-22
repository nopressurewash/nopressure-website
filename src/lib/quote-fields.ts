// Shared field limits and service names keep the browser and server consistent.
export const QUOTE_SERVICES = [
  "Driveway Pressure Cleaning",
  "Footpaths & Walkways",
  "Exterior House Soft Wash",
  "Other",
] as const;

export const QUOTE_LIMITS = {
  name: 120,
  phone: 32,
  email: 254,
  suburb: 120,
  service: 80,
  message: 4000,
} as const;

export type QuoteFields = Record<keyof typeof QUOTE_LIMITS, string>;
