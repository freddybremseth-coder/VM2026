/**
 * Wave-2 squad data — official 26-man rosters announced May 2026.
 * Kept in a separate file from `wc26-squads.ts` to avoid that file growing
 * unwieldy. Player IDs follow the `teamId * 100 + n` convention.
 *
 * Stats (age, caps, goals) are intentionally omitted here — they aren't always
 * published with the squad announcement, and the Player type now allows them
 * to be undefined.
 */

import type { Player } from "./wc26-squads";

// ─────────────────────────────────────────────────────────────────────────────
// Switzerland · Group B · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const SWITZERLAND: Player[] = [
  { id: 1001, teamId: 10, number: 1,  name: "Gregor Kobel",       position: "GK", club: "Borussia Dortmund",     caps: 20, goals: 0,  startX: 50, startY: 92 },
  { id: 1002, teamId: 10, number: 12, name: "Yvon Mvogo",         position: "GK", club: "Lorient",               caps: 12, goals: 0 },
  { id: 1003, teamId: 10, number: 21, name: "Marvin Keller",      position: "GK", club: "Young Boys",            caps: 0,  goals: 0 },
  { id: 1004, teamId: 10, number: 2,  name: "Manuel Akanji",      position: "CB", club: "Inter Milan",           caps: 79, goals: 4,  startX: 38, startY: 80 },
  { id: 1005, teamId: 10, number: 3,  name: "Silvan Widmer",      position: "RB", club: "Mainz",                 caps: 58, goals: 5,  startX: 82, startY: 75 },
  { id: 1006, teamId: 10, number: 4,  name: "Nico Elvedi",        position: "CB", club: "Mönchengladbach",       caps: 65, goals: 3,  startX: 62, startY: 80 },
  { id: 1007, teamId: 10, number: 5,  name: "Aurèle Amenda",      position: "CB", club: "Eintracht Frankfurt",   caps: 6,  goals: 0 },
  { id: 1008, teamId: 10, number: 13, name: "Ricardo Rodriguez",  position: "LB", club: "Real Betis",            caps: 136,goals: 9,  startX: 18, startY: 75 },
  { id: 1009, teamId: 10, number: 14, name: "Luca Jaquez",        position: "CB", club: "VfB Stuttgart",         caps: 2,  goals: 0 },
  { id: 1010, teamId: 10, number: 15, name: "Miro Muheim",        position: "LB", club: "Hamburg",               caps: 8,  goals: 0 },
  { id: 1011, teamId: 10, number: 22, name: "Eray Cömert",        position: "CB", club: "Valencia",              caps: 20, goals: 0 },
  { id: 1012, teamId: 10, number: 6,  name: "Denis Zakaria",      position: "DM", club: "Monaco",                caps: 63, goals: 3,  startX: 50, startY: 62 },
  { id: 1013, teamId: 10, number: 8,  name: "Remo Freuler",       position: "CM", club: "Bologna",               caps: 86, goals: 11, startX: 35, startY: 55 },
  { id: 1014, teamId: 10, number: 10, name: "Granit Xhaka",       position: "CM", club: "Sunderland",            caps: 144,goals: 16, startX: 65, startY: 55, isCaptain: true },
  { id: 1015, teamId: 10, number: 11, name: "Christian Fassnacht",position: "AM", club: "Young Boys",            caps: 21, goals: 4 },
  { id: 1016, teamId: 10, number: 16, name: "Djibril Sow",        position: "CM", club: "Sevilla",               caps: 50, goals: 0 },
  { id: 1017, teamId: 10, number: 17, name: "Ruben Vargas",       position: "LW", club: "Sevilla",               caps: 60, goals: 11, startX: 22, startY: 30 },
  { id: 1018, teamId: 10, number: 18, name: "Michel Aebischer",   position: "CM", club: "Pisa",                  caps: 38, goals: 2 },
  { id: 1019, teamId: 10, number: 19, name: "Johan Manzambi",     position: "AM", club: "Freiburg",              caps: 10, goals: 3 },
  { id: 1020, teamId: 10, number: 20, name: "Fabian Rieder",      position: "AM", club: "Augsburg",              caps: 27, goals: 1 },
  { id: 1021, teamId: 10, number: 23, name: "Ardon Jashari",      position: "CM", club: "AC Milan",              caps: 6,  goals: 0 },
  { id: 1022, teamId: 10, number: 24, name: "Cedric Itten",       position: "ST", club: "Fortuna Düsseldorf",    caps: 13, goals: 5 },
  { id: 1023, teamId: 10, number: 7,  name: "Breel Embolo",       position: "ST", club: "Rennes",                caps: 85, goals: 23, startX: 50, startY: 18 },
  { id: 1024, teamId: 10, number: 9,  name: "Zeki Amdouni",       position: "ST", club: "Burnley",               caps: 27, goals: 11 },
  { id: 1025, teamId: 10, number: 25, name: "Dan Ndoye",          position: "RW", club: "Nottingham Forest",     caps: 29, goals: 6,  startX: 78, startY: 30 },
  { id: 1026, teamId: 10, number: 26, name: "Noah Okafor",        position: "LW", club: "Leeds",                 caps: 24, goals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scotland · Group C · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const SCOTLAND: Player[] = [
  { id: 5201, teamId: 52, number: 1,  name: "Angus Gunn",          position: "GK", club: "Nottingham Forest",     caps: 21, goals: 0,  startX: 50, startY: 92 },
  { id: 5202, teamId: 52, number: 12, name: "Liam Kelly",          position: "GK", club: "Rangers",               caps: 2,  goals: 0 },
  { id: 5203, teamId: 52, number: 23, name: "Craig Gordon",        position: "GK", club: "Hearts",                caps: 83, goals: 0 },
  { id: 5204, teamId: 52, number: 2,  name: "Anthony Ralston",     position: "RB", club: "Celtic",                caps: 25, goals: 1,  startX: 82, startY: 75 },
  { id: 5205, teamId: 52, number: 3,  name: "Andy Robertson",      position: "LB", club: "Liverpool",             caps: 92, goals: 4,  startX: 18, startY: 75, isCaptain: true },
  { id: 5206, teamId: 52, number: 4,  name: "Scott McKenna",       position: "CB", club: "Dinamo Zagreb",         caps: 49, goals: 1,  startX: 38, startY: 80 },
  { id: 5207, teamId: 52, number: 5,  name: "Grant Hanley",        position: "CB", club: "Hibernian",             caps: 66, goals: 2 },
  { id: 5208, teamId: 52, number: 6,  name: "John Souttar",        position: "CB", club: "Rangers",               caps: 22, goals: 2,  startX: 62, startY: 80 },
  { id: 5209, teamId: 52, number: 16, name: "Kieran Tierney",      position: "LB", club: "Celtic",                caps: 55, goals: 2 },
  { id: 5210, teamId: 52, number: 18, name: "Aaron Hickey",        position: "RB", club: "Brentford",             caps: 19, goals: 0 },
  { id: 5211, teamId: 52, number: 13, name: "Jack Hendry",         position: "CB", club: "Al-Ettifaq",            caps: 37, goals: 3 },
  { id: 5212, teamId: 52, number: 14, name: "Nathan Patterson",    position: "RB", club: "Everton",               caps: 25, goals: 1 },
  { id: 5213, teamId: 52, number: 19, name: "Dom Hyam",            position: "CB", club: "Wrexham",               caps: 2,  goals: 0 },
  { id: 5214, teamId: 52, number: 7,  name: "John McGinn",         position: "CM", club: "Aston Villa",           caps: 85, goals: 20, startX: 32, startY: 55 },
  { id: 5215, teamId: 52, number: 8,  name: "Billy Gilmour",       position: "DM", club: "Napoli",                caps: 45, goals: 2,  startX: 50, startY: 60 },
  { id: 5216, teamId: 52, number: 10, name: "Scott McTominay",     position: "AM", club: "Napoli",                caps: 69, goals: 14, startX: 68, startY: 50 },
  { id: 5217, teamId: 52, number: 11, name: "Ryan Christie",       position: "AM", club: "Bournemouth",           caps: 66, goals: 9 },
  { id: 5218, teamId: 52, number: 15, name: "Lewis Ferguson",      position: "CM", club: "Bologna",               caps: 23, goals: 1 },
  { id: 5219, teamId: 52, number: 17, name: "Kenny McLean",        position: "CM", club: "Norwich",               caps: 56, goals: 3 },
  { id: 5220, teamId: 52, number: 20, name: "Ben Gannon-Doak",     position: "RW", club: "Bournemouth",           caps: 12, goals: 1,  startX: 78, startY: 30 },
  { id: 5221, teamId: 52, number: 21, name: "Findlay Curtis",      position: "CM", club: "Kilmarnock",            caps: 1,  goals: 0 },
  { id: 5222, teamId: 52, number: 9,  name: "Lyndon Dykes",        position: "ST", club: "Charlton Athletic",     caps: 50, goals: 10 },
  { id: 5223, teamId: 52, number: 22, name: "Che Adams",           position: "ST", club: "Torino",                caps: 46, goals: 11, startX: 50, startY: 18 },
  { id: 5224, teamId: 52, number: 24, name: "Lawrence Shankland",  position: "ST", club: "Hearts",                caps: 18, goals: 4 },
  { id: 5225, teamId: 52, number: 25, name: "George Hirst",        position: "ST", club: "Ipswich",               caps: 8,  goals: 1 },
  { id: 5226, teamId: 52, number: 26, name: "Ross Stewart",        position: "ST", club: "Southampton",           caps: 2,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Croatia · Group L · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const CROATIA: Player[] = [
  { id: 4201, teamId: 42, number: 1,  name: "Dominik Livaković",   position: "GK", club: "Dinamo Zagreb",         caps: 73, goals: 0,  startX: 50, startY: 92 },
  { id: 4202, teamId: 42, number: 12, name: "Dominik Kotarski",    position: "GK", club: "FC Copenhagen",         caps: 3,  goals: 0 },
  { id: 4203, teamId: 42, number: 23, name: "Ivor Pandur",         position: "GK", club: "Hull City",             caps: 0,  goals: 0 },
  { id: 4204, teamId: 42, number: 2,  name: "Josip Stanišić",      position: "RB", club: "Bayern Munich",         caps: 29, goals: 0,  startX: 82, startY: 75 },
  { id: 4205, teamId: 42, number: 5,  name: "Duje Ćaleta-Car",     position: "CB", club: "Real Sociedad",         caps: 38, goals: 1,  startX: 38, startY: 80 },
  { id: 4206, teamId: 42, number: 6,  name: "Joško Gvardiol",      position: "CB", club: "Manchester City",       caps: 46, goals: 4,  startX: 18, startY: 75 },
  { id: 4207, teamId: 42, number: 21, name: "Josip Šutalo",        position: "CB", club: "Ajax",                  caps: 31, goals: 0,  startX: 62, startY: 80 },
  { id: 4208, teamId: 42, number: 13, name: "Marin Pongračić",     position: "CB", club: "Fiorentina",            caps: 18, goals: 0 },
  { id: 4209, teamId: 42, number: 14, name: "Martin Erlić",        position: "CB", club: "Midtjylland",           caps: 12, goals: 1 },
  { id: 4210, teamId: 42, number: 22, name: "Luka Vušković",       position: "CB", club: "Hamburg",               caps: 4,  goals: 1 },
  { id: 4211, teamId: 42, number: 10, name: "Luka Modrić",         position: "CM", club: "AC Milan",              caps: 196,goals: 28, startX: 50, startY: 55, isCaptain: true },
  { id: 4212, teamId: 42, number: 8,  name: "Mateo Kovačić",       position: "DM", club: "Manchester City",       caps: 111,goals: 5,  startX: 50, startY: 62 },
  { id: 4213, teamId: 42, number: 7,  name: "Luka Sučić",          position: "AM", club: "Real Sociedad",         caps: 19, goals: 1,  startX: 65, startY: 50 },
  { id: 4214, teamId: 42, number: 15, name: "Mario Pašalić",       position: "CM", club: "Atalanta",              caps: 83, goals: 11 },
  { id: 4215, teamId: 42, number: 16, name: "Martin Baturina",     position: "AM", club: "Como",                  caps: 17, goals: 1,  startX: 35, startY: 50 },
  { id: 4216, teamId: 42, number: 17, name: "Petar Sučić",         position: "CM", club: "Inter Milan",           caps: 15, goals: 1 },
  { id: 4217, teamId: 42, number: 18, name: "Kristijan Jakić",     position: "DM", club: "Augsburg",              caps: 16, goals: 2 },
  { id: 4218, teamId: 42, number: 19, name: "Nikola Vlašić",       position: "AM", club: "Torino",                caps: 61, goals: 10 },
  { id: 4219, teamId: 42, number: 24, name: "Nikola Moro",         position: "CM", club: "Bologna",               caps: 9,  goals: 0 },
  { id: 4220, teamId: 42, number: 25, name: "Toni Fruk",           position: "AM", club: "Rijeka",                caps: 7,  goals: 1 },
  { id: 4221, teamId: 42, number: 4,  name: "Ivan Perišić",        position: "LW", club: "PSV Eindhoven",         caps: 152,goals: 38, startX: 22, startY: 30 },
  { id: 4222, teamId: 42, number: 9,  name: "Andrej Kramarić",     position: "ST", club: "Hoffenheim",            caps: 114,goals: 36, startX: 50, startY: 18 },
  { id: 4223, teamId: 42, number: 11, name: "Ante Budimir",        position: "ST", club: "Osasuna",               caps: 36, goals: 6 },
  { id: 4224, teamId: 42, number: 20, name: "Marco Pašalić",       position: "RW", club: "Orlando City",          caps: 13, goals: 1,  startX: 78, startY: 30 },
  { id: 4225, teamId: 42, number: 26, name: "Petar Musa",          position: "ST", club: "FC Dallas",             caps: 10, goals: 1 },
  { id: 4226, teamId: 42, number: 27, name: "Igor Matanović",      position: "ST", club: "Freiburg",              caps: 8,  goals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Belgium · Group G · OFFICIAL · stats from oddsnet.com 2026-05
// ─────────────────────────────────────────────────────────────────────────────
const BELGIUM: Player[] = [
  { id: 3801, teamId: 38, number: 1,  name: "Thibaut Courtois",       position: "GK", club: "Real Madrid",             caps: 107,goals: 0,  startX: 50, startY: 92 },
  { id: 3802, teamId: 38, number: 12, name: "Senne Lammens",          position: "GK", club: "Manchester United",       caps: 2,  goals: 0 },
  { id: 3803, teamId: 38, number: 13, name: "Mike Penders",           position: "GK", club: "Strasbourg",              caps: 0,  goals: 0 },
  { id: 3804, teamId: 38, number: 2,  name: "Timothy Castagne",       position: "RB", club: "Fulham",                  caps: 62, goals: 2,  startX: 82, startY: 75 },
  { id: 3805, teamId: 38, number: 3,  name: "Arthur Theate",          position: "CB", club: "Eintracht Frankfurt",     caps: 32, goals: 1,  startX: 38, startY: 80 },
  { id: 3806, teamId: 38, number: 4,  name: "Zeno Debast",            position: "CB", club: "Sporting CP",             caps: 26, goals: 1,  startX: 50, startY: 78 },
  { id: 3807, teamId: 38, number: 5,  name: "Brandon Mechele",        position: "CB", club: "Club Brugge",             caps: 7,  goals: 1,  startX: 62, startY: 80 },
  { id: 3808, teamId: 38, number: 14, name: "Koni De Winter",         position: "CB", club: "AC Milan",                caps: 7,  goals: 0 },
  { id: 3809, teamId: 38, number: 15, name: "Maxim De Cuyper",        position: "LB", club: "Brighton",                caps: 17, goals: 4,  startX: 18, startY: 75 },
  { id: 3810, teamId: 38, number: 16, name: "Thomas Meunier",         position: "RB", club: "Lille",                   caps: 78, goals: 10 },
  { id: 3811, teamId: 38, number: 22, name: "Joaquin Seys",           position: "RB", club: "Club Brugge",             caps: 4,  goals: 0 },
  { id: 3812, teamId: 38, number: 23, name: "Nathan Ngoy",            position: "CB", club: "Lille",                   caps: 2,  goals: 0 },
  { id: 3813, teamId: 38, number: 6,  name: "Axel Witsel",            position: "DM", club: "Girona",                  caps: 136,goals: 12, startX: 50, startY: 62 },
  { id: 3814, teamId: 38, number: 7,  name: "Kevin De Bruyne",        position: "AM", club: "Napoli",                  caps: 117,goals: 36, startX: 50, startY: 45, isCaptain: true },
  { id: 3815, teamId: 38, number: 8,  name: "Youri Tielemans",        position: "CM", club: "Aston Villa",             caps: 83, goals: 12, startX: 65, startY: 55 },
  { id: 3816, teamId: 38, number: 17, name: "Hans Vanaken",           position: "CM", club: "Club Brugge",             caps: 32, goals: 7 },
  { id: 3817, teamId: 38, number: 18, name: "Amadou Onana",           position: "DM", club: "Aston Villa",             caps: 27, goals: 1,  startX: 35, startY: 55 },
  { id: 3818, teamId: 38, number: 19, name: "Nicolas Raskin",         position: "CM", club: "Rangers",                 caps: 11, goals: 1 },
  { id: 3819, teamId: 38, number: 9,  name: "Romelu Lukaku",          position: "ST", club: "Napoli",                  caps: 124,goals: 89, startX: 50, startY: 18 },
  { id: 3820, teamId: 38, number: 10, name: "Jérémy Doku",            position: "RW", club: "Manchester City",         caps: 41, goals: 7,  startX: 78, startY: 30 },
  { id: 3821, teamId: 38, number: 11, name: "Leandro Trossard",       position: "LW", club: "Arsenal",                 caps: 50, goals: 11, startX: 22, startY: 30 },
  { id: 3822, teamId: 38, number: 20, name: "Charles De Ketelaere",   position: "AM", club: "Atalanta",                caps: 28, goals: 5 },
  { id: 3823, teamId: 38, number: 21, name: "Dodi Lukebakio",         position: "LW", club: "Benfica",                 caps: 29, goals: 5 },
  { id: 3824, teamId: 38, number: 24, name: "Alexis Saelemaekers",    position: "RW", club: "AC Milan",                caps: 23, goals: 2 },
  { id: 3825, teamId: 38, number: 25, name: "Diego Moreira",          position: "LW", club: "Strasbourg",              caps: 2,  goals: 0 },
  { id: 3826, teamId: 38, number: 26, name: "Matias Fernandez-Pardo", position: "LW", club: "Lille",                   caps: 0,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Japan · Group F · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const JAPAN: Player[] = [
  { id: 701,  teamId: 7,  number: 1,  name: "Tomoki Hayakawa",     position: "GK", club: "Kashima Antlers",        caps: 3,  goals: 0,  startX: 50, startY: 92 },
  { id: 702,  teamId: 7,  number: 12, name: "Keisuke Ōsako",       position: "GK", club: "Sanfrecce Hiroshima",    caps: 11, goals: 0 },
  { id: 703,  teamId: 7,  number: 23, name: "Zion Suzuki",         position: "GK", club: "Parma",                  caps: 23, goals: 0 },
  { id: 704,  teamId: 7,  number: 2,  name: "Kō Itakura",          position: "CB", club: "Ajax",                   caps: 39, goals: 2,  startX: 38, startY: 80 },
  { id: 705,  teamId: 7,  number: 3,  name: "Tsuyoshi Watanabe",   position: "CB", club: "Feyenoord",              caps: 10, goals: 0,  startX: 50, startY: 78 },
  { id: 706,  teamId: 7,  number: 4,  name: "Takehiro Tomiyasu",   position: "RB", club: "Ajax",                   caps: 42, goals: 1,  startX: 82, startY: 75 },
  { id: 707,  teamId: 7,  number: 5,  name: "Hiroki Itō",          position: "LB", club: "Bayern Munich",          caps: 23, goals: 1,  startX: 18, startY: 75 },
  { id: 708,  teamId: 7,  number: 13, name: "Shōgo Taniguchi",     position: "CB", club: "Sint-Truiden",           caps: 37, goals: 1 },
  { id: 709,  teamId: 7,  number: 15, name: "Yukinari Sugawara",   position: "RB", club: "Werder Bremen",          caps: 20, goals: 2 },
  { id: 710,  teamId: 7,  number: 16, name: "Ayumu Seko",          position: "CB", club: "Le Havre",               caps: 13, goals: 0 },
  { id: 711,  teamId: 7,  number: 18, name: "Yūto Nagatomo",       position: "LB", club: "FC Tokyo",               caps: 144,goals: 4 },
  { id: 712,  teamId: 7,  number: 21, name: "Junnosuke Suzuki",    position: "CB", club: "FC Copenhagen",          caps: 6,  goals: 0 },
  { id: 713,  teamId: 7,  number: 6,  name: "Wataru Endo",         position: "DM", club: "Liverpool",              caps: 72, goals: 4,  startX: 50, startY: 60, isCaptain: true },
  { id: 714,  teamId: 7,  number: 7,  name: "Junya Itō",           position: "RW", club: "Genk",                   caps: 68, goals: 15, startX: 78, startY: 32 },
  { id: 715,  teamId: 7,  number: 8,  name: "Daichi Kamada",       position: "AM", club: "Crystal Palace",         caps: 49, goals: 12, startX: 35, startY: 50 },
  { id: 716,  teamId: 7,  number: 10, name: "Ritsu Dōan",          position: "AM", club: "Eintracht Frankfurt",    caps: 64, goals: 11, startX: 65, startY: 50 },
  { id: 717,  teamId: 7,  number: 14, name: "Ao Tanaka",           position: "CM", club: "Leeds United",           caps: 37, goals: 8 },
  { id: 718,  teamId: 7,  number: 17, name: "Kaishū Sano",         position: "CM", club: "Mainz 05",               caps: 12, goals: 0 },
  { id: 719,  teamId: 7,  number: 19, name: "Takefusa Kubo",       position: "RW", club: "Real Sociedad",          caps: 48, goals: 7 },
  { id: 720,  teamId: 7,  number: 24, name: "Kōki Ogawa",          position: "ST", club: "NEC Nijmegen",           caps: 14, goals: 10 },
  { id: 721,  teamId: 7,  number: 25, name: "Daizen Maeda",        position: "LW", club: "Celtic",                 caps: 27, goals: 4,  startX: 22, startY: 32 },
  { id: 722,  teamId: 7,  number: 9,  name: "Ayase Ueda",          position: "ST", club: "Feyenoord",              caps: 38, goals: 16, startX: 50, startY: 18 },
  { id: 723,  teamId: 7,  number: 11, name: "Keito Nakamura",      position: "LW", club: "Stade de Reims",         caps: 24, goals: 10 },
  { id: 724,  teamId: 7,  number: 22, name: "Yuito Suzuki",        position: "ST", club: "SC Freiburg",            caps: 6,  goals: 0 },
  { id: 725,  teamId: 7,  number: 26, name: "Keisuke Gotō",        position: "ST", club: "Sint-Truiden",           caps: 3,  goals: 0 },
  { id: 726,  teamId: 7,  number: 27, name: "Kento Shiogai",       position: "ST", club: "VfL Wolfsburg",          caps: 1,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sweden · Group F · OFFICIAL · stats from oddsnet.com 2026-05
// ─────────────────────────────────────────────────────────────────────────────
const SWEDEN: Player[] = [
  { id: 5401, teamId: 54, number: 1,  name: "Viktor Johansson",         position: "GK", club: "Stoke City",            caps: 12, goals: 0,  startX: 50, startY: 92 },
  { id: 5402, teamId: 54, number: 12, name: "Kristoffer Nordfeldt",     position: "GK", club: "AIK",                   caps: 20, goals: 0 },
  { id: 5403, teamId: 54, number: 23, name: "Jacob Widell Zetterström", position: "GK", club: "Derby County",          caps: 2,  goals: 0 },
  { id: 5404, teamId: 54, number: 2,  name: "Gabriel Gudmundsson",      position: "LB", club: "Leeds United",          caps: 23, goals: 0,  startX: 18, startY: 75 },
  { id: 5405, teamId: 54, number: 3,  name: "Victor Lindelöf",          position: "CB", club: "Aston Villa",           caps: 75, goals: 3,  startX: 38, startY: 80, isCaptain: true },
  { id: 5406, teamId: 54, number: 4,  name: "Isak Hien",                position: "CB", club: "Atalanta",              caps: 27, goals: 0,  startX: 62, startY: 80 },
  { id: 5407, teamId: 54, number: 5,  name: "Hjalmar Ekdal",            position: "CB", club: "Burnley",               caps: 11, goals: 0 },
  { id: 5408, teamId: 54, number: 13, name: "Emil Holm",                position: "RB", club: "Juventus",              caps: 16, goals: 2,  startX: 82, startY: 75 },
  { id: 5409, teamId: 54, number: 14, name: "Gustaf Lagerbielke",       position: "CB", club: "Braga",                 caps: 9,  goals: 2 },
  { id: 5410, teamId: 54, number: 15, name: "Carl Starfelt",            position: "CB", club: "Celta Vigo",            caps: 17, goals: 0 },
  { id: 5411, teamId: 54, number: 16, name: "Daniel Svensson",          position: "LB", club: "Borussia Dortmund",     caps: 11, goals: 0 },
  { id: 5412, teamId: 54, number: 22, name: "Erik Smith",               position: "CB", club: "St. Pauli",             caps: 0,  goals: 0 },
  { id: 5413, teamId: 54, number: 24, name: "Elliot Stroud",            position: "CB", club: "Mjällby",               caps: 0,  goals: 0 },
  { id: 5414, teamId: 54, number: 6,  name: "Mattias Svanberg",         position: "CM", club: "Wolfsburg",             caps: 39, goals: 2,  startX: 50, startY: 60 },
  { id: 5415, teamId: 54, number: 7,  name: "Yasin Ayari",              position: "CM", club: "Brighton",              caps: 19, goals: 3,  startX: 35, startY: 55 },
  { id: 5416, teamId: 54, number: 8,  name: "Lucas Bergvall",           position: "AM", club: "Tottenham",             caps: 8,  goals: 0,  startX: 65, startY: 50 },
  { id: 5417, teamId: 54, number: 17, name: "Ken Sema",                 position: "LW", club: "Pafos",                 caps: 32, goals: 5 },
  { id: 5418, teamId: 54, number: 18, name: "Jesper Karlström",         position: "DM", club: "Udinese",               caps: 23, goals: 0 },
  { id: 5419, teamId: 54, number: 19, name: "Taha Ali",                 position: "AM", club: "Malmö",                 caps: 1,  goals: 0 },
  { id: 5420, teamId: 54, number: 20, name: "Besfort Zeneli",           position: "CM", club: "Union St-Gilloise",     caps: 6,  goals: 0 },
  { id: 5421, teamId: 54, number: 9,  name: "Alexander Isak",           position: "ST", club: "Liverpool",             caps: 56, goals: 16, startX: 50, startY: 18 },
  { id: 5422, teamId: 54, number: 10, name: "Viktor Gyökeres",          position: "ST", club: "Arsenal",               caps: 32, goals: 19 },
  { id: 5423, teamId: 54, number: 11, name: "Anthony Elanga",           position: "RW", club: "Newcastle",             caps: 28, goals: 6,  startX: 78, startY: 30 },
  { id: 5424, teamId: 54, number: 21, name: "Benjamin Nygren",          position: "AM", club: "Celtic",                caps: 9,  goals: 3,  startX: 22, startY: 32 },
  { id: 5425, teamId: 54, number: 25, name: "Alexander Bernhardsson",   position: "LW", club: "Holstein Kiel",         caps: 9,  goals: 0 },
  { id: 5426, teamId: 54, number: 26, name: "Gustaf Nilsson",           position: "ST", club: "Club Brugge",           caps: 8,  goals: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tunisia · Group F · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const TUNISIA: Player[] = [
  { id: 2401, teamId: 24, number: 1,  name: "Aymen Dahmen",           position: "GK", club: "CS Sfaxien",           caps: 37, goals: 0,  startX: 50, startY: 92 },
  { id: 2402, teamId: 24, number: 12, name: "Sabri Ben Hassen",       position: "GK", club: "Étoile Sahel",         caps: 2,  goals: 0 },
  { id: 2403, teamId: 24, number: 23, name: "Mouhib Chamakh",         position: "GK", club: "Club Africain",        caps: 1,  goals: 0 },
  { id: 2404, teamId: 24, number: 2,  name: "Yan Valery",             position: "RB", club: "Young Boys",           caps: 21, goals: 0,  startX: 82, startY: 75 },
  { id: 2405, teamId: 24, number: 3,  name: "Ali Abdi",               position: "LB", club: "Nice",                 caps: 45, goals: 7,  startX: 18, startY: 75 },
  { id: 2406, teamId: 24, number: 4,  name: "Dylan Bronn",            position: "CB", club: "Servette",             caps: 52, goals: 2,  startX: 38, startY: 80 },
  { id: 2407, teamId: 24, number: 5,  name: "Montassar Talbi",        position: "CB", club: "Lorient",              caps: 62, goals: 4,  startX: 62, startY: 80 },
  { id: 2408, teamId: 24, number: 13, name: "Omar Rekik",             position: "CB", club: "NK Maribor",           caps: 4,  goals: 0 },
  { id: 2409, teamId: 24, number: 14, name: "Adem Arous",             position: "RB", club: "Kasımpaşa",            caps: 1,  goals: 0 },
  { id: 2410, teamId: 24, number: 15, name: "Mohamed Amine Ben Hamida", position: "CB", club: "Espérance",          caps: 12, goals: 0 },
  { id: 2411, teamId: 24, number: 22, name: "Raed Chikhaoui",         position: "CB", club: "US Monastir",          caps: 0,  goals: 0 },
  { id: 2412, teamId: 24, number: 24, name: "Moutaz Neffati",         position: "LB", club: "IFK Norrköping",       caps: 5,  goals: 0 },
  { id: 2413, teamId: 24, number: 6,  name: "Ellyes Skhiri",          position: "DM", club: "Eintracht Frankfurt",  caps: 81, goals: 4,  startX: 50, startY: 60, isCaptain: true },
  { id: 2414, teamId: 24, number: 8,  name: "Hannibal Mejbri",        position: "AM", club: "Burnley",              caps: 44, goals: 1,  startX: 65, startY: 50 },
  { id: 2415, teamId: 24, number: 10, name: "Anis Ben Slimane",       position: "AM", club: "Norwich City",         caps: 39, goals: 4,  startX: 35, startY: 50 },
  { id: 2416, teamId: 24, number: 16, name: "Rani Khedira",           position: "DM", club: "Union Berlin",         caps: 2,  goals: 0 },
  { id: 2417, teamId: 24, number: 17, name: "Mortadha Ben Ouanes",    position: "CM", club: "Kasımpaşa",            caps: 17, goals: 0 },
  { id: 2418, teamId: 24, number: 18, name: "Ismaël Gharbi",          position: "AM", club: "FC Augsburg",          caps: 15, goals: 2 },
  { id: 2419, teamId: 24, number: 19, name: "Hadj Mahmoud",           position: "CM", club: "Lugano",               caps: 7,  goals: 0 },
  { id: 2420, teamId: 24, number: 7,  name: "Elias Achouri",          position: "LW", club: "FC Copenhagen",        caps: 29, goals: 4,  startX: 22, startY: 32 },
  { id: 2421, teamId: 24, number: 9,  name: "Sebastian Tounekti",     position: "RW", club: "Celtic",               caps: 10, goals: 1,  startX: 78, startY: 32 },
  { id: 2422, teamId: 24, number: 11, name: "Khalil Ayari",           position: "AM", club: "Paris Saint-Germain",  caps: 2,  goals: 0 },
  { id: 2423, teamId: 24, number: 20, name: "Elias Saad",             position: "LW", club: "Hannover 96",          caps: 14, goals: 4 },
  { id: 2424, teamId: 24, number: 21, name: "Firas Chaouat",          position: "ST", club: "Club Africain",        caps: 28, goals: 6,  startX: 50, startY: 18 },
  { id: 2425, teamId: 24, number: 25, name: "Rayan Elloumi",          position: "ST", club: "Vancouver Whitecaps",  caps: 2,  goals: 0 },
  { id: 2426, teamId: 24, number: 26, name: "Hazem Mastouri",         position: "ST", club: "Dynamo Makhachkala",   caps: 18, goals: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Curaçao · Group E · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const CURACAO: Player[] = [
  { id: 5301, teamId: 53, number: 1,  name: "Eloy Room",              position: "GK", club: "Miami FC",              caps: 70, goals: 0,  startX: 50, startY: 92 },
  { id: 5302, teamId: 53, number: 12, name: "Trevor Doornbusch",      position: "GK", club: "VVV-Venlo",             caps: 7,  goals: 0 },
  { id: 5303, teamId: 53, number: 23, name: "Tyrick Bodak",           position: "GK", club: "SC Telstar",            caps: 4,  goals: 0 },
  { id: 5304, teamId: 53, number: 2,  name: "Sherel Floranus",        position: "RB", club: "PEC Zwolle",            caps: 26, goals: 0,  startX: 82, startY: 75 },
  { id: 5305, teamId: 53, number: 3,  name: "Riechedly Bazoer",       position: "CB", club: "Konyaspor",             caps: 3,  goals: 0,  startX: 38, startY: 80 },
  { id: 5306, teamId: 53, number: 4,  name: "Armando Obispo",         position: "CB", club: "PSV Eindhoven",         caps: 4,  goals: 0,  startX: 62, startY: 80 },
  { id: 5307, teamId: 53, number: 5,  name: "Joshua Brenet",          position: "LB", club: "Kayserispor",           caps: 17, goals: 1,  startX: 18, startY: 75 },
  { id: 5308, teamId: 53, number: 6,  name: "Roshon van Eijma",       position: "CB", club: "RKC Waalwijk",          caps: 27, goals: 1 },
  { id: 5309, teamId: 53, number: 13, name: "Deveron Fonville",       position: "RB", club: "NEC Nijmegen",          caps: 0,  goals: 0 },
  { id: 5310, teamId: 53, number: 14, name: "Juriën Gaari",           position: "CB", club: "Abha Club",             caps: 58, goals: 1 },
  { id: 5311, teamId: 53, number: 22, name: "Shurandy Sambo",         position: "RB", club: "Sparta Rotterdam",      caps: 7,  goals: 0 },
  { id: 5312, teamId: 53, number: 8,  name: "Juninho Bacuna",         position: "CM", club: "FC Volendam",           caps: 47, goals: 14, startX: 50, startY: 60, isCaptain: true },
  { id: 5313, teamId: 53, number: 10, name: "Leandro Bacuna",         position: "CM", club: "Iğdır FK",              caps: 70, goals: 16 },
  { id: 5314, teamId: 53, number: 15, name: "Livano Comenencia",      position: "AM", club: "FC Zürich",             caps: 18, goals: 1,  startX: 65, startY: 50 },
  { id: 5315, teamId: 53, number: 16, name: "Kevin Felida",           position: "CM", club: "FC Den Bosch",          caps: 19, goals: 1 },
  { id: 5316, teamId: 53, number: 17, name: "Ar'Jany Martha",         position: "AM", club: "Rotherham United",      caps: 8,  goals: 2,  startX: 35, startY: 50 },
  { id: 5317, teamId: 53, number: 18, name: "Tyrese Noslin",          position: "AM", club: "SC Telstar",            caps: 5,  goals: 1 },
  { id: 5318, teamId: 53, number: 19, name: "Godfried Roemeratoe",    position: "CM", club: "RKC Waalwijk",          caps: 26, goals: 1 },
  { id: 5319, teamId: 53, number: 7,  name: "Tahith Chong",           position: "LW", club: "Sheffield United",      caps: 4,  goals: 2,  startX: 22, startY: 32 },
  { id: 5320, teamId: 53, number: 9,  name: "Jürgen Locadia",         position: "ST", club: "Miami FC",              caps: 12, goals: 1,  startX: 50, startY: 18 },
  { id: 5321, teamId: 53, number: 11, name: "Sontje Hansen",          position: "ST", club: "Middlesbrough",         caps: 5,  goals: 1 },
  { id: 5322, teamId: 53, number: 20, name: "Kenji Gorré",            position: "RW", club: "Maccabi Haifa",         caps: 37, goals: 6,  startX: 78, startY: 32 },
  { id: 5323, teamId: 53, number: 21, name: "Brandley Kuwas",         position: "RW", club: "FC Volendam",           caps: 34, goals: 2 },
  { id: 5324, teamId: 53, number: 24, name: "Gervane Kastaneer",      position: "LW", club: "Terengganu",            caps: 27, goals: 9 },
  { id: 5325, teamId: 53, number: 25, name: "Jeremy Antonisse",       position: "LW", club: "AE Kifisia",            caps: 25, goals: 3 },
  { id: 5326, teamId: 53, number: 26, name: "Jearl Margaritha",       position: "ST", club: "SK Beveren",            caps: 21, goals: 5 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Côte d'Ivoire · Group E · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const COTE_D_IVOIRE: Player[] = [
  { id: 3201, teamId: 32, number: 1,  name: "Yahia Fofana",           position: "GK", club: "Çaykur Rizespor",       caps: 34, goals: 0,  startX: 50, startY: 92 },
  { id: 3202, teamId: 32, number: 12, name: "Mohamed Koné",           position: "GK", club: "Charleroi",             caps: 0,  goals: 0 },
  { id: 3203, teamId: 32, number: 23, name: "Alban Lafont",           position: "GK", club: "Panathinaikos",         caps: 4,  goals: 0 },
  { id: 3204, teamId: 32, number: 2,  name: "Wilfried Singo",         position: "RB", club: "Galatasaray",           caps: 33, goals: 1,  startX: 82, startY: 75 },
  { id: 3205, teamId: 32, number: 3,  name: "Ghislain Konan",         position: "LB", club: "Gil Vicente",           caps: 53, goals: 0,  startX: 18, startY: 75 },
  { id: 3206, teamId: 32, number: 4,  name: "Evan Ndicka",            position: "CB", club: "Roma",                  caps: 28, goals: 0,  startX: 38, startY: 80 },
  { id: 3207, teamId: 32, number: 5,  name: "Odilon Kossounou",       position: "CB", club: "Atalanta",              caps: 35, goals: 0,  startX: 62, startY: 80 },
  { id: 3208, teamId: 32, number: 13, name: "Emmanuel Agbadou",       position: "CB", club: "Beşiktaş",              caps: 19, goals: 2 },
  { id: 3209, teamId: 32, number: 14, name: "Ousmane Diomande",       position: "CB", club: "Sporting CP",           caps: 14, goals: 1 },
  { id: 3210, teamId: 32, number: 15, name: "Guéla Doué",             position: "RB", club: "Strasbourg",            caps: 19, goals: 2 },
  { id: 3211, teamId: 32, number: 22, name: "Clément Akpa",           position: "CB", club: "AJ Auxerre",            caps: 5,  goals: 0 },
  { id: 3212, teamId: 32, number: 6,  name: "Seko Fofana",            position: "DM", club: "Porto",                 caps: 31, goals: 7,  startX: 50, startY: 60, isCaptain: true },
  { id: 3213, teamId: 32, number: 8,  name: "Franck Kessié",          position: "CM", club: "Al-Ahli",               caps: 102,goals: 15, startX: 35, startY: 55 },
  { id: 3214, teamId: 32, number: 10, name: "Ibrahim Sangaré",        position: "DM", club: "Nottingham Forest",     caps: 57, goals: 12, startX: 65, startY: 55 },
  { id: 3215, teamId: 32, number: 16, name: "Jean-Michaël Seri",      position: "CM", club: "Maribor",               caps: 65, goals: 4 },
  { id: 3216, teamId: 32, number: 17, name: "Christ Inao Oulaï",      position: "CM", club: "Trabzonspor",           caps: 8,  goals: 0 },
  { id: 3217, teamId: 32, number: 18, name: "Parfait Guiagon",        position: "AM", club: "Charleroi",             caps: 5,  goals: 0 },
  { id: 3218, teamId: 32, number: 7,  name: "Simon Adingra",          position: "LW", club: "Monaco",                caps: 28, goals: 5,  startX: 22, startY: 32 },
  { id: 3219, teamId: 32, number: 9,  name: "Evann Guessand",         position: "ST", club: "Crystal Palace",        caps: 21, goals: 4,  startX: 50, startY: 18 },
  { id: 3220, teamId: 32, number: 11, name: "Amad Diallo",            position: "RW", club: "Manchester United",     caps: 18, goals: 5,  startX: 78, startY: 32 },
  { id: 3221, teamId: 32, number: 19, name: "Ange-Yoan Bonny",        position: "ST", club: "Inter Milan",           caps: 0,  goals: 0 },
  { id: 3222, teamId: 32, number: 20, name: "Nicolas Pépé",           position: "RW", club: "Villarreal",            caps: 54, goals: 12 },
  { id: 3223, teamId: 32, number: 21, name: "Bazoumana Touré",        position: "LW", club: "Hoffenheim",            caps: 5,  goals: 2 },
  { id: 3224, teamId: 32, number: 24, name: "Oumar Diakité",          position: "ST", club: "Cercle Brugge",         caps: 28, goals: 6 },
  { id: 3225, teamId: 32, number: 25, name: "Yan Diomande",           position: "LW", club: "RB Leipzig",            caps: 9,  goals: 3 },
  { id: 3226, teamId: 32, number: 26, name: "Elye Wahi",              position: "ST", club: "Nice",                  caps: 1,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// New Zealand · Group G · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const NEW_ZEALAND: Player[] = [
  { id: 3901, teamId: 39, number: 1,  name: "Alex Paulsen",       position: "GK", club: "Lechia Gdańsk",         caps: 6,  goals: 0,  startX: 50, startY: 92 },
  { id: 3902, teamId: 39, number: 12, name: "Max Crocombe",       position: "GK", club: "Millwall",              caps: 22, goals: 0 },
  { id: 3903, teamId: 39, number: 23, name: "Michael Woud",       position: "GK", club: "Auckland FC",           caps: 6,  goals: 0 },
  { id: 3904, teamId: 39, number: 2,  name: "Tim Payne",          position: "RB", club: "Wellington Phoenix",    caps: 49, goals: 3,  startX: 82, startY: 75 },
  { id: 3905, teamId: 39, number: 3,  name: "Liberato Cacace",    position: "LB", club: "Wrexham",               caps: 35, goals: 1,  startX: 18, startY: 75 },
  { id: 3906, teamId: 39, number: 4,  name: "Tyler Bindon",       position: "CB", club: "Nottingham Forest",     caps: 23, goals: 3,  startX: 38, startY: 80 },
  { id: 3907, teamId: 39, number: 5,  name: "Michael Boxall",     position: "CB", club: "Minnesota United",      caps: 61, goals: 1,  startX: 62, startY: 80 },
  { id: 3908, teamId: 39, number: 13, name: "Francis de Vries",   position: "LB", club: "Auckland FC",           caps: 18, goals: 1 },
  { id: 3909, teamId: 39, number: 14, name: "Nando Pijnaker",     position: "CB", club: "Auckland FC",           caps: 23, goals: 0 },
  { id: 3910, teamId: 39, number: 15, name: "Finn Surman",        position: "CB", club: "Portland Timbers",      caps: 17, goals: 2 },
  { id: 3911, teamId: 39, number: 16, name: "Callan Elliot",      position: "RB", club: "Auckland FC",           caps: 9,  goals: 0 },
  { id: 3912, teamId: 39, number: 22, name: "Tommy Smith",        position: "CB", club: "Braintree Town",        caps: 56, goals: 2, isCaptain: true },
  { id: 3913, teamId: 39, number: 6,  name: "Joe Bell",           position: "CM", club: "Viking FK",             caps: 31, goals: 1,  startX: 50, startY: 60 },
  { id: 3914, teamId: 39, number: 8,  name: "Marko Stamenić",     position: "CM", club: "Swansea City",          caps: 37, goals: 3,  startX: 35, startY: 55 },
  { id: 3915, teamId: 39, number: 10, name: "Alex Rufer",         position: "DM", club: "Wellington Phoenix",    caps: 24, goals: 0 },
  { id: 3916, teamId: 39, number: 17, name: "Matthew Garbett",    position: "AM", club: "Peterborough United",   caps: 35, goals: 5,  startX: 65, startY: 50 },
  { id: 3917, teamId: 39, number: 18, name: "Sarpreet Singh",     position: "AM", club: "Wellington Phoenix",    caps: 26, goals: 3 },
  { id: 3918, teamId: 39, number: 19, name: "Ryan Thomas",        position: "AM", club: "PEC Zwolle",            caps: 25, goals: 3 },
  { id: 3919, teamId: 39, number: 9,  name: "Chris Wood",         position: "ST", club: "Nottingham Forest",     caps: 88, goals: 45, startX: 50, startY: 18 },
  { id: 3920, teamId: 39, number: 7,  name: "Ben Old",            position: "LW", club: "Saint-Étienne",         caps: 22, goals: 2,  startX: 22, startY: 32 },
  { id: 3921, teamId: 39, number: 11, name: "Kosta Barbarouses",  position: "RW", club: "Western Sydney Wanderers", caps: 74, goals: 10, startX: 78, startY: 32 },
  { id: 3922, teamId: 39, number: 20, name: "Elijah Just",        position: "ST", club: "Motherwell",            caps: 42, goals: 9 },
  { id: 3923, teamId: 39, number: 21, name: "Ben Waine",          position: "ST", club: "Port Vale",             caps: 30, goals: 9 },
  { id: 3924, teamId: 39, number: 24, name: "Callum McCowatt",    position: "LW", club: "Silkeborg IF",          caps: 30, goals: 4 },
  { id: 3925, teamId: 39, number: 25, name: "Jesse Randall",      position: "RW", club: "Auckland FC",           caps: 9,  goals: 2 },
  { id: 3926, teamId: 39, number: 26, name: "Lachlan Bayliss",    position: "ST", club: "Newcastle Jets",        caps: 2,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// France · Group I · OFFICIAL (overrides preliminary in wc26-squads.ts)
// ─────────────────────────────────────────────────────────────────────────────
const FRANCE_OFFICIAL: Player[] = [
  { id: 1401, teamId: 14, number: 1,  name: "Mike Maignan",         position: "GK", club: "AC Milan",              caps: 38, goals: 0,  startX: 50, startY: 92 },
  { id: 1402, teamId: 14, number: 16, name: "Brice Samba",          position: "GK", club: "Rennes",                caps: 4,  goals: 0 },
  { id: 1403, teamId: 14, number: 23, name: "Robin Risser",         position: "GK", club: "Lens",                  caps: 0,  goals: 0 },
  { id: 1404, teamId: 14, number: 2,  name: "Jules Koundé",         position: "RB", club: "Barcelona",             caps: 46, goals: 0,  startX: 82, startY: 75 },
  { id: 1405, teamId: 14, number: 3,  name: "Théo Hernandez",       position: "LB", club: "Al-Hilal",              caps: 42, goals: 2,  startX: 18, startY: 75 },
  { id: 1406, teamId: 14, number: 4,  name: "Dayot Upamecano",      position: "CB", club: "Bayern Munich",         caps: 36, goals: 2,  startX: 62, startY: 80 },
  { id: 1407, teamId: 14, number: 17, name: "William Saliba",       position: "CB", club: "Arsenal",               caps: 31, goals: 0,  startX: 38, startY: 80 },
  { id: 1409, teamId: 14, number: 21, name: "Ibrahima Konaté",      position: "CB", club: "Liverpool",             caps: 27, goals: 0 },
  { id: 1410, teamId: 14, number: 14, name: "Maxence Lacroix",      position: "CB", club: "Crystal Palace",        caps: 2,  goals: 0 },
  { id: 1411, teamId: 14, number: 22, name: "Lucas Digne",          position: "LB", club: "Aston Villa",           caps: 56, goals: 0 },
  { id: 1412, teamId: 14, number: 24, name: "Lucas Hernandez",      position: "CB", club: "Paris Saint-Germain",   caps: 41, goals: 0 },
  { id: 1413, teamId: 14, number: 25, name: "Malo Gusto",           position: "RB", club: "Chelsea",               caps: 9,  goals: 0 },
  { id: 1414, teamId: 14, number: 6,  name: "Eduardo Camavinga",    position: "CM", club: "Real Madrid",           caps: 30, goals: 0,  startX: 35, startY: 55 },
  { id: 1415, teamId: 14, number: 8,  name: "Aurélien Tchouaméni",  position: "DM", club: "Real Madrid",           caps: 44, goals: 3,  startX: 50, startY: 62 },
  { id: 1416, teamId: 14, number: 13, name: "N'Golo Kanté",         position: "DM", club: "Fenerbahçe",            caps: 67, goals: 2 },
  { id: 1417, teamId: 14, number: 15, name: "Manu Koné",            position: "CM", club: "AS Roma",               caps: 12, goals: 0 },
  { id: 1418, teamId: 14, number: 18, name: "Warren Zaïre-Emery",   position: "CM", club: "Paris Saint-Germain",   caps: 10, goals: 1,  startX: 65, startY: 55 },
  { id: 1419, teamId: 14, number: 26, name: "Adrien Rabiot",        position: "CM", club: "AC Milan",              caps: 57, goals: 7 },
  { id: 1420, teamId: 14, number: 7,  name: "Désiré Doué",          position: "AM", club: "Paris Saint-Germain",   caps: 6,  goals: 2 },
  { id: 1421, teamId: 14, number: 9,  name: "Marcus Thuram",        position: "ST", club: "Inter Milan",           caps: 33, goals: 3 },
  { id: 1422, teamId: 14, number: 10, name: "Kylian Mbappé",        position: "ST", club: "Real Madrid",           caps: 96, goals: 56, startX: 50, startY: 18, isCaptain: true },
  { id: 1423, teamId: 14, number: 11, name: "Ousmane Dembélé",      position: "RW", club: "Paris Saint-Germain",   caps: 58, goals: 7,  startX: 78, startY: 30 },
  { id: 1424, teamId: 14, number: 12, name: "Maghnes Akliouche",    position: "RW", club: "AS Monaco",             caps: 7,  goals: 1 },
  { id: 1425, teamId: 14, number: 19, name: "Bradley Barcola",      position: "LW", club: "Paris Saint-Germain",   caps: 18, goals: 3,  startX: 22, startY: 30 },
  { id: 1426, teamId: 14, number: 20, name: "Michael Olise",        position: "RW", club: "Bayern Munich",         caps: 15, goals: 4 },
  { id: 1427, teamId: 14, number: 27, name: "Rayan Cherki",         position: "AM", club: "Manchester City",       caps: 5,  goals: 1 },
  { id: 1428, teamId: 14, number: 28, name: "Jean-Philippe Mateta", position: "ST", club: "Crystal Palace",        caps: 3,  goals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Austria · Group J · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const AUSTRIA: Player[] = [
  { id: 5601, teamId: 56, number: 1,  name: "Alexander Schlager",     position: "GK", club: "Red Bull Salzburg",     caps: 25, goals: 0,  startX: 50, startY: 92 },
  { id: 5602, teamId: 56, number: 12, name: "Patrick Pentz",          position: "GK", club: "Brøndby",               caps: 18, goals: 0 },
  { id: 5603, teamId: 56, number: 23, name: "Florian Wiegele",        position: "GK", club: "Viktoria Plzeň",        caps: 1,  goals: 0 },
  { id: 5604, teamId: 56, number: 2,  name: "Stefan Posch",           position: "RB", club: "Como",                  caps: 51, goals: 5,  startX: 82, startY: 75 },
  { id: 5605, teamId: 56, number: 3,  name: "Phillipp Mwene",         position: "LB", club: "Mainz",                 caps: 29, goals: 0,  startX: 18, startY: 75 },
  { id: 5606, teamId: 56, number: 4,  name: "Kevin Danso",            position: "CB", club: "Tottenham",             caps: 31, goals: 0,  startX: 38, startY: 80 },
  { id: 5607, teamId: 56, number: 5,  name: "Philipp Lienhart",       position: "CB", club: "Freiburg",              caps: 40, goals: 3 },
  { id: 5608, teamId: 56, number: 15, name: "David Alaba",            position: "CB", club: "Real Madrid",           caps: 112,goals: 15, startX: 62, startY: 80, isCaptain: true },
  { id: 5609, teamId: 56, number: 16, name: "Marco Friedl",           position: "CB", club: "Werder Bremen",         caps: 10, goals: 0 },
  { id: 5610, teamId: 56, number: 22, name: "Michael Svoboda",        position: "CB", club: "Venezia",               caps: 4,  goals: 0 },
  { id: 5611, teamId: 56, number: 24, name: "Alexander Prass",        position: "LB", club: "Hoffenheim",            caps: 18, goals: 0 },
  { id: 5612, teamId: 56, number: 25, name: "David Affengruber",      position: "CB", club: "Elche",                 caps: 1,  goals: 0 },
  { id: 5613, teamId: 56, number: 6,  name: "Nicolas Seiwald",        position: "DM", club: "RB Leipzig",            caps: 46, goals: 1,  startX: 50, startY: 62 },
  { id: 5614, teamId: 56, number: 8,  name: "Konrad Laimer",          position: "CM", club: "Bayern Munich",         caps: 56, goals: 7,  startX: 35, startY: 55 },
  { id: 5615, teamId: 56, number: 10, name: "Marcel Sabitzer",        position: "AM", club: "Borussia Dortmund",     caps: 97, goals: 25, startX: 65, startY: 50 },
  { id: 5616, teamId: 56, number: 14, name: "Xaver Schlager",         position: "DM", club: "RB Leipzig",            caps: 50, goals: 4 },
  { id: 5617, teamId: 56, number: 17, name: "Florian Grillitsch",     position: "CM", club: "Braga",                 caps: 58, goals: 1 },
  { id: 5618, teamId: 56, number: 18, name: "Romano Schmid",          position: "AM", club: "Werder Bremen",         caps: 33, goals: 3 },
  { id: 5619, teamId: 56, number: 19, name: "Christoph Baumgartner",  position: "AM", club: "Hoffenheim",            caps: 58, goals: 19 },
  { id: 5620, teamId: 56, number: 20, name: "Patrick Wimmer",         position: "LW", club: "VfL Wolfsburg",         caps: 30, goals: 1 },
  { id: 5621, teamId: 56, number: 21, name: "Carney Chukwuemeka",     position: "CM", club: "Borussia Dortmund",     caps: 2,  goals: 1 },
  { id: 5622, teamId: 56, number: 26, name: "Paul Wanner",            position: "AM", club: "PSV Eindhoven",         caps: 2,  goals: 0 },
  { id: 5623, teamId: 56, number: 27, name: "Alessandro Schöpf",      position: "CM", club: "Wolfsberger AC",        caps: 35, goals: 6 },
  { id: 5624, teamId: 56, number: 7,  name: "Marko Arnautović",       position: "ST", club: "Red Star Belgrade",     caps: 132,goals: 47, startX: 50, startY: 18 },
  { id: 5625, teamId: 56, number: 9,  name: "Michael Gregoritsch",    position: "ST", club: "FC Augsburg",           caps: 74, goals: 24 },
  { id: 5626, teamId: 56, number: 11, name: "Saša Kalajdžić",         position: "ST", club: "LASK",                  caps: 21, goals: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Portugal · Group K · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const PORTUGAL: Player[] = [
  { id: 1801, teamId: 18, number: 1,  name: "Diogo Costa",         position: "GK", club: "FC Porto",              caps: 42, goals: 0,  startX: 50, startY: 92 },
  { id: 1802, teamId: 18, number: 12, name: "José Sá",             position: "GK", club: "Wolverhampton",         caps: 4,  goals: 0 },
  { id: 1803, teamId: 18, number: 22, name: "Rui Silva",           position: "GK", club: "Sporting CP",           caps: 2,  goals: 0 },
  { id: 1804, teamId: 18, number: 2,  name: "Diogo Dalot",         position: "RB", club: "Manchester United",     caps: 33, goals: 3,  startX: 82, startY: 75 },
  { id: 1805, teamId: 18, number: 3,  name: "Rúben Dias",          position: "CB", club: "Manchester City",       caps: 74, goals: 3,  startX: 38, startY: 80 },
  { id: 1806, teamId: 18, number: 4,  name: "Gonçalo Inácio",      position: "CB", club: "Sporting CP",           caps: 20, goals: 2,  startX: 62, startY: 80 },
  { id: 1807, teamId: 18, number: 5,  name: "Nuno Mendes",         position: "LB", club: "Paris Saint-Germain",   caps: 43, goals: 1,  startX: 18, startY: 75 },
  { id: 1808, teamId: 18, number: 13, name: "Renato Veiga",        position: "CB", club: "Villarreal",            caps: 11, goals: 1 },
  { id: 1809, teamId: 18, number: 14, name: "João Cancelo",        position: "LB", club: "Barcelona",             caps: 66, goals: 12 },
  { id: 1810, teamId: 18, number: 15, name: "Nélson Semedo",       position: "RB", club: "Fenerbahçe",            caps: 48, goals: 0 },
  { id: 1811, teamId: 18, number: 19, name: "Matheus Nunes",       position: "RB", club: "Manchester City",       caps: 19, goals: 2 },
  { id: 1812, teamId: 18, number: 24, name: "Tomás Araújo",        position: "CB", club: "SL Benfica",            caps: 3,  goals: 0 },
  { id: 1813, teamId: 18, number: 6,  name: "João Neves",          position: "DM", club: "Paris Saint-Germain",   caps: 21, goals: 3,  startX: 50, startY: 62 },
  { id: 1814, teamId: 18, number: 8,  name: "Bruno Fernandes",     position: "AM", club: "Manchester United",     caps: 87, goals: 28, startX: 65, startY: 50 },
  { id: 1815, teamId: 18, number: 10, name: "Bernardo Silva",      position: "AM", club: "Manchester City",       caps: 107,goals: 14, startX: 35, startY: 50 },
  { id: 1816, teamId: 18, number: 16, name: "Vitinha",             position: "CM", club: "Paris Saint-Germain",   caps: 37, goals: 0 },
  { id: 1817, teamId: 18, number: 18, name: "Rúben Neves",         position: "DM", club: "Al-Hilal",              caps: 65, goals: 1 },
  { id: 1818, teamId: 18, number: 25, name: "Samuel Costa",        position: "CM", club: "Mallorca",              caps: 4,  goals: 0 },
  { id: 1819, teamId: 18, number: 23, name: "Ricardo Velho",       position: "GK", club: "Gençlerbirliği",        caps: 0,  goals: 0 },
  { id: 1820, teamId: 18, number: 7,  name: "Cristiano Ronaldo",   position: "ST", club: "Al-Nassr",              caps: 226,goals: 143, startX: 50, startY: 18, isCaptain: true },
  { id: 1821, teamId: 18, number: 9,  name: "Gonçalo Ramos",       position: "ST", club: "Paris Saint-Germain",   caps: 24, goals: 10 },
  { id: 1822, teamId: 18, number: 11, name: "João Félix",          position: "AM", club: "Al-Nassr",              caps: 52, goals: 12 },
  { id: 1823, teamId: 18, number: 17, name: "Rafael Leão",         position: "LW", club: "AC Milan",              caps: 43, goals: 5,  startX: 22, startY: 30 },
  { id: 1824, teamId: 18, number: 20, name: "Pedro Neto",          position: "LW", club: "Chelsea",               caps: 23, goals: 2 },
  { id: 1825, teamId: 18, number: 21, name: "Francisco Conceição", position: "RW", club: "Juventus",              caps: 15, goals: 3,  startX: 78, startY: 30 },
  { id: 1826, teamId: 18, number: 26, name: "Francisco Trincão",   position: "RW", club: "Sporting CP",           caps: 17, goals: 3 },
  { id: 1827, teamId: 18, number: 27, name: "Gonçalo Guedes",      position: "AM", club: "Real Sociedad",         caps: 33, goals: 7 },
];

// ─────────────────────────────────────────────────────────────────────────────
// DR Congo · Group K · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const DR_CONGO: Player[] = [
  { id: 5701, teamId: 57, number: 1,  name: "Lionel Mpasi",        position: "GK", club: "Le Havre",              caps: 27, goals: 0,  startX: 50, startY: 92 },
  { id: 5702, teamId: 57, number: 12, name: "Matthieu Epolo",      position: "GK", club: "Standard Liège",        caps: 1,  goals: 0 },
  { id: 5703, teamId: 57, number: 23, name: "Timothy Fayulu",      position: "GK", club: "Noah",                  caps: 3,  goals: 0 },
  { id: 5704, teamId: 57, number: 2,  name: "Aaron Wan-Bissaka",   position: "RB", club: "West Ham United",       caps: 10, goals: 0,  startX: 82, startY: 75 },
  { id: 5705, teamId: 57, number: 3,  name: "Arthur Masuaku",      position: "LB", club: "Lens",                  caps: 44, goals: 4,  startX: 18, startY: 75 },
  { id: 5706, teamId: 57, number: 4,  name: "Chancel Mbemba",      position: "CB", club: "Lille",                 caps: 107,goals: 7,  startX: 38, startY: 80, isCaptain: true },
  { id: 5707, teamId: 57, number: 5,  name: "Axel Tuanzebe",       position: "CB", club: "Burnley",               caps: 12, goals: 1,  startX: 62, startY: 80 },
  { id: 5708, teamId: 57, number: 13, name: "Dylan Batubinsika",   position: "CB", club: "Larisa",                caps: 14, goals: 1 },
  { id: 5709, teamId: 57, number: 14, name: "Gédéon Kalulu",       position: "RB", club: "Aris Limassol",         caps: 27, goals: 0 },
  { id: 5710, teamId: 57, number: 15, name: "Steve Kapuadi",       position: "CB", club: "Widzew Łódź",           caps: 3,  goals: 0 },
  { id: 5711, teamId: 57, number: 16, name: "Joris Kayembe",       position: "LB", club: "Racing Genk",           caps: 24, goals: 0 },
  { id: 5712, teamId: 57, number: 22, name: "Rocky Bushiri",       position: "CB", club: "Hibernian",             caps: 0,  goals: 0 },
  { id: 5713, teamId: 57, number: 6,  name: "Samuel Moutoussamy",  position: "DM", club: "Atromitos",             caps: 56, goals: 0,  startX: 50, startY: 62 },
  { id: 5714, teamId: 57, number: 8,  name: "Edo Kayembe",         position: "CM", club: "Watford",               caps: 41, goals: 2,  startX: 35, startY: 55 },
  { id: 5715, teamId: 57, number: 10, name: "Noah Sadiki",         position: "CM", club: "Sunderland",            caps: 18, goals: 0,  startX: 65, startY: 55 },
  { id: 5716, teamId: 57, number: 17, name: "Gaël Kakuta",         position: "AM", club: "Larisa",                caps: 30, goals: 5 },
  { id: 5717, teamId: 57, number: 18, name: "Charles Pickel",      position: "DM", club: "Espanyol",              caps: 33, goals: 1 },
  { id: 5718, teamId: 57, number: 19, name: "Ngal'ayel Mukau",     position: "CM", club: "Lille",                 caps: 12, goals: 0 },
  { id: 5719, teamId: 57, number: 20, name: "Théo Bongonda",       position: "AM", club: "Spartak Moscow",        caps: 37, goals: 7 },
  { id: 5720, teamId: 57, number: 24, name: "Brian Cipenga",       position: "CM", club: "Castellón",             caps: 7,  goals: 0 },
  { id: 5721, teamId: 57, number: 25, name: "Nathanaël Mbuku",     position: "AM", club: "Montpellier",           caps: 17, goals: 2 },
  { id: 5722, teamId: 57, number: 26, name: "Meschak Elia",        position: "AM", club: "Alanyaspor",            caps: 68, goals: 12 },
  { id: 5723, teamId: 57, number: 7,  name: "Yoane Wissa",         position: "ST", club: "Newcastle United",      caps: 36, goals: 9,  startX: 50, startY: 18 },
  { id: 5724, teamId: 57, number: 9,  name: "Cédric Bakambu",      position: "ST", club: "Real Betis",            caps: 68, goals: 21 },
  { id: 5725, teamId: 57, number: 11, name: "Fiston Mayele",       position: "ST", club: "Pyramids",              caps: 37, goals: 6,  startX: 78, startY: 30 },
  { id: 5726, teamId: 57, number: 21, name: "Simon Banza",         position: "ST", club: "Al Jazira",             caps: 14, goals: 2,  startX: 22, startY: 30 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Mexico · Group A · PRELIMINARY (subset of 55-man pool, likely starters)
// ─────────────────────────────────────────────────────────────────────────────
const MEXICO: Player[] = [
  { id: 101,  teamId: 1,  number: 1,  name: "Guillermo Ochoa",     position: "GK", club: "AEL Limassol",          caps: 151,goals: 0,  startX: 50, startY: 92 },
  { id: 102,  teamId: 1,  number: 12, name: "Carlos Acevedo",      position: "GK", club: "Santos Laguna",         caps: 6,  goals: 0 },
  { id: 103,  teamId: 1,  number: 13, name: "Raúl Rangel",         position: "GK", club: "Guadalajara",           caps: 11, goals: 0 },
  { id: 104,  teamId: 1,  number: 23, name: "Álex Padilla",        position: "GK", club: "Athletic Bilbao",       caps: 0,  goals: 0 },
  { id: 105,  teamId: 1,  number: 2,  name: "Jorge Sánchez",       position: "RB", club: "PAOK",                  caps: 56, goals: 3,  startX: 82, startY: 75 },
  { id: 106,  teamId: 1,  number: 3,  name: "Jesús Gallardo",      position: "LB", club: "Toluca",                caps: 118,goals: 3,  startX: 18, startY: 75 },
  { id: 107,  teamId: 1,  number: 4,  name: "Edson Álvarez",       position: "DM", club: "Fenerbahçe",            caps: 95, goals: 7,  startX: 50, startY: 62, isCaptain: true },
  { id: 108,  teamId: 1,  number: 5,  name: "Johan Vásquez",       position: "CB", club: "Genoa",                 caps: 44, goals: 1,  startX: 38, startY: 80 },
  { id: 109,  teamId: 1,  number: 14, name: "César Montes",        position: "CB", club: "Lokomotiv Moscow",      caps: 65, goals: 4,  startX: 62, startY: 80 },
  { id: 110,  teamId: 1,  number: 15, name: "Israel Reyes",        position: "CB", club: "América",               caps: 31, goals: 2 },
  { id: 111,  teamId: 1,  number: 16, name: "Julián Araujo",       position: "RB", club: "Celtic",                caps: 16, goals: 0 },
  { id: 112,  teamId: 1,  number: 17, name: "Mateo Chávez",        position: "LB", club: "AZ Alkmaar",            caps: 7,  goals: 0 },
  { id: 113,  teamId: 1,  number: 6,  name: "Erik Lira",           position: "CM", club: "Cruz Azul",             caps: 22, goals: 0,  startX: 35, startY: 55 },
  { id: 114,  teamId: 1,  number: 7,  name: "Luis Romo",           position: "CM", club: "Guadalajara",           caps: 60, goals: 4 },
  { id: 115,  teamId: 1,  number: 8,  name: "Carlos Rodríguez",    position: "CM", club: "Cruz Azul",             caps: 67, goals: 0,  startX: 65, startY: 55 },
  { id: 116,  teamId: 1,  number: 10, name: "Álvaro Fidalgo",      position: "AM", club: "Real Betis",            caps: 2,  goals: 0 },
  { id: 117,  teamId: 1,  number: 18, name: "Orbelín Pineda",      position: "AM", club: "AEK Athens",            caps: 90, goals: 12 },
  { id: 118,  teamId: 1,  number: 19, name: "Luis Chávez",         position: "CM", club: "Dinamo Moscow",         caps: 42, goals: 4 },
  { id: 119,  teamId: 1,  number: 20, name: "Gilberto Mora",       position: "AM", club: "Tijuana",               caps: 5,  goals: 0 },
  { id: 120,  teamId: 1,  number: 21, name: "Marcel Ruiz",         position: "CM", club: "Toluca",                caps: 17, goals: 0 },
  { id: 121,  teamId: 1,  number: 9,  name: "Raúl Jiménez",        position: "ST", club: "Fulham",                caps: 123,goals: 44, startX: 50, startY: 18 },
  { id: 122,  teamId: 1,  number: 11, name: "Santiago Giménez",    position: "ST", club: "AC Milan",              caps: 46, goals: 6 },
  { id: 123,  teamId: 1,  number: 22, name: "Alexis Vega",         position: "LW", club: "Toluca",                caps: 49, goals: 7,  startX: 22, startY: 32 },
  { id: 124,  teamId: 1,  number: 24, name: "Roberto Alvarado",    position: "RW", club: "Guadalajara",           caps: 65, goals: 5,  startX: 78, startY: 32 },
  { id: 125,  teamId: 1,  number: 25, name: "César Huerta",        position: "LW", club: "Anderlecht",            caps: 25, goals: 3 },
  { id: 126,  teamId: 1,  number: 26, name: "Julián Quiñones",     position: "ST", club: "Al-Qadsiah",            caps: 20, goals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Germany · Group E · OFFICIAL (announced 21 May 2026 by Julian Nagelsmann)
// Stats reflect club minutes / international form per matchday before the
// final squad call.
// ─────────────────────────────────────────────────────────────────────────────
const GERMANY: Player[] = [
  { id: 601,  teamId: 6,  number: 1,  name: "Oliver Baumann",         position: "GK", club: "Hoffenheim",            age: 35, caps: 6,  goals: 0,  startX: 50, startY: 92 },
  { id: 602,  teamId: 6,  number: 12, name: "Alexander Nübel",        position: "GK", club: "Stuttgart",             age: 29, caps: 0,  goals: 0 },
  { id: 603,  teamId: 6,  number: 22, name: "Manuel Neuer",           position: "GK", club: "Bayern Munich",         age: 40, caps: 124,goals: 0 },
  { id: 604,  teamId: 6,  number: 2,  name: "Malick Thiaw",           position: "CB", club: "Newcastle United",      age: 24, caps: 2,  goals: 0 },
  { id: 605,  teamId: 6,  number: 3,  name: "Waldemar Anton",         position: "CB", club: "Dortmund",              age: 29, caps: 4,  goals: 0,  startX: 38, startY: 80 },
  { id: 606,  teamId: 6,  number: 4,  name: "Jonathan Tah",           position: "CB", club: "Bayern Munich",         age: 30, caps: 32, goals: 0,  startX: 62, startY: 80, isCaptain: true },
  { id: 607,  teamId: 6,  number: 15, name: "Nico Schlotterbeck",     position: "CB", club: "Dortmund",              age: 26, caps: 12, goals: 0 },
  { id: 608,  teamId: 6,  number: 18, name: "Nathaniel Brown",        position: "LB", club: "Eintracht Frankfurt",   age: 22, caps: 2,  goals: 0 },
  { id: 609,  teamId: 6,  number: 22, name: "David Raum",             position: "LB", club: "RB Leipzig",            age: 28, caps: 25, goals: 1,  startX: 18, startY: 75 },
  { id: 610,  teamId: 6,  number: 23, name: "Antonio Rüdiger",        position: "CB", club: "Real Madrid",           age: 33, caps: 78, goals: 3 },
  { id: 611,  teamId: 6,  number: 25, name: "Pascal Groß",            position: "RB", club: "Brighton",              age: 34, caps: 17, goals: 1,  startX: 82, startY: 75 },
  { id: 612,  teamId: 6,  number: 5,  name: "Aleksandar Pavlović",    position: "DM", club: "Bayern Munich",         age: 22, caps: 8,  goals: 0,  startX: 50, startY: 60 },
  { id: 613,  teamId: 6,  number: 6,  name: "Joshua Kimmich",         position: "DM", club: "Bayern Munich",         age: 31, caps: 100,goals: 9 },
  { id: 614,  teamId: 6,  number: 8,  name: "Leon Goretzka",          position: "CM", club: "Bayern Munich",         age: 31, caps: 58, goals: 16, startX: 35, startY: 55 },
  { id: 615,  teamId: 6,  number: 10, name: "Jamal Musiala",          position: "AM", club: "Bayern Munich",         age: 23, caps: 38, goals: 12, startX: 65, startY: 50 },
  { id: 616,  teamId: 6,  number: 10, name: "Nadiem Amiri",           position: "AM", club: "Mainz",                 age: 29, caps: 5,  goals: 1 },
  { id: 617,  teamId: 6,  number: 13, name: "Felix Nmecha",           position: "CM", club: "Dortmund",              age: 25, caps: 6,  goals: 0 },
  { id: 618,  teamId: 6,  number: 16, name: "Angelo Stiller",         position: "CM", club: "Stuttgart",             age: 25, caps: 9,  goals: 0 },
  { id: 619,  teamId: 6,  number: 17, name: "Florian Wirtz",          position: "AM", club: "Liverpool",             age: 23, caps: 36, goals: 8 },
  { id: 620,  teamId: 6,  number: 21, name: "Lennart Karl",           position: "AM", club: "Bayern Munich",         age: 18, caps: 0,  goals: 0 },
  { id: 621,  teamId: 6,  number: 7,  name: "Kai Havertz",            position: "ST", club: "Arsenal",               age: 26, caps: 50, goals: 19 },
  { id: 622,  teamId: 6,  number: 7,  name: "Jamie Leweling",         position: "RW", club: "Stuttgart",             age: 25, caps: 4,  goals: 1 },
  { id: 623,  teamId: 6,  number: 9,  name: "Maximilian Beier",       position: "ST", club: "Dortmund",              age: 23, caps: 3,  goals: 0 },
  { id: 624,  teamId: 6,  number: 11, name: "Nick Woltemade",         position: "ST", club: "Newcastle United",      age: 24, caps: 6,  goals: 4,  startX: 50, startY: 18 },
  { id: 625,  teamId: 6,  number: 13, name: "Deniz Undav",            position: "ST", club: "Stuttgart",             age: 29, caps: 11, goals: 4 },
  { id: 626,  teamId: 6,  number: 19, name: "Leroy Sané",             position: "LW", club: "Galatasaray",           age: 30, caps: 70, goals: 14, startX: 22, startY: 30 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Senegal · Group I · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const SENEGAL: Player[] = [
  { id: 801,  teamId: 8,  number: 1,  name: "Édouard Mendy",          position: "GK", club: "Al-Ahli",               startX: 50, startY: 92 },
  { id: 802,  teamId: 8,  number: 12, name: "Mory Diaw",              position: "GK", club: "Clermont" },
  { id: 803,  teamId: 8,  number: 23, name: "Yehvann Diouf",          position: "GK", club: "Stade de Reims" },
  { id: 804,  teamId: 8,  number: 2,  name: "Krépin Diatta",          position: "RB", club: "Monaco",                startX: 82, startY: 75 },
  { id: 805,  teamId: 8,  number: 3,  name: "Kalidou Koulibaly",      position: "CB", club: "Al-Hilal",              startX: 38, startY: 80, isCaptain: true },
  { id: 806,  teamId: 8,  number: 4,  name: "Moussa Niakhaté",        position: "CB", club: "Lyon",                  startX: 62, startY: 80 },
  { id: 807,  teamId: 8,  number: 5,  name: "Abdoulaye Seck",         position: "CB", club: "Maccabi Haifa" },
  { id: 808,  teamId: 8,  number: 13, name: "Ismail Jakobs",          position: "LB", club: "Galatasaray",           startX: 18, startY: 75 },
  { id: 809,  teamId: 8,  number: 14, name: "Antoine Mendy",          position: "RB", club: "Nice" },
  { id: 810,  teamId: 8,  number: 15, name: "El Hadji Malick Diouf",  position: "LB", club: "West Ham" },
  { id: 811,  teamId: 8,  number: 16, name: "Mamadou Sarr",           position: "CB", club: "Strasbourg" },
  { id: 812,  teamId: 8,  number: 22, name: "Moustapha Mbow",         position: "CB", club: "Rennes" },
  { id: 813,  teamId: 8,  number: 24, name: "Ilay Camara",            position: "LB", club: "Standard Liège" },
  { id: 814,  teamId: 8,  number: 6,  name: "Idrissa Gana Gueye",     position: "DM", club: "Everton",               startX: 50, startY: 62 },
  { id: 815,  teamId: 8,  number: 8,  name: "Pape Matar Sarr",        position: "CM", club: "Tottenham",             startX: 65, startY: 55 },
  { id: 816,  teamId: 8,  number: 17, name: "Lamine Camara",          position: "CM", club: "Monaco",                startX: 35, startY: 55 },
  { id: 817,  teamId: 8,  number: 18, name: "Habib Diarra",           position: "AM", club: "Sunderland" },
  { id: 818,  teamId: 8,  number: 19, name: "Pape Gueye",             position: "DM", club: "Villarreal" },
  { id: 819,  teamId: 8,  number: 20, name: "Pathe Ciss",             position: "DM", club: "Rayo Vallecano" },
  { id: 820,  teamId: 8,  number: 25, name: "Bara Sapoko Ndiaye",     position: "CM", club: "Genoa" },
  { id: 821,  teamId: 8,  number: 7,  name: "Sadio Mané",             position: "LW", club: "Al-Nassr",              startX: 22, startY: 30 },
  { id: 822,  teamId: 8,  number: 9,  name: "Nicolas Jackson",        position: "ST", club: "Chelsea",               startX: 50, startY: 18 },
  { id: 823,  teamId: 8,  number: 10, name: "Iliman Ndiaye",          position: "AM", club: "Everton" },
  { id: 824,  teamId: 8,  number: 11, name: "Ismaïla Sarr",           position: "RW", club: "Crystal Palace",        startX: 78, startY: 30 },
  { id: 825,  teamId: 8,  number: 21, name: "Cherif Ndiaye",          position: "ST", club: "Red Star Belgrade" },
  { id: 826,  teamId: 8,  number: 26, name: "Bamba Dieng",            position: "ST", club: "Lorient" },
  { id: 827,  teamId: 8,  number: 27, name: "Assane Diao",            position: "LW", club: "Como" },
  { id: 828,  teamId: 8,  number: 28, name: "Ibrahim Mbaye",          position: "LW", club: "Paris Saint-Germain" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Registry exported to merge into the main getSquad() lookup.
// ─────────────────────────────────────────────────────────────────────────────
export const EXTRA_SQUADS: Record<number, Player[]> = {
  1:  MEXICO,
  6:  GERMANY,
  7:  JAPAN,
  8:  SENEGAL,
  10: SWITZERLAND,
  14: FRANCE_OFFICIAL,
  18: PORTUGAL,
  24: TUNISIA,
  32: COTE_D_IVOIRE,
  38: BELGIUM,
  39: NEW_ZEALAND,
  42: CROATIA,
  52: SCOTLAND,
  53: CURACAO,
  54: SWEDEN,
  56: AUSTRIA,
  57: DR_CONGO,
};
