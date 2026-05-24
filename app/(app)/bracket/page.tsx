import Link from "next/link";
import { GitBranch, Trophy, MapPin, Cpu, Flag } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { BracketSimulator } from "@/components/bracket/BracketSimulator";
import { ModelExplainer } from "@/components/shared/ModelExplainer";
import { GROUPS, teamsByGroup, venueById, type WCTeam } from "@/lib/wc26-data";
import { fixturesByRound } from "@/lib/wc26-fixtures";
import { formatKickoff } from "@/lib/utils";

/**
 * Translate a FIFA bracket slot code into Norwegian.
 *
 *   "1A"  → "Vinner Gr. A"
 *   "2B"  → "2. plass Gr. B"
 *   "3X"  → "Beste 3.-plass"
 *   "W74" → "Vinner K73"   (the previous match winner, by id)
 *   "L101"→ "Taper SF1"    (third-place playoff feeders)
 */
function slotLabel(slot: string | undefined): string {
  if (!slot) return "TBD";
  if (slot === "3X") return "Beste 3.-plass";
  if (slot.startsWith("W")) return `Vinner K${slot.slice(1)}`;
  if (slot.startsWith("L")) return `Taper SF${slot.slice(1) === "101" ? "1" : "2"}`;
  const place = slot[0];
  const grp = slot.slice(1);
  if (place === "1") return `Vinner Gr. ${grp}`;
  if (place === "2") return `2. plass Gr. ${grp}`;
  return slot;
}

