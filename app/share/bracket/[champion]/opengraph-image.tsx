import { ImageResponse } from "next/og";
import { teamByShortName, teamName } from "@/lib/wc26-data";
import { OG, OG_SIZE, OG_BG, BrandMark, FlagBlock, Footer, loadFraunces } from "@/lib/og/shared";

export const runtime = "edge";
export const alt = "VM 2026 — min mester";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function BracketShareImage({
  params,
}: {
  params: { champion: string };
}) {
  const team = teamByShortName(params.champion.toUpperCase());
  const fonts = await loadFraunces();

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
        <BrandMark tagline="VM-treet" />

        {/* Champion */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: OG.amber,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Min spådde mester
          </div>

          <FlagBlock code={team?.flag} w={300} h={188} />

          <div style={{ fontSize: 100, fontWeight: 700, lineHeight: 1, fontFamily: "Fraunces", letterSpacing: -1 }}>
            {team ? teamName(team) : "Ukjent"}
          </div>

          {team && (
            <div
              style={{
                padding: "10px 22px",
                background: "rgba(230,57,70,0.12)",
                border: "1px solid rgba(230,57,70,0.32)",
                fontSize: 19,
                color: OG.cream,
                fontWeight: 600,
                letterSpacing: 1,
                display: "flex",
              }}
            >
              Gruppe {team.group} · FIFA #{team.fifaRank ?? "—"}
            </div>
          )}
        </div>

        <Footer note="Bygg ditt eget VM-tre" url="vm2026.chatgenius.pro/bracket" />
      </div>
    ),
    { ...size, fonts },
  );
}
