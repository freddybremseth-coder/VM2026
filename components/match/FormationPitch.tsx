import { cn } from "@/lib/utils";
import type { Player } from "@/lib/wc26-squads";

interface Props {
  startingXI: Player[];
  formation: string;
  side: "home" | "away";
  teamShortName: string;
}

/**
 * Half-pitch SVG with player dots.
 *
 * Convention: each side renders its own half. `home` is shown with attack
 * direction pointing up; for `away` we mirror the y-axis so the dot positions
 * (which are stored from the team's own perspective) read correctly.
 */
export function FormationPitch({ startingXI, formation, side, teamShortName }: Props) {
  const accent = side === "home" ? "accent" : "data";
  const accentColor = side === "home" ? "hsl(var(--accent-500))" : "hsl(var(--data-500))";

  return (
    <div className="card-panel p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
            {teamShortName} · starting XI
          </div>
          <div className="text-sm font-semibold mt-0.5">{formation}</div>
        </div>
        <div
          className={cn(
            "text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded",
            accent === "accent"
              ? "bg-accent-500/15 text-accent-300"
              : "bg-data-500/15 text-data-300",
          )}
        >
          {side === "home" ? "Home" : "Away"}
        </div>
      </div>

      <div className="relative aspect-[3/4]">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Pitch */}
          <rect x="0" y="0" width="100" height="100" fill="hsl(var(--pitch-900))" />
          <rect
            x="2" y="2" width="96" height="96"
            fill="none" stroke="hsl(var(--pitch-700))" strokeWidth="0.4"
          />
          {/* Half line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--pitch-700))" strokeWidth="0.3" strokeDasharray="2 1.5" />
          {/* Centre circle */}
          <circle cx="50" cy="50" r="9" fill="none" stroke="hsl(var(--pitch-700))" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="0.6" fill="hsl(var(--pitch-700))" />
          {/* Penalty boxes */}
          <rect x="22" y="0"  width="56" height="14" fill="none" stroke="hsl(var(--pitch-700))" strokeWidth="0.3" />
          <rect x="36" y="0"  width="28" height="5"  fill="none" stroke="hsl(var(--pitch-700))" strokeWidth="0.3" />
          <rect x="22" y="86" width="56" height="14" fill="none" stroke="hsl(var(--pitch-700))" strokeWidth="0.3" />
          <rect x="36" y="95" width="28" height="5"  fill="none" stroke="hsl(var(--pitch-700))" strokeWidth="0.3" />
          {/* Penalty spots */}
          <circle cx="50" cy="9"  r="0.5" fill="hsl(var(--pitch-700))" />
          <circle cx="50" cy="91" r="0.5" fill="hsl(var(--pitch-700))" />
        </svg>

        {/* Player dots overlaid in HTML so we can use proper text */}
        {startingXI.map((p) => {
          if (p.startX === undefined || p.startY === undefined) return null;
          // For away team, mirror y so attack direction points down on screen.
          const y = side === "home" ? p.startY : 100 - p.startY;
          return (
            <div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${p.startX}%`, top: `${y}%` }}
            >
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-pitch-950 ring-2 ring-pitch-900"
                style={{ backgroundColor: accentColor }}
              >
                {p.number}
              </div>
              <div className="mt-0.5 px-1 rounded bg-pitch-900/80 backdrop-blur text-[9px] font-medium text-pitch-100 whitespace-nowrap leading-tight">
                {lastName(p.name)}
                {p.isCaptain && <span className="ml-0.5 text-accent-400">(C)</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function lastName(full: string): string {
  const parts = full.split(" ");
  return parts.length === 1 ? full : parts.slice(-1)[0]!;
}