export default function BracketPage() {
  return (
    <div className="px-5 md:px-10 py-8 max-w-[1400px] mx-auto space-y-10">
      <header>
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <GitBranch size={11} /> Turneringstre
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          Gruppespill & sluttspill.
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-3xl leading-relaxed">
          48 lag fordelt på 12 grupper · topp 2 + 8 beste tredjeplasser går
          videre til Runde av 32 · 32 sluttspill-kamper · finale på MetLife
          Stadium 19. juli 2026.
        </p>
      </header>

      <section>
        <Kicker tone="muted">Grupper</Kicker>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-cream/8 mt-3">
          {GROUPS.map((g) => (
            <GroupCard key={g} group={g} teams={teamsByGroup(g)} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={12} className="text-amber" />
          <Kicker tone="muted">Interaktiv simulator</Kicker>
        </div>
        <Headline rank="h3" className="mb-3">
          Hvem tar gullet?
        </Headline>
        <p className="text-xs text-cream/55 mb-4 max-w-3xl">
          Klikk et lag for å la dem gå videre, eller velg en auto-fyll-modus
          under. Seedet etter FIFA-rang fram til reelle gruppestillinger
          ferdigstilles 27. juni.
        </p>
        <BracketSimulator />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <Flag size={12} className="text-signal" />
          <Kicker tone="signal">Norges sluttspill-rute</Kicker>
        </div>
        <Headline rank="h3" className="mb-3">
          Hvem kan vi møte?
        </Headline>
        <p className="text-xs text-cream/55 mb-4 max-w-3xl">
          FIFA-trekningen har låst hvilke gruppeplasseringer som havner hvor i
          treet. Her er Norges to mulige ruter avhengig av om vi vinner
          Gruppe I eller blir nummer to. Tredje-plass-ruten er betinget av hvor
          mange poeng de andre 3.-plassene tar.
        </p>
        <NorwayPath />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={12} className="text-signal" />
          <Kicker tone="signal">Sluttspill-rutene</Kicker>
        </div>
        <Headline rank="h3" className="mb-3">
          Den offisielle veien.
        </Headline>
        <p className="text-xs text-cream/55 mb-4 max-w-3xl">
          Hver R32-kamp er allerede koblet til to spesifikke gruppeplasseringer
          (FIFA-trekning desember 2025). Vinneren går videre langs treet etter
          fastlagte koblinger — så halv-bracket-en til hvert lag er forutsigbar
          så snart gruppespillet er ferdig 27. juni.
        </p>
        <KnockoutTree />
      </section>

      <ModelExplainer />
    </div>
  );
}

/**
 * Norway's possible bracket paths.
 *
 * Group winners and runners-up have hard-coded R32 slots from the FIFA draw,
 * so we can trace the half-bracket they'd end up in deterministically:
 *
 *   1I (Group I winner)   → R32 #77 → R16 #89 → QF #97 → SF #101 → Final
 *   2I (Group I runner-up)→ R32 #78 → R16 #91 → QF #99 → SF #102 → Final
 *
 * The best-third-placed path depends on how groups A–L finish, so we explain
 * that in copy rather than try to model it.
 */
function NorwayPath() {
  const rounds = ["R32", "R16", "Kvartfinale", "Semifinale", "Finale"];
  const winnerOpponents = [
    { who: "Beste 3.-plass", match: "K77" },
    { who: "Vinner K74", match: "K89", hint: "1E vs beste 3.-plass" },
    { who: "Vinner K90", match: "K97", hint: "K73 vs K75" },
    { who: "Vinner K98", match: "K101", hint: "K93 vs K94" },
    { who: "Vinner K102", match: "Finale", hint: "vinner semifinale 2" },
  ];
  const runnerUpOpponents = [
    { who: "2. plass Gr. E", match: "K78", hint: "ofte Tyskland eller Ecuador" },
    { who: "Vinner K76", match: "K91", hint: "1C vs 2F" },
    { who: "Vinner K92", match: "K99", hint: "K79 vs K80" },
    { who: "Vinner K100", match: "K102", hint: "K95 vs K96" },
    { who: "Vinner K101", match: "Finale", hint: "vinner semifinale 1" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-cream/8">
      <PathColumn
        title="Hvis Norge vinner Gruppe I (1I)"
        accent="signal"
        rounds={rounds}
        opponents={winnerOpponents}
      />
      <PathColumn
        title="Hvis Norge blir nummer 2 i Gruppe I (2I)"
        accent="amber"
        rounds={rounds}
        opponents={runnerUpOpponents}
      />
    </div>
  );
}

function PathColumn({
  title,
  accent,
  rounds,
  opponents,
}: {
  title: string;
  accent: "signal" | "amber";
  rounds: string[];
  opponents: Array<{ who: string; match: string; hint?: string }>;
}) {
  const ringCls = accent === "signal" ? "ring-signal/25" : "ring-amber/25";
  const dotCls = accent === "signal" ? "bg-signal" : "bg-amber";
  const headerTone = accent === "signal" ? "text-signal" : "text-amber";
  return (
    <div className={`bg-paper p-4 sm:p-5 ring-1 ${ringCls}`}>
      <div className="flex items-center gap-2 mb-3">
        <HoloFlag code="no" w={22} radius={2} shimmer="medium" />
        <div className={`font-serif text-sm font-semibold tracking-editorial ${headerTone}`}>
          {title}
        </div>
      </div>
      <ol className="space-y-2.5">
        {rounds.map((r, i) => {
          const opp = opponents[i];
          return (
            <li key={r} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 ${dotCls}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/55">
                    {r}
                  </span>
                  <span className="text-[10px] font-mono text-cream/35 stat-num">
                    {opp.match}
                  </span>
                </div>
                <div className="font-serif text-sm tracking-editorial text-cream mt-0.5">
                  vs <span className="text-cream/85">{opp.who}</span>
                </div>
                {opp.hint && (
                  <div className="text-[10px] text-cream/45 font-mono mt-0.5 italic">
                    {opp.hint}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function GroupCard({ group, teams }: { group: string; teams: WCTeam[] }) {
  return (
    <div className="bg-paper p-4">
      <div className="flex items-center justify-between mb-3">
        <Kicker tone="signal">Gruppe {group}</Kicker>
        <div className="text-[9px] font-mono text-cream/35 uppercase tracking-kicker">
          PL · S · U · T · PTS
        </div>
      </div>
      <ul className="space-y-1.5">
        {teams.map((t, i) => (
          <li key={t.id}>
            <Link
              href={`/teams/${t.id}`}
              className="flex items-center gap-2 text-xs hover:bg-cream/5 -mx-1 px-1 py-0.5 transition-colors group"
            >
              <span className="font-mono text-cream/45 w-3 text-right stat-num">
                {i + 1}
              </span>
              <HoloFlag code={t.flag} w={18} radius={2} />
              <span className="font-serif text-sm tracking-editorial text-cream truncate flex-1 group-hover:text-amber transition-colors">
                {t.name}
              </span>
              <span className="font-mono text-cream/45 stat-num text-[10px]">
                0·0·0·0·0
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-cream/8 text-[10px] uppercase tracking-kicker font-mono text-cream/45">
        Topp 2 + beste 3.-plass → R32
      </div>
    </div>
  );
}

function KnockoutTree() {
  const rounds = [
    { key: "R32" as const, label: "Runde av 32", fixtures: fixturesByRound("R32") },
    { key: "R16" as const, label: "Runde av 16", fixtures: fixturesByRound("R16") },
    { key: "QF" as const, label: "Kvartfinale", fixtures: fixturesByRound("QF") },
    { key: "SF" as const, label: "Semifinale", fixtures: fixturesByRound("SF") },
    { key: "FINAL" as const, label: "Finale", fixtures: fixturesByRound("FINAL") },
  ];

  return (
    <div className="surface p-5 overflow-x-auto">
      <div className="flex gap-5 min-w-max">
        {rounds.map((r) => (
          <div key={r.key} className="flex-1 min-w-[220px]">
            <div className="flex items-baseline justify-between mb-3">
              <span
                className={`text-[10px] uppercase tracking-kicker font-mono font-semibold ${
                  r.key === "FINAL" ? "text-signal" : "text-cream/70"
                }`}
              >
                {r.label}
              </span>
              <span className="text-[10px] font-mono text-cream/45 stat-num">
                {r.fixtures.length}
              </span>
            </div>
            <div
              className="flex flex-col"
              style={{
                gap:
                  r.fixtures.length === 1
                    ? "24px"
                    : `${Math.max(8, 240 / r.fixtures.length - 24)}px`,
              }}
            >
              {r.fixtures.map((f) => {
                const venue = venueById(f.venueId);
                const date = new Date(f.kickoff);
                const dateLabel = date.toLocaleDateString("nb-NO", {
                  day: "numeric",
                  month: "short",
                });
                const homeLabel = slotLabel(f.homeSlot);
                const awayLabel = slotLabel(f.awaySlot);
                // Highlight any Norway-possible match: 1I, 2I, or "Vinner K77"/"Vinner K78"
                // and their downstream feeders.
                const NORWAY_SLOTS = new Set([
                  "1I", "2I",
                  "W77", "W78",
                  "W89", "W91",
                  "W97", "W99",
                  "W101", "W102",
                ]);
                const norwayPath =
                  (f.homeSlot && NORWAY_SLOTS.has(f.homeSlot)) ||
                  (f.awaySlot && NORWAY_SLOTS.has(f.awaySlot));
                return (
                  <Link
                    key={f.id}
                    href={`/matches/${f.id}`}
                    className={`block px-3 py-2 text-[11px] transition-colors ${
                      r.key === "FINAL"
                        ? "ring-1 ring-signal/40 bg-signal/5 hover:bg-signal/10"
                        : norwayPath
                        ? "ring-1 ring-signal/25 bg-signal/[0.04] hover:bg-signal/10"
                        : "border border-cream/8 bg-paper hover:bg-paperHi"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-cream/55">
                      <span className="text-cream/70 uppercase tracking-kicker text-[9px]">
                        {dateLabel} · K{f.id}
                      </span>
                      <span className="stat-num text-cream/85">
                        {formatKickoff(f.kickoff)}
                      </span>
                    </div>
                    <div className="font-serif tracking-editorial mt-1 text-cream/85 text-[11px] leading-snug">
                      <div className="truncate">{homeLabel}</div>
                      <div className="text-cream/35 text-[10px] font-mono italic my-0.5">
                        vs
                      </div>
                      <div className="truncate">{awayLabel}</div>
                    </div>
                    {venue && (
                      <div className="text-[10px] text-cream/45 mt-1.5 flex items-center gap-1 truncate font-mono">
                        <MapPin size={9} /> {venue.city}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-cream/8 text-[11px] text-cream/55 font-mono leading-relaxed">
        <div>
          Bronsefinale:{" "}
          <span className="text-cream/85">18. juli · Hard Rock Stadium, Miami</span>.
        </div>
        <div className="mt-1 text-cream/45">
          Røde kort = Norges potensielle rute. K# = match-nummer. Faktiske lag
          fylles inn etter siste gruppespill-runde 27. juni.
        </div>
      </div>
    </div>
  );
}
