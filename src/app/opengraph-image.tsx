import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#F5F2EB",
        color: "#282923",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 24, letterSpacing: 5 }}>
        MK ASSOCIATES · MUMBAI
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 96,
          fontFamily: "serif",
          maxWidth: 900,
          lineHeight: 1,
        }}
      >
        A home should feel like yours.
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#8e4b38" }}>
        INTERIOR ARCHITECTURE · MAHINDRA & KUNAL
      </div>
    </div>,
    size,
  );
}
