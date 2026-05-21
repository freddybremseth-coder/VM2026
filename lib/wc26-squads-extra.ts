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
  { id: 1001, teamId: 10, number: 1,  name: "Gregor Kobel",       position: "GK", club: "Borussia Dortmund",     startX: 50, startY: 92 },
  { id: 1002, teamId: 10, number: 12, name: "Yvon Mvogo",         position: "GK", club: "Lorient" },
  { id: 1003, teamId: 10, number: 21, name: "Marvin Keller",      position: "GK", club: "Young Boys" },
  { id: 1004, teamId: 10, number: 2,  name: "Manuel Akanji",      position: "CB", club: "Inter Milan",           startX: 38, startY: 80 },
  { id: 1005, teamId: 10, number: 3,  name: "Silvan Widmer",      position: "RB", club: "Mainz",                 startX: 82, startY: 75 },
  { id: 1006, teamId: 10, number: 4,  name: "Nico Elvedi",        position: "CB", club: "Mönchengladbach",       startX: 62, startY: 80 },
  { id: 1007, teamId: 10, number: 5,  name: "Aurèle Amenda",      position: "CB", club: "Eintracht Frankfurt" },
  { id: 1008, teamId: 10, number: 13, name: "Ricardo Rodriguez",  position: "LB", club: "Real Betis",            startX: 18, startY: 75 },
  { id: 1009, teamId: 10, number: 14, name: "Luca Jaquez",        position: "CB", club: "VfB Stuttgart" },
  { id: 1010, teamId: 10, number: 15, name: "Miro Muheim",        position: "LB", club: "Hamburg" },
  { id: 1011, teamId: 10, number: 22, name: "Eray Cömert",        position: "CB", club: "Valencia" },
  { id: 1012, teamId: 10, number: 6,  name: "Denis Zakaria",      position: "DM", club: "Monaco",                startX: 50, startY: 62 },
  { id: 1013, teamId: 10, number: 8,  name: "Remo Freuler",       position: "CM", club: "Bologna",               startX: 35, startY: 55 },
  { id: 1014, teamId: 10, number: 10, name: "Granit Xhaka",       position: "CM", club: "Sunderland",            startX: 65, startY: 55, isCaptain: true },
  { id: 1015, teamId: 10, number: 11, name: "Renato Steffen",     position: "AM", club: "Lugano" },
  { id: 1016, teamId: 10, number: 16, name: "Christian Fassnacht",position: "CM", club: "Young Boys" },
  { id: 1017, teamId: 10, number: 17, name: "Ruben Vargas",       position: "LW", club: "Sevilla",               startX: 22, startY: 30 },
  { id: 1018, teamId: 10, number: 18, name: "Michel Aebischer",   position: "CM", club: "Pisa" },
  { id: 1019, teamId: 10, number: 19, name: "Johan Manzambi",     position: "AM", club: "Freiburg" },
  { id: 1020, teamId: 10, number: 20, name: "Fabian Rieder",      position: "AM", club: "Augsburg" },
  { id: 1021, teamId: 10, number: 23, name: "Ardon Jashari",      position: "CM", club: "AC Milan" },
  { id: 1022, teamId: 10, number: 24, name: "Djibril Sow",        position: "CM", club: "Sevilla" },
  { id: 1023, teamId: 10, number: 7,  name: "Breel Embolo",       position: "ST", club: "Rennes",                startX: 50, startY: 18 },
  { id: 1024, teamId: 10, number: 9,  name: "Zeki Amdouni",       position: "ST", club: "Burnley" },
  { id: 1025, teamId: 10, number: 25, name: "Dan Ndoye",          position: "RW", club: "Nottingham Forest",     startX: 78, startY: 30 },
  { id: 1026, teamId: 10, number: 26, name: "Noah Okafor",        position: "LW", club: "Leeds" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scotland · Group C · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const SCOTLAND: Player[] = [
  { id: 5201, teamId: 52, number: 1,  name: "Angus Gunn",          position: "GK", club: "Nottingham Forest",     startX: 50, startY: 92 },
  { id: 5202, teamId: 52, number: 12, name: "Liam Kelly",          position: "GK", club: "Rangers" },
  { id: 5203, teamId: 52, number: 23, name: "Craig Gordon",        position: "GK", club: "Hearts" },
  { id: 5204, teamId: 52, number: 2,  name: "Anthony Ralston",     position: "RB", club: "Celtic",                startX: 82, startY: 75 },
  { id: 5205, teamId: 52, number: 3,  name: "Andy Robertson",      position: "LB", club: "Liverpool",             startX: 18, startY: 75, isCaptain: true },
  { id: 5206, teamId: 52, number: 4,  name: "Scott McKenna",       position: "CB", club: "Dinamo Zagreb",         startX: 38, startY: 80 },
  { id: 5207, teamId: 52, number: 5,  name: "Grant Hanley",        position: "CB", club: "Hibernian" },
  { id: 5208, teamId: 52, number: 6,  name: "John Souttar",        position: "CB", club: "Rangers",               startX: 62, startY: 80 },
  { id: 5209, teamId: 52, number: 16, name: "Kieran Tierney",      position: "LB", club: "Celtic" },
  { id: 5210, teamId: 52, number: 18, name: "Aaron Hickey",        position: "RB", club: "Brentford" },
  { id: 5211, teamId: 52, number: 13, name: "Jack Hendry",         position: "CB", club: "Al-Ettifaq" },
  { id: 5212, teamId: 52, number: 14, name: "Nathan Patterson",    position: "RB", club: "Everton" },
  { id: 5213, teamId: 52, number: 19, name: "Dom Hyam",            position: "CB", club: "Wrexham" },
  { id: 5214, teamId: 52, number: 7,  name: "John McGinn",         position: "CM", club: "Aston Villa",           startX: 32, startY: 55 },
  { id: 5215, teamId: 52, number: 8,  name: "Billy Gilmour",       position: "DM", club: "Napoli",                startX: 50, startY: 60 },
  { id: 5216, teamId: 52, number: 10, name: "Scott McTominay",     position: "AM", club: "Napoli",                startX: 68, startY: 50 },
  { id: 5217, teamId: 52, number: 11, name: "Ryan Christie",       position: "AM", club: "Bournemouth" },
  { id: 5218, teamId: 52, number: 15, name: "Lewis Ferguson",      position: "CM", club: "Bologna" },
  { id: 5219, teamId: 52, number: 17, name: "Kenny McLean",        position: "CM", club: "Norwich" },
  { id: 5220, teamId: 52, number: 20, name: "Ben Gannon-Doak",     position: "RW", club: "Bournemouth",           startX: 78, startY: 30 },
  { id: 5221, teamId: 52, number: 21, name: "Findlay Curtis",      position: "CM", club: "Kilmarnock" },
  { id: 5222, teamId: 52, number: 9,  name: "Lyndon Dykes",        position: "ST", club: "Charlton Athletic" },
  { id: 5223, teamId: 52, number: 22, name: "Che Adams",           position: "ST", club: "Torino",                startX: 50, startY: 18 },
  { id: 5224, teamId: 52, number: 24, name: "Lawrence Shankland",  position: "ST", club: "Hearts" },
  { id: 5225, teamId: 52, number: 25, name: "George Hirst",        position: "ST", club: "Ipswich" },
  { id: 5226, teamId: 52, number: 26, name: "Ross Stewart",        position: "ST", club: "Southampton" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Croatia · Group L · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const CROATIA: Player[] = [
  { id: 4201, teamId: 42, number: 1,  name: "Dominik Livaković",   position: "GK", club: "Dinamo Zagreb",         startX: 50, startY: 92 },
  { id: 4202, teamId: 42, number: 12, name: "Dominik Kotarski",    position: "GK", club: "FC Copenhagen" },
  { id: 4203, teamId: 42, number: 23, name: "Ivor Pandur",         position: "GK", club: "Hull City" },
  { id: 4204, teamId: 42, number: 2,  name: "Josip Stanišić",      position: "RB", club: "Bayern Munich",         startX: 82, startY: 75 },
  { id: 4205, teamId: 42, number: 5,  name: "Duje Ćaleta-Car",     position: "CB", club: "Real Sociedad",         startX: 38, startY: 80 },
  { id: 4206, teamId: 42, number: 6,  name: "Joško Gvardiol",      position: "CB", club: "Manchester City",       startX: 18, startY: 75 },
  { id: 4207, teamId: 42, number: 21, name: "Josip Šutalo",        position: "CB", club: "Ajax",                  startX: 62, startY: 80 },
  { id: 4208, teamId: 42, number: 13, name: "Marin Pongračić",     position: "CB", club: "Fiorentina" },
  { id: 4209, teamId: 42, number: 14, name: "Martin Erlić",        position: "CB", club: "Midtjylland" },
  { id: 4210, teamId: 42, number: 22, name: "Luka Vušković",       position: "CB", club: "Hamburg" },
  { id: 4211, teamId: 42, number: 10, name: "Luka Modrić",         position: "CM", club: "AC Milan",              startX: 50, startY: 55, isCaptain: true },
  { id: 4212, teamId: 42, number: 8,  name: "Mateo Kovačić",       position: "DM", club: "Manchester City",       startX: 50, startY: 62 },
  { id: 4213, teamId: 42, number: 7,  name: "Luka Sučić",          position: "AM", club: "Real Sociedad",         startX: 65, startY: 50 },
  { id: 4214, teamId: 42, number: 15, name: "Mario Pašalić",       position: "CM", club: "Atalanta" },
  { id: 4215, teamId: 42, number: 16, name: "Martin Baturina",     position: "AM", club: "Como",                  startX: 35, startY: 50 },
  { id: 4216, teamId: 42, number: 17, name: "Petar Sučić",         position: "CM", club: "Inter Milan" },
  { id: 4217, teamId: 42, number: 18, name: "Kristijan Jakić",     position: "DM", club: "Augsburg" },
  { id: 4218, teamId: 42, number: 19, name: "Nikola Vlašić",       position: "AM", club: "Torino" },
  { id: 4219, teamId: 42, number: 24, name: "Nikola Moro",         position: "CM", club: "Bologna" },
  { id: 4220, teamId: 42, number: 25, name: "Toni Fruk",           position: "AM", club: "Rijeka" },
  { id: 4221, teamId: 42, number: 4,  name: "Ivan Perišić",        position: "LW", club: "PSV Eindhoven",         startX: 22, startY: 30 },
  { id: 4222, teamId: 42, number: 9,  name: "Andrej Kramarić",     position: "ST", club: "Hoffenheim",            startX: 50, startY: 18 },
  { id: 4223, teamId: 42, number: 11, name: "Ante Budimir",        position: "ST", club: "Osasuna" },
  { id: 4224, teamId: 42, number: 20, name: "Marco Pašalić",       position: "RW", club: "Orlando City",          startX: 78, startY: 30 },
  { id: 4225, teamId: 42, number: 26, name: "Petar Musa",          position: "ST", club: "FC Dallas" },
  { id: 4226, teamId: 42, number: 27, name: "Igor Matanović",      position: "ST", club: "Freiburg" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Belgium · Group G · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const BELGIUM: Player[] = [
  { id: 3801, teamId: 38, number: 1,  name: "Thibaut Courtois",       position: "GK", club: "Real Madrid",             startX: 50, startY: 92 },
  { id: 3802, teamId: 38, number: 12, name: "Senne Lammens",          position: "GK", club: "Manchester United" },
  { id: 3803, teamId: 38, number: 13, name: "Mike Penders",           position: "GK", club: "Strasbourg" },
  { id: 3804, teamId: 38, number: 2,  name: "Timothy Castagne",       position: "RB", club: "Fulham",                  startX: 82, startY: 75 },
  { id: 3805, teamId: 38, number: 3,  name: "Arthur Theate",          position: "CB", club: "Eintracht Frankfurt",     startX: 38, startY: 80 },
  { id: 3806, teamId: 38, number: 4,  name: "Zeno Debast",            position: "CB", club: "Sporting CP",             startX: 50, startY: 78 },
  { id: 3807, teamId: 38, number: 5,  name: "Brandon Mechele",        position: "CB", club: "Club Brugge",             startX: 62, startY: 80 },
  { id: 3808, teamId: 38, number: 14, name: "Koni De Winter",         position: "CB", club: "AC Milan" },
  { id: 3809, teamId: 38, number: 15, name: "Maxim De Cuyper",        position: "LB", club: "Brighton",                startX: 18, startY: 75 },
  { id: 3810, teamId: 38, number: 16, name: "Thomas Meunier",         position: "RB", club: "Lille" },
  { id: 3811, teamId: 38, number: 22, name: "Joaquin Seys",           position: "RB", club: "Club Brugge" },
  { id: 3812, teamId: 38, number: 23, name: "Nathan Ngoy",            position: "CB", club: "Lille" },
  { id: 3813, teamId: 38, number: 6,  name: "Axel Witsel",            position: "DM", club: "Girona",                  startX: 50, startY: 62 },
  { id: 3814, teamId: 38, number: 7,  name: "Kevin De Bruyne",        position: "AM", club: "Napoli",                  startX: 50, startY: 45, isCaptain: true },
  { id: 3815, teamId: 38, number: 8,  name: "Youri Tielemans",        position: "CM", club: "Aston Villa",             startX: 65, startY: 55 },
  { id: 3816, teamId: 38, number: 17, name: "Hans Vanaken",           position: "CM", club: "Club Brugge" },
  { id: 3817, teamId: 38, number: 18, name: "Amadou Onana",           position: "DM", club: "Aston Villa",             startX: 35, startY: 55 },
  { id: 3818, teamId: 38, number: 19, name: "Nicolas Raskin",         position: "CM", club: "Rangers" },
  { id: 3819, teamId: 38, number: 9,  name: "Romelu Lukaku",          position: "ST", club: "Napoli",                  startX: 50, startY: 18 },
  { id: 3820, teamId: 38, number: 10, name: "Jérémy Doku",            position: "RW", club: "Manchester City",         startX: 78, startY: 30 },
  { id: 3821, teamId: 38, number: 11, name: "Leandro Trossard",       position: "LW", club: "Arsenal",                 startX: 22, startY: 30 },
  { id: 3822, teamId: 38, number: 20, name: "Charles De Ketelaere",   position: "AM", club: "Atalanta" },
  { id: 3823, teamId: 38, number: 21, name: "Dodi Lukebakio",         position: "LW", club: "Benfica" },
  { id: 3824, teamId: 38, number: 24, name: "Alexis Saelemaekers",    position: "RW", club: "AC Milan" },
  { id: 3825, teamId: 38, number: 25, name: "Diego Moreira",          position: "LW", club: "Strasbourg" },
  { id: 3826, teamId: 38, number: 26, name: "Matias Fernandez-Pardo", position: "LW", club: "Lille" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Japan · Group F · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const JAPAN: Player[] = [
  { id: 701,  teamId: 7,  number: 1,  name: "Tomoki Hayakawa",     position: "GK", club: "Kashima Antlers",        startX: 50, startY: 92 },
  { id: 702,  teamId: 7,  number: 12, name: "Keisuke Osako",       position: "GK", club: "Sanfrecce Hiroshima" },
  { id: 703,  teamId: 7,  number: 23, name: "Aya Suzuka",          position: "GK", club: "Parma" },
  { id: 704,  teamId: 7,  number: 2,  name: "Ko Itakura",          position: "CB", club: "Ajax",                   startX: 38, startY: 80 },
  { id: 705,  teamId: 7,  number: 3,  name: "Tsuyoshi Watanabe",   position: "CB", club: "Feyenoord",              startX: 50, startY: 78 },
  { id: 706,  teamId: 7,  number: 4,  name: "Takehiro Tomiyasu",   position: "RB", club: "Ajax",                   startX: 82, startY: 75 },
  { id: 707,  teamId: 7,  number: 5,  name: "Hiroki Ito",          position: "LB", club: "Bayern Munich",          startX: 18, startY: 75 },
  { id: 708,  teamId: 7,  number: 13, name: "Shogo Taniguchi",     position: "CB", club: "Sint-Truiden" },
  { id: 709,  teamId: 7,  number: 15, name: "Yukinari Sugawara",   position: "RB", club: "Werder Bremen" },
  { id: 710,  teamId: 7,  number: 16, name: "Ayumu Seko",          position: "CB", club: "Le Havre" },
  { id: 711,  teamId: 7,  number: 18, name: "Yuto Nagatomo",       position: "LB", club: "FC Tokyo" },
  { id: 712,  teamId: 7,  number: 21, name: "Junosuke Suzuki",     position: "CB", club: "FC Copenhagen" },
  { id: 713,  teamId: 7,  number: 6,  name: "Wataru Endo",         position: "DM", club: "Liverpool",              startX: 50, startY: 60, isCaptain: true },
  { id: 714,  teamId: 7,  number: 7,  name: "Junya Ito",           position: "RW", club: "Genk",                   startX: 78, startY: 32 },
  { id: 715,  teamId: 7,  number: 8,  name: "Daichi Kamada",       position: "AM", club: "Crystal Palace",         startX: 35, startY: 50 },
  { id: 716,  teamId: 7,  number: 10, name: "Ritsu Doan",          position: "AM", club: "Eintracht Frankfurt",    startX: 65, startY: 50 },
  { id: 717,  teamId: 7,  number: 14, name: "Junya Ito",           position: "CM", club: "Genk" },
  { id: 718,  teamId: 7,  number: 17, name: "Ao Tanaka",           position: "CM", club: "Leeds" },
  { id: 719,  teamId: 7,  number: 19, name: "Kaishu Sano",         position: "CM", club: "Mainz" },
  { id: 720,  teamId: 7,  number: 20, name: "Takefusa Kubo",       position: "RW", club: "Real Sociedad" },
  { id: 721,  teamId: 7,  number: 24, name: "Koki Ogawa",          position: "CM", club: "NEC Nijmegen" },
  { id: 722,  teamId: 7,  number: 25, name: "Daizen Maeda",        position: "LW", club: "Celtic",                 startX: 22, startY: 32 },
  { id: 723,  teamId: 7,  number: 9,  name: "Ayase Ueda",          position: "ST", club: "Feyenoord",              startX: 50, startY: 18 },
  { id: 724,  teamId: 7,  number: 11, name: "Keito Nakamura",      position: "LW", club: "Stade de Reims" },
  { id: 725,  teamId: 7,  number: 22, name: "Ito Suzuki",          position: "ST", club: "Freiburg" },
  { id: 726,  teamId: 7,  number: 26, name: "Keisuke Goto",        position: "ST", club: "Sint-Truiden" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sweden · Group F · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const SWEDEN: Player[] = [
  { id: 5401, teamId: 54, number: 1,  name: "Viktor Johansson",         position: "GK", club: "Stoke City",            startX: 50, startY: 92 },
  { id: 5402, teamId: 54, number: 12, name: "Kristoffer Nordfeldt",     position: "GK", club: "AIK" },
  { id: 5403, teamId: 54, number: 23, name: "Jacob Widell Zetterström", position: "GK", club: "Derby County" },
  { id: 5404, teamId: 54, number: 2,  name: "Gabriel Gudmundsson",      position: "LB", club: "Leeds United",          startX: 18, startY: 75 },
  { id: 5405, teamId: 54, number: 3,  name: "Victor Lindelöf",          position: "CB", club: "Aston Villa",           startX: 38, startY: 80, isCaptain: true },
  { id: 5406, teamId: 54, number: 4,  name: "Isak Hien",                position: "CB", club: "Atalanta",              startX: 62, startY: 80 },
  { id: 5407, teamId: 54, number: 5,  name: "Hjalmar Ekdal",            position: "CB", club: "Burnley" },
  { id: 5408, teamId: 54, number: 13, name: "Emil Holm",                position: "RB", club: "Juventus",              startX: 82, startY: 75 },
  { id: 5409, teamId: 54, number: 14, name: "Gustaf Lagerbielke",       position: "CB", club: "Braga" },
  { id: 5410, teamId: 54, number: 15, name: "Carl Starfelt",            position: "CB", club: "Celta Vigo" },
  { id: 5411, teamId: 54, number: 16, name: "Daniel Svensson",          position: "LB", club: "Borussia Dortmund" },
  { id: 5412, teamId: 54, number: 22, name: "Erik Smith",               position: "CB", club: "St. Pauli" },
  { id: 5413, teamId: 54, number: 24, name: "Elliot Stroud",            position: "CB", club: "Mjällby" },
  { id: 5414, teamId: 54, number: 6,  name: "Mattias Svanberg",         position: "CM", club: "Wolfsburg",             startX: 50, startY: 60 },
  { id: 5415, teamId: 54, number: 7,  name: "Yasin Ayari",              position: "CM", club: "Brighton",              startX: 35, startY: 55 },
  { id: 5416, teamId: 54, number: 8,  name: "Lucas Bergvall",           position: "AM", club: "Tottenham",             startX: 65, startY: 50 },
  { id: 5417, teamId: 54, number: 17, name: "Ken Sema",                 position: "LW", club: "Pafos" },
  { id: 5418, teamId: 54, number: 18, name: "Jesper Karlström",         position: "DM", club: "Udinese" },
  { id: 5419, teamId: 54, number: 19, name: "Taha Ali",                 position: "AM", club: "Malmö" },
  { id: 5420, teamId: 54, number: 20, name: "Besfort Zeneli",           position: "CM", club: "Union St-Gilloise" },
  { id: 5421, teamId: 54, number: 9,  name: "Alexander Isak",           position: "ST", club: "Liverpool",             startX: 50, startY: 18 },
  { id: 5422, teamId: 54, number: 10, name: "Viktor Gyökeres",          position: "ST", club: "Arsenal" },
  { id: 5423, teamId: 54, number: 11, name: "Anthony Elanga",           position: "RW", club: "Newcastle",             startX: 78, startY: 30 },
  { id: 5424, teamId: 54, number: 21, name: "Benjamin Nygren",          position: "AM", club: "Celtic",                startX: 22, startY: 32 },
  { id: 5425, teamId: 54, number: 25, name: "Alexander Bernhardsson",   position: "LW", club: "Holstein Kiel" },
  { id: 5426, teamId: 54, number: 26, name: "Gustaf Nilsson",           position: "ST", club: "Club Brugge" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tunisia · Group F · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const TUNISIA: Player[] = [
  { id: 2401, teamId: 24, number: 1,  name: "Aymen Dahmen",           position: "GK", club: "CS Sfaxien",           startX: 50, startY: 92 },
  { id: 2402, teamId: 24, number: 12, name: "Sabri Ben Hassen",       position: "GK", club: "Étoile Sahel" },
  { id: 2403, teamId: 24, number: 23, name: "Abdelmouhib Chamakh",    position: "GK", club: "Club Africain" },
  { id: 2404, teamId: 24, number: 2,  name: "Yan Valéry",             position: "RB", club: "Young Boys",           startX: 82, startY: 75 },
  { id: 2405, teamId: 24, number: 3,  name: "Ali Abdi",               position: "LB", club: "Nice",                 startX: 18, startY: 75 },
  { id: 2406, teamId: 24, number: 4,  name: "Dylan Bronn",            position: "CB", club: "Servette",             startX: 38, startY: 80 },
  { id: 2407, teamId: 24, number: 5,  name: "Montassar Talbi",        position: "CB", club: "Lorient",              startX: 62, startY: 80 },
  { id: 2408, teamId: 24, number: 13, name: "Omar Rekik",             position: "CB", club: "NK Maribor" },
  { id: 2409, teamId: 24, number: 14, name: "Adem Arous",             position: "RB", club: "Kasımpaşa" },
  { id: 2410, teamId: 24, number: 15, name: "Mohamed Amine Ben Hamida", position: "CB", club: "Espérance" },
  { id: 2411, teamId: 24, number: 22, name: "Raed Chikhaoui",         position: "CB", club: "US Monastir" },
  { id: 2412, teamId: 24, number: 24, name: "Moutaz Neffati",         position: "LB", club: "Norrköping" },
  { id: 2413, teamId: 24, number: 6,  name: "Ellyes Skhiri",          position: "DM", club: "Eintracht Frankfurt",  startX: 50, startY: 60, isCaptain: true },
  { id: 2414, teamId: 24, number: 8,  name: "Hannibal Mejbri",        position: "AM", club: "Burnley",              startX: 65, startY: 50 },
  { id: 2415, teamId: 24, number: 10, name: "Anis Ben Slimane",       position: "AM", club: "Norwich City",         startX: 35, startY: 50 },
  { id: 2416, teamId: 24, number: 16, name: "Rani Khedira",           position: "DM", club: "Union Berlin" },
  { id: 2417, teamId: 24, number: 17, name: "Mortadha Ben Ouanes",    position: "CM", club: "Kasımpaşa" },
  { id: 2418, teamId: 24, number: 18, name: "Ismael Gharbi",          position: "AM", club: "Augsburg" },
  { id: 2419, teamId: 24, number: 19, name: "Mohamed Hadj Mahmoud",   position: "CM", club: "Lugano" },
  { id: 2420, teamId: 24, number: 7,  name: "Elias Achouri",          position: "LW", club: "FC Copenhagen",        startX: 22, startY: 32 },
  { id: 2421, teamId: 24, number: 9,  name: "Sebastian Tounekti",     position: "RW", club: "Celtic",               startX: 78, startY: 32 },
  { id: 2422, teamId: 24, number: 11, name: "Khalil Ayari",           position: "AM", club: "PSG" },
  { id: 2423, teamId: 24, number: 20, name: "Elias Saad",             position: "LW", club: "Hannover 96" },
  { id: 2424, teamId: 24, number: 21, name: "Firas Chaouat",          position: "ST", club: "Club Africain",        startX: 50, startY: 18 },
  { id: 2425, teamId: 24, number: 25, name: "Rayan Elloumi",          position: "ST", club: "Vancouver Whitecaps" },
  { id: 2426, teamId: 24, number: 26, name: "Hazem Mastouri",         position: "ST", club: "Dynamo Makhachkala" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Curaçao · Group E · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const CURACAO: Player[] = [
  { id: 5301, teamId: 53, number: 1,  name: "Eloy Room",              position: "GK", club: "Miami FC",              startX: 50, startY: 92 },
  { id: 5302, teamId: 53, number: 12, name: "Trevor Doornbusch",      position: "GK", club: "VVV-Venlo" },
  { id: 5303, teamId: 53, number: 23, name: "Tyrick Bodak",           position: "GK", club: "SC Telstar" },
  { id: 5304, teamId: 53, number: 2,  name: "Sherel Floranus",        position: "RB", club: "PEC Zwolle",            startX: 82, startY: 75 },
  { id: 5305, teamId: 53, number: 3,  name: "Riechedly Bazoer",       position: "CB", club: "Konyaspor",             startX: 38, startY: 80 },
  { id: 5306, teamId: 53, number: 4,  name: "Armando Obispo",         position: "CB", club: "PSV Eindhoven",         startX: 62, startY: 80 },
  { id: 5307, teamId: 53, number: 5,  name: "Joshua Brenet",          position: "LB", club: "Kayserispor",           startX: 18, startY: 75 },
  { id: 5308, teamId: 53, number: 6,  name: "Roshon van Eijma",       position: "CB", club: "RKC Waalwijk" },
  { id: 5309, teamId: 53, number: 13, name: "Deveron Fonville",       position: "RB", club: "NEC Nijmegen" },
  { id: 5310, teamId: 53, number: 14, name: "Jurien Gaari",           position: "CB", club: "Abha Club" },
  { id: 5311, teamId: 53, number: 22, name: "Shurandy Sambo",         position: "RB", club: "Sparta Rotterdam" },
  { id: 5312, teamId: 53, number: 8,  name: "Juninho Bacuna",         position: "CM", club: "FC Volendam",           startX: 50, startY: 60, isCaptain: true },
  { id: 5313, teamId: 53, number: 10, name: "Leandro Bacuna",         position: "CM", club: "Iğdır FK" },
  { id: 5314, teamId: 53, number: 15, name: "Livano Comenencia",      position: "AM", club: "FC Zürich",             startX: 65, startY: 50 },
  { id: 5315, teamId: 53, number: 16, name: "Kevin Felida",           position: "CM", club: "FC Den Bosch" },
  { id: 5316, teamId: 53, number: 17, name: "Ar'Jany Martha",         position: "AM", club: "Rotherham",             startX: 35, startY: 50 },
  { id: 5317, teamId: 53, number: 18, name: "Tyrese Noslin",          position: "AM", club: "SC Telstar" },
  { id: 5318, teamId: 53, number: 19, name: "Godfried Roemeratoe",    position: "CM", club: "RKC Waalwijk" },
  { id: 5319, teamId: 53, number: 7,  name: "Tahith Chong",           position: "LW", club: "Sheffield United",      startX: 22, startY: 32 },
  { id: 5320, teamId: 53, number: 9,  name: "Jürgen Locadia",         position: "ST", club: "Miami FC",              startX: 50, startY: 18 },
  { id: 5321, teamId: 53, number: 11, name: "Sontje Hansen",          position: "ST", club: "Middlesbrough" },
  { id: 5322, teamId: 53, number: 20, name: "Kenji Gorré",            position: "RW", club: "Maccabi Haifa",         startX: 78, startY: 32 },
  { id: 5323, teamId: 53, number: 21, name: "Brandley Kuwas",         position: "RW", club: "FC Volendam" },
  { id: 5324, teamId: 53, number: 24, name: "Gervane Kastaneer",      position: "LW", club: "Terengganu" },
  { id: 5325, teamId: 53, number: 25, name: "Jeremy Antonisse",       position: "LW", club: "AE Kifisia" },
  { id: 5326, teamId: 53, number: 26, name: "Jearl Margaritha",       position: "ST", club: "SK Beveren" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Côte d'Ivoire · Group E · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const COTE_D_IVOIRE: Player[] = [
  { id: 3201, teamId: 32, number: 1,  name: "Yahia Fofana",           position: "GK", club: "Çaykur Rizespor",       startX: 50, startY: 92 },
  { id: 3202, teamId: 32, number: 12, name: "Mohamed Koné",           position: "GK", club: "Charleroi" },
  { id: 3203, teamId: 32, number: 23, name: "Alban Lafont",           position: "GK", club: "Panathinaikos" },
  { id: 3204, teamId: 32, number: 2,  name: "Wilfried Singo",         position: "RB", club: "Galatasaray",           startX: 82, startY: 75 },
  { id: 3205, teamId: 32, number: 3,  name: "Ghislain Konan",         position: "LB", club: "Gil Vicente",           startX: 18, startY: 75 },
  { id: 3206, teamId: 32, number: 4,  name: "Evan Ndicka",            position: "CB", club: "Roma",                  startX: 38, startY: 80 },
  { id: 3207, teamId: 32, number: 5,  name: "Odilon Kossounou",       position: "CB", club: "Atalanta",              startX: 62, startY: 80 },
  { id: 3208, teamId: 32, number: 13, name: "Emmanuel Agbadou",       position: "CB", club: "Beşiktaş" },
  { id: 3209, teamId: 32, number: 14, name: "Ousmane Diomande",       position: "CB", club: "Sporting CP" },
  { id: 3210, teamId: 32, number: 15, name: "Guela Doué",             position: "RB", club: "Strasbourg" },
  { id: 3211, teamId: 32, number: 22, name: "Clément Akpa",           position: "CB", club: "AJ Auxerre" },
  { id: 3212, teamId: 32, number: 6,  name: "Seko Fofana",            position: "DM", club: "Porto",                 startX: 50, startY: 60, isCaptain: true },
  { id: 3213, teamId: 32, number: 8,  name: "Franck Kessié",          position: "CM", club: "Al-Ahli",               startX: 35, startY: 55 },
  { id: 3214, teamId: 32, number: 10, name: "Ibrahim Sangaré",        position: "DM", club: "Nottingham Forest",     startX: 65, startY: 55 },
  { id: 3215, teamId: 32, number: 16, name: "Jean-Michaël Seri",      position: "CM", club: "Maribor" },
  { id: 3216, teamId: 32, number: 17, name: "Christ Inao Oulaï",      position: "CM", club: "Trabzonspor" },
  { id: 3217, teamId: 32, number: 18, name: "Parfait Guiagon",        position: "AM", club: "Charleroi" },
  { id: 3218, teamId: 32, number: 7,  name: "Simon Adingra",          position: "LW", club: "Monaco",                startX: 22, startY: 32 },
  { id: 3219, teamId: 32, number: 9,  name: "Evann Guessand",         position: "ST", club: "Crystal Palace",        startX: 50, startY: 18 },
  { id: 3220, teamId: 32, number: 11, name: "Amad Diallo",            position: "RW", club: "Manchester United",     startX: 78, startY: 32 },
  { id: 3221, teamId: 32, number: 19, name: "Ange-Yoan Bonny",        position: "ST", club: "Inter Milan" },
  { id: 3222, teamId: 32, number: 20, name: "Nicolas Pépé",           position: "RW", club: "Villarreal" },
  { id: 3223, teamId: 32, number: 21, name: "Bazoumana Touré",        position: "LW", club: "Hoffenheim" },
  { id: 3224, teamId: 32, number: 24, name: "Oumar Diakité",          position: "ST", club: "Cercle Brugge" },
  { id: 3225, teamId: 32, number: 25, name: "Yan Diomande",           position: "LW", club: "RB Leipzig" },
  { id: 3226, teamId: 32, number: 26, name: "Elye Wahi",              position: "ST", club: "Nice" },
];

// ─────────────────────────────────────────────────────────────────────────────
// New Zealand · Group G · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const NEW_ZEALAND: Player[] = [
  { id: 3901, teamId: 39, number: 1,  name: "Alex Paulsen",       position: "GK", club: "Lechia Gdańsk",         startX: 50, startY: 92 },
  { id: 3902, teamId: 39, number: 12, name: "Max Crocombe",       position: "GK", club: "Millwall" },
  { id: 3903, teamId: 39, number: 23, name: "Michael Woud",       position: "GK", club: "Auckland" },
  { id: 3904, teamId: 39, number: 2,  name: "Tim Payne",          position: "RB", club: "Wellington Phoenix",    startX: 82, startY: 75 },
  { id: 3905, teamId: 39, number: 3,  name: "Liberato Cacace",    position: "LB", club: "Wrexham",               startX: 18, startY: 75 },
  { id: 3906, teamId: 39, number: 4,  name: "Tyler Bindon",       position: "CB", club: "Nottingham Forest",     startX: 38, startY: 80 },
  { id: 3907, teamId: 39, number: 5,  name: "Michael Boxall",     position: "CB", club: "Minnesota United",      startX: 62, startY: 80 },
  { id: 3908, teamId: 39, number: 13, name: "Francis de Vries",   position: "LB", club: "Auckland" },
  { id: 3909, teamId: 39, number: 14, name: "Nando Pijnaker",     position: "CB", club: "Auckland FC" },
  { id: 3910, teamId: 39, number: 15, name: "Finn Surman",        position: "CB", club: "Portland Timbers" },
  { id: 3911, teamId: 39, number: 16, name: "Callan Elliot",      position: "RB", club: "Auckland" },
  { id: 3912, teamId: 39, number: 22, name: "Tommy Smith",        position: "CB", club: "Braintree Town",        isCaptain: true },
  { id: 3913, teamId: 39, number: 6,  name: "Joe Bell",           position: "CM", club: "Viking",                startX: 50, startY: 60 },
  { id: 3914, teamId: 39, number: 8,  name: "Marko Stamenić",     position: "CM", club: "Swansea",               startX: 35, startY: 55 },
  { id: 3915, teamId: 39, number: 10, name: "Alex Rufer",         position: "DM", club: "Wellington Phoenix" },
  { id: 3916, teamId: 39, number: 17, name: "Matt Garbett",       position: "AM", club: "Peterborough",          startX: 65, startY: 50 },
  { id: 3917, teamId: 39, number: 18, name: "Sarpreet Singh",     position: "AM", club: "Wellington Phoenix" },
  { id: 3918, teamId: 39, number: 19, name: "Ryan Thomas",        position: "AM", club: "PEC Zwolle" },
  { id: 3919, teamId: 39, number: 9,  name: "Chris Wood",         position: "ST", club: "Nottingham Forest",     startX: 50, startY: 18 },
  { id: 3920, teamId: 39, number: 7,  name: "Ben Old",            position: "LW", club: "Saint-Étienne",         startX: 22, startY: 32 },
  { id: 3921, teamId: 39, number: 11, name: "Kosta Barbarouses",  position: "RW", club: "Western Sydney",        startX: 78, startY: 32 },
  { id: 3922, teamId: 39, number: 20, name: "Eli Just",           position: "ST", club: "Motherwell" },
  { id: 3923, teamId: 39, number: 21, name: "Ben Waine",          position: "ST", club: "Port Vale" },
  { id: 3924, teamId: 39, number: 24, name: "Callum McCowatt",    position: "LW", club: "Silkeborg IF" },
  { id: 3925, teamId: 39, number: 25, name: "Jesse Randall",      position: "RW", club: "Auckland FC" },
  { id: 3926, teamId: 39, number: 26, name: "Lachlan Bayliss",    position: "ST", club: "Newcastle Jets" },
];

// ─────────────────────────────────────────────────────────────────────────────
// France · Group I · OFFICIAL (overrides preliminary in wc26-squads.ts)
// ─────────────────────────────────────────────────────────────────────────────
const FRANCE_OFFICIAL: Player[] = [
  { id: 1401, teamId: 14, number: 1,  name: "Mike Maignan",         position: "GK", club: "AC Milan",              startX: 50, startY: 92 },
  { id: 1402, teamId: 14, number: 16, name: "Brice Samba",          position: "GK", club: "Rennes" },
  { id: 1403, teamId: 14, number: 23, name: "Robin Risser",         position: "GK", club: "Lens" },
  { id: 1404, teamId: 14, number: 2,  name: "Jules Koundé",         position: "RB", club: "Barcelona",             startX: 82, startY: 75 },
  { id: 1405, teamId: 14, number: 3,  name: "Theo Hernández",       position: "LB", club: "Al-Hilal",              startX: 18, startY: 75 },
  { id: 1406, teamId: 14, number: 4,  name: "Dayot Upamecano",      position: "CB", club: "Bayern Munich",         startX: 62, startY: 80 },
  { id: 1407, teamId: 14, number: 17, name: "William Saliba",       position: "CB", club: "Arsenal",               startX: 38, startY: 80 },
  { id: 1409, teamId: 14, number: 21, name: "Ibrahima Konaté",      position: "CB", club: "Liverpool" },
  { id: 1410, teamId: 14, number: 14, name: "Maxence Lacroix",      position: "CB", club: "Crystal Palace" },
  { id: 1411, teamId: 14, number: 22, name: "Lucas Digne",          position: "LB", club: "Aston Villa" },
  { id: 1412, teamId: 14, number: 24, name: "Lucas Hernández",      position: "CB", club: "Paris Saint-Germain" },
  { id: 1413, teamId: 14, number: 25, name: "Malo Gusto",           position: "RB", club: "Chelsea" },
  { id: 1414, teamId: 14, number: 6,  name: "Eduardo Camavinga",    position: "CM", club: "Real Madrid",           startX: 35, startY: 55 },
  { id: 1415, teamId: 14, number: 8,  name: "Aurélien Tchouaméni",  position: "DM", club: "Real Madrid",           startX: 50, startY: 62 },
  { id: 1416, teamId: 14, number: 13, name: "N'Golo Kanté",         position: "DM", club: "Fenerbahçe" },
  { id: 1417, teamId: 14, number: 15, name: "Manu Koné",            position: "CM", club: "Roma" },
  { id: 1418, teamId: 14, number: 18, name: "Warren Zaïre-Emery",   position: "CM", club: "Paris Saint-Germain",   startX: 65, startY: 55 },
  { id: 1419, teamId: 14, number: 26, name: "Adrien Rabiot",        position: "CM", club: "AC Milan" },
  { id: 1420, teamId: 14, number: 7,  name: "Désiré Doué",          position: "AM", club: "Paris Saint-Germain" },
  { id: 1421, teamId: 14, number: 9,  name: "Marcus Thuram",        position: "ST", club: "Inter Milan" },
  { id: 1422, teamId: 14, number: 10, name: "Kylian Mbappé",        position: "ST", club: "Real Madrid",           startX: 50, startY: 18, isCaptain: true },
  { id: 1423, teamId: 14, number: 11, name: "Ousmane Dembélé",      position: "RW", club: "Paris Saint-Germain",   startX: 78, startY: 30 },
  { id: 1424, teamId: 14, number: 12, name: "Maghnes Akliouche",    position: "RW", club: "AS Monaco" },
  { id: 1425, teamId: 14, number: 19, name: "Bradley Barcola",      position: "LW", club: "Paris Saint-Germain",   startX: 22, startY: 30 },
  { id: 1426, teamId: 14, number: 20, name: "Michael Olise",        position: "RW", club: "Bayern Munich" },
  { id: 1427, teamId: 14, number: 27, name: "Rayan Cherki",         position: "AM", club: "Manchester City" },
  { id: 1428, teamId: 14, number: 28, name: "Jean-Philippe Mateta", position: "ST", club: "Crystal Palace" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Austria · Group J · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const AUSTRIA: Player[] = [
  { id: 5601, teamId: 56, number: 1,  name: "Alexander Schlager",     position: "GK", club: "Red Bull Salzburg",     startX: 50, startY: 92 },
  { id: 5602, teamId: 56, number: 12, name: "Patrick Pentz",          position: "GK", club: "Brøndby" },
  { id: 5603, teamId: 56, number: 23, name: "Florian Wiegele",        position: "GK", club: "Viktoria Plzeň" },
  { id: 5604, teamId: 56, number: 2,  name: "Stefan Posch",           position: "RB", club: "Como",                  startX: 82, startY: 75 },
  { id: 5605, teamId: 56, number: 3,  name: "Phillipp Mwene",         position: "LB", club: "Mainz",                 startX: 18, startY: 75 },
  { id: 5606, teamId: 56, number: 4,  name: "Kevin Danso",            position: "CB", club: "Tottenham",             startX: 38, startY: 80 },
  { id: 5607, teamId: 56, number: 5,  name: "Philipp Lienhart",       position: "CB", club: "Freiburg" },
  { id: 5608, teamId: 56, number: 15, name: "David Alaba",            position: "CB", club: "Real Madrid",           startX: 62, startY: 80, isCaptain: true },
  { id: 5609, teamId: 56, number: 16, name: "Marco Friedl",           position: "CB", club: "Werder Bremen" },
  { id: 5610, teamId: 56, number: 22, name: "Michael Svoboda",        position: "CB", club: "Venezia" },
  { id: 5611, teamId: 56, number: 24, name: "Alexander Prass",        position: "LB", club: "Hoffenheim" },
  { id: 5612, teamId: 56, number: 25, name: "David Affengruber",      position: "CB", club: "Elche" },
  { id: 5613, teamId: 56, number: 6,  name: "Nicolas Seiwald",        position: "DM", club: "RB Leipzig",            startX: 50, startY: 62 },
  { id: 5614, teamId: 56, number: 8,  name: "Konrad Laimer",          position: "CM", club: "Bayern Munich",         startX: 35, startY: 55 },
  { id: 5615, teamId: 56, number: 10, name: "Marcel Sabitzer",        position: "AM", club: "Borussia Dortmund",     startX: 65, startY: 50 },
  { id: 5616, teamId: 56, number: 14, name: "Xaver Schlager",         position: "DM", club: "RB Leipzig" },
  { id: 5617, teamId: 56, number: 17, name: "Florian Grillitsch",     position: "CM", club: "Braga" },
  { id: 5618, teamId: 56, number: 18, name: "Romano Schmid",          position: "AM", club: "Werder Bremen" },
  { id: 5619, teamId: 56, number: 19, name: "Christoph Baumgartner",  position: "AM", club: "Hoffenheim" },
  { id: 5620, teamId: 56, number: 20, name: "Patrick Wimmer",         position: "LW", club: "VfL Wolfsburg" },
  { id: 5621, teamId: 56, number: 21, name: "Carney Chukwuemeka",     position: "CM", club: "Borussia Dortmund" },
  { id: 5622, teamId: 56, number: 26, name: "Paul Wanner",            position: "AM", club: "PSV Eindhoven" },
  { id: 5623, teamId: 56, number: 27, name: "Alessandro Schopf",      position: "CM", club: "Wolfsberger" },
  { id: 5624, teamId: 56, number: 7,  name: "Marko Arnautović",       position: "ST", club: "Red Star Belgrade",     startX: 50, startY: 18 },
  { id: 5625, teamId: 56, number: 9,  name: "Michael Gregoritsch",    position: "ST", club: "Brøndby" },
  { id: 5626, teamId: 56, number: 11, name: "Sasa Kalajdzic",         position: "ST", club: "Wolverhampton" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Portugal · Group K · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const PORTUGAL: Player[] = [
  { id: 1801, teamId: 18, number: 1,  name: "Diogo Costa",         position: "GK", club: "FC Porto",              startX: 50, startY: 92 },
  { id: 1802, teamId: 18, number: 12, name: "José Sá",             position: "GK", club: "Wolverhampton" },
  { id: 1803, teamId: 18, number: 22, name: "Rui Silva",           position: "GK", club: "Sporting CP" },
  { id: 1804, teamId: 18, number: 23, name: "Ricardo Velho",       position: "GK", club: "Gençlerbirliği" },
  { id: 1805, teamId: 18, number: 2,  name: "Diogo Dalot",         position: "RB", club: "Manchester United",     startX: 82, startY: 75 },
  { id: 1806, teamId: 18, number: 3,  name: "Rúben Dias",          position: "CB", club: "Manchester City",       startX: 38, startY: 80 },
  { id: 1807, teamId: 18, number: 4,  name: "Gonçalo Inácio",      position: "CB", club: "Sporting CP",           startX: 62, startY: 80 },
  { id: 1808, teamId: 18, number: 5,  name: "Nuno Mendes",         position: "LB", club: "Paris Saint-Germain",   startX: 18, startY: 75 },
  { id: 1809, teamId: 18, number: 13, name: "Renato Veiga",        position: "CB", club: "Villarreal" },
  { id: 1810, teamId: 18, number: 14, name: "João Cancelo",        position: "LB", club: "Barcelona" },
  { id: 1811, teamId: 18, number: 15, name: "Nélson Semedo",       position: "RB", club: "Fenerbahçe" },
  { id: 1812, teamId: 18, number: 19, name: "Matheus Nunes",       position: "RB", club: "Manchester City" },
  { id: 1813, teamId: 18, number: 24, name: "Tomás Araújo",        position: "CB", club: "SL Benfica" },
  { id: 1814, teamId: 18, number: 6,  name: "João Neves",          position: "DM", club: "Paris Saint-Germain",   startX: 50, startY: 62 },
  { id: 1815, teamId: 18, number: 8,  name: "Bruno Fernandes",     position: "AM", club: "Manchester United",     startX: 65, startY: 50 },
  { id: 1816, teamId: 18, number: 10, name: "Bernardo Silva",      position: "AM", club: "Manchester City",       startX: 35, startY: 50 },
  { id: 1817, teamId: 18, number: 16, name: "Vitinha",             position: "CM", club: "Paris Saint-Germain" },
  { id: 1818, teamId: 18, number: 18, name: "Rúben Neves",         position: "DM", club: "Al-Hilal" },
  { id: 1819, teamId: 18, number: 25, name: "Samuel Costa",        position: "CM", club: "Mallorca" },
  { id: 1820, teamId: 18, number: 7,  name: "Cristiano Ronaldo",   position: "ST", club: "Al-Nassr",              startX: 50, startY: 18, isCaptain: true },
  { id: 1821, teamId: 18, number: 9,  name: "Gonçalo Ramos",       position: "ST", club: "Paris Saint-Germain" },
  { id: 1822, teamId: 18, number: 11, name: "João Félix",          position: "AM", club: "Al-Nassr" },
  { id: 1823, teamId: 18, number: 17, name: "Rafael Leão",         position: "LW", club: "AC Milan",              startX: 22, startY: 30 },
  { id: 1824, teamId: 18, number: 20, name: "Pedro Neto",          position: "LW", club: "Chelsea" },
  { id: 1825, teamId: 18, number: 21, name: "Francisco Conceição", position: "RW", club: "Juventus",              startX: 78, startY: 30 },
  { id: 1826, teamId: 18, number: 26, name: "Francisco Trincão",   position: "RW", club: "Sporting CP" },
  { id: 1827, teamId: 18, number: 27, name: "Gonçalo Guedes",      position: "AM", club: "Real Sociedad" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DR Congo · Group K · OFFICIAL
// ─────────────────────────────────────────────────────────────────────────────
const DR_CONGO: Player[] = [
  { id: 5701, teamId: 57, number: 1,  name: "Lionel Mpasi",        position: "GK", club: "Le Havre",              startX: 50, startY: 92 },
  { id: 5702, teamId: 57, number: 12, name: "Matthieu Epolo",      position: "GK", club: "Standard Liège" },
  { id: 5703, teamId: 57, number: 23, name: "Timothy Fayulu",      position: "GK", club: "Noah" },
  { id: 5704, teamId: 57, number: 2,  name: "Aaron Wan-Bissaka",   position: "RB", club: "West Ham",              startX: 82, startY: 75 },
  { id: 5705, teamId: 57, number: 3,  name: "Arthur Masuaku",      position: "LB", club: "Lens",                  startX: 18, startY: 75 },
  { id: 5706, teamId: 57, number: 4,  name: "Chancel Mbemba",      position: "CB", club: "Lille",                 startX: 38, startY: 80, isCaptain: true },
  { id: 5707, teamId: 57, number: 5,  name: "Axel Tuanzebe",       position: "CB", club: "Burnley",               startX: 62, startY: 80 },
  { id: 5708, teamId: 57, number: 13, name: "Dylan Batubinsika",   position: "CB", club: "Larisa" },
  { id: 5709, teamId: 57, number: 14, name: "Gedeon Kalulu",       position: "RB", club: "Aris Limassol" },
  { id: 5710, teamId: 57, number: 15, name: "Steve Kapuadi",       position: "CB", club: "Widzew Łódź" },
  { id: 5711, teamId: 57, number: 16, name: "Joris Kayembe",       position: "LB", club: "Racing Genk" },
  { id: 5712, teamId: 57, number: 22, name: "Rocky Bushiri",       position: "CB", club: "Hibernian" },
  { id: 5713, teamId: 57, number: 6,  name: "Samuel Moutoussamy",  position: "DM", club: "Atromitos",             startX: 50, startY: 62 },
  { id: 5714, teamId: 57, number: 8,  name: "Edo Kayembe",         position: "CM", club: "Watford",               startX: 35, startY: 55 },
  { id: 5715, teamId: 57, number: 10, name: "Noah Sadiki",         position: "CM", club: "Sunderland",            startX: 65, startY: 55 },
  { id: 5716, teamId: 57, number: 17, name: "Gaël Kakuta",         position: "AM", club: "Larisa" },
  { id: 5717, teamId: 57, number: 18, name: "Charles Pickel",      position: "DM", club: "Espanyol" },
  { id: 5718, teamId: 57, number: 19, name: "Ngal'ayel Mukau",     position: "CM", club: "Lille" },
  { id: 5719, teamId: 57, number: 20, name: "Théo Bongonda",       position: "AM", club: "Spartak Moscow" },
  { id: 5720, teamId: 57, number: 24, name: "Brian Cipenga",       position: "CM", club: "Castellón" },
  { id: 5721, teamId: 57, number: 25, name: "Nathanael Mbuku",     position: "AM", club: "Montpellier" },
  { id: 5722, teamId: 57, number: 26, name: "Meshack Elia",        position: "AM", club: "Alanyaspor" },
  { id: 5723, teamId: 57, number: 7,  name: "Yoane Wissa",         position: "ST", club: "Newcastle",             startX: 50, startY: 18 },
  { id: 5724, teamId: 57, number: 9,  name: "Cédric Bakambu",      position: "ST", club: "Real Betis" },
  { id: 5725, teamId: 57, number: 11, name: "Fiston Mayele",       position: "ST", club: "Pyramids",              startX: 78, startY: 30 },
  { id: 5726, teamId: 57, number: 21, name: "Simon Banza",         position: "ST", club: "Al-Jazira",             startX: 22, startY: 30 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Mexico · Group A · PRELIMINARY (subset of 55-man pool, likely starters)
// ─────────────────────────────────────────────────────────────────────────────
const MEXICO: Player[] = [
  { id: 101,  teamId: 1,  number: 1,  name: "Guillermo Ochoa",     position: "GK", club: "AEL Limassol",          startX: 50, startY: 92 },
  { id: 102,  teamId: 1,  number: 12, name: "Carlos Acevedo",      position: "GK", club: "Santos Laguna" },
  { id: 103,  teamId: 1,  number: 13, name: "Raúl Rangel",         position: "GK", club: "Chivas" },
  { id: 104,  teamId: 1,  number: 23, name: "Alex Padilla",        position: "GK", club: "Athletic Club" },
  { id: 105,  teamId: 1,  number: 2,  name: "Jorge Sánchez",       position: "RB", club: "PAOK",                  startX: 82, startY: 75 },
  { id: 106,  teamId: 1,  number: 3,  name: "Jesús Gallardo",      position: "LB", club: "Toluca",                startX: 18, startY: 75 },
  { id: 107,  teamId: 1,  number: 4,  name: "Edson Álvarez",       position: "DM", club: "Fenerbahçe",            startX: 50, startY: 62, isCaptain: true },
  { id: 108,  teamId: 1,  number: 5,  name: "Johan Vásquez",       position: "CB", club: "Genoa",                 startX: 38, startY: 80 },
  { id: 109,  teamId: 1,  number: 14, name: "César Montes",        position: "CB", club: "Lokomotiv Moscow",      startX: 62, startY: 80 },
  { id: 110,  teamId: 1,  number: 15, name: "Israel Reyes",        position: "CB", club: "América" },
  { id: 111,  teamId: 1,  number: 16, name: "Julián Araujo",       position: "RB", club: "Celtic" },
  { id: 112,  teamId: 1,  number: 17, name: "Mateo Chávez",        position: "LB", club: "AZ Alkmaar" },
  { id: 113,  teamId: 1,  number: 6,  name: "Erik Lira",           position: "CM", club: "Cruz Azul",             startX: 35, startY: 55 },
  { id: 114,  teamId: 1,  number: 7,  name: "Luis Romo",           position: "CM", club: "Chivas" },
  { id: 115,  teamId: 1,  number: 8,  name: "Carlos Rodríguez",    position: "CM", club: "Cruz Azul",             startX: 65, startY: 55 },
  { id: 116,  teamId: 1,  number: 10, name: "Álvaro Fidalgo",      position: "AM", club: "Real Betis" },
  { id: 117,  teamId: 1,  number: 18, name: "Orbelín Pineda",      position: "AM", club: "AEK Athens" },
  { id: 118,  teamId: 1,  number: 19, name: "Luis Chávez",         position: "CM", club: "Dinamo Moscow" },
  { id: 119,  teamId: 1,  number: 20, name: "Gilberto Mora",       position: "AM", club: "Tijuana" },
  { id: 120,  teamId: 1,  number: 21, name: "Marcel Ruiz",         position: "CM", club: "Toluca" },
  { id: 121,  teamId: 1,  number: 9,  name: "Raúl Jiménez",        position: "ST", club: "Fulham",                startX: 50, startY: 18 },
  { id: 122,  teamId: 1,  number: 11, name: "Santiago Giménez",    position: "ST", club: "AC Milan" },
  { id: 123,  teamId: 1,  number: 22, name: "Alexis Vega",         position: "LW", club: "Toluca",                startX: 22, startY: 32 },
  { id: 124,  teamId: 1,  number: 24, name: "Roberto Alvarado",    position: "RW", club: "Chivas",                startX: 78, startY: 32 },
  { id: 125,  teamId: 1,  number: 25, name: "César Huerta",        position: "LW", club: "Anderlecht" },
  { id: 126,  teamId: 1,  number: 26, name: "Julián Quiñones",     position: "ST", club: "Al-Qadisiyah" },
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
