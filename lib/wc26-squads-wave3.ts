/**
 * Wave-3 squad data — May 2026 announcements from oddsnet.com.
 *
 *   - Cape Verde (final 26)        · OFFICIAL  · Group H
 *   - Jordan (final 26)            · OFFICIAL  · Group J
 *   - Iran (preliminary 30)        · prelim    · Group G — final due 1 Jun
 *   - Iraq (preliminary 34)        · prelim    · Group I — final due 1 Jun
 *   - Egypt (preliminary 27)       · prelim    · Group G — final due 29 May
 *   - Qatar (preliminary 35)       · prelim    · Group B
 *   - Czechia (preliminary 55)     · prelim    · Group A — final due 31 May
 *   - Türkiye (preliminary 35)     · prelim    · Group D
 *   - Paraguay (preliminary 55)    · prelim    · Group D
 *
 * Shirt numbers aren't in the source, so `number` is 0 for these entries
 * (the UI shows "—" for unknown numbers). Caps/goals come from oddsnet.
 */

import type { Player } from "./wc26-squads";

// ─────────────────────────────────────────────────────────────────────────────
// Cape Verde · Group H · OFFICIAL (final 26)
// ─────────────────────────────────────────────────────────────────────────────
const CAPE_VERDE: Player[] = [
  { id: 5501, teamId: 55, number: 0, name: "Vozinha",                 position: "GK", club: "Chaves",                caps: 85, goals: 0, startX: 50, startY: 92 },
  { id: 5502, teamId: 55, number: 0, name: "Márcio Rosa",             position: "GK", club: "Montana",               caps: 10, goals: 0 },
  { id: 5503, teamId: 55, number: 0, name: "CJ dos Santos",           position: "GK", club: "San Diego FC",          caps: 0,  goals: 0 },
  { id: 5504, teamId: 55, number: 0, name: "Stopira",                 position: "CB", club: "Torreense",             caps: 60, goals: 4, startX: 38, startY: 80, isCaptain: true },
  { id: 5505, teamId: 55, number: 0, name: "Roberto Lopes",           position: "CB", club: "Shamrock Rovers",       caps: 44, goals: 0, startX: 62, startY: 80 },
  { id: 5506, teamId: 55, number: 0, name: "João Paulo Fernandes",    position: "CB", club: "FCSB",                  caps: 40, goals: 1 },
  { id: 5507, teamId: 55, number: 0, name: "Diney",                   position: "RB", club: "Al Bataeh",             caps: 29, goals: 2, startX: 82, startY: 75 },
  { id: 5508, teamId: 55, number: 0, name: "Logan Costa",             position: "CB", club: "Villarreal",            caps: 26, goals: 0 },
  { id: 5509, teamId: 55, number: 0, name: "Steven Moreira",          position: "RB", club: "Columbus Crew",         caps: 18, goals: 0 },
  { id: 5510, teamId: 55, number: 0, name: "Wagner Pina",             position: "RB", club: "Trabzonspor",           caps: 12, goals: 0 },
  { id: 5511, teamId: 55, number: 0, name: "Sidny Lopes Cabral",      position: "LB", club: "Benfica",               caps: 8,  goals: 3, startX: 18, startY: 75 },
  { id: 5512, teamId: 55, number: 0, name: "Kelvin Pires",            position: "LB", club: "SJK",                   caps: 4,  goals: 1 },
  { id: 5513, teamId: 55, number: 0, name: "Jamiro Monteiro",         position: "CM", club: "PEC Zwolle",            caps: 53, goals: 5, startX: 35, startY: 55 },
  { id: 5514, teamId: 55, number: 0, name: "Kevin Pina",              position: "CM", club: "Krasnodar",             caps: 30, goals: 2 },
  { id: 5515, teamId: 55, number: 0, name: "Deroy Duarte",            position: "DM", club: "Ludogorets Razgrad",    caps: 30, goals: 0, startX: 50, startY: 60 },
  { id: 5516, teamId: 55, number: 0, name: "Telmo Arcanjo",           position: "AM", club: "Vitória de Guimarães",  caps: 14, goals: 1, startX: 65, startY: 50 },
  { id: 5517, teamId: 55, number: 0, name: "Laros Duarte",            position: "CM", club: "Puskás Akadémia",       caps: 12, goals: 0 },
  { id: 5518, teamId: 55, number: 0, name: "Yannick Semedo",          position: "AM", club: "Farense",               caps: 10, goals: 1 },
  { id: 5519, teamId: 55, number: 0, name: "Ryan Mendes",             position: "RW", club: "Iğdır",                 caps: 94, goals: 22, startX: 78, startY: 30 },
  { id: 5520, teamId: 55, number: 0, name: "Garry Rodrigues",         position: "LW", club: "Apollon Limassol",      caps: 59, goals: 9, startX: 22, startY: 30 },
  { id: 5521, teamId: 55, number: 0, name: "Willy Semedo",            position: "ST", club: "Omonia",                caps: 36, goals: 2 },
  { id: 5522, teamId: 55, number: 0, name: "Jovane Cabral",           position: "LW", club: "Estrela Amadora",       caps: 25, goals: 2 },
  { id: 5523, teamId: 55, number: 0, name: "Gilson Tavares",          position: "ST", club: "Akron Tolyatti",        caps: 21, goals: 5 },
  { id: 5524, teamId: 55, number: 0, name: "Dailon Livramento",       position: "ST", club: "Casa Pia",              caps: 20, goals: 7, startX: 50, startY: 18 },
  { id: 5525, teamId: 55, number: 0, name: "Hélio Varela",            position: "ST", club: "Maccabi Tel Aviv",      caps: 19, goals: 0 },
  { id: 5526, teamId: 55, number: 0, name: "Nuno da Costa",           position: "ST", club: "İstanbul Başakşehir",   caps: 7,  goals: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Jordan · Group J · OFFICIAL (announced 18 May)
// ─────────────────────────────────────────────────────────────────────────────
const JORDAN: Player[] = [
  { id: 3501, teamId: 35, number: 0, name: "Yazeed Abulaila",         position: "GK", club: "Al-Hussein",            caps: 74, goals: 0, startX: 50, startY: 92 },
  { id: 3502, teamId: 35, number: 0, name: "Abdallah Al-Fakhouri",    position: "GK", club: "Al-Wehdat",             caps: 11, goals: 0 },
  { id: 3503, teamId: 35, number: 0, name: "Nour Bani Attiah",        position: "GK", club: "Al-Faisaly",            caps: 4,  goals: 0 },
  { id: 3504, teamId: 35, number: 0, name: "Ahmad Al-Juaidi",         position: "GK", club: "Shabab Al-Ordon",       caps: 0,  goals: 0 },
  { id: 3505, teamId: 35, number: 0, name: "Ihsan Haddad",            position: "CB", club: "Al-Hussein",            caps: 90, goals: 2, startX: 38, startY: 80, isCaptain: true },
  { id: 3506, teamId: 35, number: 0, name: "Yazan Al-Arab",           position: "CB", club: "FC Seoul",              caps: 78, goals: 3, startX: 62, startY: 80 },
  { id: 3507, teamId: 35, number: 0, name: "Abdallah Nasib",          position: "CB", club: "Al-Zawraa",             caps: 64, goals: 3 },
  { id: 3508, teamId: 35, number: 0, name: "Saed Al-Rosan",           position: "LB", club: "Al-Hussein",            caps: 19, goals: 2, startX: 18, startY: 75 },
  { id: 3509, teamId: 35, number: 0, name: "Husam Abu Dahab",         position: "RB", club: "Al-Faisaly",            caps: 16, goals: 0, startX: 82, startY: 75 },
  { id: 3510, teamId: 35, number: 0, name: "Mohammad Abualnadi",      position: "RB", club: "Selangor",              caps: 16, goals: 0 },
  { id: 3511, teamId: 35, number: 0, name: "Yousef Abu Al-Jazar",     position: "CB", club: "Al-Hussein",            caps: 15, goals: 0 },
  { id: 3512, teamId: 35, number: 0, name: "Salim Obaid",             position: "CB", club: "Al-Hussein",            caps: 9,  goals: 0 },
  { id: 3513, teamId: 35, number: 0, name: "Ahmad Assaf",             position: "LB", club: "Al-Hussein",            caps: 6,  goals: 0 },
  { id: 3514, teamId: 35, number: 0, name: "Anas Badawi",             position: "CB", club: "Al-Faisaly",            caps: 0,  goals: 0 },
  { id: 3515, teamId: 35, number: 0, name: "Rajaei Ayed",             position: "DM", club: "Al-Hussein",            caps: 72, goals: 0, startX: 50, startY: 60 },
  { id: 3516, teamId: 35, number: 0, name: "Noor Al-Rawabdeh",        position: "CM", club: "Selangor",              caps: 66, goals: 3 },
  { id: 3517, teamId: 35, number: 0, name: "Ibrahim Sa'deh",          position: "CM", club: "Al-Karma",              caps: 55, goals: 3, startX: 35, startY: 55 },
  { id: 3518, teamId: 35, number: 0, name: "Mohammad Abu Hashish",    position: "CM", club: "Al-Karma",              caps: 54, goals: 1 },
  { id: 3519, teamId: 35, number: 0, name: "Nizar Al-Rashdan",        position: "AM", club: "Qatar SC",              caps: 45, goals: 4, startX: 65, startY: 50 },
  { id: 3520, teamId: 35, number: 0, name: "Mohannad Abu Taha",       position: "DM", club: "Al-Quwa Al-Jawiya",     caps: 27, goals: 1 },
  { id: 3521, teamId: 35, number: 0, name: "Amer Jamous",             position: "CM", club: "Al-Zawraa",             caps: 18, goals: 1 },
  { id: 3522, teamId: 35, number: 0, name: "Mohammad Al-Dawoud",      position: "AM", club: "Al-Wehdat",             caps: 11, goals: 1 },
  { id: 3523, teamId: 35, number: 0, name: "Yousef Qashi",            position: "CM", club: "Al-Hussein",            caps: 0,  goals: 0 },
  { id: 3524, teamId: 35, number: 0, name: "Mohammad Taha",           position: "CM", club: "Al-Hussein",            caps: 0,  goals: 0 },
  { id: 3525, teamId: 35, number: 0, name: "Musa Al-Taamari",         position: "RW", club: "Rennes",                caps: 90, goals: 24, startX: 78, startY: 30 },
  { id: 3526, teamId: 35, number: 0, name: "Mahmoud Al-Mardi",        position: "ST", club: "Al-Hussein",            caps: 87, goals: 9 },
  { id: 3527, teamId: 35, number: 0, name: "Ali Olwan",               position: "ST", club: "Al-Sailiya",            caps: 64, goals: 29, startX: 50, startY: 18 },
  { id: 3528, teamId: 35, number: 0, name: "Mohammad Abu Zrayq",      position: "ST", club: "Raja Casablanca",       caps: 39, goals: 5, startX: 22, startY: 30 },
  { id: 3529, teamId: 35, number: 0, name: "Ibrahim Sabra",           position: "ST", club: "Lokomotiva Zagreb",     caps: 9,  goals: 1 },
  { id: 3530, teamId: 35, number: 0, name: "Odeh Al-Fakhouri",        position: "ST", club: "Pyramids",              caps: 8,  goals: 0 },
  { id: 3531, teamId: 35, number: 0, name: "Ali Azaizeh",             position: "ST", club: "Al-Shabab",             caps: 2,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Iran · Group G · preliminary (30 — final 1 Jun)
// ─────────────────────────────────────────────────────────────────────────────
const IRAN: Player[] = [
  { id: 1101, teamId: 11, number: 0, name: "Alireza Beiranvand",      position: "GK", club: "Tractor",               caps: 84, goals: 0, startX: 50, startY: 92 },
  { id: 1102, teamId: 11, number: 0, name: "Payam Niazmand",          position: "GK", club: "Persepolis",            caps: 15, goals: 0 },
  { id: 1103, teamId: 11, number: 0, name: "Hossein Hosseini",        position: "GK", club: "Sepahan",               caps: 13, goals: 0 },
  { id: 1104, teamId: 11, number: 0, name: "Mohammad Khalife",        position: "GK", club: "Aluminium Arak",        caps: 0,  goals: 0 },
  { id: 1105, teamId: 11, number: 0, name: "Ehsan Hajsafi",           position: "LB", club: "Sepahan",               caps: 144,goals: 7, startX: 18, startY: 75, isCaptain: true },
  { id: 1106, teamId: 11, number: 0, name: "Milad Mohammadi",         position: "LB", club: "Persepolis",            caps: 75, goals: 1 },
  { id: 1107, teamId: 11, number: 0, name: "Ramin Rezaeian",          position: "RB", club: "Foolad",                caps: 72, goals: 6, startX: 82, startY: 75 },
  { id: 1108, teamId: 11, number: 0, name: "Hossein Kanaanizadegan",  position: "CB", club: "Persepolis",            caps: 63, goals: 6, startX: 38, startY: 80 },
  { id: 1109, teamId: 11, number: 0, name: "Shojae Khalilzadeh",      position: "CB", club: "Tractor",               caps: 56, goals: 2, startX: 62, startY: 80 },
  { id: 1110, teamId: 11, number: 0, name: "Saleh Hardani",           position: "RB", club: "Esteghlal",             caps: 17, goals: 1 },
  { id: 1111, teamId: 11, number: 0, name: "Ali Nemati",              position: "CB", club: "Foolad",                caps: 15, goals: 0 },
  { id: 1112, teamId: 11, number: 0, name: "Aria Yousefi",            position: "CB", club: "Sepahan",               caps: 12, goals: 0 },
  { id: 1113, teamId: 11, number: 0, name: "Danial Eiri",             position: "LB", club: "Malavan",               caps: 0,  goals: 0 },
  { id: 1114, teamId: 11, number: 0, name: "Alireza Jahanbakhsh",     position: "RW", club: "Dender",                caps: 98, goals: 17, startX: 78, startY: 30 },
  { id: 1115, teamId: 11, number: 0, name: "Saeid Ezatolahi",         position: "DM", club: "Shabab Al-Ahli",        caps: 81, goals: 1, startX: 50, startY: 60 },
  { id: 1116, teamId: 11, number: 0, name: "Saman Ghoddos",           position: "AM", club: "Kalba",                 caps: 67, goals: 3, startX: 65, startY: 50 },
  { id: 1117, teamId: 11, number: 0, name: "Mahdi Torabi",            position: "AM", club: "Tractor",               caps: 51, goals: 7, startX: 35, startY: 55 },
  { id: 1118, teamId: 11, number: 0, name: "Rouzbeh Cheshmi",         position: "DM", club: "Esteghlal",             caps: 40, goals: 3 },
  { id: 1119, teamId: 11, number: 0, name: "Omid Noorafkan",          position: "CM", club: "Sepahan",               caps: 39, goals: 1 },
  { id: 1120, teamId: 11, number: 0, name: "Mohammad Mohebi",         position: "LW", club: "Rostov",                caps: 35, goals: 14, startX: 22, startY: 30 },
  { id: 1121, teamId: 11, number: 0, name: "Mohammad Ghorbani",       position: "CM", club: "Al-Wahda",              caps: 14, goals: 0 },
  { id: 1122, teamId: 11, number: 0, name: "Amirmohammad Razzaghinia",position: "CM", club: "Esteghlal",             caps: 2,  goals: 0 },
  { id: 1123, teamId: 11, number: 0, name: "Hadi Habibinejad",        position: "CM", club: "Chadormalou",           caps: 0,  goals: 0 },
  { id: 1124, teamId: 11, number: 0, name: "Mehdi Taremi",            position: "ST", club: "Olympiacos",            caps: 103,goals: 59, startX: 50, startY: 18 },
  { id: 1125, teamId: 11, number: 0, name: "Mehdi Ghayedi",           position: "ST", club: "Al-Nasr",               caps: 29, goals: 10 },
  { id: 1126, teamId: 11, number: 0, name: "Amirhossein Hosseinzadeh",position: "ST", club: "Tractor",               caps: 16, goals: 5 },
  { id: 1127, teamId: 11, number: 0, name: "Ali Alipour",             position: "ST", club: "Persepolis",            caps: 12, goals: 1 },
  { id: 1128, teamId: 11, number: 0, name: "Kasra Taheri",            position: "ST", club: "Paykan",                caps: 2,  goals: 0 },
  { id: 1129, teamId: 11, number: 0, name: "Amirhossein Mahmoudi",    position: "ST", club: "Persepolis",            caps: 1,  goals: 0 },
  { id: 1130, teamId: 11, number: 0, name: "Dennis Eckert",           position: "ST", club: "Standard Liège",        caps: 0,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Iraq · Group I · preliminary (34 — final 1 Jun)
// ─────────────────────────────────────────────────────────────────────────────
const IRAQ: Player[] = [
  { id: 2701, teamId: 27, number: 0, name: "Jalal Hassan",            position: "GK", club: "Al-Zawraa",             caps: 100,goals: 0, startX: 50, startY: 92, isCaptain: true },
  { id: 2702, teamId: 27, number: 0, name: "Fahad Talib",             position: "GK", club: "Al-Talaba",             caps: 20, goals: 0 },
  { id: 2703, teamId: 27, number: 0, name: "Ahmed Basil",             position: "GK", club: "Al-Shorta",             caps: 14, goals: 0 },
  { id: 2704, teamId: 27, number: 0, name: "Kumel Al-Rekabe",         position: "GK", club: "Erbil",                 caps: 0,  goals: 0 },
  { id: 2705, teamId: 27, number: 0, name: "Rebin Sulaka",            position: "CB", club: "FC Porto",              caps: 54, goals: 1, startX: 38, startY: 80 },
  { id: 2706, teamId: 27, number: 0, name: "Manaf Younis",            position: "CB", club: "Al-Shorta",             caps: 31, goals: 1, startX: 62, startY: 80 },
  { id: 2707, teamId: 27, number: 0, name: "Merchas Doski",           position: "LB", club: "Viktoria Plzeň",        caps: 30, goals: 0, startX: 18, startY: 75 },
  { id: 2708, teamId: 27, number: 0, name: "Hussein Ali",             position: "CB", club: "Pogoń Szczecin",        caps: 25, goals: 1 },
  { id: 2709, teamId: 27, number: 0, name: "Zaid Tahseen",            position: "RB", club: "Pakhtakor",             caps: 25, goals: 1, startX: 82, startY: 75 },
  { id: 2710, teamId: 27, number: 0, name: "Frans Putros",            position: "CB", club: "Persib",                caps: 25, goals: 0 },
  { id: 2711, teamId: 27, number: 0, name: "Maitham Jabbar",          position: "CB", club: "Al-Zawraa",             caps: 19, goals: 0 },
  { id: 2712, teamId: 27, number: 0, name: "Ahmed Yahya",             position: "CB", club: "Al-Shorta",             caps: 18, goals: 0 },
  { id: 2713, teamId: 27, number: 0, name: "Mustafa Saadoon",         position: "RB", club: "Al-Shorta",             caps: 14, goals: 0 },
  { id: 2714, teamId: 27, number: 0, name: "Akam Hashim",             position: "LB", club: "Al-Zawraa",             caps: 11, goals: 1 },
  { id: 2715, teamId: 27, number: 0, name: "Ahmed Maknzi",            position: "CB", club: "Al-Karma",              caps: 5,  goals: 0 },
  { id: 2716, teamId: 27, number: 0, name: "Dario Naamo",             position: "CB", club: "Dundee United",         caps: 0,  goals: 0 },
  { id: 2717, teamId: 27, number: 0, name: "Ibrahim Bayesh",          position: "AM", club: "Al-Dhafra",             caps: 74, goals: 8, startX: 65, startY: 50 },
  { id: 2718, teamId: 27, number: 0, name: "Amir Al-Ammari",          position: "CM", club: "Cracovia",              caps: 49, goals: 3, startX: 35, startY: 55 },
  { id: 2719, teamId: 27, number: 0, name: "Ali Jasim",               position: "AM", club: "Al-Najma",              caps: 35, goals: 2 },
  { id: 2720, teamId: 27, number: 0, name: "Youssef Amyn",            position: "CM", club: "AEK Larnaca",           caps: 25, goals: 2 },
  { id: 2721, teamId: 27, number: 0, name: "Zidane Iqbal",            position: "CM", club: "FC Utrecht",            caps: 22, goals: 2, startX: 50, startY: 60 },
  { id: 2722, teamId: 27, number: 0, name: "Hasan Abdulkareem",       position: "CM", club: "Al-Zawraa",             caps: 21, goals: 1 },
  { id: 2723, teamId: 27, number: 0, name: "Marko Farji",             position: "CM", club: "Venezia",               caps: 9,  goals: 0 },
  { id: 2724, teamId: 27, number: 0, name: "Karrar Nabeel",           position: "CM", club: "Al-Zawraa",             caps: 8,  goals: 0 },
  { id: 2725, teamId: 27, number: 0, name: "Kevin Yakob",             position: "CM", club: "AGF",                   caps: 6,  goals: 0 },
  { id: 2726, teamId: 27, number: 0, name: "Aimar Sher",              position: "CM", club: "Sarpsborg",             caps: 5,  goals: 0 },
  { id: 2727, teamId: 27, number: 0, name: "Zaid Ismail",             position: "CM", club: "Al-Talaba",             caps: 4,  goals: 0 },
  { id: 2728, teamId: 27, number: 0, name: "Peter Gwargis",           position: "CM", club: "Dohuk",                 caps: 3,  goals: 0 },
  { id: 2729, teamId: 27, number: 0, name: "Jussef Nasrawe",          position: "CM", club: "SV Ried",               caps: 0,  goals: 0 },
  { id: 2730, teamId: 27, number: 0, name: "Ahmed Qasem",             position: "CM", club: "Nashville SC",          caps: 0,  goals: 0 },
  { id: 2731, teamId: 27, number: 0, name: "Aymen Hussein",           position: "ST", club: "Al-Karma",              caps: 93, goals: 33, startX: 50, startY: 18 },
  { id: 2732, teamId: 27, number: 0, name: "Mohanad Ali",             position: "ST", club: "Dibba",                 caps: 70, goals: 27 },
  { id: 2733, teamId: 27, number: 0, name: "Ali Al-Hamadi",           position: "ST", club: "Luton Town",            caps: 17, goals: 5, startX: 78, startY: 30 },
  { id: 2734, teamId: 27, number: 0, name: "Ali Yousif",              position: "ST", club: "Al-Talaba",             caps: 5,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Egypt · Group G · preliminary (27 — final 29 May)
// ─────────────────────────────────────────────────────────────────────────────
const EGYPT: Player[] = [
  { id: 1601, teamId: 16, number: 0, name: "Mohamed El Shenawy",      position: "GK", club: "Al Ahly",               caps: 75, goals: 0, startX: 50, startY: 92 },
  { id: 1602, teamId: 16, number: 0, name: "Mostafa Shobeir",         position: "GK", club: "Al Ahly",               caps: 7,  goals: 0 },
  { id: 1603, teamId: 16, number: 0, name: "Mohamed Alaa",            position: "GK", club: "El Gouna",              caps: 0,  goals: 0 },
  { id: 1604, teamId: 16, number: 0, name: "El Mahdy Soliman",        position: "GK", club: "Zamalek",               caps: 0,  goals: 0 },
  { id: 1605, teamId: 16, number: 0, name: "Ramy Rabia",              position: "CB", club: "Al Ain",                caps: 43, goals: 5, startX: 38, startY: 80 },
  { id: 1606, teamId: 16, number: 0, name: "Mohamed Hany",            position: "RB", club: "Al Ahly",               caps: 40, goals: 0, startX: 82, startY: 75 },
  { id: 1607, teamId: 16, number: 0, name: "Ahmed Abou El Fotouh",    position: "LB", club: "Zamalek",               caps: 38, goals: 1, startX: 18, startY: 75 },
  { id: 1608, teamId: 16, number: 0, name: "Mohamed Abdelmonem",      position: "CB", club: "Nice",                  caps: 34, goals: 3, startX: 62, startY: 80 },
  { id: 1609, teamId: 16, number: 0, name: "Yasser Ibrahim",          position: "CB", club: "Al Ahly",               caps: 15, goals: 1 },
  { id: 1610, teamId: 16, number: 0, name: "Hossam Abdelmaguid",      position: "CB", club: "Zamalek",               caps: 12, goals: 0 },
  { id: 1611, teamId: 16, number: 0, name: "Karim Hafez",             position: "LB", club: "Pyramids",              caps: 7,  goals: 0 },
  { id: 1612, teamId: 16, number: 0, name: "Tarek Alaa",              position: "CB", club: "ZED",                   caps: 1,  goals: 0 },
  { id: 1613, teamId: 16, number: 0, name: "Hamdy Fathy",             position: "CM", club: "Al-Wakrah",             caps: 62, goals: 3, startX: 35, startY: 55 },
  { id: 1614, teamId: 16, number: 0, name: "Marwan Attia",            position: "DM", club: "Al Ahly",               caps: 32, goals: 1, startX: 50, startY: 60 },
  { id: 1615, teamId: 16, number: 0, name: "Emam Ashour",             position: "AM", club: "Al Ahly",               caps: 27, goals: 0, startX: 65, startY: 50 },
  { id: 1616, teamId: 16, number: 0, name: "Mohanad Lasheen",         position: "CM", club: "Pyramids",              caps: 21, goals: 0 },
  { id: 1617, teamId: 16, number: 0, name: "Mahmoud Saber",           position: "CM", club: "ZED",                   caps: 14, goals: 1 },
  { id: 1618, teamId: 16, number: 0, name: "Nabil Emad",              position: "CM", club: "Al-Najma",              caps: 8,  goals: 0 },
  { id: 1619, teamId: 16, number: 0, name: "Mostafa Ziko",            position: "CM", club: "Pyramids",              caps: 0,  goals: 0 },
  { id: 1620, teamId: 16, number: 0, name: "Mohamed Salah",           position: "RW", club: "Liverpool",             caps: 116,goals: 67, startX: 78, startY: 30, isCaptain: true },
  { id: 1621, teamId: 16, number: 0, name: "Trézéguet",               position: "LW", club: "Al Ahly",               caps: 94, goals: 23, startX: 22, startY: 30 },
  { id: 1622, teamId: 16, number: 0, name: "Zizo",                    position: "AM", club: "Al Ahly",               caps: 61, goals: 5 },
  { id: 1623, teamId: 16, number: 0, name: "Omar Marmoush",           position: "ST", club: "Manchester City",       caps: 47, goals: 11, startX: 50, startY: 18 },
  { id: 1624, teamId: 16, number: 0, name: "Ibrahim Adel",            position: "ST", club: "FC Nordsjælland",       caps: 22, goals: 3 },
  { id: 1625, teamId: 16, number: 0, name: "Haissem Hassan",          position: "ST", club: "Oviedo",                caps: 2,  goals: 0 },
  { id: 1626, teamId: 16, number: 0, name: "Aqtay Abdallah",          position: "ST", club: "ENPPI",                 caps: 0,  goals: 0 },
  { id: 1627, teamId: 16, number: 0, name: "Hamza Abdelkarim",        position: "ST", club: "Barcelona B",           caps: 0,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Qatar · Group B · preliminary (35)
// ─────────────────────────────────────────────────────────────────────────────
const QATAR: Player[] = [
  { id: 4701, teamId: 47, number: 0, name: "Meshaal Barsham",         position: "GK", club: "Al-Sadd",               caps: 52, goals: 0, startX: 50, startY: 92 },
  { id: 4702, teamId: 47, number: 0, name: "Salah Zakaria",           position: "GK", club: "Al-Duhail",             caps: 8,  goals: 0 },
  { id: 4703, teamId: 47, number: 0, name: "Mahmud Abunada",          position: "GK", club: "Al-Rayyan",             caps: 3,  goals: 0 },
  { id: 4704, teamId: 47, number: 0, name: "Shehab Ellethy",          position: "GK", club: "Al-Shahaniya",          caps: 1,  goals: 0 },
  { id: 4705, teamId: 47, number: 0, name: "Boualem Khoukhi",         position: "CB", club: "Al-Sadd",               caps: 114,goals: 20, startX: 38, startY: 80 },
  { id: 4706, teamId: 47, number: 0, name: "Pedro Miguel",            position: "CB", club: "Al-Sadd",               caps: 97, goals: 3, startX: 62, startY: 80 },
  { id: 4707, teamId: 47, number: 0, name: "Tarek Salman",            position: "CB", club: "Al-Sadd",               caps: 90, goals: 0 },
  { id: 4708, teamId: 47, number: 0, name: "Bassam Al-Rawi",          position: "CB", club: "Al-Duhail",             caps: 70, goals: 2 },
  { id: 4709, teamId: 47, number: 0, name: "Homam Ahmed",             position: "LB", club: "Cultural Leonesa",      caps: 66, goals: 3, startX: 18, startY: 75 },
  { id: 4710, teamId: 47, number: 0, name: "Lucas Mendes",            position: "CB", club: "Al-Wakrah",             caps: 24, goals: 1 },
  { id: 4711, teamId: 47, number: 0, name: "Sultan Al-Brake",         position: "RB", club: "Al-Duhail",             caps: 16, goals: 0, startX: 82, startY: 75 },
  { id: 4712, teamId: 47, number: 0, name: "Al-Hashmi Al-Hussain",    position: "CB", club: "Al-Arabi",              caps: 6,  goals: 0 },
  { id: 4713, teamId: 47, number: 0, name: "Ayoub Al-Oui",            position: "CB", club: "Al-Gharafa",            caps: 4,  goals: 0 },
  { id: 4714, teamId: 47, number: 0, name: "Issa Laye",               position: "CB", club: "Al-Arabi",              caps: 2,  goals: 0 },
  { id: 4715, teamId: 47, number: 0, name: "Rayyan Al-Ali",           position: "CB", club: "Al-Gharafa",            caps: 0,  goals: 0 },
  { id: 4716, teamId: 47, number: 0, name: "Niall Mason",             position: "CB", club: "Qatar SC",              caps: 0,  goals: 0 },
  { id: 4717, teamId: 47, number: 0, name: "Karim Boudiaf",           position: "DM", club: "Al-Duhail",             caps: 116,goals: 5, startX: 50, startY: 60 },
  { id: 4718, teamId: 47, number: 0, name: "Abdulaziz Hatem",         position: "CM", club: "Al-Rayyan",             caps: 116,goals: 11, startX: 65, startY: 50 },
  { id: 4719, teamId: 47, number: 0, name: "Assim Madibo",            position: "DM", club: "Al-Wakrah",             caps: 49, goals: 0, startX: 35, startY: 55 },
  { id: 4720, teamId: 47, number: 0, name: "Mohammed Waad",           position: "CM", club: "Al-Shamal",             caps: 49, goals: 0 },
  { id: 4721, teamId: 47, number: 0, name: "Ahmed Fathy",             position: "CM", club: "Al-Arabi",              caps: 46, goals: 0 },
  { id: 4722, teamId: 47, number: 0, name: "Jassem Gaber",            position: "CM", club: "Al-Rayyan",             caps: 31, goals: 1 },
  { id: 4723, teamId: 47, number: 0, name: "Mohamed Al-Mannai",       position: "CM", club: "Al-Shamal",             caps: 8,  goals: 0 },
  { id: 4724, teamId: 47, number: 0, name: "Tahsin Mohammed",         position: "CM", club: "Al-Duhail",             caps: 1,  goals: 0 },
  { id: 4725, teamId: 47, number: 0, name: "Hassan Al-Haydos",        position: "AM", club: "Al-Sadd",               caps: 184,goals: 41, isCaptain: true },
  { id: 4726, teamId: 47, number: 0, name: "Sebastián Soria",         position: "ST", club: "Qatar SC",              caps: 124,goals: 39 },
  { id: 4727, teamId: 47, number: 0, name: "Akram Afif",              position: "LW", club: "Al-Sadd",               caps: 123,goals: 39, startX: 22, startY: 30 },
  { id: 4728, teamId: 47, number: 0, name: "Almoez Ali",              position: "ST", club: "Al-Duhail",             caps: 114,goals: 55, startX: 50, startY: 18 },
  { id: 4729, teamId: 47, number: 0, name: "Mohammed Muntari",        position: "ST", club: "Al-Gharafa",            caps: 67, goals: 16 },
  { id: 4730, teamId: 47, number: 0, name: "Ahmed Alaaeldin",         position: "ST", club: "Al-Rayyan",             caps: 66, goals: 9 },
  { id: 4731, teamId: 47, number: 0, name: "Yusuf Abdurisag",         position: "RW", club: "Al-Wakrah",             caps: 37, goals: 3, startX: 78, startY: 30 },
  { id: 4732, teamId: 47, number: 0, name: "Edmilson Junior",         position: "ST", club: "Al-Duhail",             caps: 14, goals: 0 },
  { id: 4733, teamId: 47, number: 0, name: "Ahmed Al-Ganehi",         position: "ST", club: "Al-Gharafa",            caps: 13, goals: 1 },
  { id: 4734, teamId: 47, number: 0, name: "Mubarak Shanan",          position: "ST", club: "Al-Duhail",             caps: 2,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Türkiye · Group D · preliminary (35)
// ─────────────────────────────────────────────────────────────────────────────
const TURKIYE: Player[] = [
  { id: 4501, teamId: 45, number: 0, name: "Uğurcan Çakır",           position: "GK", club: "Galatasaray",           caps: 38, goals: 0, startX: 50, startY: 92 },
  { id: 4502, teamId: 45, number: 0, name: "Mert Günok",              position: "GK", club: "Fenerbahçe",            caps: 37, goals: 0 },
  { id: 4503, teamId: 45, number: 0, name: "Altay Bayındır",          position: "GK", club: "Manchester United",     caps: 11, goals: 0 },
  { id: 4504, teamId: 45, number: 0, name: "Muhammed Şengezer",       position: "GK", club: "İstanbul Başakşehir",   caps: 0,  goals: 0 },
  { id: 4505, teamId: 45, number: 0, name: "Ersin Destanoğlu",        position: "GK", club: "Beşiktaş",              caps: 0,  goals: 0 },
  { id: 4506, teamId: 45, number: 0, name: "Merih Demiral",           position: "CB", club: "Al-Ahli",               caps: 61, goals: 6, startX: 38, startY: 80, isCaptain: true },
  { id: 4507, teamId: 45, number: 0, name: "Zeki Çelik",              position: "RB", club: "Roma",                  caps: 59, goals: 3, startX: 82, startY: 75 },
  { id: 4508, teamId: 45, number: 0, name: "Çağlar Söyüncü",          position: "CB", club: "Fenerbahçe",            caps: 59, goals: 2, startX: 62, startY: 80 },
  { id: 4509, teamId: 45, number: 0, name: "Mert Müldür",             position: "RB", club: "Fenerbahçe",            caps: 43, goals: 3 },
  { id: 4510, teamId: 45, number: 0, name: "Ferdi Kadıoğlu",          position: "LB", club: "Brighton",              caps: 30, goals: 2, startX: 18, startY: 75 },
  { id: 4511, teamId: 45, number: 0, name: "Ozan Kabak",              position: "CB", club: "Hoffenheim",            caps: 28, goals: 2 },
  { id: 4512, teamId: 45, number: 0, name: "Abdülkerim Bardakcı",     position: "CB", club: "Galatasaray",           caps: 26, goals: 2 },
  { id: 4513, teamId: 45, number: 0, name: "Eren Elmalı",             position: "LB", club: "Galatasaray",           caps: 21, goals: 0 },
  { id: 4514, teamId: 45, number: 0, name: "Samet Akaydin",           position: "CB", club: "Çaykur Rizespor",       caps: 18, goals: 1 },
  { id: 4515, teamId: 45, number: 0, name: "Mustafa Eskihellaç",      position: "LB", club: "Trabzonspor",           caps: 3,  goals: 0 },
  { id: 4516, teamId: 45, number: 0, name: "Yusuf Akçiçek",           position: "CB", club: "Al-Hilal",              caps: 3,  goals: 0 },
  { id: 4517, teamId: 45, number: 0, name: "Ahmetcan Kaplan",         position: "CB", club: "NEC",                   caps: 0,  goals: 0 },
  { id: 4518, teamId: 45, number: 0, name: "Hakan Çalhanoğlu",        position: "AM", club: "Inter Milan",           caps: 104,goals: 22, startX: 65, startY: 50 },
  { id: 4519, teamId: 45, number: 0, name: "Kaan Ayhan",              position: "DM", club: "Galatasaray",           caps: 72, goals: 5, startX: 50, startY: 60 },
  { id: 4520, teamId: 45, number: 0, name: "Orkun Kökçü",             position: "CM", club: "Beşiktaş",              caps: 48, goals: 3, startX: 35, startY: 55 },
  { id: 4521, teamId: 45, number: 0, name: "İsmail Yüksek",           position: "DM", club: "Fenerbahçe",            caps: 31, goals: 1 },
  { id: 4522, teamId: 45, number: 0, name: "Salih Özcan",             position: "DM", club: "Borussia Dortmund",     caps: 28, goals: 1 },
  { id: 4523, teamId: 45, number: 0, name: "Atakan Karazor",          position: "DM", club: "VfB Stuttgart",         caps: 2,  goals: 0 },
  { id: 4524, teamId: 45, number: 0, name: "Demir Ege Tıknaz",        position: "CM", club: "Braga",                 caps: 1,  goals: 0 },
  { id: 4525, teamId: 45, number: 0, name: "Kerem Aktürkoğlu",        position: "LW", club: "Fenerbahçe",            caps: 51, goals: 15, startX: 22, startY: 30 },
  { id: 4526, teamId: 45, number: 0, name: "İrfan Can Kahveci",       position: "AM", club: "Kasımpaşa",             caps: 45, goals: 6 },
  { id: 4527, teamId: 45, number: 0, name: "Barış Alper Yılmaz",      position: "RW", club: "Galatasaray",           caps: 33, goals: 2, startX: 78, startY: 30 },
  { id: 4528, teamId: 45, number: 0, name: "Arda Güler",              position: "AM", club: "Real Madrid",           caps: 28, goals: 6 },
  { id: 4529, teamId: 45, number: 0, name: "Kenan Yıldız",            position: "AM", club: "Juventus",              caps: 28, goals: 5 },
  { id: 4530, teamId: 45, number: 0, name: "Yunus Akgün",             position: "RW", club: "Galatasaray",           caps: 17, goals: 3 },
  { id: 4531, teamId: 45, number: 0, name: "Oğuz Aydın",              position: "ST", club: "Fenerbahçe",            caps: 9,  goals: 0 },
  { id: 4532, teamId: 45, number: 0, name: "Deniz Gül",               position: "ST", club: "FC Porto",              caps: 6,  goals: 1, startX: 50, startY: 18 },
  { id: 4533, teamId: 45, number: 0, name: "Yusuf Sarı",              position: "ST", club: "Başakşehir",            caps: 6,  goals: 1 },
  { id: 4534, teamId: 45, number: 0, name: "Can Uzun",                position: "ST", club: "Eintracht Frankfurt",   caps: 4,  goals: 0 },
  { id: 4535, teamId: 45, number: 0, name: "Aral Şimşir",             position: "ST", club: "Midtjylland",           caps: 0,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Czechia · Group A · preliminary (54 — final 31 May)
// Trimmed to the most likely 30 (highest-capped or most-recent form).
// ─────────────────────────────────────────────────────────────────────────────
const CZECHIA: Player[] = [
  { id: 4901, teamId: 49, number: 0, name: "Matěj Kovář",             position: "GK", club: "PSV Eindhoven",         caps: 19, goals: 0, startX: 50, startY: 92 },
  { id: 4902, teamId: 49, number: 0, name: "Jindřich Staněk",         position: "GK", club: "Slavia Praha",          caps: 14, goals: 0 },
  { id: 4903, teamId: 49, number: 0, name: "Antonín Kinský",          position: "GK", club: "Tottenham",             caps: 0,  goals: 0 },
  { id: 4904, teamId: 49, number: 0, name: "Vladimír Coufal",         position: "RB", club: "Hoffenheim",            caps: 61, goals: 2, startX: 82, startY: 75 },
  { id: 4905, teamId: 49, number: 0, name: "Tomáš Holeš",             position: "CB", club: "Slavia Praha",          caps: 39, goals: 2, startX: 38, startY: 80 },
  { id: 4906, teamId: 49, number: 0, name: "Ladislav Krejčí",         position: "CB", club: "Wolverhampton",         caps: 25, goals: 5, startX: 62, startY: 80, isCaptain: true },
  { id: 4907, teamId: 49, number: 0, name: "David Zima",              position: "CB", club: "Slavia Praha",          caps: 24, goals: 1 },
  { id: 4908, teamId: 49, number: 0, name: "Jaroslav Zelený",         position: "LB", club: "Sparta Praha",          caps: 21, goals: 0, startX: 18, startY: 75 },
  { id: 4909, teamId: 49, number: 0, name: "David Jurásek",           position: "LB", club: "Slavia Praha",          caps: 16, goals: 1 },
  { id: 4910, teamId: 49, number: 0, name: "David Douděra",           position: "RB", club: "Slavia Praha",          caps: 15, goals: 2 },
  { id: 4911, teamId: 49, number: 0, name: "Robin Hranáč",            position: "CB", club: "Hoffenheim",            caps: 12, goals: 1 },
  { id: 4912, teamId: 49, number: 0, name: "Václav Jemelka",          position: "CB", club: "Viktoria Plzeň",        caps: 12, goals: 0 },
  { id: 4913, teamId: 49, number: 0, name: "Martin Vitík",            position: "CB", club: "Bologna",               caps: 9,  goals: 0 },
  { id: 4914, teamId: 49, number: 0, name: "Tomáš Souček",            position: "DM", club: "West Ham United",       caps: 89, goals: 17, startX: 50, startY: 60 },
  { id: 4915, teamId: 49, number: 0, name: "Vladimír Darida",         position: "CM", club: "Hradec Králové",        caps: 78, goals: 8 },
  { id: 4916, teamId: 49, number: 0, name: "Lukáš Provod",            position: "CM", club: "Slavia Praha",          caps: 37, goals: 3, startX: 35, startY: 55 },
  { id: 4917, teamId: 49, number: 0, name: "Michal Sadílek",          position: "CM", club: "Slavia Praha",          caps: 33, goals: 1 },
  { id: 4918, teamId: 49, number: 0, name: "Pavel Šulc",              position: "AM", club: "Lyon",                  caps: 20, goals: 5, startX: 65, startY: 50 },
  { id: 4919, teamId: 49, number: 0, name: "Lukáš Červ",              position: "CM", club: "Viktoria Plzeň",        caps: 15, goals: 2 },
  { id: 4920, teamId: 49, number: 0, name: "Adam Karabec",            position: "AM", club: "Lyon",                  caps: 5,  goals: 2 },
  { id: 4921, teamId: 49, number: 0, name: "Patrik Schick",           position: "ST", club: "Bayer Leverkusen",      caps: 52, goals: 25, startX: 50, startY: 18 },
  { id: 4922, teamId: 49, number: 0, name: "Matěj Vydra",             position: "ST", club: "Viktoria Plzeň",        caps: 48, goals: 7 },
  { id: 4923, teamId: 49, number: 0, name: "Adam Hložek",             position: "RW", club: "Hoffenheim",            caps: 41, goals: 4, startX: 78, startY: 30 },
  { id: 4924, teamId: 49, number: 0, name: "Jan Kuchta",              position: "ST", club: "Sparta Praha",          caps: 30, goals: 3 },
  { id: 4925, teamId: 49, number: 0, name: "Tomáš Chorý",             position: "ST", club: "Slavia Praha",          caps: 21, goals: 6 },
  { id: 4926, teamId: 49, number: 0, name: "Mojmír Chytil",           position: "ST", club: "Slavia Praha",          caps: 21, goals: 6 },
  { id: 4927, teamId: 49, number: 0, name: "Jan Kliment",             position: "LW", club: "Sigma Olomouc",         caps: 10, goals: 1, startX: 22, startY: 30 },
  { id: 4928, teamId: 49, number: 0, name: "Vasil Kušej",             position: "LW", club: "Slavia Praha",          caps: 6,  goals: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Paraguay · Group D · preliminary (55 — trimmed to most likely 30)
// ─────────────────────────────────────────────────────────────────────────────
const PARAGUAY: Player[] = [
  { id: 4301, teamId: 43, number: 0, name: "Gatito Fernández",        position: "GK", club: "Cerro Porteño",         caps: 30, goals: 0, startX: 50, startY: 92 },
  { id: 4302, teamId: 43, number: 0, name: "Carlos Coronel",          position: "GK", club: "São Paulo",             caps: 9,  goals: 0 },
  { id: 4303, teamId: 43, number: 0, name: "Orlando Gill",            position: "GK", club: "San Lorenzo",           caps: 5,  goals: 0 },
  { id: 4304, teamId: 43, number: 0, name: "Gustavo Gómez",           position: "CB", club: "Palmeiras",             caps: 88, goals: 4, startX: 38, startY: 80, isCaptain: true },
  { id: 4305, teamId: 43, number: 0, name: "Júnior Alonso",           position: "CB", club: "Atlético Mineiro",      caps: 70, goals: 3, startX: 62, startY: 80 },
  { id: 4306, teamId: 43, number: 0, name: "Fabián Balbuena",         position: "CB", club: "Grêmio",                caps: 47, goals: 2 },
  { id: 4307, teamId: 43, number: 0, name: "Omar Alderete",           position: "CB", club: "Sunderland",            caps: 35, goals: 3 },
  { id: 4308, teamId: 43, number: 0, name: "Juan Cáceres",            position: "RB", club: "Dynamo Moskva",         caps: 16, goals: 0, startX: 82, startY: 75 },
  { id: 4309, teamId: 43, number: 0, name: "Blas Riveros",            position: "LB", club: "Cerro Porteño",         caps: 15, goals: 0, startX: 18, startY: 75 },
  { id: 4310, teamId: 43, number: 0, name: "Gustavo Velázquez",       position: "CB", club: "Cerro Porteño",         caps: 12, goals: 1 },
  { id: 4311, teamId: 43, number: 0, name: "Alan Benítez",            position: "RB", club: "Libertad",              caps: 8,  goals: 0 },
  { id: 4312, teamId: 43, number: 0, name: "Agustín Sández",          position: "LB", club: "Rosario Central",       caps: 5,  goals: 0 },
  { id: 4313, teamId: 43, number: 0, name: "Diego León",              position: "LB", club: "Manchester United",     caps: 1,  goals: 0 },
  { id: 4314, teamId: 43, number: 0, name: "Miguel Almirón",          position: "AM", club: "Atlanta United",        caps: 75, goals: 9, startX: 65, startY: 50 },
  { id: 4315, teamId: 43, number: 0, name: "Mathías Villasanti",      position: "DM", club: "Grêmio",                caps: 51, goals: 0, startX: 50, startY: 60 },
  { id: 4316, teamId: 43, number: 0, name: "Andrés Cubas",            position: "DM", club: "Vancouver Whitecaps",   caps: 32, goals: 0 },
  { id: 4317, teamId: 43, number: 0, name: "Kaku",                    position: "AM", club: "Al Ain",                caps: 32, goals: 5 },
  { id: 4318, teamId: 43, number: 0, name: "Ramón Sosa",              position: "LW", club: "Palmeiras",             caps: 28, goals: 1, startX: 22, startY: 30 },
  { id: 4319, teamId: 43, number: 0, name: "Diego Gómez",             position: "CM", club: "Brighton",              caps: 23, goals: 3, startX: 35, startY: 55 },
  { id: 4320, teamId: 43, number: 0, name: "Damián Bobadilla",        position: "CM", club: "São Paulo",             caps: 19, goals: 1 },
  { id: 4321, teamId: 43, number: 0, name: "Braian Ojeda",            position: "DM", club: "Orlando City",          caps: 16, goals: 0 },
  { id: 4322, teamId: 43, number: 0, name: "Matías Galarza",          position: "CM", club: "Atlanta United",        caps: 14, goals: 2 },
  { id: 4323, teamId: 43, number: 0, name: "Óscar Romero",            position: "AM", club: "Huracán",               caps: 55, goals: 4 },
  { id: 4324, teamId: 43, number: 0, name: "Ángel Romero",            position: "ST", club: "Boca Juniors",          caps: 51, goals: 8 },
  { id: 4325, teamId: 43, number: 0, name: "Antonio Sanabria",        position: "ST", club: "Cremonese",             caps: 47, goals: 7, startX: 50, startY: 18 },
  { id: 4326, teamId: 43, number: 0, name: "Julio Enciso",            position: "AM", club: "Strasbourg",            caps: 31, goals: 4 },
  { id: 4327, teamId: 43, number: 0, name: "Gabriel Ávalos",          position: "ST", club: "Independiente",         caps: 22, goals: 2 },
  { id: 4328, teamId: 43, number: 0, name: "Carlos González",         position: "ST", club: "Independiente del Valle", caps: 15, goals: 0 },
  { id: 4329, teamId: 43, number: 0, name: "Álex Arce",               position: "ST", club: "Independiente Rivadavia", caps: 14, goals: 1 },
  { id: 4330, teamId: 43, number: 0, name: "Adam Bareiro",            position: "ST", club: "Boca Juniors",          caps: 8,  goals: 0, startX: 78, startY: 30 },
];

export const WAVE3_SQUADS: Record<number, Player[]> = {
  11: IRAN,
  16: EGYPT,
  27: IRAQ,
  35: JORDAN,
  43: PARAGUAY,
  45: TURKIYE,
  47: QATAR,
  49: CZECHIA,
  55: CAPE_VERDE,
};
