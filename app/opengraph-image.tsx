/** @format */

import { ImageResponse } from "next/og";

// Default share image (WhatsApp, LinkedIn, X, Facebook, Slack) for every page without its own.
export const alt = "SetupGram Infotech Solutions: AI chatbots, apps, CRM, advertising and consulting";
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
          padding: "80px",
          background: "linear-gradient(135deg, #050505 0%, #0b1a24 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: 6 }}>
          SETUP<span style={{ color: "#00f0ff" }}>GRAM</span>
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 40, maxWidth: 980 }}>
          AI-driven solutions to grow your business online
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#94a3b8", marginTop: 36 }}>
          AI chatbots · App development · CRM · Advertising · Consulting
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#00f0ff", marginTop: 48 }}>setupgram.com</div>
      </div>
    ),
    size,
  );
}
