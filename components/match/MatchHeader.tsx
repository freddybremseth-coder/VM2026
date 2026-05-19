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
    <div className="card-panel p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest mb-5">
          <span className="text-accent-400 font-semibold">{match.stage}</span>
          {live ? (
            <span className="flex items-center gap-1.5 text-loss font-semibold">
              <span className="live-dot" />
              {match.status === "halftime" ? "Half time" : `${match.minute}' Live`}
            </span>
          ) : (
            <span className="text-pitch-400">{match.status.toUpperCase()}</span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <TeamBlock team={home} align="right" />
          <div className="flex flex-col items-center">
            {score ? (
              <>
                <div className="font-mono text-5xl font-bold stat-num leading-none flex items-baseline gap-3">
                  <span className={cn(score.home > score.away && "text-accent-300")}>
                    {score.home}
                  </span>
                  <span className="text-pitch-600 text-3xl">·</span>
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
              <div className="font-mono text-3xl text-pitch-400">VS</div>
            )}
          </div>
          <TeamBlock team={away} align="left" />
        </div>

        <div className="mt-6 pt-4 border-t border-pitch-700/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-pitch-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            {match.venue.name} · {match.venue.city}
          </span>
          {match.attendance && (
            <span className="flex items-center gap-1.5">
              <Users size={12} />
              {match.attendance.toLocaleString()} attendance
            </span>
          )}
          {match.referee && (
            <span className="flex items-center gap-1.5">
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
    <div
      className={cn(
        "flex items-center gap-4",
        align === "right" ? "justify-end text-right" : "justify-start",
      )}
    >
      {align === "left" && <TeamFlag code={team.flag} size="lg" />}
      <div className={cn("min-w-0", align === "right" && "text-right")}>
        <div className="text-xl font-bold tracking-tight">{team.name}</div>
        <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
          {team.formation} · {team.manager}
        </div>
      </div>
      {align === "right" && <TeamFlag code={team.flag} size="lg" />}
    </div>
  );
}
