/**
 * Hero for a fixture that has already kicked off — replaces the
 * "Tipp denne kampen" pre-match StadiumBackdrop when match_results carries
 * a non-scheduled status.
 *
 * Variants:
 *   live / halftime → score + animated LIVE pill with elapsed minute
 *   finished        → final score + FT pill
 *   postponed       → original kickoff + POSTPONED pill, no score
 *   cancelled       → CANCELLED pill, no score
 *
 * The visual language matches the editorial pre-match hero so the page
 * flips between modes without jarring layout changes.
 */

import Link from "next/link";
import { MapPin, UserCircle2 } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { Kicker } from "@/components/shared/EditorialKicker";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import type { LiveMatchView } from "@/lib/live-match";

interface Props {
  match: LiveMatchView;
}

function statusPill(match: LiveMatchView) {
  const { status, minute } = match;
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-signal text-cream px-2.5 py-1 text-[10px] font-extrabold tracking-[1.3px] shrink-0">
        <span className="live-dot h-1.5 w-1.5" />
        {minute ? `${minute}'` : "LIVE"}
      </span>
    );
  }
  if (status === "halftime") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber/20 text-amber px-2.5 py-1 text-[10px] font-extrabold tracking-[1.3px] shrink-0">
        HT
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-cream/10 text-cream/85 px-2.5 py-1 text-[10px] font-extrabold tracking-[1.3px] shrink-0">
        FT
      </span>
    );
  }
  if (status === "postponed") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber/20 text-amber px-2.5 py-1 text-[10px] font-extrabold tracking-[1.3px] shrink-0">
        UTSATT
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-cream/15 text-cream/55 px-2.5 py-1 text-[10px] font-extrabold tracking-[1.3px] shrink-0">
        AVLYST
      </span>
    );
  }
  return null;
}

export function LiveResultHero({ match }: Props) {
  const { teams, score, status } = match;

  return (
    <StadiumBackdrop className="border border-cream/8">
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Kicker tone="signal">{match.stage}</Kicker>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline font-mono text-[11px] text-cream/55 stat-num">
              {formatDateLabel(match.kickoff)} · {formatKickoff(match.kickoff)}
            </span>
            {statusPill(match)}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8">
          {teams.home ? (
            <TeamSide team={teams.home} align="right" />
          ) : (
            <div className="font-mono text-cream/50 text-lg text-right">TBD</div>
          )}

          <div className="flex flex-col items-center min-w-0">
            {score ? (
              <div
                className="font-serif font-semibold leading-none flex items-baseline gap-3 sm:gap-5 stat-num tracking-[-0.04em]"
                aria-label={`${score.home}-${score.away}`}
              >
                <span className="text-5xl sm:text-7xl text-cream">{score.home}</span>
                <span className="text-3xl sm:text-5xl text-cream/50">–</span>
                <span className="text-5xl sm:text-7xl text-cream">{score.away}</span>
              </div>
            ) : (
              <div className="font-serif text-3xl sm:text-5xl text-cream/50 italic">
                vs
              </div>
            )}
            {status === "finished" && (
              <div className="mt-2 text-[10px] uppercase tracking-kicker font-mono text-cream/60">
                Sluttresultat
              </div>
            )}
          </div>

          {teams.away ? (
            <TeamSide team={teams.away} align="left" />
          ) : (
            <div className="font-mono text-cream/50 text-lg">TBD</div>
          )}
        </div>

        <div className="mt-7 pt-4 border-t border-cream/8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
          <span className="flex items-center gap-1.5">
            <MapPin size={11} />
            {match.venue.name} · {match.venue.city}
          </span>
          {match.venue.capacity > 0 && (
            <span className="flex items-center gap-1.5">
              <UserCircle2 size={11} />
              {match.venue.capacity.toLocaleString("nb-NO")} kapasitet
            </span>
          )}
        </div>
      </div>
    </StadiumBackdrop>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: {
    id: number;
    name: string;
    flag: string;
    formation: string;
    manager: string;
  };
  align: "left" | "right";
}) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={
        "flex items-center gap-3 sm:gap-4 min-w-0 group -mx-2 px-2 py-1 hover:bg-cream/5 transition-colors" +
        (align === "right"
          ? " sm:flex-row sm:justify-end sm:text-right"
          : " sm:flex-row sm:justify-start")
      }
    >
      <HoloFlag code={team.flag} w={36} className={align === "right" ? "sm:hidden" : ""} />
      <div
        className={
          "min-w-0 flex-1 sm:flex-initial" +
          (align === "right" ? " sm:text-right" : "")
        }
      >
        <div className="font-serif text-lg sm:text-2xl font-semibold tracking-editorial truncate group-hover:text-amber transition-colors">
          {team.name}
        </div>
        <div className="hidden sm:block text-[10px] uppercase tracking-kicker font-mono text-cream/55 mt-0.5 truncate">
          {team.formation}
          {team.manager && ` · ${team.manager}`}
        </div>
      </div>
      {align === "right" && (
        <HoloFlag code={team.flag} w={36} className="hidden sm:inline-block" />
      )}
    </Link>
  );
}
