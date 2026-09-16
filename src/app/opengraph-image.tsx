import { ImageResponse } from "next/og";
import { PRODUCT } from "@/config/product";

export const alt = "FIRST $500 — Stop planning. Start selling.";
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
          background: "#fafaf8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#111111",
            }}
          >
            FIRST
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#16a34a",
              lineHeight: 1,
            }}
          >
            $500
          </span>
        </div>

        <p
          style={{
            marginTop: 40,
            fontSize: 36,
            fontWeight: 600,
            color: "#111111",
            maxWidth: 800,
            lineHeight: 1.3,
          }}
        >
          Build your local service business in 7 days
        </p>

        <p
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "#666666",
            fontStyle: "italic",
          }}
        >
          &ldquo;{PRODUCT.tagline}&rdquo;
        </p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              background: "#16a34a",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {PRODUCT.displayPrice} · 7-Day Challenge
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
