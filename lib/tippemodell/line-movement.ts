/**
 * Line-movement loader — reconstructs how the best 1X2 price moved over
 * time for a single match from the tm_odds_snapshots history.
 *
 * Each cron tick inserts a fresh snapshot set at one captured_at timestamp,
 * so grouping snapshots by captured_at and taking the best price per outcome
 * at each timestamp gives a clean time series of the market's best line.
 *
 * Returned series is chronological (oldest → newest) and ready to hand
 * straight to a Recharts LineChart.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LinePoint {
  /** ISO timestamp of the snapshot batch. */
  t: string;
  /** Best available decimal odds at that time, per outcome. */
  home: number | null;
  draw: number | null;
  away: number | null;
}

export interface LineMovement {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  commenceAt: string;
  points: LinePoint[];
  /** Distinct snapshot batches we found. */
  snapshots: number;
}

interface SnapshotRow {
  outcome: string;
  price: number;
  captured_at: string;
}

interface MatchRow {
  id: number;
  home_team: string;
  away_team: string;
  commence_at: string;
}

export async function getLineMovement(
  matchId: number,
): Promise<LineMovement | null> {
  const supabase = createSupabaseServerClient();

  const { data: matchData } = await supabase
    .from("tm_matches")
    .select("id, home_team, away_team, commence_at")
    .eq("id", matchId)
    .maybeSingle();
  const match = matchData as MatchRow | null;
  if (!match) return null;

  const { data: marketData } = await supabase
    .from("tm_markets")
    .select("id")
    .eq("key", "h2h")
    .maybeSingle();
  const market = marketData as { id: number } | null;
  if (!market) return null;

  // All snapshots for this match + 1X2, chronological.
  const { data: snapData } = await supabase
    .from("tm_odds_snapshots")
    .select("outcome, price, captured_at")
    .eq("match_id", matchId)
    .eq("market_id", market.id)
    .order("captured_at", { ascending: true });
  const snaps = (snapData ?? []) as SnapshotRow[];

  // Group by captured_at → best price per outcome at each timestamp.
  const byTime = new Map<string, { home: number; draw: number; away: number }>();
  for (const s of snaps) {
    const slot = byTime.get(s.captured_at) ?? { home: 0, draw: 0, away: 0 };
    const price = Number(s.price);
    if (s.outcome === "home") slot.home = Math.max(slot.home, price);
    else if (s.outcome === "draw") slot.draw = Math.max(slot.draw, price);
    else if (s.outcome === "away") slot.away = Math.max(slot.away, price);
    byTime.set(s.captured_at, slot);
  }

  const points: LinePoint[] = [...byTime.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([t, v]) => ({
      t,
      home: v.home > 0 ? v.home : null,
      draw: v.draw > 0 ? v.draw : null,
      away: v.away > 0 ? v.away : null,
    }));

  return {
    matchId: match.id,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    commenceAt: match.commence_at,
    points,
    snapshots: points.length,
  };
}
