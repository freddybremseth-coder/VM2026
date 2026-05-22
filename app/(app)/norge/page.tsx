import Link from "next/link";
import { Flag, Calendar, MapPin, Trophy, Target, ArrowRight, TrendingUp } from "lucide-react";
import { NorwayScenarioCalculator } from "@/components/norge/NorwayScenarioCalculator";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { TeamFormStripStatic } from "@/components/shared/TeamFormStrip";
import { teamById, teamsByGroup, venueById } from "@/lib/wc26-data";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { getSquad } from "@/lib/wc26-squads";
import { getPlayerForm, type ClubOutcome } from "@/lib/player-form";
import { getTeamFormBatch, type TeamFormData } from "@/lib/team-form";
import { getTournamentTopScorers, getTournamentTopAssisters } from "@/lib/team-stats";
import { TopScorersList } from "@/components/shared/TopScorersList";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";

const NORWAY_ID = 21;
// All Group I team IDs (for form fetching)
const GROUP_I_IDS = [14, 8, 27, 21]; // France, Senegal, Iraq, Norway

export default async function NorgePage() {
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
  // Players we'd highlight in form-tracker — these are the names + variants
  // we keep in sync with the official 26-man squad.
  const KEY_PLAYER_IDS = [2122, 2120, 2121, 2125, 2116]; // Haaland, Ødegaard, Sørloth, Nusa, Bobb
  const keyPlayers = squad.filter((p) => KEY_PLAYER_IDS.includes(p.id));

  // Fetch pre-tournament international form for all Group I teams
  const formMap = await getTeamFormBatch(GROUP_I_IDS);
  const norwayForm = formMap.get(NORWAY_ID);

  // Group I leaderboards — international goals + assists (squad data only)
  const groupISet = new Set(GROUP_I_IDS);
  const groupIScorers = getTournamentTopScorers(50)
    .filter((l) => groupISet.has(l.teamId))
    .slice(0, 5);
  const groupIAssisters = getTournamentTopAssisters(50)
    .filter((l) => groupISet.has(l.teamId))
    .slice(0, 5);

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

      {/* Norway national team international form */}
      {norwayForm && <NorwayFormCard form={norwayForm} />}

      {/* Group I leaderboards */}
      {(groupIScorers.length > 0 || groupIAssisters.length > 0) && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {groupIScorers.length > 0 && (
            <TopScorersList
              title="Toppscorere · Gruppe I"
              leaders={groupIScorers}
              metric="goals"
              subtitle="int. mål · all-time"
            />
          )}
          {groupIAssisters.length > 0 && (
            <TopScorersList
              title="Assistkonger · Gruppe I"
              leaders={groupIAssisters}
              metric="assists"
              subtitle="int. assists · all-time"
            />
          )}
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GroupStandings groupTeams={groupTeams} label={t.norge.standings} formMap={formMap} />
        <KeyPlayers players={keyPlayers} label={t.norge.playersToWatch} />
      </section>

      <NorwayScenarioCalculator />
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
    <Link
      href={`/teams/${team.id}`}
      className={
        "flex items-center gap-3 min-w-0 group rounded-md -mx-2 px-2 py-1 hover:bg-pitch-800/40 transition-colors" +
        (align === "right"
          ? " sm:flex-row sm:justify-end sm:text-right"
          : " sm:flex-row sm:justify-start")
      }
    >
      <TeamFlag code={team.flag} size="lg" className={align === "right" ? "sm:hidden" : ""} />
      <div className={"min-w-0 flex-1 sm:flex-initial" + (align === "right" ? " sm:text-right" : "")}>
        <div className="text-lg sm:text-xl font-bold tracking-tight truncate group-hover:text-accent-200 transition-colors">
          {team.name}
        </div>
        <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
          {team.shortName}
        </div>
      </div>
      {align === "right" && (
        <TeamFlag code={team.flag} size="lg" className="hidden sm:inline-block" />
      )}
    </Link>
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

// ─── Norway national form card ───────────────────────────────────────────────

function NorwayFormCard({ form }: { form: TeamFormData }) {
  const isMock = form.source === "mock";
  const resultColor = (r: "W" | "D" | "L") =>
    r === "W" ? "text-win" : r === "D" ? "text-draw" : "text-loss";
  const resultBg = (r: "W" | "D" | "L") =>
    r === "W"
      ? "bg-win text-pitch-950"
      : r === "D"
      ? "bg-draw text-pitch-950"
      : "bg-loss text-white";
  const resultLabel = (r: "W" | "D" | "L") =>
    r === "W" ? "S" : r === "D" ? "U" : "T";

  return (
    <section className="card-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-accent-400" />
          <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
            Norges landslag — siste kamper
          </h2>
        </div>
        <span
          className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${
            isMock
              ? "bg-pitch-800 text-pitch-500"
              : "bg-data-500/10 text-data-300"
          }`}
        >
          {isMock ? "eksempeldata" : "api-football"}
        </span>
      </div>

      <div className="space-y-2">
        {form.matches.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm py-1.5 border-b border-pitch-800/60 last:border-0"
          >
            {/* Result dot */}
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 ${resultBg(m.result)}`}
            >
              {resultLabel(m.result)}
            </span>

            {/* Opponent */}
            <span className="flex-1 text-pitch-100 text-xs">
              {m.venue === "H" ? "hjemme vs" : m.venue === "A" ? "borte vs" : "nøytral vs"}{" "}
              <span className="font-semibold">{m.opponentFlag ?? ""} {m.opponent}</span>
            </span>

            {/* Score */}
            <span className={`font-mono text-sm font-bold stat-num ${resultColor(m.result)}`}>
              {m.goalsFor}–{m.goalsAgainst}
            </span>

            {/* Date + competition */}
            <div className="text-right shrink-0 hidden sm:block">
              <div className="text-[10px] text-pitch-400 font-mono">{m.date.slice(0, 7)}</div>
              <div className="text-[10px] text-pitch-600 truncate max-w-[120px]">{m.competition}</div>
            </div>
          </div>
        ))}
      </div>

      {isMock && (
        <p className="mt-3 text-[10px] text-pitch-600 italic">
          Eksempeldata — sett <code className="font-mono text-pitch-500">API_FOOTBALL_KEY</code> for ekte kampresultater.
        </p>
      )}
    </section>
  );
}

