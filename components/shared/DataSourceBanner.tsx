import { Info } from "lucide-react";

/**
 * Shown above any view that displays squad/player stats. Tells the user
 * exactly where the numbers came from and when they were last verified, so
 * inaccuracies are bounded ("source X said this on date Y") instead of
 * presented as live truth.
 */
export function DataSourceBanner({
  source = "oddsnet.com / official federation announcements",
  asOf = "21 May 2026",
  caveat,
}: {
  source?: string;
  asOf?: string;
  caveat?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-pitch-800/40 border border-pitch-700/60 px-4 py-2.5 text-[11px] text-pitch-400 leading-relaxed">
      <Info size={12} className="text-data-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-pitch-200">Data source:</span>{" "}
        {source} ·{" "}
        <span className="font-semibold text-pitch-200">last verified:</span> {asOf} CET.
        {caveat && <span className="block mt-1 text-pitch-500">{caveat}</span>}
      </div>
    </div>
  );
}
