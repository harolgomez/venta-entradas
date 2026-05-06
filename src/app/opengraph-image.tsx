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
        {/* Logo - ticket shape matching the site logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M4 8C4 5.79 5.79 4 8 4H32C34.21 4 36 5.79 36 8V15.17C34.84 15.58 34 16.69 34 18C34 19.31 34.84 20.42 36 20.83V28C36 30.21 34.21 32 32 32H28L26 36H14L12 32H8C5.79 32 4 30.21 4 28V20.83C5.16 20.42 6 19.31 6 18C6 16.69 5.16 15.58 4 15.17V8Z"
              fill="#06b6d4"
            />
            <path
              d="M16 11H21.5C23 11 24.2 11.4 25.1 12.2C25.9 12.9 26.3 13.9 26.3 15C26.3 16.1 25.8 17 24.8 17.7V17.8C26.1 18.4 26.8 19.5 26.8 21C26.8 22.2 26.3 23.2 25.4 24C24.5 24.7 23.2 25.1 21.7 25.1H16V11ZM19.2 16.5H21C21.6 16.5 22 16.3 22.3 16.1C22.6 15.8 22.7 15.4 22.7 15C22.7 14.5 22.6 14.2 22.3 13.9C22 13.7 21.6 13.5 21 13.5H19.2V16.5ZM19.2 22.5H21.2C21.9 22.5 22.4 22.3 22.7 22C23.1 21.7 23.2 21.3 23.2 20.8C23.2 20.3 23 19.9 22.7 19.6C22.3 19.3 21.8 19.2 21.2 19.2H19.2V22.5Z"
              fill="#0a0a0f"
            />
          </svg>
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
