import { ImageResponse } from "next/og";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById, venueById } from "@/lib/wc26-data";
import { buildPreview } from "@/lib/ai-preview";

export const runtime = "edge";
export const alt = "WC26 match preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Country gradient hex pairs for the OG image — flat hex codes since the
// ImageResponse CSS subset doesn't support arbitrary Tailwind classes. Keep
// in sync with the TeamFlag gradients used in-app.
const FLAG_GRADIENTS: Record<string, [string, string]> = {
  no: ["#ef2b2d", "#002868"],
  es: ["#aa151b", "#f1bf00"],
  fr: ["#0055a4", "#ef4135"],
  br: ["#009c3b", "#ffdf00"],
  de: ["#dd0000", "#ffce00"],
  it: ["#009246", "#ce2b37"],
  ar: ["#74acdf", "#74acdf"],
  pt: ["#006600", "#ff0000"],
  "gb-eng": ["#ffffff", "#ce1126"],
  nl: ["#ae1c28", "#21468b"],
  hr: ["#ff0000", "#171796"],
  mx: ["#006847", "#ce1126"],
  us: ["#b22234", "#3c3b6e"],
  ca: ["#ff0000", "#ffffff"],
  jp: ["#ffffff", "#bc002d"],
  kr: ["#ffffff", "#0047a0"],
};

export default async function MatchShareImage({
  params,
}: {
  params: { matchId: string };
}) {
  const fixture = fixtureById(Number(params.matchId));
  const home = fixture?.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture?.awayId ? teamById(fixture.awayId) : undefined;
  const venue = fixture ? venueById(fixture.venueId) : undefined;
  const preview = fixture ? buildPreview(fixture.id) : null;

  const homeGrad = home ? FLAG_GRADIENTS[home.flag] ?? ["#374151", "#1f2937"] : ["#374151", "#1f2937"];
  const awayGrad = away ? FLAG_GRADIENTS[away.flag] ?? ["#374151", "#1f2937"] : ["#374151", "#1f2937"];

  const kickoffLabel = fixture
    ? new Date(fixture.kickoff).toLocaleString("en-GB", {
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
          background: "linear-gradient(135deg, #0b1530 0%, #0f1a3a 100%)",
          color: "#e2f4ff",
          padding: 56,
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        {/* Branding strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#94a3b8",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <span style={{ color: "#cbd5e1", fontWeight: 600, fontSize: 20, letterSpacing: 3 }}>
              WC26 · CHATGENIUS
            </span>
          </div>
          <span style={{ fontSize: 18, color: "#7c5cff" }}>
            {fixture && fixture.stage.kind === "group"
              ? `GROUP ${fixture.stage.group} · MD${fixture.stage.matchday}`
              : "KNOCKOUT"}
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
            marginTop: 40,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
            <div
              style={{
                width: 140,
                height: 88,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${homeGrad[0]} 0%, ${homeGrad[1]} 100%)`,
                marginBottom: 24,
              }}
            />
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
              {home?.name ?? "TBD"}
            </div>
            <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 10, letterSpacing: 3 }}>
              {home?.shortName ?? ""}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 36, color: "#22d3ee", fontWeight: 800 }}>VS</div>
            <div
              style={{
                background: "rgba(124, 92, 255, 0.15)",
                border: "1px solid rgba(124,92,255,0.4)",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 18,
                color: "#cbd5e1",
                fontWeight: 600,
              }}
            >
              {kickoffLabel} CET
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div
              style={{
                width: 140,
                height: 88,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${awayGrad[0]} 0%, ${awayGrad[1]} 100%)`,
                marginBottom: 24,
              }}
            />
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
              {away?.name ?? "TBD"}
            </div>
            <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 10, letterSpacing: 3 }}>
              {away?.shortName ?? ""}
            </div>
          </div>
        </div>

        {/* AI recommendation footer */}
        {preview && (
          <div
            style={{
              marginTop: 32,
              padding: 20,
              borderRadius: 12,
              background: "rgba(34, 211, 238, 0.08)",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              fontSize: 22,
              color: "#cbd5e1",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontSize: 22, color: "#22d3ee", fontWeight: 700, letterSpacing: 2 }}>
              AI
            </div>
            <div>{preview.recommendation}</div>
          </div>
        )}

        {/* Venue + URL */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#64748b",
          }}
        >
          <span>{venue ? `${venue.name} · ${venue.city}` : ""}</span>
          <span style={{ color: "#7c5cff", fontWeight: 700 }}>vm2026.chatgenius.pro</span>
        </div>
      </div>
    ),
    size,
  );
}
