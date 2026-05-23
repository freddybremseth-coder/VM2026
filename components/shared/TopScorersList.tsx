import Link from "next/link";
import { Trophy, Sparkles } from "lucide-react";
import { HoloFlag } from "./HoloFlag";
import { teamById } from "@/lib/wc26-data";
import type { TournamentLeader } from "@/lib/team-stats";

interface Props {
  title: string;
  leaders: TournamentLeader[];
  /** "goals" → trophy icon, "assists" → sparkles icon */
  metric: "goals" | "assists";
  /** Optional subtitle / scope note */
  subtitle?: string;
}

/**
 * Editorial top-N leaderboard. Rows link to player; flag links to team.
 */
export function TopScorersList({ title, leaders, metric, subtitle }: Props) {
  if (leaders.length === 0) return null;

  const Icon = metric === "goals" ? Trophy : Sparkles;
  const iconTone = metric === "goals" ? "text-signal" : "text-amber";
  const valueTone = metric === "goals" ? "text-signal" : "text-amber";

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={12} className={iconTone} />
          <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
            {title}
          </h2>
        </div>
        {subtitle && (
          <span className="text-[9px] uppercase tracking-kicker text-cream/45 font-mono">
            {subtitle}
          </span>
        )}
      </div>

      <ol className="space-y-2">
        {leaders.map((leader, i) => {
          const team = teamById(leader.teamId);
          return (
            <li key={leader.player.id} className="flex items-center gap-3 text-sm">
              <span className="font-serif text-base text-cream/45 w-5 text-right stat-num shrink-0">
                {i + 1}
              </span>
              {team && (
                <Link
                  href={`/teams/${team.id}`}
                  title={team.name}
                  className="shrink-0 hover:opacity-80 transition-opacity"
                >
                  <HoloFlag code={team.flag} w={20} radius={2} />
                </Link>
              )}
              <Link
                href={`/players/${leader.player.id}`}
                className="flex-1 min-w-0 truncate font-serif text-cream tracking-editorial hover:text-amber transition-colors"
              >
                {leader.player.name}
              </Link>
              <span className="text-[10px] text-cream/45 font-mono shrink-0 hidden sm:inline uppercase tracking-kicker">
                {leader.player.position}
              </span>
              <span className={`font-mono font-bold stat-num shrink-0 text-lg ${valueTone}`}>
                {leader.value}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
