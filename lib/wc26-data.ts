/**
 * WC 2026 reference data — built from the official Final Draw (5 December 2025).
 *
 * Sources:
 *   - FIFA: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026
 *   - Final Draw results
 *
 * 48 teams, 12 groups (A–L) of 4. Tournament runs 11 June – 19 July 2026.
 * Top 2 from each group + 8 best third-placed teams advance to the Round of 32.
 *
 * `squadStatus` flags which teams have a 26-man roster encoded in
 * `wc26-squads.ts` (+ wave-2/3/4). After the May 2026 announcements all 48
 * sides have submitted squads — the value differentiates richly-sourced
 * lineups ("official") from those built before the federation announcement
 * was public ("preliminary").
 *
 * Team IDs for the six teams with full squad data are stable across changes
 * (Norway 21, Spain 22, Brazil 13, Argentina 4, England 30, France 14).
 */

export type Confederation = "UEFA" | "CONMEBOL" | "AFC" | "CAF" | "CONCACAF" | "OFC";

export type SquadStatus = "official" | "preliminary" | "pending";

export interface WCTeam {
  id: number;
  name: string;
  shortName: string;
  flag: string;
  confederation: Confederation;
  group: string;
  fifaRank?: number;
  squadStatus: SquadStatus;
  manager?: string;
  preferredFormation?: string;
}

export interface WCVenue {
  id: string;
  name: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  capacity: number;
  /** Whether the venue hosts knockout rounds (semis/final etc.). */
  knockoutRole?: "opener" | "final" | "semifinal" | "quarterfinal" | "third-place";
}

