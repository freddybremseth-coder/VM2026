/**
 * Wave 4 — the final 14 announced squads (May 2026 announcements).
 *
 * Data sources:
 *   - South Africa (48) + Canada (5): Wikipedia (2026 FIFA World Cup squads)
 *     — full data with shirt number, age, caps, goals, captain.
 *   - All others: ESPN / Yahoo Sports aggregator articles — name + broad
 *     position + club only. Shirt numbers, ages and caps weren't published
 *     in those aggregators, so number is 0 and age/caps/goals are omitted.
 *
 * Position mapping for ESPN/Yahoo data:
 *   GK → GK,  DF → CB (default),  MF → CM (default),  FW → ST (default).
 * Players won't have startX/startY so they live in the bench list, not on
 * the formation pitch. When a finer-grained source becomes available, the
 * data can be enriched without changing the file's shape.
 */

import type { Player } from "./wc26-squads";

// ─────────────────────────────────────────────────────────────────────────────
// 48 — South Africa (Wikipedia, full data)
// ─────────────────────────────────────────────────────────────────────────────
const SOUTH_AFRICA: Player[] = [
  { id: 4801, teamId: 48, number: 1,  name: "Ronwen Williams",      position: "GK", club: "Mamelodi Sundowns", age: 34, caps: 62, goals: 0,  isCaptain: true },
  { id: 4802, teamId: 48, number: 2,  name: "Thabang Matuludi",     position: "CB", club: "Polokwane City",    age: 27, caps: 2,  goals: 0 },
  { id: 4803, teamId: 48, number: 3,  name: "Khulumani Ndamane",    position: "CB", club: "Mamelodi Sundowns", age: 22, caps: 5,  goals: 0 },
  { id: 4804, teamId: 48, number: 4,  name: "Teboho Mokoena",       position: "CM", club: "Mamelodi Sundowns", age: 29, caps: 51, goals: 9 },
  { id: 4805, teamId: 48, number: 5,  name: "Thalente Mbatha",      position: "CM", club: "Orlando Pirates",   age: 26, caps: 14, goals: 3 },
  { id: 4806, teamId: 48, number: 6,  name: "Aubrey Modiba",        position: "LB", club: "Mamelodi Sundowns", age: 30, caps: 44, goals: 3 },
  { id: 4807, teamId: 48, number: 7,  name: "Oswin Appollis",       position: "LW", club: "Orlando Pirates",   age: 24, caps: 25, goals: 8 },
  { id: 4808, teamId: 48, number: 8,  name: "Tshepang Moremi",      position: "RW", club: "Orlando Pirates",   age: 25, caps: 9,  goals: 1 },
  { id: 4809, teamId: 48, number: 9,  name: "Lyle Foster",          position: "ST", club: "Burnley",           age: 25, caps: 26, goals: 10 },
  { id: 4810, teamId: 48, number: 10, name: "Relebohile Mofokeng",  position: "LW", club: "Orlando Pirates",   age: 21, caps: 12, goals: 0 },
  { id: 4811, teamId: 48, number: 11, name: "Themba Zwane",         position: "AM", club: "Mamelodi Sundowns", age: 36, caps: 53, goals: 12 },
  { id: 4812, teamId: 48, number: 12, name: "Thapelo Maseko",       position: "RW", club: "AEL Limassol",      age: 22, caps: 9,  goals: 1 },
  { id: 4813, teamId: 48, number: 13, name: "Sphephelo Sithole",    position: "DM", club: "Tondela",           age: 27, caps: 27, goals: 1 },
  { id: 4814, teamId: 48, number: 14, name: "Mbekezeli Mbokazi",    position: "CB", club: "Chicago Fire FC",   age: 20, caps: 10, goals: 1 },
  { id: 4815, teamId: 48, number: 15, name: "Iqraam Rayners",       position: "ST", club: "Mamelodi Sundowns", age: 30, caps: 13, goals: 4 },
  { id: 4816, teamId: 48, number: 16, name: "Sipho Chaine",         position: "GK", club: "Orlando Pirates",   age: 29, caps: 3,  goals: 0 },
  { id: 4817, teamId: 48, number: 17, name: "Evidence Makgopa",     position: "ST", club: "Orlando Pirates",   age: 26, caps: 26, goals: 6 },
  { id: 4818, teamId: 48, number: 18, name: "Samukele Kabini",      position: "CB", club: "Molde",             age: 22, caps: 5,  goals: 0 },
  { id: 4819, teamId: 48, number: 19, name: "Nkosinathi Sibisi",    position: "CB", club: "Orlando Pirates",   age: 30, caps: 19, goals: 0 },
  { id: 4820, teamId: 48, number: 20, name: "Khuliso Mudau",        position: "RB", club: "Mamelodi Sundowns", age: 31, caps: 32, goals: 1 },
  { id: 4821, teamId: 48, number: 21, name: "Ime Okon",             position: "CB", club: "Hannover 96",       age: 22, caps: 7,  goals: 1 },
  { id: 4822, teamId: 48, number: 22, name: "Ricardo Goss",         position: "GK", club: "Siwelele",          age: 32, caps: 4,  goals: 0 },
  { id: 4823, teamId: 48, number: 23, name: "Jayden Adams",         position: "CM", club: "Mamelodi Sundowns", age: 25, caps: 4,  goals: 0 },
  { id: 4824, teamId: 48, number: 24, name: "Olwethu Makhanya",     position: "CB", club: "Philadelphia Union",age: 22, caps: 0,  goals: 0 },
  { id: 4825, teamId: 48, number: 25, name: "Kamogelo Sebelebele",  position: "RW", club: "Orlando Pirates",   age: 23, caps: 2,  goals: 0 },
  { id: 4826, teamId: 48, number: 26, name: "Bradley Cross",        position: "LB", club: "Kaizer Chiefs",     age: 25, caps: 0,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5 — Canada (Wikipedia; player #26 not captured in the fetched snippet)
// ─────────────────────────────────────────────────────────────────────────────
const CANADA: Player[] = [
  { id: 501,  teamId: 5,  number: 1,  name: "Dayne St. Clair",     position: "GK", club: "Inter Miami CF",         age: 29, caps: 20, goals: 0 },
  { id: 502,  teamId: 5,  number: 2,  name: "Alistair Johnston",   position: "RB", club: "Celtic",                  age: 27, caps: 57, goals: 1 },
  { id: 503,  teamId: 5,  number: 3,  name: "Alfie Jones",         position: "CB", club: "Middlesbrough",           age: 28, caps: 2,  goals: 0 },
  { id: 504,  teamId: 5,  number: 4,  name: "Luc de Fougerolles",  position: "CB", club: "Dender",                  age: 20, caps: 12, goals: 0 },
  { id: 505,  teamId: 5,  number: 5,  name: "Joel Waterman",       position: "CB", club: "Chicago Fire FC",         age: 30, caps: 17, goals: 0 },
  { id: 506,  teamId: 5,  number: 6,  name: "Mathieu Choinière",   position: "CM", club: "Los Angeles FC",          age: 27, caps: 23, goals: 0 },
  { id: 507,  teamId: 5,  number: 7,  name: "Stephen Eustáquio",   position: "DM", club: "Los Angeles FC",          age: 29, caps: 55, goals: 4 },
  { id: 508,  teamId: 5,  number: 8,  name: "Ismaël Koné",         position: "CM", club: "Sassuolo",                age: 23, caps: 39, goals: 4 },
  { id: 509,  teamId: 5,  number: 9,  name: "Cyle Larin",          position: "ST", club: "Southampton",             age: 31, caps: 89, goals: 30 },
  { id: 510,  teamId: 5,  number: 10, name: "Jonathan David",      position: "ST", club: "Juventus",                age: 26, caps: 76, goals: 39 },
  { id: 511,  teamId: 5,  number: 11, name: "Liam Millar",         position: "LW", club: "Hull City",               age: 26, caps: 40, goals: 1 },
  { id: 512,  teamId: 5,  number: 12, name: "Tani Oluwaseyi",      position: "ST", club: "Villarreal",              age: 26, caps: 23, goals: 2 },
  { id: 513,  teamId: 5,  number: 13, name: "Derek Cornelius",     position: "CB", club: "Rangers",                 age: 28, caps: 43, goals: 1 },
  { id: 514,  teamId: 5,  number: 14, name: "Jacob Shaffelburg",   position: "LW", club: "Los Angeles FC",          age: 26, caps: 31, goals: 6 },
  { id: 515,  teamId: 5,  number: 15, name: "Moïse Bombito",       position: "CB", club: "Nice",                    age: 26, caps: 20, goals: 0 },
  { id: 516,  teamId: 5,  number: 16, name: "Maxime Crépeau",      position: "GK", club: "Orlando City SC",         age: 32, caps: 31, goals: 0 },
  { id: 517,  teamId: 5,  number: 17, name: "Tajon Buchanan",      position: "RW", club: "Villarreal",              age: 27, caps: 59, goals: 8 },
  { id: 518,  teamId: 5,  number: 18, name: "Owen Goodman",        position: "GK", club: "Barnsley",                age: 22, caps: 0,  goals: 0 },
  { id: 519,  teamId: 5,  number: 19, name: "Alphonso Davies",     position: "LB", club: "Bayern Munich",           age: 25, caps: 58, goals: 15, isCaptain: true },
  { id: 520,  teamId: 5,  number: 20, name: "Ali Ahmed",           position: "LW", club: "Norwich City",            age: 25, caps: 24, goals: 1 },
  { id: 521,  teamId: 5,  number: 21, name: "Jonathan Osorio",     position: "CM", club: "Toronto FC",              age: 33, caps: 90, goals: 10 },
  { id: 522,  teamId: 5,  number: 22, name: "Richie Laryea",       position: "RB", club: "Toronto FC",              age: 31, caps: 74, goals: 1 },
  { id: 523,  teamId: 5,  number: 23, name: "Niko Sigur",          position: "RB", club: "Hajduk Split",            age: 22, caps: 18, goals: 2 },
  { id: 524,  teamId: 5,  number: 24, name: "Promise David",       position: "ST", club: "Union Saint-Gilloise",    age: 24, caps: 9,  goals: 3 },
  { id: 525,  teamId: 5,  number: 25, name: "Nathan Saliba",       position: "CM", club: "Anderlecht",              age: 22, caps: 14, goals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 12 — Morocco (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const MOROCCO: Player[] = [
  { id: 1201, teamId: 12, number: 0, name: "Yassine Bounou",          position: "GK", club: "Al Hilal" },
  { id: 1202, teamId: 12, number: 0, name: "Munir El Kajoui",         position: "GK", club: "RS Berkane" },
  { id: 1203, teamId: 12, number: 0, name: "Reda Tagnaouti",          position: "GK", club: "AS Far" },
  { id: 1204, teamId: 12, number: 0, name: "Noussair Mazraoui",       position: "RB", club: "Manchester United" },
  { id: 1205, teamId: 12, number: 0, name: "Anass Salah-Eddine",      position: "LB", club: "PSV Eindhoven" },
  { id: 1206, teamId: 12, number: 0, name: "Youssef Belammari",       position: "CB", club: "Al Ahly" },
  { id: 1207, teamId: 12, number: 0, name: "Achraf Hakimi",           position: "RB", club: "Paris Saint-Germain", isCaptain: true },
  { id: 1208, teamId: 12, number: 0, name: "Zakaria El Ouahdi",       position: "RB", club: "Racing Genk" },
  { id: 1209, teamId: 12, number: 0, name: "Chadi Riad",              position: "CB", club: "Crystal Palace" },
  { id: 1210, teamId: 12, number: 0, name: "Nayef Aguerd",            position: "CB", club: "Marseille" },
  { id: 1211, teamId: 12, number: 0, name: "Redouane Halhal",         position: "CB", club: "KV Mechelen" },
  { id: 1212, teamId: 12, number: 0, name: "Issa Diop",               position: "CB", club: "Fulham" },
  { id: 1213, teamId: 12, number: 0, name: "Samir El Mourabet",       position: "CM", club: "Strasbourg" },
  { id: 1214, teamId: 12, number: 0, name: "Ayyoub Bouaddi",          position: "CM", club: "Lille" },
  { id: 1215, teamId: 12, number: 0, name: "Neil El Aynaoui",         position: "CM", club: "AS Roma" },
  { id: 1216, teamId: 12, number: 0, name: "Sofyan Amrabat",          position: "DM", club: "Real Betis" },
  { id: 1217, teamId: 12, number: 0, name: "Azzedine Ounahi",         position: "CM", club: "Girona" },
  { id: 1218, teamId: 12, number: 0, name: "Bilal El Khannouss",      position: "AM", club: "Stuttgart" },
  { id: 1219, teamId: 12, number: 0, name: "Ismael Saibari",          position: "AM", club: "PSV Eindhoven" },
  { id: 1220, teamId: 12, number: 0, name: "Abde Ezzalzouli",         position: "LW", club: "Real Betis" },
  { id: 1221, teamId: 12, number: 0, name: "Chemsdine Talbi",         position: "RW", club: "Sunderland" },
  { id: 1222, teamId: 12, number: 0, name: "Soufiane Rahimi",         position: "ST", club: "Al Ain" },
  { id: 1223, teamId: 12, number: 0, name: "Ayoub El Kaabi",          position: "ST", club: "Olympiacos" },
  { id: 1224, teamId: 12, number: 0, name: "Brahim Díaz",             position: "AM", club: "Real Madrid" },
  { id: 1225, teamId: 12, number: 0, name: "Gessime Yassine",         position: "LW", club: "Strasbourg" },
  { id: 1226, teamId: 12, number: 0, name: "Ayoube Amaimouni",        position: "ST", club: "Eintracht Frankfurt" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 9 — USA (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const USA: Player[] = [
  { id: 901,  teamId: 9, number: 0, name: "Chris Brady",         position: "GK", club: "Chicago Fire" },
  { id: 902,  teamId: 9, number: 0, name: "Matt Freese",         position: "GK", club: "New York City FC" },
  { id: 903,  teamId: 9, number: 0, name: "Matt Turner",         position: "GK", club: "New England Revolution" },
  { id: 904,  teamId: 9, number: 0, name: "Max Arfsten",         position: "LB", club: "Columbus Crew" },
  { id: 905,  teamId: 9, number: 0, name: "Sergiño Dest",        position: "RB", club: "PSV Eindhoven" },
  { id: 906,  teamId: 9, number: 0, name: "Alex Freeman",        position: "RB", club: "Villarreal" },
  { id: 907,  teamId: 9, number: 0, name: "Mark McKenzie",       position: "CB", club: "Toulouse" },
  { id: 908,  teamId: 9, number: 0, name: "Tim Ream",            position: "CB", club: "Charlotte FC" },
  { id: 909,  teamId: 9, number: 0, name: "Chris Richards",      position: "CB", club: "Crystal Palace" },
  { id: 910,  teamId: 9, number: 0, name: "Antonee Robinson",    position: "LB", club: "Fulham" },
  { id: 911,  teamId: 9, number: 0, name: "Miles Robinson",      position: "CB", club: "FC Cincinnati" },
  { id: 912,  teamId: 9, number: 0, name: "Joe Scally",          position: "RB", club: "Borussia Mönchengladbach" },
  { id: 913,  teamId: 9, number: 0, name: "Auston Trusty",       position: "CB", club: "Celtic" },
  { id: 914,  teamId: 9, number: 0, name: "Tyler Adams",         position: "DM", club: "AFC Bournemouth", isCaptain: true },
  { id: 915,  teamId: 9, number: 0, name: "Sebastian Berhalter", position: "CM", club: "Vancouver Whitecaps" },
  { id: 916,  teamId: 9, number: 0, name: "Weston McKennie",     position: "CM", club: "Juventus" },
  { id: 917,  teamId: 9, number: 0, name: "Cristian Roldan",     position: "CM", club: "Seattle Sounders" },
  { id: 918,  teamId: 9, number: 0, name: "Brenden Aaronson",    position: "AM", club: "Leeds United" },
  { id: 919,  teamId: 9, number: 0, name: "Malik Tillman",       position: "AM", club: "Bayer Leverkusen" },
  { id: 920,  teamId: 9, number: 0, name: "Tim Weah",            position: "RW", club: "Marseille" },
  { id: 921,  teamId: 9, number: 0, name: "Alejandro Zendejas",  position: "RW", club: "Club América" },
  { id: 922,  teamId: 9, number: 0, name: "Christian Pulisic",   position: "LW", club: "AC Milan" },
  { id: 923,  teamId: 9, number: 0, name: "Gio Reyna",           position: "AM", club: "Borussia Mönchengladbach" },
  { id: 924,  teamId: 9, number: 0, name: "Folarin Balogun",     position: "ST", club: "AS Monaco" },
  { id: 925,  teamId: 9, number: 0, name: "Ricardo Pepi",        position: "ST", club: "PSV Eindhoven" },
  { id: 926,  teamId: 9, number: 0, name: "Haji Wright",         position: "ST", club: "Coventry City" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 15 — Australia (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const AUSTRALIA: Player[] = [
  { id: 1501, teamId: 15, number: 0, name: "Mathew Ryan",          position: "GK", club: "Levante", isCaptain: true },
  { id: 1502, teamId: 15, number: 0, name: "Paul Izzo",            position: "GK", club: "Randers FC" },
  { id: 1503, teamId: 15, number: 0, name: "Patrick Beach",        position: "GK", club: "Melbourne City" },
  { id: 1504, teamId: 15, number: 0, name: "Jordan Bos",           position: "LB", club: "Feyenoord Rotterdam" },
  { id: 1505, teamId: 15, number: 0, name: "Aziz Behich",          position: "LB", club: "Melbourne City" },
  { id: 1506, teamId: 15, number: 0, name: "Harry Souttar",        position: "CB", club: "Leicester City" },
  { id: 1507, teamId: 15, number: 0, name: "Alessandro Circati",   position: "CB", club: "Parma" },
  { id: 1508, teamId: 15, number: 0, name: "Lucas Herrington",     position: "CB", club: "Colorado Rapids" },
  { id: 1509, teamId: 15, number: 0, name: "Cameron Burgess",      position: "CB", club: "Swansea City" },
  { id: 1510, teamId: 15, number: 0, name: "Kai Trewin",           position: "RB", club: "New York City FC" },
  { id: 1511, teamId: 15, number: 0, name: "Milos Degenek",        position: "CB", club: "Apoel Nicosia" },
  { id: 1512, teamId: 15, number: 0, name: "Jason Geria",          position: "RB", club: "Albirex Niigata" },
  { id: 1513, teamId: 15, number: 0, name: "Jacob Italiano",       position: "LB", club: "Grazer AK" },
  { id: 1514, teamId: 15, number: 0, name: "Jackson Irvine",       position: "CM", club: "St. Pauli" },
  { id: 1515, teamId: 15, number: 0, name: "Aiden O'Neill",        position: "DM", club: "New York City FC" },
  { id: 1516, teamId: 15, number: 0, name: "Paul Okon Jr",         position: "CM", club: "Sydney FC" },
  { id: 1517, teamId: 15, number: 0, name: "Cameron Devlin",       position: "CM", club: "Heart of Midlothian" },
  { id: 1518, teamId: 15, number: 0, name: "Connor Metcalfe",      position: "AM", club: "St. Pauli" },
  { id: 1519, teamId: 15, number: 0, name: "Mathew Leckie",        position: "RW", club: "Melbourne City" },
  { id: 1520, teamId: 15, number: 0, name: "Nishan Velupillay",    position: "LW", club: "Melbourne Victory" },
  { id: 1521, teamId: 15, number: 0, name: "Cristian Volpato",     position: "AM", club: "Sassuolo" },
  { id: 1522, teamId: 15, number: 0, name: "Nestory Irankunda",    position: "RW", club: "Watford" },
  { id: 1523, teamId: 15, number: 0, name: "Awer Mabil",           position: "LW", club: "Castellón" },
  { id: 1524, teamId: 15, number: 0, name: "Ajdin Hrustic",        position: "AM", club: "Heracles Almelo" },
  { id: 1525, teamId: 15, number: 0, name: "Mohamed Toure",        position: "ST", club: "Norwich City" },
  { id: 1526, teamId: 15, number: 0, name: "Tete Yengi",           position: "ST", club: "Machida Zelvia" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 33 — Ecuador (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const ECUADOR: Player[] = [
  { id: 3301, teamId: 33, number: 0, name: "Hernán Galíndez",       position: "GK", club: "Huracán" },
  { id: 3302, teamId: 33, number: 0, name: "Moisés Ramírez",        position: "GK", club: "AE Kifisias" },
  { id: 3303, teamId: 33, number: 0, name: "Gonzalo Valle",         position: "GK", club: "LDU Quito" },
  { id: 3304, teamId: 33, number: 0, name: "Willian Pacho",         position: "CB", club: "Paris Saint-Germain" },
  { id: 3305, teamId: 33, number: 0, name: "Piero Hincapié",        position: "CB", club: "Arsenal" },
  { id: 3306, teamId: 33, number: 0, name: "Joel Ordóñez",          position: "CB", club: "Club Brugge" },
  { id: 3307, teamId: 33, number: 0, name: "Félix Torres",          position: "CB", club: "Internacional" },
  { id: 3308, teamId: 33, number: 0, name: "Pervis Estupiñán",      position: "LB", club: "AC Milan" },
  { id: 3309, teamId: 33, number: 0, name: "Yaimar Medina",         position: "RB", club: "Racing Genk" },
  { id: 3310, teamId: 33, number: 0, name: "Ángelo Preciado",       position: "RB", club: "Atlético Mineiro" },
  { id: 3311, teamId: 33, number: 0, name: "Jackson Porozo",        position: "CB", club: "Club Tijuana" },
  { id: 3312, teamId: 33, number: 0, name: "Alan Minda",            position: "AM", club: "Atlético Mineiro" },
  { id: 3313, teamId: 33, number: 0, name: "Moisés Caicedo",        position: "DM", club: "Chelsea", isCaptain: true },
  { id: 3314, teamId: 33, number: 0, name: "Jordy Alcivar",         position: "CM", club: "Independiente del Valle" },
  { id: 3315, teamId: 33, number: 0, name: "Denil Castillo",        position: "CM", club: "FC Midtjylland" },
  { id: 3316, teamId: 33, number: 0, name: "John Yeboah",           position: "AM", club: "Venezia" },
  { id: 3317, teamId: 33, number: 0, name: "Alan Franco",           position: "CM", club: "Atlético Mineiro" },
  { id: 3318, teamId: 33, number: 0, name: "Pedro Vite",            position: "AM", club: "Pumas UNAM" },
  { id: 3319, teamId: 33, number: 0, name: "Kendry Páez",           position: "AM", club: "River Plate" },
  { id: 3320, teamId: 33, number: 0, name: "Nilson Angulo",         position: "LW", club: "Sunderland" },
  { id: 3321, teamId: 33, number: 0, name: "Gonzalo Plata",         position: "RW", club: "Flamengo" },
  { id: 3322, teamId: 33, number: 0, name: "Kevin Rodríguez",       position: "ST", club: "Union St.-Gilloise" },
  { id: 3323, teamId: 33, number: 0, name: "Anthony Valencia",      position: "LW", club: "Antwerp" },
  { id: 3324, teamId: 33, number: 0, name: "Enner Valencia",        position: "ST", club: "Pachuca" },
  { id: 3325, teamId: 33, number: 0, name: "Jordy Caicedo",         position: "ST", club: "Huracán" },
  { id: 3326, teamId: 33, number: 0, name: "Jeremy Arévalo",        position: "ST", club: "VfB Stuttgart" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 26 — Netherlands (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const NETHERLANDS: Player[] = [
  { id: 2601, teamId: 26, number: 0, name: "Mark Flekken",        position: "GK", club: "Bayer Leverkusen" },
  { id: 2602, teamId: 26, number: 0, name: "Robin Roefs",         position: "GK", club: "Sunderland" },
  { id: 2603, teamId: 26, number: 0, name: "Bart Verbruggen",     position: "GK", club: "Brighton" },
  { id: 2604, teamId: 26, number: 0, name: "Nathan Aké",          position: "CB", club: "Manchester City" },
  { id: 2605, teamId: 26, number: 0, name: "Denzel Dumfries",     position: "RB", club: "Inter Milan" },
  { id: 2606, teamId: 26, number: 0, name: "Jorrel Hato",         position: "CB", club: "Chelsea" },
  { id: 2607, teamId: 26, number: 0, name: "Jurriën Timber",      position: "RB", club: "Arsenal" },
  { id: 2608, teamId: 26, number: 0, name: "Jan Paul van Hecke",  position: "CB", club: "Brighton" },
  { id: 2609, teamId: 26, number: 0, name: "Micky van de Ven",    position: "CB", club: "Tottenham" },
  { id: 2610, teamId: 26, number: 0, name: "Virgil van Dijk",     position: "CB", club: "Liverpool", isCaptain: true },
  { id: 2611, teamId: 26, number: 0, name: "Frenkie de Jong",     position: "CM", club: "Barcelona" },
  { id: 2612, teamId: 26, number: 0, name: "Marten de Roon",      position: "DM", club: "Atalanta" },
  { id: 2613, teamId: 26, number: 0, name: "Ryan Gravenberch",    position: "CM", club: "Liverpool" },
  { id: 2614, teamId: 26, number: 0, name: "Teun Koopmeiners",    position: "CM", club: "Juventus" },
  { id: 2615, teamId: 26, number: 0, name: "Tijjani Reijnders",   position: "CM", club: "Manchester City" },
  { id: 2616, teamId: 26, number: 0, name: "Guus Til",            position: "AM", club: "PSV" },
  { id: 2617, teamId: 26, number: 0, name: "Quinten Timber",      position: "CM", club: "Marseille" },
  { id: 2618, teamId: 26, number: 0, name: "Mats Wieffer",        position: "DM", club: "Brighton" },
  { id: 2619, teamId: 26, number: 0, name: "Brian Brobbey",       position: "ST", club: "Sunderland" },
  { id: 2620, teamId: 26, number: 0, name: "Memphis Depay",       position: "ST", club: "Corinthians" },
  { id: 2621, teamId: 26, number: 0, name: "Cody Gakpo",          position: "LW", club: "Liverpool" },
  { id: 2622, teamId: 26, number: 0, name: "Justin Kluivert",     position: "RW", club: "Bournemouth" },
  { id: 2623, teamId: 26, number: 0, name: "Noa Lang",            position: "LW", club: "Galatasaray" },
  { id: 2624, teamId: 26, number: 0, name: "Donyell Malen",       position: "RW", club: "Roma" },
  { id: 2625, teamId: 26, number: 0, name: "Crysencio Summerville",position:"LW", club: "West Ham" },
  { id: 2626, teamId: 26, number: 0, name: "Wout Weghorst",       position: "ST", club: "Ajax" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 19 — Saudi Arabia (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const SAUDI_ARABIA: Player[] = [
  { id: 1901, teamId: 19, number: 0, name: "Mohammed Al Owais",        position: "GK", club: "Al Ula" },
  { id: 1902, teamId: 19, number: 0, name: "Nawaf Al Aqidi",           position: "GK", club: "Al Nassr" },
  { id: 1903, teamId: 19, number: 0, name: "Ahmed Al Kassar",          position: "GK", club: "Al Qadsiah" },
  { id: 1904, teamId: 19, number: 0, name: "Abdulelah Al Amri",        position: "CB", club: "Al Nassr" },
  { id: 1905, teamId: 19, number: 0, name: "Hassan Tambakti",          position: "CB", club: "Al Hilal" },
  { id: 1906, teamId: 19, number: 0, name: "Jehad Thikri",             position: "CB", club: "Al Qadsiah" },
  { id: 1907, teamId: 19, number: 0, name: "Ali Lajami",               position: "CB", club: "Al Hilal" },
  { id: 1908, teamId: 19, number: 0, name: "Hassan Kadesh",            position: "CB", club: "Al Ittihad" },
  { id: 1909, teamId: 19, number: 0, name: "Saud Abdulhamid",          position: "RB", club: "Lens" },
  { id: 1910, teamId: 19, number: 0, name: "Mohammed Abu Al Shamat",   position: "LB", club: "Al Qadsiah" },
  { id: 1911, teamId: 19, number: 0, name: "Ali Majrashi",             position: "CB", club: "Al Ahli" },
  { id: 1912, teamId: 19, number: 0, name: "Moteb Al Harbi",           position: "RB", club: "Al Hilal" },
  { id: 1913, teamId: 19, number: 0, name: "Nawaf Boushal",            position: "LB", club: "Al Nassr" },
  { id: 1914, teamId: 19, number: 0, name: "Sultan Al-Ghannam",        position: "RB", club: "Al Nassr" },
  { id: 1915, teamId: 19, number: 0, name: "Mohammed Kanno",           position: "DM", club: "Al Hilal", isCaptain: true },
  { id: 1916, teamId: 19, number: 0, name: "Abdullah Al Khaibari",     position: "CM", club: "Al Nassr" },
  { id: 1917, teamId: 19, number: 0, name: "Ziyad Al Johani",          position: "CM", club: "Al Ahli" },
  { id: 1918, teamId: 19, number: 0, name: "Nasser Al Dawsari",        position: "LW", club: "Al Hilal" },
  { id: 1919, teamId: 19, number: 0, name: "Musab Al Juwayr",          position: "AM", club: "Al Qadsiah" },
  { id: 1920, teamId: 19, number: 0, name: "Alaa Al Hajji",            position: "CM", club: "Neom" },
  { id: 1921, teamId: 19, number: 0, name: "Salem Al Dawsari",         position: "LW", club: "Al Hilal" },
  { id: 1922, teamId: 19, number: 0, name: "Khalid Al Ghannam",        position: "AM", club: "Al Ettifaq" },
  { id: 1923, teamId: 19, number: 0, name: "Ayman Yahya",              position: "RW", club: "Al Nassr" },
  { id: 1924, teamId: 19, number: 0, name: "Firas Al Buraikan",        position: "ST", club: "Al Ahli" },
  { id: 1925, teamId: 19, number: 0, name: "Saleh Al Shehri",          position: "ST", club: "Al Ittihad" },
  { id: 1926, teamId: 19, number: 0, name: "Abdullah Al Hamdan",       position: "ST", club: "Al Nassr" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 23 — Uruguay (ESPN)
// ─────────────────────────────────────────────────────────────────────────────
const URUGUAY: Player[] = [
  { id: 2301, teamId: 23, number: 0, name: "Fernando Muslera",          position: "GK", club: "Estudiantes de La Plata", isCaptain: true },
  { id: 2302, teamId: 23, number: 0, name: "Sergio Rochet",             position: "GK", club: "Internacional" },
  { id: 2303, teamId: 23, number: 0, name: "Santiago Mele",             position: "GK", club: "Monterrey" },
  { id: 2304, teamId: 23, number: 0, name: "Ronald Araújo",             position: "CB", club: "Barcelona" },
  { id: 2305, teamId: 23, number: 0, name: "José María Giménez",        position: "CB", club: "Atlético Madrid" },
  { id: 2306, teamId: 23, number: 0, name: "Santiago Bueno",            position: "CB", club: "Wolverhampton Wanderers" },
  { id: 2307, teamId: 23, number: 0, name: "Sebastián Cáceres",         position: "CB", club: "América" },
  { id: 2308, teamId: 23, number: 0, name: "Mathías Olivera",           position: "LB", club: "Napoli" },
  { id: 2309, teamId: 23, number: 0, name: "Guillermo Varela",          position: "RB", club: "Flamengo" },
  { id: 2310, teamId: 23, number: 0, name: "Matías Viña",               position: "LB", club: "River Plate" },
  { id: 2311, teamId: 23, number: 0, name: "Joaquín Piquerez",          position: "LB", club: "Palmeiras" },
  { id: 2312, teamId: 23, number: 0, name: "Juan Manuel Sanabria",      position: "LB", club: "Real Salt Lake" },
  { id: 2313, teamId: 23, number: 0, name: "Federico Valverde",         position: "CM", club: "Real Madrid" },
  { id: 2314, teamId: 23, number: 0, name: "Rodrigo Bentancur",         position: "DM", club: "Tottenham Hotspur" },
  { id: 2315, teamId: 23, number: 0, name: "Manuel Ugarte",             position: "DM", club: "Manchester United" },
  { id: 2316, teamId: 23, number: 0, name: "Emiliano Martínez",         position: "CM", club: "Palmeiras" },
  { id: 2317, teamId: 23, number: 0, name: "Rodrigo Zalazar",           position: "AM", club: "Sporting CP" },
  { id: 2318, teamId: 23, number: 0, name: "Giorgian De Arrascaeta",    position: "AM", club: "Flamengo" },
  { id: 2319, teamId: 23, number: 0, name: "Nicolás De La Cruz",        position: "AM", club: "Flamengo" },
  { id: 2320, teamId: 23, number: 0, name: "Agustín Canobbio",          position: "RW", club: "Fluminense" },
  { id: 2321, teamId: 23, number: 0, name: "Maximiliano Araújo",        position: "LW", club: "Sporting CP" },
  { id: 2322, teamId: 23, number: 0, name: "Brian Rodríguez",           position: "RW", club: "América" },
  { id: 2323, teamId: 23, number: 0, name: "Facundo Pellistri",         position: "RW", club: "Panathinaikos" },
  { id: 2324, teamId: 23, number: 0, name: "Darwin Núñez",              position: "ST", club: "Al Hilal" },
  { id: 2325, teamId: 23, number: 0, name: "Federico Viñas",            position: "ST", club: "Real Oviedo" },
  { id: 2326, teamId: 23, number: 0, name: "Rodrigo Aguirre",           position: "ST", club: "Tigres" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 20 — Algeria (Yahoo; trimmed to 26 by dropping the 4th GK from the snippet)
// ─────────────────────────────────────────────────────────────────────────────
const ALGERIA: Player[] = [
  { id: 2001, teamId: 20, number: 0, name: "Luca Zidane",             position: "GK", club: "Granada" },
  { id: 2002, teamId: 20, number: 0, name: "Oussama Benbot",          position: "GK", club: "USM Alger" },
  { id: 2003, teamId: 20, number: 0, name: "Melvin Mastil",           position: "GK", club: "Stade Nyonnais" },
  { id: 2004, teamId: 20, number: 0, name: "Rafik Belghali",          position: "RB", club: "Hellas Verona" },
  { id: 2005, teamId: 20, number: 0, name: "Samir Chergui",           position: "CB", club: "Red Star FC" },
  { id: 2006, teamId: 20, number: 0, name: "Rayan Aït-Nouri",         position: "LB", club: "Manchester City" },
  { id: 2007, teamId: 20, number: 0, name: "Jaouen Hadjam",           position: "LB", club: "BSC Young Boys" },
  { id: 2008, teamId: 20, number: 0, name: "Aïssa Mandi",             position: "CB", club: "LOSC Lille" },
  { id: 2009, teamId: 20, number: 0, name: "Ramy Bensebaini",         position: "CB", club: "Borussia Dortmund" },
  { id: 2010, teamId: 20, number: 0, name: "Zineddine Belaïd",        position: "CB", club: "JS Kabylie" },
  { id: 2011, teamId: 20, number: 0, name: "Achref Abada",            position: "RB", club: "USM Alger" },
  { id: 2012, teamId: 20, number: 0, name: "Mohamed Amine Tougaï",    position: "CB", club: "Espérance de Tunis" },
  { id: 2013, teamId: 20, number: 0, name: "Nabil Bentaleb",          position: "DM", club: "LOSC Lille" },
  { id: 2014, teamId: 20, number: 0, name: "Hicham Boudaoui",         position: "CM", club: "Nice" },
  { id: 2015, teamId: 20, number: 0, name: "Houssem Aouar",           position: "AM", club: "Al-Ittihad" },
  { id: 2016, teamId: 20, number: 0, name: "Farès Chaïbi",            position: "AM", club: "Eintracht Frankfurt" },
  { id: 2017, teamId: 20, number: 0, name: "Ibrahim Maza",            position: "AM", club: "Bayer Leverkusen" },
  { id: 2018, teamId: 20, number: 0, name: "Yacine Titraoui",         position: "CM", club: "Charleroi" },
  { id: 2019, teamId: 20, number: 0, name: "Ramiz Zerrouki",          position: "DM", club: "FC Twente" },
  { id: 2020, teamId: 20, number: 0, name: "Mohamed Amine Amoura",    position: "ST", club: "VfL Wolfsburg" },
  { id: 2021, teamId: 20, number: 0, name: "Nadhir Benbouali",        position: "ST", club: "Győr" },
  { id: 2022, teamId: 20, number: 0, name: "Adil Boulbina",           position: "LW", club: "Al-Duhail" },
  { id: 2023, teamId: 20, number: 0, name: "Farès Ghedjemis",         position: "RW", club: "Frosinone" },
  { id: 2024, teamId: 20, number: 0, name: "Amine Gouiri",            position: "ST", club: "Olympique de Marseille" },
  { id: 2025, teamId: 20, number: 0, name: "Anis Hadj Moussa",        position: "LW", club: "Feyenoord" },
  { id: 2026, teamId: 20, number: 0, name: "Riyad Mahrez",            position: "RW", club: "Al-Ahli", isCaptain: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// 31 — Uzbekistan (Yahoo). Coach: Fabio Cannavaro.
// ─────────────────────────────────────────────────────────────────────────────
const UZBEKISTAN: Player[] = [
  { id: 3101, teamId: 31, number: 0, name: "Utkir Yusupov",           position: "GK", club: "Navbahor" },
  { id: 3102, teamId: 31, number: 0, name: "Abduvohid Nematov",       position: "GK", club: "Nasaf" },
  { id: 3103, teamId: 31, number: 0, name: "Botirali Ergashev",       position: "GK", club: "Neftchi" },
  { id: 3104, teamId: 31, number: 0, name: "Rustam Ashurmatov",       position: "CB", club: "Esteghlal" },
  { id: 3105, teamId: 31, number: 0, name: "Farrukh Sayfiev",         position: "LB", club: "Neftchi" },
  { id: 3106, teamId: 31, number: 0, name: "Khojiakbar Alijonov",     position: "RB", club: "Pakhtakor" },
  { id: 3107, teamId: 31, number: 0, name: "Sherzod Nasrullaev",      position: "CB", club: "Nasaf" },
  { id: 3108, teamId: 31, number: 0, name: "Umar Eshmurodov",         position: "CB", club: "Nasaf" },
  { id: 3109, teamId: 31, number: 0, name: "Abdukodir Khusanov",      position: "CB", club: "Manchester City" },
  { id: 3110, teamId: 31, number: 0, name: "Abdulla Abdullaev",       position: "CB", club: "Dibba" },
  { id: 3111, teamId: 31, number: 0, name: "Bekhruz Karimov",         position: "LB", club: "Surkhon" },
  { id: 3112, teamId: 31, number: 0, name: "Jakhongir Urozov",        position: "RB", club: "Dinamo Samarqand" },
  { id: 3113, teamId: 31, number: 0, name: "Avazbek Ulmasaliev",      position: "CB", club: "AGMK" },
  { id: 3114, teamId: 31, number: 0, name: "Otabek Shukurov",         position: "DM", club: "Baniyas", isCaptain: true },
  { id: 3115, teamId: 31, number: 0, name: "Jaloliddin Masharipov",   position: "AM", club: "Esteghlal" },
  { id: 3116, teamId: 31, number: 0, name: "Odiljon Hamrobekov",      position: "CM", club: "Tractor" },
  { id: 3117, teamId: 31, number: 0, name: "Oston Urunov",            position: "AM", club: "Persepolis" },
  { id: 3118, teamId: 31, number: 0, name: "Jamshid Iskanderov",      position: "CM", club: "Neftchi" },
  { id: 3119, teamId: 31, number: 0, name: "Dostonbek Khamdamov",     position: "LW", club: "Pakhtakor" },
  { id: 3120, teamId: 31, number: 0, name: "Abbosbek Fayzullaev",     position: "AM", club: "Istanbul Başakşehir" },
  { id: 3121, teamId: 31, number: 0, name: "Akmal Mozgovoy",          position: "CM", club: "Pakhtakor" },
  { id: 3122, teamId: 31, number: 0, name: "Azizjon Ganiev",          position: "CM", club: "Al Bataeh" },
  { id: 3123, teamId: 31, number: 0, name: "Sherzod Esanov",          position: "RW", club: "Bukhara" },
  { id: 3124, teamId: 31, number: 0, name: "Eldor Shomurodov",        position: "ST", club: "Istanbul Başakşehir" },
  { id: 3125, teamId: 31, number: 0, name: "Igor Sergeev",            position: "ST", club: "Persepolis" },
  { id: 3126, teamId: 31, number: 0, name: "Azizbek Amonov",          position: "ST", club: "Bukhara" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 37 — Colombia (Yahoo)
// ─────────────────────────────────────────────────────────────────────────────
const COLOMBIA: Player[] = [
  { id: 3701, teamId: 37, number: 0, name: "Camilo Vargas",            position: "GK", club: "Atlas" },
  { id: 3702, teamId: 37, number: 0, name: "David Ospina",             position: "GK", club: "Atlético Nacional" },
  { id: 3703, teamId: 37, number: 0, name: "Álvaro Montero",           position: "GK", club: "Vélez Sarsfield" },
  { id: 3704, teamId: 37, number: 0, name: "Daniel Muñoz",             position: "RB", club: "Crystal Palace" },
  { id: 3705, teamId: 37, number: 0, name: "Santiago Arias",           position: "RB", club: "Independiente" },
  { id: 3706, teamId: 37, number: 0, name: "Davinson Sánchez",         position: "CB", club: "Galatasaray" },
  { id: 3707, teamId: 37, number: 0, name: "Jhon Lucumí",              position: "CB", club: "Bologna" },
  { id: 3708, teamId: 37, number: 0, name: "Yerry Mina",               position: "CB", club: "Cagliari" },
  { id: 3709, teamId: 37, number: 0, name: "Willer Ditta",             position: "CB", club: "Cruz Azul" },
  { id: 3710, teamId: 37, number: 0, name: "Johan Mojica",             position: "LB", club: "Mallorca" },
  { id: 3711, teamId: 37, number: 0, name: "Deiver Machado",           position: "LB", club: "Nantes" },
  { id: 3712, teamId: 37, number: 0, name: "Jefferson Lerma",          position: "DM", club: "Crystal Palace" },
  { id: 3713, teamId: 37, number: 0, name: "Richard Ríos",             position: "CM", club: "Benfica" },
  { id: 3714, teamId: 37, number: 0, name: "Jhon Arias",               position: "AM", club: "Palmeiras" },
  { id: 3715, teamId: 37, number: 0, name: "Kevin Castaño",            position: "CM", club: "—" },
  { id: 3716, teamId: 37, number: 0, name: "Juan Fernando Quintero",   position: "AM", club: "River Plate" },
  { id: 3717, teamId: 37, number: 0, name: "Juan Camilo Portilla",     position: "DM", club: "Athletico Paranaense" },
  { id: 3718, teamId: 37, number: 0, name: "Gustavo Puerta",           position: "CM", club: "Racing Santander" },
  { id: 3719, teamId: 37, number: 0, name: "James Rodríguez",          position: "AM", club: "Minnesota United", isCaptain: true },
  { id: 3720, teamId: 37, number: 0, name: "Jorge Carrascal",          position: "AM", club: "Flamengo" },
  { id: 3721, teamId: 37, number: 0, name: "Jaminton Campaz",          position: "LW", club: "Rosario Central" },
  { id: 3722, teamId: 37, number: 0, name: "Luis Díaz",                position: "LW", club: "Bayern Múnich" },
  { id: 3723, teamId: 37, number: 0, name: "Luis Suárez",              position: "ST", club: "Sporting" },
  { id: 3724, teamId: 37, number: 0, name: "Jhon Córdoba",             position: "ST", club: "Krasnodar" },
  { id: 3725, teamId: 37, number: 0, name: "Juan Camilo Hernández",    position: "ST", club: "Real Betis" },
  { id: 3726, teamId: 37, number: 0, name: "Carlos Andrés Gómez",      position: "RW", club: "Vasco da Gama" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 28 — Ghana (Yahoo)
// ─────────────────────────────────────────────────────────────────────────────
const GHANA: Player[] = [
  { id: 2801, teamId: 28, number: 0, name: "Benjamin Asare",           position: "GK", club: "Accra Hearts of Oak" },
  { id: 2802, teamId: 28, number: 0, name: "Lawrence Ati-Zigi",        position: "GK", club: "St. Gallen" },
  { id: 2803, teamId: 28, number: 0, name: "Joseph Anang",             position: "GK", club: "St. Patrick's Athletic" },
  { id: 2804, teamId: 28, number: 0, name: "Baba Rahman",              position: "LB", club: "PAOK" },
  { id: 2805, teamId: 28, number: 0, name: "Gideon Mensah",            position: "LB", club: "Auxerre" },
  { id: 2806, teamId: 28, number: 0, name: "Marvin Senaya",            position: "RB", club: "Auxerre" },
  { id: 2807, teamId: 28, number: 0, name: "Alidu Seidu",              position: "CB", club: "Rennes" },
  { id: 2808, teamId: 28, number: 0, name: "Abdul Mumin",              position: "CB", club: "Rayo Vallecano" },
  { id: 2809, teamId: 28, number: 0, name: "Jerome Opoku",             position: "CB", club: "Istanbul Başakşehir" },
  { id: 2810, teamId: 28, number: 0, name: "Jonas Adjetey",            position: "CB", club: "Wolfsburg" },
  { id: 2811, teamId: 28, number: 0, name: "Kojo Oppong Peprah",       position: "RB", club: "Nice" },
  { id: 2812, teamId: 28, number: 0, name: "Derrick Luckassen",        position: "CB", club: "Pafos" },
  { id: 2813, teamId: 28, number: 0, name: "Elisha Owusu",             position: "CB", club: "Auxerre" },
  { id: 2814, teamId: 28, number: 0, name: "Thomas Partey",            position: "DM", club: "Villarreal", isCaptain: true },
  { id: 2815, teamId: 28, number: 0, name: "Kwasi Sibo",               position: "DM", club: "Real Oviedo" },
  { id: 2816, teamId: 28, number: 0, name: "Augustine Boakye",         position: "AM", club: "Saint-Étienne" },
  { id: 2817, teamId: 28, number: 0, name: "Caleb Yirenkyi",           position: "CM", club: "FC Nordsjælland" },
  { id: 2818, teamId: 28, number: 0, name: "Abdul Fatawu Issahaku",    position: "RW", club: "Leicester City" },
  { id: 2819, teamId: 28, number: 0, name: "Kamaldeen Sulemana",       position: "LW", club: "Atalanta" },
  { id: 2820, teamId: 28, number: 0, name: "Christopher Bonsu Baah",   position: "RW", club: "Al Qadsiah" },
  { id: 2821, teamId: 28, number: 0, name: "Ernest Nuamah",            position: "LW", club: "Lyon" },
  { id: 2822, teamId: 28, number: 0, name: "Antoine Semenyo",          position: "ST", club: "Manchester City" },
  { id: 2823, teamId: 28, number: 0, name: "Brandon Thomas-Asante",    position: "ST", club: "Coventry City" },
  { id: 2824, teamId: 28, number: 0, name: "Prince Kwabena Adu",       position: "ST", club: "Viktoria Plzeň" },
  { id: 2825, teamId: 28, number: 0, name: "Iñaki Williams",           position: "ST", club: "Athletic Bilbao" },
  { id: 2826, teamId: 28, number: 0, name: "Jordan Ayew",              position: "ST", club: "Leicester City" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 25 — Panama (Yahoo)
// ─────────────────────────────────────────────────────────────────────────────
const PANAMA: Player[] = [
  { id: 2501, teamId: 25, number: 0, name: "Orlando Mosquera",         position: "GK", club: "Al Fayha" },
  { id: 2502, teamId: 25, number: 0, name: "Luis Mejía",               position: "GK", club: "Nacional" },
  { id: 2503, teamId: 25, number: 0, name: "César Samudio",            position: "GK", club: "Marathón" },
  { id: 2504, teamId: 25, number: 0, name: "César Blackman",           position: "RB", club: "Slovan Bratislava" },
  { id: 2505, teamId: 25, number: 0, name: "Jorge Gutiérrez",          position: "CB", club: "Deportivo La Guaira" },
  { id: 2506, teamId: 25, number: 0, name: "Amir Murillo",             position: "RB", club: "Beşiktaş" },
  { id: 2507, teamId: 25, number: 0, name: "Fidel Escobar",            position: "CB", club: "Saprissa" },
  { id: 2508, teamId: 25, number: 0, name: "Andrés Andrade",           position: "CB", club: "LASK" },
  { id: 2509, teamId: 25, number: 0, name: "Edgardo Fariña",           position: "CB", club: "Pari Nizhny Novgorod" },
  { id: 2510, teamId: 25, number: 0, name: "José Córdoba",             position: "CB", club: "Norwich City" },
  { id: 2511, teamId: 25, number: 0, name: "Éric Davis",               position: "LB", club: "Plaza Amador" },
  { id: 2512, teamId: 25, number: 0, name: "Jiovany Ramos",            position: "CB", club: "Puerto Cabello" },
  { id: 2513, teamId: 25, number: 0, name: "Roderick Miller",          position: "CB", club: "Turan Tovuz" },
  { id: 2514, teamId: 25, number: 0, name: "Aníbal Godoy",             position: "DM", club: "San Diego FC", isCaptain: true },
  { id: 2515, teamId: 25, number: 0, name: "Adalberto Carrasquilla",   position: "CM", club: "Pumas UNAM" },
  { id: 2516, teamId: 25, number: 0, name: "Carlos Harvey",            position: "CM", club: "Minnesota United" },
  { id: 2517, teamId: 25, number: 0, name: "Cristian Martínez",        position: "AM", club: "Ironi Kiryat Shmona" },
  { id: 2518, teamId: 25, number: 0, name: "José Luis Rodríguez",      position: "RW", club: "Juárez" },
  { id: 2519, teamId: 25, number: 0, name: "César Yanis",              position: "AM", club: "Cobresal" },
  { id: 2520, teamId: 25, number: 0, name: "Yoel Bárcenas",            position: "AM", club: "Mazatlán" },
  { id: 2521, teamId: 25, number: 0, name: "Alberto Quintero",         position: "LW", club: "Plaza Amador" },
  { id: 2522, teamId: 25, number: 0, name: "Azarias Londoño",          position: "LW", club: "Universidad Católica" },
  { id: 2523, teamId: 25, number: 0, name: "Ismael Díaz",              position: "ST", club: "León" },
  { id: 2524, teamId: 25, number: 0, name: "Cecilio Waterman",         position: "ST", club: "Universidad de Concepción" },
  { id: 2525, teamId: 25, number: 0, name: "José Fajardo",             position: "ST", club: "Universidad Católica" },
  { id: 2526, teamId: 25, number: 0, name: "Tomás Rodríguez",          position: "ST", club: "Saprissa" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate
// ─────────────────────────────────────────────────────────────────────────────
export const WAVE4_SQUADS: Record<number, Player[]> = {
  5:  CANADA,
  9:  USA,
  12: MOROCCO,
  15: AUSTRALIA,
  19: SAUDI_ARABIA,
  20: ALGERIA,
  23: URUGUAY,
  25: PANAMA,
  26: NETHERLANDS,
  28: GHANA,
  31: UZBEKISTAN,
  33: ECUADOR,
  37: COLOMBIA,
  48: SOUTH_AFRICA,
};
