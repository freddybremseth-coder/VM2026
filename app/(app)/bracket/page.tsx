import { GitBranch, Trophy } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { GROUPS, teamsByGroup, type WCTeam } from "@/lib/wc26-data";

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
          48 teams, 12 groups of 4 → top 2 from each group and the 8 best
          third-place teams advance to the Round of 32. Standings update as
          matches conclude.
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

/**
 * Static placeholder structure. The actual draw populates these slots after the
 * group stage — we render it as an empty tree until then.
 */
function KnockoutTree() {
  const rounds: { name: string; matches: number }[] = [
    { name: "Round of 32", matches: 16 },
    { name: "Round of 16", matches: 8 },
    { name: "Quarter-finals", matches: 4 },
    { name: "Semi-finals", matches: 2 },
    { name: "Final", matches: 1 },
  ];

  return (
    <div className="card-panel p-5 overflow-x-auto">
      <div className="flex gap-6 min-w-max">
        {rounds.map((r) => (
          <div key={r.name} className="flex-1 min-w-[180px]">
            <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-3">
              {r.name}
            </div>
            <div
              className="flex flex-col"
              style={{ gap: `${24 / r.matches + 8}px` }}
            >
              {Array.from({ length: r.matches }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-pitch-700/60 bg-pitch-900/40 px-3 py-2 text-[11px]"
                >
                  <div className="flex items-center justify-between text-pitch-500 font-mono">
                    <span>TBD</span>
                    <span className="text-pitch-700">·</span>
                    <span>TBD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-pitch-500">
        Knockout pairings populate after group-stage standings finalise on 27
        June 2026. We will then auto-fill seeds and update routes as matches
        complete.
      </p>
    </div>
  );
}
