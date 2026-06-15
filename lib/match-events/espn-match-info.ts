/**
 * Rich match-context fetch from ESPN's public summary endpoint — formation,
 * starting XI, full statistics block, and a top-N key-event timeline.
 *
 * Used by the Tactics tab on /matches/[id]/tactics. Falls back to a null
 * shape when ESPN doesn't have the fixture yet (pre-kickoff) so the UI can
 * render a clean "not available" state.
 */

import { getEspnFixtureId } from "@/lib/cron/espn-fixture-resolver";

const SUMMARY_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary";

export interface MatchInfoPlayer {
  espnId: string;
  name: string;
  shortName: string;
  jersey: string | null;
  starter: boolean;
}

export interface MatchInfoStat {
  /** ESPN stat name, e.g. "possessionPct", "totalShots". */
  name: string;
  /** Display label, e.g. "Possession". */
  label: string;
  /** Display value, e.g. "60.5". */
  value: string;
}

export interface MatchInfoSideStats {
  formation: string | null;
  starters: MatchInfoPlayer[];
  bench: MatchInfoPlayer[];
  stats: MatchInfoStat[];
}

export interface MatchInfoKeyEvent {
  minute: number;
  type: string;
  text: string;
  teamSide: "home" | "away" | null;
  scoringPlay: boolean;
}

export interface MatchInfo {
  espnId: string;
  homeName: string;
  awayName: string;
  home: MatchInfoSideStats;
  away: MatchInfoSideStats;
  keyEvents: MatchInfoKeyEvent[];
  /** Status name (STATUS_FINAL, STATUS_IN_PROGRESS, etc.). */
  statusName: string;
}

interface RawAthlete {
  id: string;
  fullName?: string;
  displayName: string;
  shortName?: string;
}
interface RawRosterEntry {
  active: boolean;
  starter: boolean;
  jersey?: string;
  athlete: RawAthlete;
}
interface RawRosterBlock {
  homeAway: "home" | "away";
  formation?: string;
  team: { id: string; displayName: string };
  roster: RawRosterEntry[];
}
interface RawStatistic {
  name: string;
  label?: string;
  displayValue?: string;
}
interface RawTeamBox {
  team: { id: string; displayName: string };
  statistics: RawStatistic[];
}
interface RawKeyEvent {
  type?: { id?: string; text?: string };
  clock?: { displayValue?: string; value?: number };
  text?: string;
  shortText?: string;
  scoringPlay?: boolean;
  team?: { id: string };
}
interface RawSummary {
  header?: {
    competitions?: Array<{
      competitors: Array<{
        id: string;
        homeAway: "home" | "away";
        team: { id: string; displayName: string };
      }>;
      status?: { type: { name: string } };
    }>;
  };
  rosters?: RawRosterBlock[];
  boxscore?: { teams?: RawTeamBox[] };
  keyEvents?: RawKeyEvent[];
}

function mapPlayer(r: RawRosterEntry): MatchInfoPlayer {
  return {
    espnId: r.athlete.id,
    name: r.athlete.fullName ?? r.athlete.displayName,
    shortName: r.athlete.shortName ?? r.athlete.displayName,
    jersey: r.jersey ?? null,
    starter: r.starter,
  };
}

export async function fetchEspnMatchInfo(matchId: number): Promise<MatchInfo | null> {
  let espnId: string;
  try {
    espnId = await getEspnFixtureId(matchId);
  } catch {
    return null; // fixture not in ESPN window yet → tactics not available
  }

  const res = await fetch(`${SUMMARY_URL}?event=${espnId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as RawSummary;

  const comp = data.header?.competitions?.[0];
  if (!comp) return null;
  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");
  if (!home || !away) return null;

  const rosters = data.rosters ?? [];
  const rHome = rosters.find((r) => r.homeAway === "home");
  const rAway = rosters.find((r) => r.homeAway === "away");

  const boxTeams = data.boxscore?.teams ?? [];
  const bHome = boxTeams.find((b) => b.team.id === home.team.id);
  const bAway = boxTeams.find((b) => b.team.id === away.team.id);

  const buildSide = (
    roster: RawRosterBlock | undefined,
    box: RawTeamBox | undefined,
  ): MatchInfoSideStats => {
    const players = (roster?.roster ?? []).filter((p) => p.active !== false);
    return {
      formation: roster?.formation ?? null,
      starters: players.filter((p) => p.starter).map(mapPlayer),
      bench: players.filter((p) => !p.starter).map(mapPlayer),
      stats: (box?.statistics ?? [])
        .filter((s) => s.displayValue !== undefined && s.displayValue !== "")
        .map((s) => ({
          name: s.name,
          label: s.label ?? s.name,
          value: String(s.displayValue ?? ""),
        })),
    };
  };

  const keyEvents: MatchInfoKeyEvent[] = (data.keyEvents ?? []).map((e) => {
    const clock = e.clock?.displayValue ?? "";
    const m = clock.match(/(\d+)/);
    const minute = m ? Number(m[1]) : 0;
    const teamId = e.team?.id;
    let teamSide: "home" | "away" | null = null;
    if (teamId === home.team.id) teamSide = "home";
    else if (teamId === away.team.id) teamSide = "away";
    return {
      minute,
      type: e.type?.text ?? "Event",
      text: e.text ?? e.shortText ?? "",
      teamSide,
      scoringPlay: Boolean(e.scoringPlay),
    };
  });

  return {
    espnId,
    homeName: home.team.displayName,
    awayName: away.team.displayName,
    home: buildSide(rHome, bHome),
    away: buildSide(rAway, bAway),
    keyEvents,
    statusName: comp.status?.type.name ?? "STATUS_SCHEDULED",
  };
}
