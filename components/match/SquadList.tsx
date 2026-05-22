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

export function SquadList({ startingXI, bench, side, teamShortName }: Props) {
  const accent = side === "home" ? "accent" : "data";

  const sortedXI = [...startingXI].sort(
    (a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
  );
  const sortedBench = [...bench].sort(
    (a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
  );

  return (
    <div className="card-panel p-4">
      <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono mb-3">
        {teamShortName} · squad
      </div>

      <div>
        <SectionHeader label="Starting XI" accent={accent} count={sortedXI.length} />
        <ul className="space-y-1 mt-2 mb-4">
          {sortedXI.map((p) => (
            <PlayerRow key={p.id} player={p} accent={accent} />
          ))}
        </ul>
      </div>

      {sortedBench.length > 0 && (
        <div>
          <SectionHeader label="Bench" accent={accent} count={sortedBench.length} muted />
          <ul className="space-y-1 mt-2">
            {sortedBench.map((p) => (
              <PlayerRow key={p.id} player={p} accent={accent} muted />
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
  accent,
  muted,
}: {
  label: string;
  count: number;
  accent: "accent" | "data";
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-pitch-700/60 pb-1">
      <span
        className={cn(
          "text-[10px] uppercase tracking-widest font-semibold",
          muted ? "text-pitch-500" : accent === "accent" ? "text-accent-300" : "text-data-300",
        )}
      >
        {label}
      </span>
      <span className="text-[10px] font-mono text-pitch-500">{count}</span>
    </div>
  );
}

function PlayerRow({
  player,
  accent,
  muted,
}: {
  player: Player;
  accent: "accent" | "data";
  muted?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/players/${player.id}`}
        className="flex items-center gap-3 text-xs py-1.5 px-1 -mx-1 rounded hover:bg-pitch-800/50 transition-colors group"
      >
        <span className="font-mono text-pitch-500 w-6 text-right stat-num">
          {player.number}
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold w-9 text-center",
            muted
              ? "bg-pitch-800 text-pitch-500"
              : accent === "accent"
                ? "bg-accent-500/15 text-accent-300"
                : "bg-data-500/15 text-data-300",
          )}
        >
          {player.position}
        </span>
        <span
          className={cn(
            "flex-1 truncate group-hover:text-accent-200 transition-colors",
            muted ? "text-pitch-400" : "text-pitch-100",
          )}
        >
          {player.name}
          {player.isCaptain && (
            <span className="ml-1.5 text-accent-400 text-[10px] font-mono">(C)</span>
          )}
        </span>
        {/* Mini stats — caps · goals · assists */}
        <span className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-pitch-500 shrink-0">
          {typeof player.caps === "number" && (
            <span title="caps">
              <span className="stat-num text-pitch-300">{player.caps}</span>c
            </span>
          )}
          {typeof player.goals === "number" && player.goals > 0 && (
            <span title="goals">
              <span className="stat-num text-accent-300">{player.goals}</span>g
            </span>
          )}
          {typeof player.assists === "number" && player.assists > 0 && (
            <span title="assists">
              <span className="stat-num text-data-300">{player.assists}</span>a
            </span>
          )}
        </span>
        <span className="text-[10px] text-pitch-500 truncate max-w-[110px] hidden md:inline">
          {player.club}
        </span>
      </Link>
    </li>
  );
}
