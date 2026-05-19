export type MatchStatus = "scheduled" | "live" | "halftime" | "finished";

export interface TeamRef {
  id: number;
  name: string;
  shortName: string;
  flag: string;
}

export interface MatchSummary {
  id: number;
  stage: string;
  kickoff: string;
  venue: { name: string; city: string };
  status: MatchStatus;
  minute?: number;
  home: TeamRef;
  away: TeamRef;
  score?: { home: number; away: number };
  /** xG so far — used in cards for hint at quality of chances. */
  xg?: { home: number; away: number };
  possession?: { home: number; away: number };
}

export interface TopStat {
  label: string;
  value: string;
  context: string;
  trend?: "up" | "down" | "flat";
}

export interface DetailedTeam extends TeamRef {
  manager: string;
  formation: string;
}

export interface Goal {
  minute: number;
  team: "home" | "away";
  scorer: string;
  assist?: string;
  xg: number;
}

export interface XGPoint {
  minute: number;
  home: number;
  away: number;
}

export type ShotOutcome = "goal" | "saved" | "blocked" | "off-target" | "post";

export interface Shot {
  minute: number;
  team: "home" | "away";
  player: string;
  xg: number;
  outcome: ShotOutcome;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  xg: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
}

export interface AIPrediction {
  model: string;
  asOfMinute: number;
  probabilities: { home: number; draw: number; away: number };
  expectedFinalScore: { home: number; away: number };
  btts: number;
  over25: number;
  topFactors: string[];
}

export interface MatchDetail {
  id: number;
  stage: string;
  kickoff: string;
  venue: { name: string; city: string; capacity: number };
  status: MatchStatus;
  minute?: number;
  referee?: string;
  attendance?: number;
  teams: { home: DetailedTeam; away: DetailedTeam };
  score?: { home: number; away: number; ht?: { home: number; away: number } };
  goals: Goal[];
  stats: MatchStats;
  xgTimeline: XGPoint[];
  shots: Shot[];
  aiPrediction: AIPrediction;
}
