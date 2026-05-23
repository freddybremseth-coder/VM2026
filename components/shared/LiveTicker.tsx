"use client";

import { useEffect, useState } from "react";

/**
 * Broadcast-style live ticker. Sits above the dashboard hero. Marquee
 * loops content (duplicated inline so the seam is invisible) only when
 * there's actually a live match. Hides itself when `items` is empty so
 * the design stays calm during pre-tournament.
 *
 * Items are typed (`LIVE` / `xG` / `NEXT` / `TIP` / `INJ`) which sets
 * the prefix pill color and gives screen-readers some signal.
 *
 * Source of items: call /api/live-ticker (route to be added) that
 * aggregates live match deltas, top-tip stats, breaking news. For
 * the initial pass, you can hard-code a few items based on live
 * fixtures from FIXTURES.
 */

type TickerKind = "LIVE" | "xG" | "NEXT" | "TIP" | "INJ";
export interface TickerItem {
  kind: TickerKind;
  text: string;
  href?: string;
}

interface Props {
  items?: TickerItem[];
}

const KIND_COLOR: Record<TickerKind, string> = {
  LIVE: "text-signal border-signal",
  xG:   "text-amber border-amber",
  NEXT: "text-cream/70 border-cream/30",
  TIP:  "text-amber border-amber",
  INJ:  "text-cream/70 border-cream/30",
};

export function LiveTicker({ items }: Props) {
  // Hydration: keep ticker hidden until mounted so SSR/CSR match exactly
  // (the animation is purely visual; SSR users see a static frame).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!items || items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="relative h-8 overflow-hidden flex items-center bg-signal/8 border-b border-cream/8">
      {/* LIVE pill, sticky-left */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-[3] flex items-center gap-1.5 bg-signal text-cream rounded-sm px-2 py-[3px] text-[9px] font-extrabold tracking-[1.4px]">
        <span className="live-dot h-1 w-1" />
        LIVE
      </div>
      {/* Fades */}
      <div className="absolute left-16 top-0 bottom-0 w-8 z-[2] bg-gradient-to-r from-canvas to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-10 z-[2] bg-gradient-to-l from-canvas to-transparent" />

      <div
        className={mounted ? "flex whitespace-nowrap pl-24 gap-[30px] animate-marquee" : "flex whitespace-nowrap pl-24 gap-[30px]"}
        style={{ willChange: "transform" }}
      >
        {doubled.map((it, i) => (
          <span key={i} className="text-[11.5px] font-medium text-cream">
            <span className={`mr-1.5 px-1.5 py-[1.5px] border rounded-[2px] text-[9px] font-bold tracking-[1px] ${KIND_COLOR[it.kind]}`}>
              {it.kind}
            </span>
            {it.text}
          </span>
        ))}
      </div>
    </div>
  );
}