// ─────────────────────────────────────────────────────────────────────────────
// Venues (confirmed)
// ─────────────────────────────────────────────────────────────────────────────
export const VENUES: WCVenue[] = [
  // Mexico
  { id: "azteca",    name: "Estadio Azteca",          city: "Mexico City",       country: "Mexico", capacity: 83000, knockoutRole: "opener" },
  { id: "akron",     name: "Estadio Akron",           city: "Guadalajara",       country: "Mexico", capacity: 48000 },
  { id: "bbva",      name: "Estadio BBVA",            city: "Monterrey",         country: "Mexico", capacity: 53500 },
  // Canada
  { id: "bmo",       name: "BMO Field",               city: "Toronto",           country: "Canada", capacity: 45000 },
  { id: "bcplace",   name: "BC Place",                city: "Vancouver",         country: "Canada", capacity: 54000 },
  // USA — semis at Dallas + Atlanta, final at MetLife, 3rd-place at Miami, QFs at Boston/LA/Miami/KC
  { id: "mercedes",  name: "Mercedes-Benz Stadium",   city: "Atlanta",           country: "USA",    capacity: 75000, knockoutRole: "semifinal" },
  { id: "gillette",  name: "Gillette Stadium",        city: "Boston",            country: "USA",    capacity: 65000, knockoutRole: "quarterfinal" },
  { id: "att",       name: "AT&T Stadium",            city: "Dallas",            country: "USA",    capacity: 94000, knockoutRole: "semifinal" },
  { id: "nrg",       name: "NRG Stadium",             city: "Houston",           country: "USA",    capacity: 72000 },
  { id: "arrowhead", name: "Arrowhead Stadium",       city: "Kansas City",       country: "USA",    capacity: 73000, knockoutRole: "quarterfinal" },
  { id: "sofi",      name: "SoFi Stadium",            city: "Los Angeles",       country: "USA",    capacity: 70000, knockoutRole: "quarterfinal" },
  { id: "hardrock",  name: "Hard Rock Stadium",       city: "Miami",             country: "USA",    capacity: 65000, knockoutRole: "third-place" },
  { id: "metlife",   name: "MetLife Stadium",         city: "New York/NJ",       country: "USA",    capacity: 82500, knockoutRole: "final" },
  { id: "lincoln",   name: "Lincoln Financial Field", city: "Philadelphia",      country: "USA",    capacity: 69000 },
  { id: "levis",     name: "Levi's Stadium",          city: "San Francisco/Bay", country: "USA",    capacity: 71000 },
  { id: "lumen",     name: "Lumen Field",             city: "Seattle",           country: "USA",    capacity: 69000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Teams — official final-draw line-up
//   IDs preserved for teams with squad data: 4 ARG, 13 BRA, 14 FRA, 21 NOR, 22 ESP, 30 ENG
//   New countries get IDs 49–57 to avoid collisions with old speculative IDs.
// ─────────────────────────────────────────────────────────────────────────────
export const TEAMS: WCTeam[] = [
  // Group A
  { id: 1,  name: "Mexico",              shortName: "MEX", flag: "mx",     confederation: "CONCACAF", group: "A", fifaRank: 14, squadStatus: "official", manager: "Javier Aguirre",       preferredFormation: "4-3-3" },
  { id: 48, name: "South Africa",        shortName: "RSA", flag: "za",     confederation: "CAF",      group: "A", fifaRank: 59, squadStatus: "official",     manager: "Hugo Broos",            preferredFormation: "4-3-3" },
  { id: 3,  name: "South Korea",         shortName: "KOR", flag: "kr",     confederation: "AFC",      group: "A", fifaRank: 23, squadStatus: "official",    manager: "Hong Myung-bo",          preferredFormation: "4-2-3-1" },
  { id: 49, name: "Czechia",             shortName: "CZE", flag: "cz",     confederation: "UEFA",     group: "A", fifaRank: 43, squadStatus: "official", manager: "Miroslav Koubek",        preferredFormation: "3-4-2-1" },

  // Group B
  { id: 5,  name: "Canada",              shortName: "CAN", flag: "ca",     confederation: "CONCACAF", group: "B", fifaRank: 38, squadStatus: "official", manager: "Jesse Marsch",           preferredFormation: "4-3-3" },
  { id: 50, name: "Bosnia & Herzegovina",shortName: "BIH", flag: "ba",     confederation: "UEFA",     group: "B", fifaRank: 76, squadStatus: "official",    manager: "Sergej Barbarez",        preferredFormation: "4-3-3" },
  { id: 47, name: "Qatar",               shortName: "QAT", flag: "qa",     confederation: "AFC",      group: "B", fifaRank: 53, squadStatus: "official", manager: "Julen Lopetegui",        preferredFormation: "5-3-2" },
  { id: 10, name: "Switzerland",         shortName: "SUI", flag: "ch",     confederation: "UEFA",     group: "B", fifaRank: 20, squadStatus: "official",    manager: "Murat Yakın",            preferredFormation: "3-4-2-1" },

  // Group C
  { id: 13, name: "Brazil",              shortName: "BRA", flag: "br",     confederation: "CONMEBOL", group: "C", fifaRank: 5,  squadStatus: "official",    manager: "Carlo Ancelotti",        preferredFormation: "4-2-3-1" },
  { id: 12, name: "Morocco",             shortName: "MAR", flag: "ma",     confederation: "CAF",      group: "C", fifaRank: 13, squadStatus: "official", manager: "Walid Regragui",         preferredFormation: "4-3-3" },
  { id: 51, name: "Haiti",               shortName: "HAI", flag: "ht",     confederation: "CONCACAF", group: "C", fifaRank: 83, squadStatus: "official",    manager: "Sébastien Migné",        preferredFormation: "4-4-2" },
  { id: 52, name: "Scotland",            shortName: "SCO", flag: "gb-sct", confederation: "UEFA",     group: "C", fifaRank: 39, squadStatus: "official",    manager: "Steve Clarke",           preferredFormation: "3-4-2-1" },

  // Group D
  { id: 9,  name: "USA",                 shortName: "USA", flag: "us",     confederation: "CONCACAF", group: "D", fifaRank: 16, squadStatus: "official", manager: "Mauricio Pochettino",    preferredFormation: "4-3-3" },
  { id: 43, name: "Paraguay",            shortName: "PAR", flag: "py",     confederation: "CONMEBOL", group: "D", fifaRank: 45, squadStatus: "official", manager: "Gustavo Alfaro",         preferredFormation: "4-3-3" },
  { id: 15, name: "Australia",           shortName: "AUS", flag: "au",     confederation: "AFC",      group: "D", fifaRank: 26, squadStatus: "official",     manager: "Tony Popovic",           preferredFormation: "4-2-3-1" },
  { id: 45, name: "Türkiye",             shortName: "TUR", flag: "tr",     confederation: "UEFA",     group: "D", fifaRank: 27, squadStatus: "official", manager: "Vincenzo Montella",      preferredFormation: "4-2-3-1" },

  // Group E
  { id: 6,  name: "Germany",             shortName: "GER", flag: "de",     confederation: "UEFA",     group: "E", fifaRank: 9,  squadStatus: "official",    manager: "Julian Nagelsmann",      preferredFormation: "4-2-3-1" },
  { id: 53, name: "Curaçao",             shortName: "CUW", flag: "cw",     confederation: "CONCACAF", group: "E", fifaRank: 82, squadStatus: "official",    manager: "Dick Advocaat",          preferredFormation: "4-3-3" },
  { id: 32, name: "Côte d'Ivoire",       shortName: "CIV", flag: "ci",     confederation: "CAF",      group: "E", fifaRank: 42, squadStatus: "official",    manager: "Emerse Faé",             preferredFormation: "4-3-3" },
  { id: 33, name: "Ecuador",             shortName: "ECU", flag: "ec",     confederation: "CONMEBOL", group: "E", fifaRank: 25, squadStatus: "official",     manager: "Sebastián Beccacece",    preferredFormation: "4-3-3" },

  // Group F
  { id: 26, name: "Netherlands",         shortName: "NED", flag: "nl",     confederation: "UEFA",     group: "F", fifaRank: 7,  squadStatus: "official", manager: "Ronald Koeman",          preferredFormation: "4-3-3" },
  { id: 7,  name: "Japan",               shortName: "JPN", flag: "jp",     confederation: "AFC",      group: "F", fifaRank: 17, squadStatus: "official",    manager: "Hajime Moriyasu",        preferredFormation: "3-4-2-1" },
  { id: 54, name: "Sweden",              shortName: "SWE", flag: "se",     confederation: "UEFA",     group: "F", fifaRank: 35, squadStatus: "official",    manager: "Graham Potter",          preferredFormation: "4-2-3-1" },
  { id: 24, name: "Tunisia",             shortName: "TUN", flag: "tn",     confederation: "CAF",      group: "F", fifaRank: 41, squadStatus: "official",    manager: "Sabri Lamouchi",         preferredFormation: "4-3-3" },

  // Group G
  { id: 38, name: "Belgium",             shortName: "BEL", flag: "be",     confederation: "UEFA",     group: "G", fifaRank: 8,  squadStatus: "official",    manager: "Rudi Garcia",            preferredFormation: "3-4-2-1" },
  { id: 16, name: "Egypt",               shortName: "EGY", flag: "eg",     confederation: "CAF",      group: "G", fifaRank: 32, squadStatus: "official", manager: "Hossam Hassan",          preferredFormation: "4-3-3" },
  { id: 11, name: "Iran",                shortName: "IRN", flag: "ir",     confederation: "AFC",      group: "G", fifaRank: 21, squadStatus: "official", manager: "Amir Ghalenoei",         preferredFormation: "4-3-3" },
  { id: 39, name: "New Zealand",         shortName: "NZL", flag: "nz",     confederation: "OFC",      group: "G", fifaRank: 89, squadStatus: "official",    manager: "Darren Bazeley",         preferredFormation: "4-4-2" },

  // Group H
  { id: 22, name: "Spain",               shortName: "ESP", flag: "es",     confederation: "UEFA",     group: "H", fifaRank: 3,  squadStatus: "official", manager: "Luis de la Fuente",      preferredFormation: "4-3-3" },
  { id: 55, name: "Cape Verde",          shortName: "CPV", flag: "cv",     confederation: "CAF",      group: "H", fifaRank: 70, squadStatus: "official",    manager: "Pedro Leitão Brito",     preferredFormation: "4-3-3" },
  { id: 19, name: "Saudi Arabia",        shortName: "KSA", flag: "sa",     confederation: "AFC",      group: "H", fifaRank: 56, squadStatus: "official",     manager: "Hervé Renard",           preferredFormation: "4-2-3-1" },
  { id: 23, name: "Uruguay",             shortName: "URU", flag: "uy",     confederation: "CONMEBOL", group: "H", fifaRank: 15, squadStatus: "official", manager: "Marcelo Bielsa",         preferredFormation: "3-3-1-3" },

  // Group I
  { id: 14, name: "France",              shortName: "FRA", flag: "fr",     confederation: "UEFA",     group: "I", fifaRank: 2,  squadStatus: "official",    manager: "Didier Deschamps",       preferredFormation: "4-2-3-1" },
  { id: 8,  name: "Senegal",             shortName: "SEN", flag: "sn",     confederation: "CAF",      group: "I", fifaRank: 19, squadStatus: "official",    manager: "Pape Thiaw",             preferredFormation: "4-3-3" },
  { id: 27, name: "Iraq",                shortName: "IRQ", flag: "iq",     confederation: "AFC",      group: "I", fifaRank: 58, squadStatus: "official", manager: "Graham Arnold",          preferredFormation: "4-2-3-1" },
  { id: 21, name: "Norway",              shortName: "NOR", flag: "no",     confederation: "UEFA",     group: "I", fifaRank: 39, squadStatus: "official",    manager: "Ståle Solbakken",        preferredFormation: "4-3-3" },

  // Group J
  { id: 4,  name: "Argentina",           shortName: "ARG", flag: "ar",     confederation: "CONMEBOL", group: "J", fifaRank: 1,  squadStatus: "official", manager: "Lionel Scaloni",         preferredFormation: "4-4-2" },
  { id: 20, name: "Algeria",             shortName: "ALG", flag: "dz",     confederation: "CAF",      group: "J", fifaRank: 36, squadStatus: "official",     manager: "Vladimir Petković",      preferredFormation: "4-3-3" },
  { id: 56, name: "Austria",             shortName: "AUT", flag: "at",     confederation: "UEFA",     group: "J", fifaRank: 25, squadStatus: "official",    manager: "Ralf Rangnick",          preferredFormation: "4-2-3-1" },
  { id: 35, name: "Jordan",              shortName: "JOR", flag: "jo",     confederation: "AFC",      group: "J", fifaRank: 70, squadStatus: "official",    manager: "Jamal Sellami",          preferredFormation: "4-3-3" },

  // Group K
  { id: 18, name: "Portugal",            shortName: "POR", flag: "pt",     confederation: "UEFA",     group: "K", fifaRank: 6,  squadStatus: "official",    manager: "Roberto Martínez",       preferredFormation: "4-3-3" },
  { id: 57, name: "DR Congo",            shortName: "COD", flag: "cd",     confederation: "CAF",      group: "K", fifaRank: 60, squadStatus: "official",    manager: "Sébastien Desabre",      preferredFormation: "4-3-3" },
  { id: 31, name: "Uzbekistan",          shortName: "UZB", flag: "uz",     confederation: "AFC",      group: "K", fifaRank: 57, squadStatus: "official",     manager: "Timur Kapadze",          preferredFormation: "4-3-3" },
  { id: 37, name: "Colombia",            shortName: "COL", flag: "co",     confederation: "CONMEBOL", group: "K", fifaRank: 12, squadStatus: "official", manager: "Néstor Lorenzo",         preferredFormation: "4-2-3-1" },

  // Group L
  { id: 30, name: "England",             shortName: "ENG", flag: "gb-eng", confederation: "UEFA",     group: "L", fifaRank: 4,  squadStatus: "official",    manager: "Thomas Tuchel",          preferredFormation: "4-2-3-1" },
  { id: 42, name: "Croatia",             shortName: "CRO", flag: "hr",     confederation: "UEFA",     group: "L", fifaRank: 11, squadStatus: "official",    manager: "Zlatko Dalić",           preferredFormation: "4-3-3" },
  { id: 28, name: "Ghana",               shortName: "GHA", flag: "gh",     confederation: "CAF",      group: "L", fifaRank: 76, squadStatus: "official",     manager: "Otto Addo",              preferredFormation: "4-3-3" },
  { id: 25, name: "Panama",              shortName: "PAN", flag: "pa",     confederation: "CONCACAF", group: "L", fifaRank: 40, squadStatus: "official",     manager: "Thomas Christiansen",    preferredFormation: "4-3-3" },
];

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;
export type GroupId = (typeof GROUPS)[number];

export function teamsByGroup(group: GroupId): WCTeam[] {
  return TEAMS.filter((t) => t.group === group);
}

export function teamById(id: number): WCTeam | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function teamByShortName(short: string): WCTeam | undefined {
  return TEAMS.find((t) => t.shortName === short);
}

// ─────────────────────────────────────────────────────────────────────────────
// Norwegian display names. `WCTeam.name` stays English (data fidelity + lookup
// stability); this is the user-facing label. Keyed by id so the TEAMS array
// doesn't need touching. Use teamName() everywhere a name is shown to users.
// ─────────────────────────────────────────────────────────────────────────────
const TEAM_NAME_NO: Record<number, string> = {
  1: "Mexico", 48: "Sør-Afrika", 3: "Sør-Korea", 49: "Tsjekkia",
  5: "Canada", 50: "Bosnia-Hercegovina", 47: "Qatar", 10: "Sveits",
  13: "Brasil", 12: "Marokko", 51: "Haiti", 52: "Skottland",
  9: "USA", 43: "Paraguay", 15: "Australia", 45: "Tyrkia",
  6: "Tyskland", 53: "Curaçao", 32: "Elfenbenskysten", 33: "Ecuador",
  26: "Nederland", 7: "Japan", 54: "Sverige", 24: "Tunisia",
  38: "Belgia", 16: "Egypt", 11: "Iran", 39: "New Zealand",
  22: "Spania", 55: "Kapp Verde", 19: "Saudi-Arabia", 23: "Uruguay",
  14: "Frankrike", 8: "Senegal", 27: "Irak", 21: "Norge",
  4: "Argentina", 20: "Algerie", 56: "Østerrike", 35: "Jordan",
  18: "Portugal", 57: "DR Kongo", 31: "Usbekistan", 37: "Colombia",
  30: "England", 42: "Kroatia", 28: "Ghana", 25: "Panama",
};

/**
 * User-facing team name in Norwegian. Falls back to the English `name`
 * for any id not in the map, and returns "TBD" for an absent team (knockout
 * slots that haven't resolved yet) so callers can drop their own `?? "TBD"`.
 */
export function teamName(team?: Pick<WCTeam, "id" | "name"> | null): string {
  if (!team) return "TBD";
  return TEAM_NAME_NO[team.id] ?? team.name;
}

export function venueById(id: string): WCVenue | undefined {
  return VENUES.find((v) => v.id === id);
}

export const TOURNAMENT = {
  startDate: "2026-06-11",
  endDate: "2026-07-19",
  openerVenueId: "azteca",
  finalVenueId: "metlife",
};
