import { ImageResponse } from "next/og";

import { site } from "@/data/site";
import { CHANNELS, ORDER } from "@/data/mix";
import type { PillarId } from "@/data/pillars";

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#0f1115";
const FG = "#ecebe6";
const MUTED = "#9a9ca3";
const LINE = "#2a2d35";

// Eq bar heights, echoing the hero meter. Fixed so every build paints the same image.
const BARS = [0.45, 0.8, 0.6, 1, 0.7, 0.9, 0.5, 0.75, 0.55];

type Props = {
  /** Small mono line at the top. */
  eyebrow: string;
  /** The big line. */
  title: string;
  /** One line under the title. */
  subtitle: string;
  /** Lights one channel. Leave empty for the full mix. */
  solo?: PillarId;
};

/**
 * Night Session share card. System fonts only, so the build never fetches a
 * font over the network. Flexbox only, per next/og.
 */
export function nightCard({ eyebrow, title, subtitle, solo }: Props): ImageResponse {
  const lit = solo ? [solo] : ORDER;
  const accent = solo ? CHANNELS[solo].color : FG;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: BG,
          color: FG,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: accent }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", height: 56, gap: 8 }}>
            {BARS.map((h, i) => {
              const id = ORDER[i % ORDER.length];
              const on = lit.includes(id);
              return (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: Math.round(56 * h),
                    borderRadius: 3,
                    background: on ? CHANNELS[id].color : LINE,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: MUTED }}>{subtitle}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${LINE}`,
            paddingTop: 28,
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {ORDER.map((id) => (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, color: lit.includes(id) ? FG : MUTED }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: lit.includes(id) ? CHANNELS[id].color : LINE }} />
                {CHANNELS[id].short}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", color: MUTED }}>{site.name}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
