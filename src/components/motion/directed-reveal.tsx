"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

type Direction = "up" | "down" | "left" | "right";

type DirectedRevealProps = React.ComponentProps<"div"> & {
  direction?: Direction;
  /** Stagger the direct children instead of moving the whole block. */
  stagger?: boolean;
  distance?: number;
};

function offset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
}

/**
 * GSAP scroll-triggered reveal: children enter from a direction on first scroll
 * into view (toggleActions play-once, so no scrub jank / no smooth-scroll
 * conflict). The hidden "from" state is applied ONLY inside the
 * no-preference matchMedia branch, in useGSAP's layout-effect phase, so SSR /
 * no-JS / reduced-motion always render the readable end state with no CLS and no
 * flash. Drop-in replacement for <Reveal> where directed pacing is wanted.
 */
export function DirectedReveal({
  children,
  className,
  direction = "up",
  stagger = false,
  distance = 40,
  ...props
}: DirectedRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          ...offset(direction, distance),
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: ref, dependencies: [direction, stagger, distance] },
  );

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
