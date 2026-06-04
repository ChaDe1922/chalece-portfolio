"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

/**
 * Loads only the ~4.6kb `domAnimation` feature set (we use the `m` component,
 * never the full `motion` import) and makes every Motion animation respect the
 * user's OS reduced-motion setting via reducedMotion="user".
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
