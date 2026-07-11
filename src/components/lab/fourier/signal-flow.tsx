import * as React from "react";
import { Mic, Volume2, ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** A calm, static signal-flow diagram: sound (moving air) enters a microphone,
 *  becomes numbers (one value per moment), and a speaker turns the numbers back
 *  into moving air. Inline SVG + icons, theme-aware, no motion. The visible labels
 *  carry the meaning; the icons and the sampled-wave glyph are decorative. */

type Flow = {
  in: string;
  inSub: string;
  numbers: string;
  numbersSub: string;
  out: string;
  outSub: string;
};

/** Concentric arcs suggesting air being pushed/pulled. `dir` points the arcs left
 *  (into the mic) or right (out of the speaker). Decorative. */
function AirArcs({ dir }: { dir: "in" | "out" }) {
  const flip = dir === "in";
  return (
    <svg viewBox="0 0 20 24" aria-hidden="true" className={cn("h-6 w-5 text-link/60", flip && "-scale-x-100")}>
      {[4, 9, 14].map((r, i) => (
        <path key={r} d={`M 3 ${12 - r} A ${r} ${r} 0 0 1 3 ${12 + r}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={0.9 - i * 0.22} />
      ))}
    </svg>
  );
}

function Node({
  icon,
  label,
  sub,
  air,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  air?: "in" | "out";
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-background px-3 py-4 text-center">
      <span className="flex items-center gap-1">
        {air === "in" ? <AirArcs dir="in" /> : null}
        <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-link">{icon}</span>
        {air === "out" ? <AirArcs dir="out" /> : null}
      </span>
      <span className="font-heading text-sm font-semibold text-foreground">{label}</span>
      <span className="text-xs leading-snug text-muted-foreground">{sub}</span>
    </div>
  );
}

/** A tiny sampled waveform: a faint curve with dots marking one value per moment. */
function SampledGlyph() {
  const dots = [
    [6, 20],
    [15, 10],
    [24, 24],
    [33, 11],
    [42, 22],
  ];
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" className="size-6 text-link">
      <polyline
        points={dots.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="currentColor" />
      ))}
    </svg>
  );
}

function Connectors() {
  return (
    <>
      <ArrowRight aria-hidden="true" className="hidden size-5 shrink-0 self-center text-muted-foreground sm:block" />
      <ArrowDown aria-hidden="true" className="size-5 shrink-0 self-center text-muted-foreground sm:hidden" />
    </>
  );
}

export function SignalFlow({ flow }: { flow: Flow }) {
  return (
    <figure className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <Node icon={<Mic aria-hidden="true" className="size-5" />} label={flow.in} sub={flow.inSub} air="in" />
        <Connectors />
        <Node icon={<SampledGlyph />} label={flow.numbers} sub={flow.numbersSub} />
        <Connectors />
        <Node icon={<Volume2 aria-hidden="true" className="size-5" />} label={flow.out} sub={flow.outSub} air="out" />
      </div>
      <figcaption className="sr-only">
        {flow.in} becomes {flow.numbers}, then a speaker turns the numbers back into {flow.out}.
      </figcaption>
    </figure>
  );
}
