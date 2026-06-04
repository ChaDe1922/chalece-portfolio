"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline";
  external?: boolean;
  download?: boolean | string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Anchor styled as a prominent CTA with a subtle magnetic pull toward the
 * cursor. The effect is pointer-fine only and fully disabled under
 * prefers-reduced-motion. Keyboard, touch, and screen-reader users get a
 * normal, fully functional button; the motion is decorative only.
 */
export function MagneticButton({
  href,
  children,
  variant = "default",
  external = false,
  download,
  className,
  ...rest
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <m.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={reduced ? undefined : { x: springX, y: springY }}
      className={cn(
        buttonVariants({ variant }),
        "h-12 gap-2 rounded-xl px-6 text-base font-semibold [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      download={download}
      {...externalProps}
      {...rest}
    >
      {children}
    </m.a>
  );
}
