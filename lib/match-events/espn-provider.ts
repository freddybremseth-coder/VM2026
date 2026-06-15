/**
 * ESPN match-events provider — drop-in replacement for api-football-provider.ts.
 *
 * Pulls per-fixture scoring details from ESPN's public summary endpoint:
 *   GET https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event={espnId}
 *
 * No API key required. The `details` array on competitions[0] carries every
 * scoring play, red card, and own goal with athlete name, minute, and flags
 * we need for tournament_goals.
 *
 * Team identification: rather than maintain a parallel ESPN_TEAM_ID map, we
 * match ESPN team names against TEAMS in wc26-data via normalized lookup +
 * an alias table. ONE source of truth for team identity (the canonical
 * names in wc26-data.ts).
 */

import { TEAMS, teamById } from "@/lib/wc26-data";
import { getEspnFixtureId, mapEspnStatus } from "@/lib/cron/espn-fixture-resolver";
import type { MatchEventData } from "./types";

const SUMMARY_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary";

// ---------------------------------------------------------------------------
// ESPN summary raw types (only what we need)
// ---------------------------------------------------------------------------
interface EspnDetailAthlete {
  id: string;
  displayName: string;
  shortName?: string;
}

interface EspnDetail {
  clock: { value: number; displayValue: string };
  scoringPlay: boolean;
  team: { id: string; displayName: string; abbreviation: string };
  participants: Array<{ athlete: EspnDetailAthlete }>;
  addedClock?: { value: number; displayValue: string };
  redCard?: boolean;
  penaltyKick?: boolean;
  ownGoal?: boolean;
}

interface EspnCompetition {
  competitors: Array<{
    id: string;
    homeAway: "home" | "away";
    score?: string;
    team: { id: string; displayName: string; abbreviation: string };
  }>;
  details?: EspnDetail[];
  /** Status lives here on the summary endpoint (not on header). */
  status?: { type: { name: string; detail?: string; shortDetail?: string } };
}

interface EspnSummary {
  header?: {
    competitions?: EspnCompetition[];
  };
}

