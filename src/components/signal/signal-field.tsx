"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { StaticSignalField } from "@/components/signal/static-signal-field";
import { useSignalCanvasGate } from "@/hooks/use-signal-canvas-gate";
import {
  makeSignalStore,
  readIntroSeen,
  markIntroSeen,
  RIPPLE_MAX,
} from "@/lib/signal-store";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

// three / R3F stays out of the initial bundle: only loads once the gate passes.
const HeroSignalCanvas = dynamic(
  () =>
    import("@/components/signal/hero-signal-canvas").then(
      (m) => m.HeroSignalCanvas,
    ),
  { ssr: false, loading: () => null },
);

/**
 * Hero signal field. Always renders the static SVG (first paint, LCP, no-WebGL /
 * reduced-motion / context-loss fallback). When the gate passes it mounts the
 * one WebGL canvas over it and cross-fades. The DOM contract and the semantic
 * order around the hero H1 are unchanged (this whole subtree is decorative).
 */
export function SignalField({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [store] = React.useState(() => makeSignalStore(readIntroSeen()));
  const shouldMount = useSignalCanvasGate(containerRef);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // Quality/interaction tier: full on fine-pointer desktop, trimmed on coarse.
  // Computed once (lazy) rather than in an effect; the canvas is ssr:false, so
  // this only ever matters client-side (no hydration-visible difference).
  const [tier] = React.useState(() => {
    if (typeof window === "undefined") {
      return { quality: "high" as const, interactive: false };
    }
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    return {
      quality: (fine && wide ? "high" : "low") as "high" | "low",
      interactive: fine,
    };
  });
  const { quality, interactive } = tier;

  const mount = shouldMount && !failed;

  // Pointer position writes straight to the plain store (no React render). Drives
  // the hover reveal (a spotlight that uncovers the waves under the cursor).
  React.useEffect(() => {
    if (!mount || !interactive) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      store.pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
      store.pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      // Park the spotlight off-screen so the reveal fades out on leave.
      store.pointerX = -3;
      store.pointerY = -3;
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mount, interactive, store]);

  // A click sends a ripple through the wave field (works on touch too).
  React.useEffect(() => {
    if (!mount) return;
    const el = containerRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const h = store.rippleHead;
      store.ripples[h * 3] = (e.clientX - r.left) / r.width;
      store.ripples[h * 3 + 1] = 1 - (e.clientY - r.top) / r.height;
      store.ripples[h * 3 + 2] = store.time;
      store.rippleHead = (h + 1) % RIPPLE_MAX;
    };
    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, [mount, store]);

  // Scroll-driven morph: as the hero scrolls away, the one signal line morphs
  // waveform -> timeline -> pathway -> skill. NO PIN (a shape morph needs no held
  // viewport, and pinning was the source of the position-recalc bug that forced
  // the reveals below onto IntersectionObserver). Pure scrub, all breakpoints;
  // reduced-motion creates nothing (store.scroll stays 0, canvas never mounts).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            store.scroll = self.progress;
          },
        });
      });
    },
    { dependencies: [store] },
  );

  // Once the cinematic intro has run, mark it so in-session revisits settle fast.
  React.useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => markIntroSeen(), 4200);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <StaticSignalField
        className={cn(
          "transition-opacity duration-[1400ms]",
          // Fully fade the static still once the canvas owns the frame: the
          // WebGL scene renders the same form, so any lingering static layer
          // would just be a ghost behind the transparent canvas.
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      {mount ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-[1400ms]",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroSignalCanvas
            store={store}
            quality={quality}
            onReady={() => setReady(true)}
            onContextLost={() => {
              setFailed(true);
              setReady(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
