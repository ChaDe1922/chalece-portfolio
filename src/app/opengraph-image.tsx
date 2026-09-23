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
          color: "#ece7dd",
          background: "#161511",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c9a55c",
            fontWeight: 500,
          }}
        >
          {site.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 38,
              color: "#aaa397",
            }}
          >
            {site.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#aaa397",
          }}
        >
          10 Coursera courses · 48,000+ learners · M.S. Georgia Tech
        </div>
      </div>
    ),
    { ...size }
  );
}
