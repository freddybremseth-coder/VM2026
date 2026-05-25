/**
 * Shared building blocks for the /share Open Graph images.
 *
 * Everything here is edge-safe (no Node APIs) so the opengraph-image routes
 * can stay on the edge runtime. Centralises the editorial palette, real flag
 * rendering (flagcdn PNGs — not the old 2-colour gradient rectangles), and
 * the Fraunces serif used across the app so the share cards finally match
 * the brand instead of the retired CHATGENIUS purple/cyan look.
 */

import type { ReactElement } from "react";

// ─── Editorial palette (kept in sync with tailwind.config.ts) ──────────────
export const OG = {
  canvas: "#0E0C0B",
  paper: "#15110F",
  paperHi: "#1B1612",
  cream: "#F4EFE3",
  creamDim: "rgba(244,239,227,0.55)",
  creamFaint: "rgba(244,239,227,0.35)",
  signal: "#E63946",
  signalDeep: "#9D1B26",
  amber: "#FFB72E",
  hairline: "rgba(244,239,227,0.10)",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Warm editorial page background with a soft signal glow top-left.
 *
 * NB: Satori (the engine behind next/og) only supports the `circle`/`ellipse
 * at <position>` form of radial-gradient — the explicit two-length size form
 * (`900px 500px at …`) throws "Missing comma before color stops".
 */
export const OG_BG =
  "radial-gradient(circle at 15% 0%, rgba(230,57,70,0.20) 0%, transparent 55%), linear-gradient(160deg, #15110F 0%, #0E0C0B 72%)";

/** Real national flag (320px PNG). flagcdn covers gb-eng / gb-sct etc. */
export function flagUrl(code: string): string {
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}

/**
 * Load the Fraunces serif used for the app's display type. Resilient: if the
 * fetch fails we return null and the caller renders with the built-in font
 * rather than throwing (a missing font must never 500 the image).
 *
 * Google Fonts returns a TTF (Satori-compatible) when no modern UA hints at
 * woff2 support, so we parse the truetype src out of the CSS.
 */
export async function loadFraunces(
  weight: 600 | 700 = 600,
): Promise<{ name: string; data: ArrayBuffer; weight: 600 | 700; style: "normal" }[]> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,${weight}&display=swap`,
    ).then((r) => r.text());
    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/);
    if (!match) return [];
    const data = await fetch(match[1]).then((r) => r.arrayBuffer());
    return [{ name: "Fraunces", data, weight, style: "normal" }];
  } catch {
    return [];
  }
}

// ─── Reusable elements ─────────────────────────────────────────────────────

/** "26" mark + wordmark, used top-left on every card. */
export function BrandMark({ tagline = "VM 2026" }: { tagline?: string }): ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 44,
          height: 44,
          background: OG.signal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: OG.cream,
          fontWeight: 700,
          fontSize: 22,
          fontFamily: "Fraunces",
        }}
      >
        26
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: OG.cream, fontFamily: "Fraunces", letterSpacing: 1 }}>
          {tagline}
        </span>
        <span style={{ fontSize: 13, color: OG.creamDim, letterSpacing: 3, textTransform: "uppercase" }}>
          Stats · Predictions
        </span>
      </div>
    </div>
  );
}

/** A real flag rendered as a framed block. */
export function FlagBlock({
  code,
  w = 150,
  h = 96,
}: {
  code: string | undefined;
  w?: number;
  h?: number;
}): ReactElement {
  if (!code) {
    return (
      <div
        style={{
          width: w,
          height: h,
          background: OG.paperHi,
          border: `1px solid ${OG.hairline}`,
          display: "flex",
        }}
      />
    );
  }
  return (
    <img
      src={flagUrl(code)}
      width={w}
      height={h}
      style={{
        width: w,
        height: h,
        objectFit: "cover",
        border: "1px solid rgba(244,239,227,0.18)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
      }}
    />
  );
}

/** Bottom strip: left note + the canonical URL on the right. */
export function Footer({ note, url = "vm2026.chatgenius.pro" }: { note: string; url?: string }): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 19,
        color: OG.creamFaint,
        borderTop: `1px solid ${OG.hairline}`,
        paddingTop: 22,
      }}
    >
      <span>{note}</span>
      <span style={{ color: OG.amber, fontWeight: 700 }}>{url}</span>
    </div>
  );
}
