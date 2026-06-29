/**
 * Complete WC 2026 fixture list — all 104 matches.
 *
 * Times are the Norwegian / CET broadcast schedule as published by NRK + TV 2
 * (user-supplied 22 May 2026). Stored here as ISO-UTC strings (CET in June/July
 * is CEST = UTC+2). `channel` tags the Norwegian rights-holder per fixture.
 *
 * 72 group-stage matches (Jun 11 → Jun 28, 2026)
 * 32 knockout matches:
 *   R32 (Jun 28 → Jul 4)
 *   R16 (Jul 4  → Jul 8)
 *   QF  (Jul 9  → Jul 12)
 *   SF  (Jul 14 → Jul 15)
 *   3rd (Jul 18)
 *   FIN (Jul 19)
 *
 * Knockout slot labels follow FIFA's published bracket:
 *   "1A" = Group A winner, "2A" = Group A runner-up, "3X" = best-third placeholder.
 */

import { teamByShortName, type WCTeam } from "./wc26-data";

export type Channel = "NRK" | "TV 2";

export type FixtureStage =
  | { kind: "group"; group: string; matchday: 1 | 2 | 3 }
  | { kind: "knockout"; round: "R32" | "R16" | "QF" | "SF" | "3RD" | "FINAL" };

export interface Fixture {
  id: number;
  stage: FixtureStage;
  kickoff: string; // ISO UTC
  venueId: string;
  /** Norwegian rights-holder channel where known. */
  channel?: Channel;
  /** For group matches, ids resolved from short names. For knockout, undefined. */
  homeId?: number;
  awayId?: number;
  /** For knockout matches: slot label e.g. "1A", "2B", "3X". */
  homeSlot?: string;
  awaySlot?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Group stage (72 matches)
// Times in UTC (subtract 2h from the CET broadcast times).
// ─────────────────────────────────────────────────────────────────────────────

interface RawGroupFixture {
  id: number;
  group: string;
  matchday: 1 | 2 | 3;
  utc: string; // ISO UTC including time
  home: string; // shortName
  away: string;
  venue: string;
  channel?: Channel;
}

const GROUP_FIXTURES: RawGroupFixture[] = [
  // ── Matchday 1 ──────────────────────────────────────────────────────────────
  { id: 1,  group: "A", matchday: 1, utc: "2026-06-11T19:00:00Z", home: "MEX", away: "RSA", venue: "azteca",    channel: "TV 2" },
  { id: 2,  group: "A", matchday: 1, utc: "2026-06-12T02:00:00Z", home: "KOR", away: "CZE", venue: "akron",     channel: "NRK" },
  { id: 3,  group: "B", matchday: 1, utc: "2026-06-12T19:00:00Z", home: "CAN", away: "BIH", venue: "bmo",       channel: "NRK" },
  { id: 4,  group: "B", matchday: 1, utc: "2026-06-13T19:00:00Z", home: "QAT", away: "SUI", venue: "levis",     channel: "NRK" },
  { id: 5,  group: "D", matchday: 1, utc: "2026-06-13T01:00:00Z", home: "USA", away: "PAR", venue: "sofi",      channel: "TV 2" },
  { id: 6,  group: "C", matchday: 1, utc: "2026-06-13T22:00:00Z", home: "BRA", away: "MAR", venue: "metlife",   channel: "TV 2" },
  { id: 7,  group: "C", matchday: 1, utc: "2026-06-14T01:00:00Z", home: "HAI", away: "SCO", venue: "gillette",  channel: "TV 2" },
  { id: 8,  group: "D", matchday: 1, utc: "2026-06-14T04:00:00Z", home: "AUS", away: "TUR", venue: "bcplace",   channel: "TV 2" },
  { id: 9,  group: "E", matchday: 1, utc: "2026-06-14T17:00:00Z", home: "GER", away: "CUW", venue: "nrg",       channel: "NRK" },
  { id: 10, group: "E", matchday: 1, utc: "2026-06-14T23:00:00Z", home: "CIV", away: "ECU", venue: "lincoln",   channel: "TV 2" },
  { id: 11, group: "F", matchday: 1, utc: "2026-06-14T20:00:00Z", home: "NED", away: "JPN", venue: "att",       channel: "TV 2" },
  { id: 12, group: "F", matchday: 1, utc: "2026-06-15T02:00:00Z", home: "SWE", away: "TUN", venue: "bbva",      channel: "TV 2" },
  { id: 13, group: "G", matchday: 1, utc: "2026-06-15T19:00:00Z", home: "BEL", away: "EGY", venue: "bcplace",   channel: "NRK" },
  { id: 14, group: "G", matchday: 1, utc: "2026-06-16T01:00:00Z", home: "IRN", away: "NZL", venue: "sofi",      channel: "NRK" },
  { id: 15, group: "H", matchday: 1, utc: "2026-06-15T16:00:00Z", home: "ESP", away: "CPV", venue: "mercedes",  channel: "TV 2" },
  { id: 16, group: "H", matchday: 1, utc: "2026-06-15T22:00:00Z", home: "KSA", away: "URU", venue: "hardrock",  channel: "NRK" },
  { id: 17, group: "I", matchday: 1, utc: "2026-06-16T19:00:00Z", home: "FRA", away: "SEN", venue: "metlife",   channel: "TV 2" },
  { id: 18, group: "I", matchday: 1, utc: "2026-06-16T21:00:00Z", home: "IRQ", away: "NOR", venue: "gillette",  channel: "TV 2" },
  { id: 19, group: "J", matchday: 1, utc: "2026-06-17T01:00:00Z", home: "ARG", away: "ALG", venue: "arrowhead", channel: "NRK" },
  { id: 20, group: "J", matchday: 1, utc: "2026-06-17T04:00:00Z", home: "AUT", away: "JOR", venue: "levis",     channel: "NRK" },
  { id: 21, group: "K", matchday: 1, utc: "2026-06-17T17:00:00Z", home: "POR", away: "COD", venue: "nrg",       channel: "NRK" },
  { id: 22, group: "K", matchday: 1, utc: "2026-06-18T02:00:00Z", home: "UZB", away: "COL", venue: "azteca",    channel: "TV 2" },
  { id: 23, group: "L", matchday: 1, utc: "2026-06-17T20:00:00Z", home: "ENG", away: "CRO", venue: "att",       channel: "TV 2" },
  { id: 24, group: "L", matchday: 1, utc: "2026-06-17T23:00:00Z", home: "GHA", away: "PAN", venue: "bmo",       channel: "TV 2" },

  // ── Matchday 2 ──────────────────────────────────────────────────────────────
  { id: 25, group: "A", matchday: 2, utc: "2026-06-18T16:00:00Z", home: "CZE", away: "RSA", venue: "mercedes",  channel: "NRK" },
  { id: 26, group: "A", matchday: 2, utc: "2026-06-19T01:00:00Z", home: "MEX", away: "KOR", venue: "akron",     channel: "TV 2" },
  { id: 27, group: "B", matchday: 2, utc: "2026-06-18T19:00:00Z", home: "SUI", away: "BIH", venue: "sofi",      channel: "TV 2" },
  { id: 28, group: "B", matchday: 2, utc: "2026-06-18T22:00:00Z", home: "CAN", away: "QAT", venue: "bcplace",   channel: "TV 2" },
  { id: 29, group: "C", matchday: 2, utc: "2026-06-19T22:00:00Z", home: "SCO", away: "MAR", venue: "gillette",  channel: "NRK" },
  { id: 30, group: "C", matchday: 2, utc: "2026-06-20T00:30:00Z", home: "BRA", away: "HAI", venue: "lincoln",   channel: "NRK" },
  { id: 31, group: "D", matchday: 2, utc: "2026-06-19T19:00:00Z", home: "USA", away: "AUS", venue: "lumen",     channel: "NRK" },
  { id: 32, group: "D", matchday: 2, utc: "2026-06-20T03:00:00Z", home: "TUR", away: "PAR", venue: "levis",     channel: "NRK" },
  { id: 33, group: "E", matchday: 2, utc: "2026-06-20T20:00:00Z", home: "GER", away: "CIV", venue: "bmo",       channel: "TV 2" },
  { id: 34, group: "E", matchday: 2, utc: "2026-06-21T00:00:00Z", home: "ECU", away: "CUW", venue: "arrowhead", channel: "TV 2" },
  { id: 35, group: "F", matchday: 2, utc: "2026-06-20T17:00:00Z", home: "NED", away: "SWE", venue: "nrg",       channel: "NRK" },
  { id: 36, group: "F", matchday: 2, utc: "2026-06-21T04:00:00Z", home: "TUN", away: "JPN", venue: "bbva",      channel: "NRK" },
  { id: 37, group: "G", matchday: 2, utc: "2026-06-21T19:00:00Z", home: "BEL", away: "IRN", venue: "sofi",      channel: "TV 2" },
  { id: 38, group: "G", matchday: 2, utc: "2026-06-22T01:00:00Z", home: "NZL", away: "EGY", venue: "bcplace",   channel: "TV 2" },
  { id: 39, group: "H", matchday: 2, utc: "2026-06-21T16:00:00Z", home: "ESP", away: "KSA", venue: "mercedes",  channel: "NRK" },
  { id: 40, group: "H", matchday: 2, utc: "2026-06-21T22:00:00Z", home: "URU", away: "CPV", venue: "hardrock",  channel: "TV 2" },
  { id: 41, group: "I", matchday: 2, utc: "2026-06-22T21:00:00Z", home: "FRA", away: "IRQ", venue: "lincoln",   channel: "NRK" },
  { id: 42, group: "I", matchday: 2, utc: "2026-06-23T00:00:00Z", home: "NOR", away: "SEN", venue: "metlife",   channel: "NRK" },
  { id: 43, group: "J", matchday: 2, utc: "2026-06-22T17:00:00Z", home: "ARG", away: "AUT", venue: "att",       channel: "TV 2" },
  { id: 44, group: "J", matchday: 2, utc: "2026-06-23T03:00:00Z", home: "JOR", away: "ALG", venue: "levis",     channel: "TV 2" },
  { id: 45, group: "K", matchday: 2, utc: "2026-06-23T17:00:00Z", home: "POR", away: "UZB", venue: "nrg",       channel: "TV 2" },
  { id: 46, group: "K", matchday: 2, utc: "2026-06-24T02:00:00Z", home: "COL", away: "COD", venue: "akron",     channel: "TV 2" },
  { id: 47, group: "L", matchday: 2, utc: "2026-06-23T20:00:00Z", home: "ENG", away: "GHA", venue: "gillette",  channel: "NRK" },
  { id: 48, group: "L", matchday: 2, utc: "2026-06-23T23:00:00Z", home: "PAN", away: "CRO", venue: "bmo",       channel: "NRK" },

  // ── Matchday 3 — final round always plays the two group games simultaneously ─
  { id: 49, group: "A", matchday: 3, utc: "2026-06-25T01:00:00Z", home: "CZE", away: "MEX", venue: "azteca",    channel: "TV 2" },
  { id: 50, group: "A", matchday: 3, utc: "2026-06-25T01:00:00Z", home: "RSA", away: "KOR", venue: "bbva",      channel: "TV 2" },
  { id: 51, group: "B", matchday: 3, utc: "2026-06-24T19:00:00Z", home: "SUI", away: "CAN", venue: "bcplace",   channel: "NRK" },
  { id: 52, group: "B", matchday: 3, utc: "2026-06-24T19:00:00Z", home: "BIH", away: "QAT", venue: "lumen",     channel: "NRK" },
  { id: 53, group: "C", matchday: 3, utc: "2026-06-24T22:00:00Z", home: "SCO", away: "BRA", venue: "hardrock",  channel: "NRK" },
  { id: 54, group: "C", matchday: 3, utc: "2026-06-24T22:00:00Z", home: "MAR", away: "HAI", venue: "mercedes",  channel: "NRK" },
  { id: 55, group: "D", matchday: 3, utc: "2026-06-26T02:00:00Z", home: "TUR", away: "USA", venue: "sofi",      channel: "NRK" },
  { id: 56, group: "D", matchday: 3, utc: "2026-06-26T02:00:00Z", home: "PAR", away: "AUS", venue: "levis",     channel: "NRK" },
  { id: 57, group: "E", matchday: 3, utc: "2026-06-25T20:00:00Z", home: "ECU", away: "GER", venue: "metlife",   channel: "TV 2" },
  { id: 58, group: "E", matchday: 3, utc: "2026-06-25T20:00:00Z", home: "CUW", away: "CIV", venue: "lincoln",   channel: "TV 2" },
  { id: 59, group: "F", matchday: 3, utc: "2026-06-25T23:00:00Z", home: "JPN", away: "SWE", venue: "att",       channel: "TV 2" },
  { id: 60, group: "F", matchday: 3, utc: "2026-06-25T23:00:00Z", home: "TUN", away: "NED", venue: "arrowhead", channel: "TV 2" },
  { id: 61, group: "G", matchday: 3, utc: "2026-06-27T03:00:00Z", home: "EGY", away: "IRN", venue: "lumen",     channel: "TV 2" },
  { id: 62, group: "G", matchday: 3, utc: "2026-06-27T03:00:00Z", home: "NZL", away: "BEL", venue: "bcplace",   channel: "TV 2" },
  { id: 63, group: "H", matchday: 3, utc: "2026-06-27T00:00:00Z", home: "CPV", away: "KSA", venue: "nrg",       channel: "NRK" },
  { id: 64, group: "H", matchday: 3, utc: "2026-06-27T00:00:00Z", home: "URU", away: "ESP", venue: "akron",     channel: "NRK" },
  { id: 65, group: "I", matchday: 3, utc: "2026-06-26T21:00:00Z", home: "NOR", away: "FRA", venue: "gillette",  channel: "NRK" },
  { id: 66, group: "I", matchday: 3, utc: "2026-06-26T21:00:00Z", home: "SEN", away: "IRQ", venue: "bmo",       channel: "NRK" },
  { id: 67, group: "J", matchday: 3, utc: "2026-06-28T02:00:00Z", home: "ALG", away: "AUT", venue: "arrowhead", channel: "NRK" },
  { id: 68, group: "J", matchday: 3, utc: "2026-06-28T02:00:00Z", home: "JOR", away: "ARG", venue: "att",       channel: "NRK" },
  { id: 69, group: "K", matchday: 3, utc: "2026-06-27T23:30:00Z", home: "COL", away: "POR", venue: "hardrock",  channel: "NRK" },
  { id: 70, group: "K", matchday: 3, utc: "2026-06-27T23:30:00Z", home: "COD", away: "UZB", venue: "mercedes",  channel: "NRK" },
  { id: 71, group: "L", matchday: 3, utc: "2026-06-27T21:00:00Z", home: "PAN", away: "ENG", venue: "metlife",   channel: "TV 2" },
  { id: 72, group: "L", matchday: 3, utc: "2026-06-27T21:00:00Z", home: "CRO", away: "GHA", venue: "lincoln",   channel: "TV 2" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Knockout stage (32 matches) — slot labels match FIFA's published bracket.
// Best-third placeholders display as "3X" until standings finalise on 28 Jun.
// ─────────────────────────────────────────────────────────────────────────────

interface RawKnockoutFixture {
  id: number;
  round: "R32" | "R16" | "QF" | "SF" | "3RD" | "FINAL";
  utc: string;
  venue: string;
  homeSlot?: string;
  awaySlot?: string;
  channel?: Channel;
}

const KNOCKOUT_FIXTURES: RawKnockoutFixture[] = [
  // R32 — 16 matches, Jun 28 – Jul 4
  { id: 73, round: "R32", utc: "2026-06-28T19:00:00Z", venue: "sofi",      homeSlot: "2A", awaySlot: "2B" },
  { id: 74, round: "R32", utc: "2026-06-29T20:30:00Z", venue: "nrg",       homeSlot: "1E", awaySlot: "3X" },
  { id: 75, round: "R32", utc: "2026-06-30T01:00:00Z", venue: "gillette",  homeSlot: "1F", awaySlot: "2C" },
  { id: 76, round: "R32", utc: "2026-06-29T17:00:00Z", venue: "bbva",      homeSlot: "1C", awaySlot: "2F" },
  { id: 77, round: "R32", utc: "2026-06-30T21:00:00Z", venue: "att",       homeSlot: "1I", awaySlot: "3X" },
  { id: 78, round: "R32", utc: "2026-06-30T17:00:00Z", venue: "metlife",   homeSlot: "2E", awaySlot: "2I" },
  { id: 79, round: "R32", utc: "2026-06-30T01:00:00Z", venue: "azteca",    homeSlot: "1A", awaySlot: "3X" },
  { id: 80, round: "R32", utc: "2026-07-01T16:00:00Z", venue: "mercedes",  homeSlot: "1L", awaySlot: "3X" },
  { id: 81, round: "R32", utc: "2026-07-02T00:00:00Z", venue: "lumen",     homeSlot: "1D", awaySlot: "3X" },
  { id: 82, round: "R32", utc: "2026-07-01T20:00:00Z", venue: "levis",     homeSlot: "1G", awaySlot: "3X" },
  { id: 83, round: "R32", utc: "2026-07-02T23:00:00Z", venue: "sofi",      homeSlot: "2K", awaySlot: "2L" },
  { id: 84, round: "R32", utc: "2026-07-02T19:00:00Z", venue: "bmo",       homeSlot: "1H", awaySlot: "2J" },
  { id: 85, round: "R32", utc: "2026-07-03T03:00:00Z", venue: "bcplace",   homeSlot: "1B", awaySlot: "3X" },
  { id: 86, round: "R32", utc: "2026-07-03T22:00:00Z", venue: "att",       homeSlot: "1J", awaySlot: "2H" },
  { id: 87, round: "R32", utc: "2026-07-04T01:30:00Z", venue: "hardrock",  homeSlot: "1K", awaySlot: "3X" },
  { id: 88, round: "R32", utc: "2026-07-03T18:00:00Z", venue: "arrowhead", homeSlot: "2D", awaySlot: "2G" },

  // R16 — 8 matches, Jul 4 – Jul 7
  { id: 89, round: "R16", utc: "2026-07-04T21:00:00Z", venue: "nrg",       homeSlot: "W74", awaySlot: "W77" },
  { id: 90, round: "R16", utc: "2026-07-04T17:00:00Z", venue: "lincoln",   homeSlot: "W73", awaySlot: "W75" },
  { id: 91, round: "R16", utc: "2026-07-05T20:00:00Z", venue: "metlife",   homeSlot: "W76", awaySlot: "W78" },
  { id: 92, round: "R16", utc: "2026-07-06T00:00:00Z", venue: "azteca",    homeSlot: "W79", awaySlot: "W80" },
  { id: 93, round: "R16", utc: "2026-07-06T19:00:00Z", venue: "att",       homeSlot: "W83", awaySlot: "W84" },
  { id: 94, round: "R16", utc: "2026-07-07T00:00:00Z", venue: "lumen",     homeSlot: "W81", awaySlot: "W82" },
  { id: 95, round: "R16", utc: "2026-07-07T16:00:00Z", venue: "mercedes",  homeSlot: "W86", awaySlot: "W88" },
  { id: 96, round: "R16", utc: "2026-07-07T20:00:00Z", venue: "bcplace",   homeSlot: "W85", awaySlot: "W87" },

  // QF — 4 matches, Jul 9 – Jul 12
  { id: 97,  round: "QF", utc: "2026-07-09T19:00:00Z", venue: "gillette",  homeSlot: "W89", awaySlot: "W90" },
  { id: 98,  round: "QF", utc: "2026-07-10T18:00:00Z", venue: "sofi",      homeSlot: "W93", awaySlot: "W94" },
  { id: 99,  round: "QF", utc: "2026-07-11T20:00:00Z", venue: "hardrock",  homeSlot: "W91", awaySlot: "W92" },
  { id: 100, round: "QF", utc: "2026-07-12T00:00:00Z", venue: "arrowhead", homeSlot: "W95", awaySlot: "W96" },

  // SF — 2 matches, Jul 14 + 15
  { id: 101, round: "SF", utc: "2026-07-14T19:00:00Z", venue: "att",       homeSlot: "W97", awaySlot: "W98" },
  { id: 102, round: "SF", utc: "2026-07-15T19:00:00Z", venue: "mercedes",  homeSlot: "W99", awaySlot: "W100" },

  // Third place playoff
  { id: 103, round: "3RD", utc: "2026-07-18T19:00:00Z", venue: "hardrock", homeSlot: "L101", awaySlot: "L102" },

  // Final
  { id: 104, round: "FINAL", utc: "2026-07-19T19:00:00Z", venue: "metlife", homeSlot: "W101", awaySlot: "W102" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Materialise to Fixture[]
// ─────────────────────────────────────────────────────────────────────────────

export const FIXTURES: Fixture[] = [
  ...GROUP_FIXTURES.map<Fixture>((r) => {
    const home = teamByShortName(r.home);
    const away = teamByShortName(r.away);
    if (!home || !away) {
      throw new Error(`Fixture ${r.id}: unknown team ${r.home} or ${r.away}`);
    }
    return {
      id: r.id,
      stage: { kind: "group", group: r.group, matchday: r.matchday },
      kickoff: r.utc,
      venueId: r.venue,
      channel: r.channel,
      homeId: home.id,
      awayId: away.id,
    };
  }),
  ...KNOCKOUT_FIXTURES.map<Fixture>((r) => ({
    id: r.id,
    stage: { kind: "knockout", round: r.round },
    kickoff: r.utc,
    venueId: r.venue,
    channel: r.channel,
    homeSlot: r.homeSlot,
    awaySlot: r.awaySlot,
  })),
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function fixturesOn(dateIso: string): Fixture[] {
  return FIXTURES.filter((f) => f.kickoff.startsWith(dateIso));
}

export function fixturesByGroup(group: string): Fixture[] {
  return FIXTURES.filter(
    (f) => f.stage.kind === "group" && f.stage.group === group,
  );
}

export function fixturesByRound(round: "R32" | "R16" | "QF" | "SF" | "3RD" | "FINAL"): Fixture[] {
  return FIXTURES.filter(
    (f) => f.stage.kind === "knockout" && f.stage.round === round,
  );
}

export function nextFixtures(fromIso: string, limit = 12): Fixture[] {
  const cutoff = new Date(fromIso).getTime();
  return FIXTURES
    .filter((f) => new Date(f.kickoff).getTime() >= cutoff)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .slice(0, limit);
}

export function fixtureById(id: number): Fixture | undefined {
  return FIXTURES.find((f) => f.id === id);
}

export type FixtureWithTeams = Fixture & {
  home?: WCTeam;
  away?: WCTeam;
};
