import norwaySpain from "@/mock/matches/norway-spain.json";
import type { MatchDetail } from "./types";
import { fixtureById, type Fixture } from "./wc26-fixtures";
import { teamById, venueById, type WCTeam } from "./wc26-data";

export function getMatchDetail(id: string): MatchDetail | null {
  if (id === "1001") return norwaySpain as MatchDetail;
  return null;
}

/**
 * Basic match view derived from a fixture entry — used when we don't have
 * detailed event-level data (xG, shots, lineups). The Overview tab degrades
 * to "match data not yet available" but the page still renders with header
 * info, teams, and venue.
 */
export interface FixtureView {
  id: number;
  stage: string;
  kickoff: string;
  venue: { name: string; city: string; capacity: number };
  status: "scheduled";
  teams: {
    home?: { id: number; name: string; shortName: string; flag: string; formation: string; manager: string };
    away?: { id: number; name: string; shortName: string; flag: string; formation: string; manager: string };
  };
  fixture: Fixture;
}

export function getFixtureView(id: string): FixtureView | null {
  const fx = fixtureById(Number(id));
  if (!fx) return null;
  const venue = venueById(fx.venueId);
  const home = fx.homeId ? teamById(fx.homeId) : undefined;
  const away = fx.awayId ? teamById(fx.awayId) : undefined;

  const stageLabel =
    fx.stage.kind === "group"
      ? `Group ${fx.stage.group} · Matchday ${fx.stage.matchday}`
      : KNOCKOUT_LABELS[fx.stage.round];

  return {
    id: fx.id,
    stage: stageLabel,
    kickoff: fx.kickoff,
    venue: {
      name: venue?.name ?? "TBD",
      city: venue?.city ?? "TBD",
      capacity: venue?.capacity ?? 0,
    },
    status: "scheduled",
    teams: {
      home: home && wrapTeam(home),
      away: away && wrapTeam(away),
    },
    fixture: fx,
  };
}

function wrapTeam(t: WCTeam) {
  return {
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    flag: t.flag,
    formation: t.preferredFormation ?? "4-3-3",
    manager: t.manager ?? "",
  };
}

const KNOCKOUT_LABELS: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place playoff",
  FINAL: "Final",
};
