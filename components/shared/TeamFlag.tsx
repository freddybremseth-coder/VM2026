import { cn } from "@/lib/utils";

/**
 * Flag gradients for all WC26 nations. These are loose visual cues, not exact
 * heraldry — swap in real SVG flags from `/public/flags/` when available.
 */
const COUNTRY_HUE: Record<string, string> = {
  // Group A
  mx: "from-[#006847] via-white to-[#ce1126]",
  pl: "from-white to-[#dc143c]",
  kr: "from-white to-[#0047a0]",
  ar: "from-[#74acdf] via-white to-[#74acdf]",
  // Group B
  ca: "from-[#ff0000] via-white to-[#ff0000]",
  de: "from-black via-[#dd0000] to-[#ffce00]",
  jp: "from-white to-[#bc002d]",
  sn: "from-[#00853f] via-[#fdef42] to-[#e31b23]",
  // Group C
  us: "from-[#b22234] via-white to-[#3c3b6e]",
  ch: "from-[#ff0000] to-[#ff0000]",
  ir: "from-[#239f40] via-white to-[#da0000]",
  ma: "from-[#c1272d] to-[#006233]",
  // Group D
  br: "from-[#009c3b] to-[#ffdf00]",
  fr: "from-[#0055a4] via-white to-[#ef4135]",
  au: "from-[#00008b] to-[#ff0000]",
  eg: "from-[#ce1126] via-white to-black",
  // Group E
  cr: "from-[#002b7f] via-white to-[#ce1126]",
  pt: "from-[#006600] to-[#ff0000]",
  sa: "from-[#006c35] to-[#006c35]",
  dz: "from-[#006233] via-white to-[#d21034]",
  // Group F
  no: "from-[#ef2b2d] to-[#002868]",
  es: "from-[#aa151b] to-[#f1bf00]",
  uy: "from-[#0038a8] via-white to-[#fcd116]",
  tn: "from-[#e70013] via-white to-[#e70013]",
  // Group G
  pa: "from-[#005aa7] via-white to-[#d21034]",
  nl: "from-[#ae1c28] via-white to-[#21468b]",
  iq: "from-[#ce1126] via-white to-black",
  gh: "from-[#ce1126] via-[#fcd116] to-[#006b3f]",
  // Group H
  jm: "from-[#009b3a] via-black to-[#fed100]",
  "gb-eng": "from-white to-[#ce1126]",
  uz: "from-[#0099b5] via-white to-[#1eb53a]",
  ci: "from-[#f77f00] via-white to-[#009e60]",
  // Group I
  ec: "from-[#ffdd00] via-[#034ea2] to-[#ed1c24]",
  it: "from-[#009246] via-white to-[#ce2b37]",
  jo: "from-black via-white to-[#007a3d]",
  cm: "from-[#007a5e] via-[#ce1126] to-[#fcd116]",
  // Group J
  co: "from-[#fcd116] via-[#003893] to-[#ce1126]",
  be: "from-black via-[#fdda24] to-[#ef3340]",
  nz: "from-[#012169] to-[#cf142b]",
  ng: "from-[#008753] via-white to-[#008753]",
  // Group K
  hn: "from-[#0073cf] via-white to-[#0073cf]",
  hr: "from-[#ff0000] via-white to-[#171796]",
  py: "from-[#d52b1e] via-white to-[#0038a8]",
  ml: "from-[#14b53a] via-[#fcd116] to-[#ce1126]",
  // Group L
  tr: "from-[#e30a17] to-[#e30a17]",
  dk: "from-[#c8102e] to-[#c8102e]",
  qa: "from-white to-[#8a1538]",
  za: "from-[#007a4d] via-[#ffb612] to-[#de3831]",
};

interface Props {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TeamFlag({ code, size = "md", className }: Props) {
  const gradient = COUNTRY_HUE[code] ?? "from-pitch-600 to-pitch-700";
  const dimensions = {
    sm: "h-4 w-6",
    md: "h-6 w-9",
    lg: "h-8 w-12",
  }[size];

  return (
    <span
      aria-label={`${code} flag`}
      className={cn(
        "inline-block rounded-sm bg-gradient-to-br ring-1 ring-pitch-900/40 shadow-sm",
        gradient,
        dimensions,
        className,
      )}
    />
  );
}
