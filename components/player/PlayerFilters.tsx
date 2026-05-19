"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { teamById, TEAMS } from "@/lib/wc26-data";
import type { Player, Position } from "@/lib/wc26-squads";

const POS_GROUPS: Array<{ label: string; positions: Position[] }> = [
  { label: "All", positions: [] },
  { label: "GK", positions: ["GK"] },
  { label: "DEF", positions: ["CB", "RB", "LB"] },
  { label: "MID", positions: ["DM", "CM", "AM"] },
  { label: "FWD", positions: ["ST", "LW", "RW"] },
];

interface Props {
  players: Player[];
}

export function PlayerFilters({ players }: Props) {
  const [query, setQuery] = useState("");
  const [teamId, setTeamId] = useState<number | "">("");
  const [posGroup, setPosGroup] = useState<string>("All");

  const teamOptions = useMemo(() => {
    const ids = new Set(players.map((p) => p.teamId));
    return TEAMS.filter((t) => ids.has(t.id)).sort((a, b) => a.name.localeCompare(b.name));
  }, [players]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const active = POS_GROUPS.find((g) => g.label === posGroup)!;
    return players.filter((p) => {
      if (teamId !== "" && p.teamId !== teamId) return false;
      if (active.positions.length > 0 && !active.positions.includes(p.position)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.club.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [players, query, teamId, posGroup]);

  return (
    <div>
      <div className="card-panel p-4 mb-5 flex flex-col md:flex-row gap-3 md:items-center">
        <label className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-pitch-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or club…"
            className="w-full rounded-md bg-pitch-900/80 border border-pitch-700 pl-9 pr-3 py-2 text-sm placeholder:text-pitch-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40"
          />
        </label>

        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value === "" ? "" : Number(e.target.value))}
          className="rounded-md bg-pitch-900/80 border border-pitch-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40"
        >
          <option value="">All teams</option>
          {teamOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1 rounded-md bg-pitch-900/80 border border-pitch-700 p-1">
          {POS_GROUPS.map((g) => (
            <button
              key={g.label}
              onClick={() => setPosGroup(g.label)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest rounded transition-colors ${
                posGroup === g.label
                  ? "bg-accent-500 text-pitch-950 font-semibold"
                  : "text-pitch-400 hover:text-pitch-100"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-pitch-500 mb-3 font-mono stat-num">
        {filtered.length} {filtered.length === 1 ? "player" : "players"}
      </div>

      <div className="card-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-pitch-500 border-b border-pitch-700/60">
              <th className="text-left px-4 py-2 w-10">#</th>
              <th className="text-left px-4 py-2 w-14">Pos</th>
              <th className="text-left px-4 py-2">Player</th>
              <th className="text-left px-4 py-2">Team</th>
              <th className="text-left px-4 py-2">Club</th>
              <th className="text-right px-4 py-2 w-14 font-mono">Age</th>
              <th className="text-right px-4 py-2 w-16 font-mono">Caps</th>
              <th className="text-right px-4 py-2 w-16 font-mono">Goals</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const t = teamById(p.teamId);
              return (
                <tr
                  key={p.id}
                  className="border-b border-pitch-800 last:border-b-0 hover:bg-pitch-800/40"
                >
                  <td className="px-4 py-2 font-mono text-pitch-500 stat-num">
                    {p.number}
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-pitch-800 text-pitch-300">
                      {p.position}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-pitch-100 font-medium">
                    <Link href={`/players/${p.id}`} className="hover:text-accent-300">
                      {p.name}
                      {p.isCaptain && (
                        <span className="ml-1.5 text-[10px] text-accent-400 font-mono">(C)</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {t && (
                      <span className="flex items-center gap-2">
                        <TeamFlag code={t.flag} size="sm" />
                        <span className="text-pitch-300">{t.shortName}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-pitch-400 text-xs truncate max-w-[160px]">
                    {p.club}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-pitch-300 stat-num">
                    {p.age}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-pitch-300 stat-num">
                    {p.caps}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-accent-300 stat-num font-semibold">
                    {p.goals}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-sm text-pitch-500 py-6">
                  No players match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
