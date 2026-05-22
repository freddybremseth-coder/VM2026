/**
 * API-Football provider (api-football.com / RapidAPI).
 *
 * Set `API_FOOTBALL_KEY` in .env.local to activate.
 * Free plan: 100 req/day, covers all live group-stage matches.
 *
 * Docs:
 *   GET /fixtures/events?fixture={id}
 *   GET /fixtures/statistics?fixture={id}
 *   GET /fixtures/players?fixture={id}
 *
 * We map their response to our MatchEventData shape.
 */

import type { MatchEventData, ShotEvent, XGTimelinePoint, PlayerHeatmap } from "./types";

const BASE_URL = "https://v3.football.api-sports.io";

async function apiFetch<T>(path: string): Promise<T> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": key },
    next: { revalidate: 30 }, // ISR cache — fresh every 30s during live matches
  });
  if (!res.ok) throw new Error(`api-football: ${res.status} ${res.statusText}`);
  const json = (await res.json()) as { response: T };
  return json.response;
}

// ---------------------------------------------------------------------------
// API-Football raw types (simplified — only what we need)
// ---------------------------------------------------------------------------
interface AFFixture {
  fixture: { id: number; status: { short: string; elapsed: number | null } };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
}

interface AFEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;   // "Goal", "Card", "Var", "subst"
  detail: string; // "Normal Goal", "Penalty", "Own Goal", "Yellow Card", ...
  comments: string | null;
}

interface AFStat {
  team: { id: number; name: string };
  statistics: Array<{ type: string; value: number | string | null }>;
}

// ---------------------------------------------------------------------------
// Status mapper
// ---------------------------------------------------------------------------
function mapStatus(short: string): MatchEventData["status"] {
  if (["FT", "AET", "PEN"].includes(short)) return "finished";
  if (short === "HT") return "halftime";
  if (["1H", "2H", "ET", "P"].includes(short)) return "live";
  return "scheduled";
}

// ---------------------------------------------------------------------------
// Build a shot list from goals + limited event data.
// API-Football free tier does NOT expose per-shot xG — we derive a rough proxy
// from the event type and minute.
// ---------------------------------------------------------------------------
function eventsToShots(
  events: AFEvent[],
  homeId: number,
): ShotEvent[] {
  const shots: ShotEvent[] = [];
  let idx = 0;

  for (const ev of events) {
    if (ev.type !== "Goal" && ev.type !== "Shot") continue;

    const side: "home" | "away" = ev.team.id === homeId ? "home" : "away";
    const isGoal = ev.type === "Goal" && ev.detail !== "Missed Penalty";
    const isPenalty = ev.detail === "Penalty";
    const isOwnGoal = ev.detail === "Own Goal";

    // Derive an approximate xG based on situation
    let xg = 0.08;
    if (isPenalty) xg = 0.79;
    else if (ev.detail === "Header") xg = 0.12;
    else if (isGoal) xg = 0.35;

    shots.push({
      id: `af-${++idx}`,
      minute: ev.time.elapsed,
      addedMinute: ev.time.extra ?? undefined,
      side,
      playerName: ev.player.name,
      // We don't have real coords from the free tier — place on the penalty spot area
      x: 88 + (Math.random() * 8 - 4),
      y: 50 + (Math.random() * 16 - 8),
      xg,
      outcome: isOwnGoal ? "own-goal" : isGoal ? "goal" : "saved",
      situation: isPenalty ? "penalty" : undefined,
      assistedBy: ev.assist.name ?? undefined,
    });
  }

  return shots;
}

// ---------------------------------------------------------------------------
// Build cumulative xG timeline from shot list
// ---------------------------------------------------------------------------
function buildTimeline(shots: ShotEvent[]): XGTimelinePoint[] {
  const sorted = [...shots].sort((a, b) => a.minute - b.minute);
  const points: XGTimelinePoint[] = [{ minute: 0, home: 0, away: 0 }];
  let home = 0, away = 0;
  for (const s of sorted) {
    if (s.side === "home") home += s.xg;
    else away += s.xg;
    points.push({ minute: s.minute, home: parseFloat(home.toFixed(3)), away: parseFloat(away.toFixed(3)) });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------
export async function fetchApiFootballEvents(matchId: number): Promise<MatchEventData> {
  // Fetch fixture info, events, and stats in parallel.
  const [fixtures, events, stats] = await Promise.all([
    apiFetch<AFFixture[]>(`/fixtures?id=${matchId}`),
    apiFetch<AFEvent[]>(`/fixtures/events?fixture=${matchId}`),
    apiFetch<AFStat[]>(`/fixtures/statistics?fixture=${matchId}`),
  ]);

  const fx = fixtures[0];
  if (!fx) throw new Error(`No fixture found for id ${matchId}`);

  const homeId = fx.teams.home.id;
  const shots = eventsToShots(events, homeId);
  const timeline = buildTimeline(shots);
  const status = mapStatus(fx.fixture.status.short);

  // Derive short names (first 3 uppercase chars as fallback)
  const homeShort = fx.teams.home.name.slice(0, 3).toUpperCase();
  const awayShort = fx.teams.away.name.slice(0, 3).toUpperCase();

  // Heatmaps not available on free tier — omit
  const heatmaps: PlayerHeatmap[] | undefined = undefined;

  return {
    matchId,
    status,
    minute: fx.fixture.status.elapsed ?? undefined,
    homeName: fx.teams.home.name,
    awayName: fx.teams.away.name,
    homeShort,
    awayShort,
    xgTimeline: timeline,
    shots,
    heatmaps,
    source: "api-football",
    generatedAt: new Date().toISOString(),
  };
}
