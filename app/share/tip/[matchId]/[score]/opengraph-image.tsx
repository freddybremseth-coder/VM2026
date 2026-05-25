import { ImageResponse } from "next/og";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";
import { OG, OG_SIZE, OG_BG, BrandMark, FlagBlock, Footer, loadFraunces } from "@/lib/og/shared";

export const runtime = "edge";
export const alt = "VM 2026 — mitt tips";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TipShareImage({
  params,
}: {
  params: { matchId: string; score: string };
}) {
  const fixture = fixtureById(Number(params.matchId));
  const home = fixture?.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture?.awayId ? teamById(fixture.awayId) : undefined;
  const fonts = await loadFraunces();

  // Score path segment is `h-a` e.g. "2-1".
  const [hRaw, aRaw] = (params.score ?? "").split("-");
  const homeScore = Number.parseInt(hRaw ?? "", 10);
  const awayScore = Number.parseInt(aRaw ?? "", 10);

  const kickoffLabel = fixture
    ? new Date(fixture.kickoff).toLocaleString("nb-NO", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Oslo",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: OG_BG,
          color: OG.cream,
          padding: 56,
          fontFamily: "system-ui",
        }}
      >
        {/* Brand strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BrandMark tagline="Mitt VM-tips" />
          <span style={{ fontSize: 17, color: OG.amber, letterSpacing: 2, fontWeight: 600 }}>{kickoffLabel}</span>
        </div>

        {/* Team / score / team */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            marginTop: 24,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
            <FlagBlock code={home?.flag} w={130} h={84} />
            <div style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.05, marginTop: 18, fontFamily: "Fraunces" }}>
              {home?.name ?? "TBD"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontSize: 150,
              fontWeight: 700,
              color: OG.amber,
              lineHeight: 1,
              fontFamily: "Fraunces",
            }}
          >
            <span style={{ display: "flex" }}>{Number.isInteger(homeScore) ? homeScore : "?"}</span>
            <span style={{ display: "flex", fontSize: 70, color: OG.creamFaint, fontWeight: 300 }}>–</span>
            <span style={{ display: "flex" }}>{Number.isInteger(awayScore) ? awayScore : "?"}</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <FlagBlock code={away?.flag} w={130} h={84} />
            <div style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.05, marginTop: 18, fontFamily: "Fraunces" }}>
              {away?.name ?? "TBD"}
            </div>
          </div>
        </div>

        <Footer note="3 poeng eksakt · 1 poeng riktig utfall" />
      </div>
    ),
    { ...size, fonts },
  );
}
