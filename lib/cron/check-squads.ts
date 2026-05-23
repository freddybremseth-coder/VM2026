/**
 * Cron task #2 — detect squad announcement updates.
 *
 * Phase-aware: only runs in "pre" phase. Once the WC starts every team has
 * announced their squad and there's nothing left to detect. After the WC
 * starts this task is skipped entirely.
 *
 * Per run we probe at most 3 teams (3 calls/run). Pre-WC: 4 runs/day × 3
 * calls = 12 calls/day for squad checks. With ~15 teams not yet "official"
 * we cycle through everyone in ~5 days, well before the deadline.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { TEAMS } from "@/lib/wc26-data";
import { getSquad } from "@/lib/wc26-squads";
import { getAFTeamId } from "@/lib/api-football-ids";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

const MAX_TEAMS_PER_RUN = 3;
const CALLS_PER_TEAM = 1;

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

  const phase = getPhase();
  if (phase !== "pre") {
    return {
      task,
      status: "skipped",
      summary: `Phase=${phase} — alle tropper er annonsert`,
      detail: { phase, callsMade: 0 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // Rotate the slice of "not yet official" teams we probe each run, keyed on
  // hour-of-day so every team gets a turn over the day.
  const candidates = TEAMS.filter((t) => t.squadStatus !== "official");
  if (candidates.length === 0) {
    return {
      task,
      status: "ok",
      summary: "Alle lag allerede markert official",
      detail: { phase, callsMade: 0 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const hour = new Date().getUTCHours(); // 0..23
  const slot = Math.floor(hour / 6);     // 0..3 (matches 6h cron interval)
  const offset = (slot * MAX_TEAMS_PER_RUN) % Math.max(candidates.length, 1);
  const batch = candidates.slice(offset, offset + MAX_TEAMS_PER_RUN);

  const changes: Array<{
    teamId: number;
    teamName: string;
    currentStatus: string;
    afSize: number;
    ourSize: number;
    delta: number;
  }> = [];
  let callsMade = 0;

  for (const team of batch) {
    const afId = getAFTeamId(team.id);
    if (!afId) continue;

    const afSquad = await fetchAFSquad(afId);
    callsMade += CALLS_PER_TEAM;
    if (!afSquad) continue;

    const ourSize = getSquad(team.id).length;
    if (afSquad.length === 0) continue;

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
        ? `Sjekket ${batch.length}/${candidates.length} ufullstendige lag — ingen endringer`
        : `${changes.length} lag har endret troppstørrelse — manuell oppdatering anbefales`,
    detail: { phase, changes, probed: batch.map(t => t.shortName), candidates: candidates.length, callsMade, capPerRun: MAX_TEAMS_PER_RUN * CALLS_PER_TEAM },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
