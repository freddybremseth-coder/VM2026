import { cn } from "@/lib/utils";

/**
 * Holographic flag — VM2026 signature element.
 *
 * Renders a real flag-art SVG underneath three layered overlays:
 *  · base flag artwork (correct stripes/crosses/emblems per country)
 *  · oil-slick conic gradient with mix-blend-mode: color-dodge
 *  · diagonal pearl shimmer band with mix-blend-mode: overlay
 *  · inset highlight + outer rim for depth
 *
 * The effect reads as: "this is a real flag, but it's printed on
 * holographic foil — like a Pokémon card."
 *
 * `shimmer="animated"` adds a roving white band — reserve for LIVE
 * matches and the user's followed team so motion stays meaningful.
 *
 * Each country needs an entry in FLAG_ART below. Falling back to a
 * grey gradient if a code is missing — log + add the missing code.
 */

interface Props {
  code: string;
  /** Width in px (3:2 aspect ratio is enforced). Default 36. */
  w?: number;
  /** `low` | `medium` | `strong` | `animated`. Default `medium`. */
  shimmer?: "low" | "medium" | "strong" | "animated";
  /** Border radius in px. Default 4. */
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function HoloFlag({
  code,
  w = 36,
  shimmer = "medium",
  radius = 4,
  className,
  style,
}: Props) {
  const art = FLAG_ART[code] ?? FLAG_ART._fallback;
  const h = w * (40 / 60);
  const id = `flag-${code}-${w}`;
  const intensity = { low: 0.35, medium: 0.6, strong: 0.85, animated: 0.7 }[shimmer];

  return (
    <span
      aria-label={`${code} flag`}
      className={cn(
        "holo-flag inline-block relative overflow-hidden",
        shimmer === "animated" && "holo-anim",
        className,
      )}
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        boxShadow:
          "0 0 0 .5px rgba(255,255,255,.18), 0 1px 2px rgba(0,0,0,.3), 0 4px 14px rgba(0,0,0,.18)",
        ...style,
      }}
    >
      {/* base flag */}
      <svg
        viewBox="0 0 60 40"
        width={w}
        height={h}
        preserveAspectRatio="none"
        style={{ display: "block", position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={id}>
            <rect width="60" height="40" rx={radius * 60 / w} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id})`}>{art}</g>
      </svg>
      {/* duochrome oil-slick overlay */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `conic-gradient(from 210deg at 50% 50%,
            rgba(255,90,200,${intensity * 0.55}) 0%,
            rgba(100,180,255,${intensity * 0.4}) 18%,
            rgba(180,255,200,${intensity * 0.35}) 38%,
            rgba(255,210,120,${intensity * 0.45}) 60%,
            rgba(230,120,255,${intensity * 0.5}) 82%,
            rgba(255,90,200,${intensity * 0.55}) 100%)`,
          mixBlendMode: "color-dodge",
          pointerEvents: "none",
        }}
      />
      {/* diagonal pearl shimmer */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(115deg,
            transparent 30%,
            rgba(255,255,255,${intensity * 0.35}) 47%,
            rgba(255,255,255,${intensity * 0.55}) 50%,
            rgba(255,255,255,${intensity * 0.35}) 53%,
            transparent 70%)`,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
      {/* inner highlight + outer rim */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,.35),
            inset 0 -1px 0 rgba(0,0,0,.2),
            inset 1px 0 0 rgba(255,255,255,.12),
            inset -1px 0 0 rgba(0,0,0,.15)
          `,
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Flag art library
// ─────────────────────────────────────────────────────────────
// Coordinates fit a 60×40 viewBox (3:2). Add entries for the
// remaining WC26 nations following the existing pattern.

const FLAG_ART: Record<string, React.ReactNode> = {
  _fallback: (
    <g>
      <rect width="60" height="40" fill="#3F3F46" />
      <rect width="60" height="40" fill="url(#nofill)" />
    </g>
  ),

  no: (
    <g>
      <rect width="60" height="40" fill="#BA0C2F" />
      <rect x="16" width="8" height="40" fill="#fff" />
      <rect y="16" width="60" height="8" fill="#fff" />
      <rect x="18" width="4" height="40" fill="#00205B" />
      <rect y="18" width="60" height="4" fill="#00205B" />
    </g>
  ),
  es: (
    <g>
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
      <rect x="11" y="16" width="6" height="8" fill="#AA151B" opacity=".85" />
    </g>
  ),
  br: (
    <g>
      <rect width="60" height="40" fill="#009C3B" />
      <polygon points="30,5 56,20 30,35 4,20" fill="#FFDF00" />
      <circle cx="30" cy="20" r="7" fill="#002776" />
      <path d="M22 19 Q30 16 38 19" stroke="#fff" strokeWidth="1.2" fill="none" />
    </g>
  ),
  fr: (
    <g>
      <rect width="20" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </g>
  ),
  de: (
    <g>
      <rect width="60" height="13.3" fill="#000" />
      <rect y="13.3" width="60" height="13.3" fill="#DD0000" />
      <rect y="26.6" width="60" height="13.4" fill="#FFCE00" />
    </g>
  ),
  nl: (
    <g>
      <rect width="60" height="13.3" fill="#AE1C28" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#21468B" />
    </g>
  ),
  ar: (
    <g>
      <rect width="60" height="13.3" fill="#74ACDF" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#74ACDF" />
      <circle cx="30" cy="20" r="3" fill="#F6B40E" />
    </g>
  ),
  pt: (
    <g>
      <rect width="24" height="40" fill="#006600" />
      <rect x="24" width="36" height="40" fill="#FF0000" />
      <circle cx="24" cy="20" r="5" fill="#FFE100" stroke="#000" strokeWidth=".6" />
    </g>
  ),
  hr: (
    <g>
      <rect width="60" height="13.3" fill="#FF0000" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#171796" />
      <rect x="26" y="11" width="8" height="9" fill="#FF0000" stroke="#fff" strokeWidth=".5" />
    </g>
  ),
  "gb-eng": (
    <g>
      <rect width="60" height="40" fill="#fff" />
      <rect x="27" width="6" height="40" fill="#CE1126" />
      <rect y="17" width="60" height="6" fill="#CE1126" />
    </g>
  ),
  us: (
    <g>
      <rect width="60" height="40" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 40) / 13} width="60" height={40 / 13} fill="#B22234" />
      ))}
      <rect width="26" height="22" fill="#3C3B6E" />
    </g>
  ),
  mx: (
    <g>
      <rect width="20" height="40" fill="#006847" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#CE1126" />
      <circle cx="30" cy="20" r="4" fill="none" stroke="#5D2914" strokeWidth=".8" />
    </g>
  ),
  ca: (
    <g>
      <rect width="15" height="40" fill="#FF0000" />
      <rect x="15" width="30" height="40" fill="#fff" />
      <rect x="45" width="15" height="40" fill="#FF0000" />
      <path
        d="M30 11 L32 17 L38 16 L34 21 L38 26 L32 24 L30 30 L28 24 L22 26 L26 21 L22 16 L28 17 Z"
        fill="#FF0000"
      />
    </g>
  ),
  sn: (
    <g>
      <rect width="20" height="40" fill="#00853F" />
      <rect x="20" width="20" height="40" fill="#FDEF42" />
      <rect x="40" width="20" height="40" fill="#E31B23" />
      <path d="M30 17 L31 20 L34 20 L31.5 22 L32.5 25 L30 23 L27.5 25 L28.5 22 L26 20 L29 20 Z" fill="#00853F"/>
    </g>
  ),
  ma: (
    <g>
      <rect width="60" height="40" fill="#C1272D" />
      <path
        d="M30 14 L31.5 18 L36 18 L32 21 L33.5 25 L30 22.5 L26.5 25 L28 21 L24 18 L28.5 18 Z"
        fill="none" stroke="#006233" strokeWidth="1"
      />
    </g>
  ),
  co: (
    <g>
      <rect width="60" height="20" fill="#FCD116" />
      <rect y="20" width="60" height="10" fill="#003893" />
      <rect y="30" width="60" height="10" fill="#CE1126" />
    </g>
  ),
  at: (
    <g>
      <rect width="60" height="13.3" fill="#ED2939" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#ED2939" />
    </g>
  ),
  au: (
    <g>
      <rect width="60" height="40" fill="#00247D" />
      <rect width="26" height="20" fill="#012169" />
      <path d="M0 0 L26 20 M26 0 L0 20" stroke="#fff" strokeWidth="2" />
      <path d="M13 0 V20 M0 10 H26" stroke="#fff" strokeWidth="3" />
      <path d="M13 0 V20 M0 10 H26" stroke="#C8102E" strokeWidth="1.2" />
      <circle cx="13" cy="32" r="1.6" fill="#fff" />
      <circle cx="44" cy="10" r="1.4" fill="#fff" />
      <circle cx="50" cy="18" r="1.4" fill="#fff" />
      <circle cx="46" cy="26" r="1.4" fill="#fff" />
      <circle cx="52" cy="30" r="1" fill="#fff" />
      <circle cx="42" cy="32" r="1.2" fill="#fff" />
    </g>
  ),
  ba: (
    <g>
      <rect width="60" height="40" fill="#002395" />
      <polygon points="15,0 60,0 60,40" fill="#FECB00" />
      <g fill="#fff">
        <rect x="13" y="2" width="2" height="2" transform="rotate(45 14 3)" />
        <rect x="20" y="7" width="2" height="2" transform="rotate(45 21 8)" />
        <rect x="27" y="12" width="2" height="2" transform="rotate(45 28 13)" />
        <rect x="34" y="17" width="2" height="2" transform="rotate(45 35 18)" />
        <rect x="41" y="22" width="2" height="2" transform="rotate(45 42 23)" />
        <rect x="48" y="27" width="2" height="2" transform="rotate(45 49 28)" />
        <rect x="55" y="32" width="2" height="2" transform="rotate(45 56 33)" />
      </g>
    </g>
  ),
  be: (
    <g>
      <rect width="20" height="40" fill="#000" />
      <rect x="20" width="20" height="40" fill="#FAE042" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </g>
  ),
  cd: (
    <g>
      <rect width="60" height="40" fill="#007FFF" />
      <polygon points="0,28 60,4 60,12 0,36" fill="#F7D618" />
      <polygon points="0,28 60,4 60,12 0,36" stroke="#CE1021" strokeWidth="1" fill="#F7D618" />
      <path d="M9 6 L10 9 L13 9 L10.5 11 L11.5 14 L9 12 L6.5 14 L7.5 11 L5 9 L8 9 Z" fill="#F7D618" />
    </g>
  ),
  ch: (
    <g>
      <rect width="60" height="40" fill="#DA291C" />
      <rect x="20" width="20" height="40" fill="#DA291C" />
      <rect x="26" y="12" width="8" height="16" fill="#fff" />
      <rect x="22" y="16" width="16" height="8" fill="#fff" />
    </g>
  ),
  ci: (
    <g>
      <rect width="20" height="40" fill="#F77F00" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#009E60" />
    </g>
  ),
  cv: (
    <g>
      <rect width="60" height="40" fill="#003893" />
      <rect y="15" width="60" height="12" fill="#fff" />
      <rect y="19" width="60" height="4" fill="#CF2027" />
      <circle cx="18" cy="21" r="1.2" fill="#F7D116" />
      <circle cx="22" cy="18" r="1.2" fill="#F7D116" />
      <circle cx="22" cy="24" r="1.2" fill="#F7D116" />
      <circle cx="26" cy="15" r="1.2" fill="#F7D116" />
      <circle cx="26" cy="27" r="1.2" fill="#F7D116" />
    </g>
  ),
  cw: (
    <g>
      <rect width="60" height="40" fill="#002B7F" />
      <rect y="26" width="60" height="5" fill="#F9E814" />
      <polygon points="10,8 11,11 14,11 11.5,13 12.5,16 10,14 7.5,16 8.5,13 6,11 9,11" fill="#fff" />
      <polygon points="18,14 18.7,16 20.7,16 19.1,17.3 19.7,19.2 18,18 16.3,19.2 16.9,17.3 15.3,16 17.3,16" fill="#fff" />
    </g>
  ),
  cz: (
    <g>
      <rect width="60" height="20" fill="#fff" />
      <rect y="20" width="60" height="20" fill="#D7141A" />
      <polygon points="0,0 30,20 0,40" fill="#11457E" />
    </g>
  ),
  dz: (
    <g>
      <rect width="30" height="40" fill="#006233" />
      <rect x="30" width="30" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="7" fill="#D21034" />
      <circle cx="32" cy="20" r="6" fill="#fff" />
      <polygon points="32,16 33,19 36,19 33.5,21 34.5,24 32,22 29.5,24 30.5,21 28,19 31,19" fill="#D21034" />
    </g>
  ),
  ec: (
    <g>
      <rect width="60" height="20" fill="#FFDD00" />
      <rect y="20" width="60" height="10" fill="#034EA2" />
      <rect y="30" width="60" height="10" fill="#ED1C24" />
      <circle cx="30" cy="20" r="3" fill="#034EA2" opacity=".7" />
    </g>
  ),
  eg: (
    <g>
      <rect width="60" height="13.3" fill="#CE1126" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#000" />
      <circle cx="30" cy="20" r="2.5" fill="#C09300" />
    </g>
  ),
  "gb-sct": (
    <g>
      <rect width="60" height="40" fill="#0065BD" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="5" />
    </g>
  ),
  gh: (
    <g>
      <rect width="60" height="13.3" fill="#CE1126" />
      <rect y="13.3" width="60" height="13.3" fill="#FCD116" />
      <rect y="26.6" width="60" height="13.4" fill="#006B3F" />
      <polygon points="30,16 31.5,20 35.5,20 32.2,22.5 33.5,26.5 30,24 26.5,26.5 27.8,22.5 24.5,20 28.5,20" fill="#000" />
    </g>
  ),
  ht: (
    <g>
      <rect width="60" height="20" fill="#00209F" />
      <rect y="20" width="60" height="20" fill="#D21034" />
      <rect x="24" y="14" width="12" height="12" fill="#fff" />
      <rect x="27" y="17" width="6" height="6" fill="#00209F" opacity=".7" />
    </g>
  ),
  iq: (
    <g>
      <rect width="60" height="13.3" fill="#CE1126" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#000" />
      <rect x="22" y="18" width="16" height="4" fill="#007A3D" />
    </g>
  ),
  ir: (
    <g>
      <rect width="60" height="13.3" fill="#239F40" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#DA0000" />
      <circle cx="30" cy="20" r="2.5" fill="#DA0000" />
    </g>
  ),
  jo: (
    <g>
      <rect width="60" height="13.3" fill="#000" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#007A3D" />
      <polygon points="0,0 24,20 0,40" fill="#CE1126" />
      <polygon points="8,18 8.6,19.6 10.3,19.6 8.9,20.6 9.4,22.2 8,21.2 6.6,22.2 7.1,20.6 5.7,19.6 7.4,19.6" fill="#fff" />
    </g>
  ),
  jp: (
    <g>
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="12" fill="#BC002D" />
    </g>
  ),
  kr: (
    <g>
      <rect width="60" height="40" fill="#fff" />
      <circle cx="30" cy="20" r="8" fill="#CD2E3A" />
      <path d="M22 20 A4 4 0 0 1 30 20 A4 4 0 0 0 38 20" fill="#0047A0" stroke="none" />
      <path d="M22 20 A4 4 0 0 1 30 20 A4 4 0 0 0 38 20 A8 8 0 0 0 22 20 Z" fill="#0047A0" />
      <rect x="6" y="8" width="6" height="1.2" fill="#000" />
      <rect x="6" y="10.5" width="6" height="1.2" fill="#000" />
      <rect x="6" y="13" width="6" height="1.2" fill="#000" />
      <rect x="48" y="8" width="6" height="1.2" fill="#000" />
      <rect x="48" y="10.5" width="6" height="1.2" fill="#000" />
      <rect x="48" y="13" width="6" height="1.2" fill="#000" />
      <rect x="6" y="26" width="6" height="1.2" fill="#000" />
      <rect x="6" y="28.5" width="6" height="1.2" fill="#000" />
      <rect x="6" y="31" width="6" height="1.2" fill="#000" />
      <rect x="48" y="26" width="6" height="1.2" fill="#000" />
      <rect x="48" y="28.5" width="6" height="1.2" fill="#000" />
      <rect x="48" y="31" width="6" height="1.2" fill="#000" />
    </g>
  ),
  nz: (
    <g>
      <rect width="60" height="40" fill="#00247D" />
      <rect width="26" height="20" fill="#012169" />
      <path d="M0 0 L26 20 M26 0 L0 20" stroke="#fff" strokeWidth="2" />
      <path d="M13 0 V20 M0 10 H26" stroke="#fff" strokeWidth="3" />
      <path d="M13 0 V20 M0 10 H26" stroke="#C8102E" strokeWidth="1.2" />
      <polygon points="44,12 44.6,13.6 46.3,13.6 44.9,14.6 45.4,16.2 44,15.2 42.6,16.2 43.1,14.6 41.7,13.6 43.4,13.6" fill="#CC142B" stroke="#fff" strokeWidth=".4" />
      <polygon points="50,20 50.6,21.6 52.3,21.6 50.9,22.6 51.4,24.2 50,23.2 48.6,24.2 49.1,22.6 47.7,21.6 49.4,21.6" fill="#CC142B" stroke="#fff" strokeWidth=".4" />
      <polygon points="46,28 46.6,29.6 48.3,29.6 46.9,30.6 47.4,32.2 46,31.2 44.6,32.2 45.1,30.6 43.7,29.6 45.4,29.6" fill="#CC142B" stroke="#fff" strokeWidth=".4" />
      <polygon points="53,32 53.5,33.3 54.9,33.3 53.7,34.1 54.2,35.5 53,34.7 51.8,35.5 52.3,34.1 51.1,33.3 52.5,33.3" fill="#CC142B" stroke="#fff" strokeWidth=".4" />
    </g>
  ),
  pa: (
    <g>
      <rect width="60" height="40" fill="#fff" />
      <rect x="30" width="30" height="20" fill="#D21034" />
      <rect y="20" width="30" height="20" fill="#005AA7" />
      <polygon points="15,5 16,9 20,9 17,11.5 18,15.5 15,13 12,15.5 13,11.5 10,9 14,9" fill="#005AA7" />
      <polygon points="45,25 46,29 50,29 47,31.5 48,35.5 45,33 42,35.5 43,31.5 40,29 44,29" fill="#D21034" />
    </g>
  ),
  py: (
    <g>
      <rect width="60" height="13.3" fill="#D52B1E" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#0038A8" />
      <circle cx="30" cy="20" r="2.5" fill="none" stroke="#FFCE00" strokeWidth=".8" />
      <circle cx="30" cy="20" r="1.2" fill="#FFCE00" />
    </g>
  ),
  qa: (
    <g>
      <rect width="60" height="40" fill="#8A1538" />
      <polygon points="0,0 17,0 14,3.6 17,7.2 14,10.7 17,14.3 14,17.9 17,21.4 14,25 17,28.6 14,32.1 17,35.7 14,39.3 17,40 0,40" fill="#fff" />
    </g>
  ),
  sa: (
    <g>
      <rect width="60" height="40" fill="#006C35" />
      <rect x="10" y="22" width="40" height="2" fill="#fff" />
      <rect x="12" y="14" width="4" height="2" fill="#fff" />
      <rect x="18" y="14" width="4" height="2" fill="#fff" />
      <rect x="24" y="14" width="4" height="2" fill="#fff" />
      <rect x="30" y="14" width="4" height="2" fill="#fff" />
      <rect x="36" y="14" width="4" height="2" fill="#fff" />
      <rect x="42" y="14" width="4" height="2" fill="#fff" />
    </g>
  ),
  se: (
    <g>
      <rect width="60" height="40" fill="#006AA7" />
      <rect x="18" width="6" height="40" fill="#FECC02" />
      <rect y="17" width="60" height="6" fill="#FECC02" />
    </g>
  ),
  tn: (
    <g>
      <rect width="60" height="40" fill="#E70013" />
      <circle cx="30" cy="20" r="10" fill="#fff" />
      <circle cx="32" cy="20" r="7" fill="#E70013" />
      <circle cx="33" cy="20" r="6" fill="#fff" />
      <polygon points="33,16 33.8,18.4 36.3,18.4 34.2,19.9 35,22.3 33,20.8 31,22.3 31.8,19.9 29.7,18.4 32.2,18.4" fill="#E70013" />
    </g>
  ),
  tr: (
    <g>
      <rect width="60" height="40" fill="#E30A17" />
      <circle cx="25" cy="20" r="8" fill="#fff" />
      <circle cx="27" cy="20" r="6.4" fill="#E30A17" />
      <polygon points="34,20 35,22.5 37.6,22.5 35.5,24.1 36.3,26.6 34,25 31.7,26.6 32.5,24.1 30.4,22.5 33,22.5" fill="#fff" />
    </g>
  ),
  uy: (
    <g>
      <rect width="60" height="40" fill="#fff" />
      <rect y="4.4" width="60" height="4.4" fill="#0038A8" />
      <rect y="13.3" width="60" height="4.4" fill="#0038A8" />
      <rect y="22.2" width="60" height="4.4" fill="#0038A8" />
      <rect y="31.1" width="60" height="4.4" fill="#0038A8" />
      <rect width="24" height="22" fill="#fff" />
      <circle cx="12" cy="11" r="4" fill="#FCD116" />
    </g>
  ),
  uz: (
    <g>
      <rect width="60" height="13.3" fill="#1EB53A" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#0099B5" />
      <rect y="12.7" width="60" height=".8" fill="#CE1126" />
      <rect y="26" width="60" height=".8" fill="#CE1126" />
      <rect width="60" height="13.3" fill="#0099B5" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <rect y="12.7" width="60" height=".8" fill="#CE1126" />
      <rect y="26" width="60" height=".8" fill="#CE1126" />
      <rect y="26.6" width="60" height="13.4" fill="#1EB53A" />
      <circle cx="12" cy="7" r="3" fill="#fff" />
      <circle cx="13.5" cy="7" r="2.5" fill="#0099B5" />
      <polygon points="18,5 18.5,6.2 19.8,6.2 18.7,7 19.1,8.2 18,7.5 16.9,8.2 17.3,7 16.2,6.2 17.5,6.2" fill="#fff" />
      <polygon points="22,8 22.5,9.2 23.8,9.2 22.7,10 23.1,11.2 22,10.5 20.9,11.2 21.3,10 20.2,9.2 21.5,9.2" fill="#fff" />
    </g>
  ),
  za: (
    <g>
      <rect width="60" height="20" fill="#DE3831" />
      <rect y="20" width="60" height="20" fill="#002395" />
      <polygon points="0,0 24,20 0,40" fill="#000" />
      <polygon points="0,4 20,20 0,36" fill="#FFB81C" />
      <polygon points="0,8 16,20 0,32" fill="#007749" />
      <polygon points="0,8 16,20 0,32 60,32 60,8 18,20" fill="#007749" />
      <polygon points="0,12 12,20 0,28 60,28 60,12 12,20" fill="#fff" />
      <polygon points="0,14 10,20 0,26 60,26 60,14 10,20" fill="#007749" />
    </g>
  ),
  // … add remaining 32 nations following the same pattern.
  // See `mockup/shared.jsx` in the design package for the full set.
};
