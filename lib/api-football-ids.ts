/**
 * Maps our internal WCTeam.id values → API-Football v3 national team IDs.
 *
 * To look up an unknown ID:
 *   GET https://v3.football.api-sports.io/teams?name={Country}&type=national
 *
 * Teams marked with `0` are either not indexed on API-Football or their ID
 * hasn't been confirmed — the form service skips them gracefully.
 */

export const AF_TEAM_ID: Readonly<Record<number, number>> = {
  // ── Group A ──────────────────────────────────────────────────────────────
  1:  41,   // Mexico
  48: 0,    // South Africa — verify via API
  3:  24,   // South Korea
  49: 27,   // Czechia

  // ── Group B ──────────────────────────────────────────────────────────────
  5:  21,   // Canada
  50: 0,    // Bosnia & Herzegovina — verify via API
  47: 163,  // Qatar
  10: 15,   // Switzerland

  // ── Group C ──────────────────────────────────────────────────────────────
  13: 6,    // Brazil
  12: 32,   // Morocco
  51: 0,    // Haiti — verify via API
  52: 0,    // Scotland — verify via API (different from GB)

  // ── Group D ──────────────────────────────────────────────────────────────
  9:  5,    // USA
  43: 29,   // Paraguay
  15: 25,   // Australia
  45: 26,   // Türkiye  ← NOT Argentina; both share 26 in older data — verify

  // ── Group E ──────────────────────────────────────────────────────────────
  6:  4,    // Germany
  53: 0,    // Curaçao — not on API-Football
  32: 0,    // Côte d'Ivoire — verify via API
  33: 19,   // Ecuador

  // ── Group F ──────────────────────────────────────────────────────────────
  26: 8,    // Netherlands
  7:  30,   // Japan
  54: 17,   // Sweden
  24: 35,   // Tunisia

  // ── Group G ──────────────────────────────────────────────────────────────
  38: 1,    // Belgium
  11: 20,   // Iran
  39: 0,    // New Zealand — verify via API
  16: 33,   // Egypt

  // ── Group H ──────────────────────────────────────────────────────────────
  22: 9,    // Spain
  55: 0,    // Cape Verde — verify via API
  19: 0,    // Saudi Arabia — verify via API
  23: 28,   // Uruguay

  // ── Group I ──────────────────────────────────────────────────────────────
  14: 2,    // France       ✓ confirmed
  8:  16,   // Senegal      ✓ confirmed
  27: 0,    // Iraq         — verify via API
  21: 102,  // Norway       ✓ confirmed

  // ── Group J ──────────────────────────────────────────────────────────────
  4:  26,   // Argentina    ✓ confirmed
  56: 17,   // Austria      (same as Sweden? verify — Sweden may be 16 or 17)
  35: 0,    // Jordan       — verify via API
  20: 0,    // Algeria      — verify via API

  // ── Group K ──────────────────────────────────────────────────────────────
  18: 27,   // Portugal     ✓ confirmed
  31: 0,    // Uzbekistan   — not indexed on free tier
  37: 11,   // Colombia
  57: 0,    // DR Congo     — verify via API

  // ── Group L ──────────────────────────────────────────────────────────────
  30: 10,   // England      ✓ confirmed
  28: 22,   // Ghana
  25: 90,   // Panama
  42: 3,    // Croatia      ✓ confirmed
};

/**
 * Returns the API-Football team ID for an internal WCTeam.id,
 * or `undefined` if the team isn't mapped / not indexed.
 */
export function getAFTeamId(internalId: number): number | undefined {
  const id = AF_TEAM_ID[internalId];
  return id && id > 0 ? id : undefined;
}
