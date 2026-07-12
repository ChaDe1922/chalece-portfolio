"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { makeWorldStore } from "@/lib/world-store";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

const WorldCanvas = dynamic(
  () => import("./world-canvas").then((m) => m.WorldCanvas),
  { ssr: false, loading: () => null },
);

/**
 * Mounts the persistent world canvas behind the content and drives the approach:
 * a pin-less ScrollTrigger over the run into the flagship work scrubs
 * worldProgress, and the world camera dollies from far down the corridor into
 * the wave room. Reduced-motion / no-WebGL renders nothing (the cinematic
 * sections read as normal document). Decorative: aria-hidden + pointer-events-none.
 */
export function WorldLayer() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport(); // null until probed
  const [store] = React.useState(() => makeWorldStore());
  const invalidateRef = React.useRef<(() => void) | null>(null);
  const registerInvalidate = React.useCallback((fn: () => void) => {
    invalidateRef.current = fn;
  }, []);
  const [tier] = React.useState<{ quality: "high" | "low" }>(() => {
    if (typeof window === "undefined") return { quality: "high" };
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    return { quality: wide && fine ? "high" : "low" };
  });

  const use3D = webgl === true && !reduced;

  useGSAP(
    () => {
      if (!use3D) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: "#selected-systems",
          start: "top bottom",
          end: "+=160%",
          scrub: 1,
          onUpdate: (self) => {
            store.worldProgress = self.progress;
            invalidateRef.current?.();
          },
        });
      });
    },
    { dependencies: [use3D, store] },
  );

  if (!use3D) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <WorldCanvas
        store={store}
        registerInvalidate={registerInvalidate}
        quality={tier.quality}
      />
    </div>
  );
}
