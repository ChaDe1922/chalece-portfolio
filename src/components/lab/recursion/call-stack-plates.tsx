"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";

// Code-split: three / R3F load only when these plates mount (lab route only).
const PlatesScene = dynamic(
  () => import("@/components/lab/recursion/call-stack-plates/plates-scene").then((m) => m.PlatesScene),
  { ssr: false, loading: () => <div className="h-full min-h-[230px]" aria-hidden="true" /> },
);

/** Static plate stack used for reduced-motion / no-WebGL: rounded bars, one per
 *  active frame, bottom of the stack at the bottom. The base frame is green. */
function PlatesCssFallback({ stack }: { stack: number[] }) {
  return (
    <div aria-hidden="true" className="flex h-full min-h-[230px] flex-col-reverse items-center justify-start gap-1.5 py-2">
      {stack.map((k, i) => (
        <div
          key={`${k}-${i}`}
          className={cn(
            "h-5 w-12 rounded-md border shadow-sm",
            k === 0
              ? "border-emerald-400 bg-emerald-500/80 dark:border-emerald-700"
              : "border-primary/50 bg-primary/70",
          )}
        />
      ))}
    </div>
  );
}

/** Plates beside the call stack: a 3D stack that drops a plate in on each call
 *  and lifts the top one off on each return. Decorative; the DOM frame list is
 *  the accessible source of truth. Falls back to a static CSS stack. */
export function CallStackPlates({ stack }: { stack: number[] }) {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();

  // Pause (unmount) the canvas when the stage is hidden or scrolled offscreen.
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const use3D = webgl === true && !reduced && active;

  return (
    <div ref={ref} className="h-full">
      {use3D ? <PlatesScene stack={stack} /> : <PlatesCssFallback stack={stack} />}
    </div>
  );
}
