"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before cleaning",
  afterAlt = "After cleaning",
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(pct, 2), 98));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const handler = () => { dragging.current = false; };
    window.addEventListener("pointerup", handler);
    return () => window.removeEventListener("pointerup", handler);
  }, []);

  const placeholderBefore = (
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black flex items-center justify-center">
      <span className="text-white/20 text-sm font-medium">Before image</span>
    </div>
  );

  const placeholderAfter = (
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 flex items-center justify-center">
      <span className="text-white/20 text-sm font-medium">After image</span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 select-none touch-none cursor-col-resize"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* After layer (full, behind) */}
      {afterSrc ? (
        <img
          src={afterSrc}
          alt={afterAlt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />
      ) : (
        placeholderAfter
      )}

      {/* Before layer (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {beforeSrc ? (
          <img
            src={beforeSrc}
            alt={beforeAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ width: `${containerRef.current?.offsetWidth ?? 9999}px`, maxWidth: "none" }}
            draggable="false"
          />
        ) : (
          placeholderBefore
        )}
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 z-10"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
        style={{ left: `${position}%` }}
      >
        <div className="h-10 w-10 rounded-full bg-np-gold shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M8 6l-4 6 4 6" />
            <path d="M16 6l4 6-4 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span
        className="absolute top-3 left-3 z-10 rounded-full bg-black/60 border border-white/10 px-3 py-1 text-[11px] font-semibold text-white/70 tracking-wider uppercase backdrop-blur-sm pointer-events-none"
        style={{ opacity: position > 12 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-3 right-3 z-10 rounded-full bg-black/60 border border-white/10 px-3 py-1 text-[11px] font-semibold text-np-gold/80 tracking-wider uppercase backdrop-blur-sm pointer-events-none"
        style={{ opacity: position < 88 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
