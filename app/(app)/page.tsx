import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Trophy,
  Target,
  Flag,
  ArrowRight,
} from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { teamById, venueById, TOURNAMENT } from "@/lib/wc26-data";
import { FIXTURES, nextFixtures, fixturesOn } from "@/lib/wc26-fixtures";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

export default function DashboardPage() {
  const now = new Date();
  const startDate = new Date(TOURNAMENT.startDate + "T00:00:00Z");
  const finalDate = new Date(TOURNAMENT.endDate + "T00:00:00Z");
  const daysToKickoff = Math.ceil(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const tournamentLive = now >= startDate && now <= finalDate;
  const todayIso = now.toISOString().slice(0, 10);
  const todayFixtures = fixturesOn(todayIso);
  const upcoming = nextFixtures(now.toISOString(), 12);

  return (
    <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
            {tournamentLive ? "Live tournament" : "Countdown"}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {tournamentLive
              ? formatDateLabel(now.toISOString())
              : `${daysToKickoff} days to kickoff`}
          </h1>
          <p className="text-sm text-pitch-400 mt-1">
            {tournamentLive
              ? "Tournament in progress · 48 teams · 104 matches"
              : `Opener: ${formatDateLabel(TOURNAMENT.startDate)} · Mexico vs South Africa at Estadio Azteca`}
          </p>
        </div>
        <CountBadges />
      </header>

      <HeroCTAs />

      {todayFixtures.length > 0 && (
        <FixturesSection
          title="Today"
          icon={<Sparkles size={14} className="text-accent-400" />}
          fixtures={todayFixtures}
        />
      )}

      {!tournamentLive && (
        <OpenerSpotlight />
      )}

      <FixturesSection
        title={tournamentLive ? "Upcoming" : "First matches"}
        icon={<Clock size={14} className="text-data-400" />}
        fixtures={upcoming}
      />

      <KeyFacts />
    </div>
  );
}

/**
 * Three big CTAs immediately under the hero — the app's value props before
 * any data scrolling: create a private league, place a tip, follow Norway.
 * These are the actions we want first-time visitors to take, not "browse stats".
 */
function HeroCTAs() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <HeroCard
        href="/leagues"
        icon={<Trophy size={18} className="text-pitch-950" />}
        kicker="Mini-league"
        title="Lag VM-liga"
        body="Inviter venner med en lenke. Privat leaderboard, ukentlig oppsummering."
        tone="accent"
      />
      <HeroCard
        href="/predictions"
        icon={<Target size={18} className="text-pitch-950" />}
        kicker="Predictions"
        title="Tipp åpningskampen"
        body="3 free guest tips før du må logge inn. Mexico–RSA først ut."
        tone="data"
      />
      <HeroCard
        href="/norge"
        icon={<Flag size={18} className="text-pitch-950" />}
        kicker="Følg laget ditt"
        title="Norge i Gruppe I"
        body="Neste kamp, gruppestilling, Haaland-tracker og scenario."
        tone="draw"
      />
    </section>
  );
}

