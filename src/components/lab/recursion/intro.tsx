"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.intro;
const RINGS = [56, 44, 32, 20, 9];
const FOLLOW_RADIUS = 170; // px from the rings' center where attraction starts
const MAX_SHIFT = 7; // svg units the inner ring drifts toward the pointer

/** Concentric rings: a thing inside a smaller version of itself. Decorative,
 *  but interactive: the inner rings drift toward a nearby pointer, and a click
 *  ripples a highlight color from the inner ring outward, then resets. Both are
 *  disabled under reduced motion. */
function NestedRings() {
  const reduced = useReducedMotion();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [rippleKey, setRippleKey] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    let last: { x: number; y: number } | null = null;
    const apply = () => {
      rafRef.current = null;
      const el = svgRef.current;
      if (!el || !last) return;
      const r = el.getBoundingClientRect();
      const dx = last.x - (r.left + r.width / 2);
      const dy = last.y - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist > FOLLOW_RADIUS) {
        setOffset((o) => (o.x === 0 && o.y === 0 ? o : { x: 0, y: 0 }));
        return;
      }
      const k = (1 - dist / FOLLOW_RADIUS) * MAX_SHIFT;
      setOffset({ x: (dx / dist || 0) * k, y: (dy / dist || 0) * k });
    };
    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <button
      type="button"
      onClick={() => !reduced && setRippleKey((k) => k + 1)}
      aria-label="Nested rings. Activate for a color ripple."
      className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <svg ref={svgRef} viewBox="0 0 120 120" className="size-28 lesson-stagger" aria-hidden="true">
        {RINGS.map((r, i) => {
          const isCenter = i === RINGS.length - 1;
          const base = isCenter ? "var(--coral)" : "var(--primary)";
          const flash = isCenter ? "var(--primary)" : "var(--coral)";
          const weight = (i + 1) / RINGS.length; // inner ring drifts most
          const order = RINGS.length - 1 - i; // ripple starts at the inner ring
          return (
            <circle
              key={`${rippleKey}-${i}`}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={base}
              strokeWidth={2}
              opacity={0.35 + i * 0.14}
              className={cn("nested-ring", rippleKey > 0 && !reduced && "nested-ring--rippling")}
              style={
                {
                  transform: `translate(${offset.x * weight}px, ${offset.y * weight}px)`,
                  "--rb": base,
                  "--rf": flash,
                  "--rd": `${order * 0.1}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>
    </button>
  );
}

/** Slide 0: the cover. What this is, what you will be able to do, and a Begin
 *  button that starts the lesson. */
export function Intro() {
  const deck = useDeck();

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.meta}</p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{data.promise}</p>
        <div className="shrink-0 self-center">
          <NestedRings />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-heading text-base font-semibold text-foreground">{data.objectivesLead}</p>
        <ul className="lesson-stagger mt-3 space-y-2.5">
          {data.objectives.map((o) => (
            <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => deck.next()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {data.begin}
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
        <span className="text-sm text-muted-foreground">{data.byline}</span>
      </div>
    </div>
  );
}
