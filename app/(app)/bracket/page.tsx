import Link from "next/link";
import { GitBranch, Trophy, MapPin, Cpu } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { BracketSimulator } from "@/components/bracket/BracketSimulator";
import { ModelExplainer } from "@/components/shared/ModelExplainer";
import { GROUPS, teamsByGroup, venueById, type WCTeam } from "@/lib/wc26-data";
import { fixturesByRound } from "@/lib/wc26-fixtures";
import { formatKickoff } from "@/lib/utils";

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
          <Trophy size={12} className="text-signal" />
          <Kicker tone="signal">Sluttspill-rutene</Kicker>
        </div>
        <Headline rank="h3" className="mb-3">
          Den offisielle veien.
        </Headline>
        <KnockoutTree />
      </section>

      <ModelExplainer />
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
                return (
                  <Link
                    key={f.id}
                    href={`/matches/${f.id}`}
                    className={`block px-3 py-2 text-[11px] transition-colors ${
                      r.key === "FINAL"
                        ? "ring-1 ring-signal/40 bg-signal/5 hover:bg-signal/10"
                        : "border border-cream/8 bg-paper hover:bg-paperHi"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-cream/55">
                      <span className="text-cream/70 uppercase tracking-kicker text-[9px]">
                        {dateLabel}
                      </span>
                      <span className="stat-num text-cream/85">
                        {formatKickoff(f.kickoff)}
                      </span>
                    </div>
                    <div className="font-serif tracking-editorial mt-1 truncate text-cream/55">
                      TBD <span className="text-cream/35">vs</span> TBD
                    </div>
                    {venue && (
                      <div className="text-[10px] text-cream/45 mt-0.5 flex items-center gap-1 truncate font-mono">
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
      <div className="mt-5 pt-4 border-t border-cream/8 text-[11px] text-cream/55 font-mono">
        Bronsefinale:{" "}
        <span className="text-cream/85">18. juli · Hard Rock Stadium, Miami</span>.
        Parene fastsettes når gruppestillinger ferdigstilles 27. juni.
      </div>
    </div>
  );
}
