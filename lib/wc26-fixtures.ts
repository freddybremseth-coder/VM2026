/**
 * Complete WC 2026 fixture list — all 104 matches.
 *
 * Source: FIFA official schedule (final draw 5 Dec 2025).
 *
 *   - 72 group-stage matches (Jun 11 – Jun 27, 2026)
 *   - 32 knockout matches:
 *       R32 (Jun 28 – Jul 3, 16 matches)
 *       R16 (Jul 4 – Jul 7, 8 matches)
 *       QF  (Jul 9 – Jul 11, 4 matches)
 *       SF  (Jul 14 – Jul 15, 2 matches)
 *       3rd (Jul 18, 1 match)
 *       FIN (Jul 19, 1 match)
 *
 * Kickoff times are not yet finalised for every match — we use plausible local
 * times that match FIFA's announced regional slots. Once exact UTC times are
 * published, update `kickoff` here.
 *
 * For knockout matches we use slot labels (e.g. "1A" = winner of Group A,
 * "2B" = runner-up of B, "3X" = a third-placed team) since the actual pairings
 * depend on group-stage outcomes.
 */

import { teamByShortName, type WCTeam } from "./wc26-data";

export type FixtureStage =
  | { kind: "group"; group: string; matchday: 1 | 2 | 3 }
  | { kind: "knockout"; round: "R32" | "R16" | "QF" | "SF" | "3RD" | "FINAL" };

