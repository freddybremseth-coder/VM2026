import { cn } from "@/lib/utils";
import type { Goal, MatchDetail } from "@/lib/types";

interface Props {
  goals: Goal[];
  home: MatchDetail["teams"]["home"];
  away: MatchDetail["teams"]["away"];
}

export function GoalsList({ goals, home, away }: Props) {
  if (goals.length === 0) return null;
  return (
    <div className="card-panel p-5">
      <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-3">
        Goals
      </div>
      <ul className="space-y-2.5">
        {goals.map((g, i) => {
          const isHome = g.team === "home";
          const team = isHome ? home : away;
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-3 text-sm",
                !isHome && "flex-row-reverse text-right",
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs stat-num shrink-0 w-8 text-center font-semibold",
                  isHome ? "text-accent-300" : "text-data-300",
                )}
              >
                {g.minute}'
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">⚽ {g.scorer}</div>
                {g.assist && (
                  <div className="text-[11px] text-pitch-500 truncate">
                    Assist: {g.assist}
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "stat-pill",
                  isHome
                    ? "bg-accent-500/15 text-accent-300"
                    : "bg-data-500/15 text-data-300",
                )}
              >
                {team.shortName} · xG {g.xg.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
