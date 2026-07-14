import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated social preview image. Uses the system default font (no network
 *  font fetch) for a fast, reliable build. Flexbox-only per next/og. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "#f2f0ec",
          background:
            "radial-gradient(120% 120% at 0% 0%, #2a2350 0%, #17161d 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9b8cf0",
            fontWeight: 600,
          }}
        >
          {site.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 38,
              color: "#c9c6cf",
            }}
          >
            {site.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a7a4ae",
          }}
        >
          10 Coursera courses · 48,000+ learners · M.S. Georgia Tech
        </div>
      </div>
    ),
    { ...size }
  );
}
