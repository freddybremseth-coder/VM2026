import { ImageResponse } from "next/og";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById, teamName, venueById } from "@/lib/wc26-data";
import { OG, OG_SIZE, OG_BG, BrandMark, FlagBlock, Footer, loadFraunces } from "@/lib/og/shared";

export const runtime = "edge";
export const alt = "VM 2026 kampforhåndsvisning";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function MatchShareImage({
  params,
}: {
  params: { matchId: string };
}) {
  const fixture = fixtureById(Number(params.matchId));
  const home = fixture?.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture?.awayId ? teamById(fixture.awayId) : undefined;
  const venue = fixture ? venueById(fixture.venueId) : undefined;
  const fonts = await loadFraunces();

  const stageLabel =
    fixture && fixture.stage.kind === "group"
      ? `Gruppe ${fixture.stage.group} · MD${fixture.stage.matchday}`
      : "Sluttspill";

  const kickoffLabel = fixture
    ? new Date(fixture.kickoff).toLocaleString("nb-NO", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Oslo",
      })
    : "TBD";

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
          <BrandMark />
          <span
            style={{
              fontSize: 16,
              color: OG.amber,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {stageLabel}
          </span>
        </div>

        {/* Teams */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            marginTop: 28,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
            <FlagBlock code={home?.flag} />
            <div style={{ fontSize: 58, fontWeight: 600, lineHeight: 1, marginTop: 22, fontFamily: "Fraunces" }}>
              {teamName(home)}
            </div>
            <div style={{ fontSize: 20, color: OG.creamDim, marginTop: 8, letterSpacing: 3 }}>
              {home?.shortName ?? ""}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 30, color: OG.signal, fontWeight: 700, fontFamily: "Fraunces" }}>vs</div>
            <div
              style={{
                background: "rgba(255,183,46,0.12)",
                border: "1px solid rgba(255,183,46,0.35)",
                padding: "10px 18px",
                fontSize: 17,
                color: OG.cream,
                fontWeight: 600,
                display: "flex",
              }}
            >
              {kickoffLabel}
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <FlagBlock code={away?.flag} />
            <div style={{ fontSize: 58, fontWeight: 600, lineHeight: 1, marginTop: 22, fontFamily: "Fraunces" }}>
              {teamName(away)}
            </div>
            <div style={{ fontSize: 20, color: OG.creamDim, marginTop: 8, letterSpacing: 3 }}>
              {away?.shortName ?? ""}
            </div>
          </div>
        </div>

        <Footer note={venue ? `${venue.name} · ${venue.city}` : "VM 2026"} />
      </div>
    ),
    { ...size, fonts },
  );
}
