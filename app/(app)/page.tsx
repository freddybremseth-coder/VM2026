import Link from "next/link";
import { Search, Menu, ArrowUpRight, Trophy } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { teamById, teamName, TOURNAMENT } from "@/lib/wc26-data";
import { nextFixtures, fixturesOn } from "@/lib/wc26-fixtures";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTournamentTopScorersLive, type TournamentScorer } from "@/lib/tournament-scorers";
import { computeGroupStandings, type ResultRow, type GroupStandingRow } from "@/lib/group-standings";
import { getTeamPrediction } from "@/lib/tournament-predictions";
import type { TeamPrediction } from "@/lib/tournament-sim";

const NORWAY_ID = 21;
const HAALAND_PLAYER_ID = 2122;

async function loadNorgePinData(
  supabase: ReturnType<typeof createSupabaseServerClient>,
): Promise<{
  norge: GroupStandingRow | null;
  rank: number | null;
  haalandGoals: number;
  prediction: TeamPrediction | null;
}> {
  try {
    const [resultsRes, haalandRes, prediction] = await Promise.all([
      supabase
        .from("match_results")
        .select("match_id, home_score, away_score, status"),
      supabase
        .from("tournament_goals")
        .select("*", { count: "exact", head: true })
        .eq("scorer_player_id", HAALAND_PLAYER_ID)
        .eq("is_own_goal", false),
      getTeamPrediction(NORWAY_ID),
    ]);
    const results = ((resultsRes.data as ResultRow[] | null) ?? []).filter(
      (r) => r.home_score !== null && r.away_score !== null,
    );
    const standings = computeGroupStandings("I", results);
    const idx = standings.findIndex((r) => r.teamId === NORWAY_ID);
    return {
      norge: idx >= 0 ? standings[idx] : null,
      rank: idx >= 0 ? idx + 1 : null,
      haalandGoals: haalandRes.count ?? 0,
      prediction,
    };
  } catch {
    return { norge: null, rank: null, haalandGoals: 0, prediction: null };
  }
}

/**
 * Dashboard — VM2026 hero.
 *
 * No-stubs rule: every "live" surface here is data-driven or absent. Live
 * scores live in the global LiveStatusBar (under TopBar) which reads from
 * match_results. The previous LiveTicker / DashboardLiveBadge / hardcoded
 * Top-scorers strip have all been removed — they were stub-only.
 *
 * Layout zones:
 *  ├─ Cinematic StadiumBackdrop hero — countdown OR "VM pågår" (factual)
 *  ├─ Today's / upcoming fixtures
 *  ├─ NorgePin promo strip
 *  └─ Top-scorers placeholder until a real feed is wired
 */
