"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const QUICK_ACTIONS = [
  { label: "Driveway Cleaning", service: "Driveway Pressure Cleaning" },
  { label: "Soft Washing", service: "Exterior House Soft Wash" },
  { label: "Exterior Walls", service: "Exterior House Soft Wash" },
  { label: "Get a Quote", service: "" },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("np-chat-teaser")) {
        setTeaserDismissed(true);
        return;
      }
    } catch {
      /* SSR / private browsing */
    }

    const timer = setTimeout(() => setShowTeaser(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
    setTeaserDismissed(true);
    try { sessionStorage.setItem("np-chat-teaser", "1"); } catch { /* noop */ }
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
    if (!teaserDismissed) dismissTeaser();
  }, [teaserDismissed, dismissTeaser]);

  const handleAction = useCallback(
    (service: string) => {
      setOpen(false);
      router.push(service ? `/contact?service=${encodeURIComponent(service)}` : "/contact");
    },
    [router],
  );

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* Teaser pill */}
      {showTeaser && !teaserDismissed && !open && (
        <div className="flex items-center gap-2 rounded-full bg-[#111] border border-white/10 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-[fadeSlideUp_0.4s_ease-out]">
          <span className="text-sm text-white/90 font-medium whitespace-nowrap">
            Need a quick quote? 👋
          </span>
          <button
            onClick={dismissTeaser}
            className="ml-1 text-white/40 hover:text-white/70 transition-colors text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Panel */}
      <div
        className={`
          w-[320px] sm:w-[340px] rounded-2xl border border-white/10
          bg-[#0c0c0c] shadow-[0_20px_60px_rgba(0,0,0,0.7)]
          overflow-hidden transition-all duration-300 origin-bottom-right
          ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-3 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-np-gold animate-pulse" />
              <span className="text-xs text-white/50 font-medium tracking-wider uppercase">
                No Pressure
              </span>
            </div>
            <button
              onClick={toggle}
              className="text-white/40 hover:text-white/70 transition-colors text-sm"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="rounded-xl bg-white/5 border border-white/5 px-4 py-3.5">
            <p className="text-sm text-white/90 leading-relaxed">
              Hey, welcome to No Pressure 👋
              <br />
              <span className="text-white/60">
                Need a quick quote? Tell us what you want cleaned.
              </span>
            </p>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleAction(action.service)}
                className={`
                  rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide
                  transition-all duration-200 text-center
                  ${
                    action.service === ""
                      ? "col-span-2 bg-np-gold text-black shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:brightness-110 hover:shadow-[0_6px_24px_rgba(212,175,55,0.4)]"
                      : "bg-white/5 border border-white/10 text-white/80 hover:border-np-gold/40 hover:text-np-gold hover:bg-np-gold/5"
                  }
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-np-purple/30 to-transparent" />
      </div>

      {/* Bubble button */}
      <button
        onClick={toggle}
        aria-label={open ? "Close quote assistant" : "Open quote assistant"}
        className={`
          group flex h-14 w-14 items-center justify-center rounded-full
          shadow-[0_6px_24px_rgba(212,175,55,0.3)]
          transition-all duration-300
          ${open
            ? "bg-[#111] border border-white/10 rotate-0"
            : "bg-np-gold hover:shadow-[0_8px_32px_rgba(212,175,55,0.45)] hover:scale-105"
          }
        `}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