// ─── Group standings with form ────────────────────────────────────────────────

function GroupStandings({
  groupTeams,
  label,
  formMap,
}: {
  groupTeams: ReturnType<typeof teamsByGroup>;
  label: string;
  formMap: Map<number, TeamFormData>;
}) {
  const resultBg = (r: "W" | "D" | "L") =>
    r === "W"
      ? "bg-win text-pitch-950"
      : r === "D"
      ? "bg-draw text-pitch-950"
      : "bg-loss text-white";
  const resultLabel = (r: "W" | "D" | "L") =>
    r === "W" ? "S" : r === "D" ? "U" : "T";

  return (
    <div className="card-panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={12} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {label}
        </h2>
      </div>
      <ul className="space-y-3">
        {groupTeams.map((t, i) => {
          const form = formMap.get(t.id);
          return (
            <li key={t.id}>
              <Link
                href={`/teams/${t.id}`}
                className="flex items-center gap-3 text-sm hover:bg-pitch-800/40 -mx-2 px-2 py-1 rounded transition-colors group"
              >
                <span className="font-mono text-pitch-500 w-4 text-right stat-num">
                  {i + 1}
                </span>
                <TeamFlag code={t.flag} size="sm" />
                <span
                  className={`flex-1 truncate group-hover:text-accent-200 transition-colors ${
                    t.id === NORWAY_ID ? "font-bold text-accent-300" : "text-pitch-100"
                  }`}
                >
                  {t.name}
                </span>
              </Link>
              {/* Form dots */}
              {form && (
                <div className="flex items-center gap-1 mt-1.5 ml-7 pl-3">
                  {form.matches.map((m, j) => (
                    <span
                      key={j}
                      title={`${m.opponent} ${m.goalsFor}–${m.goalsAgainst}`}
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold leading-none ${resultBg(m.result)}`}
                    >
                      {resultLabel(m.result)}
                    </span>
                  ))}
                  <span className="text-[9px] text-pitch-600 font-mono ml-1">
                    {form.source === "mock" ? "mock" : "live"}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-pitch-500 leading-relaxed">
        Topp 2 + beste 3.-plass → Runde av 32. Frankrike er gruppefavoritter;
        Norges vei går trolig via 2.- eller 3.-plass.
      </p>
    </div>
  );
}

function KeyPlayers({
  players,
  label,
}: {
  players: ReturnType<typeof getSquad>;
  label: string;
}) {
  return (
    <div className="card-panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <Flag size={12} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {label}
        </h2>
      </div>
      <ul className="space-y-3.5">
        {players.map((p) => {
          const form = getPlayerForm(p.id);
          return (
            <li key={p.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-pitch-950 font-mono font-bold text-sm stat-num shrink-0">
                  {p.number || "—"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-[11px] text-pitch-400 truncate">
                    {p.club} · {p.position}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-base font-bold stat-num text-accent-300">
                    {p.goals ?? "—"}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
                    {p.caps ?? "—"} caps
                  </div>
                </div>
              </div>

              {form && (
                <div className="ml-13 pl-1 flex items-center gap-3 text-[11px] text-pitch-400 font-mono">
                  <span className="text-pitch-300">
                    <span className="text-pitch-100 font-semibold stat-num">{form.apps}</span> apps ·{" "}
                    <span className="text-accent-300 font-semibold stat-num">{form.goals}</span>g ·{" "}
                    <span className="text-data-300 font-semibold stat-num">{form.assists}</span>a
                  </span>
                  <span className="text-pitch-600">·</span>
                  <div className="flex items-center gap-0.5">
                    {form.last5.map((o, i) => (
                      <OutcomeDot key={i} outcome={o} />
                    ))}
                  </div>
                </div>
              )}
              {form?.note && (
                <div className="ml-13 pl-1 text-[11px] text-pitch-400 italic">
                  {form.note}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 pt-3 border-t border-pitch-700/60 text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
        Club form · 2025/26 season
      </div>
    </div>
  );
}

function OutcomeDot({ outcome }: { outcome: ClubOutcome }) {
  const cls = {
    W: "bg-win/30 text-win ring-win/50",
    D: "bg-draw/15 text-draw ring-draw/40",
    L: "bg-loss/15 text-loss ring-loss/40",
    B: "bg-pitch-800 text-pitch-500 ring-pitch-700",
  }[outcome];
  return (
    <span
      className={`h-5 w-5 inline-flex items-center justify-center rounded-sm text-[10px] font-bold font-mono ring-1 ${cls}`}
    >
      {outcome}
    </span>
  );
}

