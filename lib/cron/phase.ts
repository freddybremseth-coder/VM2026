/**
 * Tournament phase detection — determines which cron tasks should run.
 *
 *   "pre"    → WC hasn't started. Focus on form + squad announcements.
 *   "during" → WC is live. Focus on match results; squads are locked.
 *   "post"   → WC over. Cron can mostly idle.
 *
 * Used by every cron task to short-circuit when irrelevant for the current
 * phase. This keeps the daily API-Football call budget predictable.
 *
 * Budget targets (free tier: 100 calls/day):
 *   pre    → ~28 calls/day  (squad + form rotation)
 *   during → ~60 calls/day  (match refresh only)
 *   post   → ~0 calls/day
 *
 * Combined with page-load-driven fetches (~16-32/day from /norge + /teams)
 * we stay well under the cap.
 */

import { TOURNAMENT } from "@/lib/wc26-data";

export type Phase = "pre" | "during" | "post";

export function getPhase(now: Date = new Date()): Phase {
  const start = new Date(TOURNAMENT.startDate + "T00:00:00Z");
  // Tournament ends after the final. End-date in TOURNAMENT is the final date.
  const end = new Date(TOURNAMENT.endDate + "T23:59:59Z");

  if (now < start) return "pre";
  if (now > end) return "post";
  return "during";
}

/** Pretty label for the admin UI. */
export function phaseLabel(p: Phase): string {
  return p === "pre" ? "Før VM" : p === "during" ? "Under VM" : "Etter VM";
}

/** Days until kickoff (negative if already started). */
export function daysToKickoff(now: Date = new Date()): number {
  const start = new Date(TOURNAMENT.startDate + "T00:00:00Z");
  return Math.ceil((start.getTime() - now.getTime()) / 86400_000);
}
