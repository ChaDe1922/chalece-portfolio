"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

/** A small figure for "a vibration pushes and pulls the air around it": a source on
 *  the left emits concentric rings that travel outward. Solid rings are compressions
 *  (the air pushed together); faint rings between them are rarefactions (the air
 *  pulled apart). Canvas-2D, theme-aware, paused when off-screen or the tab is
 *  hidden. Reduced motion draws a single static frame. */
export function AirPressure({ caption }: { caption: string }) {
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const startRef = React.useRef(0);
  const visibleRef = React.useRef(true);

  const paint = React.useCallback((tSec: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, (typeof window !== "undefined" && window.devicePixelRatio) || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const styles = getComputedStyle(canvas);
    const primary = styles.getPropertyValue("--primary").trim() || "#6d5ae6";
    const muted = styles.getPropertyValue("--muted-foreground").trim() || "#7a756c";

    const sx = w * 0.16;
    const sy = h / 2;
    const maxR = Math.hypot(w - sx, sy) + 8;
    const L = 30; // wavelength in px (ring spacing)
    const cyclesPerSec = 0.85;
    const phase = (tSec * cyclesPerSec) % 1; // 0..1 outward drift

    const fade = (r: number) => {
      const inFade = Math.min(1, r / (L * 0.7)); // fade in from the source
      const outFade = Math.max(0, 1 - r / maxR); // fade out toward the edge
      return inFade * outFade;
    };

    const rings = Math.ceil(maxR / L) + 1;
    ctx.lineJoin = "round";

    // Rarefactions (the air pulled apart): faint rings offset by half a wavelength.
    ctx.strokeStyle = muted;
    for (let n = 0; n < rings; n++) {
      const r = (n + phase + 0.5) * L;
      if (r < 4 || r > maxR) continue;
      ctx.globalAlpha = fade(r) * 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Compressions (the air pushed together): solid rings.
    ctx.strokeStyle = primary;
    for (let n = 0; n < rings; n++) {
      const r = (n + phase) * L;
      if (r < 4 || r > maxR) continue;
      ctx.globalAlpha = fade(r);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // The vibrating source, pulsing in time with the rings it sends out.
    ctx.globalAlpha = 1;
    const pulse = 5 + 2 * Math.sin(2 * Math.PI * tSec * cyclesPerSec);
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(sx, sy, reduced ? 6 : pulse, 0, Math.PI * 2);
    ctx.fill();
  }, [reduced]);

  React.useEffect(() => {
    if (reduced) {
      paint(0);
      const onResize = () => paint(0);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      if (visibleRef.current) paint((ts - startRef.current) / 1000);
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);

    const canvas = canvasRef.current;
    const io = canvas
      ? new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), { threshold: 0.05 })
      : null;
    if (canvas && io) io.observe(canvas);
    const onVis = () => (visibleRef.current = !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      startRef.current = 0;
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, paint]);

  return (
    <figure className="rounded-2xl border border-border bg-card p-3">
      <canvas ref={canvasRef} aria-hidden="true" className="h-28 w-full rounded-lg bg-background" />
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
