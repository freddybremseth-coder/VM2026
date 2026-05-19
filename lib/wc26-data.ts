/**
 * WC 2026 reference data.
 *
 * What's confirmed (from FIFA announcements pre-2026):
 *   - 48 teams in 12 groups of 4
 *   - 16 host venues across USA (11), Canada (2), Mexico (3)
 *   - Opener: Estadio Azteca, 11 June 2026 · Final: MetLife Stadium, 19 July 2026
 *
 * What is illustrative (NOT to be treated as authoritative):
 *   - The exact 48-team field. Some qualifiers (UEFA playoff winners, CAF/CONCACAF
 *     final spots, intercontinental playoffs) are decided in the months before the
 *     tournament. Squads below this file are illustrative — see `squadStatus`.
 *   - Group composition. The official draw happens shortly before the tournament.
 *     We mirror a plausible 12-group structure here so the UI has something to render.
 *
 * `squadStatus` is the source of truth for which squads should be rendered as "official"
 * vs. "preliminary" vs. "not yet announced".
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
  knockoutRole?: "opener" | "final" | "semifinal" | "quarterfinal";
}

// ─────────────────────────────────────────────────────────────────────────────
// Venues (confirmed)
// ─────────────────────────────────────────────────────────────────────────────
export const VENUES: WCVenue[] = [
  { id: "azteca",          name: "Estadio Azteca",         city: "Mexico City",       country: "Mexico", capacity: 87000, knockoutRole: "opener" },
  { id: "akron",           name: "Estadio Akron",          city: "Guadalajara",       country: "Mexico", capacity: 49000 },
  { id: "bbva",            name: "Estadio BBVA",           city: "Monterrey",         country: "Mexico", capacity: 53000 },
  { id: "bmo",             name: "BMO Field",              city: "Toronto",           country: "Canada", capacity: 45000 },
  { id: "bcplace",         name: "BC Place",               city: "Vancouver",         country: "Canada", capacity: 54500 },
  { id: "mercedes",        name: "Mercedes-Benz Stadium",  city: "Atlanta",           country: "USA",    capacity: 71000, knockoutRole: "semifinal" },
  { id: "gillette",        name: "Gillette Stadium",       city: "Boston",            country: "USA",    capacity: 65000, knockoutRole: "quarterfinal" },
  { id: "att",             name: "AT&T Stadium",           city: "Dallas",            country: "USA",    capacity: 80000, knockoutRole: "semifinal" },
  { id: "nrg",             name: "NRG Stadium",            city: "Houston",           country: "USA",    capacity: 72000 },
  { id: "arrowhead",       name: "Arrowhead Stadium",      city: "Kansas City",       country: "USA",    capacity: 76000 },
  { id: "sofi",            name: "SoFi Stadium",           city: "Los Angeles",       country: "USA",    capacity: 70000 },
  { id: "hardrock",        name: "Hard Rock Stadium",      city: "Miami",             country: "USA",    capacity: 65000, knockoutRole: "quarterfinal" },
  { id: "metlife",         name: "MetLife Stadium",        city: "New York/NJ",       country: "USA",    capacity: 82500, knockoutRole: "final" },
  { id: "lincoln",         name: "Lincoln Financial Field",city: "Philadelphia",      country: "USA",    capacity: 69000 },
  { id: "levis",           name: "Levi's Stadium",         city: "San Francisco/Bay", country: "USA",    capacity: 68500, knockoutRole: "quarterfinal" },
  { id: "lumen",           name: "Lumen Field",            city: "Seattle",           country: "USA",    capacity: 69000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Teams — 48 entries, organised into 12 groups (A–L).
// `squadStatus` indicates how trustworthy the squad data downstream is:
//   official    — final 26-man roster known (we encoded it)
//   preliminary — provisional squad announced
//   pending     — squad not yet announced / qualifying not finalised
// ─────────────────────────────────────────────────────────────────────────────
export const TEAMS: WCTeam[] = [
  // Group A
  { id: 1,  name: "Mexico",         shortName: "MEX", flag: "mx", confederation: "CONCACAF", group: "A", fifaRank: 14, squadStatus: "preliminary", manager: "Javier Aguirre",      preferredFormation: "4-3-3" },
  { id: 2,  name: "Poland",         shortName: "POL", flag: "pl", confederation: "UEFA",     group: "A", fifaRank: 33, squadStatus: "pending",     manager: "Michał Probierz",     preferredFormation: "4-2-3-1" },
  { id: 3,  name: "South Korea",    shortName: "KOR", flag: "kr", confederation: "AFC",      group: "A", fifaRank: 23, squadStatus: "pending",     manager: "Hong Myung-bo",        preferredFormation: "4-2-3-1" },
  { id: 4,  name: "Argentina",      shortName: "ARG", flag: "ar", confederation: "CONMEBOL", group: "A", fifaRank: 1,  squadStatus: "preliminary", manager: "Lionel Scaloni",       preferredFormation: "4-4-2" },

  // Group B
  { id: 5,  name: "Canada",         shortName: "CAN", flag: "ca", confederation: "CONCACAF", group: "B", fifaRank: 38, squadStatus: "preliminary", manager: "Jesse Marsch",         preferredFormation: "4-3-3" },
  { id: 6,  name: "Germany",        shortName: "GER", flag: "de", confederation: "UEFA",     group: "B", fifaRank: 9,  squadStatus: "preliminary", manager: "Julian Nagelsmann",    preferredFormation: "4-2-3-1" },
  { id: 7,  name: "Japan",          shortName: "JPN", flag: "jp", confederation: "AFC",      group: "B", fifaRank: 17, squadStatus: "preliminary", manager: "Hajime Moriyasu",      preferredFormation: "3-4-2-1" },
  { id: 8,  name: "Senegal",        shortName: "SEN", flag: "sn", confederation: "CAF",      group: "B", fifaRank: 19, squadStatus: "pending",     manager: "Pape Thiaw",           preferredFormation: "4-3-3" },

  // Group C
  { id: 9,  name: "USA",            shortName: "USA", flag: "us", confederation: "CONCACAF", group: "C", fifaRank: 16, squadStatus: "preliminary", manager: "Mauricio Pochettino",  preferredFormation: "4-3-3" },
  { id: 10, name: "Switzerland",    shortName: "SUI", flag: "ch", confederation: "UEFA",     group: "C", fifaRank: 20, squadStatus: "pending",     manager: "Murat Yakın",          preferredFormation: "3-4-2-1" },
  { id: 11, name: "Iran",           shortName: "IRN", flag: "ir", confederation: "AFC",      group: "C", fifaRank: 21, squadStatus: "pending",     manager: "Amir Ghalenoei",       preferredFormation: "4-3-3" },
  { id: 12, name: "Morocco",        shortName: "MAR", flag: "ma", confederation: "CAF",      group: "C", fifaRank: 13, squadStatus: "preliminary", manager: "Walid Regragui",       preferredFormation: "4-3-3" },

  // Group D
  { id: 13, name: "Brazil",         shortName: "BRA", flag: "br", confederation: "CONMEBOL", group: "D", fifaRank: 5,  squadStatus: "preliminary", manager: "Dorival Júnior",       preferredFormation: "4-2-3-1" },
  { id: 14, name: "France",         shortName: "FRA", flag: "fr", confederation: "UEFA",     group: "D", fifaRank: 2,  squadStatus: "preliminary", manager: "Didier Deschamps",     preferredFormation: "4-2-3-1" },
  { id: 15, name: "Australia",      shortName: "AUS", flag: "au", confederation: "AFC",      group: "D", fifaRank: 26, squadStatus: "pending",     manager: "Tony Popovic",         preferredFormation: "4-2-3-1" },
  { id: 16, name: "Egypt",          shortName: "EGY", flag: "eg", confederation: "CAF",      group: "D", fifaRank: 32, squadStatus: "pending",     manager: "Hossam Hassan",        preferredFormation: "4-3-3" },

  // Group E
  { id: 17, name: "Costa Rica",     shortName: "CRC", flag: "cr", confederation: "CONCACAF", group: "E", fifaRank: 54, squadStatus: "pending",     manager: "Gustavo Alfaro",       preferredFormation: "4-4-2" },
  { id: 18, name: "Portugal",       shortName: "POR", flag: "pt", confederation: "UEFA",     group: "E", fifaRank: 6,  squadStatus: "preliminary", manager: "Roberto Martínez",     preferredFormation: "4-3-3" },
  { id: 19, name: "Saudi Arabia",   shortName: "KSA", flag: "sa", confederation: "AFC",      group: "E", fifaRank: 56, squadStatus: "pending",     manager: "Hervé Renard",         preferredFormation: "4-2-3-1" },
  { id: 20, name: "Algeria",        shortName: "ALG", flag: "dz", confederation: "CAF",      group: "E", fifaRank: 36, squadStatus: "pending",     manager: "Vladimir Petković",    preferredFormation: "4-3-3" },

  // Group F
  { id: 21, name: "Norway",         shortName: "NOR", flag: "no", confederation: "UEFA",     group: "F", fifaRank: 39, squadStatus: "preliminary", manager: "Ståle Solbakken",      preferredFormation: "4-3-3" },
  { id: 22, name: "Spain",          shortName: "ESP", flag: "es", confederation: "UEFA",     group: "F", fifaRank: 3,  squadStatus: "preliminary", manager: "Luis de la Fuente",    preferredFormation: "4-3-3" },
  { id: 23, name: "Uruguay",        shortName: "URU", flag: "uy", confederation: "CONMEBOL", group: "F", fifaRank: 15, squadStatus: "preliminary", manager: "Marcelo Bielsa",       preferredFormation: "3-3-1-3" },
  { id: 24, name: "Tunisia",        shortName: "TUN", flag: "tn", confederation: "CAF",      group: "F", fifaRank: 41, squadStatus: "pending",     manager: "Sami Trabelsi",        preferredFormation: "4-3-3" },

  // Group G
  { id: 25, name: "Panama",         shortName: "PAN", flag: "pa", confederation: "CONCACAF", group: "G", fifaRank: 40, squadStatus: "pending",     manager: "Thomas Christiansen",  preferredFormation: "4-3-3" },
  { id: 26, name: "Netherlands",    shortName: "NED", flag: "nl", confederation: "UEFA",     group: "G", fifaRank: 7,  squadStatus: "preliminary", manager: "Ronald Koeman",        preferredFormation: "4-3-3" },
  { id: 27, name: "Iraq",           shortName: "IRQ", flag: "iq", confederation: "AFC",      group: "G", fifaRank: 58, squadStatus: "pending",     manager: "Graham Arnold",        preferredFormation: "4-2-3-1" },
  { id: 28, name: "Ghana",          shortName: "GHA", flag: "gh", confederation: "CAF",      group: "G", fifaRank: 76, squadStatus: "pending",     manager: "Otto Addo",            preferredFormation: "4-3-3" },

  // Group H
  { id: 29, name: "Jamaica",        shortName: "JAM", flag: "jm", confederation: "CONCACAF", group: "H", fifaRank: 60, squadStatus: "pending",     manager: "Steve McClaren",       preferredFormation: "5-3-2" },
  { id: 30, name: "England",        shortName: "ENG", flag: "gb-eng", confederation: "UEFA", group: "H", fifaRank: 4,  squadStatus: "preliminary", manager: "Thomas Tuchel",        preferredFormation: "4-2-3-1" },
  { id: 31, name: "Uzbekistan",     shortName: "UZB", flag: "uz", confederation: "AFC",      group: "H", fifaRank: 57, squadStatus: "pending",     manager: "Timur Kapadze",        preferredFormation: "4-3-3" },
  { id: 32, name: "Côte d'Ivoire",  shortName: "CIV", flag: "ci", confederation: "CAF",      group: "H", fifaRank: 42, squadStatus: "pending",     manager: "Emerse Faé",           preferredFormation: "4-3-3" },

  // Group I
  { id: 33, name: "Ecuador",        shortName: "ECU", flag: "ec", confederation: "CONMEBOL", group: "I", fifaRank: 25, squadStatus: "pending",     manager: "Sebastián Beccacece",  preferredFormation: "4-3-3" },
  { id: 34, name: "Italy",          shortName: "ITA", flag: "it", confederation: "UEFA",     group: "I", fifaRank: 10, squadStatus: "pending",     manager: "Luciano Spalletti",    preferredFormation: "4-3-3" },
  { id: 35, name: "Jordan",         shortName: "JOR", flag: "jo", confederation: "AFC",      group: "I", fifaRank: 70, squadStatus: "pending",     manager: "Jamal Sellami",        preferredFormation: "4-3-3" },
  { id: 36, name: "Cameroon",       shortName: "CMR", flag: "cm", confederation: "CAF",      group: "I", fifaRank: 50, squadStatus: "pending",     manager: "Marc Brys",            preferredFormation: "4-3-3" },

  // Group J
  { id: 37, name: "Colombia",       shortName: "COL", flag: "co", confederation: "CONMEBOL", group: "J", fifaRank: 12, squadStatus: "preliminary", manager: "Néstor Lorenzo",       preferredFormation: "4-2-3-1" },
  { id: 38, name: "Belgium",        shortName: "BEL", flag: "be", confederation: "UEFA",     group: "J", fifaRank: 8,  squadStatus: "pending",     manager: "Rudi Garcia",          preferredFormation: "3-4-2-1" },
  { id: 39, name: "New Zealand",    shortName: "NZL", flag: "nz", confederation: "OFC",      group: "J", fifaRank: 89, squadStatus: "pending",     manager: "Darren Bazeley",       preferredFormation: "4-4-2" },
  { id: 40, name: "Nigeria",        shortName: "NGA", flag: "ng", confederation: "CAF",      group: "J", fifaRank: 28, squadStatus: "pending",     manager: "Eric Chelle",          preferredFormation: "4-3-3" },

  // Group K
  { id: 41, name: "Honduras",       shortName: "HON", flag: "hn", confederation: "CONCACAF", group: "K", fifaRank: 80, squadStatus: "pending",     manager: "Reinaldo Rueda",       preferredFormation: "4-4-2" },
  { id: 42, name: "Croatia",        shortName: "CRO", flag: "hr", confederation: "UEFA",     group: "K", fifaRank: 11, squadStatus: "preliminary", manager: "Zlatko Dalić",         preferredFormation: "4-3-3" },
  { id: 43, name: "Paraguay",       shortName: "PAR", flag: "py", confederation: "CONMEBOL", group: "K", fifaRank: 45, squadStatus: "pending",     manager: "Gustavo Alfaro",       preferredFormation: "4-3-3" },
  { id: 44, name: "Mali",           shortName: "MLI", flag: "ml", confederation: "CAF",      group: "K", fifaRank: 47, squadStatus: "pending",     manager: "Tom Saintfiet",        preferredFormation: "4-3-3" },

  // Group L
  { id: 45, name: "Türkiye",        shortName: "TUR", flag: "tr", confederation: "UEFA",     group: "L", fifaRank: 27, squadStatus: "pending",     manager: "Vincenzo Montella",    preferredFormation: "4-2-3-1" },
  { id: 46, name: "Denmark",        shortName: "DEN", flag: "dk", confederation: "UEFA",     group: "L", fifaRank: 22, squadStatus: "pending",     manager: "Brian Riemer",         preferredFormation: "4-3-3" },
  { id: 47, name: "Qatar",          shortName: "QAT", flag: "qa", confederation: "AFC",      group: "L", fifaRank: 53, squadStatus: "pending",     manager: "Luís García",          preferredFormation: "5-3-2" },
  { id: 48, name: "South Africa",   shortName: "RSA", flag: "za", confederation: "CAF",      group: "L", fifaRank: 59, squadStatus: "pending",     manager: "Hugo Broos",           preferredFormation: "4-3-3" },
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
