/**
 * Cron task #3 — refresh team international form + surface "news".
 *
 * "News" in v1 means: any team where the most-recent international match
 * post-dates the timestamp we previously cached. We refresh the form data
 * for the 48 WC teams (mapped to API-Football IDs) and detect which teams
 * have a new result since the last cron run.
 *
 * The detected results are returned as the report and also pushed into
 * revalidatePath so the home / norge / team pages serve the fresh form.
 *
 * Quota note: 48 teams ÷ 4 candidates per run = 12 runs / day = full cycle
 * every 24h. We rotate the candidate window by hour-of-day so every team
 * eventually gets refreshed without burning the 100-req daily budget.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { TEAMS } from "@/lib/wc26-data";
import { getTeamForm } from "@/lib/team-form";
import { getAFTeamId } from "@/lib/api-football-ids";
import type { CronTaskResult } from "./types";

const TEAMS_PER_RUN = 4;

// Track latest fetched-match per team across instances (in-memory, best-effort)
const globalForNews = globalThis as unknown as {
  __lastSeenMatch?: Record<number, string>; // teamId -> ISO date
};

export async function refreshFormAndDetectNews(): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "refresh-form-detect-news";

  if (!process.env.API_FOOTBALL_KEY) {
    return {
      task,
      status: "skipped",
      summary: "API_FOOTBALL_KEY not set",
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // Rotate which teams to probe based on hour-of-day so we cover all 48
  // teams in a 24-hour cycle without exceeding the free-tier quota.
  const mappableTeams = TEAMS.filter((t) => getAFTeamId(t.id) !== undefined);
  const hour = new Date().getUTCHours(); // 0..23
  // Two runs per hour (every 2h = 12 runs/day). With 4 teams each = 48 / day.
  const slot = Math.floor(hour / 2);
  const offset = (slot * TEAMS_PER_RUN) % mappableTeams.length;
  const batch = mappableTeams.slice(offset, offset + TEAMS_PER_RUN);

  const news: Array<{
    teamId: number;
    teamName: string;
    lastResult: {
      date: string;
      opponent: string;
      scoreFor: number;
      scoreAgainst: number;
      result: "W" | "D" | "L";
    };
  }> = [];

  const lastSeen = (globalForNews.__lastSeenMatch ??= {});

  for (const team of batch) {
    try {
      const form = await getTeamForm(team.id);
      if (form.source !== "api-football" || form.matches.length === 0) continue;

      const latest = form.matches[0]; // most-recent first
      const prevSeen = lastSeen[team.id];

      // New match detected → it's news.
      if (!prevSeen || latest.date > prevSeen) {
        news.push({
          teamId: team.id,
          teamName: team.name,
          lastResult: {
            date: latest.date,
            opponent: latest.opponent,
            scoreFor: latest.goalsFor,
            scoreAgainst: latest.goalsAgainst,
            result: latest.result,
          },
        });
        revalidatePath(`/teams/${team.id}`);
      }

      lastSeen[team.id] = latest.date;
    } catch {
      // Swallow per-team errors so one bad fetch doesn't kill the whole run.
    }
  }

  if (news.length > 0) {
    revalidatePath("/norge");
    revalidatePath("/");
    revalidateTag("team-form");
  }

  return {
    task,
    status: "ok",
    summary:
      news.length === 0
        ? `Form refreshet for ${batch.length} lag — ingen nye resultater`
        : `${news.length} nye landskampresultater oppdaget`,
    detail: { news, probed: batch.map((t) => t.shortName), slot },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
