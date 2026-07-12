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
 * Mounts the living world canvas behind the content and drives the approach: a
 * pin-less ScrollTrigger over the run into the flagship work scrubs
 * worldProgress, and the world camera flies forward through the wave terrain.
 * The always-rendering canvas is mounted only when the work run is near (and the
 * tab is visible), so it does not burn the GPU at the top of the page.
 * Reduced-motion / no-WebGL render nothing. Decorative: aria-hidden.
 */
export function WorldLayer() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport(); // null until probed
  const [store] = React.useState(() => makeWorldStore());
  const [active, setActive] = React.useState(false);
  const [tier] = React.useState<{ quality: "high" | "low" }>(() => {
    if (typeof window === "undefined") return { quality: "high" };
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    return { quality: wide && fine ? "high" : "low" };
  });

  const use3D = webgl === true && !reduced;

  // Mount the always-rendering canvas only when the work run is near + visible.
  React.useEffect(() => {
    if (!use3D) return;
    const el = document.querySelector("#selected-systems");
    if (!el) return;
    let inView = false;
    const sync = () =>
      setActive(inView && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { rootMargin: "1400px 0px 1400px 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [use3D]);

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
          },
        });
      });
    },
    { dependencies: [use3D, store] },
  );

  if (!use3D || !active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <WorldCanvas store={store} quality={tier.quality} />
    </div>
  );
}
