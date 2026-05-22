import { Trophy } from "lucide-react";
import { getH2H } from "@/lib/historical-h2h";
import type { WCTeam } from "@/lib/wc26-data";

interface Props {
  home: WCTeam;
  away: WCTeam;
}

/**
 * Head-to-head card. Shows total meetings + the W/D/L split + last 3 results.
 * Honest when there's no curated history (rather than faking numbers).
 */
export function HeadToHeadCard({ home, away }: Props) {
  const h2h = getH2H(home.id, away.id);

  return (
    <div className="card-panel p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-pitch-300 font-semibold mb-3">
        <Trophy size={14} className="text-draw" />
        Head-to-head
      </div>

      {!h2h || h2h.total === 0 ? (
        <div className="text-xs text-pitch-500 italic leading-relaxed">
          Limited or no recorded meetings between {home.name} and {away.name}.
          First competitive fixture in years for these two.
        </div>
      ) : (
        <>
          <div className="text-sm text-pitch-200 mb-3 leading-relaxed">
            <span className="font-semibold">{h2h.total}</span>{" "}
            recorded meetings.
          </div>

          {/* W/D/L bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-2 bg-pitch-900">
            <div
              className="bg-accent-500"
              style={{ width: `${(h2h.teamAWins / h2h.total) * 100}%` }}
              title={`${home.name} ${h2h.teamAWins} wins`}
            />
            <div
              className="bg-pitch-600"
              style={{ width: `${(h2h.draws / h2h.total) * 100}%` }}
              title={`${h2h.draws} draws`}
            />
            <div
              className="bg-data-500"
              style={{ width: `${(h2h.teamBWins / h2h.total) * 100}%` }}
              title={`${away.name} ${h2h.teamBWins} wins`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-accent-300">{home.shortName} {h2h.teamAWins}W</span>
            <span className="text-pitch-400">{h2h.draws} draws</span>
            <span className="text-data-300">{h2h.teamBWins}W {away.shortName}</span>
          </div>

          {h2h.recent.length > 0 && (
            <div className="mt-4 pt-3 border-t border-pitch-700/60">
              <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono mb-2">
                Recent meetings
              </div>
              <ul className="space-y-1.5">
                {h2h.recent.slice(0, 3).map((r, i) => (
                  <li key={i} className="text-xs text-pitch-300 flex items-center gap-2">
                    <span className="font-mono text-pitch-500 w-20 shrink-0">
                      {r.date}
                    </span>
                    <span className="flex-1 truncate">{r.result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
