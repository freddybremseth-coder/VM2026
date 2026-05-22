import { ImageResponse } from "next/og";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";

export const runtime = "edge";
export const alt = "WC26 — my tip";
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
  kr: ["#ffffff", "#0047a0"],
};

export default async function TipShareImage({
  params,
}: {
  params: { matchId: string; score: string };
}) {
  const fixture = fixtureById(Number(params.matchId));
  const home = fixture?.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture?.awayId ? teamById(fixture.awayId) : undefined;
  // Score path segment is `h-a` e.g. "2-1".
  const [hRaw, aRaw] = (params.score ?? "").split("-");
  const homeScore = Number.parseInt(hRaw ?? "", 10);
  const awayScore = Number.parseInt(aRaw ?? "", 10);

  const homeGrad = home
    ? FLAG_GRADIENTS[home.flag] ?? ["#374151", "#1f2937"]
    : ["#374151", "#1f2937"];
  const awayGrad = away
    ? FLAG_GRADIENTS[away.flag] ?? ["#374151", "#1f2937"]
    : ["#374151", "#1f2937"];

  const kickoffLabel = fixture
    ? new Date(fixture.kickoff).toLocaleString("en-GB", {
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
          background: "linear-gradient(135deg, #0b1530 0%, #0f1a3a 100%)",
          color: "#e2f4ff",
          padding: 56,
          fontFamily: "system-ui",
        }}
      >
        {/* Brand strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#94a3b8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg,#ff5cc8 0%,#7c5cff 50%,#22d3ee 100%)",
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
            <span
              style={{
                color: "#cbd5e1",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: 3,
              }}
            >
              MY WC26 TIP
            </span>
          </div>
          <span style={{ fontSize: 18, color: "#a78bfa" }}>{kickoffLabel} CET</span>
        </div>

        {/* Main: team / score / team */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            marginTop: 30,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            <div
              style={{
                width: 130,
                height: 80,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${homeGrad[0]} 0%, ${homeGrad[1]} 100%)`,
                marginBottom: 20,
              }}
            />
            <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
              {home?.name ?? "TBD"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                color: "#22d3ee",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Number.isInteger(homeScore) ? homeScore : "?"}
            </div>
            <div style={{ fontSize: 80, color: "#475569", fontWeight: 300 }}>·</div>
            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                color: "#22d3ee",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Number.isInteger(awayScore) ? awayScore : "?"}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 130,
                height: 80,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${awayGrad[0]} 0%, ${awayGrad[1]} 100%)`,
                marginBottom: 20,
              }}
            />
            <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
              {away?.name ?? "TBD"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#64748b",
            marginTop: 30,
          }}
        >
          <span>3 pts exact · 1 pt outcome</span>
          <span style={{ color: "#7c5cff", fontWeight: 700 }}>
            vm2026.chatgenius.pro
          </span>
        </div>
      </div>
    ),
    size,
  );
}
