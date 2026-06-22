/**
 * Maps an OddsPapi fixture to our internal WC 2026 fixture id (1..110)
 * when the two refer to the same match. Returns null otherwise, in which
 * case the odds row still gets stored against the external_id but with no
 * wc26-link (lets us prepare for non-WC leagues without code changes).
 *
 * Match heuristic, in priority order:
 *   1. Both team names match (normalised + alias table).
 *   2. One team name matches AND kickoff is within ±6h.
 *
 * The normalisation/alias logic is duplicated from espn-fixture-resolver
 * on purpose — they're both small, different vendors will need different
 * aliases over time, and coupling them would create cross-vendor coupling
 * we don't want.
 */

import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";

function normName(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  return ALIASES[base] ?? base;
}

/** OddsPapi spellings that differ from wc26-data. Extend as needed. */
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
  bosniaherzegovina: "bosniaandherzegovina",
  congodr: "drcongo",
  drcongo: "drcongo",
  democraticrepublicofthecongo: "drcongo",
};

const SIX_HOURS_MS = 6 * 3600 * 1000;

function internalNames(f: Fixture): { home: string | null; away: string | null } {
  const home = f.homeId ? teamById(f.homeId)?.name ?? null : null;
  const away = f.awayId ? teamById(f.awayId)?.name ?? null : null;
  return {
    home: home ? normName(home) : null,
    away: away ? normName(away) : null,
  };
}

/**
 * Try to resolve an OddsPapi fixture to an internal WC 2026 fixture id.
 * Returns the internal id (1..110) when both names match, or one name
 * matches and the kickoff is within ±6h. Otherwise returns null.
 */
export function resolveWC26FixtureId(
  homeTeam: string,
  awayTeam: string,
  commenceAtIso: string,
): number | null {
  const home = normName(homeTeam);
  const away = normName(awayTeam);
  const koMs = new Date(commenceAtIso).getTime();

  // Pass 1: both names match.
  for (const f of FIXTURES) {
    if (f.stage.kind !== "group" && !f.homeSlot && !f.awaySlot) continue;
    const names = internalNames(f);
    if (
      names.home &&
      names.away &&
      names.home === home &&
      names.away === away
    ) {
      return f.id;
    }
  }

  // Pass 2: one name matches AND kickoff within ±6h.
  for (const f of FIXTURES) {
    const names = internalNames(f);
    const oneNameMatches =
      (names.home && (names.home === home || names.home === away)) ||
      (names.away && (names.away === home || names.away === away));
    if (!oneNameMatches) continue;
    const fxKo = new Date(f.kickoff).getTime();
    if (Math.abs(fxKo - koMs) <= SIX_HOURS_MS) return f.id;
  }

  return null;
}
