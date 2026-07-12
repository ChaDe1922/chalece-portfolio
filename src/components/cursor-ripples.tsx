"use client";

import * as React from "react";

/**
 * Ripple-on-move cursor: faint signal rings emitted along the pointer path
 * (throttled by travel distance) so moving the cursor "sends signal" across the
 * site. Skips the hero, where the wave field itself ripples under the cursor.
 * Mouse / fine-pointer only; disabled under reduced-motion and in print; never
 * intercepts input.
 */
export function CursorRipples() {
  const layerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    let lastX = -999;
    let lastY = -999;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      if (t?.closest("#hero")) return; // the wave field owns the hero
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy < 46 * 46) return; // throttle by travel
      lastX = e.clientX;
      lastY = e.clientY;
      const ring = document.createElement("span");
      ring.className = "cursor-ripple";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      ring.addEventListener("animationend", () => ring.remove(), { once: true });
      layer.appendChild(ring);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={layerRef} aria-hidden="true" className="cursor-ripple-layer" />;
}
