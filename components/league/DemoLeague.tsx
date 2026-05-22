"use client";

/**
 * DemoLeague — shows unauthenticated visitors exactly what a mini-league
 * feels like: a live leaderboard, invite mechanic, and AI banter report.
 *
 * No real data — every row is seeded fiction, but the layout, scores and
 * report text are realistic enough to communicate the value proposition.
 */

import { useState } from "react";
import Link from "next/link";
import { Crown, Users, Sparkles, Share2, ChevronDown, ChevronUp, Trophy, ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------
const DEMO_LEAGUE = {
  name: "Oslo Tipping FC",
  description: "Kontorligaen — beste tipper vinner en boks øl 🍺",
  inviteCode: "OSLO-4829",
  members: 8,
  banterHeadline: "Halvveis: Morten er skambra, men Hanne nekter å gi seg",
  banterLines: [
    "Morten leder med 47 poeng etter å ha gjettet 3 av 4 eksakte score i åpningsrunden — inkludert Norges 2-1 over Frankrike som alle andre avskrev.",
    "Hanne (2. plass, 39 p) tar igjen bakken raskt takket være to korrekte utfall i kveld og et poengtap for Morten på Argentina-kampen.",
    "Lukas på sisteplass trøster seg med at han «var nær» fire ganger — noe ChatGenius-modellen setter den matematiske sannsynligheten for til omtrent 12 %.",
  ],
};

const DEMO_MEMBERS = [
  { rank: 1, name: "Morten H.",  pts: 47, exact: 3, correct: 8,  last3: ["W","W","W"] as const, you: false },
  { rank: 2, name: "Hanne K.",   pts: 39, exact: 1, correct: 9,  last3: ["W","W","D"] as const, you: false },
  { rank: 3, name: "Du",         pts: 36, exact: 2, correct: 7,  last3: ["W","D","L"] as const, you: true  },
  { rank: 4, name: "Jonas A.",   pts: 31, exact: 1, correct: 6,  last3: ["D","W","L"] as const, you: false },
  { rank: 5, name: "Sara N.",    pts: 28, exact: 0, correct: 7,  last3: ["L","W","D"] as const, you: false },
  { rank: 6, name: "Erik T.",    pts: 22, exact: 1, correct: 5,  last3: ["L","L","W"] as const, you: false },
  { rank: 7, name: "Camilla B.", pts: 18, exact: 0, correct: 4,  last3: ["D","L","L"] as const, you: false },
  { rank: 8, name: "Lukas R.",   pts: 11, exact: 0, correct: 3,  last3: ["L","L","L"] as const, you: false },
];

type Color = "W" | "D" | "L";
const DOT_STYLE: Record<Color, string> = {
  W: "bg-win/25 text-win ring-win/40",
  D: "bg-draw/20 text-draw ring-draw/30",
  L: "bg-loss/15 text-loss ring-loss/30",
};
const DOT_LABEL: Record<Color, string> = { W: "W", D: "U", L: "T" };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DemoLeague() {
  const [banterOpen, setBanterOpen] = useState(false);

  return (
    <section className="space-y-3">
      {/* Header pill */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
          Slik ser det ut
        </span>
        <span className="h-px flex-1 bg-pitch-800" />
        <span className="text-[10px] uppercase tracking-widest text-accent-400 font-mono">
          Live demo
        </span>
      </div>

      {/* League header card */}
      <div className="card-panel p-4 sm:p-5 ring-1 ring-accent-500/20">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + info */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent-500 to-data-600 flex items-center justify-center text-pitch-950 font-bold text-lg shrink-0">
              🏆
            </div>
            <div>
              <div className="font-semibold text-sm">{DEMO_LEAGUE.name}</div>
              <div className="text-xs text-pitch-400 mt-0.5">{DEMO_LEAGUE.description}</div>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-pitch-500 font-mono">
                <span className="flex items-center gap-1">
                  <Users size={10} /> {DEMO_LEAGUE.members} deltakere
                </span>
                <span>·</span>
                <span>
                  Kode:{" "}
                  <code className="bg-pitch-800 px-1.5 py-0.5 rounded text-pitch-200">
                    {DEMO_LEAGUE.inviteCode}
                  </code>
                </span>
              </div>
            </div>
          </div>
          {/* Share button (disabled in demo) */}
          <button
            disabled
            className="shrink-0 flex items-center gap-1.5 rounded-md bg-pitch-800 text-pitch-500 text-xs font-semibold px-3 py-1.5 cursor-not-allowed"
            title="Tilgjengelig etter innlogging"
          >
            <Share2 size={12} /> Del
          </button>
        </div>
      </div>

      {/* AI Banter report — collapsible */}
      <div className="card-panel ring-1 ring-accent-500/15 overflow-hidden">
        <button
          type="button"
          onClick={() => setBanterOpen(!banterOpen)}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <div className="h-8 w-8 rounded-md bg-accent-500/15 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-accent-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{DEMO_LEAGUE.banterHeadline}</div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
              ChatGenius · ukentlig banter-rapport
            </div>
          </div>
          {banterOpen ? (
            <ChevronUp size={14} className="text-pitch-400 shrink-0" />
          ) : (
            <ChevronDown size={14} className="text-pitch-400 shrink-0" />
          )}
        </button>
        {banterOpen && (
          <div className="px-4 pb-4 border-t border-pitch-700/40 pt-3 space-y-2">
            {DEMO_LEAGUE.banterLines.map((line, i) => (
              <p key={i} className="text-sm text-pitch-200 leading-relaxed flex gap-2">
                <span className="text-accent-400 font-mono text-xs mt-0.5 shrink-0">›</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="card-panel overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Trophy size={13} className="text-draw" />
            <span className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
              Ledertavle
            </span>
          </div>
          <span className="text-[10px] font-mono text-pitch-500">
            Etter runde 1
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-pitch-500 border-b border-pitch-700/60">
              <th className="text-left px-4 py-2 w-10">#</th>
              <th className="text-left px-4 py-2">Spiller</th>
              <th className="text-right px-4 py-2 font-mono hidden sm:table-cell">Eks.</th>
              <th className="text-right px-4 py-2 font-mono hidden sm:table-cell">Rett</th>
              <th className="text-center px-4 py-2 hidden md:table-cell">Siste 3</th>
              <th className="text-right px-4 py-2 w-20 font-mono">Poeng</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_MEMBERS.map((m) => (
              <tr
                key={m.rank}
                className={`border-b border-pitch-800 last:border-b-0 transition-colors ${
                  m.you
                    ? "bg-accent-500/5 ring-1 ring-inset ring-accent-500/20"
                    : "hover:bg-pitch-800/30"
                }`}
              >
                <td className="px-4 py-2.5 font-mono text-pitch-400 stat-num">
                  {m.rank === 1 ? (
                    <Crown size={13} className="text-draw" />
                  ) : (
                    m.rank
                  )}
                </td>
                <td className="px-4 py-2.5 font-medium text-pitch-100">
                  {m.name}
                  {m.you && (
                    <span className="ml-2 text-[10px] uppercase tracking-widest font-mono text-accent-400">
                      deg
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-pitch-300 stat-num hidden sm:table-cell">
                  {m.exact}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-pitch-300 stat-num hidden sm:table-cell">
                  {m.correct}
                </td>
                <td className="px-4 py-2.5 hidden md:table-cell">
                  <div className="flex items-center justify-center gap-1">
                    {m.last3.map((c, i) => (
                      <span
                        key={i}
                        className={`h-5 w-5 inline-flex items-center justify-center rounded-sm text-[9px] font-bold font-mono ring-1 ${DOT_STYLE[c]}`}
                      >
                        {DOT_LABEL[c]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-semibold stat-num text-accent-300">
                  {m.pts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-pitch-700/40 flex items-center justify-between gap-3">
          <p className="text-[11px] text-pitch-500">
            3 p for eksakt score · 1 p for riktig utfall
          </p>
          <span className="text-[10px] text-pitch-600 italic">Demo</span>
        </div>
      </div>

      {/* CTA row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/register"
          className="card-panel p-4 flex items-center justify-between gap-3 ring-1 ring-accent-500/30 hover:ring-accent-500/60 transition-all group"
        >
          <div>
            <div className="text-sm font-semibold">Lag din egen liga</div>
            <div className="text-xs text-pitch-400 mt-0.5">
              Del invitasjonslenke — venner kan bli med på sekunder
            </div>
          </div>
          <ArrowRight size={16} className="text-accent-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Link>
        <Link
          href="/login"
          className="card-panel p-4 flex items-center justify-between gap-3 hover:border-pitch-600 transition-colors group"
        >
          <div>
            <div className="text-sm font-semibold">Bli med i en eksisterende</div>
            <div className="text-xs text-pitch-400 mt-0.5">
              Har du en invitasjonskode? Logg inn og bruk den
            </div>
          </div>
          <ArrowRight size={16} className="text-pitch-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Link>
      </div>
    </section>
  );
}
