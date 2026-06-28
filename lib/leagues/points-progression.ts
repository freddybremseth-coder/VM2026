/**
 * Points progression — how each league member's score has developed day by
 * day through the tournament.
 *
 * predictions.points_awarded is set by the match_results grading trigger the
 * moment a match finishes (3 exact / 1 outcome / 0), so a non-null value means
 * the tip was graded. We bucket each graded tip by its match's calendar day
 * (from the static FIXTURES kickoff), sum per user per day, then carry a
 * running total forward so every player has a cumulative value on every day a
 * match was decided. The slope between days is the player's form; `lastDelta`
 * is the points gained on the most recent decided day (the trend arrow).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { FIXTURES } from "@/lib/wc26-fixtures";

export interface ProgressionPlayer {
  userId: string;
  label: string;
  /** Cumulative points after each day in `days` (same length/order). */
  cumulative: number[];
  /** Final total (== last cumulative, or 0). */
  total: number;
  /** Points gained on the most recent decided day — the trend signal. */
  lastDelta: number;
}

export interface PointsProgression {
  /** Day labels "dd.MM", chronological. */
  days: string[];
  players: ProgressionPlayer[];
  /** Recharts rows: { day, [label]: cumulativePoints, ... }. */
  rows: Array<Record<string, number | string>>;
}

const fixtureDay = (() => {
  const m = new Map<number, string>();
  for (const f of FIXTURES) m.set(f.id, f.kickoff.slice(0, 10)); // YYYY-MM-DD
  return m;
})();

function dayLabel(isoDay: string): string {
  const [, mm, dd] = isoDay.split("-");
  return `${dd}.${mm}`;
}

export async function getPointsProgression(
  supabase: SupabaseClient,
  members: Array<{ userId: string; label: string }>,
): Promise<PointsProgression | null> {
  if (members.length === 0) return null;
  const userIds = members.map((m) => m.userId);

  const { data } = await supabase
    .from("predictions")
    .select("user_id, match_id, points_awarded")
    .in("user_id", userIds)
    .not("points_awarded", "is", null);
  const graded = (data ?? []) as Array<{
    user_id: string;
    match_id: number;
    points_awarded: number;
  }>;
  if (graded.length === 0) return null;

  // user -> day -> summed points
  const byUserDay = new Map<string, Map<string, number>>();
  const dayset = new Set<string>();
  for (const g of graded) {
    const day = fixtureDay.get(g.match_id);
    if (!day) continue;
    dayset.add(day);
    let dm = byUserDay.get(g.user_id);
    if (!dm) {
      dm = new Map();
      byUserDay.set(g.user_id, dm);
    }
    dm.set(day, (dm.get(day) ?? 0) + Number(g.points_awarded));
  }

  const isoDays = [...dayset].sort();
  if (isoDays.length === 0) return null;
  const days = isoDays.map(dayLabel);

  const players: ProgressionPlayer[] = members.map((m) => {
    const dm = byUserDay.get(m.userId);
    const cumulative: number[] = [];
    let running = 0;
    let lastDelta = 0;
    for (const iso of isoDays) {
      const gained = dm?.get(iso) ?? 0;
      running += gained;
      cumulative.push(running);
      lastDelta = gained; // ends as the final (most recent) day's gain
    }
    return { userId: m.userId, label: m.label, cumulative, total: running, lastDelta };
  });

  // Recharts rows.
  const rows = isoDays.map((iso, i) => {
    const row: Record<string, number | string> = { day: days[i] };
    for (const p of players) row[p.label] = p.cumulative[i];
    return row;
  });

  return { days, players, rows };
}
