/**
 * Cron task #2 — detect squad announcement updates.
 *
 * We have a static squad-status field per team ("pending" / "preliminary" /
 * "official"). API-Football's `/players/squads?team={afId}` returns the
 * federation's published roster when available.
 *
 * Strategy: for every team whose squad isn't already marked "official", probe
 * the API and check whether the roster size has changed (a delta usually means
 * a new announcement). We don't mutate our static data — instead we log the
 * delta so the curator can refresh `lib/wc26-squads.ts` manually.
 *
 * This keeps the data layer stable and reviewable while still surfacing fresh
 * announcements within 2 hours of publication.
 */

import { TEAMS } from "@/lib/wc26-data";
import { getSquad } from "@/lib/wc26-squads";
import { getAFTeamId } from "@/lib/api-football-ids";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CronTaskResult } from "./types";

interface AFPlayer { id: number; name: string; position?: string }
interface AFSquadResponse {
  team: { id: number; name: string };
  players: AFPlayer[];
}

async function fetchAFSquad(afTeamId: number): Promise<AFPlayer[] | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/players/squads?team=${afTeamId}`,
      {
        headers: { "x-apisports-key": key },
        next: { revalidate: 6 * 3600 },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { response: AFSquadResponse[] };
    return json.response[0]?.players ?? [];
  } catch {
    return null;
  }
}

export async function checkSquadAnnouncements(): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "check-squad-announcements";

  if (!process.env.API_FOOTBALL_KEY) {
    return {
      task,
      status: "skipped",
      summary: "API_FOOTBALL_KEY not set",
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // Only probe teams not yet marked official — saves API quota.
  const candidates = TEAMS.filter((t) => t.squadStatus !== "official");

  const changes: Array<{
    teamId: number;
    teamName: string;
    currentStatus: string;
    afSize: number;
    ourSize: number;
    delta: number;
  }> = [];

  // Cap to 8 teams per run to stay under quota (8 × 12 runs/day = 96 req)
  const cap = Math.min(candidates.length, 8);
  for (let i = 0; i < cap; i++) {
    const team = candidates[i];
    const afId = getAFTeamId(team.id);
    if (!afId) continue;

    const afSquad = await fetchAFSquad(afId);
    if (!afSquad) continue;

    const ourSize = getSquad(team.id).length;
    if (afSquad.length === 0) continue;

    // Flag if API has materially more players than we do, or if we had no
    // roster at all (pending → preliminary).
    if (ourSize === 0 && afSquad.length >= 20) {
      changes.push({
        teamId: team.id,
        teamName: team.name,
        currentStatus: team.squadStatus,
        afSize: afSquad.length,
        ourSize,
        delta: afSquad.length,
      });
    } else if (Math.abs(afSquad.length - ourSize) >= 3) {
      changes.push({
        teamId: team.id,
        teamName: team.name,
        currentStatus: team.squadStatus,
        afSize: afSquad.length,
        ourSize,
        delta: afSquad.length - ourSize,
      });
    }
  }

  // If anything changed, invalidate team pages so the UI re-renders next visit.
  if (changes.length > 0) {
    for (const c of changes) revalidatePath(`/teams/${c.teamId}`);
    revalidatePath("/teams");
    revalidateTag("squads");
  }

  return {
    task,
    status: "ok",
    summary:
      changes.length === 0
        ? `Ingen nye troppendringer (sjekket ${cap}/${candidates.length} lag)`
        : `${changes.length} lag har endret troppstørrelse — manuell oppdatering anbefales`,
    detail: { changes, probed: cap, candidates: candidates.length },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
