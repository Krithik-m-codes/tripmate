import { ImageResponse } from "next/og";
import { OG_ALT } from "@/lib/site";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(16,185,129,0.22), transparent 42%), radial-gradient(circle at 8% 92%, rgba(16,185,129,0.12), transparent 38%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#10b981",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: "#050505",
            }}
          >
            T
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#f4f4f5" }}>
              TripMate
            </span>
            <span
              style={{
                fontSize: 16,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#34d399",
              }}
            >
              MCP-native trip planning
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 10,
            }}
          >
            {["MIT licensed", "Self-hostable", "5 tools"].map((badge) => (
              <span
                key={badge}
                style={{
                  border: "1px solid rgba(52,211,153,0.35)",
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontSize: 17,
                  color: "#a1a1aa",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 68,
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#fafafa",
              maxWidth: 940,
            }}
          >
            Open-source, MCP-native trip planning for your AI agent.
          </span>
          <span style={{ fontSize: 26, color: "#a1a1aa", maxWidth: 860 }}>
            Live geocoding, places, weather, and routing tools for Claude Desktop,
            Cursor, and Claude Code.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 22,
            fontSize: 20,
            color: "#71717a",
          }}
        >
          <span>tripmate.xride-labs.in</span>
          <span>github.com/Krithik-m-codes/tripmate</span>
        </div>
      </div>
    ),
    size
  );
}
