/**
 * Flat search index over teams + players, used by the global search box in
 * the top bar. Built on the server (static data) and served via
 * /api/search-index so the ~1000-entry payload isn't embedded in every
 * page's HTML — the client fetches it once on first focus.
 */

import { TEAMS, teamById, teamName } from "@/lib/wc26-data";
import { getAllPlayers } from "@/lib/wc26-squads";

export interface SearchEntry {
  type: "team" | "player";
  name: string;
  /** Secondary line, eg. "Gruppe I · UEFA" or "Norge · ST · Arsenal". */
  sub: string;
  /** Flag code (the player's national team flag for players). */
  flag: string;
  href: string;
}

const CONFED_LABEL: Record<string, string> = {
  UEFA: "Europa",
  CONMEBOL: "Sør-Amerika",
  AFC: "Asia",
  CAF: "Afrika",
  CONCACAF: "Nord-Amerika",
  OFC: "Oseania",
};

let cached: SearchEntry[] | null = null;

export function getSearchIndex(): SearchEntry[] {
  if (cached) return cached;

  const teamEntries: SearchEntry[] = TEAMS.map((t) => ({
    type: "team",
    name: teamName(t),
    sub: `Gruppe ${t.group} · ${CONFED_LABEL[t.confederation] ?? t.confederation}`,
    flag: t.flag,
    href: `/teams/${t.id}`,
  }));

  const playerEntries: SearchEntry[] = getAllPlayers().map((p) => {
    const team = teamById(p.teamId);
    return {
      type: "player",
      name: p.name,
      sub: `${team ? teamName(team) : "—"} · ${p.position} · ${p.club}`,
      flag: team?.flag ?? "",
      href: `/players/${p.id}`,
    };
  });

  cached = [...teamEntries, ...playerEntries];
  return cached;
}
