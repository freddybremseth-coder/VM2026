import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { cn, formatKickoff } from "@/lib/utils";
import type { MatchSummary } from "@/lib/types";

interface Props {
  match: MatchSummary;
}

export function MatchCard({ match }: Props) {
  const { status, home, away, score, xg, possession } = match;
  const live = status === "live" || status === "halftime";
  const finished = status === "finished";

  return (
    <Link
      href={`/matches/${match.id}`}
      className={cn(
        "card-panel block p-4 transition-all hover:border-accent-500/40 hover:-translate-y-0.5",
        live && "ring-1 ring-loss/30",
      )}
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-pitch-400 mb-3">
        <span>{match.stage}</span>
        {live ? (
          <span className="flex items-center gap-1.5 text-loss font-semibold">
            <span className="live-dot" />
            {status === "halftime" ? "HT" : `${match.minute}'`}
          </span>
        ) : finished ? (
          <span className="text-pitch-500">FT</span>
        ) : (
          <span className="font-mono text-pitch-300">{formatKickoff(match.kickoff)}</span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamRow team={home} align="left" />
        <div className="flex flex-col items-center min-w-[60px]">
          {score ? (
            <div className="font-mono text-2xl font-bold stat-num leading-none flex items-center gap-2">
              <span>{score.home}</span>
              <span className="text-pitch-600">·</span>
              <span>{score.away}</span>
            </div>
          ) : (
            <div className="font-mono text-sm text-pitch-400">VS</div>
          )}
        </div>
        <TeamRow team={away} align="right" />
      </div>

      {(xg || possession) && (
        <div className="mt-4 pt-3 border-t border-pitch-700/60 grid grid-cols-2 gap-3 text-[11px]">
          {xg && (
            <StatRow
              label="xG"
              home={xg.home.toFixed(2)}
              away={xg.away.toFixed(2)}
              homeIsBetter={xg.home >= xg.away}
            />
          )}
          {possession && (
            <StatRow
              label="POSS"
              home={`${possession.home}%`}
              away={`${possession.away}%`}
              homeIsBetter={possession.home >= possession.away}
            />
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[11px] text-pitch-500">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {match.venue.city}
        </span>
        <span className="flex items-center gap-1 text-pitch-400 group-hover:text-accent-300">
          Match center <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

function TeamRow({
  team,
  align,
}: {
  team: MatchSummary["home"];
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 min-w-0",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <TeamFlag code={team.flag} size="md" />
      <div className="min-w-0">
        <div className="font-semibold text-sm truncate">{team.name}</div>
        <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
          {team.shortName}
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  home,
  away,
  homeIsBetter,
}: {
  label: string;
  home: string;
  away: string;
  homeIsBetter: boolean;
}) {
  return (
    <div className="flex items-center justify-between font-mono stat-num">
      <span className={cn(homeIsBetter ? "text-accent-300" : "text-pitch-400")}>
        {home}
      </span>
      <span className="text-pitch-600 text-[10px] uppercase tracking-widest">
        {label}
      </span>
      <span className={cn(!homeIsBetter ? "text-accent-300" : "text-pitch-400")}>
        {away}
      </span>
    </div>
  );
}
