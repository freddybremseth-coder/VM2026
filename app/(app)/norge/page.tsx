import Link from "next/link";
import { Flag, Calendar, MapPin, Trophy, Target, ArrowRight } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { teamById, teamsByGroup, venueById } from "@/lib/wc26-data";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { getSquad } from "@/lib/wc26-squads";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";

const NORWAY_ID = 21;

export default function NorgePage() {
  const t = getDictionary();
  const norway = teamById(NORWAY_ID);
  if (!norway) {
    return <div className="p-6">Norway team data not loaded.</div>;
  }

  const norwayFixtures = FIXTURES.filter(
    (f) => f.homeId === NORWAY_ID || f.awayId === NORWAY_ID,
  ).sort((a, b) => a.kickoff.localeCompare(b.kickoff));

  const now = new Date();
  const nextMatch = norwayFixtures.find(
    (f) => new Date(f.kickoff).getTime() > now.getTime(),
  );
  const groupTeams = teamsByGroup("I");

  const squad = getSquad(NORWAY_ID);
  // Players we'd highlight in form-tracker even before tournament — high
  // recent goal-scoring & international form.
  const KEY_PLAYER_NAMES = ["Erling Haaland", "Martin Ødegaard", "Alexander Sørloth"];
  const keyPlayers = squad.filter((p) => KEY_PLAYER_NAMES.includes(p.name));

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="flex items-center gap-4">
          <TeamFlag code="no" size="lg" />
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
              <Flag size={12} />
              {t.norge.follow}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t.norge.title}
            </h1>
            <p className="text-sm text-pitch-400 mt-1">{t.norge.subtitle}</p>
          </div>
        </div>
        <Link
          href="/predictions"
          className="flex items-center gap-1.5 rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-4 py-2 transition-colors shrink-0"
        >
          <Target size={13} /> {t.norge.tipMatches}
        </Link>
      </header>

      {nextMatch && <NextMatchHero fixture={nextMatch} label={t.norge.nextMatch} />}

      <section>
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200 mb-3 flex items-center gap-2">
          <Calendar size={12} className="text-accent-400" /> {t.norge.allMatches}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {norwayFixtures.map((f) => (
            <NorgeFixtureCard key={f.id} fixture={f} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GroupStandings groupTeams={groupTeams} label={t.norge.standings} />
        <KeyPlayers players={keyPlayers} label={t.norge.playersToWatch} />
      </section>

      <Scenario title={t.norge.scenarioTitle} />
    </div>
  );
}

function NextMatchHero({ fixture, label }: { fixture: Fixture; label: string }) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const venue = venueById(fixture.venueId);
  if (!home || !away) return null;

  const kickoff = new Date(fixture.kickoff);
  const now = new Date();
  const diffMs = kickoff.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

  return (
    <section className="card-panel p-4 sm:p-6 ring-1 ring-accent-500/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] grid-lines pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-4">
          <span>{label}</span>
          <span className="text-pitch-300 font-mono">
            om {days}d {hours}t
          </span>
        </div>
        {/* Mobile: stack home / time / away. Desktop: 3-col grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-4 sm:gap-6">
          <NorgeHeroTeamRow team={home} align="right" />
          <div className="flex flex-col items-center">
            <div className="font-mono text-2xl sm:text-3xl font-bold stat-num text-accent-300">
              {formatKickoff(fixture.kickoff)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono mt-1 text-center">
              {formatDateLabel(fixture.kickoff)}
            </div>
          </div>
          <NorgeHeroTeamRow team={away} align="left" />
        </div>
        {venue && (
          <div className="mt-5 pt-4 border-t border-pitch-700/60 text-center text-xs text-pitch-400 flex items-center justify-center gap-1.5">
            <MapPin size={12} /> {venue.name} · {venue.city}
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <Link
            href={`/matches/${fixture.id}`}
            className="text-xs font-semibold text-accent-300 hover:text-accent-200 flex items-center gap-1"
          >
            Match center <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function NorgeHeroTeamRow({
  team,
  align,
}: {
  team: ReturnType<typeof teamById> & {};
  align: "left" | "right";
}) {
  if (!team) return null;
  return (
    <div
      className={
        "flex items-center gap-3 min-w-0" +
        (align === "right"
          ? " sm:flex-row sm:justify-end sm:text-right"
          : " sm:flex-row sm:justify-start")
      }
    >
      <TeamFlag code={team.flag} size="lg" className={align === "right" ? "sm:hidden" : ""} />
      <div className={"min-w-0 flex-1 sm:flex-initial" + (align === "right" ? " sm:text-right" : "")}>
        <div className="text-lg sm:text-xl font-bold tracking-tight truncate">{team.name}</div>
        <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
          {team.shortName}
        </div>
      </div>
      {align === "right" && (
        <TeamFlag code={team.flag} size="lg" className="hidden sm:inline-block" />
      )}
    </div>
  );
}

function NorgeFixtureCard({ fixture }: { fixture: Fixture }) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const venue = venueById(fixture.venueId);
  if (!home || !away) return null;
  const opp = home.id === NORWAY_ID ? away : home;
  const norgeAtHome = home.id === NORWAY_ID;

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className="card-panel block p-4 hover:border-accent-500/40 transition-colors"
    >
      <div className="text-[11px] uppercase tracking-widest text-pitch-400 mb-2 flex items-center justify-between">
        <span>{fixture.stage.kind === "group" ? `MD${fixture.stage.matchday}` : "KO"}</span>
        <span className="font-mono">{formatKickoff(fixture.kickoff)}</span>
      </div>
      <div className="flex items-center gap-3">
        <TeamFlag code="no" size="md" />
        <span className="text-pitch-500 font-mono text-sm">{norgeAtHome ? "vs" : "@"}</span>
        <TeamFlag code={opp.flag} size="md" />
        <span className="font-semibold text-sm flex-1">{opp.name}</span>
      </div>
      <div className="mt-2 text-[11px] text-pitch-500 flex items-center gap-1">
        <MapPin size={11} /> {venue?.city ?? "TBD"} ·{" "}
        {formatDateLabel(fixture.kickoff).split(",")[0]}
      </div>
    </Link>
  );
}

function GroupStandings({
  groupTeams,
  label,
}: {
  groupTeams: ReturnType<typeof teamsByGroup>;
  label: string;
}) {
  return (
    <div className="card-panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={12} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {label}
        </h2>
      </div>
      <ul className="space-y-2">
        {groupTeams.map((t, i) => (
          <li key={t.id} className="flex items-center gap-3 text-sm">
            <span className="font-mono text-pitch-500 w-4 text-right stat-num">
              {i + 1}
            </span>
            <TeamFlag code={t.flag} size="sm" />
            <span
              className={`flex-1 truncate ${
                t.id === NORWAY_ID ? "font-bold text-accent-300" : "text-pitch-100"
              }`}
            >
              {t.name}
            </span>
            <span className="font-mono text-pitch-500 stat-num text-xs">
              0·0·0·0·0
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-pitch-500 leading-relaxed">
        Top 2 + best 3rd → Round of 32. With France as Group I favourites,
        Norway's path likely runs through 2nd or 3rd place.
      </p>
    </div>
  );
}

function KeyPlayers({ players, label }: { players: ReturnType<typeof getSquad>; label: string }) {
  return (
    <div className="card-panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <Flag size={12} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {label}
        </h2>
      </div>
      <ul className="space-y-3">
        {players.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-pitch-950 font-mono font-bold text-sm stat-num">
              {p.number || "—"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{p.name}</div>
              <div className="text-[11px] text-pitch-500 truncate">
                {p.club} · {p.position}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-base font-bold stat-num text-accent-300">
                {p.goals ?? "—"}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
                {p.caps ?? "—"} caps
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Scenario({ title }: { title: string }) {
  return (
    <section className="card-panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {title}
        </h2>
      </div>
      <div className="text-sm text-pitch-300 leading-relaxed space-y-2">
        <p>
          Med <span className="text-accent-300 font-semibold">France</span> som
          klar Gruppe I-favoritt, vil Norge typisk konkurrere om
          andreplassen mot{" "}
          <span className="text-data-300 font-semibold">Senegal</span> og en{" "}
          <span className="text-pitch-100 font-semibold">Irak</span>-tropp som
          spiller om første VM-slutt på 40 år.
        </p>
        <p className="text-pitch-400">
          Best bet for avansement: minst 4 poeng (1 seier + 1 uavgjort) gir
          gjerne en av de 8 beste 3.-plassene i ny 48-lags-modus. 6 poeng
          låser 2.-plassen helt sikkert.
        </p>
        <p className="text-[11px] text-pitch-500 mt-3 italic">
          AI scenario calculator coming next — will let you set any result and
          see Norway's qualifying probability live.
        </p>
      </div>
    </section>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
