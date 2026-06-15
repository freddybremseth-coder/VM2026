/**
 * Shared lineup card — one team's formation + starting XI + bench.
 * Used by both the Tactics tab (inline next to stats) and the Lineups tab
 * (standalone, larger). Source is ESPN summary's `rosters` block,
 * normalised in espn-match-info.ts.
 */

import { Shirt } from "lucide-react";
import type { MatchInfoSideStats } from "@/lib/match-events/espn-match-info";

interface Props {
  side: MatchInfoSideStats;
  teamName: string;
  /** When true, headings get the larger Lineups-tab treatment. */
  prominent?: boolean;
}

export function LineupCard({ side, teamName, prominent = false }: Props) {
  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-3 justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Shirt size={prominent ? 14 : 12} className="text-signal shrink-0" />
          <h3
            className={
              prominent
                ? "font-serif text-lg font-semibold tracking-editorial truncate"
                : "font-serif text-sm font-semibold tracking-editorial truncate"
            }
          >
            {teamName}
          </h3>
        </div>
        {side.formation && (
          <span
            className={
              prominent
                ? "font-mono text-sm font-bold uppercase tracking-kicker text-amber stat-num shrink-0"
                : "font-mono text-[10px] uppercase tracking-kicker text-cream/55 stat-num shrink-0"
            }
          >
            {side.formation}
          </span>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/45 mb-2">
        Startoppstilling
      </div>
      <ul className="space-y-1 mb-4">
        {side.starters.map((p) => (
          <PlayerRow key={p.espnId} player={p} />
        ))}
        {side.starters.length === 0 && (
          <li className="text-[10px] text-cream/45 italic">
            Ikke publisert ennå
          </li>
        )}
      </ul>

      {side.bench.length > 0 && (
        <>
          <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/45 mb-2">
            Innbyttere
          </div>
          <ul className="space-y-1">
            {side.bench.map((p) => (
              <PlayerRow key={p.espnId} player={p} muted />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function PlayerRow({
  player,
  muted = false,
}: {
  player: { jersey: string | null; name: string };
  muted?: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-3 text-sm ${
        muted ? "text-cream/55" : "text-cream"
      }`}
    >
      <span className="font-mono text-[11px] stat-num w-5 text-right text-cream/45 shrink-0">
        {player.jersey ?? "—"}
      </span>
      <span className="font-serif tracking-editorial truncate">{player.name}</span>
    </li>
  );
}
