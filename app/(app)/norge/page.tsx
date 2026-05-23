import Link from "next/link";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline, PullQuote } from "@/components/shared/EditorialKicker";
import { teamById, teamsByGroup } from "@/lib/wc26-data";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { getSquad } from "@/lib/wc26-squads";
import { getPlayerForm } from "@/lib/player-form";
import { getTeamFormBatch, type TeamFormData } from "@/lib/team-form";
import { NorwayScenarioCalculator } from "@/components/norge/NorwayScenarioCalculator";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

/**
 * Norge — flagship landlagsprofil (editorial cinematic).
 *
 * Sections (HANDOFF order):
 *  1. Cinematic blurred-flag hero  — 80px serif "Norge."  + pull-quote
 *  2. Kvalifiseringsmatrix         — qualification probability + scenarios
 *  3. Gruppe I stilling            — editorial standings table w/ form dots
 *  4. Haaland portrait             — top scorer card w/ stats
 *  5. NorwayScenarioCalculator     — interactive what-if (existing)
 *
 * Numbers wired up to real squad + form data. The qualification odds
 * are a placeholder until the simulation backend is online (HANDOFF
 * §"Live data wiring" Q1).
 */

const NORWAY_ID = 21;
const GROUP_I_IDS = [14, 8, 27, 21]; // FRA, SEN, IRQ, NOR

