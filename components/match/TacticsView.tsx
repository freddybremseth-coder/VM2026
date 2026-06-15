/**
 * Tactical breakdown for a single fixture — uses ESPN summary data:
 *  - Formation chip (e.g. 4-3-3 vs 4-2-3-1)
 *  - Side-by-side comparison of the key stats (possession, shots, passes,
 *    cards) as Tactician-style bars
 *  - Starting XI + bench, listed by jersey number
 *
 * Renders honest absence states: no formation, no stats — UI degrades to a
 * "data not available yet" notice rather than rendering blanks.
 */

import { BarChart2, Users, Shirt } from "lucide-react";
import type { MatchInfo } from "@/lib/match-events/espn-match-info";

interface Props {
  info: MatchInfo;
}

/** ESPN stat names → editorial label + sort priority. Lower = shown first. */
const STAT_ORDER: Record<string, { label: string; order: number; asPercent?: boolean; format?: (v: string) => string }> = {
  possessionPct:  { label: "Ballbesittelse", order: 1, asPercent: true, format: (v) => `${v}%` },
  totalShots:     { label: "Skudd",          order: 2 },
  shotsOnTarget:  { label: "På mål",         order: 3 },
  wonCorners:     { label: "Hjørnespark",    order: 4 },
  totalPasses:    { label: "Pasninger",      order: 5 },
  passPct:        { label: "Pasning %",      order: 6, format: (v) => `${Math.round(Number(v) * 100)}%` },
  accuratePasses: { label: "Treffsikre pasn.", order: 7 },
  foulsCommitted: { label: "Frispark",       order: 8 },
  yellowCards:    { label: "Gule kort",      order: 9 },
  redCards:       { label: "Røde kort",      order: 10 },
  offsides:       { label: "Offside",        order: 11 },
  saves:          { label: "Redninger",      order: 12 },
};

interface PairedStat {
  name: string;
  label: string;
  homeRaw: number;
  awayRaw: number;
  homeDisplay: string;
  awayDisplay: string;
  isPercent: boolean;
}

function pairStats(info: MatchInfo): PairedStat[] {
  const byName = new Map<string, PairedStat>();
  for (const s of info.home.stats) {
    const cfg = STAT_ORDER[s.name];
    if (!cfg) continue;
    const raw = Number(s.value.replace(/[^\d.-]/g, "")) || 0;
    byName.set(s.name, {
      name: s.name,
      label: cfg.label,
      homeRaw: raw,
      awayRaw: 0,
      homeDisplay: cfg.format ? cfg.format(s.value) : s.value,
      awayDisplay: "—",
      isPercent: Boolean(cfg.asPercent),
    });
  }
  for (const s of info.away.stats) {
    const cfg = STAT_ORDER[s.name];
    if (!cfg) continue;
    const raw = Number(s.value.replace(/[^\d.-]/g, "")) || 0;
    const existing = byName.get(s.name);
    if (existing) {
      existing.awayRaw = raw;
      existing.awayDisplay = cfg.format ? cfg.format(s.value) : s.value;
    } else {
      byName.set(s.name, {
        name: s.name,
        label: cfg.label,
        homeRaw: 0,
        awayRaw: raw,
        homeDisplay: "—",
        awayDisplay: cfg.format ? cfg.format(s.value) : s.value,
        isPercent: Boolean(cfg.asPercent),
      });
    }
  }
  return Array.from(byName.values()).sort(
    (a, b) => (STAT_ORDER[a.name]?.order ?? 99) - (STAT_ORDER[b.name]?.order ?? 99),
  );
}

