import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "linear-gradient(160deg, #87b7e8 0%, #ffd2a8 45%, #ff8f5c 100%)",
          color: "#2a1c14",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#d4521a", letterSpacing: 6 }}>
          {site.location.toUpperCase()}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {site.name}
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#5c4a40", maxWidth: 800 }}>
          {site.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
