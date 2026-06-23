/**
 * Paper-trading auto-pilot engine.
 *
 * A virtual betting ledger that proves whether the Dixon-Coles value model
 * actually makes money — before any real krone is risked:
 *
 *   placeNewBets()  — for every value bet the model currently flags (green,
 *                     +EV in the believable band) on an upcoming match that we
 *                     haven't already backed, "place" a bet at the live best
 *                     odds with a Kelly-sized stake off the running bankroll.
 *   settleOpenBets()— once a match is finished (we already ingest ESPN scores
 *                     into match_results), grade each open bet win/lost and
 *                     book the P&L.
 *   getPaperSummary()— bankroll, ROI, record, equity curve, open/settled lists
 *                     for the /tippemodell/autopilot dashboard.
 *
 * No real money, no betting API — purely a simulation against real results.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTippemodellDashboard, type MatchView } from "@/lib/tippemodell/dashboard";

const DEFAULT_BANKROLL = 1000;
/** Don't bother placing trivially small stakes. */
const MIN_STAKE = 1;

export interface PaperBet {
  id: number;
  matchId: number;
  marketKey: string;
  outcome: string;
  label: string;
  placedOdds: number;
  modelProb: number;
  kellyFraction: number;
  stake: number;
  status: "open" | "won" | "lost" | "void";
  payout: number | null;
  pnl: number | null;
  commenceAt: string;
  placedAt: string;
  settledAt: string | null;
}

interface BetRow {
  id: number;
  match_id: number;
  market_key: string;
  outcome: string;
  label: string;
  placed_odds: number;
  model_prob: number;
  kelly_fraction: number;
  stake: number;
  status: PaperBet["status"];
  payout: number | null;
  pnl: number | null;
  commence_at: string;
  placed_at: string;
  settled_at: string | null;
}

function rowToBet(r: BetRow): PaperBet {
  return {
    id: r.id,
    matchId: r.match_id,
    marketKey: r.market_key,
    outcome: r.outcome,
    label: r.label,
    placedOdds: Number(r.placed_odds),
    modelProb: Number(r.model_prob),
    kellyFraction: Number(r.kelly_fraction),
    stake: Number(r.stake),
    status: r.status,
    payout: r.payout === null ? null : Number(r.payout),
    pnl: r.pnl === null ? null : Number(r.pnl),
    commenceAt: r.commence_at,
    placedAt: r.placed_at,
    settledAt: r.settled_at,
  };
}

/** Did this selection win, given the final score? */
export function didWin(
  marketKey: string,
  outcome: string,
  home: number,
  away: number,
): boolean {
  const total = home + away;
  if (marketKey === "h2h") {
    if (outcome === "home") return home > away;
    if (outcome === "draw") return home === away;
    if (outcome === "away") return home < away;
  }
  if (marketKey === "totals") {
    if (outcome === "over") return total >= 3;
    if (outcome === "under") return total <= 2;
  }
  if (marketKey === "btts") {
    const both = home >= 1 && away >= 1;
    if (outcome === "yes") return both;
    if (outcome === "no") return !both;
  }
  return false;
}

// Accepts both the anon server client (reads) and the service-role admin
// client (writes) — only the shared query surface is used.
type Db = SupabaseClient;

async function startingBankroll(db: Db): Promise<number> {
  const { data } = await db
    .from("tm_paper_config")
    .select("starting_bankroll")
    .eq("id", 1)
    .maybeSingle();
  const v = (data as { starting_bankroll: number } | null)?.starting_bankroll;
  return v != null ? Number(v) : DEFAULT_BANKROLL;
}

/** Realized bankroll = starting + sum of settled P&L. Used to size Kelly. */
async function currentBankroll(db: Db, starting: number): Promise<number> {
  const { data } = await db
    .from("tm_paper_bets")
    .select("pnl")
    .not("pnl", "is", null);
  const realized = ((data ?? []) as Array<{ pnl: number }>).reduce(
    (s, b) => s + Number(b.pnl),
    0,
  );
  return starting + realized;
}

/** Build "Norge–Senegal · Over 2.5" style label for a flagged outcome. */
function pickLabel(m: MatchView, marketKey: string, label: string): string {
  const match = `${m.homeTeam}–${m.awayTeam}`;
  if (marketKey === "btts") return `${match} · Begge scorer: ${label}`;
  return `${match} · ${label}`;
}

/**
 * Place a virtual bet on every currently-flagged value outcome we haven't
 * already backed. Returns the number of new bets placed.
 */
