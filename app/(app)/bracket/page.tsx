import { GitBranch, Trophy, MapPin } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { GROUPS, teamsByGroup, venueById, type WCTeam } from "@/lib/wc26-data";
import { fixturesByRound } from "@/lib/wc26-fixtures";
import { formatKickoff } from "@/lib/utils";

export default function BracketPage() {
  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
          <GitBranch size={12} />
          Tournament tree
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Group stage & knockout bracket
        </h1>
        <p className="text-sm text-pitch-400 mt-1 max-w-3xl">
          48 teams across 12 groups · top 2 + 8 best third-placed teams advance
          to the Round of 32 · 32 knockout matches · final at MetLife Stadium on
          19 July 2026.
        </p>
      </header>

      <section>
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200 mb-3">
          Groups
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {GROUPS.map((g) => (
            <GroupCard key={g} group={g} teams={teamsByGroup(g)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200 mb-3 flex items-center gap-2">
          <Trophy size={12} /> Knockout bracket
        </h2>
        <KnockoutTree />
      </section>
    </div>
  );
}

function GroupCard({ group, teams }: { group: string; teams: WCTeam[] }) {
  return (
    <div className="card-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-widest text-accent-400 font-mono font-semibold">
          Group {group}
        </div>
        <div className="text-[10px] font-mono text-pitch-500">PL · W · D · L · PTS</div>
      </div>
      <ul className="space-y-1.5">
        {teams.map((t, i) => (
          <li key={t.id} className="flex items-center gap-2 text-xs">
            <span className="font-mono text-pitch-500 w-3 text-right stat-num">
              {i + 1}
            </span>
            <TeamFlag code={t.flag} size="sm" />
            <span className="font-medium text-pitch-100 truncate flex-1">{t.name}</span>
            <span className="font-mono text-pitch-500 stat-num">0·0·0·0·0</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-pitch-700/60 text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
        Top 2 + best 3rds → R32
      </div>
    </div>
  );
}

function KnockoutTree() {
  const rounds = [
    { key: "R32" as const,    label: "Round of 32",   fixtures: fixturesByRound("R32") },
    { key: "R16" as const,    label: "Round of 16",   fixtures: fixturesByRound("R16") },
    { key: "QF" as const,     label: "Quarter-finals",fixtures: fixturesByRound("QF") },
    { key: "SF" as const,     label: "Semi-finals",   fixtures: fixturesByRound("SF") },
    { key: "FINAL" as const,  label: "Final",         fixtures: fixturesByRound("FINAL") },
  ];

  return (
    <div className="card-panel p-5 overflow-x-auto">
      <div className="flex gap-5 min-w-max">
        {rounds.map((r) => (
          <div key={r.key} className="flex-1 min-w-[220px]">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold">
                {r.label}
              </span>
              <span className="text-[10px] font-mono text-pitch-500">
                {r.fixtures.length}
              </span>
            </div>
            <div
              className="flex flex-col"
              style={{ gap: r.fixtures.length === 1 ? "24px" : `${Math.max(8, 240 / r.fixtures.length - 24)}px` }}
            >
              {r.fixtures.map((f) => {
                const venue = venueById(f.venueId);
                const date = new Date(f.kickoff);
                const dateLabel = date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <div
                    key={f.id}
                    className={`rounded-md border bg-pitch-900/40 px-3 py-2 text-[11px] ${
                      r.key === "FINAL"
                        ? "border-accent-500/40 bg-accent-500/5"
                        : "border-pitch-700/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-pitch-500 font-mono">
                      <span className="text-pitch-300">{dateLabel}</span>
                      <span>{formatKickoff(f.kickoff)}</span>
                    </div>
                    <div className="text-pitch-500 font-mono mt-1 truncate">
                      TBD · TBD
                    </div>
                    {venue && (
                      <div className="text-[10px] text-pitch-500 mt-0.5 flex items-center gap-1 truncate">
                        <MapPin size={9} /> {venue.city}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-pitch-700/60 text-[11px] text-pitch-500">
        Third-place playoff: <span className="text-pitch-300">18 Jul · Hard Rock Stadium, Miami</span>.
        Pairings populate as group standings finalise on 27 June.
      </div>
    </div>
  );
}
