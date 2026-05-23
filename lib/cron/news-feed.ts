/**
 * Cron task #3 — refresh team international form + detect news.
 *
 * Phase-aware:
 *   pre    → 3 teams/run rotated → all 48 teams covered every 4 days
 *   during → SKIPPED. Result data comes via match-refresh instead.
 *   post   → SKIPPED.
 *
 * Per run: max 3 API calls. Pre-WC: 4 runs/day × 3 = 12 calls/day.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { TEAMS } from "@/lib/wc26-data";
import { getTeamForm } from "@/lib/team-form";
import { getAFTeamId } from "@/lib/api-football-ids";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

const TEAMS_PER_RUN = 3;
const CALLS_PER_TEAM = 1;

const globalForNews = globalThis as unknown as {
  __lastSeenMatch?: Record<number, string>;
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

  const phase = getPhase();
  if (phase !== "pre") {
    return {
      task,
      status: "skipped",
      summary: `Phase=${phase} — formdata kommer fra match-refresh`,
      detail: { phase, callsMade: 0 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // Rotate teams by hour-of-day so we cover all 48 in ~4 days at 4 runs/day.
  const mappableTeams = TEAMS.filter((t) => getAFTeamId(t.id) !== undefined);
  const hour = new Date().getUTCHours();
  const slot = Math.floor(hour / 6);                            // 0..3
  const dayOffset = Math.floor(Date.now() / 86400_000) % 4;     // 0..3 — staggers across days
  const baseSlot = (dayOffset * 4 + slot) * TEAMS_PER_RUN;
  const offset = baseSlot % Math.max(mappableTeams.length, 1);
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
  let callsMade = 0;

  for (const team of batch) {
    try {
      const form = await getTeamForm(team.id);
      callsMade += CALLS_PER_TEAM;
      if (form.source !== "api-football" || form.matches.length === 0) continue;

      const latest = form.matches[0];
      const prevSeen = lastSeen[team.id];

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
      // continue on per-team errors
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
    detail: {
      phase,
      news,
      probed: batch.map(t => t.shortName),
      slot,
      dayOffset,
      callsMade,
      capPerRun: TEAMS_PER_RUN * CALLS_PER_TEAM,
    },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
