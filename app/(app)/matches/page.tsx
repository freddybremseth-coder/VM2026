import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, venueById } from "@/lib/wc26-data";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

const KO_LABELS: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place",
  FINAL: "Final",
};

function stageLabel(f: Fixture): string {
  return f.stage.kind === "group"
    ? `Gruppe ${f.stage.group} · MD${f.stage.matchday}`
    : KO_LABELS[f.stage.round];
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export default function MatchesPage() {
  const byDay = new Map<string, Fixture[]>();
  for (const f of FIXTURES) {
    const k = dayKey(f.kickoff);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(f);
  }
  const days = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));

  const groupMatches = FIXTURES.filter((f) => f.stage.kind === "group").length;
  const koMatches = FIXTURES.length - groupMatches;

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-8">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <Calendar size={11} /> Spillplan
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          Alle {FIXTURES.length} kamper.
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-xl">
          {groupMatches} gruppespill · {koMatches} sluttspill · 11. juni – 19. juli 2026
        </p>
      </header>

      <div className="space-y-10">
        {days.map(([day, fixtures]) => (
          <DaySection key={day} day={day} fixtures={fixtures} />
        ))}
      </div>
    </div>
  );
}

function DaySection({ day, fixtures }: { day: string; fixtures: Fixture[] }) {
  const dateLabel = formatDateLabel(day + "T12:00:00Z");
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3 sticky top-[57px] bg-canvas/85 backdrop-blur py-2 z-10 border-b border-cream/8">
        <Kicker tone="cream" className="!text-cream">
          {dateLabel}
        </Kicker>
        <span className="text-[10px] font-mono text-cream/45">
          {fixtures.length} {fixtures.length === 1 ? "kamp" : "kamper"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-cream/8">
        {fixtures
          .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
          .map((f) => (
            <FixtureCard key={f.id} fixture={f} />
          ))}
      </div>
    </section>
  );
}

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const venue = venueById(fixture.venueId);
  const isKnockout = fixture.stage.kind === "knockout";

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className={`block bg-paper p-4 transition-colors hover:bg-paperHi ${
        isKnockout ? "ring-1 ring-amber/15" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel(fixture)}
        </span>
        <span className="font-mono text-[11px] text-cream/70 stat-num">
          {formatKickoff(fixture.kickoff)}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide team={home} align="right" />
        <div className="font-serif text-base text-cream/35 italic">vs</div>
        <TeamSide team={away} align="left" />
      </div>
      {venue && (
        <div className="mt-3 text-[10px] text-cream/45 font-mono flex items-center gap-1">
          <MapPin size={10} /> {venue.name} · {venue.city}
        </div>
      )}
    </Link>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: ReturnType<typeof teamById>;
  align: "left" | "right";
}) {
  if (!team) {
    return (
      <div
        className={`font-mono text-xs text-cream/35 ${
          align === "right" ? "text-right" : ""
        }`}
      >
        TBD
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-2.5 min-w-0 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <HoloFlag code={team.flag} w={26} radius={3} />
      <div className="min-w-0">
        <div className="font-serif text-base font-semibold truncate tracking-editorial">
          {team.name}
        </div>
        <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/45">
          {team.shortName}
        </div>
      </div>
    </div>
  );
}