export async function placeNewBets(db: Db): Promise<number> {
  const dashboard = await getTippemodellDashboard();
  if (dashboard.length === 0) return 0;

  const starting = await startingBankroll(db);
  const bankroll = await currentBankroll(db, starting);

  // Which selections do we already hold? (match_id|market|outcome)
  const { data: existing } = await db
    .from("tm_paper_bets")
    .select("match_id, market_key, outcome");
  const held = new Set(
    ((existing ?? []) as Array<{ match_id: number; market_key: string; outcome: string }>).map(
      (b) => `${b.match_id}|${b.market_key}|${b.outcome}`,
    ),
  );

  const rows: Array<Record<string, unknown>> = [];
  for (const m of dashboard) {
    const markets: Array<{ key: string; list: typeof m.outcomes }> = [
      { key: "h2h", list: m.outcomes },
      { key: "totals", list: m.totals ?? [] },
      { key: "btts", list: m.btts ?? [] },
    ];
    for (const { key, list } of markets) {
      for (const o of list) {
        if (!o.modelValue || !o.best || o.kelly === null || o.modelProb === null) continue;
        const id = `${m.matchId}|${key}|${o.outcome}`;
        if (held.has(id)) continue;
        const stake = Math.round(o.kelly * bankroll * 100) / 100;
        if (stake < MIN_STAKE) continue;
        held.add(id);
        rows.push({
          match_id: m.matchId,
          market_key: key,
          outcome: o.outcome,
          label: pickLabel(m, key, o.label),
          placed_odds: o.best.price,
          model_prob: o.modelProb,
          kelly_fraction: o.kelly,
          stake,
          status: "open",
          commence_at: m.commenceAt,
        });
      }
    }
  }

  if (rows.length === 0) return 0;
  const { error } = await db.from("tm_paper_bets").insert(rows);
  if (error) throw new Error(`place bets: ${error.message}`);
  return rows.length;
}

/**
 * Settle every open bet whose match has a finished result. Returns the number
 * of bets settled.
 */
export async function settleOpenBets(db: Db): Promise<number> {
  const { data: openRaw } = await db
    .from("tm_paper_bets")
    .select("id, match_id, market_key, outcome, placed_odds, stake")
    .eq("status", "open");
  const open = (openRaw ?? []) as Array<{
    id: number;
    match_id: number;
    market_key: string;
    outcome: string;
    placed_odds: number;
    stake: number;
  }>;
  if (open.length === 0) return 0;

  const matchIds = [...new Set(open.map((b) => b.match_id))];
  const { data: resRaw } = await db
    .from("match_results")
    .select("match_id, home_score, away_score, status")
    .in("match_id", matchIds)
    .eq("status", "finished");
  const results = new Map(
    ((resRaw ?? []) as Array<{ match_id: number; home_score: number; away_score: number }>).map(
      (r) => [r.match_id, r],
    ),
  );

  let settled = 0;
  for (const b of open) {
    const res = results.get(b.match_id);
    if (!res) continue;
    const won = didWin(b.market_key, b.outcome, Number(res.home_score), Number(res.away_score));
    const stake = Number(b.stake);
    const payout = won ? Math.round(stake * Number(b.placed_odds) * 100) / 100 : 0;
    const pnl = Math.round((payout - stake) * 100) / 100;
    const { error } = await db
      .from("tm_paper_bets")
      .update({
        status: won ? "won" : "lost",
        payout,
        pnl,
        settled_at: new Date().toISOString(),
      })
      .eq("id", b.id);
    if (!error) settled++;
  }
  return settled;
}

export interface PaperSummary {
  startingBankroll: number;
  bankroll: number; // starting + realized P&L
  openExposure: number; // sum of open stakes
  totalStaked: number; // settled stakes
  totalPnl: number; // settled P&L
  roi: number | null; // pnl / staked
  won: number;
  lost: number;
  hitRate: number | null;
  openBets: PaperBet[];
  settledBets: PaperBet[];
  /** Equity curve: bankroll after each settled bet, in settlement order. */
  curve: Array<{ t: string; bankroll: number; label: string }>;
}

export async function getPaperSummary(): Promise<PaperSummary> {
  const db = createSupabaseServerClient();
  const starting = await startingBankroll(db);

  const { data: betsRaw } = await db
    .from("tm_paper_bets")
    .select("*")
    .order("commence_at", { ascending: true });
  const bets = ((betsRaw ?? []) as BetRow[]).map(rowToBet);

  const open = bets.filter((b) => b.status === "open");
  const settled = bets
    .filter((b) => b.status === "won" || b.status === "lost")
    .sort((a, b) => (a.settledAt ?? "").localeCompare(b.settledAt ?? ""));

  const totalStaked = settled.reduce((s, b) => s + b.stake, 0);
  const totalPnl = settled.reduce((s, b) => s + (b.pnl ?? 0), 0);
  const won = settled.filter((b) => b.status === "won").length;
  const lost = settled.filter((b) => b.status === "lost").length;
  const openExposure = open.reduce((s, b) => s + b.stake, 0);

  let running = starting;
  const curve: PaperSummary["curve"] = [
    { t: "start", bankroll: starting, label: "Start" },
  ];
  for (const b of settled) {
    running = Math.round((running + (b.pnl ?? 0)) * 100) / 100;
    curve.push({ t: b.settledAt ?? b.commenceAt, bankroll: running, label: b.label });
  }

  return {
    startingBankroll: starting,
    bankroll: Math.round((starting + totalPnl) * 100) / 100,
    openExposure: Math.round(openExposure * 100) / 100,
    totalStaked: Math.round(totalStaked * 100) / 100,
    totalPnl: Math.round(totalPnl * 100) / 100,
    roi: totalStaked > 0 ? totalPnl / totalStaked : null,
    won,
    lost,
    hitRate: won + lost > 0 ? won / (won + lost) : null,
    openBets: open.sort((a, b) => a.commenceAt.localeCompare(b.commenceAt)),
    settledBets: settled.reverse(),
    curve,
  };
}
