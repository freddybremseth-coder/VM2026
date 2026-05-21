"use client";

import { useMemo, useState } from "react";
import { Shuffle, Crown, ArrowRight, Flag } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import {
  modeLabel,
  modeDescription,
  pickWinner,
  seedR32,
  simulate,
  type SimulatorMode,
  type WCTeam,
} from "@/lib/bracket-simulator";

/**
 * Interactive bracket. User can:
 *   - Pick winners manually by clicking a team
 *   - Auto-fill the whole tree with rank / chaos / norway mode
 *   - Re-roll chaos mode
 *
 * State lives in component memory — user reloads = bracket resets. We can
 * persist to localStorage / Supabase in a later sprint.
 */
export function BracketSimulator() {
  const seed = useMemo(() => seedR32(), []);
  const [mode, setMode] = useState<SimulatorMode>("rank");
  /** winners[round][tieIndex] — undefined means "not yet picked". */
  const [picks, setPicks] = useState<(WCTeam | undefined)[][]>([[], [], [], [], []]);

  function applyMode(m: SimulatorMode) {
    setMode(m);
    const sim = simulate(seed, m);
    setPicks(sim.rounds.map((r) => r.winners));
  }

  function clear() {
    setMode("rank");
    setPicks([[], [], [], [], []]);
  }

  function pick(roundIdx: number, tieIdx: number, team: WCTeam) {
    setPicks((prev) => {
      const next = prev.map((r) => [...r]);
      next[roundIdx][tieIdx] = team;
      // Invalidate downstream picks since the tree shape changed.
      for (let r = roundIdx + 1; r < next.length; r++) next[r] = [];
      return next;
    });
  }

  // Build ties per round from current state.
  const rounds = useMemo(() => {
    const rs: { name: string; ties: Array<[WCTeam, WCTeam]>; winners: (WCTeam | undefined)[] }[] = [];
    let current: WCTeam[] = seed;
    const names = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];
    for (let r = 0; r < names.length; r++) {
      const ties: Array<[WCTeam, WCTeam]> = [];
      for (let i = 0; i < current.length; i += 2) {
        ties.push([current[i], current[i + 1]]);
      }
      const winners = picks[r] ?? [];
      rs.push({ name: names[r], ties, winners });
      // Advance only the picked winners to the next round.
      const nextRound: WCTeam[] = [];
      for (let i = 0; i < ties.length; i++) {
        const w = winners[i];
        if (!w) break; // gap — can't advance further until user picks
        nextRound.push(w);
      }
      if (nextRound.length !== current.length / 2) {
        // Round not fully picked — stop building further rounds.
        rs.push(
          ...names.slice(r + 1).map((n) => ({
            name: n,
            ties: [] as Array<[WCTeam, WCTeam]>,
            winners: [] as (WCTeam | undefined)[],
          })),
        );
        break;
      }
      current = nextRound;
    }
    return rs;
  }, [seed, picks]);

  const champion = rounds[4]?.winners[0];

  return (
    <div className="space-y-5">
      <div className="card-panel p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="text-xs font-semibold text-pitch-200 mb-0.5">Auto-fill bracket</div>
          <div className="text-[11px] text-pitch-500">{modeDescription(mode)}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ModeButton mode="rank"   current={mode} onClick={applyMode} />
          <ModeButton mode="norway" current={mode} onClick={applyMode} icon={<Flag size={12} />} />
          <ModeButton mode="chaos"  current={mode} onClick={applyMode} icon={<Shuffle size={12} />} />
          <button
            type="button"
            onClick={clear}
            className="text-[11px] uppercase tracking-widest font-mono px-3 py-1.5 rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-300"
          >
            Clear
          </button>
        </div>
      </div>

      {champion && (
        <div className="card-panel p-5 ring-1 ring-accent-500/30 flex items-center gap-4 bg-gradient-to-r from-accent-500/10 via-transparent to-transparent">
          <div className="h-12 w-12 rounded-md bg-accent-500/15 flex items-center justify-center shrink-0">
            <Crown size={22} className="text-draw" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold">
              Your predicted champion
            </div>
            <div className="text-2xl font-bold tracking-tight mt-0.5 flex items-center gap-2">
              <TeamFlag code={champion.flag} size="md" />
              {champion.name}
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-widest font-mono text-pitch-400 hidden sm:block">
            {modeLabel(mode)}
          </div>
        </div>
      )}

      <div className="card-panel p-5 overflow-x-auto">
        <div className="flex gap-5 min-w-max">
          {rounds.map((round, ri) => (
            <div key={round.name} className="flex-1 min-w-[220px]">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold">
                  {round.name}
                </span>
                <span className="text-[10px] font-mono text-pitch-500">
                  {round.ties.length}
                </span>
              </div>
              <div
                className="flex flex-col"
                style={{
                  gap:
                    round.ties.length === 1
                      ? "24px"
                      : `${Math.max(8, 220 / round.ties.length - 28)}px`,
                }}
              >
                {round.ties.length === 0 && (
                  <div className="text-[11px] text-pitch-500 italic">
                    Pick winners above to unlock this round.
                  </div>
                )}
                {round.ties.map((tie, ti) => (
                  <TieCard
                    key={ti}
                    a={tie[0]}
                    b={tie[1]}
                    winner={round.winners[ti]}
                    onPick={(team) => pick(ri, ti, team)}
                    isFinal={round.name === "Final"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  mode,
  current,
  onClick,
  icon,
}: {
  mode: SimulatorMode;
  current: SimulatorMode;
  onClick: (m: SimulatorMode) => void;
  icon?: React.ReactNode;
}) {
  const active = mode === current;
  return (
    <button
      type="button"
      onClick={() => onClick(mode)}
      className={`text-[11px] uppercase tracking-widest font-mono px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
        active
          ? "bg-accent-500 text-pitch-950 font-semibold"
          : "bg-pitch-800 hover:bg-pitch-700 text-pitch-300"
      }`}
    >
      {icon}
      {modeLabel(mode)}
    </button>
  );
}

function TieCard({
  a,
  b,
  winner,
  onPick,
  isFinal,
}: {
  a: WCTeam;
  b: WCTeam;
  winner?: WCTeam;
  onPick: (team: WCTeam) => void;
  isFinal: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-[11px] ${
        isFinal
          ? "border-accent-500/40 bg-accent-500/5"
          : "border-pitch-700/60 bg-pitch-900/40"
      }`}
    >
      <TeamRow team={a} picked={winner === a} onClick={() => onPick(a)} hasOther={winner === b} />
      <div className="border-t border-pitch-800 my-1.5" />
      <TeamRow team={b} picked={winner === b} onClick={() => onPick(b)} hasOther={winner === a} />
    </div>
  );
}

function TeamRow({
  team,
  picked,
  onClick,
  hasOther,
}: {
  team: WCTeam;
  picked: boolean;
  onClick: () => void;
  hasOther: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 py-0.5 px-1 rounded transition-colors ${
        picked
          ? "text-accent-300 font-semibold"
          : hasOther
            ? "text-pitch-500"
            : "text-pitch-200 hover:bg-pitch-800/60"
      }`}
    >
      <TeamFlag code={team.flag} size="sm" />
      <span className="flex-1 text-left truncate">{team.name}</span>
      {picked && <ArrowRight size={11} className="text-accent-400" />}
    </button>
  );
}
