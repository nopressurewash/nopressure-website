export const CONSENT_KEY = "np-google-consent";
const ATTRIBUTION_KEY = "np-ad-attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"];
export const GA_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID || "") ? process.env.NEXT_PUBLIC_GA4_ID : "";
export const ADS_ID = /^AW-\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "") ? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID : "";
export const TRACKING_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ENABLED === "true" && Boolean(GA_ID || ADS_ID);
type Gtag = (...args: unknown[]) => void;
declare global { interface Window { dataLayer?: unknown[]; gtag?: Gtag } }

export function hasConsent() {
  try { return TRACKING_ENABLED && localStorage.getItem(CONSENT_KEY) === "granted"; } catch { return false; }
}
export function rememberAttribution() {
  if (!hasConsent()) return;
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const params = new URLSearchParams(location.search);
    const attribution: Record<string, string> = { landing_page: location.pathname };
    for (const key of PARAMS) {
      const value = params.get(key);
      if (value && value.length <= 200 && !/[\r\n\u0000]/.test(value)) attribution[key] = value;
    }
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch { /* Storage is optional; enquiries still work. */ }
}
export function getAttribution(): Record<string, string> {
  if (!hasConsent()) return {};
  try { return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}"); } catch { return {}; }
}
export function trackEvent(event: string, params: Record<string, string> = {}) {
  if (hasConsent()) window.gtag?.("event", event, { ...params, page_location: location.origin + location.pathname, page_path: location.pathname, page_referrer: "" });
}
export function trackQuoteAccepted(requestId: string) {
  if (!hasConsent()) return;
  // Resend request ID is a transaction key, never an email, phone or message.
  try {
    const key = `np-lead-${requestId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch { /* In-flight guards still prevent double firing in this form. */ }
  trackEvent("generate_lead", { transaction_id: requestId, lead_type: "quote_request" });
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_QUOTE_LABEL;
  if (ADS_ID && label && /^[A-Za-z0-9_-]+$/.test(label)) trackEvent("conversion", { send_to: `${ADS_ID}/${label}`, transaction_id: requestId });
}
export function clearAttribution() {
  try { sessionStorage.removeItem(ATTRIBUTION_KEY); } catch { /* Optional storage. */ }
}
