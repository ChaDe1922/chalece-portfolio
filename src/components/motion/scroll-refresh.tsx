"use client";

import * as React from "react";
import { ScrollTrigger } from "@/components/motion/gsap";

/**
 * Recomputes every ScrollTrigger's start/end after the layout settles: fonts
 * loading, the hero PIN adding its spacer, and the dynamically-imported hero
 * canvas all shift positions after the triggers are first created. Without this,
 * scroll-triggered reveals below the pin can compute stale positions, never
 * fire, and leave their content (the card grids) stuck hidden.
 */
export function ScrollRefresh() {
  React.useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    const t = window.setTimeout(refresh, 450);
    window.addEventListener("load", refresh);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, []);
  return null;
}
