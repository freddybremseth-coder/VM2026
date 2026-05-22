import Link from "next/link";
import { MapPin, Users, UserCircle2 } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { cn } from "@/lib/utils";
import type { MatchDetail } from "@/lib/types";

interface Props {
  match: MatchDetail;
}

export function MatchHeader({ match }: Props) {
  const live = match.status === "live" || match.status === "halftime";
  const { home, away } = match.teams;
  const score = match.score;

  return (
    <div className="card-panel p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest mb-5">
          <span className="text-accent-400 font-semibold truncate">{match.stage}</span>
          {live ? (
            <span className="flex items-center gap-1.5 text-loss font-semibold shrink-0">
              <span className="live-dot" />
              {match.status === "halftime" ? "HT" : `${match.minute}'`}
            </span>
          ) : (
            <span className="text-pitch-400 shrink-0">{match.status.toUpperCase()}</span>
          )}
        </div>

        {/* Mobile: stack home / score / away vertically. Desktop: 3-col grid. */}
        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 sm:items-center">
          <TeamBlock team={home} align="right" />
          <div className="flex flex-col items-center">
            {score ? (
              <>
                <div className="font-mono text-4xl sm:text-5xl font-bold stat-num leading-none flex items-baseline gap-3">
                  <span className={cn(score.home > score.away && "text-accent-300")}>
                    {score.home}
                  </span>
                  <span className="text-pitch-600 text-2xl sm:text-3xl">·</span>
                  <span className={cn(score.away > score.home && "text-accent-300")}>
                    {score.away}
                  </span>
                </div>
                {score.ht && (
                  <div className="mt-2 text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
                    HT {score.ht.home}–{score.ht.away}
                  </div>
                )}
              </>
            ) : (
              <div className="font-mono text-2xl sm:text-3xl text-pitch-400">VS</div>
            )}
          </div>
          <TeamBlock team={away} align="left" />
        </div>

        <div className="mt-6 pt-4 border-t border-pitch-700/60 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] text-pitch-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            {match.venue.name} · {match.venue.city}
          </span>
          {match.attendance && (
            <span className="flex items-center gap-1.5">
              <Users size={12} />
              {match.attendance.toLocaleString()}
            </span>
          )}
          {match.referee && (
            <span className="hidden sm:flex items-center gap-1.5">
              <UserCircle2 size={12} />
              {match.referee}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamBlock({
  team,
  align,
}: {
  team: MatchDetail["teams"]["home"];
  align: "left" | "right";
}) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "flex items-center gap-3 sm:gap-4 min-w-0 group rounded-md -mx-2 px-2 py-1 hover:bg-pitch-800/40 transition-colors",
        align === "right"
          ? "sm:justify-end sm:text-right sm:flex-row"
          : "sm:justify-start sm:flex-row",
      )}
    >
      <TeamFlag code={team.flag} size="lg" className={cn(align === "right" && "sm:hidden")} />
      <div className={cn("min-w-0 flex-1 sm:flex-initial", align === "right" && "sm:text-right")}>
        <div className="text-lg sm:text-xl font-bold tracking-tight truncate group-hover:text-accent-200 transition-colors">
          {team.name}
        </div>
        <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5 truncate">
          {team.formation} · {team.manager}
        </div>
      </div>
      {align === "right" && (
        <TeamFlag code={team.flag} size="lg" className="hidden sm:inline-block" />
      )}
    </Link>
  );
}
