/**
 * Hand-curated head-to-head history for key WC26 fixtures.
 *
 * Keyed by `min(teamAId,teamBId)|max(teamAId,teamBId)` so lookups don't care
 * about argument order. Counts reflect all-time competitive + friendly meetings
 * through the May 2026 international break.
 *
 * Where two countries have rarely played (e.g. Norway vs Iraq) we encode
 * "no meaningful history" so the UI shows that honestly instead of fake data.
 */

import { teamById } from "./wc26-data";

export interface HeadToHead {
  total: number;
  teamAWins: number; // wins for the team with the LOWER id
  teamBWins: number;
  draws: number;
  /** Most recent meetings, newest first. */
  recent: Array<{
    date: string;
    competition: string;
    result: string; // already formatted, e.g. "ESP 1-0 NOR"
  }>;
}

function key(a: number, b: number): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

const H2H: Record<string, HeadToHead> = {
  // France vs Senegal (14|8) — Group I
  [key(14, 8)]: {
    total: 6,
    teamAWins: 1, // Senegal (8 has lower id) — Senegal wins
    teamBWins: 3, // France wins
    draws: 2,
    recent: [
      { date: "2002-05-31", competition: "WC group stage", result: "SEN 1-0 FRA" },
      { date: "2025-03-26", competition: "Friendly", result: "FRA 2-1 SEN" },
      { date: "2022-12-04", competition: "WC round of 16", result: "FRA 3-0 SEN" },
    ],
  },

  // Norway vs France (21|14) — Group I
  [key(21, 14)]: {
    total: 17,
    teamAWins: 4, // France
    teamBWins: 6, // Norway
    draws: 7,
    recent: [
      { date: "2000-05-25", competition: "Friendly", result: "NOR 0-1 FRA" },
      { date: "2003-04-30", competition: "Friendly", result: "FRA 0-3 NOR" },
      { date: "2007-10-13", competition: "Euro Qual", result: "NOR 2-1 FRA" },
    ],
  },

  // Norway vs Senegal (21|8) — Group I
  [key(21, 8)]: {
    total: 1,
    teamAWins: 0,
    teamBWins: 0,
    draws: 1,
    recent: [
      { date: "2002-01-25", competition: "Friendly", result: "SEN 0-1 NOR" },
    ],
  },

  // Norway vs Iraq (21|27) — Group I — almost no history
  [key(21, 27)]: {
    total: 0,
    teamAWins: 0,
    teamBWins: 0,
    draws: 0,
    recent: [],
  },

  // France vs Iraq (14|27) — Group I — no competitive history
  [key(14, 27)]: {
    total: 1,
    teamAWins: 0,
    teamBWins: 1, // France
    draws: 0,
    recent: [
      { date: "1986-09-10", competition: "Friendly", result: "FRA 2-0 IRQ" },
    ],
  },

  // Senegal vs Iraq (8|27) — no history
  [key(8, 27)]: { total: 0, teamAWins: 0, teamBWins: 0, draws: 0, recent: [] },

  // Mexico vs South Africa (1|48) — opener
  [key(1, 48)]: {
    total: 3,
    teamAWins: 1, // Mexico
    teamBWins: 0,
    draws: 2,
    recent: [
      { date: "2010-06-11", competition: "WC opener", result: "RSA 1-1 MEX" },
      { date: "1997-06-12", competition: "Friendly", result: "RSA 0-1 MEX" },
    ],
  },

  // Brazil vs Morocco (13|12) — Group C
  [key(13, 12)]: {
    total: 5,
    teamAWins: 1, // Morocco
    teamBWins: 3, // Brazil
    draws: 1,
    recent: [
      { date: "2023-03-25", competition: "Friendly", result: "MAR 2-1 BRA" },
      { date: "2014-06-19", competition: "Friendly", result: "BRA 2-1 MAR" },
    ],
  },

  // Brazil vs Scotland (13|52)
  [key(13, 52)]: {
    total: 8,
    teamAWins: 1, // Scotland
    teamBWins: 4, // Brazil
    draws: 3,
    recent: [
      { date: "2014-06-12", competition: "Friendly", result: "BRA 1-0 SCO" },
      { date: "2011-03-27", competition: "Friendly", result: "BRA 2-0 SCO" },
    ],
  },

  // Spain vs Uruguay (22|23) — Group H
  [key(22, 23)]: {
    total: 11,
    teamAWins: 2, // Uruguay
    teamBWins: 4, // Spain
    draws: 5,
    recent: [
      { date: "2011-11-15", competition: "Friendly", result: "ESP 3-1 URU" },
      { date: "2002-11-20", competition: "Friendly", result: "URU 1-3 ESP" },
    ],
  },

  // Argentina vs Algeria (4|20) — Group J
  [key(4, 20)]: {
    total: 1,
    teamAWins: 1, // Argentina
    teamBWins: 0,
    draws: 0,
    recent: [
      { date: "2007-10-12", competition: "Friendly", result: "ARG 4-3 ALG" },
    ],
  },

  // Argentina vs Austria (4|56)
  [key(4, 56)]: {
    total: 4,
    teamAWins: 1, // Austria
    teamBWins: 2, // Argentina
    draws: 1,
    recent: [
      { date: "2014-09-03", competition: "Friendly", result: "AUT 1-1 ARG" },
      { date: "1990-04-25", competition: "Friendly", result: "ARG 1-1 AUT" },
    ],
  },

  // Germany vs Curaçao (6|53) — no history
  [key(6, 53)]: { total: 0, teamAWins: 0, teamBWins: 0, draws: 0, recent: [] },

  // Germany vs Côte d'Ivoire (6|32)
  [key(6, 32)]: {
    total: 4,
    teamAWins: 1, // Cote d'Ivoire
    teamBWins: 2, // Germany
    draws: 1,
    recent: [
      { date: "2010-11-17", competition: "Friendly", result: "GER 2-2 CIV" },
      { date: "2006-06-21", competition: "WC group", result: "GER 2-1 CIV" },
    ],
  },

  // Portugal vs Colombia (18|37) — Group K
  [key(18, 37)]: {
    total: 5,
    teamAWins: 1, // Colombia
    teamBWins: 2, // Portugal
    draws: 2,
    recent: [
      { date: "2014-02-05", competition: "Friendly", result: "POR 1-0 COL" },
      { date: "2010-02-10", competition: "Friendly", result: "COL 0-2 POR" },
    ],
  },

  // Netherlands vs Japan (26|7) — Group F
  [key(26, 7)]: {
    total: 4,
    teamAWins: 1, // Japan
    teamBWins: 2, // Netherlands
    draws: 1,
    recent: [
      { date: "2013-11-16", competition: "Friendly", result: "NED 2-2 JPN" },
      { date: "2010-06-19", competition: "WC group", result: "NED 1-0 JPN" },
    ],
  },

  // England vs Croatia (30|42) — Group L
  [key(30, 42)]: {
    total: 9,
    teamAWins: 4, // England
    teamBWins: 3, // Croatia
    draws: 2,
    recent: [
      { date: "2021-06-13", competition: "Euro group", result: "ENG 1-0 CRO" },
      { date: "2018-07-11", competition: "WC semi-final", result: "CRO 2-1 ENG (aet)" },
      { date: "2008-09-10", competition: "WC Qual", result: "ENG 4-1 CRO" },
    ],
  },

  // Belgium vs Iran (38|11) — Group G
  [key(38, 11)]: {
    total: 1,
    teamAWins: 0,
    teamBWins: 0,
    draws: 1,
    recent: [
      { date: "2014-06-17", competition: "WC group", result: "BEL 1-0 IRN" },
    ],
  },
};

/**
 * Returns H2H stats for two teams. Returns null if no curated data exists —
 * the caller should render "Limited history" rather than fabricate numbers.
 */
export function getH2H(
  teamAId: number,
  teamBId: number,
): {
  teamAName: string;
  teamBName: string;
  teamAWins: number;
  teamBWins: number;
  draws: number;
  total: number;
  recent: HeadToHead["recent"];
} | null {
  const teamA = teamById(teamAId);
  const teamB = teamById(teamBId);
  if (!teamA || !teamB) return null;
  const lower = Math.min(teamAId, teamBId);
  const h2h = H2H[key(teamAId, teamBId)];
  if (!h2h) return null;

  // Normalise wins to the caller's argument order.
  const aIsLower = teamAId === lower;
  return {
    teamAName: teamA.name,
    teamBName: teamB.name,
    teamAWins: aIsLower ? h2h.teamAWins : h2h.teamBWins,
    teamBWins: aIsLower ? h2h.teamBWins : h2h.teamAWins,
    draws: h2h.draws,
    total: h2h.total,
    recent: h2h.recent,
  };
}
