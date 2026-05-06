import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Boletta - Compra las entradas que no pudiste conseguir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "#06b6d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: 800,
              color: "#0a0a0f",
            }}
          >
            B
          </div>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#06b6d4",
            }}
          >
            Boletta
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "#8888a0",
            margin: 0,
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Compra las entradas que no pudiste conseguir.
        </p>
        <p
          style={{
            fontSize: "22px",
            color: "#06b6d4",
            margin: "12px 0 0",
          }}
        >
          Tu boleto seguro y garantizado
        </p>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
