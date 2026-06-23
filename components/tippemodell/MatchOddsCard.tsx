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

      {/* Over/Under 2.5 */}
      {match.totals && (
        <MarketSection title="Over / Under 2.5 mål" outcomes={match.totals} />
      )}

      {/* Begge lag scorer */}
      {match.btts && (
        <MarketSection title="Begge lag scorer" outcomes={match.btts} />
      )}

      {/* Footer — line-movement + wc26 link */}
      <div className="mt-3 pt-3 border-t border-cream/8 flex items-center gap-4">
        <Link
          href={`/tippemodell/${match.matchId}`}
          className="text-[10px] uppercase tracking-kicker font-mono text-signal hover:text-amber transition-colors"
        >
          Linjebevegelse →
        </Link>
        {wcMatch && match.wc26FixtureId !== null && (
          <Link
            href={`/matches/${match.wc26FixtureId}`}
            className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-amber transition-colors"
          >
            Kampdetalj →
          </Link>
        )}
      </div>
    </div>
  );
}

/** A secondary 2-way market (totals / BTTS) below the 1X2 grid. */
function MarketSection({
  title,
  outcomes,
}: {
  title: string;
  outcomes: OutcomeView[];
}) {
  return (
    <div className="mt-3 pt-3 border-t border-cream/8">
      <h3 className="text-[9px] uppercase tracking-kicker font-mono text-cream/45 mb-2">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {outcomes.map((o) => (
          <OutcomeCell key={o.outcome} outcome={o} />
        ))}
      </div>
    </div>
  );
}

function OutcomeCell({ outcome }: { outcome: OutcomeView }) {
  // Model value (Dixon-Coles +EV) is the stronger signal; fall back to the
  // market-only edge flag when we have no model (non-WC fixtures).
  const hasModelValue = outcome.modelValue;
  const hasMarketEdge =
    !hasModelValue && outcome.edge !== null && outcome.edge > VALUE_THRESHOLD;
  const highlight = hasModelValue || hasMarketEdge;

  const fairPct = outcome.fairProb !== null ? outcome.fairProb * 100 : null;
  const modelPct = outcome.modelProb !== null ? outcome.modelProb * 100 : null;
  const evPct = outcome.modelEv !== null ? outcome.modelEv * 100 : null;
  const edgePct = outcome.edge !== null ? outcome.edge * 100 : null;
  const kellyPct = outcome.kelly !== null ? outcome.kelly * 100 : null;

  return (
    <div
      className={`p-2.5 bg-paper border transition-colors ${
        hasModelValue
          ? "border-win/60 ring-1 ring-win/40"
          : hasMarketEdge
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
              highlight ? (hasModelValue ? "text-win" : "text-amber") : "text-cream"
            }`}
          >
            {outcome.best.price.toFixed(2)}
          </div>
          <div className="text-[9px] uppercase tracking-kicker font-mono text-cream/45 truncate mt-0.5">
            {outcome.best.bookmaker}
          </div>

          {/* Fair-prob meter (market) + model marker overlaid */}
          {fairPct !== null && (
            <div className="mt-2 h-[3px] bg-cream/8 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-signal/70"
                style={{ width: `${Math.max(2, Math.min(100, fairPct))}%` }}
              />
              {/* Model probability as a thin marker line on the same scale */}
              {modelPct !== null && (
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-win"
                  style={{ left: `${Math.max(0, Math.min(99, modelPct))}%` }}
                  title={`Modell: ${modelPct.toFixed(0)}%`}
                />
              )}
            </div>
          )}

          {/* Model probability line */}
          {modelPct !== null && (
            <div className="mt-1.5 text-[9px] font-mono text-cream/55 stat-num">
              Modell {modelPct.toFixed(0)}%
            </div>
          )}

          {/* Sharp reference */}
          {outcome.sharp !== null && (
            <div className="mt-0.5 text-[9px] font-mono text-cream/45 stat-num">
              P {outcome.sharp.toFixed(2)}
            </div>
          )}

          {/* Value badges */}
          {hasModelValue && evPct !== null && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-win/15 text-win text-[9px] font-mono font-bold">
                +EV {evPct.toFixed(1)}%
              </span>
              {kellyPct !== null && kellyPct > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-win/10 text-win/85 text-[9px] font-mono">
                  Kelly {kellyPct.toFixed(1)}%
                </span>
              )}
            </div>
          )}
          {hasMarketEdge && edgePct !== null && (
            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber/15 text-amber text-[9px] font-mono font-bold">
              marked +{edgePct.toFixed(1)}%
            </div>
          )}
          {outcome.modelDiverges && (
            <div
              className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 bg-cream/8 text-cream/45 text-[9px] font-mono"
              title="Modellen avviker for mye fra markedet til å være troverdig verdi — vises som info, ikke som spilltips."
            >
              modell uenig
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
