/**
 * Single source of truth for the app's "what's happening right now" state.
 *
 * Today this is derived purely from the fixture calendar + the wall clock —
 * there is no live score feed wired up yet, so `hasScoreFeed` is false and
 * scores/minutes stay null. The shape is deliberately the one a real feed
 * would fill in, so when the data pipeline lands the UI lights up without
 * changing the contract: set `hasScoreFeed = true` and populate
 * minute/homeScore/awayScore from the feed.
 */

import { FIXTURES, nextFixtures } from "@/lib/wc26-fixtures";
import { teamById, TOURNAMENT } from "@/lib/wc26-data";
import type { Fixture } from "@/lib/wc26-fixtures";

/** A match is considered "in progress" for this long after kickoff. */
const LIVE_WINDOW_MIN = 120;

const KO_LABEL: Record<string, string> = {
  R32: "16-delsfinale",
  R16: "8-delsfinale",
  QF: "Kvartfinale",
  SF: "Semifinale",
  "3RD": "Bronsefinale",
  FINAL: "Finale",
};

function stageLabel(f: Fixture): string {
  return f.stage.kind === "group"
    ? `Gruppe ${f.stage.group} · MD${f.stage.matchday}`
    : KO_LABEL[f.stage.round] ?? "Sluttspill";
}

export interface LiveMatch {
  id: number;
  homeName: string;
  awayName: string;
  homeFlag: string | null;
  awayFlag: string | null;
  kickoff: string;
  stageLabel: string;
  /** Populated by a real feed; null until then. */
  minute: number | null;
  homeScore: number | null;
  awayScore: number | null;
}

export interface NextMatch {
  id: number;
  homeName: string;
  awayName: string;
  homeFlag: string | null;
  awayFlag: string | null;
  kickoff: string;
  stageLabel: string;
}

export interface LiveState {
  /** Where we are relative to the tournament window. */
  phase: "pre" | "live" | "post";
  /** Server clock (ISO) so the client can correct for local clock skew. */
  serverTime: string;
  /** Tournament kickoff (ISO) — the pre-phase countdown target. */
  tournamentStart: string;
  /** Matches currently inside their live window (clock-derived for now). */
  liveMatches: LiveMatch[];
  /** Next upcoming fixture, or null once everything has been played. */
  nextMatch: NextMatch | null;
  /** False until a real score feed is connected — UI hides numbers. */
  hasScoreFeed: boolean;
}

function toNextMatch(f: Fixture): NextMatch {
  const home = f.homeId ? teamById(f.homeId) : undefined;
  const away = f.awayId ? teamById(f.awayId) : undefined;
  return {
    id: f.id,
    homeName: home?.name ?? "TBD",
    awayName: away?.name ?? "TBD",
    homeFlag: home?.flag ?? null,
    awayFlag: away?.flag ?? null,
    kickoff: f.kickoff,
    stageLabel: stageLabel(f),
  };
}

export function computeLiveState(now: Date = new Date()): LiveState {
  const nowMs = now.getTime();
  const start = new Date(TOURNAMENT.startDate + "T00:00:00Z").getTime();
  const end = new Date(TOURNAMENT.endDate + "T23:59:59Z").getTime();

  const liveMatches: LiveMatch[] = FIXTURES.filter((f) => {
    const ko = new Date(f.kickoff).getTime();
    return nowMs >= ko && nowMs <= ko + LIVE_WINDOW_MIN * 60_000;
  })
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .map((f) => {
      const home = f.homeId ? teamById(f.homeId) : undefined;
      const away = f.awayId ? teamById(f.awayId) : undefined;
      return {
        id: f.id,
        homeName: home?.name ?? "TBD",
        awayName: away?.name ?? "TBD",
        homeFlag: home?.flag ?? null,
        awayFlag: away?.flag ?? null,
        kickoff: f.kickoff,
        stageLabel: stageLabel(f),
        minute: null,
        homeScore: null,
        awayScore: null,
      };
    });

  const upcoming = nextFixtures(now.toISOString(), 1);
  const nextMatch = upcoming.length > 0 ? toNextMatch(upcoming[0]) : null;

  const phase: LiveState["phase"] =
    nowMs < start ? "pre" : nowMs > end ? "post" : "live";

  return {
    phase,
    serverTime: now.toISOString(),
    tournamentStart: new Date(start).toISOString(),
    liveMatches,
    nextMatch,
    hasScoreFeed: false,
  };
}
