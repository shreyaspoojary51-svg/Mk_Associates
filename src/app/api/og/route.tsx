import { ImageResponse } from "next/og";
export async function GET(request: Request) {
  const title = (
    new URL(request.url).searchParams.get("title") ||
    "A home should feel like yours."
  ).slice(0, 110);
  return new ImageResponse(
    <div
      style={{
        background: "#f5f2eb",
        color: "#282923",
        width: "100%",
        height: "100%",
        padding: "72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 23, letterSpacing: 5 }}>
        MK ASSOCIATES / MUMBAI
      </div>
      <div
        style={{
          display: "flex",
          fontSize: title.length > 70 ? 65 : 85,
          lineHeight: 1.08,
          fontFamily: "serif",
          maxWidth: 1040,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", fontSize: 21, color: "#98513e" }}>
        THOUGHTFUL SPACES · MAHINDRA & KUNAL
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
