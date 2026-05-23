import Link from "next/link";
import { MapPin, Users, UserCircle2 } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { cn } from "@/lib/utils";
import type { MatchDetail } from "@/lib/types";

interface Props {
  match: MatchDetail;
}

/**
 * Cinematic match header — Stadium foundation + Tactician score.
 *
 * Hero on a StadiumBackdrop with editorial team names, huge Fraunces score
 * and a LIVE pulse pill (or kickoff/status pill) top-right. Venue metadata
 * runs along the bottom in mono kicker form.
 */
export function MatchHeader({ match }: Props) {
  const live = match.status === "live" || match.status === "halftime";
  const { home, away } = match.teams;
  const score = match.score;

  return (
    <StadiumBackdrop className="border border-cream/8">
      <div className="px-4 sm:px-6 py-5 sm:py-8 relative">
        {/* Stage + status row */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-mono uppercase tracking-kicker font-bold text-cream/70 truncate">
            {match.stage}
          </span>
          {live ? (
            <span className="inline-flex items-center gap-1.5 bg-signal text-cream px-2.5 py-1 text-[10px] font-extrabold tracking-[1.3px] shrink-0">
              <span className="live-dot h-1.5 w-1.5" />
              {match.status === "halftime" ? "HT" : `${match.minute}'`}
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-kicker text-cream/55 shrink-0">
              {match.status.toUpperCase()}
            </span>
          )}
        </div>

        {/* Mobile stacked / desktop 3-col */}
        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-5 sm:gap-8 sm:items-center">
          <TeamBlock team={home} align="right" live={live} />
          <div className="flex flex-col items-center">
            {score ? (
              <>
                <div className="font-serif font-semibold leading-none flex items-baseline gap-4 stat-num tracking-[-0.04em]">
                  <span
                    className={cn(
                      "text-5xl sm:text-7xl",
                      score.home > score.away ? "text-cream" : "text-cream/55",
                    )}
                  >
                    {score.home}
                  </span>
                  <span className="text-cream/25 text-3xl sm:text-5xl font-normal">·</span>
                  <span
                    className={cn(
                      "text-5xl sm:text-7xl",
                      score.away > score.home ? "text-cream" : "text-cream/55",
                    )}
                  >
                    {score.away}
                  </span>
                </div>
                {score.ht && (
                  <div className="mt-2 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
                    HT {score.ht.home}–{score.ht.away}
                  </div>
                )}
              </>
            ) : (
              <div className="font-serif text-3xl sm:text-4xl text-cream/35 italic">vs</div>
            )}
          </div>
          <TeamBlock team={away} align="left" live={live} />
        </div>

        {/* Venue line */}
        <div className="mt-7 pt-4 border-t border-cream/8 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
          <span className="flex items-center gap-1.5">
            <MapPin size={11} />
            {match.venue.name} · {match.venue.city}
          </span>
          {match.attendance && (
            <span className="flex items-center gap-1.5">
              <Users size={11} />
              {match.attendance.toLocaleString("nb-NO")}
            </span>
          )}
          {match.referee && (
            <span className="hidden sm:flex items-center gap-1.5">
              <UserCircle2 size={11} />
              {match.referee}
            </span>
          )}
        </div>
      </div>
    </StadiumBackdrop>
  );
}

function TeamBlock({
  team,
  align,
  live,
}: {
  team: MatchDetail["teams"]["home"];
  align: "left" | "right";
  live: boolean;
}) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "flex items-center gap-3 sm:gap-4 min-w-0 group -mx-2 px-2 py-1 hover:bg-cream/5 transition-colors",
        align === "right"
          ? "sm:justify-end sm:text-right sm:flex-row"
          : "sm:justify-start sm:flex-row",
      )}
    >
      <HoloFlag
        code={team.flag}
        w={42}
        shimmer={live ? "animated" : "medium"}
        className={cn(align === "right" && "sm:hidden")}
      />
      <div className={cn("min-w-0 flex-1 sm:flex-initial", align === "right" && "sm:text-right")}>
        <div className="font-serif text-xl sm:text-2xl font-semibold tracking-editorial truncate group-hover:text-amber transition-colors">
          {team.name}
        </div>
        <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 mt-0.5 truncate">
          {team.formation} · {team.manager}
        </div>
      </div>
      {align === "right" && (
        <HoloFlag
          code={team.flag}
          w={42}
          shimmer={live ? "animated" : "medium"}
          className="hidden sm:inline-block"
        />
      )}
    </Link>
  );
}
