"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

/**
 * The thin accent line at the top of the metric strip that "ignites" (scales in
 * from the centre) as the hero signal field compresses into it, seeding the
 * "signal continues between sections" continuity. Decorative; under
 * reduced-motion it simply renders as a static line.
 */
export function MetricDivider() {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el, {
          scaleX: 0,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px w-full origin-center bg-[linear-gradient(90deg,transparent,var(--v2-iris)_35%,var(--v2-cyan)_65%,transparent)]"
    />
  );
}
