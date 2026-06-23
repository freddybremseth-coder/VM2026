/**
 * Tournament-progression odds card — R32 hero + per-round bars for any team.
 * Used by /norge (Norway-flavour copy) and /teams/[id] (generic copy).
 *
 * Source data is the Poisson + Monte Carlo simulator in lib/tournament-sim.ts,
 * loaded server-side via getTeamPrediction (cached for 15 min or until cron
 * writes a new match_result).
 */

import type { TeamPrediction } from "@/lib/tournament-sim";

interface Props {
  prediction: TeamPrediction;
  /** Header copy: e.g. "Veien videre" for Norway, "Sannsynlighet for sluttspill" otherwise. */
  title?: string;
}

export function TournamentOdds({ prediction, title = "Sannsynlighet" }: Props) {
  const pct = (n: number) =>
    n * 100 >= 1 ? `${(n * 100).toFixed(1)}%` : n * 100 >= 0.1 ? `${(n * 100).toFixed(2)}%` : "<0.1%";

  const rounds: Array<{ label: string; p: number; tone: string }> = [
    { label: "Runde av 16", p: prediction.pR16, tone: "bg-signal" },
    { label: "Kvartfinale", p: prediction.pQF, tone: "bg-amber" },
    { label: "Semifinale", p: prediction.pSF, tone: "bg-amber" },
    { label: "Finale", p: prediction.pFinal, tone: "bg-amber" },
    { label: "Mester", p: prediction.pChampion, tone: "bg-win" },
  ];

  return (
    <div className="surface">
      {/* R32 hero */}
      <div className="px-5 py-5 border-b border-cream/8 flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="font-serif text-[44px] sm:text-[56px] font-semibold text-signal leading-none tracking-[-0.04em] stat-num">
          {Math.round(prediction.pR32 * 100)}%
        </span>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 mb-1">
            {title} — Runde av 32
          </div>
          <div className="h-1 bg-cream/14 relative">
            <div
              className="absolute left-0 top-0 bottom-0 bg-signal transition-[width]"
              style={{ width: `${Math.round(prediction.pR32 * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-kicker font-mono text-cream/60">
            Topp 2: {Math.round(prediction.pTop2 * 100)}% · Beste 3.-plass:{" "}
            {Math.round(prediction.pThirdQualify * 100)}%
          </div>
        </div>
      </div>

      {/* Per-round bars */}
      <div className="px-5 py-4 space-y-2.5">
        {rounds.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[7rem_1fr_4rem] gap-3 items-center"
          >
            <span className="text-[11px] uppercase tracking-kicker font-mono text-cream/55">
              {r.label}
            </span>
            <div className="h-1.5 bg-cream/8 relative">
              <div
                className={`absolute left-0 top-0 bottom-0 ${r.tone} transition-[width]`}
                style={{ width: `${Math.max(0.5, Math.min(100, r.p * 100))}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold stat-num text-cream text-right">
              {pct(r.p)}
            </span>
          </div>
        ))}
      </div>

      <div className="px-5 pb-4 text-[10px] text-cream/55 leading-relaxed font-mono">
        Poisson-modell · 10 000 Monte Carlo-simuleringer · re-kjøres etter
        hver fullført kamp. Lag-styrker estimeres fra FIFA-rang og faktiske
        mål per kamp så langt; knockout-uavgjort avgjøres med en re-sample
        og deretter myntkast (proxy for ekstra tid + straffespark).
      </div>
    </div>
  );
}
