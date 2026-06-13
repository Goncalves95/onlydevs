import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OnlyDevs — Merch for devs who ship.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d0d0d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace, sans-serif",
          padding: "80px",
        }}
      >
        {/* Terminal prompt line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
          <span style={{ color: "#22c55e", fontSize: 22, letterSpacing: "0.05em" }}>
            $
          </span>
          <span style={{ color: "#52525b", fontSize: 20, letterSpacing: "0.05em" }}>
            npm install @onlydevs/swag
          </span>
        </div>

        {/* Logo text */}
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          OnlyDevs
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: "#71717a",
            fontFamily: "monospace, sans-serif",
            letterSpacing: "0.02em",
            marginBottom: 56,
          }}
        >
          Merch for devs who ship.
        </div>

        {/* Terminal cursor row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#111111",
            border: "1px solid #27272a",
            borderRadius: "8px",
          }}
        >
          <span style={{ color: "#22c55e", fontSize: 20, fontWeight: 700 }}>
            &gt;_
          </span>
          <span style={{ color: "#3f3f46", fontSize: 18 }}>
            onlydevs.shop
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
