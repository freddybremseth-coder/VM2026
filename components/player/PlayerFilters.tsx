"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { teamById, TEAMS } from "@/lib/wc26-data";
import type { Player, Position } from "@/lib/wc26-squads";

const POS_GROUPS: Array<{ label: string; positions: Position[] }> = [
  { label: "Alle", positions: [] },
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
  const [posGroup, setPosGroup] = useState<string>("Alle");

  const teamLookup = useMemo(() => new Map(TEAMS.map((t) => [t.id, t])), []);
  const teamOptions = useMemo(() => {
    const ids = new Set(players.map((p) => p.teamId));
    return TEAMS.filter((t) => ids.has(t.id)).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [players]);

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const active = POS_GROUPS.find((g) => g.label === posGroup)!;
    return players.filter((p) => {
      if (teamId !== "" && p.teamId !== teamId) return false;
      if (active.positions.length > 0 && !active.positions.includes(p.position)) return false;
      if (tokens.length > 0) {
        const team = teamLookup.get(p.teamId);
        const haystack = [
          p.name,
          p.club,
          team?.name ?? "",
          team?.shortName ?? "",
        ]
          .join(" ")
          .toLowerCase();
        for (const tok of tokens) {
          if (!haystack.includes(tok)) return false;
        }
      }
      return true;
    });
  }, [players, query, teamId, posGroup, teamLookup]);

  return (
    <div>
      <div className="surface p-4 mb-5 flex flex-col md:flex-row gap-3 md:items-center">
        <label className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/45"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Søk — prøv "norge haa" eller "arsenal"…'
            className="w-full bg-canvas border border-cream/8 pl-9 pr-3 py-2 text-sm text-cream placeholder:text-cream/45 focus:outline-none focus:border-signal/50"
          />
        </label>

        <select
          value={teamId}
          onChange={(e) =>
            setTeamId(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="bg-canvas border border-cream/8 px-3 py-2 text-sm text-cream focus:outline-none focus:border-signal/50"
        >
          <option value="">Alle lag</option>
          {teamOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1 bg-canvas border border-cream/8 p-1">
          {POS_GROUPS.map((g) => (
            <button
              key={g.label}
              onClick={() => setPosGroup(g.label)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-kicker transition-colors ${
                posGroup === g.label
                  ? "bg-signal text-cream font-semibold"
                  : "text-cream/55 hover:text-cream"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-cream/45 mb-3 font-mono stat-num uppercase tracking-kicker">
        {filtered.length} {filtered.length === 1 ? "spiller" : "spillere"}
      </div>

      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-kicker text-cream/45 border-b border-cream/8 font-mono">
              <th className="text-left px-4 py-2.5 w-10">#</th>
              <th className="text-left px-4 py-2.5 w-14">Pos</th>
              <th className="text-left px-4 py-2.5">Spiller</th>
              <th className="text-left px-4 py-2.5">Lag</th>
              <th className="text-left px-4 py-2.5">Klubb</th>
              <th className="text-right px-4 py-2.5 w-14">Alder</th>
              <th className="text-right px-4 py-2.5 w-16">Caps</th>
              <th className="text-right px-4 py-2.5 w-16">Mål</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const t = teamById(p.teamId);
              return (
                <tr
                  key={p.id}
                  className="border-b border-cream/8 last:border-b-0 hover:bg-cream/5 transition-colors"
                >
                  <td className="px-4 py-2 font-mono text-cream/45 stat-num">
                    {p.number || "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-paper text-cream/70">
                      {p.position}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/players/${p.id}`}
                      className="font-serif tracking-editorial text-cream hover:text-amber transition-colors"
                    >
                      {p.name}
                      {p.isCaptain && (
                        <span className="ml-1.5 text-[10px] text-signal font-mono">(C)</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {t && (
                      <Link
                        href={`/teams/${t.id}`}
                        className="flex items-center gap-2 hover:opacity-80"
                      >
                        <HoloFlag code={t.flag} w={18} radius={2} />
                        <span className="text-cream/85 font-mono text-xs uppercase tracking-kicker">
                          {t.shortName}
                        </span>
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-2 text-cream/55 text-xs truncate max-w-[160px] font-mono">
                    {p.club}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-cream/70 stat-num">
                    {p.age ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-cream/70 stat-num">
                    {p.caps ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-signal stat-num font-semibold">
                    {p.goals ?? "—"}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-sm text-cream/45 py-6 italic font-serif">
                  Ingen spillere matcher filteret.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
