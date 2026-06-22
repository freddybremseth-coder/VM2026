/**
 * One row in the /tippemodell dashboard. Mirrors the trading-terminal
 * design from the spec: bookmaker-aggregator vibe with monospace prices,
 * fair-prob meter under each cell, and an amber outline + edge % when the
 * best market price beats the fair line.
 */

import Link from "next/link";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { teamById } from "@/lib/wc26-data";
import type { MatchView, OutcomeView } from "@/lib/tippemodell/dashboard";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

const VALUE_THRESHOLD = 0.005; // 0.5% edge to flag

export function MatchOddsCard({ match }: { match: MatchView }) {
  // If we matched against a WC fixture we know the flags and short names.
  const wcMatch = match.wc26FixtureId !== null;
  // We don't always have a direct way to map names → wc26-data team ids
  // for non-matched fixtures, so this is best-effort.
  const homeFlag = wcMatch ? findFlag(match.homeTeam) : null;
  const awayFlag = wcMatch ? findFlag(match.awayTeam) : null;

  return (
    <div className="surface p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] uppercase tracking-kicker font-mono text-cream/55">
            {match.league}
          </span>
        </div>
        <span className="font-mono text-[10px] text-cream/55 stat-num">
          {formatDateLabel(match.commenceAt)} · {formatKickoff(match.commenceAt)}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <TeamLabel name={match.homeTeam} flag={homeFlag} />
        <span className="font-mono text-[10px] uppercase tracking-kicker text-cream/45 shrink-0">
          vs
        </span>
        <TeamLabel name={match.awayTeam} flag={awayFlag} align="right" />
      </div>

      {/* 1X2 grid */}
      <div className="grid grid-cols-3 gap-2">
        {match.outcomes.map((o) => (
          <OutcomeCell key={o.outcome} outcome={o} />
        ))}
      </div>

      {/* Footer — wc26 link */}
      {wcMatch && match.wc26FixtureId !== null && (
        <div className="mt-3 pt-3 border-t border-cream/8">
          <Link
            href={`/matches/${match.wc26FixtureId}`}
            className="text-[10px] uppercase tracking-kicker font-mono text-signal hover:text-amber transition-colors"
          >
            Se kampdetalj →
          </Link>
        </div>
      )}
    </div>
  );
}

function OutcomeCell({ outcome }: { outcome: OutcomeView }) {
  const hasValue =
    outcome.edge !== null && outcome.edge > VALUE_THRESHOLD;
  const fairPct = outcome.fairProb !== null ? outcome.fairProb * 100 : null;
  const edgePct = outcome.edge !== null ? outcome.edge * 100 : null;

  return (
    <div
      className={`p-2.5 bg-paper border transition-colors ${
        hasValue
          ? "border-amber/60 ring-1 ring-amber/40"
          : "border-cream/8"
      }`}
    >
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-serif text-[11px] font-bold uppercase tracking-kicker text-cream/55">
          {outcome.label}
        </span>
        {fairPct !== null && (
          <span className="font-mono text-[9px] text-cream/45 stat-num">
            {fairPct.toFixed(0)}%
          </span>
        )}
      </div>

      {outcome.best ? (
        <>
          <div
            className={`font-mono font-bold text-base stat-num ${
              hasValue ? "text-amber" : "text-cream"
            }`}
          >
            {outcome.best.price.toFixed(2)}
          </div>
          <div className="text-[9px] uppercase tracking-kicker font-mono text-cream/45 truncate mt-0.5">
            {outcome.best.bookmaker}
          </div>

          {/* Fair-prob meter */}
          {fairPct !== null && (
            <div className="mt-2 h-[2px] bg-cream/8 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-signal/70 transition-[width]"
                style={{ width: `${Math.max(2, Math.min(100, fairPct))}%` }}
              />
            </div>
          )}

          {/* Pinnacle/sharp reference */}
          {outcome.sharp !== null && (
            <div className="mt-1.5 text-[9px] font-mono text-cream/45 stat-num">
              P {outcome.sharp.toFixed(2)}
            </div>
          )}

          {/* Edge badge */}
          {hasValue && edgePct !== null && (
            <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber/15 text-amber text-[9px] font-mono font-bold">
              +{edgePct.toFixed(1)}%
            </div>
          )}
        </>
      ) : (
        <div className="font-mono text-[10px] text-cream/35 italic mt-1">
          ingen pris
        </div>
      )}

      <div className="mt-1 text-[9px] font-mono text-cream/35 stat-num">
        {outcome.bookCount} {outcome.bookCount === 1 ? "bok" : "bøker"}
      </div>
    </div>
  );
}

function TeamLabel({
  name,
  flag,
  align = "left",
}: {
  name: string;
  flag: string | null;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-2 min-w-0 flex-1 ${
        align === "right" ? "justify-end text-right" : ""
      }`}
    >
      {align === "left" && flag && <HoloFlag code={flag} w={20} radius={2} />}
      <span className="font-serif text-sm font-semibold tracking-editorial text-cream truncate">
        {name}
      </span>
      {align === "right" && flag && <HoloFlag code={flag} w={20} radius={2} />}
    </div>
  );
}

/** Best-effort: find a WC team flag by name. Falls back to null for unknown names. */
function findFlag(name: string): string | null {
  const norm = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
  // Brute search across wc26 teams. 48 teams — trivial cost.
  // (Avoiding an import of the full TEAMS table to keep the client bundle small;
  // teamById is async-safe but we need by-name here.)
  for (let id = 1; id <= 110; id++) {
    const t = teamById(id);
    if (!t) continue;
    if (
      t.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]/g, "") === norm
    ) {
      return t.flag;
    }
  }
  return null;
}
