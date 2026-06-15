import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, teamName, venueById } from "@/lib/wc26-data";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ResultLite {
  home: number;
  away: number;
  status: "live" | "halftime" | "finished" | string;
  minute: number | null;
}

async function fetchResults(): Promise<Map<number, ResultLite>> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("match_results")
      .select("match_id, home_score, away_score, status, minute");
    const map = new Map<number, ResultLite>();
    for (const r of (data as Array<{
      match_id: number;
      home_score: number | null;
      away_score: number | null;
      status: string;
      minute: number | null;
    }> | null) ?? []) {
      if (r.home_score === null || r.away_score === null) continue;
      map.set(r.match_id, {
        home: r.home_score,
        away: r.away_score,
        status: r.status,
        minute: r.minute,
      });
    }
    return map;
  } catch {
    return new Map();
  }
}

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

export default async function MatchesPage() {
  const byDay = new Map<string, Fixture[]>();
  for (const f of FIXTURES) {
    const k = dayKey(f.kickoff);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(f);
  }
  const days = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));

  const groupMatches = FIXTURES.filter((f) => f.stage.kind === "group").length;
  const koMatches = FIXTURES.length - groupMatches;
  const results = await fetchResults();

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
          <DaySection key={day} day={day} fixtures={fixtures} results={results} />
        ))}
      </div>
    </div>
  );
}

function DaySection({
  day,
  fixtures,
  results,
}: {
  day: string;
  fixtures: Fixture[];
  results: Map<number, ResultLite>;
}) {
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
            <FixtureCard key={f.id} fixture={f} result={results.get(f.id)} />
          ))}
      </div>
    </section>
  );
}

function FixtureCard({
  fixture,
  result,
}: {
  fixture: Fixture;
  result?: ResultLite;
}) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const venue = venueById(fixture.venueId);
  const isKnockout = fixture.stage.kind === "knockout";
  const isLive = result?.status === "live" || result?.status === "halftime";
  const isFinished = result?.status === "finished";

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className={`block bg-paper p-4 transition-colors hover:bg-paperHi ${
        isKnockout ? "ring-1 ring-amber/15" : ""
      } ${isLive ? "ring-1 ring-signal/40" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel(fixture)}
        </span>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 bg-signal text-cream px-2 py-0.5 text-[10px] font-extrabold tracking-[1.3px]">
            <span className="live-dot h-1.5 w-1.5" />
            {result?.status === "halftime" ? "HT" : result?.minute ? `${result.minute}'` : "LIVE"}
          </span>
        ) : isFinished ? (
          <span className="font-mono text-[10px] uppercase tracking-kicker text-cream/55 stat-num">
            FT
          </span>
        ) : (
          <span className="font-mono text-[11px] text-cream/70 stat-num">
            {formatKickoff(fixture.kickoff)}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide team={home} align="right" />
        {result ? (
          <div className="font-serif text-xl font-semibold tracking-[-0.02em] stat-num text-cream">
            {result.home}–{result.away}
          </div>
        ) : (
          <div className="font-serif text-base text-cream/35 italic">vs</div>
        )}
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
          {teamName(team)}
        </div>
        <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/45">
          {team.shortName}
        </div>
      </div>
    </div>
  );
}
