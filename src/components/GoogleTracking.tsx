"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { ADS_ID, CONSENT_KEY, GA_ID, TRACKING_ENABLED, clearAttribution, rememberAttribution, trackEvent } from "@/lib/tracking";

export default function GoogleTracking() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const lastPage = useRef("");

  useEffect(() => {
    if (!TRACKING_ENABLED) return;
    try { setConsent(localStorage.getItem(CONSENT_KEY)); } catch { /* Ask each visit if storage is unavailable. */ }
    setReady(true);
    const settings = () => setConsent(null);
    window.addEventListener("np:privacy-settings", settings);
    return () => window.removeEventListener("np:privacy-settings", settings);
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
    window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("js", new Date());
    for (const id of [GA_ID, ADS_ID].filter(Boolean)) window.gtag("config", id, { send_page_view: false, allow_google_signals: false, page_location: location.origin + location.pathname, page_referrer: "" });
    rememberAttribution();
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      const href = link?.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackEvent("phone_click", { contact_method: "phone" });
      else if (href.includes("#quote")) trackEvent("quote_cta_click");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [consent]);

  useEffect(() => {
    if (consent !== "granted" || lastPage.current === pathname) return;
    lastPage.current = pathname;
    trackEvent("page_view");
    if (pathname === "/contact") trackEvent("contact_page_view");
    if (pathname === "/driveway-cleaning-gold-coast") trackEvent("driveway_landing_view");
  }, [consent, pathname]);

  function choose(value: "granted" | "denied") {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Fail closed: hasConsent will keep tracking off. */ }
    setConsent(value);
    lastPage.current = "";
    if (value === "denied") {
      clearAttribution();
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0].trim();
        if (!/^(_ga|_gcl)/.test(name)) continue;
        for (const domain of ["", `;domain=${location.hostname}`, ";domain=.nopressure.au"]) document.cookie = `${name}=;max-age=0;path=/${domain}`;
      }
    }
  }

  if (!TRACKING_ENABLED || !ready) return null;
  return <>
    {consent === "granted" && <Script id="np-google-tag" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || ADS_ID}`} strategy="afterInteractive" />}
    {consent === null && <aside aria-label="Optional analytics" className="border-t border-np-gold/30 bg-np-black px-5 py-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm text-white/80">Allow optional Google cookies to help us understand visits and enquiries from our ads? You can request a quote either way. <a href="/privacy" className="text-np-gold underline">Privacy details</a></p>
        <div className="flex gap-3"><button type="button" className="min-h-11 rounded-full bg-np-gold px-5 font-semibold text-black" onClick={() => choose("granted")}>Allow</button><button type="button" className="min-h-11 rounded-full border border-white/30 px-5" onClick={() => choose("denied")}>Decline</button></div>
      </div>
    </aside>}
  </>;
}
