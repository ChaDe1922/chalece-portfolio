"use client";

import * as React from "react";
import { m, useReducedMotion } from "motion/react";

/** A small, themed, looping animation per lesson, shown on the carousel's active
 *  card. Decorative (aria-hidden); the title and description carry the meaning.
 *  Built with motion transform/opacity loops, so reduced motion freezes each to a
 *  clean static frame. Only the active card animates (`active` gates the loops). */

export type LessonId = "fourier" | "spectrum" | "audio-tools" | "sound" | "git" | "recursion" | "vibe" | "urgent";

const VW = 240;
const VH = 120;
const CY = VH / 2;

/** A periodic sine polyline, `width` wide with `periods` full cycles. */
function sinePath(width: number, periods: number, amp: number, cy = CY, samples = 160) {
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * width;
    const y = cy - Math.sin((i / samples) * periods * 2 * Math.PI) * amp;
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="h-40 w-full">
      {children}
    </svg>
  );
}

/** A seamlessly scrolling sine layer (two tiles wide, translated by one tile). */
function WaveLayer({ periods, amp, color, duration, on, cy = CY }: { periods: number; amp: number; color: string; duration: number; on: boolean; cy?: number }) {
  const d = sinePath(VW * 2, periods * 2, amp, cy);
  return (
    <m.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={on ? { x: [0, -VW] } : { x: 0 }}
      transition={on ? { duration, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      style={{ opacity: 0.85 }}
    />
  );
}

function FourierAnim({ on }: { on: boolean }) {
  return (
    <Svg>
      <WaveLayer periods={6} amp={26} color="var(--primary)" duration={6} on={on} />
      <WaveLayer periods={12} amp={13} color="var(--coral)" duration={3.6} on={on} />
    </Svg>
  );
}

function SoundAnim({ on }: { on: boolean }) {
  return (
    <Svg>
      <m.g
        animate={on ? { scaleY: [1, 0.62, 1] } : { scaleY: 1 }}
        transition={on ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        style={{ transformOrigin: "center" }}
      >
        <WaveLayer periods={4} amp={32} color="var(--primary)" duration={5} on={on} />
      </m.g>
    </Svg>
  );
}

function GitAnim({ on }: { on: boolean }) {
  const main = [40, 120, 200];
  const branchX = 200;
  const branchY = 42;
  const cy = 74;
  const node = (cx: number, cyy: number, color: string, i: number) => (
    <m.circle
      key={`${cx}-${cyy}`}
      cx={cx}
      cy={cyy}
      r={12}
      fill="var(--card)"
      stroke={color}
      strokeWidth={3}
      initial={{ scale: 0, opacity: 0 }}
      animate={on ? { scale: [0, 1, 1, 1, 0], opacity: [0, 1, 1, 1, 0] } : { scale: 1, opacity: 1 }}
      transition={on ? { duration: 3.2, times: [0, 0.18, 0.55, 0.85, 1], repeat: Infinity, delay: i * 0.35, ease: "easeOut" } : { duration: 0 }}
      style={{ transformOrigin: `${cx}px ${cyy}px` }}
    />
  );
  return (
    <Svg>
      <line x1={main[0]} y1={cy} x2={main[2]} y2={cy} stroke="var(--primary)" strokeWidth={2.5} opacity={0.4} />
      <line x1={main[1]} y1={cy} x2={branchX} y2={branchY} stroke="var(--coral)" strokeWidth={2.5} opacity={0.4} />
      {main.map((x, i) => node(x, cy, "var(--primary)", i))}
      {node(branchX, branchY, "var(--coral)", 3)}
    </Svg>
  );
}

function RecursionAnim({ on }: { on: boolean }) {
  const sizes = [96, 70, 46, 24];
  return (
    <Svg>
      <m.g
        animate={on ? { rotate: [0, 90] } : { rotate: 0 }}
        transition={on ? { duration: 16, repeat: Infinity, ease: "linear" } : { duration: 0 }}
        style={{ transformOrigin: `${VW / 2}px ${CY}px` }}
      >
        {sizes.map((s, i) => (
          <m.rect
            key={s}
            x={VW / 2 - s / 2}
            y={CY - s / 2}
            width={s}
            height={s}
            rx={6}
            fill="none"
            stroke={i === sizes.length - 1 ? "var(--coral)" : "var(--primary)"}
            strokeWidth={2.5}
            initial={{ opacity: 0.3 }}
            animate={on ? { opacity: [0.3, 0.95, 0.3] } : { opacity: 0.7 }}
            transition={on ? { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 } : { duration: 0 }}
          />
        ))}
      </m.g>
    </Svg>
  );
}

function VibeAnim({ on }: { on: boolean }) {
  const cols = [54, 102, 150, 198];
  const rows = [38, 62, 86];
  // a fixed "on" beat pattern per column (row indices that are lit)
  const pattern: Record<number, number[]> = { 0: [0, 2], 1: [1], 2: [0, 1], 3: [2] };
  return (
    <Svg>
      {/* playhead */}
      <m.rect
        x={0}
        y={24}
        width={36}
        height={76}
        rx={8}
        fill="var(--primary)"
        style={{ opacity: 0.14 }}
        animate={on ? { x: [36, 84, 132, 180, 36] } : { x: 36 }}
        transition={on ? { duration: 2.4, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      />
      {cols.map((cx, c) =>
        rows.map((cyy, r) => {
          const lit = pattern[c]?.includes(r);
          return (
            <m.circle
              key={`${c}-${r}`}
              cx={cx}
              cy={cyy}
              r={8}
              fill={lit ? "var(--primary)" : "var(--card)"}
              stroke="var(--primary)"
              strokeWidth={2}
              animate={on && lit ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={on && lit ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: c * 0.6 } : { duration: 0 }}
              style={{ transformOrigin: `${cx}px ${cyy}px`, opacity: lit ? 1 : 0.5 }}
            />
          );
        }),
      )}
    </Svg>
  );
}

function UrgentAnim({ on }: { on: boolean }) {
  const cx = VW / 2;
  const shield = `M ${cx} 26 L ${cx + 34} 40 L ${cx + 34} 66 Q ${cx + 34} 92 ${cx} 100 Q ${cx - 34} 92 ${cx - 34} 66 L ${cx - 34} 40 Z`;
  return (
    <Svg>
      {/* pulsing ring */}
      <m.circle
        cx={cx}
        cy={62}
        r={40}
        fill="none"
        stroke="var(--coral)"
        strokeWidth={2}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={on ? { scale: [0.8, 1.4], opacity: [0.5, 0] } : { scale: 1, opacity: 0.25 }}
        transition={on ? { duration: 2.2, repeat: Infinity, ease: "easeOut" } : { duration: 0 }}
        style={{ transformOrigin: `${cx}px 62px` }}
      />
      <m.g
        animate={on ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={on ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        style={{ transformOrigin: `${cx}px 62px` }}
      >
        <path d={shield} fill="var(--card)" stroke="var(--primary)" strokeWidth={3} strokeLinejoin="round" />
        <line x1={cx} y1={48} x2={cx} y2={68} stroke="var(--coral)" strokeWidth={4} strokeLinecap="round" />
        <circle cx={cx} cy={80} r={2.6} fill="var(--coral)" />
      </m.g>
    </Svg>
  );
}

export function LessonAnimation({ id, active }: { id: LessonId; active: boolean }) {
  const reduced = useReducedMotion();
  const on = active && !reduced;
  switch (id) {
    case "fourier":
    case "spectrum":
    case "audio-tools":
      return <FourierAnim on={on} />;
    case "sound":
      return <SoundAnim on={on} />;
    case "git":
      return <GitAnim on={on} />;
    case "recursion":
      return <RecursionAnim on={on} />;
    case "vibe":
      return <VibeAnim on={on} />;
    case "urgent":
      return <UrgentAnim on={on} />;
    default:
      return <Svg>{null}</Svg>;
  }
}
