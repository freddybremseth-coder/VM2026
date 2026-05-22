/**
 * Mock match-event provider.
 *
 * For matchId === 1001 (Norway–Spain demo) we use the hard-coded fixture.
 * For all other matches we generate deterministic data seeded by matchId so
 * every page reload returns the same numbers.
 */

import type { MatchEventData, ShotEvent, XGTimelinePoint, PlayerHeatmap } from "./types";

// ---------------------------------------------------------------------------
// Tiny seeded PRNG (mulberry32) so results are reproducible per matchId
// ---------------------------------------------------------------------------
function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------
function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length)];
}

function gauss(rng: () => number, mean: number, std: number): number {
  // Box-Muller
  const u = rng(), v = rng();
  const n = Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
  return mean + std * n;
}

// ---------------------------------------------------------------------------
// Norway–Spain hard-coded events (trimmed subset — full data from JSON)
// ---------------------------------------------------------------------------
const NOR_ESP_SHOTS: ShotEvent[] = [
  { id: "s1", minute: 8, side: "home", playerName: "Erling Haaland", x: 89, y: 53, xg: 0.37, outcome: "saved", bodyPart: "right-foot", situation: "open-play" },
  { id: "s2", minute: 12, side: "away", playerName: "Pedri", x: 78, y: 48, xg: 0.09, outcome: "off-target", bodyPart: "right-foot", situation: "open-play" },
  { id: "s3", minute: 19, side: "home", playerName: "Alexander Sørloth", x: 82, y: 55, xg: 0.14, outcome: "blocked", bodyPart: "left-foot", situation: "corner" },
  { id: "s4", minute: 27, side: "away", playerName: "Álvaro Morata", x: 91, y: 50, xg: 0.41, outcome: "goal", bodyPart: "head", situation: "corner" },
  { id: "s5", minute: 33, side: "home", playerName: "Erling Haaland", x: 94, y: 48, xg: 0.68, outcome: "goal", bodyPart: "right-foot", situation: "open-play" },
  { id: "s6", minute: 38, side: "away", playerName: "Rodri", x: 72, y: 52, xg: 0.06, outcome: "off-target", bodyPart: "right-foot", situation: "open-play" },
  { id: "s7", minute: 44, side: "home", playerName: "Martin Ødegaard", x: 76, y: 46, xg: 0.08, outcome: "saved", bodyPart: "right-foot", situation: "free-kick" },
  { id: "s8", minute: 51, side: "away", playerName: "Pedri", x: 85, y: 51, xg: 0.22, outcome: "post", bodyPart: "right-foot", situation: "open-play" },
  { id: "s9", minute: 58, side: "home", playerName: "Erling Haaland", x: 95, y: 50, xg: 0.75, outcome: "goal", bodyPart: "right-foot", situation: "open-play" },
  { id: "s10", minute: 64, side: "away", playerName: "Álvaro Morata", x: 88, y: 52, xg: 0.31, outcome: "saved", bodyPart: "head", situation: "corner" },
  { id: "s11", minute: 71, side: "away", playerName: "Ferran Torres", x: 84, y: 44, xg: 0.18, outcome: "off-target", bodyPart: "left-foot", situation: "open-play" },
  { id: "s12", minute: 78, side: "home", playerName: "Sander Berge", x: 70, y: 58, xg: 0.04, outcome: "blocked", bodyPart: "right-foot", situation: "open-play" },
  { id: "s13", minute: 83, side: "away", playerName: "Dani Olmo", x: 80, y: 47, xg: 0.13, outcome: "saved", bodyPart: "right-foot", situation: "open-play" },
  { id: "s14", minute: 87, side: "home", playerName: "Erling Haaland", x: 93, y: 51, xg: 0.55, outcome: "saved", bodyPart: "right-foot", situation: "open-play", assistedBy: "M. Ødegaard" },
  { id: "s15", minute: 90, side: "away", playerName: "Álvaro Morata", x: 90, y: 53, xg: 0.29, outcome: "blocked", bodyPart: "head", situation: "corner" },
];

