"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Shuffle, Crown, ArrowRight, Flag, Share2, Cpu, RotateCcw } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { teamName } from "@/lib/wc26-data";
import { Kicker } from "@/components/shared/EditorialKicker";
import {
  modeLabel,
  modeDescription,
  seedR32,
  simulate,
  type SimulatorMode,
  type WCTeam,
} from "@/lib/bracket-simulator";

/**
 * Interactive bracket. User can pick winners manually, auto-fill with
 * rank / norway / chaos mode, share the predicted champion. Persists to
 * localStorage so reloads keep the bracket.
 */
const STORAGE_KEY = "wc26.bracket.v1";

export function BracketSimulator() {
  const seed = useMemo(() => seedR32(), []);
  const [mode, setMode] = useState<SimulatorMode>("rank");
  const [picks, setPicks] = useState<(WCTeam | undefined)[][]>([[], [], [], [], []]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { mode?: SimulatorMode; picks?: string[][] };
      if (parsed.mode === "rank" || parsed.mode === "chaos" || parsed.mode === "norway") {
        setMode(parsed.mode);
      }
      if (Array.isArray(parsed.picks)) {
        const fromCodes: (WCTeam | undefined)[][] = parsed.picks.map((round) =>
          round.map((code) => seed.find((t) => t.shortName === code)).concat([]),
        );
        setPicks(fromCodes);
      }
    } catch {
      // ignore
    }
  }, [seed]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload = JSON.stringify({
        mode,
        picks: picks.map((round) => round.map((t) => t?.shortName ?? "")),
      });
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch {
      // ignore
    }
  }, [hydrated, mode, picks]);

  function applyMode(m: SimulatorMode) {
    setMode(m);
    const sim = simulate(seed, m);
    setPicks(sim.rounds.map((r) => r.winners));
  }

  function clear() {
    setMode("rank");
    setPicks([[], [], [], [], []]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function pick(roundIdx: number, tieIdx: number, team: WCTeam) {
    setPicks((prev) => {
      const next = prev.map((r) => [...r]);
      next[roundIdx][tieIdx] = team;
      for (let r = roundIdx + 1; r < next.length; r++) next[r] = [];
      return next;
    });
  }

  const rounds = useMemo(() => {
    const rs: { name: string; ties: Array<[WCTeam, WCTeam]>; winners: (WCTeam | undefined)[] }[] = [];
    let current: WCTeam[] = seed;
    const names = ["Runde av 32", "Runde av 16", "Kvartfinale", "Semifinale", "Finale"];
    for (let r = 0; r < names.length; r++) {
      const ties: Array<[WCTeam, WCTeam]> = [];
      for (let i = 0; i < current.length; i += 2) {
        ties.push([current[i], current[i + 1]]);
      }
      const winners = picks[r] ?? [];
      rs.push({ name: names[r], ties, winners });
      const nextRound: WCTeam[] = [];
      for (let i = 0; i < ties.length; i++) {
        const w = winners[i];
        if (!w) break;
        nextRound.push(w);
      }
      if (nextRound.length !== current.length / 2) {
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
      <div className="surface p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="font-serif text-sm font-semibold text-cream tracking-editorial">
            Auto-fyll sluttspill
          </div>
          <div className="text-[11px] text-cream/55 mt-0.5 font-mono">
            {modeDescription(mode)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ModeButton mode="rank" current={mode} onClick={applyMode} />
          <ModeButton mode="norway" current={mode} onClick={applyMode} icon={<Flag size={12} />} />
          <ModeButton mode="chaos" current={mode} onClick={applyMode} icon={<Shuffle size={12} />} />
          <button
            type="button"
            onClick={clear}
            className="text-[11px] uppercase tracking-kicker font-mono px-3 py-1.5 bg-paper hover:bg-paperHi border border-cream/8 text-cream/70 flex items-center gap-1.5"
            title="Tilbakestill"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>
      </div>

      {champion && (
        <>
          <div className="surface p-4 sm:p-5 ring-1 ring-signal/30 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-gradient-to-r from-signal/10 via-transparent to-transparent">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-12 w-12 bg-signal/15 flex items-center justify-center shrink-0">
                <Crown size={22} className="text-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <Kicker tone="signal">Din spådde mester</Kicker>
                <div className="font-serif text-2xl sm:text-3xl font-semibold tracking-editorial mt-1 flex items-center gap-2.5">
                  <HoloFlag code={champion.flag} w={32} shimmer="strong" />
                  <span className="truncate">{teamName(champion)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:shrink-0">
              <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 hidden sm:block">
                {modeLabel(mode)}
              </div>
              <Link
                href={`/share/bracket/${champion.shortName}`}
                className="flex-1 sm:flex-initial text-center bg-signal hover:bg-signalD text-cream text-xs font-semibold px-3 py-1.5 flex items-center justify-center gap-1.5"
              >
                <Share2 size={12} /> Del
              </Link>
            </div>
          </div>

          <CoachLine championShort={champion.shortName} mode={mode} />
        </>
      )}

      <div className="surface p-5 overflow-x-auto">
        <div className="flex gap-5 min-w-max">
          {rounds.map((round, ri) => (
            <div key={round.name} className="flex-1 min-w-[220px]">
              <div className="flex items-baseline justify-between mb-3">
                <span
                  className={`text-[10px] uppercase tracking-kicker font-mono font-semibold ${
                    round.name === "Finale" ? "text-signal" : "text-cream/70"
                  }`}
                >
                  {round.name}
                </span>
                <span className="text-[10px] font-mono text-cream/60 stat-num">
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
                  <div className="text-[11px] text-cream/60 italic font-serif">
                    Velg vinnere over for å låse opp denne runden.
                  </div>
                )}
                {round.ties.map((tie, ti) => (
                  <TieCard
                    key={ti}
                    a={tie[0]}
                    b={tie[1]}
                    winner={round.winners[ti]}
                    onPick={(team) => pick(ri, ti, team)}
                    isFinal={round.name === "Finale"}
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

function CoachLine({
  championShort,
  mode,
}: {
  championShort: string;
  mode: SimulatorMode;
}) {
  const [text, setText] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/bracket-coach?champion=${encodeURIComponent(championShort)}&mode=${mode}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          setText(data.coach ?? null);
          setModel(data.model ?? null);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setText(null);
          setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [championShort, mode]);

  return (
    <div className="surface p-4 sm:p-5 ring-1 ring-amber/20 relative">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 bg-amber/15 flex items-center justify-center shrink-0">
          <Cpu size={16} className="text-amber" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="font-serif text-sm font-semibold tracking-editorial text-cream">
              AI bracket coach
            </div>
            <span className="text-[10px] uppercase tracking-kicker text-cream/60 font-mono truncate">
              ChatGenius{model ? ` · ${model}` : ""}
            </span>
          </div>
          <div className="text-sm text-cream/85 leading-relaxed">
            {loading && !text ? (
              <span className="text-cream/60 italic font-serif">Tenker…</span>
            ) : (
              text ?? "—"
            )}
          </div>
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
      className={`text-[11px] uppercase tracking-kicker font-mono px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
        active
          ? "bg-signal text-cream font-semibold"
          : "bg-paper hover:bg-paperHi border border-cream/8 text-cream/70"
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
      className={`px-3 py-2 text-[11px] ${
        isFinal
          ? "ring-1 ring-signal/40 bg-signal/5"
          : "border border-cream/8 bg-paper"
      }`}
    >
      <TeamRow team={a} picked={winner === a} onClick={() => onPick(a)} hasOther={winner === b} />
      <div className="border-t border-cream/8 my-1.5" />
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
      className={`w-full flex items-center gap-2 py-0.5 px-1 transition-colors ${
        picked
          ? "text-signal font-semibold"
          : hasOther
            ? "text-cream/50"
            : "text-cream hover:bg-cream/5"
      }`}
    >
      <HoloFlag code={team.flag} w={18} radius={2} />
      <span className="flex-1 text-left truncate font-serif tracking-editorial">
        {teamName(team)}
      </span>
      {picked && <ArrowRight size={11} className="text-signal" />}
    </button>
  );
}
