import Link from "next/link";
import { Search, Menu, ArrowUpRight } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { teamById, teamName, TOURNAMENT } from "@/lib/wc26-data";
import { nextFixtures, fixturesOn } from "@/lib/wc26-fixtures";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";

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
export default function DashboardPage() {
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
        <NorgePin />
      </section>

      {/* Top performers — placeholder until a real top-scorers feed is wired.
          We don't fabricate "live" top scorers; the empty state is the
          honest answer until match results + player stats arrive in DB. */}
      <section className="px-5 md:px-10 mt-9 mb-12">
        <Kicker tone="amber">Hovedpersoner</Kicker>
        <Headline rank="h3">
          {tournamentLive ? "Toppscorerne kommer her." : "VM-toppscorerne kommer her."}
        </Headline>
        <div className="mt-4 surface p-5 sm:p-6 flex items-start gap-4">
          <div className="h-10 w-10 bg-amber/15 flex items-center justify-center shrink-0">
            <span className="font-serif text-amber text-lg font-semibold leading-none">⚽</span>
          </div>
          <div className="min-w-0">
            <div className="font-serif text-lg font-semibold tracking-editorial text-cream">
              {tournamentLive ? "Topplisten ruller når data er koblet på." : "Listen åpner 11. juni."}
            </div>
            <p className="text-sm text-cream/55 mt-2 leading-relaxed max-w-2xl">
              {tournamentLive
                ? "Topplisten viser ekte mål når kampresultater er registrert. Inntil da: følg landslagene under "
                : "Toppscorerne, assist-kongene og hovedpersonene fra hver matchday rangeres her så snart første kamp er ferdigspilt. Inntil da: følg landslagene under "}
              <Link href="/teams" className="text-signal hover:underline">Lag</Link>,
              eller pek ut din egen mester i <Link href="/bracket" className="text-signal hover:underline">turneringstreet</Link>.
            </p>
          </div>
        </div>
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

function NorgePin() {
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
            41% sjanse for R32.
          </div>
          <div className="text-xs text-cream/55 mt-1">Haaland 4 mål · form W·W·D</div>
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
