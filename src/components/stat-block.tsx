"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import type { Stat } from "@/data/stats";

const format = (n: number) => n.toLocaleString("en-US");

/**
 * One proof stat. The final value is rendered in the initial HTML (accessible
 * source of truth, works with JS disabled). When motion is allowed and the
 * block scrolls into view, it counts up once via requestAnimationFrame.
 */
export function StatBlock({ stat }: { stat: Stat }) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLParagraphElement>(null);
  const suffix = stat.suffix ?? "";

  const finalText =
    stat.value === null ? (stat.display ?? "") : `${format(stat.value)}${suffix}`;
  const [text, setText] = React.useState(finalText);

  React.useEffect(() => {
    const target = stat.value;
    if (target === null || reduced) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    let started = false;
    setText(`0${suffix}`);

    const run = () => {
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setText(`${format(Math.round(eased * target))}${suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stat.value, suffix, reduced]);

  return (
    <div>
      <p
        ref={ref}
        className="font-heading text-4xl font-bold tabular-nums sm:text-5xl"
      >
        {text}
      </p>
      <p className="mt-2 text-sm leading-snug text-muted-foreground">
        {stat.label}
      </p>
    </div>
  );
}
