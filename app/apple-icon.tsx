import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0d0d0d",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#22c55e",
            fontSize: 78,
            fontWeight: 900,
            fontFamily: "monospace, sans-serif",
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          &gt;_
        </span>
      </div>
    ),
    { ...size }
  );
}
