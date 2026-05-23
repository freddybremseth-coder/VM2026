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
  // … add remaining 32 nations following the same pattern.
  // See `mockup/shared.jsx` in the design package for the full set.
};
