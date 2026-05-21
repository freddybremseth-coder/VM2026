import { cn } from "@/lib/utils";

/**
 * Flag gradients for all WC26 nations. These are loose visual cues, not exact
 * heraldry — swap in real SVG flags from `/public/flags/` when available.
 */
const COUNTRY_HUE: Record<string, string> = {
  // Group A
  mx: "from-[#006847] via-white to-[#ce1126]",
  za: "from-[#007a4d] via-[#ffb612] to-[#de3831]",
  kr: "from-white to-[#0047a0]",
  cz: "from-white via-[#d7141a] to-[#11457e]",
  // Group B
  ca: "from-[#ff0000] via-white to-[#ff0000]",
  ba: "from-[#002395] to-[#fecb00]",
  qa: "from-white to-[#8a1538]",
  ch: "from-[#ff0000] to-[#ff0000]",
  // Group C
  br: "from-[#009c3b] to-[#ffdf00]",
  ma: "from-[#c1272d] to-[#006233]",
  ht: "from-[#00209f] to-[#d21034]",
  "gb-sct": "from-[#005eb8] to-[#005eb8]",
  // Group D
  us: "from-[#b22234] via-white to-[#3c3b6e]",
  py: "from-[#d52b1e] via-white to-[#0038a8]",
  au: "from-[#00008b] to-[#ff0000]",
  tr: "from-[#e30a17] to-[#e30a17]",
  // Group E
  de: "from-black via-[#dd0000] to-[#ffce00]",
  cw: "from-[#002b7f] via-[#f9e814] to-white",
  ci: "from-[#f77f00] via-white to-[#009e60]",
  ec: "from-[#ffdd00] via-[#034ea2] to-[#ed1c24]",
  // Group F
  nl: "from-[#ae1c28] via-white to-[#21468b]",
  jp: "from-white to-[#bc002d]",
  se: "from-[#006aa7] to-[#fecc00]",
  tn: "from-[#e70013] via-white to-[#e70013]",
  // Group G
  be: "from-black via-[#fdda24] to-[#ef3340]",
  eg: "from-[#ce1126] via-white to-black",
  ir: "from-[#239f40] via-white to-[#da0000]",
  nz: "from-[#012169] to-[#cf142b]",
  // Group H
  es: "from-[#aa151b] to-[#f1bf00]",
  cv: "from-[#003893] via-white to-[#cf2027]",
  sa: "from-[#006c35] to-[#006c35]",
  uy: "from-[#0038a8] via-white to-[#fcd116]",
  // Group I
  fr: "from-[#0055a4] via-white to-[#ef4135]",
  sn: "from-[#00853f] via-[#fdef42] to-[#e31b23]",
  iq: "from-[#ce1126] via-white to-black",
  no: "from-[#ef2b2d] to-[#002868]",
  // Group J
  ar: "from-[#74acdf] via-white to-[#74acdf]",
  dz: "from-[#006233] via-white to-[#d21034]",
  at: "from-[#ed2939] via-white to-[#ed2939]",
  jo: "from-black via-white to-[#007a3d]",
  // Group K
  pt: "from-[#006600] to-[#ff0000]",
  cd: "from-[#007fff] via-[#f7d618] to-[#ce1021]",
  uz: "from-[#0099b5] via-white to-[#1eb53a]",
  co: "from-[#fcd116] via-[#003893] to-[#ce1126]",
  // Group L
  "gb-eng": "from-white to-[#ce1126]",
  hr: "from-[#ff0000] via-white to-[#171796]",
  gh: "from-[#ce1126] via-[#fcd116] to-[#006b3f]",
  pa: "from-[#005aa7] via-white to-[#d21034]",
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