function buildXGTimeline(shots: ShotEvent[]): XGTimelinePoint[] {
  const points: XGTimelinePoint[] = [{ minute: 0, home: 0, away: 0 }];
  let home = 0, away = 0;
  for (let min = 1; min <= 90; min++) {
    const minuteShots = shots.filter((s) => s.minute === min);
    for (const s of minuteShots) {
      if (s.side === "home") home += s.xg;
      else away += s.xg;
    }
    if (minuteShots.length > 0 || min % 5 === 0) {
      points.push({ minute: min, home: parseFloat(home.toFixed(3)), away: parseFloat(away.toFixed(3)) });
    }
  }
  return points;
}

// ---------------------------------------------------------------------------
// Heatmap generator (Gaussian touches around a positional mean)
// ---------------------------------------------------------------------------
const POSITION_MEANS: Record<string, [number, number]> = {
  GK:  [8,  50],
  CB:  [22, 50],
  LB:  [25, 20],
  RB:  [25, 80],
  CDM: [38, 50],
  CM:  [50, 50],
  LM:  [50, 18],
  RM:  [50, 82],
  CAM: [62, 50],
  LW:  [70, 15],
  RW:  [70, 85],
  ST:  [82, 50],
  CF:  [78, 50],
};

function buildHeatmapGrid(rng: () => number, posX: number, posY: number, touches: number): number[][] {
  const ROWS = 8, COLS = 12;
  const grid: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
  for (let t = 0; t < touches; t++) {
    const gx = gauss(rng, posX / 100, 0.12);
    const gy = gauss(rng, posY / 100, 0.12);
    const col = Math.min(COLS - 1, Math.max(0, Math.floor(gx * COLS)));
    const row = Math.min(ROWS - 1, Math.max(0, Math.floor(gy * ROWS)));
    grid[row][col]++;
  }
  // Normalise to 0-1
  const max = Math.max(...grid.flat(), 1);
  return grid.map((row) => row.map((v) => parseFloat((v / max).toFixed(3))));
}

// ---------------------------------------------------------------------------
// Generic match generator (for any match ID)
// ---------------------------------------------------------------------------
const GENERIC_HOME_NAMES = ["M. Rashford", "K. Mbappe", "V. Osimhen", "R. Lewandowski", "H. Kane"];
const GENERIC_AWAY_NAMES = ["L. Messi", "K. Benzema", "E. Cavani", "R. Firmino", "T. Werner"];
const BODY_PARTS = ["right-foot", "left-foot", "head", "other"] as const;
const SITUATIONS = ["open-play", "set-piece", "corner", "free-kick", "counter"] as const;
const OUTCOMES_NON_GOAL = ["saved", "blocked", "off-target", "post"] as const;

function generateShots(matchId: number): ShotEvent[] {
  const rng = seededRng(matchId * 31337);
  const homeShots = 7 + Math.floor(rng() * 8);   // 7–14
  const awayShots = 6 + Math.floor(rng() * 8);   // 6–13
  const shots: ShotEvent[] = [];
  let id = 0;

  const addShots = (count: number, side: "home" | "away") => {
    const names = side === "home" ? GENERIC_HOME_NAMES : GENERIC_AWAY_NAMES;
    for (let i = 0; i < count; i++) {
      const minute = 1 + Math.floor(rng() * 89);
      const x = 65 + rng() * 30;
      const y = 30 + rng() * 40;
      const dist = Math.sqrt((100 - x) ** 2 + (50 - y) ** 2);
      // Raw xG proxy — closer + central = higher
      const rawXg = Math.max(0.02, 0.7 * Math.exp(-dist / 15) + rng() * 0.05);
      const xg = parseFloat(Math.min(0.9, rawXg).toFixed(3));
      const isGoal = rng() < xg * 0.55;
      shots.push({
        id: `s${++id}`,
        minute,
        side,
        playerName: pick(names, rng()),
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        xg,
        outcome: isGoal ? "goal" : pick([...OUTCOMES_NON_GOAL], rng()),
        bodyPart: pick([...BODY_PARTS], rng()),
        situation: pick([...SITUATIONS], rng()),
      });
    }
  };

  addShots(homeShots, "home");
  addShots(awayShots, "away");
  shots.sort((a, b) => a.minute - b.minute);
  return shots;
}

