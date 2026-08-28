import { ImageResponse } from "next/og";

export const alt = "Say It — Send a Dedication";
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
          justifyContent: "center",
          padding: 80,
          background: "#0B0B12",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: 420,
            background: "#FF3B81",
            opacity: 0.22,
            filter: "blur(40px)",
            right: 80,
            top: 40,
          }}
        />
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#FF3B81" }}>SAY IT</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16, lineHeight: 1.05 }}>
          Say It. We&apos;ll Read It Live.
        </div>
        <div style={{ fontSize: 28, color: "#A1A1AA", marginTop: 24 }}>
          Heartfelt dedications every Saturday on TikTok.
        </div>
      </div>
    ),
    size
  );
}
