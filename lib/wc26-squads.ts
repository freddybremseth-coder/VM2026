/**
 * Player squad data for WC 2026.
 *
 * Coverage is intentionally partial:
 *   - 6 teams have illustrative 23-player squads (NOR, ESP, BRA, ARG, ENG, FRA).
 *     These are real players who would plausibly be selected based on club form
 *     and recent international appearances — they are NOT official squad lists.
 *   - All other teams: empty array. The UI renders a "squad not yet announced"
 *     state for them.
 *
 * Player positions use the broad role labels: GK, CB, RB, LB, DM, CM, AM, RW, LW, ST.
 * Coordinates (x, y) are 0–100 percentages where x=0 is left touchline, y=0 is
 * the team's own goal line — used by FormationPitch.tsx when this player is in
 * the starting XI.
 */

export type Position = "GK" | "CB" | "RB" | "LB" | "DM" | "CM" | "AM" | "RW" | "LW" | "ST";

export interface Player {
  /** Stable id, scoped to the team. Just `teamId * 100 + n`. */
  id: number;
  teamId: number;
  /** Squad number — 0 if unknown / not assigned yet. */
  number: number;
  name: string;
  position: Position;
  club: string;
  /** Optional stats — left undefined when not published yet. */
  age?: number;
  caps?: number;
  goals?: number;
  /** Where on the pitch they'd start if picked, in percentage coords. */
  startX?: number;
  startY?: number;
  /** Marks the captain. */
  isCaptain?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Norway · Group I · preliminary (final 26 announced 21 May 2026 at Grue IL —
// awaiting confirmation of the full list. The 11 players Solbakken named as
// "confirmed" in his April briefing are present below: Nyland, Ajer, Heggem,
// Østigård, Ødegaard, Aursnes, Haaland, Sørloth, Nusa, Bobb, Schjelderup.)
// ─────────────────────────────────────────────────────────────────────────────
const NORWAY: Player[] = [
  // Goalkeepers
  { id: 2101, teamId: 21, number: 1,  name: "Ørjan Nyland",        position: "GK", club: "Sevilla",         age: 35, caps: 41, goals: 0,  startX: 50, startY: 92 },
  { id: 2102, teamId: 21, number: 13, name: "Sten Grytebust",      position: "GK", club: "OB",              age: 36, caps: 6,  goals: 0 },
  { id: 2103, teamId: 21, number: 22, name: "Egil Selvik",         position: "GK", club: "Brann",           age: 28, caps: 3,  goals: 0 },
  // Defenders
  { id: 2104, teamId: 21, number: 2,  name: "Julian Ryerson",      position: "RB", club: "Dortmund",        age: 28, caps: 26, goals: 0,  startX: 82, startY: 75 },
  { id: 2105, teamId: 21, number: 3,  name: "Fredrik Bjørkan",     position: "LB", club: "Lecce",           age: 27, caps: 16, goals: 0,  startX: 18, startY: 75 },
  { id: 2106, teamId: 21, number: 4,  name: "Kristoffer Ajer",     position: "CB", club: "Brentford",       age: 28, caps: 39, goals: 1,  startX: 62, startY: 80 },
  { id: 2107, teamId: 21, number: 5,  name: "Leo Østigård",        position: "CB", club: "Rennes",          age: 26, caps: 22, goals: 1,  startX: 38, startY: 80 },
  { id: 2108, teamId: 21, number: 14, name: "Birger Meling",       position: "LB", club: "Rennes",          age: 31, caps: 30, goals: 0 },
  { id: 2109, teamId: 21, number: 21, name: "Andreas Hanche-Olsen",position: "CB", club: "Mainz",           age: 28, caps: 19, goals: 0 },
  // Midfielders
  { id: 2110, teamId: 21, number: 6,  name: "Sander Berge",        position: "CM", club: "Fulham",          age: 28, caps: 38, goals: 4,  startX: 50, startY: 60 },
  { id: 2111, teamId: 21, number: 8,  name: "Patrick Berg",        position: "CM", club: "Lens",            age: 27, caps: 21, goals: 0,  startX: 32, startY: 55 },
  { id: 2112, teamId: 21, number: 10, name: "Martin Ødegaard",     position: "AM", club: "Arsenal",         age: 27, caps: 50, goals: 11, startX: 68, startY: 48, isCaptain: true },
  { id: 2113, teamId: 21, number: 15, name: "Morten Thorsby",      position: "DM", club: "Genoa",           age: 29, caps: 19, goals: 1 },
  { id: 2114, teamId: 21, number: 16, name: "Fredrik Aursnes",     position: "CM", club: "Benfica",         age: 30, caps: 17, goals: 0 },
  { id: 2115, teamId: 21, number: 20, name: "Kristian Thorstvedt", position: "CM", club: "Sassuolo",        age: 26, caps: 26, goals: 6 },
  // Forwards
  { id: 2116, teamId: 21, number: 7,  name: "Mohamed Elyounoussi", position: "LW", club: "Werder Bremen",   age: 31, caps: 60, goals: 11 },
  { id: 2117, teamId: 21, number: 9,  name: "Erling Haaland",      position: "ST", club: "Manchester City", age: 25, caps: 36, goals: 36, startX: 50, startY: 18 },
  { id: 2118, teamId: 21, number: 11, name: "Oscar Bobb",          position: "RW", club: "Manchester City", age: 22, caps: 9,  goals: 1,  startX: 78, startY: 30 },
  { id: 2119, teamId: 21, number: 17, name: "Antonio Nusa",        position: "LW", club: "RB Leipzig",      age: 20, caps: 14, goals: 4,  startX: 22, startY: 30 },
  { id: 2120, teamId: 21, number: 18, name: "Alexander Sørloth",   position: "ST", club: "Atlético Madrid", age: 30, caps: 47, goals: 11 },
  { id: 2121, teamId: 21, number: 19, name: "Jørgen Strand Larsen",position: "ST", club: "Wolves",          age: 25, caps: 11, goals: 2 },
  { id: 2122, teamId: 21, number: 23, name: "Markus Solbakken",    position: "DM", club: "Hoffenheim",      age: 25, caps: 8,  goals: 0 },
  // Added 21 May 2026 — both confirmed by Solbakken in pre-announcement briefing
  { id: 2123, teamId: 21, number: 12, name: "Torbjørn Heggem",     position: "CB", club: "West Brom",       age: 26, caps: 4,  goals: 0 },
  { id: 2124, teamId: 21, number: 24, name: "Andreas Schjelderup", position: "LW", club: "Benfica",         age: 21, caps: 9,  goals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Spain · Group F · preliminary
// ─────────────────────────────────────────────────────────────────────────────
const SPAIN: Player[] = [
  { id: 2201, teamId: 22, number: 1,  name: "David Raya",        position: "GK", club: "Arsenal",          age: 30, caps: 11, goals: 0 },
  { id: 2202, teamId: 22, number: 13, name: "Álex Remiro",       position: "GK", club: "Real Sociedad",    age: 30, caps: 4,  goals: 0 },
  { id: 2203, teamId: 22, number: 23, name: "Unai Simón",        position: "GK", club: "Athletic Bilbao",  age: 28, caps: 41, goals: 0,  startX: 50, startY: 92 },
  { id: 2204, teamId: 22, number: 2,  name: "Dani Carvajal",     position: "RB", club: "Real Madrid",      age: 34, caps: 43, goals: 1,  startX: 82, startY: 75 },
  { id: 2205, teamId: 22, number: 3,  name: "Pedro Porro",       position: "RB", club: "Tottenham",        age: 26, caps: 9,  goals: 0 },
  { id: 2206, teamId: 22, number: 4,  name: "Robin Le Normand",  position: "CB", club: "Atlético Madrid",  age: 29, caps: 26, goals: 1,  startX: 38, startY: 80 },
  { id: 2207, teamId: 22, number: 14, name: "Aymeric Laporte",   position: "CB", club: "Al-Nassr",         age: 31, caps: 35, goals: 1,  startX: 62, startY: 80 },
  { id: 2208, teamId: 22, number: 18, name: "Marc Cucurella",    position: "LB", club: "Chelsea",          age: 27, caps: 24, goals: 1,  startX: 18, startY: 75 },
  { id: 2209, teamId: 22, number: 5,  name: "Daniel Vivian",     position: "CB", club: "Athletic Bilbao",  age: 26, caps: 6,  goals: 0 },
  { id: 2210, teamId: 22, number: 22, name: "Jesús Navas",       position: "RB", club: "Sevilla",          age: 40, caps: 56, goals: 5 },
  { id: 2211, teamId: 22, number: 8,  name: "Fabián Ruiz",       position: "CM", club: "PSG",              age: 29, caps: 29, goals: 8,  startX: 35, startY: 50 },
  { id: 2212, teamId: 22, number: 9,  name: "Pedri",             position: "CM", club: "Barcelona",        age: 23, caps: 28, goals: 4,  startX: 65, startY: 50 },
  { id: 2213, teamId: 22, number: 16, name: "Rodri",             position: "DM", club: "Manchester City",  age: 29, caps: 60, goals: 3,  startX: 50, startY: 62, isCaptain: true },
  { id: 2214, teamId: 22, number: 6,  name: "Mikel Merino",      position: "CM", club: "Arsenal",          age: 30, caps: 32, goals: 4 },
  { id: 2215, teamId: 22, number: 12, name: "Martín Zubimendi",  position: "DM", club: "Arsenal",          age: 27, caps: 13, goals: 0 },
  { id: 2216, teamId: 22, number: 7,  name: "Álvaro Morata",     position: "ST", club: "Como",             age: 33, caps: 80, goals: 38, startX: 50, startY: 18 },
  { id: 2217, teamId: 22, number: 10, name: "Dani Olmo",         position: "AM", club: "Barcelona",        age: 27, caps: 41, goals: 12 },
  { id: 2218, teamId: 22, number: 11, name: "Ferran Torres",     position: "ST", club: "Barcelona",        age: 26, caps: 49, goals: 21 },
  { id: 2219, teamId: 22, number: 17, name: "Nico Williams",     position: "LW", club: "Athletic Bilbao",  age: 23, caps: 24, goals: 7,  startX: 20, startY: 28 },
  { id: 2220, teamId: 22, number: 19, name: "Lamine Yamal",      position: "RW", club: "Barcelona",        age: 18, caps: 22, goals: 7,  startX: 80, startY: 28 },
  { id: 2221, teamId: 22, number: 20, name: "Mikel Oyarzabal",   position: "LW", club: "Real Sociedad",    age: 28, caps: 35, goals: 12 },
  { id: 2222, teamId: 22, number: 21, name: "Bryan Zaragoza",    position: "LW", club: "Granada",          age: 24, caps: 6,  goals: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Brazil · Group C · OFFICIAL (announced 18 May 2026 by Carlo Ancelotti)
// Source: DAZN, Sky Sports squad announcement coverage.
// ─────────────────────────────────────────────────────────────────────────────
const BRAZIL: Player[] = [
  // Goalkeepers
  { id: 1301, teamId: 13, number: 1,  name: "Alisson",          position: "GK", club: "Liverpool",         age: 33, caps: 68, goals: 0,  startX: 50, startY: 92 },
  { id: 1302, teamId: 13, number: 12, name: "Ederson",          position: "GK", club: "Fenerbahçe",        age: 32, caps: 27, goals: 0 },
  { id: 1303, teamId: 13, number: 23, name: "Weverton",         position: "GK", club: "Grêmio",            age: 37, caps: 9,  goals: 0 },
  // Defenders
  { id: 1304, teamId: 13, number: 2,  name: "Danilo",           position: "RB", club: "Flamengo",          age: 34, caps: 60, goals: 1,  startX: 82, startY: 75, isCaptain: true },
  { id: 1305, teamId: 13, number: 3,  name: "Marquinhos",       position: "CB", club: "PSG",               age: 31, caps: 89, goals: 7,  startX: 38, startY: 80 },
  { id: 1306, teamId: 13, number: 4,  name: "Gabriel Magalhães",position: "CB", club: "Arsenal",           age: 28, caps: 17, goals: 1,  startX: 62, startY: 80 },
  { id: 1307, teamId: 13, number: 5,  name: "Bremer",           position: "CB", club: "Juventus",          age: 28, caps: 11, goals: 0 },
  { id: 1308, teamId: 13, number: 6,  name: "Alex Sandro",      position: "LB", club: "Flamengo",          age: 35, caps: 38, goals: 2,  startX: 18, startY: 75 },
  { id: 1309, teamId: 13, number: 13, name: "Léo Pereira",      position: "CB", club: "Flamengo",          age: 30, caps: 6,  goals: 0 },
  { id: 1310, teamId: 13, number: 14, name: "Roger Ibañez",     position: "CB", club: "Al-Ahli",           age: 27, caps: 13, goals: 0 },
  { id: 1311, teamId: 13, number: 16, name: "Douglas Santos",   position: "LB", club: "Zenit",             age: 32, caps: 5,  goals: 0 },
  { id: 1312, teamId: 13, number: 22, name: "Wesley",           position: "RB", club: "Roma",              age: 22, caps: 4,  goals: 0 },
  // Midfielders
  { id: 1313, teamId: 13, number: 8,  name: "Bruno Guimarães",  position: "DM", club: "Newcastle",         age: 28, caps: 33, goals: 3,  startX: 50, startY: 60 },
  { id: 1314, teamId: 13, number: 18, name: "Casemiro",         position: "DM", club: "Manchester United", age: 34, caps: 76, goals: 7 },
  { id: 1315, teamId: 13, number: 17, name: "Lucas Paquetá",    position: "AM", club: "Flamengo",          age: 28, caps: 49, goals: 11, startX: 32, startY: 50 },
  { id: 1316, teamId: 13, number: 15, name: "Fabinho",          position: "DM", club: "Al-Ittihad",        age: 32, caps: 31, goals: 0 },
  { id: 1317, teamId: 13, number: 25, name: "Danilo (Botafogo)",position: "CM", club: "Botafogo",          age: 24, caps: 4,  goals: 0,  startX: 68, startY: 55 },
  // Forwards
  { id: 1318, teamId: 13, number: 7,  name: "Vinícius Jr.",     position: "LW", club: "Real Madrid",       age: 25, caps: 41, goals: 6,  startX: 22, startY: 28 },
  { id: 1319, teamId: 13, number: 9,  name: "Matheus Cunha",    position: "ST", club: "Manchester United", age: 26, caps: 11, goals: 1,  startX: 50, startY: 18 },
  { id: 1320, teamId: 13, number: 10, name: "Neymar",           position: "AM", club: "Santos",            age: 34, caps: 130,goals: 79, startX: 50, startY: 35 },
  { id: 1321, teamId: 13, number: 11, name: "Raphinha",         position: "RW", club: "Barcelona",         age: 29, caps: 32, goals: 11, startX: 78, startY: 28 },
  { id: 1322, teamId: 13, number: 19, name: "Endrick",          position: "ST", club: "Lyon",              age: 19, caps: 14, goals: 3 },
  { id: 1323, teamId: 13, number: 20, name: "Gabriel Martinelli",position: "LW",club: "Arsenal",           age: 25, caps: 13, goals: 2 },
  { id: 1324, teamId: 13, number: 21, name: "Igor Thiago",      position: "ST", club: "Brentford",         age: 24, caps: 3,  goals: 1 },
  { id: 1325, teamId: 13, number: 24, name: "Rayan",            position: "RW", club: "Bournemouth",       age: 19, caps: 2,  goals: 0 },
  { id: 1326, teamId: 13, number: 26, name: "Luiz Henrique",    position: "RW", club: "Zenit",             age: 25, caps: 5,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Argentina · Group A · preliminary
// ─────────────────────────────────────────────────────────────────────────────
const ARGENTINA: Player[] = [
  { id: 401, teamId: 4, number: 1,  name: "Emiliano Martínez", position: "GK", club: "Aston Villa",    age: 33, caps: 49, goals: 0,  startX: 50, startY: 92 },
  { id: 402, teamId: 4, number: 12, name: "Gerónimo Rulli",    position: "GK", club: "Marseille",      age: 33, caps: 6,  goals: 0 },
  { id: 403, teamId: 4, number: 23, name: "Walter Benítez",    position: "GK", club: "PSV",            age: 32, caps: 2,  goals: 0 },
  { id: 404, teamId: 4, number: 4,  name: "Gonzalo Montiel",   position: "RB", club: "Sevilla",        age: 28, caps: 26, goals: 1,  startX: 82, startY: 75 },
  { id: 405, teamId: 4, number: 13, name: "Cristian Romero",   position: "CB", club: "Tottenham",      age: 27, caps: 41, goals: 3,  startX: 62, startY: 80 },
  { id: 406, teamId: 4, number: 6,  name: "Germán Pezzella",   position: "CB", club: "River Plate",    age: 34, caps: 33, goals: 1 },
  { id: 407, teamId: 4, number: 25, name: "Lisandro Martínez", position: "CB", club: "Manchester United", age: 28, caps: 26, goals: 1, startX: 38, startY: 80 },
  { id: 408, teamId: 4, number: 3,  name: "Nicolás Tagliafico",position: "LB", club: "Lyon",           age: 33, caps: 53, goals: 2,  startX: 18, startY: 75 },
  { id: 409, teamId: 4, number: 26, name: "Nahuel Molina",     position: "RB", club: "Atlético Madrid",age: 27, caps: 35, goals: 2 },
  { id: 410, teamId: 4, number: 19, name: "Nicolás Otamendi",  position: "CB", club: "Benfica",        age: 37, caps: 121,goals: 6 },
  { id: 411, teamId: 4, number: 7,  name: "Rodrigo De Paul",   position: "CM", club: "Atlético Madrid",age: 31, caps: 71, goals: 4,  startX: 65, startY: 55 },
  { id: 412, teamId: 4, number: 5,  name: "Leandro Paredes",   position: "DM", club: "Boca Juniors",   age: 31, caps: 70, goals: 5,  startX: 50, startY: 62 },
  { id: 413, teamId: 4, number: 8,  name: "Enzo Fernández",    position: "CM", club: "Chelsea",        age: 25, caps: 35, goals: 3,  startX: 35, startY: 55 },
  { id: 414, teamId: 4, number: 17, name: "Alexis Mac Allister",position: "CM", club: "Liverpool",     age: 27, caps: 33, goals: 4 },
  { id: 415, teamId: 4, number: 14, name: "Exequiel Palacios", position: "CM", club: "Bayer Leverkusen",age: 27, caps: 36, goals: 2 },
  { id: 416, teamId: 4, number: 20, name: "Giovani Lo Celso",  position: "AM", club: "Real Betis",     age: 30, caps: 53, goals: 5 },
  { id: 417, teamId: 4, number: 10, name: "Lionel Messi",      position: "AM", club: "Inter Miami",    age: 38, caps: 191,goals: 112,startX: 50, startY: 35, isCaptain: true },
  { id: 418, teamId: 4, number: 11, name: "Ángel Di María",    position: "RW", club: "Benfica",        age: 38, caps: 145,goals: 31 },
  { id: 419, teamId: 4, number: 9,  name: "Julián Álvarez",    position: "ST", club: "Atlético Madrid",age: 26, caps: 38, goals: 11, startX: 35, startY: 22 },
  { id: 420, teamId: 4, number: 22, name: "Lautaro Martínez",  position: "ST", club: "Inter",          age: 28, caps: 71, goals: 32, startX: 65, startY: 22 },
  { id: 421, teamId: 4, number: 21, name: "Paulo Dybala",      position: "AM", club: "Roma",           age: 32, caps: 36, goals: 4 },
  { id: 422, teamId: 4, number: 18, name: "Nicolás González",  position: "LW", club: "Juventus",       age: 28, caps: 28, goals: 7 },
];

// ─────────────────────────────────────────────────────────────────────────────
// England · Group H · preliminary
// ─────────────────────────────────────────────────────────────────────────────
const ENGLAND: Player[] = [
  { id: 3001, teamId: 30, number: 1,  name: "Jordan Pickford",    position: "GK", club: "Everton",         age: 32, caps: 76, goals: 0,  startX: 50, startY: 92 },
  { id: 3002, teamId: 30, number: 13, name: "Dean Henderson",     position: "GK", club: "Crystal Palace",  age: 28, caps: 4,  goals: 0 },
  { id: 3003, teamId: 30, number: 23, name: "Nick Pope",          position: "GK", club: "Newcastle",       age: 33, caps: 11, goals: 0 },
  { id: 3004, teamId: 30, number: 2,  name: "Trent Alexander-Arnold", position: "RB", club: "Real Madrid", age: 27, caps: 33, goals: 3, startX: 82, startY: 75 },
  { id: 3005, teamId: 30, number: 3,  name: "Luke Shaw",          position: "LB", club: "Manchester United", age: 30, caps: 32, goals: 3, startX: 18, startY: 75 },
  { id: 3006, teamId: 30, number: 5,  name: "John Stones",        position: "CB", club: "Manchester City", age: 31, caps: 81, goals: 3,  startX: 38, startY: 80 },
  { id: 3007, teamId: 30, number: 6,  name: "Marc Guéhi",         position: "CB", club: "Crystal Palace",  age: 25, caps: 21, goals: 1,  startX: 62, startY: 80 },
  { id: 3008, teamId: 30, number: 12, name: "Kyle Walker",        position: "RB", club: "Burnley",         age: 35, caps: 91, goals: 1 },
  { id: 3009, teamId: 30, number: 14, name: "Ezri Konsa",         position: "CB", club: "Aston Villa",     age: 28, caps: 9,  goals: 0 },
  { id: 3010, teamId: 30, number: 16, name: "Tino Livramento",    position: "RB", club: "Newcastle",       age: 23, caps: 4,  goals: 0 },
  { id: 3011, teamId: 30, number: 4,  name: "Declan Rice",        position: "DM", club: "Arsenal",         age: 27, caps: 60, goals: 5,  startX: 50, startY: 62 },
  { id: 3012, teamId: 30, number: 8,  name: "Jordan Henderson",   position: "CM", club: "Ajax",            age: 35, caps: 81, goals: 3 },
  { id: 3013, teamId: 30, number: 10, name: "Jude Bellingham",    position: "AM", club: "Real Madrid",     age: 22, caps: 38, goals: 8,  startX: 35, startY: 50 },
  { id: 3014, teamId: 30, number: 22, name: "Conor Gallagher",    position: "CM", club: "Atlético Madrid", age: 26, caps: 18, goals: 0 },
  { id: 3015, teamId: 30, number: 26, name: "Adam Wharton",       position: "CM", club: "Crystal Palace",  age: 22, caps: 4,  goals: 0 },
  { id: 3016, teamId: 30, number: 7,  name: "Bukayo Saka",        position: "RW", club: "Arsenal",         age: 24, caps: 41, goals: 13, startX: 78, startY: 32 },
  { id: 3017, teamId: 30, number: 9,  name: "Harry Kane",         position: "ST", club: "Bayern Munich",   age: 32, caps: 99, goals: 69, startX: 50, startY: 18, isCaptain: true },
  { id: 3018, teamId: 30, number: 11, name: "Phil Foden",         position: "AM", club: "Manchester City", age: 25, caps: 43, goals: 5,  startX: 65, startY: 50 },
  { id: 3019, teamId: 30, number: 17, name: "Cole Palmer",        position: "AM", club: "Chelsea",         age: 23, caps: 16, goals: 4 },
  { id: 3020, teamId: 30, number: 18, name: "Anthony Gordon",     position: "LW", club: "Newcastle",       age: 25, caps: 9,  goals: 0,  startX: 22, startY: 32 },
  { id: 3021, teamId: 30, number: 19, name: "Ollie Watkins",      position: "ST", club: "Aston Villa",     age: 30, caps: 18, goals: 5 },
  { id: 3022, teamId: 30, number: 20, name: "Marcus Rashford",    position: "LW", club: "Aston Villa",     age: 28, caps: 62, goals: 17 },
];

// ─────────────────────────────────────────────────────────────────────────────
// France · Group D · preliminary
// ─────────────────────────────────────────────────────────────────────────────
const FRANCE: Player[] = [
  { id: 1401, teamId: 14, number: 1,  name: "Mike Maignan",      position: "GK", club: "Milan",          age: 30, caps: 26, goals: 0,  startX: 50, startY: 92 },
  { id: 1402, teamId: 14, number: 16, name: "Brice Samba",       position: "GK", club: "Rennes",         age: 31, caps: 6,  goals: 0 },
  { id: 1403, teamId: 14, number: 23, name: "Lucas Chevalier",   position: "GK", club: "PSG",            age: 24, caps: 4,  goals: 0 },
  { id: 1404, teamId: 14, number: 2,  name: "Jonathan Clauss",   position: "RB", club: "Marseille",      age: 33, caps: 18, goals: 1 },
  { id: 1405, teamId: 14, number: 3,  name: "Theo Hernández",    position: "LB", club: "Al-Hilal",       age: 28, caps: 41, goals: 5,  startX: 18, startY: 75 },
  { id: 1406, teamId: 14, number: 4,  name: "Dayot Upamecano",   position: "CB", club: "Bayern Munich",  age: 27, caps: 24, goals: 0,  startX: 62, startY: 80 },
  { id: 1407, teamId: 14, number: 5,  name: "Jules Koundé",      position: "RB", club: "Barcelona",      age: 27, caps: 36, goals: 2,  startX: 82, startY: 75 },
  { id: 1408, teamId: 14, number: 17, name: "William Saliba",    position: "CB", club: "Arsenal",        age: 25, caps: 18, goals: 0,  startX: 38, startY: 80 },
  { id: 1409, teamId: 14, number: 22, name: "Lucas Digne",       position: "LB", club: "Aston Villa",    age: 32, caps: 56, goals: 0 },
  { id: 1410, teamId: 14, number: 21, name: "Ibrahima Konaté",   position: "CB", club: "Liverpool",      age: 26, caps: 14, goals: 0 },
  { id: 1411, teamId: 14, number: 6,  name: "Eduardo Camavinga", position: "CM", club: "Real Madrid",    age: 23, caps: 27, goals: 1,  startX: 35, startY: 55 },
  { id: 1412, teamId: 14, number: 8,  name: "Aurélien Tchouaméni",position: "DM", club: "Real Madrid",    age: 26, caps: 32, goals: 1,  startX: 50, startY: 62 },
  { id: 1413, teamId: 14, number: 14, name: "Adrien Rabiot",     position: "CM", club: "Marseille",      age: 31, caps: 53, goals: 6 },
  { id: 1414, teamId: 14, number: 13, name: "N'Golo Kanté",      position: "DM", club: "Al-Ittihad",     age: 35, caps: 58, goals: 2 },
  { id: 1415, teamId: 14, number: 18, name: "Warren Zaïre-Emery",position: "CM", club: "PSG",            age: 20, caps: 7,  goals: 1,  startX: 65, startY: 55 },
  { id: 1416, teamId: 14, number: 7,  name: "Antoine Griezmann", position: "AM", club: "Atlético Madrid",age: 35, caps: 137,goals: 44 },
  { id: 1417, teamId: 14, number: 9,  name: "Olivier Giroud",    position: "ST", club: "LAFC",           age: 39, caps: 137,goals: 57 },
  { id: 1418, teamId: 14, number: 10, name: "Kylian Mbappé",     position: "ST", club: "Real Madrid",    age: 27, caps: 86, goals: 50, startX: 50, startY: 18, isCaptain: true },
  { id: 1419, teamId: 14, number: 11, name: "Ousmane Dembélé",   position: "RW", club: "PSG",            age: 28, caps: 53, goals: 6,  startX: 78, startY: 30 },
  { id: 1420, teamId: 14, number: 12, name: "Randal Kolo Muani", position: "ST", club: "Juventus",       age: 27, caps: 30, goals: 8 },
  { id: 1421, teamId: 14, number: 19, name: "Bradley Barcola",   position: "LW", club: "PSG",            age: 23, caps: 8,  goals: 1,  startX: 22, startY: 30 },
  { id: 1422, teamId: 14, number: 20, name: "Michael Olise",     position: "RW", club: "Bayern Munich",  age: 24, caps: 6,  goals: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Bosnia & Herzegovina · Group B · OFFICIAL (announced 11 May 2026)
// ─────────────────────────────────────────────────────────────────────────────
const BOSNIA: Player[] = [
  { id: 5001, teamId: 50, number: 1,  name: "Nikola Vasilj",        position: "GK", club: "St. Pauli",            age: 30, caps: 14, goals: 0,  startX: 50, startY: 92 },
  { id: 5002, teamId: 50, number: 12, name: "Martin Zlomislić",     position: "GK", club: "Rijeka",               age: 25, caps: 2,  goals: 0 },
  { id: 5003, teamId: 50, number: 23, name: "Osman Hadžikić",       position: "GK", club: "Slaven Belupo",        age: 30, caps: 1,  goals: 0 },
  { id: 5004, teamId: 50, number: 3,  name: "Sead Kolašinac",       position: "LB", club: "Atalanta",             age: 32, caps: 64, goals: 1,  startX: 18, startY: 75 },
  { id: 5005, teamId: 50, number: 2,  name: "Amar Dedić",           position: "RB", club: "Benfica",              age: 23, caps: 18, goals: 0,  startX: 82, startY: 75 },
  { id: 5006, teamId: 50, number: 5,  name: "Nihad Mujakić",        position: "CB", club: "Gaziantep",            age: 27, caps: 12, goals: 0,  startX: 62, startY: 80 },
  { id: 5007, teamId: 50, number: 4,  name: "Nikola Katić",         position: "CB", club: "Schalke 04",           age: 29, caps: 18, goals: 1,  startX: 38, startY: 80 },
  { id: 5008, teamId: 50, number: 14, name: "Tarik Muharemović",    position: "CB", club: "Sassuolo",             age: 22, caps: 8,  goals: 0 },
  { id: 5009, teamId: 50, number: 17, name: "Stjepan Radeljić",     position: "CB", club: "Rijeka",               age: 26, caps: 5,  goals: 0 },
  { id: 5010, teamId: 50, number: 21, name: "Dennis Hadžikadunić",  position: "CB", club: "Sampdoria",            age: 27, caps: 9,  goals: 0 },
  { id: 5011, teamId: 50, number: 22, name: "Nidal Čelik",          position: "LB", club: "Lens",                 age: 23, caps: 4,  goals: 0 },
  { id: 5012, teamId: 50, number: 8,  name: "Amir Hadžiahmetović",  position: "DM", club: "Hull City",            age: 28, caps: 26, goals: 1,  startX: 50, startY: 60 },
  { id: 5013, teamId: 50, number: 6,  name: "Ivan Šunjić",          position: "CM", club: "Pafos",                age: 29, caps: 28, goals: 0,  startX: 35, startY: 55 },
  { id: 5014, teamId: 50, number: 15, name: "Ivan Bašić",           position: "CM", club: "Astana",               age: 27, caps: 6,  goals: 1 },
  { id: 5015, teamId: 50, number: 18, name: "Dženis Burnić",        position: "CM", club: "Karlsruher SC",        age: 27, caps: 8,  goals: 0 },
  { id: 5016, teamId: 50, number: 16, name: "Ermin Mahmić",         position: "CM", club: "Slovan Liberec",       age: 24, caps: 3,  goals: 0 },
  { id: 5017, teamId: 50, number: 20, name: "Benjamin Tahirović",   position: "CM", club: "Brøndby",              age: 22, caps: 11, goals: 0 },
  { id: 5018, teamId: 50, number: 24, name: "Amar Memić",           position: "CM", club: "Viktoria Plzeň",       age: 22, caps: 2,  goals: 0 },
  { id: 5019, teamId: 50, number: 25, name: "Armin Gigović",        position: "CM", club: "Young Boys",           age: 23, caps: 6,  goals: 0 },
  { id: 5020, teamId: 50, number: 26, name: "Kerim Alajbegović",    position: "AM", club: "RB Salzburg",          age: 20, caps: 2,  goals: 0,  startX: 65, startY: 50 },
  { id: 5021, teamId: 50, number: 19, name: "Esmir Bajraktarević",  position: "LW", club: "PSV Eindhoven",        age: 20, caps: 9,  goals: 1,  startX: 22, startY: 30 },
  { id: 5022, teamId: 50, number: 7,  name: "Ermedin Demirović",    position: "ST", club: "VfB Stuttgart",        age: 28, caps: 32, goals: 7,  startX: 50, startY: 18 },
  { id: 5023, teamId: 50, number: 11, name: "Jovo Lukić",           position: "ST", club: "Universitatea Cluj",   age: 27, caps: 4,  goals: 1 },
  { id: 5024, teamId: 50, number: 13, name: "Samed Baždar",         position: "ST", club: "Jagiellonia Białystok",age: 22, caps: 7,  goals: 1 },
  { id: 5025, teamId: 50, number: 9,  name: "Haris Tabaković",      position: "ST", club: "Mönchengladbach",      age: 31, caps: 11, goals: 3,  startX: 78, startY: 30 },
  { id: 5026, teamId: 50, number: 10, name: "Edin Džeko",           position: "ST", club: "Schalke 04",           age: 40, caps: 148,goals: 73, isCaptain: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// South Korea · Group A · OFFICIAL (announced 16 May 2026)
// ─────────────────────────────────────────────────────────────────────────────
const SOUTH_KOREA: Player[] = [
  { id: 301, teamId: 3, number: 21, name: "Jo Hyeon-woo",     position: "GK", club: "Ulsan",                  age: 34, caps: 38, goals: 0,  startX: 50, startY: 92 },
  { id: 302, teamId: 3, number: 1,  name: "Kim Seung-gyu",    position: "GK", club: "FC Tokyo",               age: 35, caps: 102,goals: 0 },
  { id: 303, teamId: 3, number: 23, name: "Song Bum-keun",    position: "GK", club: "Jeonbuk",                age: 28, caps: 5,  goals: 0 },
  { id: 304, teamId: 3, number: 13, name: "Kim Moon-hwan",    position: "RB", club: "Daejeon",                age: 30, caps: 35, goals: 1,  startX: 82, startY: 75 },
  { id: 305, teamId: 3, number: 3,  name: "Kim Min-jae",      position: "CB", club: "Bayern Munich",          age: 29, caps: 77, goals: 4,  startX: 62, startY: 80 },
  { id: 306, teamId: 3, number: 4,  name: "Kim Tae-hyon",     position: "CB", club: "Kashima Antlers",        age: 28, caps: 6,  goals: 0,  startX: 38, startY: 80 },
  { id: 307, teamId: 3, number: 2,  name: "Park Jin-seob",    position: "LB", club: "Zhejiang",               age: 25, caps: 11, goals: 0,  startX: 18, startY: 75 },
  { id: 308, teamId: 3, number: 5,  name: "Seol Young-woo",   position: "RB", club: "Red Star Belgrade",      age: 27, caps: 14, goals: 0 },
  { id: 309, teamId: 3, number: 22, name: "Jens Castrop",     position: "CB", club: "Mönchengladbach",        age: 23, caps: 2,  goals: 0 },
  { id: 310, teamId: 3, number: 26, name: "Lee Ki-hyuk",      position: "LB", club: "Gangwon",                age: 24, caps: 3,  goals: 0 },
  { id: 311, teamId: 3, number: 24, name: "Lee Tae-seok",     position: "CB", club: "Austria Wien",           age: 23, caps: 1,  goals: 0 },
  { id: 312, teamId: 3, number: 19, name: "Lee Han-beom",     position: "CB", club: "Midtjylland",            age: 23, caps: 4,  goals: 0 },
  { id: 313, teamId: 3, number: 6,  name: "Cho Yu-min",       position: "CB", club: "Sharjah",                age: 30, caps: 26, goals: 1 },
  { id: 314, teamId: 3, number: 16, name: "Kim Jin-gyu",      position: "CM", club: "Jeonbuk",                age: 28, caps: 7,  goals: 0 },
  { id: 315, teamId: 3, number: 14, name: "Bae Jun-ho",       position: "AM", club: "Stoke City",             age: 22, caps: 12, goals: 1,  startX: 65, startY: 50 },
  { id: 316, teamId: 3, number: 8,  name: "Paik Seung-ho",    position: "DM", club: "Birmingham",             age: 29, caps: 22, goals: 4,  startX: 50, startY: 60 },
  { id: 317, teamId: 3, number: 25, name: "Yang Hyun-jun",    position: "LW", club: "Celtic",                 age: 24, caps: 11, goals: 1 },
  { id: 318, teamId: 3, number: 15, name: "Eom Ji-sung",      position: "CM", club: "Swansea",                age: 23, caps: 8,  goals: 0 },
  { id: 319, teamId: 3, number: 18, name: "Lee Kang-in",      position: "AM", club: "Paris Saint-Germain",    age: 25, caps: 32, goals: 5,  startX: 35, startY: 50 },
  { id: 320, teamId: 3, number: 20, name: "Lee Dong-gyeong",  position: "AM", club: "Ulsan",                  age: 29, caps: 9,  goals: 0 },
  { id: 321, teamId: 3, number: 17, name: "Lee Jae-sung",     position: "CM", club: "Mainz",                  age: 33, caps: 95, goals: 18 },
  { id: 322, teamId: 3, number: 9,  name: "Hwang In-beom",    position: "DM", club: "Feyenoord",              age: 30, caps: 60, goals: 8 },
  { id: 323, teamId: 3, number: 11, name: "Hwang Hee-chan",   position: "RW", club: "Wolverhampton",          age: 30, caps: 67, goals: 18, startX: 78, startY: 30 },
  { id: 324, teamId: 3, number: 7,  name: "Son Heung-min",    position: "LW", club: "LAFC",                   age: 33, caps: 142,goals: 54, startX: 22, startY: 30, isCaptain: true },
  { id: 325, teamId: 3, number: 10, name: "Oh Hyeon-gyu",     position: "ST", club: "Beşiktaş",               age: 25, caps: 21, goals: 6,  startX: 50, startY: 18 },
  { id: 326, teamId: 3, number: 12, name: "Cho Gue-sung",     position: "ST", club: "Midtjylland",            age: 28, caps: 36, goals: 11 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Haiti · Group C · OFFICIAL (announced May 2026)
// ─────────────────────────────────────────────────────────────────────────────
const HAITI: Player[] = [
  { id: 5101, teamId: 51, number: 1,  name: "Johnny Placide",       position: "GK", club: "Bastia",               age: 37, caps: 53, goals: 0,  startX: 50, startY: 92 },
  { id: 5102, teamId: 51, number: 12, name: "Alexandre Pierre",     position: "GK", club: "Sochaux",              age: 28, caps: 14, goals: 0 },
  { id: 5103, teamId: 51, number: 23, name: "Josué Duverger",       position: "GK", club: "Cosmos Koblenz",       age: 27, caps: 4,  goals: 0 },
  { id: 5104, teamId: 51, number: 4,  name: "Ricardo Adé",          position: "CB", club: "LDU Quito",            age: 27, caps: 25, goals: 2,  startX: 38, startY: 80 },
  { id: 5105, teamId: 51, number: 2,  name: "Carlens Arcus",        position: "RB", club: "Angers",               age: 30, caps: 24, goals: 0,  startX: 82, startY: 75 },
  { id: 5106, teamId: 51, number: 5,  name: "Martin Experience",    position: "CB", club: "Nancy",                age: 25, caps: 4,  goals: 0 },
  { id: 5107, teamId: 51, number: 3,  name: "Jean-Kevin Duverne",   position: "LB", club: "Gent",                 age: 28, caps: 16, goals: 0,  startX: 18, startY: 75 },
  { id: 5108, teamId: 51, number: 13, name: "Duke Lacroix",         position: "RB", club: "Colorado Springs",     age: 32, caps: 11, goals: 0 },
  { id: 5109, teamId: 51, number: 14, name: "Wilguens Paugain",     position: "CB", club: "Zulte Waregem",        age: 26, caps: 6,  goals: 0 },
  { id: 5110, teamId: 51, number: 6,  name: "Hannes Delcroix",      position: "CB", club: "Lugano",               age: 27, caps: 5,  goals: 0,  startX: 62, startY: 80 },
  { id: 5111, teamId: 51, number: 22, name: "Keeto Thermoncy",      position: "LB", club: "Young Boys",           age: 22, caps: 3,  goals: 0 },
  { id: 5112, teamId: 51, number: 8,  name: "Leverton Pierre",      position: "CM", club: "Vizela",               age: 23, caps: 9,  goals: 1,  startX: 35, startY: 55 },
  { id: 5113, teamId: 51, number: 16, name: "Danley Jean Jacques",  position: "DM", club: "Philadelphia Union",   age: 28, caps: 14, goals: 0,  startX: 50, startY: 60 },
  { id: 5114, teamId: 51, number: 15, name: "Carl Sainté",          position: "CM", club: "El Paso Locomotive",   age: 29, caps: 8,  goals: 0 },
  { id: 5115, teamId: 51, number: 10, name: "Jean-Ricner Bellegarde",position: "AM",club: "Wolverhampton",        age: 28, caps: 17, goals: 2,  startX: 65, startY: 50, isCaptain: true },
  { id: 5116, teamId: 51, number: 17, name: "Woodensky Pierre",     position: "CM", club: "Violette",             age: 21, caps: 2,  goals: 0 },
  { id: 5117, teamId: 51, number: 19, name: "Dominique Simon",      position: "CM", club: "Tatran Prešov",        age: 24, caps: 4,  goals: 0 },
  { id: 5118, teamId: 51, number: 9,  name: "Duckens Nazon",        position: "ST", club: "Esteghlal",            age: 31, caps: 33, goals: 14, startX: 50, startY: 18 },
  { id: 5119, teamId: 51, number: 11, name: "Frantzy Pierrot",      position: "ST", club: "Çaykur Rizespor",      age: 30, caps: 19, goals: 5 },
  { id: 5120, teamId: 51, number: 7,  name: "Derrick Etienne Jr.",  position: "RW", club: "Toronto FC",           age: 30, caps: 31, goals: 6,  startX: 78, startY: 30 },
  { id: 5121, teamId: 51, number: 20, name: "Louicius Deedson",     position: "LW", club: "FC Dallas",            age: 22, caps: 5,  goals: 1 },
  { id: 5122, teamId: 51, number: 18, name: "Ruben Providence",     position: "ST", club: "Almere City",          age: 25, caps: 8,  goals: 2 },
  { id: 5123, teamId: 51, number: 21, name: "Josué Casimir",        position: "LW", club: "Auxerre",              age: 23, caps: 6,  goals: 1,  startX: 22, startY: 30 },
  { id: 5124, teamId: 51, number: 24, name: "Yassin Fortuné",       position: "RW", club: "Vizela",               age: 23, caps: 3,  goals: 0 },
  { id: 5125, teamId: 51, number: 25, name: "Wilson Isidor",        position: "ST", club: "Sunderland",           age: 25, caps: 4,  goals: 1 },
  { id: 5126, teamId: 51, number: 26, name: "Lenny Joseph",         position: "CM", club: "Ferencváros",          age: 24, caps: 5,  goals: 0 },
];

import { EXTRA_SQUADS } from "./wc26-squads-extra";

// Wave-1 squads defined inline above. Wave-2 squads (Switzerland, Scotland,
// Croatia, Belgium, Japan, Sweden, Tunisia, Curaçao, Côte d'Ivoire, NZ,
// Austria, Portugal, DR Congo, Mexico, and the updated official France) live
// in `wc26-squads-extra.ts` and override the wave-1 entries when both exist.
const SQUADS_BY_TEAM: Record<number, Player[]> = {
  3: SOUTH_KOREA,
  4: ARGENTINA,
  13: BRAZIL,
  14: FRANCE, // overridden by EXTRA_SQUADS[14] below
  21: NORWAY,
  22: SPAIN,
  30: ENGLAND,
  50: BOSNIA,
  51: HAITI,
  ...EXTRA_SQUADS,
};

export function getSquad(teamId: number): Player[] {
  return SQUADS_BY_TEAM[teamId] ?? [];
}

export function getStartingXI(teamId: number): Player[] {
  return getSquad(teamId)
    .filter((p) => p.startX !== undefined && p.startY !== undefined)
    .slice(0, 11);
}

export function getBench(teamId: number): Player[] {
  const xiIds = new Set(getStartingXI(teamId).map((p) => p.id));
  return getSquad(teamId).filter((p) => !xiIds.has(p.id));
}

/** All players across all squads — useful for the Players DB. */
export function getAllPlayers(): Player[] {
  return Object.values(SQUADS_BY_TEAM).flat();
}
