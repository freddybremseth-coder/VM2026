import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline, PullQuote } from "@/components/shared/EditorialKicker";
import { teamById, teamsByGroup } from "@/lib/wc26-data";

/**
 * Norge — flagship landlagsprofil. Gets editorial treatment no other team
 * has (yet):
 *  · cinematic blurred-flag hero with 80px serif "Norge."
 *  · italic pull-quote
 *  · qualification matrix block (Tactician) with R32 probability
 *  · group standings (editorial table)
 *  · Haaland portrait card
 *
 * Pull real data once available:
 *  - qualificationOdds → from your /api/sim/norway endpoint
 *  - groupStandings    → from MD-result aggregation
 *  - haalandStats      → from `lib/wc26-data` player lookup
 */
export default function NorgePage() {
  const groupI = teamsByGroup("I");
  const norway = teamById("no");

  // Replace with real model output
  const qualOdds = 41;

  // Replace with real standings
  const standings = [
    { team: "no", gd: "+2", pts: 3 },
    { team: "fr", gd: "+2", pts: 3 },
    { team: "es", gd: "-1", pts: 0 },
    { team: "sn", gd: "-3", pts: 0 },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Cinematic flag hero ────────────────────────────── */}
      <section className="relative h-[480px] md:h-[640px] overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-25%",
            filter: "blur(36px) saturate(1.2) brightness(.55)",
          }}
        >
          <HoloFlag code="no" w={800} radius={0} shimmer="strong" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0) 0%, hsl(var(--canvas)) 60%), linear-gradient(180deg, rgba(0,0,0,.4) 0%, transparent 30%)",
          }}
        />
        <div className="relative h-full px-5 md:px-10 py-6 flex flex-col">
          <div className="flex items-center gap-3">
            <HoloFlag code="no" w={36} radius={3} shimmer="animated" />
            <Kicker tone="cream">Gruppe I · Landlagsprofil</Kicker>
          </div>
          <div className="flex-1" />
          <Headline rank="h1" className="!font-semibold !tracking-[-0.03em]">Norge.</Headline>
          <PullQuote cite="Solbakken" className="mt-3 md:mt-6">
            Endelig tilbake.
          </PullQuote>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-cream/70 max-w-xl leading-relaxed">
            Første sluttspill siden 1998. {norway?.fifaRank ? `${norway.fifaRank}. seedet, ` : ""}
            9 mål av Haaland i kvalifiseringen, en gruppe ingen ville ha.
          </p>
        </div>
      </section>

      {/* ── Qualification matrix (Tactician) ─────────────────── */}
      <section className="px-5 md:px-10 mt-8">
        <Kicker>Kvalifiseringsmatrix</Kicker>
        <Headline rank="h2">Veien til R32.</Headline>

        <div className="mt-4 surface">
          {/* Probability bar */}
          <div className="px-5 py-4 border-b border-cream/8 flex items-center gap-4">
            <span className="font-serif text-[44px] md:text-[56px] font-semibold text-signal leading-none tracking-[-0.04em] stat-num">
              {qualOdds}%
            </span>
            <div className="flex-1">
              <Kicker tone="muted">10.000 simuleringer</Kicker>
              <div className="h-1 bg-cream/14 mt-2 relative">
                <div className="absolute left-0 top-0 bottom-0 bg-signal" style={{ width: `${qualOdds}%` }} />
              </div>
            </div>
          </div>

          {/* Scenarios */}
          {[
            { vs: "VS ESP", res: "D", text: "Uavg. nok · +9% videre",       resColor: "bg-amber" },
            { vs: "VS FRA", res: "D", text: "Uavg. solid · +14% videre",    resColor: "bg-amber" },
            { vs: "VS SEN", res: "W", text: "Seier sikrer R32 · +36%",      resColor: "bg-signal" },
          ].map((row, i) => (
            <div
              key={row.vs}
              className={`grid grid-cols-[68px_22px_1fr] gap-3 items-center px-5 py-2.5 font-mono ${
                i ? "border-t border-cream/8" : ""
              }`}
            >
              <span className="text-[11px] font-bold tracking-[1px] text-cream">{row.vs}</span>
              <span className={`w-5 h-5 flex items-center justify-center text-canvas text-[11px] font-extrabold ${row.resColor}`}>
                {row.res}
              </span>
              <span className="text-[10.5px] text-cream/55 tracking-wide">{row.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Group I standings (editorial) ────────────────────── */}
      <section className="px-5 md:px-10 mt-8">
        <Kicker>Gruppe I · stilling</Kicker>
        <Headline rank="h2">Marsjordre.</Headline>
        <div className="mt-3">
          {standings.map((t, i) => {
            const team = teamById(t.team);
            const isNorway = t.team === "no";
            return (
              <div
                key={t.team}
                className={`grid grid-cols-[22px_28px_1fr_50px_28px] gap-3 items-center py-3 border-t border-cream/8 ${
                  i === standings.length - 1 ? "border-b border-cream/8" : ""
                } ${isNorway ? "bg-signal/5 -mx-2.5 px-2.5" : ""}`}
              >
                <span className={`font-serif text-base font-semibold ${i < 2 ? "text-signal" : "text-cream/55"}`}>
                  {i + 1}
                </span>
                <HoloFlag code={t.team} w={24} radius={3} shimmer={isNorway ? "animated" : "medium"} />
                <span className={`font-serif text-[17px] tracking-editorial ${isNorway ? "font-bold" : "font-medium"}`}>
                  {team?.name ?? t.team}
                </span>
                <span className={`font-mono text-[11px] text-right font-semibold ${t.gd.startsWith("+") ? "text-win" : "text-loss"} stat-num`}>
                  {t.gd}
                </span>
                <span className={`font-serif text-xl font-semibold text-right stat-num ${isNorway ? "text-signal" : "text-cream"}`}>
                  {t.pts}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Haaland portrait ─────────────────────────────────── */}
      <section className="px-5 md:px-10 mt-10 mb-10">
        <Kicker tone="amber">Portrett</Kicker>
        <Headline rank="h2">
          Haaland — <em className="text-amber">signalet</em>.
        </Headline>
        <div className="mt-4 py-4 border-y border-cream/8 grid grid-cols-[72px_1fr] gap-4 items-center">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-serif text-3xl font-bold text-canvas tracking-tight"
            style={{ background: "radial-gradient(circle at 40% 40%, hsl(var(--amber)) 0%, hsl(var(--signal-deep)) 100%)" }}
          >
            EH
          </div>
          <div>
            <div className="font-serif text-xl font-semibold tracking-editorial">Erling Haaland</div>
            <div className="flex gap-4 mt-2">
              {[
                ["Mål", 4],
                ["xG", "3.1"],
                ["Min", 91],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <span className="font-serif text-[22px] font-semibold text-cream block stat-num">{v}</span>
                  <Kicker tone="muted">{l}</Kicker>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
