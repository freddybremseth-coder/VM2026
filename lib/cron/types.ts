/**
 * Shared types for the periodic refresh worker.
 *
 * Every cron task returns a CronTaskResult so the orchestrator can build
 * a single summary report that's logged to Vercel + cached in memory for
 * /api/cron/status.
 */

export interface CronTaskResult {
  /** Human-friendly task name shown in logs / status UI. */
  task: string;
  /** ok = ran cleanly. skipped = couldn't run (e.g. no API key). failed = threw. */
  status: "ok" | "skipped" | "failed";
  /** Optional one-line summary, e.g. "3 finished matches refreshed". */
  summary?: string;
  /** Optional structured detail (list of changed items, error message, etc.). */
  detail?: unknown;
  /** Duration in ms. */
  durationMs: number;
}

export interface CronRunReport {
  /** ISO timestamp the run started. */
  startedAt: string;
  /** ISO timestamp the run finished. */
  finishedAt: string;
  /** Total wall-clock duration in ms. */
  durationMs: number;
  /** Per-task results in execution order. */
  tasks: CronTaskResult[];
  /** True when every task returned "ok" or "skipped". */
  ok: boolean;
  /** Tournament phase at run time (pre/during/post). */
  phase: "pre" | "during" | "post";
  /** Total estimated API-Football calls made this run. */
  callsMade: number;
  /** Projected daily ceiling based on the cron schedule × the cap per run. */
  dailyBudgetEstimate: number;
}
