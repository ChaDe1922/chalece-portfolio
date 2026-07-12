"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { StaticSignalField } from "@/components/signal/static-signal-field";
import { SignalLabels } from "@/components/signal/signal-labels";
import { useSignalCanvasGate } from "@/hooks/use-signal-canvas-gate";
import {
  makeSignalStore,
  readIntroSeen,
  markIntroSeen,
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

  // Pointer parallax writes straight to the plain store (no React render).
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
      store.pointerX = 0;
      store.pointerY = 0;
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mount, interactive, store]);

  // Scroll-driven merge: the five lanes zip into one path. On desktop the hero
  // PINS briefly so the merge plays as a controlled sequence, then releases; on
  // mobile it scrubs on scroll-away without a pin (pinning is jank-prone there);
  // reduced-motion creates nothing (store.scroll stays 0, canvas never mounts).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          ScrollTrigger.create({
            trigger: "#hero",
            start: "top top",
            end: "+=85%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              store.scroll = self.progress;
            },
          });
        },
      );
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          ScrollTrigger.create({
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              store.scroll = self.progress;
            },
          });
        },
      );
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
          ready ? "opacity-10" : "opacity-100",
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
            interactive={interactive}
            onReady={() => setReady(true)}
            onContextLost={() => {
              setFailed(true);
              setReady(false);
            }}
          />
        </div>
      ) : null}
      <SignalLabels />
    </div>
  );
}
