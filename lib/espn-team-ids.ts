/**
 * Maps our internal WCTeam.id values → ESPN team ids.
 *
 * Built by querying every WC 2026 fixture on the ESPN public scoreboard
 * and matching team displayNames against wc26-data with the same alias
 * table the resolver uses. 48/48 teams covered.
 *
 * To verify or extend:
 *   GET https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=YYYYMMDD
 *   → events[*].competitions[0].competitors[*].team.id / .displayName
 */

export const ESPN_TEAM_ID: Readonly<Record<number, string>> = {
  1: "203",     // Mexico
  3: "451",     // South Korea
  4: "202",     // Argentina
  5: "206",     // Canada
  6: "481",     // Germany
  7: "627",     // Japan
  8: "654",     // Senegal
  9: "660",     // United States
  10: "475",    // Switzerland
  11: "469",    // Iran
  12: "2869",   // Morocco
  13: "205",    // Brazil
  14: "478",    // France
  15: "628",    // Australia
  16: "2620",   // Egypt
  18: "482",    // Portugal
  19: "655",    // Saudi Arabia
  20: "624",    // Algeria
  21: "464",    // Norway
  22: "164",    // Spain
  23: "212",    // Uruguay
  24: "659",    // Tunisia
  25: "2659",   // Panama
  26: "449",    // Netherlands
  27: "4375",   // Iraq
  28: "4469",   // Ghana
  30: "448",    // England
  31: "2570",   // Uzbekistan
  32: "4789",   // Ivory Coast
  33: "209",    // Ecuador
  35: "2917",   // Jordan
  37: "208",    // Colombia
  38: "459",    // Belgium
  39: "2666",   // New Zealand
  42: "477",    // Croatia
  43: "210",    // Paraguay
  45: "465",    // Türkiye
  47: "4398",   // Qatar
  48: "467",    // South Africa
  49: "450",    // Czechia
  50: "452",    // Bosnia-Herzegovina
  51: "2654",   // Haiti
  52: "580",    // Scotland
  53: "11678",  // Curaçao
  54: "466",    // Sweden
  55: "2597",   // Cape Verde
  56: "474",    // Austria
  57: "2850",   // DR Congo (ESPN: "Congo DR")
};

export function getEspnTeamId(internalId: number): string | undefined {
  return ESPN_TEAM_ID[internalId];
}