export default async function DashboardPage() {
  const t = getDictionary();
  const now = new Date();
  const startDate = new Date(TOURNAMENT.startDate + "T00:00:00Z");
  const finalDate = new Date(TOURNAMENT.endDate + "T00:00:00Z");
  const daysToKickoff = Math.ceil(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const tournamentLive = now >= startDate && now <= finalDate;
  const todayIso = now.toISOString().slice(0, 10);
  const todayFixtures = fixturesOn(todayIso);
  const upcoming = nextFixtures(now.toISOString(), 6);

  // Real tournament top scorers from the per-goal log. Empty until the
  // cron picks up the first finished match's events, in which case the
  // section below renders the honest placeholder.
  const supabase = createSupabaseServerClient();
  const [topScorers, norgePin] = await Promise.all([
    getTournamentTopScorersLive(supabase, 8),
    loadNorgePinData(supabase),
  ]);

  return (
    <div className="min-h-screen">
      {/* Cinematic hero — football crowd photo behind the editorial atmosphere */}
      <StadiumBackdrop
        height={400}
        className="md:h-[460px]"
        photoSrc="https://images.unsplash.com/photo-1522778034537-20a2486be803?w=1800&q=80&auto=format&fit=crop"
        photoPosition="center 40%"
        photoOpacity={0.5}
      >
        <div className="px-5 md:px-10 py-4 h-full flex flex-col">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-signal flex items-center justify-center font-serif font-bold text-cream text-sm tracking-tight">
                26
              </div>
              <span className="text-[11px] tracking-[1.5px] font-bold text-cream">VM 2026</span>
            </Link>
            <div className="flex items-center gap-3 text-cream/80">
              <Search size={18} />
              <Menu size={18} />
            </div>
          </header>

          <div className="flex-1" />

          <Kicker tone="amber">
            {tournamentLive ? "VM pågår" : t.dashboard.countdown}
          </Kicker>
          <Headline rank="h1" className="mt-2 max-w-[12ch]">
            {tournamentLive ? (
              <>
                {todayFixtures.length} kamp{todayFixtures.length === 1 ? "" : "er"}
                <br />i dag.
              </>
            ) : (
              <>{t.dashboard.daysToKickoff(daysToKickoff)}</>
            )}
          </Headline>
          <p className="mt-4 text-cream/75 text-sm md:text-base leading-relaxed max-w-md">
            {tournamentLive
              ? "Live-resultater og oppdateringer ruller inn etter hvert som kampene spilles."
              : t.dashboard.openerLine(formatDateLabel(TOURNAMENT.startDate))}
          </p>
        </div>
      </StadiumBackdrop>

      {/* Today's fixtures — Tactician table */}
      <section className="border-t border-cream/8">
        <div className="px-5 md:px-10 pt-6 pb-3">
          <Kicker>
            {tournamentLive
              ? todayFixtures.length > 0
                ? "I dag"
                : "Neste"
              : "Først ut"}
          </Kicker>
          <Headline rank="h2">
            {todayFixtures.length || upcoming.length} kamper.
          </Headline>
        </div>
        <div>
          {(tournamentLive && todayFixtures.length > 0 ? todayFixtures : upcoming)
            .slice(0, 5)
            .map((f, i) => (
              <FixtureRow key={f.id} fixture={f} first={i === 0} />
            ))}
        </div>
      </section>

      {/* Norge promo strip */}
      <section className="px-5 md:px-10 mt-7">
        <NorgePin data={norgePin} />
      </section>

      {/* Top scorers — driven by the per-goal log in tournament_goals.
          Renders the real leaderboard when goals exist, otherwise an
          honest placeholder. No stub data. */}
      <section className="px-5 md:px-10 mt-9 mb-12">
        <Kicker tone="amber">Hovedpersoner</Kicker>
        {topScorers.length > 0 ? (
          <>
            <Headline rank="h3">VM-toppscorerne.</Headline>
            <TopScorersBoard scorers={topScorers} />
          </>
        ) : (
          <>
            <Headline rank="h3">
              {tournamentLive ? "Toppscorerne kommer her." : "VM-toppscorerne kommer her."}
            </Headline>
            <div className="mt-4 surface p-5 sm:p-6 flex items-start gap-4">
              <div className="h-10 w-10 bg-amber/15 flex items-center justify-center shrink-0">
                <span className="font-serif text-amber text-lg font-semibold leading-none">⚽</span>
              </div>
              <div className="min-w-0">
                <div className="font-serif text-lg font-semibold tracking-editorial text-cream">
                  {tournamentLive ? "Topplisten ruller når første mål er registrert." : "Listen åpner 11. juni."}
                </div>
                <p className="text-sm text-cream/55 mt-2 leading-relaxed max-w-2xl">
                  Topplisten viser ekte mål når API-Football leverer kamp-hendelser. Inntil da: følg landslagene under{" "}
                  <Link href="/teams" className="text-signal hover:underline">Lag</Link>,
                  eller pek ut din egen mester i <Link href="/bracket" className="text-signal hover:underline">turneringstreet</Link>.
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// ─── Internal components ──────────────────────────────────────

function FixtureRow({
  fixture,
  first,
}: {
  fixture: ReturnType<typeof nextFixtures>[number];
  first?: boolean;
}) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  // `live` should come from match-state — placeholder logic here.
  const live = false;

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className={`grid grid-cols-[28px_1fr_auto] gap-4 items-center px-5 md:px-10 py-3.5 border-b border-cream/8 ${
        first ? "border-t border-cream/8" : ""
      } ${live ? "bg-signal/5" : "hover:bg-cream/4 transition-colors"}`}
    >
      {/* Diagonal flag pair */}
      <div className="relative h-7 w-7">
        {home && (
          <HoloFlag
            code={home.flag}
            w={18}
            radius={2}
            shimmer={live ? "animated" : "medium"}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
        )}
        {away && (
          <HoloFlag
            code={away.flag}
            w={18}
            radius={2}
            style={{ position: "absolute", right: 0, bottom: 0 }}
          />
        )}
      </div>

      <div>
        <div className={`font-mono text-[9px] tracking-[1.3px] font-bold ${live ? "text-signal" : "text-cream/35"}`}>
          {live ? "LIVE · 67′" : stageLabel(fixture)}
        </div>
        <div className="font-serif text-base md:text-lg font-semibold leading-tight tracking-editorial mt-0.5">
          {teamName(home)}
          <span className="text-cream/35 mx-2 font-normal">vs</span>
          {teamName(away)}
        </div>
      </div>

      <span className="font-mono text-[11px] text-cream/55 font-semibold tracking-wide">
        {formatKickoff(fixture.kickoff)}
      </span>
    </Link>
  );
}

function TopScorersBoard({ scorers }: { scorers: TournamentScorer[] }) {
  return (
    <ol className="mt-4 surface divide-y divide-cream/8">
      {scorers.map((s, i) => {
        const inner = (
          <li className="flex items-center gap-3 px-4 py-3">
            <span className="font-serif text-base text-cream/45 w-6 text-right stat-num shrink-0">
              {i + 1}
            </span>
            {s.teamFlag && <HoloFlag code={s.teamFlag} w={22} radius={2} />}
            <div className="flex-1 min-w-0">
              <div className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
                {s.scorerName}
              </div>
              <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 truncate">
                {s.teamName}
                {s.penalties > 0 && (
                  <span className="ml-1.5 text-cream/35">· {s.penalties} str.</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Trophy size={12} className="text-amber" />
              <span className="font-mono font-bold stat-num text-lg text-amber">
                {s.goals}
              </span>
            </div>
          </li>
        );
        return s.scorerPlayerId ? (
          <Link key={`${s.teamId}-${s.scorerName}`} href={`/players/${s.scorerPlayerId}`} className="block hover:bg-paperHi transition-colors">
            {inner}
          </Link>
        ) : (
          <div key={`${s.teamId}-${s.scorerName}`}>{inner}</div>
        );
      })}
    </ol>
  );
}

function NorgePin({
  data,
}: {
  data: {
    norge: GroupStandingRow | null;
    rank: number | null;
    haalandGoals: number;
    prediction: TeamPrediction | null;
  };
}) {
  // Headline shows where Norway actually sits in Group I right now — or
  // the model's R32 probability before kickoff.
  let headline = "Følg Norge i Gruppe I.";
  if (data.norge && data.rank && data.norge.played > 0) {
    const placeLabel =
      data.rank === 1
        ? "Topper Gruppe I"
        : data.rank === 2
        ? "2.-plass i Gruppe I"
        : data.rank === 3
        ? "3.-plass i Gruppe I"
        : `${data.rank}.-plass i Gruppe I`;
    headline = `${placeLabel} · ${data.norge.points} p`;
  } else if (data.prediction) {
    headline = `${Math.round(data.prediction.pR32 * 100)}% sjanse for R32.`;
  }
  // Sub-line priority: live Haaland goals > model breakdown > kickoff blurb.
  let subLine = "Gruppespillet starter snart";
  if (data.haalandGoals > 0) {
    subLine = `Haaland ${data.haalandGoals} mål så langt`;
  } else if (data.norge && data.norge.played > 0) {
    subLine = `${data.norge.played} av 3 gruppekamper spilt`;
  } else if (data.prediction) {
    subLine = `Topp 2: ${Math.round(data.prediction.pTop2 * 100)}% · Beste 3.: ${Math.round(
      data.prediction.pThirdQualify * 100,
    )}%`;
  }

  return (
    <Link
      href="/norge"
      className="relative block overflow-hidden border border-cream/8 px-5 py-4 transition-colors hover:border-cream/16"
      style={{ background: "linear-gradient(135deg, rgba(230,57,70,.16) 0%, rgba(157,27,38,.06) 70%)" }}
    >
      {/* Faint flag bg */}
      <div className="absolute -right-7 -top-5 opacity-20 blur-[2px] pointer-events-none">
        <HoloFlag code="no" w={160} radius={0} />
      </div>
      <div className="relative flex items-center gap-4">
        <HoloFlag code="no" w={42} radius={4} shimmer="animated" />
        <div className="flex-1">
          <Kicker tone="cream">Følg Norge · Gruppe I</Kicker>
          <div className="font-serif text-lg md:text-xl font-semibold tracking-editorial mt-1">
            {headline}
          </div>
          <div className="text-xs text-cream/55 mt-1">{subLine}</div>
        </div>
        <ArrowUpRight size={20} className="text-cream/70 shrink-0" />
      </div>
    </Link>
  );
}

// ─── helpers ──────────────────────────────────────────────────

const KO_LABELS: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place",
  FINAL: "Final",
};

function stageLabel(f: ReturnType<typeof nextFixtures>[number]): string {
  return f.stage.kind === "group"
    ? `Gruppe ${f.stage.group} · MD${f.stage.matchday}`
    : KO_LABELS[f.stage.round];
}
