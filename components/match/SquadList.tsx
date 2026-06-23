import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/wc26-squads";

interface Props {
  startingXI: Player[];
  bench: Player[];
  side: "home" | "away";
  teamShortName: string;
}

const POSITION_ORDER: Player["position"][] = [
  "GK", "RB", "CB", "LB", "DM", "CM", "AM", "RW", "LW", "ST",
];

/**
 * Editorial squad list — Tactician table style.
 * Each row links to the player profile; mini-stats run along the right edge.
 */
export function SquadList({ startingXI, bench, teamShortName }: Props) {
  const sortedXI = [...startingXI].sort(
    (a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
  );
  const sortedBench = [...bench].sort(
    (a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
  );

  return (
    <div className="surface p-5">
      <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 mb-3">
        {teamShortName} · tropp
      </div>

      <div>
        <SectionHeader label="Startoppstilling" count={sortedXI.length} />
        <ul className="mt-2 mb-5">
          {sortedXI.map((p) => (
            <PlayerRow key={p.id} player={p} />
          ))}
        </ul>
      </div>

      {sortedBench.length > 0 && (
        <div>
          <SectionHeader label="Bench" count={sortedBench.length} muted />
          <ul className="mt-2">
            {sortedBench.map((p) => (
              <PlayerRow key={p.id} player={p} muted />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  label,
  count,
  muted,
}: {
  label: string;
  count: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-cream/8 pb-1.5">
      <span
        className={cn(
          "text-[10px] uppercase tracking-kicker font-semibold font-mono",
          muted ? "text-cream/60" : "text-signal",
        )}
      >
        {label}
      </span>
      <span className="text-[10px] font-mono text-cream/60 stat-num">{count}</span>
    </div>
  );
}

function PlayerRow({ player, muted }: { player: Player; muted?: boolean }) {
  return (
    <li>
      <Link
        href={`/players/${player.id}`}
        className="grid grid-cols-[28px_36px_1fr_auto] sm:grid-cols-[28px_36px_1fr_auto_auto] gap-3 items-center py-1.5 px-1 -mx-1 hover:bg-cream/5 transition-colors group"
      >
        <span className="font-mono text-[11px] text-cream/60 text-right stat-num">
          {player.number}
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 text-[10px] font-mono font-semibold text-center",
            muted ? "bg-paper text-cream/60" : "bg-signal/15 text-signal",
          )}
        >
          {player.position}
        </span>
        <span
          className={cn(
            "font-serif text-sm tracking-editorial truncate group-hover:text-amber transition-colors",
            muted ? "text-cream/55" : "text-cream",
          )}
        >
          {player.name}
          {player.isCaptain && (
            <span className="ml-1.5 text-signal text-[10px] font-mono">(C)</span>
          )}
        </span>
        <span className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-cream/60 shrink-0">
          {typeof player.caps === "number" && (
            <span title="caps">
              <span className="stat-num text-cream/70">{player.caps}</span>c
            </span>
          )}
          {typeof player.goals === "number" && player.goals > 0 && (
            <span title="goals">
              <span className="stat-num text-signal">{player.goals}</span>g
            </span>
          )}
          {typeof player.assists === "number" && player.assists > 0 && (
            <span title="assists">
              <span className="stat-num text-amber">{player.assists}</span>a
            </span>
          )}
        </span>
        <span className="text-[10px] text-cream/60 truncate max-w-[110px] hidden md:inline font-mono">
          {player.club}
        </span>
      </Link>
    </li>
  );
}
