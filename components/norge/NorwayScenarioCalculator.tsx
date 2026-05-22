"use client";

/**
 * NorwayScenarioCalculator — interactive Group I scenario tool.
 *
 * Shows all 6 group matches. User clicks W/D/L for each match to set
 * hypothetical results. Standings update live and a verdict shows
 * Norway's qualification status.
 */

import { useState } from "react";
import { RotateCcw, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Result = "H" | "D" | "A" | null; // home win, draw, away win, unplayed

interface GroupMatch {
  id: number;
  md: number;
  home: TeamKey;
  away: TeamKey;
  dateLabel: string;
}

type TeamKey = "NOR" | "FRA" | "SEN" | "IRQ";

interface Standing {
  team: TeamKey;
  played: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

// ---------------------------------------------------------------------------
// Group I data (all 6 fixtures)
// ---------------------------------------------------------------------------
const MATCHES: GroupMatch[] = [
  { id: 17, md: 1, home: "FRA", away: "SEN", dateLabel: "16. jun" },
  { id: 18, md: 1, home: "IRQ", away: "NOR", dateLabel: "16. jun" },
  { id: 41, md: 2, home: "FRA", away: "IRQ", dateLabel: "22. jun" },
  { id: 42, md: 2, home: "NOR", away: "SEN", dateLabel: "23. jun" },
  { id: 65, md: 3, home: "NOR", away: "FRA", dateLabel: "26. jun" },
  { id: 66, md: 3, home: "SEN", away: "IRQ", dateLabel: "26. jun" },
];

const TEAM_NAMES: Record<TeamKey, string> = {
  NOR: "Norge", FRA: "Frankrike", SEN: "Senegal", IRQ: "Irak",
};

const TEAM_FLAGS: Record<TeamKey, string> = {
  NOR: "🇳🇴", FRA: "🇫🇷", SEN: "🇸🇳", IRQ: "🇮🇶",
};

// Estimated goals when result is fixed (used to compute GD for tiebreak).
const SCORE_PROXY: Record<Result & string, [number, number]> = {
  H: [2, 0], D: [1, 1], A: [0, 2],
};

// ---------------------------------------------------------------------------
// Standings calculation
// ---------------------------------------------------------------------------
function emptyStanding(team: TeamKey): Standing {
  return { team, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
}

function calcStandings(results: Record<number, Result>): Standing[] {
  const map: Record<TeamKey, Standing> = {
    NOR: emptyStanding("NOR"),
    FRA: emptyStanding("FRA"),
    SEN: emptyStanding("SEN"),
    IRQ: emptyStanding("IRQ"),
  };

  for (const m of MATCHES) {
    const r = results[m.id];
    if (!r) continue;
    const [hg, ag] = SCORE_PROXY[r];
    const h = map[m.home];
    const a = map[m.away];

    h.played++; a.played++;
    h.gf += hg; h.ga += ag;
    a.gf += ag; a.ga += hg;

    if (r === "H") { h.w++; h.pts += 3; a.l++; }
    else if (r === "D") { h.d++; h.pts += 1; a.d++; a.pts += 1; }
    else { h.l++; a.w++; a.pts += 3; }
  }

  return Object.values(map).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

// ---------------------------------------------------------------------------
// Qualification verdict for Norway
// ---------------------------------------------------------------------------
type Verdict = "automatic" | "likely-3rd" | "possible-3rd" | "eliminated" | "unknown";

function getVerdict(standings: Standing[], results: Record<number, Result>): Verdict {
  const allPlayed = MATCHES.every((m) => results[m.id] !== null && results[m.id] !== undefined);
  const nor = standings.find((s) => s.team === "NOR")!;
  const norPos = standings.indexOf(nor) + 1;

  if (!allPlayed) return "unknown";
  if (norPos <= 2) return "automatic";
  if (norPos === 3) {
    if (nor.pts >= 5) return "likely-3rd";
    if (nor.pts >= 4) return "possible-3rd";
    return "eliminated";
  }
  return "eliminated";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function NorwayScenarioCalculator() {
  const [results, setResults] = useState<Record<number, Result>>({});

  function setResult(matchId: number, r: Result) {
    setResults((prev) => ({ ...prev, [matchId]: r }));
  }

  function reset() {
    setResults({});
  }

  const standings = calcStandings(results);
  const verdict = getVerdict(standings, results);
  const norPos = standings.indexOf(standings.find((s) => s.team === "NOR")!) + 1;
  const allPlayed = MATCHES.every((m) => results[m.id] != null);

  return (
    <div className="card-panel p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-0.5">
            Interaktiv kalkulator
          </div>
          <h2 className="text-sm font-semibold">Gruppe I · Scenario-verktøy</h2>
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-pitch-400 hover:text-pitch-200 transition-colors"
        >
          <RotateCcw size={12} /> Nullstill
        </button>
      </div>

      {/* Verdict banner */}
      {allPlayed && <VerdictBanner verdict={verdict} pos={norPos} />}
      {!allPlayed && (
        <p className="text-xs text-pitch-500 italic">
          Velg resultat for alle 6 kamper for å se Norges kvalifiseringsstatus.
        </p>
      )}

      {/* Match pickers grouped by matchday */}
      {[1, 2, 3].map((md) => {
        const mdMatches = MATCHES.filter((m) => m.md === md);
        return (
          <div key={md}>
            <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono mb-2">
              Runde {md}
            </div>
            <div className="space-y-2">
              {mdMatches.map((m) => (
                <MatchRow
                  key={m.id}
                  match={m}
                  result={results[m.id] ?? null}
                  onChange={(r) => setResult(m.id, r)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Live standings */}
      <div>
        <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono mb-2">
          Stillingstabell
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-pitch-500 text-left border-b border-pitch-700/40">
                <th className="pb-1.5 pr-2 w-6">#</th>
                <th className="pb-1.5 pr-2">Lag</th>
                <th className="pb-1.5 pr-1.5 text-center font-mono w-8">K</th>
                <th className="pb-1.5 pr-1.5 text-center font-mono w-8">V</th>
                <th className="pb-1.5 pr-1.5 text-center font-mono w-8">U</th>
                <th className="pb-1.5 pr-1.5 text-center font-mono w-8">T</th>
                <th className="pb-1.5 pr-1.5 text-center font-mono w-10">MF</th>
                <th className="pb-1.5 text-center font-mono w-8 text-accent-300">P</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitch-800/40">
              {standings.map((s, i) => {
                const isNor = s.team === "NOR";
                const qualifies = i < 2;
                return (
                  <tr
                    key={s.team}
                    className={`${isNor ? "bg-accent-500/5" : ""}`}
                  >
                    <td className="py-1.5 pr-2">
                      <span
                        className={`font-mono stat-num ${
                          qualifies ? "text-win" : "text-pitch-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2">
                      <span className="mr-1">{TEAM_FLAGS[s.team]}</span>
                      <span className={isNor ? "font-bold text-accent-300" : "text-pitch-200"}>
                        {TEAM_NAMES[s.team]}
                      </span>
                    </td>
                    <td className="py-1.5 pr-1.5 text-center font-mono text-pitch-400 stat-num">{s.played}</td>
                    <td className="py-1.5 pr-1.5 text-center font-mono text-pitch-400 stat-num">{s.w}</td>
                    <td className="py-1.5 pr-1.5 text-center font-mono text-pitch-400 stat-num">{s.d}</td>
                    <td className="py-1.5 pr-1.5 text-center font-mono text-pitch-400 stat-num">{s.l}</td>
                    <td className="py-1.5 pr-1.5 text-center font-mono text-pitch-400 stat-num">
                      {s.gf > 0 || s.ga > 0 ? `${s.gf > 0 ? "+" : ""}${s.gf - s.ga}` : "—"}
                    </td>
                    <td className="py-1.5 text-center font-mono font-bold stat-num text-accent-300">{s.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-pitch-600">
          Topp 2 avanserer direkte · 8 beste treer-lag avanserer via beste-av-12-grupper-regel
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Match result picker row
// ---------------------------------------------------------------------------
function MatchRow({
  match,
  result,
  onChange,
}: {
  match: GroupMatch;
  result: Result;
  onChange: (r: Result) => void;
}) {
  const isNorMatch = match.home === "NOR" || match.away === "NOR";

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 rounded-md px-3 py-2 ${
        isNorMatch
          ? "bg-accent-500/5 ring-1 ring-accent-500/20"
          : "bg-pitch-800/30"
      }`}
    >
      {/* Teams */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 text-xs">
        <span className="font-mono text-pitch-500 w-14 shrink-0 text-right text-[10px] hidden sm:block">
          {match.dateLabel}
        </span>
        <span className={`truncate font-medium ${match.home === "NOR" ? "text-accent-300" : "text-pitch-200"}`}>
          {TEAM_FLAGS[match.home]} {match.home}
        </span>
        <span className="text-pitch-600 font-mono shrink-0">vs</span>
        <span className={`truncate font-medium ${match.away === "NOR" ? "text-accent-300" : "text-pitch-200"}`}>
          {TEAM_FLAGS[match.away]} {match.away}
        </span>
      </div>

      {/* Result buttons: H = home win, D = draw, A = away win */}
      <div className="flex items-center gap-1 shrink-0">
        {(["H", "D", "A"] as const).map((r) => {
          const label =
            r === "H" ? match.home : r === "A" ? match.away : "U";
          const isActive = result === r;
          const isNorWin =
            (r === "H" && match.home === "NOR") ||
            (r === "A" && match.away === "NOR");
          const isNorLoss =
            (r === "H" && match.away === "NOR") ||
            (r === "A" && match.home === "NOR");

          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(isActive ? null : r)}
              className={`w-10 h-7 rounded text-[10px] font-bold font-mono uppercase tracking-wide transition-all ${
                isActive
                  ? isNorWin
                    ? "bg-win text-pitch-950"
                    : isNorLoss
                    ? "bg-loss/80 text-pitch-100"
                    : "bg-draw text-pitch-950"
                  : "bg-pitch-800 text-pitch-400 hover:bg-pitch-700 hover:text-pitch-200"
              }`}
            >
              {label === "U" ? "U" : label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Verdict banner
// ---------------------------------------------------------------------------
function VerdictBanner({ verdict, pos }: { verdict: Verdict; pos: number }) {
  const configs = {
    automatic: {
      icon: <CheckCircle2 size={18} className="text-win shrink-0" />,
      bg: "bg-win/10 ring-win/30",
      text: "text-win",
      title: `Norge er videre! 🎉`,
      body: `${pos}. plass i Gruppe I — direkte til Round of 32.`,
    },
    "likely-3rd": {
      icon: <AlertCircle size={18} className="text-draw shrink-0" />,
      bg: "bg-draw/10 ring-draw/25",
      text: "text-draw",
      title: "Sannsynligvis videre som tredje",
      body: `${pos}. plass med nok poeng til å konkurrere om en av de 8 beste tredjeplassene.`,
    },
    "possible-3rd": {
      icon: <AlertCircle size={18} className="text-draw shrink-0" />,
      bg: "bg-draw/10 ring-draw/25",
      text: "text-draw",
      title: "Mulig videre — usikkert",
      body: "3. plass med marginal poengsum. Avhenger av resultater i de andre 11 gruppene.",
    },
    eliminated: {
      icon: <XCircle size={18} className="text-loss shrink-0" />,
      bg: "bg-loss/10 ring-loss/25",
      text: "text-loss",
      title: "Norge er ute",
      body: `4. plass — ikke nok til å kvalifisere seg videre med dette scenarioet.`,
    },
    unknown: {
      icon: null, bg: "", text: "", title: "", body: "",
    },
  };

  const c = configs[verdict];
  if (verdict === "unknown") return null;

  return (
    <div className={`flex items-start gap-3 rounded-md px-4 py-3 ring-1 ${c.bg}`}>
      {c.icon}
      <div>
        <div className={`text-sm font-semibold ${c.text}`}>{c.title}</div>
        <div className="text-xs text-pitch-300 mt-0.5">{c.body}</div>
      </div>
    </div>
  );
}