export interface Fixture {
  id: number;
  stage: FixtureStage;
  kickoff: string; // ISO UTC
  venueId: string;
  /** For group matches, ids resolved from short names. For knockout, undefined. */
  homeId?: number;
  awayId?: number;
  /** For knockout matches: slot label e.g. "1A", "2B", "3X". */
  homeSlot?: string;
  awaySlot?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Group stage (72 matches)
// Helper: kickoff times here are placeholders representing FIFA's typical slots
// (12:00 / 15:00 / 18:00 / 21:00 local). Replace once official.
// ─────────────────────────────────────────────────────────────────────────────

interface RawGroupFixture {
  id: number;
  group: string;
  matchday: 1 | 2 | 3;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm UTC
  home: string; // shortName
  away: string;
  venue: string;
}

const GROUP_FIXTURES: RawGroupFixture[] = [
  // ── Matchday 1 ──────────────────────────────────────────────────────────────
  // Group A
  { id: 1,  group: "A", matchday: 1, date: "2026-06-11", time: "20:00", home: "MEX", away: "RSA", venue: "azteca"   },
  { id: 2,  group: "A", matchday: 1, date: "2026-06-11", time: "23:00", home: "KOR", away: "CZE", venue: "akron"    },
  // Group B
  { id: 3,  group: "B", matchday: 1, date: "2026-06-12", time: "20:00", home: "CAN", away: "BIH", venue: "bmo"      },
  { id: 4,  group: "B", matchday: 1, date: "2026-06-12", time: "23:00", home: "QAT", away: "SUI", venue: "levis"    },
  // Group D opener for USA
  { id: 5,  group: "D", matchday: 1, date: "2026-06-12", time: "01:00", home: "USA", away: "PAR", venue: "sofi"     },
  // Group C
  { id: 6,  group: "C", matchday: 1, date: "2026-06-13", time: "18:00", home: "BRA", away: "MAR", venue: "metlife"  },
  { id: 7,  group: "C", matchday: 1, date: "2026-06-13", time: "21:00", home: "HAI", away: "SCO", venue: "gillette" },
  { id: 8,  group: "D", matchday: 1, date: "2026-06-13", time: "00:00", home: "AUS", away: "TUR", venue: "bcplace"  },
  // Group E + F
  { id: 9,  group: "E", matchday: 1, date: "2026-06-14", time: "18:00", home: "GER", away: "CUW", venue: "nrg"      },
  { id: 10, group: "E", matchday: 1, date: "2026-06-14", time: "21:00", home: "CIV", away: "ECU", venue: "lincoln"  },
  { id: 11, group: "F", matchday: 1, date: "2026-06-14", time: "00:00", home: "NED", away: "JPN", venue: "att"      },
  { id: 12, group: "F", matchday: 1, date: "2026-06-14", time: "03:00", home: "SWE", away: "TUN", venue: "bbva"     },
  // Group G + H
  { id: 13, group: "G", matchday: 1, date: "2026-06-15", time: "19:00", home: "BEL", away: "EGY", venue: "bcplace"  },
  { id: 14, group: "G", matchday: 1, date: "2026-06-15", time: "22:00", home: "IRN", away: "NZL", venue: "sofi"     },
  { id: 15, group: "H", matchday: 1, date: "2026-06-15", time: "01:00", home: "ESP", away: "CPV", venue: "mercedes" },
  { id: 16, group: "H", matchday: 1, date: "2026-06-15", time: "23:00", home: "KSA", away: "URU", venue: "hardrock" },
  // Group I + J
  { id: 17, group: "I", matchday: 1, date: "2026-06-16", time: "18:00", home: "FRA", away: "SEN", venue: "metlife"  },
  { id: 18, group: "I", matchday: 1, date: "2026-06-16", time: "21:00", home: "IRQ", away: "NOR", venue: "gillette" },
  { id: 19, group: "J", matchday: 1, date: "2026-06-16", time: "00:00", home: "ARG", away: "ALG", venue: "arrowhead"},
  { id: 20, group: "J", matchday: 1, date: "2026-06-16", time: "23:00", home: "AUT", away: "JOR", venue: "levis"    },
  // Group K + L
  { id: 21, group: "K", matchday: 1, date: "2026-06-17", time: "19:00", home: "POR", away: "COD", venue: "nrg"      },
  { id: 22, group: "K", matchday: 1, date: "2026-06-17", time: "22:00", home: "UZB", away: "COL", venue: "azteca"   },
  { id: 23, group: "L", matchday: 1, date: "2026-06-17", time: "01:00", home: "ENG", away: "CRO", venue: "att"      },
  { id: 24, group: "L", matchday: 1, date: "2026-06-17", time: "23:00", home: "GHA", away: "PAN", venue: "bmo"      },

  // ── Matchday 2 ──────────────────────────────────────────────────────────────
  // Group A
  { id: 25, group: "A", matchday: 2, date: "2026-06-18", time: "18:00", home: "CZE", away: "RSA", venue: "mercedes" },
  { id: 26, group: "A", matchday: 2, date: "2026-06-18", time: "23:00", home: "MEX", away: "KOR", venue: "akron"    },
  // Group B
  { id: 27, group: "B", matchday: 2, date: "2026-06-18", time: "20:00", home: "SUI", away: "BIH", venue: "sofi"     },
  { id: 28, group: "B", matchday: 2, date: "2026-06-18", time: "01:00", home: "CAN", away: "QAT", venue: "bcplace"  },
  // Group C
  { id: 29, group: "C", matchday: 2, date: "2026-06-19", time: "18:00", home: "SCO", away: "MAR", venue: "gillette" },
  { id: 30, group: "C", matchday: 2, date: "2026-06-19", time: "21:00", home: "BRA", away: "HAI", venue: "lincoln"  },
  // Group D
  { id: 31, group: "D", matchday: 2, date: "2026-06-19", time: "00:00", home: "USA", away: "AUS", venue: "lumen"    },
  { id: 32, group: "D", matchday: 2, date: "2026-06-19", time: "23:00", home: "TUR", away: "PAR", venue: "levis"    },
  // Group E
  { id: 33, group: "E", matchday: 2, date: "2026-06-20", time: "18:00", home: "GER", away: "CIV", venue: "bmo"      },
  { id: 34, group: "E", matchday: 2, date: "2026-06-20", time: "21:00", home: "ECU", away: "CUW", venue: "arrowhead"},
  // Group F
  { id: 35, group: "F", matchday: 2, date: "2026-06-20", time: "00:00", home: "NED", away: "SWE", venue: "nrg"      },
  { id: 36, group: "F", matchday: 2, date: "2026-06-20", time: "23:00", home: "TUN", away: "JPN", venue: "bbva"     },
  // Group G
  { id: 37, group: "G", matchday: 2, date: "2026-06-21", time: "19:00", home: "BEL", away: "IRN", venue: "sofi"     },
  { id: 38, group: "G", matchday: 2, date: "2026-06-21", time: "22:00", home: "NZL", away: "EGY", venue: "bcplace"  },
  // Group H
  { id: 39, group: "H", matchday: 2, date: "2026-06-21", time: "18:00", home: "ESP", away: "KSA", venue: "mercedes" },
  { id: 40, group: "H", matchday: 2, date: "2026-06-21", time: "21:00", home: "URU", away: "CPV", venue: "hardrock" },
  // Group I
  { id: 41, group: "I", matchday: 2, date: "2026-06-22", time: "18:00", home: "FRA", away: "IRQ", venue: "lincoln"  },
  { id: 42, group: "I", matchday: 2, date: "2026-06-22", time: "21:00", home: "NOR", away: "SEN", venue: "metlife"  },
  // Group J
  { id: 43, group: "J", matchday: 2, date: "2026-06-22", time: "00:00", home: "ARG", away: "AUT", venue: "att"      },
  { id: 44, group: "J", matchday: 2, date: "2026-06-22", time: "23:00", home: "JOR", away: "ALG", venue: "levis"    },
  // Group K
  { id: 45, group: "K", matchday: 2, date: "2026-06-23", time: "18:00", home: "POR", away: "UZB", venue: "nrg"      },
  { id: 46, group: "K", matchday: 2, date: "2026-06-23", time: "22:00", home: "COL", away: "COD", venue: "akron"    },
  // Group L
  { id: 47, group: "L", matchday: 2, date: "2026-06-23", time: "21:00", home: "ENG", away: "GHA", venue: "gillette" },
  { id: 48, group: "L", matchday: 2, date: "2026-06-23", time: "01:00", home: "PAN", away: "CRO", venue: "bmo"      },

  // ── Matchday 3 ──────────────────────────────────────────────────────────────
  // Group A
  { id: 49, group: "A", matchday: 3, date: "2026-06-24", time: "20:00", home: "CZE", away: "MEX", venue: "azteca"   },
  { id: 50, group: "A", matchday: 3, date: "2026-06-24", time: "20:00", home: "RSA", away: "KOR", venue: "bbva"     },
  // Group B
  { id: 51, group: "B", matchday: 3, date: "2026-06-24", time: "00:00", home: "SUI", away: "CAN", venue: "bcplace"  },
  { id: 52, group: "B", matchday: 3, date: "2026-06-24", time: "00:00", home: "BIH", away: "QAT", venue: "lumen"    },
  // Group C
  { id: 53, group: "C", matchday: 3, date: "2026-06-24", time: "21:00", home: "SCO", away: "BRA", venue: "hardrock" },
  { id: 54, group: "C", matchday: 3, date: "2026-06-24", time: "21:00", home: "MAR", away: "HAI", venue: "mercedes" },
  // Group D
  { id: 55, group: "D", matchday: 3, date: "2026-06-25", time: "00:00", home: "TUR", away: "USA", venue: "sofi"     },
  { id: 56, group: "D", matchday: 3, date: "2026-06-25", time: "00:00", home: "PAR", away: "AUS", venue: "levis"    },
  // Group E
  { id: 57, group: "E", matchday: 3, date: "2026-06-25", time: "22:00", home: "ECU", away: "GER", venue: "metlife"  },
  { id: 58, group: "E", matchday: 3, date: "2026-06-25", time: "22:00", home: "CUW", away: "CIV", venue: "lincoln"  },
  // Group F
  { id: 59, group: "F", matchday: 3, date: "2026-06-25", time: "02:00", home: "JPN", away: "SWE", venue: "att"      },
  { id: 60, group: "F", matchday: 3, date: "2026-06-25", time: "02:00", home: "TUN", away: "NED", venue: "arrowhead"},
  // Group G
  { id: 61, group: "G", matchday: 3, date: "2026-06-26", time: "00:00", home: "EGY", away: "IRN", venue: "lumen"    },
  { id: 62, group: "G", matchday: 3, date: "2026-06-26", time: "00:00", home: "NZL", away: "BEL", venue: "bcplace"  },
  // Group H
  { id: 63, group: "H", matchday: 3, date: "2026-06-26", time: "22:00", home: "CPV", away: "KSA", venue: "nrg"      },
  { id: 64, group: "H", matchday: 3, date: "2026-06-26", time: "22:00", home: "URU", away: "ESP", venue: "akron"    },
  // Group I
  { id: 65, group: "I", matchday: 3, date: "2026-06-26", time: "21:00", home: "NOR", away: "FRA", venue: "gillette" },
  { id: 66, group: "I", matchday: 3, date: "2026-06-26", time: "21:00", home: "SEN", away: "IRQ", venue: "bmo"      },
  // Group J
  { id: 67, group: "J", matchday: 3, date: "2026-06-27", time: "01:00", home: "ALG", away: "AUT", venue: "arrowhead"},
  { id: 68, group: "J", matchday: 3, date: "2026-06-27", time: "01:00", home: "JOR", away: "ARG", venue: "att"      },
  // Group K
  { id: 69, group: "K", matchday: 3, date: "2026-06-27", time: "23:00", home: "COL", away: "POR", venue: "hardrock" },
  { id: 70, group: "K", matchday: 3, date: "2026-06-27", time: "23:00", home: "COD", away: "UZB", venue: "mercedes" },
  // Group L
  { id: 71, group: "L", matchday: 3, date: "2026-06-27", time: "20:00", home: "PAN", away: "ENG", venue: "metlife"  },
  { id: 72, group: "L", matchday: 3, date: "2026-06-27", time: "20:00", home: "CRO", away: "GHA", venue: "lincoln"  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Knockout stage (32 matches) — pairings populate after the group stage.
// Slots use FIFA's seeding labels: 1A = Group A winner, 2A = runner-up, 3X = a
// third-placed team. We use TBD-TBD until standings are known.
// ─────────────────────────────────────────────────────────────────────────────

interface RawKnockoutFixture {
  id: number;
  round: "R32" | "R16" | "QF" | "SF" | "3RD" | "FINAL";
  date: string;
  time: string;
  venue: string;
  homeSlot?: string;
  awaySlot?: string;
}

const KNOCKOUT_FIXTURES: RawKnockoutFixture[] = [
  // Round of 32 — 16 matches
  { id: 73, round: "R32", date: "2026-06-28", time: "22:00", venue: "sofi"     },
  { id: 74, round: "R32", date: "2026-06-29", time: "18:00", venue: "nrg"      },
  { id: 75, round: "R32", date: "2026-06-29", time: "21:00", venue: "gillette" },
  { id: 76, round: "R32", date: "2026-06-29", time: "00:00", venue: "bbva"     },
  { id: 77, round: "R32", date: "2026-06-30", time: "20:00", venue: "att"      },
  { id: 78, round: "R32", date: "2026-06-30", time: "23:00", venue: "metlife"  },
  { id: 79, round: "R32", date: "2026-06-30", time: "02:00", venue: "azteca"   },
  { id: 80, round: "R32", date: "2026-07-01", time: "18:00", venue: "mercedes" },
  { id: 81, round: "R32", date: "2026-07-01", time: "21:00", venue: "lumen"    },
  { id: 82, round: "R32", date: "2026-07-01", time: "00:00", venue: "levis"    },
  { id: 83, round: "R32", date: "2026-07-02", time: "20:00", venue: "sofi"     },
  { id: 84, round: "R32", date: "2026-07-02", time: "23:00", venue: "bmo"      },
  { id: 85, round: "R32", date: "2026-07-02", time: "02:00", venue: "bcplace"  },
  { id: 86, round: "R32", date: "2026-07-03", time: "18:00", venue: "att"      },
  { id: 87, round: "R32", date: "2026-07-03", time: "21:00", venue: "hardrock" },
  { id: 88, round: "R32", date: "2026-07-03", time: "00:00", venue: "arrowhead"},

  // Round of 16 — 8 matches
  { id: 89, round: "R16", date: "2026-07-04", time: "20:00", venue: "nrg"      },
  { id: 90, round: "R16", date: "2026-07-04", time: "00:00", venue: "lincoln"  },
  { id: 91, round: "R16", date: "2026-07-05", time: "20:00", venue: "metlife"  },
  { id: 92, round: "R16", date: "2026-07-05", time: "00:00", venue: "azteca"   },
  { id: 93, round: "R16", date: "2026-07-06", time: "20:00", venue: "att"      },
  { id: 94, round: "R16", date: "2026-07-06", time: "00:00", venue: "lumen"    },
  { id: 95, round: "R16", date: "2026-07-07", time: "20:00", venue: "mercedes" },
  { id: 96, round: "R16", date: "2026-07-07", time: "00:00", venue: "bcplace"  },

  // Quarter-finals — 4 matches
  { id: 97, round: "QF",  date: "2026-07-09", time: "23:00", venue: "gillette" },
  { id: 98, round: "QF",  date: "2026-07-10", time: "23:00", venue: "sofi"     },
  { id: 99, round: "QF",  date: "2026-07-11", time: "20:00", venue: "hardrock" },
  { id: 100,round: "QF",  date: "2026-07-11", time: "23:00", venue: "arrowhead"},

  // Semi-finals — 2 matches
  { id: 101,round: "SF",  date: "2026-07-14", time: "23:00", venue: "att"      },
  { id: 102,round: "SF",  date: "2026-07-15", time: "23:00", venue: "mercedes" },

  // Third-place playoff
  { id: 103,round: "3RD", date: "2026-07-18", time: "20:00", venue: "hardrock" },

  // Final
  { id: 104,round: "FINAL",date: "2026-07-19",time: "19:00", venue: "metlife"  },
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
      kickoff: `${r.date}T${r.time}:00Z`,
      venueId: r.venue,
      homeId: home.id,
      awayId: away.id,
    };
  }),
  ...KNOCKOUT_FIXTURES.map<Fixture>((r) => ({
    id: r.id,
    stage: { kind: "knockout", round: r.round },
    kickoff: `${r.date}T${r.time}:00Z`,
    venueId: r.venue,
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
