/**
 * Deterministic colour-gradient avatar for a league based on its id/name.
 *
 * We don't want to ask users to upload images yet — but a flat colour next
 * to every league makes them feel like real "things". The same id always
 * resolves to the same gradient so it's recognisable across pages.
 */

const PALETTES: Array<[string, string]> = [
  ["#ff5cc8", "#7c5cff"],
  ["#22d3ee", "#7c5cff"],
  ["#ff5cc8", "#22d3ee"],
  ["#34d399", "#22d3ee"],
  ["#fbbf24", "#ef4444"],
  ["#a78bfa", "#22d3ee"],
  ["#f472b6", "#fbbf24"],
  ["#22d3ee", "#34d399"],
  ["#ef4444", "#fbbf24"],
  ["#7c5cff", "#34d399"],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function leagueGradient(seed: string): [string, string] {
  return PALETTES[hash(seed) % PALETTES.length];
}

export function leagueInitials(name: string): string {
  const words = name.trim().split(/\s+/).slice(0, 2);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}
