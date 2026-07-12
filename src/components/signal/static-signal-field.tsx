import { cn } from "@/lib/utils";
import { SIGNAL_CYAN, SIGNAL_IRIS } from "@/components/signal/hero-morph";

// Static wave-field still: the first-paint / LCP / no-WebGL / reduced-motion
// state, mirroring the animated hero wave field (same ribbon shapes, faint-to-
// bright cyan->iris). Decorative (aria-hidden): the H1 carries the meaning.
const RIBBONS = 6;
const SAMPLES = 90;

function ribbonPath(i: number): string {
  const base = 0.16 + i * 0.13; // normalized field-y (0 bottom .. 1 top)
  const pts: string[] = [];
  for (let s = 0; s <= SAMPLES; s++) {
    const x = s / SAMPLES;
    const wy =
      base +
      0.05 * Math.sin(x * 10 + i * 1.7) +
      0.022 * Math.sin(x * 21 + i * 0.9);
    pts.push(`${(x * 640).toFixed(1)} ${(480 * (1 - wy)).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
}

export function StaticSignalField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 480"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient
          id="wave-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="640"
          y2="0"
        >
          <stop offset="0" stopColor={SIGNAL_CYAN} stopOpacity="0.45" />
          <stop offset="1" stopColor={SIGNAL_IRIS} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {Array.from({ length: RIBBONS }, (_, i) => (
        <path
          key={i}
          d={ribbonPath(i)}
          fill="none"
          stroke="url(#wave-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.4 + i * 0.07}
        />
      ))}
    </svg>
  );
}
