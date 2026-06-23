/**
 * /tippemodell/autopilot — paper-trading dashboard.
 *
 * Replays the model's flagged value bets as a virtual ledger against a chosen
 * bankroll, settled on the real ESPN results. Shows whether the model actually
 * makes money — no real stake involved. The bets are placed + settled by the
 * /api/cron/paper-trade cron; this page is read-only over the result.
 */

import Link from "next/link";
import { ArrowLeft, Bot, AlertCircle } from "lucide-react";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { EquityCurveChart } from "@/components/tippemodell/EquityCurveChart";
import { BankrollForm } from "@/components/tippemodell/BankrollForm";
import { getPaperSummary, type PaperSummary } from "@/lib/tippemodell/paper-trade";
import { formatDateLabel, formatKickoff } from "@/lib/utils";

export const dynamic = "force-dynamic";

function kr(n: number): string {
  return `${n >= 0 ? "" : "−"}${Math.abs(n).toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

export default async function AutopilotPage() {
  let summary: PaperSummary | null = null;
  let loadError: string | null = null;
  try {
    summary = await getPaperSummary();
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1100px] mx-auto">
      <Link
        href="/tippemodell"
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-signal transition-colors"
      >
        <ArrowLeft size={11} /> Tilbake til tippemodell
      </Link>

      <header className="mt-4 mb-6">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <Bot size={11} /> Auto-pilot · papir
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          Tjener modellen penger?
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-2xl leading-relaxed">
          Hvert grønne verdispill modellen flagger «settes» automatisk med en
          Kelly-innsats mot den innskutte summen, og gjøres opp mot de ekte
          kampresultatene. Ingen ekte penger — dette beviser om modellen faktisk
          gir avkastning før noe risikeres.
        </p>
      </header>

      {loadError ? (
        <SetupNotice error={loadError} />
      ) : summary ? (
        <Dashboard summary={summary} />
      ) : null}

      <p className="mt-8 pt-5 border-t border-cream/8 text-[10px] text-cream/45 font-mono leading-relaxed max-w-3xl">
        Simulering til eget bruk. En positiv kurve her er nødvendig, men ikke
        tilstrekkelig, før ekte penger vurderes — markedet med 90+ bookmakere er
        skarpt, og marginen gjør det vanskelig å slå over tid. Spill ansvarlig.
        Hjelpelinjen: 800 800 40.
      </p>
    </div>
  );
}

function Dashboard({ summary }: { summary: PaperSummary }) {
  const delta = summary.bankroll - summary.startingBankroll;
  const up = delta >= 0;
  const roiPct = summary.roi !== null ? summary.roi * 100 : null;
  const hitPct = summary.hitRate !== null ? summary.hitRate * 100 : null;

  return (
    <>
      <div className="surface p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
        <BankrollForm current={summary.startingBankroll} />
        <span className="text-[10px] font-mono text-cream/45">
          {summary.openBets.length} åpne · {summary.won + summary.lost} avgjort
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Stat label="Bankroll nå" value={kr(summary.bankroll)} sub={`${up ? "+" : ""}${kr(delta)}`} tone={up ? "win" : "loss"} />
        <Stat label="ROI" value={roiPct !== null ? `${roiPct >= 0 ? "+" : ""}${roiPct.toFixed(1)}%` : "—"} sub={`av ${kr(summary.totalStaked)} satset`} tone={roiPct !== null && roiPct >= 0 ? "win" : roiPct !== null ? "loss" : "neutral"} />
        <Stat label="Resultat" value={`${summary.won}–${summary.lost}`} sub={hitPct !== null ? `${hitPct.toFixed(0)}% treff` : "ingen avgjort"} tone="neutral" />
        <Stat label="Åpen eksponering" value={kr(summary.openExposure)} sub={`${summary.openBets.length} spill`} tone="neutral" />
      </div>

      {summary.curve.length > 1 ? (
        <div className="surface p-4 sm:p-5 mb-5">
          <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70 mb-3">
            Bankroll over tid
          </h2>
          <EquityCurveChart curve={summary.curve} starting={summary.startingBankroll} />
        </div>
      ) : (
        <div className="surface p-6 text-center mb-5 text-xs text-cream/55">
          Ingen avgjorte spill ennå — kurven tegnes når de første verdispillene
          er ferdigspilt. Auto-piloten plasserer spill ved hver cron-kjøring.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BetList title="Åpne spill" bets={summary.openBets} kind="open" />
        <BetList title="Avgjorte spill" bets={summary.settledBets} kind="settled" />
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "win" | "loss" | "neutral";
}) {
  const color = tone === "win" ? "text-win" : tone === "loss" ? "text-loss" : "text-cream";
  return (
    <div className="surface p-3">
      <div className="text-[9px] uppercase tracking-kicker font-mono text-cream/45 mb-1">{label}</div>
      <div className={`font-mono text-lg font-bold stat-num ${color}`}>{value}</div>
      <div className="text-[9px] font-mono text-cream/45 mt-0.5 stat-num">{sub}</div>
    </div>
  );
}

function BetList({
  title,
  bets,
  kind,
}: {
  title: string;
  bets: PaperSummary["openBets"];
  kind: "open" | "settled";
}) {
  return (
    <div className="surface p-4">
      <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70 mb-3">
        {title} <span className="text-cream/35">({bets.length})</span>
      </h2>
      {bets.length === 0 ? (
        <p className="text-xs text-cream/45 font-mono">Ingen ennå.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-cream/8">
          {bets.slice(0, 40).map((b) => {
            const won = b.status === "won";
            return (
              <li key={b.id} className="py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] text-cream/85 truncate">{b.label}</div>
                  <div className="text-[9px] font-mono text-cream/45 stat-num">
                    {kind === "open"
                      ? `${formatDateLabel(b.commenceAt)} · ${formatKickoff(b.commenceAt)} · @ ${b.placedOdds.toFixed(2)}`
                      : `innsats ${kr(b.stake)} · @ ${b.placedOdds.toFixed(2)}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {kind === "open" ? (
                    <span className="font-mono text-xs text-cream/70 stat-num">{kr(b.stake)}</span>
                  ) : (
                    <span className={`font-mono text-xs font-bold stat-num ${won ? "text-win" : "text-loss"}`}>
                      {won ? "+" : ""}{kr(b.pnl ?? 0)}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SetupNotice({ error }: { error: string }) {
  return (
    <div className="surface p-6 ring-1 ring-amber/20">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="text-amber shrink-0 mt-0.5" />
        <div>
          <h2 className="font-serif text-lg font-semibold tracking-editorial text-cream mb-1">
            Auto-piloten er klar, men databasetabellen mangler.
          </h2>
          <p className="text-sm text-cream/55 leading-relaxed max-w-2xl">
            Kjør migrasjonen{" "}
            <code className="px-1.5 py-0.5 bg-paper text-cream font-mono text-xs">
              supabase/migrations/0007_paper_trading.sql
            </code>{" "}
            én gang i Supabase SQL-editoren (samme måte som tippemodell-tabellene
            ble opprettet). Da fyller cron-en{" "}
            <code className="px-1.5 py-0.5 bg-paper text-cream font-mono text-xs">
              /api/cron/paper-trade
            </code>{" "}
            ledgeren automatisk.
          </p>
          <p className="mt-2 text-[10px] font-mono text-cream/35">{error}</p>
        </div>
      </div>
    </div>
  );
}
