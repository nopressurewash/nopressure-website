"use client";
import { TRACKING_ENABLED } from "@/lib/tracking";
export default function PrivacySettings() {
  if (!TRACKING_ENABLED) return null;
  return <button type="button" className="min-h-11 text-left text-white/80 hover:text-white" onClick={() => window.dispatchEvent(new Event("np:privacy-settings"))}>Cookie preferences</button>;
}