function generateHeatmaps(matchId: number, homeName: string, awayName: string): PlayerHeatmap[] {
  const rng = seededRng(matchId * 99991);
  const maps: PlayerHeatmap[] = [];
  const positions = Object.keys(POSITION_MEANS);

  for (let i = 0; i < 3; i++) {
    const pos = positions[i % positions.length];
    const [px, py] = POSITION_MEANS[pos];
    const touches = 20 + Math.floor(rng() * 50);
    maps.push({
      playerId: 1000 + i,
      playerName: pick(["A. Player", "B. Player", "C. Player", "D. Player"], rng()),
      side: "home",
      touches,
      grid: buildHeatmapGrid(rng, px, py, touches),
    });
  }
  for (let i = 0; i < 3; i++) {
    const pos = positions[(i + 5) % positions.length];
    const [px, py] = POSITION_MEANS[pos];
    const touches = 20 + Math.floor(rng() * 50);
    maps.push({
      playerId: 2000 + i,
      playerName: pick(["E. Player", "F. Player", "G. Player", "H. Player"], rng()),
      side: "away",
      touches,
      grid: buildHeatmapGrid(rng, px, py, touches),
    });
  }

  return maps;
}

// ---------------------------------------------------------------------------
// Haaland + Ødegaard heatmaps for the demo match
// ---------------------------------------------------------------------------
// Real squad player IDs (must match wc26-squads.ts)
const DEMO_HEATMAPS: PlayerHeatmap[] = (() => {
  const rng1 = seededRng(111);
  const rng2 = seededRng(222);
  const rng3 = seededRng(333);
  const rng4 = seededRng(444);
  return [
    { playerId: 2122, playerName: "E. Haaland", side: "home", touches: 28,
      grid: buildHeatmapGrid(rng1, 82, 50, 28) },
    { playerId: 2120, playerName: "M. Ødegaard", side: "home", touches: 55,
      grid: buildHeatmapGrid(rng2, 62, 48, 55) },
    { playerId: 2216, playerName: "Á. Morata", side: "away", touches: 26,
      grid: buildHeatmapGrid(rng3, 80, 50, 26) },
    { playerId: 2212, playerName: "Pedri", side: "away", touches: 68,
      grid: buildHeatmapGrid(rng4, 58, 52, 68) },
  ];
})();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function fetchMockEvents(matchId: number): Promise<MatchEventData> {
  if (matchId === 1001) {
    const shots = NOR_ESP_SHOTS;
    return {
      matchId: 1001,
      status: "finished",
      homeName: "Norway",
      awayName: "Spain",
      homeShort: "NOR",
      awayShort: "ESP",
      xgTimeline: buildXGTimeline(shots),
      shots,
      heatmaps: DEMO_HEATMAPS,
      source: "mock",
      generatedAt: new Date().toISOString(),
    };
  }

  const shots = generateShots(matchId);
  const rng = seededRng(matchId);
  const homeShort = pick(["BRA", "ARG", "FRA", "ENG", "GER", "POR", "ITA", "NED", "BEL", "USA"], rng());
  const awayShort = pick(["MEX", "JAP", "MAR", "SEN", "CRO", "URU", "DEN", "AUT", "ECU", "CHE"], rng());
  return {
    matchId,
    status: "scheduled",
    homeName: homeShort,
    awayName: awayShort,
    homeShort,
    awayShort,
    xgTimeline: buildXGTimeline(shots),
    shots,
    heatmaps: generateHeatmaps(matchId, homeShort, awayShort),
    source: "mock",
    generatedAt: new Date().toISOString(),
  };
}
