import { ImageResponse } from "next/og";
import { teamByShortName } from "@/lib/wc26-data";

export const runtime = "edge";
export const alt = "WC26 bracket prediction";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FLAG_GRADIENTS: Record<string, [string, string]> = {
  no: ["#ef2b2d", "#002868"],
  es: ["#aa151b", "#f1bf00"],
  fr: ["#0055a4", "#ef4135"],
  br: ["#009c3b", "#ffdf00"],
  de: ["#dd0000", "#ffce00"],
  ar: ["#74acdf", "#74acdf"],
  pt: ["#006600", "#ff0000"],
  "gb-eng": ["#ffffff", "#ce1126"],
  nl: ["#ae1c28", "#21468b"],
  hr: ["#ff0000", "#171796"],
  mx: ["#006847", "#ce1126"],
  us: ["#b22234", "#3c3b6e"],
  jp: ["#ffffff", "#bc002d"],
};

export default async function BracketShareImage({
  params,
}: {
  params: { champion: string };
}) {
  const team = teamByShortName(params.champion.toUpperCase());
  const grad = team ? FLAG_GRADIENTS[team.flag] ?? ["#374151", "#1f2937"] : ["#374151", "#1f2937"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b1530 0%, #0f1a3a 100%)",
          color: "#e2f4ff",
          padding: 64,
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        {/* Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg,#ff5cc8 0%,#7c5cff 50%,#22d3ee 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b1530",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            26
          </div>
          <span style={{ color: "#cbd5e1", fontWeight: 600, fontSize: 22, letterSpacing: 3 }}>
            WC26 BRACKET · CHATGENIUS
          </span>
        </div>

        {/* Trophy + label */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 36, color: "#fbbf24", fontWeight: 800, letterSpacing: 4 }}>
            MY PREDICTED CHAMPION
          </div>

          {/* Flag */}
          <div
            style={{
              width: 280,
              height: 168,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
              boxShadow: "0 0 60px rgba(34,211,238,0.25)",
            }}
          />

          {/* Team name */}
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
            {team?.name ?? "Unknown"}
          </div>

          <div
            style={{
              padding: "10px 22px",
              background: "rgba(124, 92, 255, 0.15)",
              border: "1px solid rgba(124,92,255,0.4)",
              borderRadius: 999,
              fontSize: 20,
              color: "#cbd5e1",
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            {team ? `Group ${team.group} · FIFA #${team.fifaRank ?? "—"}` : ""}
          </div>
        </div>

        {/* Footer URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>Build your bracket too</span>
          <span style={{ color: "#7c5cff", fontWeight: 700 }}>vm2026.chatgenius.pro/bracket</span>
        </div>
      </div>
    ),
    size,
  );
}
