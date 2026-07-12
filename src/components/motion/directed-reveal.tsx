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
 * Scroll-in reveal. The animation is GSAP, but the TRIGGER is an
 * IntersectionObserver, not ScrollTrigger: the hero pin shifts scroll positions
 * for everything below it, which made ScrollTrigger's scroll math miss the
 * lower sections and leave their cards stuck hidden. IO fires purely on real
 * viewport intersection, so it is immune to the pin.
 *
 * The hidden "from" state is applied only inside the no-preference matchMedia
 * branch, so SSR / no-JS / reduced-motion always render the content visible in
 * place (no CLS, no stuck-hidden content).
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
        const targets = deal || stagger ? Array.from(el.children) : [el];
        if (targets.length === 0) return;

        gsap.set(targets, { autoAlpha: 0 });

        let io: IntersectionObserver | null = null;
        let played = false;
        const play = () => {
          if (played) return;
          played = true;
          io?.disconnect();
          if (deal) {
            gsap.fromTo(
              targets,
              {
                yPercent: 18,
                scale: 0.9,
                autoAlpha: 0,
                rotateZ: (i, _t, ts) => (i - (ts.length - 1) / 2) * 4,
                transformOrigin: "center bottom",
              },
              {
                yPercent: 0,
                scale: 1,
                autoAlpha: 1,
                rotateZ: 0,
                duration: 1.0,
                ease: "back.out(1.3)",
                stagger: 0.14,
              },
            );
          } else {
            gsap.fromTo(
              targets,
              { ...offset(direction, distance), autoAlpha: 0 },
              {
                x: 0,
                y: 0,
                autoAlpha: 1,
                duration: 1.3,
                ease: "power3.out",
                stagger: stagger ? 0.18 : 0,
              },
            );
          }
        };

        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) play();
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        io.observe(el);
        return () => io?.disconnect();
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