export default async function NorgePage() {
  const norway = teamById(NORWAY_ID);
  if (!norway) {
    return <div className="p-6 text-cream">Norway team data not loaded.</div>;
  }
  const groupI = teamsByGroup("I");
  const squad = getSquad(NORWAY_ID);
  const haaland = squad.find((p) => p.id === 2122) ?? null;
  const haalandForm = haaland ? getPlayerForm(haaland.id) : null;

  // Pre-tournament form for all 4 Group I teams (API-Football / mock)
  const formMap = await getTeamFormBatch(GROUP_I_IDS);

  // Norway's three group fixtures
  const norwayFixtures = FIXTURES.filter(
    (f) => f.homeId === NORWAY_ID || f.awayId === NORWAY_ID,
  ).sort((a, b) => a.kickoff.localeCompare(b.kickoff));

  // Placeholder qualification odds — replace when sim backend lands.
  const qualOdds = 41;

  // Group I standings — pre-tournament view (FIFA-rank-driven expected order,
  // zero points across the board). Live MD aggregation will overwrite once
  // matchday 1 is played.
  const tournamentStarted =
    new Date() >= new Date("2026-06-11T00:00:00Z");
  const standings: Array<{ teamId: number; gd: string; pts: number }> = [
    { teamId: 14, gd: "—", pts: 0 },
    { teamId: 21, gd: "—", pts: 0 },
    { teamId: 8, gd: "—", pts: 0 },
    { teamId: 27, gd: "—", pts: 0 },
  ];

  return (
    <div className="min-h-screen">
      {/* ── 1. Cinematic flag hero ──────────────────────────────── */}
      <section className="relative h-[480px] md:h-[640px] overflow-hidden">
        {/* Norwegian atmosphere photo (aurora/landscape) — sits beneath the
            blurred flag for depth and a sense of place. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1800&q=80&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: 0.45,
            filter: "saturate(0.95) brightness(0.7)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-25%",
            filter: "blur(36px) saturate(1.2) brightness(.55)",
            mixBlendMode: "screen",
            opacity: 0.85,
          }}
        >
          <HoloFlag code="no" w={800} radius={0} shimmer="strong" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0) 0%, hsl(var(--canvas)) 60%), linear-gradient(180deg, rgba(0,0,0,.45) 0%, transparent 30%)",
          }}
        />
        <div className="relative h-full px-5 md:px-10 py-6 flex flex-col">
          <div className="flex items-center gap-3">
            <HoloFlag code="no" w={36} radius={3} shimmer="animated" />
            <Kicker tone="cream">Gruppe I · Landlagsprofil</Kicker>
          </div>
          <div className="flex-1" />
          <Headline rank="h1" className="!font-semibold !tracking-[-0.03em]">
            Norge.
          </Headline>
          <PullQuote cite="Solbakken" className="mt-3 md:mt-6">
            Endelig tilbake.
          </PullQuote>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-cream/70 max-w-xl leading-relaxed">
            Første sluttspill siden 1998.
            {norway.fifaRank ? ` FIFA-rang #${norway.fifaRank}, ` : " "}
            {haaland?.goals
              ? `${haaland.goals} mål av Haaland for landslaget`
              : "Haaland i bestillingsform"}
            , en gruppe ingen ville ha.
          </p>
        </div>
      </section>

      {/* ── 2. Qualification matrix (Tactician) ─────────────────── */}
      <section className="px-5 md:px-10 mt-8">
        <Kicker>Pre-VM prognose</Kicker>
        <Headline rank="h2">Veien til R32.</Headline>

        <div className="mt-4 surface">
          <div className="px-5 py-4 border-b border-cream/8 flex items-center gap-4">
            <span className="font-serif text-[44px] md:text-[56px] font-semibold text-signal leading-none tracking-[-0.04em] stat-num">
              {qualOdds}%
            </span>
            <div className="flex-1">
              <Kicker tone="muted">10.000 simuleringer · v0.1 · før avspark</Kicker>
              <div className="h-1 bg-cream/14 mt-2 relative">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-signal"
                  style={{ width: `${qualOdds}%` }}
                />
              </div>
            </div>
          </div>

          {[
            { vs: "VS IRQ", res: "W", text: "Seier åpner gruppen · +24%", resColor: "bg-signal" },
            { vs: "VS SEN", res: "W", text: "Seier sikrer R32-kurs · +36%", resColor: "bg-signal" },
            { vs: "VS FRA", res: "D", text: "Uavgjort solid · +14%", resColor: "bg-amber" },
          ].map((row, i) => (
            <div
              key={row.vs}
              className={`grid grid-cols-[68px_22px_1fr] gap-3 items-center px-5 py-2.5 font-mono ${
                i ? "border-t border-cream/8" : ""
              }`}
            >
              <span className="text-[11px] font-bold tracking-[1px] text-cream">{row.vs}</span>
              <span
                className={`w-5 h-5 flex items-center justify-center text-canvas text-[11px] font-extrabold ${row.resColor}`}
              >
                {row.res}
              </span>
              <span className="text-[10.5px] text-cream/55 tracking-wide">{row.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Group I standings (editorial) ────────────────────── */}
      <section className="px-5 md:px-10 mt-8">
        <Kicker>Gruppe I · stilling</Kicker>
        <Headline rank="h2">
          {tournamentStarted ? "Marsjordre." : "Forventet rekkefølge."}
        </Headline>
        {!tournamentStarted && (
          <p className="text-xs text-cream/55 mt-2 font-mono">
            Tabellen oppdateres automatisk etter første matchday · 11. juni.
            Foreløpig sortert etter FIFA-rang.
          </p>
        )}
        <div className="mt-3">
          {standings.map((row, i) => {
            const team = teamById(row.teamId);
            if (!team) return null;
            const isNorway = team.id === NORWAY_ID;
            return (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className={`grid grid-cols-[22px_28px_1fr_50px_28px] gap-3 items-center py-3 border-t border-cream/8 hover:bg-cream/5 transition-colors ${
                  i === standings.length - 1 ? "border-b border-cream/8" : ""
                } ${isNorway ? "bg-signal/5 -mx-2.5 px-2.5" : ""}`}
              >
                <span
                  className={`font-serif text-base font-semibold ${
                    i < 2 ? "text-signal" : "text-cream/55"
                  }`}
                >
                  {i + 1}
                </span>
                <HoloFlag
                  code={team.flag}
                  w={24}
                  radius={3}
                  shimmer={isNorway ? "animated" : "medium"}
                />
                <span
                  className={`font-serif text-[17px] tracking-editorial ${
                    isNorway ? "font-bold" : "font-medium"
                  }`}
                >
                  {team.name}
                </span>
                <span
                  className={`font-mono text-[11px] text-right font-semibold stat-num ${
                    row.gd === "—"
                      ? "text-cream/35"
                      : row.gd.startsWith("+")
                      ? "text-win"
                      : "text-loss"
                  }`}
                >
                  {row.gd}
                </span>
                <span
                  className={`font-serif text-xl font-semibold text-right stat-num ${
                    row.pts === 0
                      ? "text-cream/35"
                      : isNorway
                      ? "text-signal"
                      : "text-cream"
                  }`}
                >
                  {row.pts}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Form dots row underneath — keeps the editorial table clean */}
        <div className="mt-3 text-[10px] font-mono uppercase tracking-[1.2px] text-cream/35">
          Siste 5 landskamper
        </div>
        <div className="mt-1.5 space-y-1.5">
          {standings.map((row) => {
            const team = teamById(row.teamId);
            const teamForm = formMap.get(row.teamId);
            if (!team || !teamForm) return null;
            return (
              <FormDotsRow key={team.id} shortName={team.shortName} form={teamForm} />
            );
          })}
        </div>
      </section>

      {/* ── 4. Haaland portrait ─────────────────────────────────── */}
      {haaland && (
        <section className="px-5 md:px-10 mt-10">
          <Kicker tone="amber">Portrett</Kicker>
          <Headline rank="h2">
            Haaland — <em className="text-amber">signalet</em>.
          </Headline>
          <Link
            href={`/players/${haaland.id}`}
            className="mt-4 py-4 border-y border-cream/8 grid grid-cols-[72px_1fr] gap-4 items-center hover:bg-cream/4 transition-colors"
          >
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-serif text-3xl font-bold text-canvas tracking-tight"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, hsl(var(--amber)) 0%, hsl(var(--signal-deep)) 100%)",
              }}
            >
              EH
            </div>
            <div>
              <div className="font-serif text-xl font-semibold tracking-editorial">
                {haaland.name}
              </div>
              <div className="text-[11px] text-cream/55 mt-0.5 font-mono">
                {haaland.club} · #{haaland.number}
              </div>
              <div className="flex gap-4 mt-2.5">
                <Stat label="Mål" value={haaland.goals ?? "—"} />
                <Stat label="Caps" value={haaland.caps ?? "—"} />
                <Stat
                  label="Klubb 25/26"
                  value={haalandForm ? `${haalandForm.goals}g · ${haalandForm.assists}a` : "—"}
                />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── 5. Interactive scenario calculator ──────────────────── */}
      <section className="px-5 md:px-10 mt-10 mb-10">
        <Kicker tone="muted">Prøv andre scenarier</Kicker>
        <Headline rank="h3" className="mb-4">
          Hva om&hellip;
        </Headline>
        <NorwayScenarioCalculator />
      </section>

      {/* ── Fixture cards row at bottom ─────────────────────────── */}
      <section className="px-5 md:px-10 mb-12">
        <Kicker>Norges tre gruppekamper</Kicker>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {norwayFixtures.map((f) => (
            <NorgeFixtureCard key={f.id} fixture={f} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <span className="font-serif text-[22px] font-semibold text-cream block leading-none stat-num">
        {value}
      </span>
      <Kicker tone="muted">{label}</Kicker>
    </div>
  );
}

function FormDotsRow({
  shortName,
  form,
}: {
  shortName: string;
  form: TeamFormData;
}) {
  const dotClass = (r: "W" | "D" | "L") =>
    r === "W"
      ? "bg-win text-canvas"
      : r === "D"
      ? "bg-amber text-canvas"
      : "bg-loss text-cream";
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[1.2px] text-cream/55 w-10">
        {shortName}
      </span>
      <div className="flex items-center gap-1">
        {form.matches.map((m, i) => (
          <span
            key={i}
            title={`${m.opponent} ${m.goalsFor}–${m.goalsAgainst}`}
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold ${dotClass(m.result)}`}
          >
            {m.result === "W" ? "S" : m.result === "D" ? "U" : "T"}
          </span>
        ))}
      </div>
      <span className="text-[9px] font-mono text-cream/35 ml-1">
        {form.source === "mock" ? "mock" : "live"}
      </span>
    </div>
  );
}

function NorgeFixtureCard({ fixture }: { fixture: Fixture }) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  if (!home || !away) return null;
  const opp = home.id === NORWAY_ID ? away : home;
  const norgeAtHome = home.id === NORWAY_ID;

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className="block surface px-4 py-3.5 hover:border-cream/16 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-[1.2px] text-cream/55">
          {fixture.stage.kind === "group"
            ? `MD${fixture.stage.matchday}`
            : "KO"}
        </span>
        <span className="font-mono text-[11px] text-cream/70 stat-num">
          {formatKickoff(fixture.kickoff)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <HoloFlag code="no" w={26} radius={3} />
        <span className="text-cream/35 font-mono text-xs">{norgeAtHome ? "vs" : "@"}</span>
        <HoloFlag code={opp.flag} w={26} radius={3} />
        <span className="font-serif text-sm font-semibold flex-1 tracking-editorial">
          {opp.name}
        </span>
      </div>
      <div className="mt-2 text-[10px] text-cream/45 font-mono">
        {formatDateLabel(fixture.kickoff).split(",")[0]}
      </div>
    </Link>
  );
}