function HeroCard({
  href,
  icon,
  kicker,
  title,
  body,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  kicker: string;
  title: string;
  body: string;
  tone: "accent" | "data" | "draw";
}) {
  const toneClass = {
    accent: "bg-accent-500/15 hover:bg-accent-500/25 ring-accent-500/30 [&_.dot]:bg-accent-500",
    data:   "bg-data-500/15 hover:bg-data-500/25 ring-data-500/30 [&_.dot]:bg-data-500",
    draw:   "bg-draw/15 hover:bg-draw/25 ring-draw/30 [&_.dot]:bg-draw",
  }[tone];
  return (
    <Link
      href={href}
      className={`card-panel ring-1 p-5 transition-colors group flex flex-col gap-3 ${toneClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="dot h-9 w-9 rounded-md flex items-center justify-center">
          {icon}
        </div>
        <ArrowRight
          size={14}
          className="text-pitch-400 group-hover:text-pitch-100 group-hover:translate-x-1 transition-all"
        />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-semibold">
          {kicker}
        </div>
        <div className="text-lg font-bold tracking-tight mt-0.5">{title}</div>
        <div className="text-xs text-pitch-300 mt-1.5 leading-relaxed">
          {body}
        </div>
      </div>
    </Link>
  );
}

function CountBadges() {
  const total = FIXTURES.length;
  const group = FIXTURES.filter((f) => f.stage.kind === "group").length;
  const ko = total - group;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="stat-pill">{total} matches</span>
      <span className="stat-pill">{group} group</span>
      <span className="stat-pill">{ko} knockout</span>
    </div>
  );
}

function OpenerSpotlight() {
  const opener = FIXTURES[0];
  if (!opener) return null;
  const home = opener.homeId ? teamById(opener.homeId) : undefined;
  const away = opener.awayId ? teamById(opener.awayId) : undefined;
  const venue = venueById(opener.venueId);

  return (
    <section className="card-panel p-6 ring-1 ring-accent-500/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] grid-lines pointer-events-none" />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-3">
          Tournament opener
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          {home && (
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-xl font-bold tracking-tight">{home.name}</div>
                <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
                  {home.shortName} · Group {home.group}
                </div>
              </div>
              <TeamFlag code={home.flag} size="lg" />
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="font-mono text-3xl font-bold stat-num text-accent-300">
              {formatKickoff(opener.kickoff)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono mt-1">
              {formatDateLabel(opener.kickoff)}
            </div>
          </div>
          {away && (
            <div className="flex items-center gap-3">
              <TeamFlag code={away.flag} size="lg" />
              <div>
                <div className="text-xl font-bold tracking-tight">{away.name}</div>
                <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
                  {away.shortName} · Group {away.group}
                </div>
              </div>
            </div>
          )}
        </div>
        {venue && (
          <div className="mt-5 pt-4 border-t border-pitch-700/60 text-center text-xs text-pitch-400 flex items-center justify-center gap-1.5">
            <MapPin size={12} /> {venue.name} · {venue.city}
          </div>
        )}
      </div>
    </section>
  );
}

function FixturesSection({
  title,
  icon,
  fixtures,
}: {
  title: string;
  icon?: React.ReactNode;
  fixtures: ReturnType<typeof nextFixtures>;
}) {
  if (fixtures.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {title}
        </h2>
        <span className="text-[10px] font-mono text-pitch-500">({fixtures.length})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {fixtures.map((f) => (
          <FixtureCard key={f.id} fixture={f} />
        ))}
      </div>
    </section>
  );
}

function FixtureCard({ fixture }: { fixture: ReturnType<typeof nextFixtures>[number] }) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const venue = venueById(fixture.venueId);
  const stageLabel =
    fixture.stage.kind === "group"
      ? `Group ${fixture.stage.group} · MD${fixture.stage.matchday}`
      : ROUND_LABELS[fixture.stage.round];

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className="card-panel block p-4 transition-all hover:border-accent-500/40 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-pitch-400 mb-3">
        <span>{stageLabel}</span>
        <span className="font-mono text-pitch-300">{formatKickoff(fixture.kickoff)}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide team={home} align="right" />
        <div className="font-mono text-sm text-pitch-400">VS</div>
        <TeamSide team={away} align="left" />
      </div>
      <div className="mt-3 text-[11px] text-pitch-500 flex items-center gap-1">
        <MapPin size={11} /> {venue?.city ?? "TBD"}
      </div>
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

function KeyFacts() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          Key dates
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <Fact label="Opener"       value="Jun 11" sub="Mexico vs RSA" />
        <Fact label="MD3 ends"     value="Jun 27" sub="Group stage" />
        <Fact label="R32 starts"   value="Jun 28" sub="Knockout" />
        <Fact label="Quarter-finals" value="Jul 9"  sub="4 matches" />
        <Fact label="Semi-finals"  value="Jul 14" sub="Dallas + Atlanta" />
        <Fact label="Final"        value="Jul 19" sub="MetLife Stadium" />
      </div>
    </section>
  );
}

function Fact({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card-panel p-3">
      <div className="text-[10px] uppercase tracking-widest text-pitch-400">{label}</div>
      <div className="font-mono text-xl font-bold stat-num text-accent-300 mt-1.5">{value}</div>
      <div className="text-[11px] text-pitch-400 mt-1 truncate">{sub}</div>
    </div>
  );
}

const ROUND_LABELS = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place",
  FINAL: "Final",
};
