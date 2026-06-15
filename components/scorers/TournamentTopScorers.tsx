/**
 * Full-bleed top-scorers table for /scorers. Differentiates from the
 * dashboard widget by:
 *   - showing ALL rows (caller passes the slice they want)
 *   - including a penalty column with explicit "(P)" markers
 *   - inline rank deltas via tie-bucket numbering (1, 1, 3, 4...)
 */

import Link from "next/link";
import { HoloFlag } from "@/components/shared/HoloFlag";
import type { TournamentScorer } from "@/lib/tournament-scorers";

interface Props {
  scorers: TournamentScorer[];
}

export function TournamentTopScorers({ scorers }: Props) {
  // Build tie-aware rank numbers: same goals + penalties → same rank.
  const ranks: number[] = [];
  let lastKey: string | null = null;
  let lastRank = 0;
  scorers.forEach((s, i) => {
    const key = `${s.goals}|${s.penalties}`;
    if (key !== lastKey) {
      lastRank = i + 1;
      lastKey = key;
    }
    ranks.push(lastRank);
  });

  return (
    <div className="surface overflow-hidden">
      <div className="grid grid-cols-[2.5rem_2rem_1fr_5rem_4rem] sm:grid-cols-[3rem_2rem_1fr_8rem_5rem_5rem] gap-3 px-4 py-3 border-b border-cream/8 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
        <span className="text-right">#</span>
        <span></span>
        <span>Spiller</span>
        <span className="hidden sm:block">Lag</span>
        <span className="text-right">Pen</span>
        <span className="text-right">Mål</span>
      </div>
      <ol className="divide-y divide-cream/6">
        {scorers.map((s, i) => (
          <li
            key={s.scorerPlayerId ?? `${s.teamId}-${s.scorerName}`}
            className="grid grid-cols-[2.5rem_2rem_1fr_5rem_4rem] sm:grid-cols-[3rem_2rem_1fr_8rem_5rem_5rem] gap-3 px-4 py-3 items-center hover:bg-cream/3 transition-colors"
          >
            <span
              className={`font-serif text-base text-right stat-num ${
                ranks[i] <= 3 ? "text-amber font-bold" : "text-cream/55"
              }`}
            >
              {ranks[i]}
            </span>
            <Link
              href={`/teams/${s.teamId}`}
              title={s.teamName}
              className="shrink-0 hover:opacity-80 transition-opacity"
            >
              {s.teamFlag && <HoloFlag code={s.teamFlag} w={22} radius={2} />}
            </Link>
            {s.scorerPlayerId ? (
              <Link
                href={`/players/${s.scorerPlayerId}`}
                className="font-serif text-sm sm:text-base tracking-editorial truncate hover:text-amber transition-colors"
              >
                {s.scorerName}
              </Link>
            ) : (
              <span className="font-serif text-sm sm:text-base tracking-editorial truncate text-cream">
                {s.scorerName}
              </span>
            )}
            <span className="hidden sm:block text-[10px] uppercase tracking-kicker font-mono text-cream/55 truncate">
              {s.teamName}
            </span>
            <span className="font-mono text-[11px] text-right text-cream/55 stat-num">
              {s.penalties > 0 ? s.penalties : "—"}
            </span>
            <span className="font-mono font-bold text-lg sm:text-xl text-right stat-num text-signal">
              {s.goals}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
