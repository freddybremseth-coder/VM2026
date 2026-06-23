/**
 * Goal log for a live / finished fixture, rendered from rows in
 * `public.tournament_goals` (already aggregated by side relative to this
 * fixture in `getLiveMatch`).
 *
 * Mirrors the editorial split-column style used elsewhere on the match
 * detail page — home minutes flush right, away flush left, with a vertical
 * center rule. Each scorer name links to their player profile when we
 * resolved a player id during sync.
 */

import Link from "next/link";
import { Trophy } from "lucide-react";
import type { LiveMatchGoal, LiveMatchView } from "@/lib/live-match";

interface Props {
  goals: LiveMatchGoal[];
  home?: LiveMatchView["teams"]["home"];
  away?: LiveMatchView["teams"]["away"];
}

export function LiveGoalsList({ goals, home, away }: Props) {
  if (goals.length === 0) {
    return (
      <div className="surface p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={12} className="text-signal" />
          <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
            Målscorere
          </h2>
        </div>
        <p className="text-xs text-cream/60 italic">Ingen mål ennå.</p>
      </div>
    );
  }

  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={12} className="text-signal" />
        <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
          Målscorere
        </h2>
        <span className="text-[9px] uppercase tracking-kicker text-cream/60 font-mono ml-auto">
          {goals.length} {goals.length === 1 ? "mål" : "mål"}
        </span>
      </div>

      <ul className="grid grid-cols-[1fr_auto_1fr] gap-y-2 items-baseline">
        {goals.map((g, i) => (
          <GoalRow
            key={`${g.minute}-${g.scorerName}-${i}`}
            goal={g}
            homeShort={home?.shortName}
            awayShort={away?.shortName}
          />
        ))}
      </ul>
    </div>
  );
}

function GoalRow({
  goal,
  homeShort,
  awayShort,
}: {
  goal: LiveMatchGoal;
  homeShort?: string;
  awayShort?: string;
}) {
  const teamLabel = goal.side === "home" ? homeShort : awayShort;
  const tags: string[] = [];
  if (goal.isPenalty) tags.push("pen");
  if (goal.isOwnGoal) tags.push("selvmål");

  const nameNode = goal.scorerPlayerId ? (
    <Link
      href={`/players/${goal.scorerPlayerId}`}
      className="font-serif text-sm tracking-editorial hover:text-amber transition-colors"
    >
      {goal.scorerName}
    </Link>
  ) : (
    <span className="font-serif text-sm tracking-editorial text-cream">
      {goal.scorerName}
    </span>
  );

  if (goal.side === "home") {
    return (
      <>
        <div className="min-w-0 pr-4 text-right">
          {nameNode}
          {goal.assistName && (
            <div className="text-[10px] text-cream/60 font-mono mt-0.5 truncate">
              assist: {goal.assistName}
            </div>
          )}
          {tags.length > 0 && (
            <div className="mt-0.5 flex flex-wrap gap-1 justify-end">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-[9px] uppercase tracking-kicker font-mono text-amber"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-center px-2 border-l border-r border-cream/10 self-stretch flex items-center">
          <span className="font-mono text-[11px] stat-num text-cream/85 whitespace-nowrap">
            {goal.minute}'
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/50 pl-4">
          {teamLabel}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/50 pr-4 text-right">
        {teamLabel}
      </div>
      <div className="text-center px-2 border-l border-r border-cream/10 self-stretch flex items-center">
        <span className="font-mono text-[11px] stat-num text-cream/85 whitespace-nowrap">
          {goal.minute}'
        </span>
      </div>
      <div className="min-w-0 pl-4">
        {nameNode}
        {goal.assistName && (
          <div className="text-[10px] text-cream/60 font-mono mt-0.5 truncate">
            assist: {goal.assistName}
          </div>
        )}
        {tags.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[9px] uppercase tracking-kicker font-mono text-amber"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
