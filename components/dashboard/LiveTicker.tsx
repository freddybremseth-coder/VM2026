import Link from "next/link";
import { TeamFlag } from "@/components/shared/TeamFlag";
import type { MatchSummary } from "@/lib/types";

interface Props {
  matches: MatchSummary[];
}

export function LiveTicker({ matches }: Props) {
  const live = matches.filter((m) => m.status === "live" || m.status === "halftime");
  if (live.length === 0) return null;

  return (
    <div className="card-panel ring-1 ring-loss/20 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-pitch-700/60 bg-pitch-900/40">
        <span className="live-dot" />
        <span className="text-[10px] uppercase tracking-widest font-semibold text-loss">
          Live now
        </span>
        <span className="text-[10px] uppercase tracking-widest text-pitch-500">
          · {live.length} {live.length === 1 ? "match" : "matches"}
        </span>
      </div>
      <div className="flex overflow-x-auto scrollbar-thin">
        {live.map((m) => (
          <Link
            key={m.id}
            href={`/matches/${m.id}`}
            className="shrink-0 min-w-[260px] px-4 py-3 border-r border-pitch-700/60 last:border-r-0 hover:bg-pitch-800/50 transition-colors"
          >
            <div className="text-[10px] uppercase tracking-widest text-pitch-500 mb-1.5 flex items-center justify-between">
              <span>{m.stage}</span>
              <span className="text-loss font-semibold font-mono">
                {m.status === "halftime" ? "HT" : `${m.minute}'`}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TeamFlag code={m.home.flag} size="sm" />
                <span className="text-sm font-medium">{m.home.shortName}</span>
              </div>
              <div className="font-mono font-bold stat-num">
                {m.score?.home ?? 0}–{m.score?.away ?? 0}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{m.away.shortName}</span>
                <TeamFlag code={m.away.flag} size="sm" />
              </div>
            </div>
            {m.xg && (
              <div className="mt-2 text-[10px] font-mono text-pitch-500 stat-num flex justify-between">
                <span>xG {m.xg.home.toFixed(2)}</span>
                <span>xG {m.xg.away.toFixed(2)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
