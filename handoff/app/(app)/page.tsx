import Link from "next/link";
import { Search, Menu, ArrowUpRight } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { LiveTicker, type TickerItem } from "@/components/shared/LiveTicker";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { teamById, TOURNAMENT } from "@/lib/wc26-data";
import { FIXTURES, nextFixtures, fixturesOn } from "@/lib/wc26-fixtures";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";

/**
 * Dashboard — VM2026 hero. Editorial layout (Stadium) on top, Tactician
 * fixture table below, Broadcast live ticker pinned over the hero, and a
 * Norway-pin module that promotes /norge.
 *
 * Layout zones:
 *  ┌─ LiveTicker (when something is live)
 *  ├─ Cinematic StadiumBackdrop hero with editorial headline + LIVE state
 *  ├─ "I dag · MD2" Tactician-style fixture table
 *  ├─ NorgePin promo strip (gradient + animated flag)
 *  └─ Editorial portrait carousel of top scorers
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

  // Ticker items — replace with real live-data feed when wired up.
  const tickerItems: TickerItem[] = tournamentLive
    ? buildLiveTickerItems(todayFixtures)
    : [];

  return (
    <div className="min-h-screen">
      <LiveTicker items={tickerItems} />

      {/* Cinematic hero */}
      <StadiumBackdrop height={400} className="md:h-[460px]">
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
            {tournamentLive ? "Dette skjer nå" : t.dashboard.countdown}
          </Kicker>
          <Headline rank="h1" className="mt-2 max-w-[12ch]">
            {tournamentLive
              ? <>Norge møter<br />Spania i LA.</>
              : <>{t.dashboard.daysToKickoff(daysToKickoff)}</>}
          </Headline>
          <p className="mt-4 text-cream/75 text-sm md:text-base leading-relaxed max-w-md">
            {tournamentLive
              ? "Første gruppespill-billett siden 1998. Yamal og co står i veien."
              : t.dashboard.openerLine(formatDateLabel(TOURNAMENT.startDate))}
          </p>

          {tournamentLive && <DashboardLiveBadge />}
        </div>
      </StadiumBackdrop>

      {/* Today's fixtures — Tactician table */}
      <section className="border-t border-cream/8">
        <div className="px-5 md:px-10 pt-6 pb-3">
          <Kicker>{tournamentLive ? "I dag · MD2" : "Først ut"}</Kicker>
          <Headline rank="h2">
            {todayFixtures.length || upcoming.length} kamper.
          </Headline>
        </div>
        <div>
          {(tournamentLive ? todayFixtures : upcoming).slice(0, 5).map((f, i) => (
            <FixtureRow key={f.id} fixture={f} first={i === 0} />
          ))}
        </div>
      </section>

      {/* Norge promo strip */}
      <section className="px-5 md:px-10 mt-7">
        <NorgePin />
      </section>

      {/* Top performers — editorial portrait carousel */}
      <section className="px-5 md:px-10 mt-9">
        <Kicker tone="amber">Hovedpersoner</Kicker>
        <Headline rank="h3">De som leverte i MD1.</Headline>
      </section>
      <TopScorersStrip />
    </div>
  );
}

// ─── Internal components ──────────────────────────────────────

function DashboardLiveBadge() {
  // Replace with actual current live match lookup.
  return (
    <div className="mt-5 flex items-center gap-4">
      <div className="inline-flex items-center gap-1.5 bg-signal text-cream rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[1px]">
        <span className="live-dot" />
        LIVE · 67&apos;
      </div>
      <span className="font-mono text-[13px] font-bold text-cream stat-num">
        NOR 1 : 1 ESP
      </span>
    </div>
  );
}

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
          {home?.name ?? "TBD"}
          <span className="text-cream/35 mx-2 font-normal">vs</span>
          {away?.name ?? "TBD"}
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

function TopScorersStrip() {
  // Placeholder — connect to your top-scorers source.
  const scorers = [
    { name: "E. Haaland", flag: "no",      goals: 4, xg: 3.1 },
    { name: "K. Mbappé",  flag: "fr",      goals: 3, xg: 3.4 },
    { name: "L. Yamal",   flag: "es",      goals: 3, xg: 2.2 },
    { name: "Vinícius",   flag: "br",      goals: 2, xg: 2.7 },
  ];
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-thin px-5 md:px-10 mt-3 pb-2">
      {scorers.map((p, i) => (
        <article key={p.name} className="min-w-[158px]">
          <div className="h-[168px] relative overflow-hidden bg-paper">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255,183,46,.35) 0%, transparent 50%), linear-gradient(180deg, #2A2018 0%, #15110F 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-serif text-[78px] font-semibold text-cream/85 tracking-[-3px]">
              {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="absolute top-2.5 left-2.5"><HoloFlag code={p.flag} w={24} radius={3}/></div>
            <div className="absolute bottom-2.5 right-2.5 font-serif font-semibold text-xs text-amber">
              №{i + 1}
            </div>
          </div>
          <div className="mt-2.5">
            <Kicker tone="muted">{p.flag.toUpperCase()}</Kicker>
            <div className="font-serif text-[15px] font-semibold mt-0.5">{p.name}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-[22px] font-semibold text-amber leading-none stat-num">{p.goals}</span>
              <span className="font-mono text-[9px] text-cream/35">xG <span className="stat-num text-cream/55">{p.xg.toFixed(1)}</span></span>
            </div>
          </div>
        </article>
      ))}
    </div>
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

function buildLiveTickerItems(
  todayFixtures: ReturnType<typeof fixturesOn>,
): TickerItem[] {
  // Stub data — replace with live feed aggregation.
  return [
    { kind: "LIVE", text: "NOR 1–1 ESP · 67′ · Yamal utligner" },
    { kind: "xG",   text: "Norge xG 1.42 · stigende" },
    { kind: "NEXT", text: "FRA – SEN · 21:00" },
    { kind: "TIP",  text: "4.2 mill. tips lagt inn for MD2" },
  ];
}
