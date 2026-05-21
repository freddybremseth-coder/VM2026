import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
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
    ? `Group ${f.stage.group} · MD${f.stage.matchday}`
    : KO_LABELS[f.stage.round];
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export default function MatchesPage() {
  // Group all 104 fixtures by date
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
    <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-6">
      <header>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
          <Calendar size={12} />
          Schedule
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          All {FIXTURES.length} matches
        </h1>
        <p className="text-sm text-pitch-400 mt-1">
          {groupMatches} group-stage · {koMatches} knockout · 11 June – 19 July 2026
        </p>
      </header>

      <div className="space-y-6">
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
      <div className="flex items-baseline gap-3 mb-3 sticky top-[57px] bg-pitch-950/80 backdrop-blur py-2 z-10">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-accent-300 font-mono">
          {dateLabel}
        </h2>
        <span className="text-[10px] font-mono text-pitch-500">
          {fixtures.length} {fixtures.length === 1 ? "match" : "matches"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
      className={`card-panel block p-4 transition-all hover:border-accent-500/40 hover:-translate-y-0.5 ${
        isKnockout ? "ring-1 ring-data-500/15" : ""
      }`}
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-pitch-400 mb-3">
        <span>{stageLabel(fixture)}</span>
        <span className="font-mono text-pitch-300">{formatKickoff(fixture.kickoff)}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide team={home} align="right" />
        <div className="font-mono text-sm text-pitch-400">VS</div>
        <TeamSide team={away} align="left" />
      </div>
      {venue && (
        <div className="mt-3 text-[11px] text-pitch-500 flex items-center gap-1">
          <MapPin size={11} /> {venue.name} · {venue.city}
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
      <div className={`text-xs text-pitch-500 font-mono ${align === "right" ? "text-right" : ""}`}>
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
      <TeamFlag code={team.flag} size="md" />
      <div className="min-w-0">
        <div className="font-semibold text-sm truncate">{team.name}</div>
        <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
          {team.shortName}
        </div>
      </div>
    </div>
  );
}
