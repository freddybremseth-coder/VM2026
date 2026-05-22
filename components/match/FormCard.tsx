import { Activity } from "lucide-react";
import { getRecentForm, type Result } from "@/lib/recent-form";
import type { WCTeam } from "@/lib/wc26-data";

interface Props {
  home: WCTeam;
  away: WCTeam;
}

/**
 * Two team rows. Each row shows the team's most recent 5 results as
 * colour-coded W/D/L pills (newest right-most, like ESPN/FotMob).
 * If the team has no curated form data yet we say so honestly.
 */
export function FormCard({ home, away }: Props) {
  return (
    <div className="card-panel p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-pitch-300 font-semibold mb-3">
        <Activity size={14} className="text-data-400" />
        Last 5 matches
      </div>
      <div className="space-y-2.5">
        <TeamFormRow team={home} />
        <TeamFormRow team={away} />
      </div>
      <div className="mt-3 pt-3 border-t border-pitch-700/60 text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
        Source: official UEFA / CONCACAF / AFC / CONMEBOL — May 2026
      </div>
    </div>
  );
}

function TeamFormRow({ team }: { team: WCTeam }) {
  const form = getRecentForm(team.id);
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 text-[11px] uppercase tracking-widest text-pitch-300 font-mono">
        {team.shortName}
      </div>
      {form.length === 0 ? (
        <span className="text-[11px] text-pitch-500 italic">
          Form not loaded yet for {team.name}.
        </span>
      ) : (
        <div className="flex gap-1 flex-1">
          {form.slice(0, 5).reverse().map((entry, i) => (
            <ResultPill key={`${entry.date}-${i}`} result={entry.result} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResultPill({
  result,
  entry,
}: {
  result: Result;
  entry: ReturnType<typeof getRecentForm>[number];
}) {
  const tone = {
    W: "bg-win/20 text-win ring-win/40",
    D: "bg-draw/15 text-draw ring-draw/40",
    L: "bg-loss/15 text-loss ring-loss/40",
  }[result];

  return (
    <span
      title={`${entry.scoreFor}–${entry.scoreAgainst} vs ${entry.opponent} · ${entry.competition} · ${entry.date}`}
      className={`h-7 w-7 inline-flex items-center justify-center rounded-md text-[11px] font-bold font-mono ring-1 ${tone}`}
    >
      {result}
    </span>
  );
}