async function fetchSummary(espnId: string): Promise<EspnSummary> {
  const res = await fetch(`${SUMMARY_URL}?event=${espnId}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`espn summary: ${res.status} ${res.statusText}`);
  return (await res.json()) as EspnSummary;
}

// ---------------------------------------------------------------------------
// Team-name → internal team id lookup
// ---------------------------------------------------------------------------
function normName(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  return ALIASES[base] ?? base;
}

const ALIASES: Record<string, string> = {
  czechrepublic: "czechia",
  turkey: "turkiye",
  ivorycoast: "cotedivoire",
  korearepublic: "southkorea",
  korearep: "southkorea",
  unitedstates: "usa",
  unitedstatesofamerica: "usa",
  capeverdeislands: "capeverde",
  caboverde: "capeverde",
  irislamicrepublicofiran: "iran",
  bosnia: "bosniaandherzegovina",
  // ESPN renders this with a hyphen ("Bosnia-Herzegovina") which normalises
  // to "bosniaherzegovina" without the connector — alias both variants so
  // goal events from ESPN match wc26-data's canonical name.
  bosniaherzegovina: "bosniaandherzegovina",
};

// Build the lookup once at module load.
const INTERNAL_BY_NAME: Map<string, number> = (() => {
  const m = new Map<string, number>();
  for (const t of TEAMS) m.set(normName(t.name), t.id);
  return m;
})();

function internalTeamIdByName(name: string): number | null {
  return INTERNAL_BY_NAME.get(normName(name)) ?? null;
}

// ---------------------------------------------------------------------------
// Status mapping for the wider MatchEventData status enum
// ---------------------------------------------------------------------------
function mapStatusForEventData(name: string): MatchEventData["status"] {
  return mapEspnStatus(name);
}

// ---------------------------------------------------------------------------
// Public surface — matches api-football-provider exports
// ---------------------------------------------------------------------------

export interface FixtureScore {
  matchId: number;
  status: MatchEventData["status"];
  minute: number | null;
  homeScore: number | null;
  awayScore: number | null;
}

export async function fetchEspnScore(matchId: number): Promise<FixtureScore> {
  const espnId = await getEspnFixtureId(matchId);
  const s = await fetchSummary(espnId);
  const comp = s.header?.competitions?.[0];
  if (!comp) throw new Error(`No competition for espn id ${espnId}`);
  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;
  const statusName = comp.status?.type.name ?? "STATUS_SCHEDULED";
  const detail = comp.status?.type.shortDetail ?? "";
  let minute: number | null = null;
  if (mapEspnStatus(statusName) === "live") {
    const m = detail.match(/(\d+)/);
    if (m) minute = Math.min(130, Math.max(1, Number(m[1])));
  }
  const toScore = (v?: string) => (v === undefined || v === "" ? null : Number(v));
  return {
    matchId,
    status: mapStatusForEventData(statusName),
    minute,
    homeScore: toScore(home.score),
    awayScore: toScore(away.score),
  };
}

/**
 * One scored goal in a fixture. The `internalTeamId` is the team CREDITED
 * with the goal — for an own goal that's the OPPOSING team. The caller
 * (sync-goals) used to do an AF→internal team id translation; with ESPN we
 * resolve to internal ids inside this provider directly.
 */
export interface MatchGoal {
  matchId: number;
  /** Internal WCTeam.id of the team credited with the goal. */
  internalTeamId: number;
  scorerName: string;
  assistName: string | null;
  minute: number;
  isOwnGoal: boolean;
  isPenalty: boolean;
}

export interface MatchGoalsResult {
  goals: MatchGoal[];
  /** Internal team ids of the two competitors, if resolvable. */
  homeInternalTeamId: number | null;
  awayInternalTeamId: number | null;
}

export async function fetchEspnGoals(matchId: number): Promise<MatchGoalsResult> {
  const espnId = await getEspnFixtureId(matchId);
  const s = await fetchSummary(espnId);
  const comp = s.header?.competitions?.[0];
  if (!comp) throw new Error(`No competition for espn id ${espnId}`);
  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;
  const homeInternal = internalTeamIdByName(home.team.displayName);
  const awayInternal = internalTeamIdByName(away.team.displayName);
  const details = comp.details ?? [];

  const goals: MatchGoal[] = [];
  for (const d of details) {
    if (!d.scoringPlay) continue; // skip cards, subs, etc.
    const isOwn = Boolean(d.ownGoal);
    const isPenalty = Boolean(d.penaltyKick);
    const eventInternal = internalTeamIdByName(d.team.displayName);
    // For an own goal, credit the OPPOSING team.
    let creditedInternal: number | null;
    if (isOwn) {
      creditedInternal =
        eventInternal === homeInternal ? awayInternal : homeInternal;
    } else {
      creditedInternal = eventInternal;
    }
    if (!creditedInternal) continue; // team unresolved — let sync count as unresolved

    const participants = d.participants ?? [];
    const scorerName = participants[0]?.athlete.displayName ?? "Unknown";
    const assistName = participants[1]?.athlete.displayName ?? null;

    // ESPN clock.value is seconds elapsed (e.g. 513 for 9' minute). Convert
    // to minutes with addedClock taken into account.
    const baseMin = Math.max(1, Math.round(d.clock.value / 60));
    const added = d.addedClock?.value ? Math.round(d.addedClock.value / 60) : 0;
    const minute = Math.min(130, baseMin + added);

    goals.push({
      matchId,
      internalTeamId: creditedInternal,
      scorerName,
      assistName,
      minute,
      isOwnGoal: isOwn,
      isPenalty,
    });
  }

  return {
    goals,
    homeInternalTeamId: homeInternal,
    awayInternalTeamId: awayInternal,
  };
}

/**
 * Stub for the visualization surface. ESPN doesn't expose per-shot xG or
 * heatmaps on the public endpoint, but we can synthesize a basic timeline
 * from scoring events so the existing UI doesn't break.
 */
export async function fetchEspnEvents(matchId: number): Promise<MatchEventData> {
  const espnId = await getEspnFixtureId(matchId);
  const s = await fetchSummary(espnId);
  const comp = s.header?.competitions?.[0];
  if (!comp) throw new Error(`No competition for espn id ${espnId}`);
  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;
  const homeName = home.team.displayName;
  const awayName = away.team.displayName;
  const homeId = home.team.id;

  const statusName = comp.status?.type.name ?? "STATUS_SCHEDULED";
  const status = mapStatusForEventData(statusName);

  // Build a coarse shot list from scoring details. We don't have real coords
  // or xG values, so seed plausible placeholders so the existing UI renders.
  const details = comp.details ?? [];
  const shots = details
    .filter((d) => d.scoringPlay || d.penaltyKick)
    .map((d, idx) => {
      const side: "home" | "away" = d.team.id === homeId ? "home" : "away";
      const isPenalty = Boolean(d.penaltyKick);
      const isOwn = Boolean(d.ownGoal);
      const xg = isPenalty ? 0.79 : d.scoringPlay ? 0.35 : 0.1;
      return {
        id: `espn-${idx}`,
        minute: Math.max(1, Math.round(d.clock.value / 60)),
        addedMinute: d.addedClock?.value ? Math.round(d.addedClock.value / 60) : undefined,
        side,
        playerName: d.participants?.[0]?.athlete.displayName ?? "Unknown",
        x: 88 + (Math.random() * 8 - 4),
        y: 50 + (Math.random() * 16 - 8),
        xg,
        outcome: isOwn ? ("own-goal" as const) : d.scoringPlay ? ("goal" as const) : ("saved" as const),
        situation: isPenalty ? ("penalty" as const) : undefined,
        assistedBy: d.participants?.[1]?.athlete.displayName,
      };
    });

  // Cumulative xG timeline
  const timeline: Array<{ minute: number; home: number; away: number }> = [
    { minute: 0, home: 0, away: 0 },
  ];
  let h = 0;
  let a = 0;
  for (const sh of [...shots].sort((x, y) => x.minute - y.minute)) {
    if (sh.side === "home") h += sh.xg;
    else a += sh.xg;
    timeline.push({ minute: sh.minute, home: +h.toFixed(3), away: +a.toFixed(3) });
  }

  return {
    matchId,
    status,
    minute: undefined,
    homeName,
    awayName,
    homeShort: home.team.abbreviation.slice(0, 3).toUpperCase(),
    awayShort: away.team.abbreviation.slice(0, 3).toUpperCase(),
    xgTimeline: timeline,
    shots,
    heatmaps: undefined,
    source: "espn",
    generatedAt: new Date().toISOString(),
  };
}
