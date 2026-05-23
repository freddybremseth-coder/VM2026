/**
 * In-memory store of the last completed cron run.
 *
 * Persists only within a single Vercel function instance — that's fine for the
 * /api/cron/status read endpoint since Vercel reuses warm instances and any
 * cold start just shows "no run yet" until the next 2-hour tick.
 *
 * If we later want history, swap this with a Supabase `cron_runs` table.
 */

import type { CronRunReport } from "./types";

// Stash on globalThis so HMR in dev and serverless reuse keep the latest run.
const globalForCron = globalThis as unknown as { __lastCronRun?: CronRunReport };

export function getLastCronRun(): CronRunReport | null {
  return globalForCron.__lastCronRun ?? null;
}

export function setLastCronRun(report: CronRunReport): void {
  globalForCron.__lastCronRun = report;
}