export function TacticsView({ info }: Props) {
  const pairs = pairStats(info);
  const hasFormation = Boolean(info.home.formation || info.away.formation);
  const hasLineups = info.home.starters.length > 0 || info.away.starters.length > 0;

  if (!hasFormation && !hasLineups && pairs.length === 0) {
    return (
      <div className="surface p-8 text-center">
        <BarChart2 size={20} className="text-cream/35 mx-auto mb-3" />
        <h2 className="font-serif text-lg tracking-editorial text-cream/85 mb-1">
          Taktikkdata er ikke klar ennå
        </h2>
        <p className="text-xs text-cream/55 max-w-md mx-auto">
          ESPN publiserer formasjon og statistikk like før avspark og oppdaterer
          dem live gjennom kampen. Sjekk tilbake noen minutter før kickoff.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Formation hero */}
      {hasFormation && (
        <div className="surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={12} className="text-signal" />
            <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
              Formasjon
            </h2>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-right">
              <div className="font-serif text-xs tracking-editorial text-cream/55 mb-1 truncate">
                {info.homeName}
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-semibold stat-num tracking-[-0.02em] text-cream">
                {info.home.formation ?? "—"}
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-kicker text-cream/35">
              vs
            </div>
            <div>
              <div className="font-serif text-xs tracking-editorial text-cream/55 mb-1 truncate">
                {info.awayName}
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-semibold stat-num tracking-[-0.02em] text-cream">
                {info.away.formation ?? "—"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side stat bars */}
      {pairs.length > 0 && (
        <div className="surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={12} className="text-signal" />
            <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
              Statistikk
            </h2>
          </div>
          <div className="space-y-3">
            {pairs.map((p) => (
              <StatBar key={p.name} pair={p} />
            ))}
          </div>
        </div>
      )}

      {/* Starting XI */}
      {hasLineups && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LineupCard side={info.home} teamName={info.homeName} />
          <LineupCard side={info.away} teamName={info.awayName} />
        </div>
      )}
    </div>
  );
}

function StatBar({ pair }: { pair: PairedStat }) {
  // For % stats we compare directly. For counts, share of total.
  const total = pair.homeRaw + pair.awayRaw;
  const homePct = pair.isPercent
    ? pair.homeRaw
    : total > 0
    ? (pair.homeRaw / total) * 100
    : 50;
  const awayPct = pair.isPercent
    ? pair.awayRaw
    : total > 0
    ? (pair.awayRaw / total) * 100
    : 50;
  return (
    <div>
      <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 mb-1">
        <span className="font-mono text-sm font-bold stat-num text-cream text-right">
          {pair.homeDisplay}
        </span>
        <span className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 text-center">
          {pair.label}
        </span>
        <span className="font-mono text-sm font-bold stat-num text-cream text-left">
          {pair.awayDisplay}
        </span>
      </div>
      <div className="grid grid-cols-2 h-1.5 bg-cream/5">
        <div className="flex justify-end">
          <div
            className="bg-signal/70 h-full transition-[width]"
            style={{ width: `${Math.max(2, Math.min(100, homePct))}%` }}
          />
        </div>
        <div>
          <div
            className="bg-amber/70 h-full transition-[width]"
            style={{ width: `${Math.max(2, Math.min(100, awayPct))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function LineupCard({
  side,
  teamName,
}: {
  side: MatchInfo["home"];
  teamName: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-3 justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Shirt size={12} className="text-signal shrink-0" />
          <h3 className="font-serif text-sm font-semibold tracking-editorial truncate">
            {teamName}
          </h3>
        </div>
        {side.formation && (
          <span className="font-mono text-[10px] uppercase tracking-kicker text-cream/55 stat-num shrink-0">
            {side.formation}
          </span>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/45 mb-2">
        Startoppstilling
      </div>
      <ul className="space-y-1 mb-4">
        {side.starters.map((p) => (
          <PlayerRow key={p.espnId} player={p} />
        ))}
        {side.starters.length === 0 && (
          <li className="text-[10px] text-cream/45 italic">
            Ikke publisert ennå
          </li>
        )}
      </ul>

      {side.bench.length > 0 && (
        <>
          <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/45 mb-2">
            Innbyttere
          </div>
          <ul className="space-y-1">
            {side.bench.map((p) => (
              <PlayerRow key={p.espnId} player={p} muted />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function PlayerRow({
  player,
  muted = false,
}: {
  player: { jersey: string | null; name: string };
  muted?: boolean;
}) {
  return (
    <li className={`flex items-center gap-3 text-sm ${muted ? "text-cream/55" : "text-cream"}`}>
      <span className="font-mono text-[11px] stat-num w-5 text-right text-cream/45 shrink-0">
        {player.jersey ?? "—"}
      </span>
      <span className="font-serif tracking-editorial truncate">
        {player.name}
      </span>
    </li>
  );
}
