"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

type Direction = "up" | "down" | "left" | "right";

type DirectedRevealProps = React.ComponentProps<"div"> & {
  direction?: Direction;
  /** Stagger the direct children instead of moving the whole block. */
  stagger?: boolean;
  distance?: number;
  /** Deal the direct children into place: fanned rotation + staggered settle. */
  deal?: boolean;
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
  distance = 64,
  deal = false,
  ...props
}: DirectedRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        };
        if (deal) {
          // Cards fan + stagger into place, like being dealt.
          gsap.from(Array.from(el.children), {
            yPercent: 18,
            scale: 0.9,
            autoAlpha: 0,
            rotateZ: (i, _t, ts) => (i - (ts.length - 1) / 2) * 4,
            transformOrigin: "center bottom",
            duration: 1.0,
            ease: "back.out(1.3)",
            stagger: 0.14,
            scrollTrigger: trigger,
          });
          return;
        }
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          ...offset(direction, distance),
          autoAlpha: 0,
          duration: 1.3,
          ease: "power3.out",
          stagger: stagger ? 0.18 : 0,
          scrollTrigger: trigger,
        });
      });
    },
    { scope: ref, dependencies: [direction, stagger, distance, deal] },
  );

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
