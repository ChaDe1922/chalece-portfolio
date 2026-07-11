"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

/** Interactive cover mark for the Fourier intro: two sine waves that scroll, speed
 *  up as the cursor nears and slow as it leaves, and burst into spectrum bars (then
 *  reform) when activated. Canvas + rAF (the proximity pattern mirrors the recursion
 *  intro's NestedRings). Reduced motion shows a single static frame and the click is
 *  a no-op. The canvas is decorative; the button carries the accessible label. */

const BASE_SPEED = 1.5; // radians/sec at rest / far away
const MAX_SPEED = 7.5; // radians/sec when the cursor is right on it
const FOLLOW_RADIUS = 280; // px; nearer than this speeds the waves up
const BURST_MS = 750;
const BAR_HEIGHTS = [1, 0.5, 0.8, 0.38, 0.62, 0.28];

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [109, 90, 230];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `rgb(${Math.round(ar + (br - ar) * t)}, ${Math.round(ag + (bg - ag) * t)}, ${Math.round(ab + (bb - ab) * t)})`;
}

function drawSine(ctx: CanvasRenderingContext2D, w: number, cy: number, periods: number, amp: number, phase: number, color: string, width: number, alpha: number) {
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  const steps = Math.max(2, Math.ceil(w * 4));
  for (let k = 0; k <= steps; k++) {
    const px = (k / steps) * w;
    const t = (px / w) * periods * 2 * Math.PI + phase;
    const y = cy - Math.sin(t) * amp;
    if (k === 0) ctx.moveTo(px, y);
    else ctx.lineTo(px, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function WavesMark() {
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const phaseRef = React.useRef(0);
  const speedRef = React.useRef(BASE_SPEED);
  const targetSpeedRef = React.useRef(BASE_SPEED);
  const burstStartRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef(0);
  const lastPtrRef = React.useRef<{ x: number; y: number } | null>(null);

  const draw = React.useCallback((waveAlpha: number, barAlpha: number) => {
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

    const cs = getComputedStyle(canvas);
    const primary = cs.getPropertyValue("--primary").trim() || "#6d5ae6";
    const coral = cs.getPropertyValue("--coral").trim() || "#ff6b5e";
    const cy = h / 2;

    if (waveAlpha > 0.01) {
      drawSine(ctx, w, cy, 2.5, h * 0.3, phaseRef.current, primary, 3, 0.9 * waveAlpha);
      drawSine(ctx, w, cy, 5, h * 0.16, phaseRef.current * 1.7, coral, 2, 0.6 * waveAlpha);
    }
    if (barAlpha > 0.01) {
      const n = BAR_HEIGHTS.length;
      const gap = Math.max(3, w * 0.045);
      const bw = (w - gap * (n + 1)) / n;
      const baseY = h - 2;
      for (let i = 0; i < n; i++) {
        const x = gap + i * (bw + gap);
        const bh = BAR_HEIGHTS[i] * (h * 0.82) * barAlpha;
        ctx.globalAlpha = barAlpha;
        ctx.fillStyle = lerpColor(primary, coral, n > 1 ? i / (n - 1) : 0);
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x, baseY - bh, bw, bh, 2);
        else ctx.rect(x, baseY - bh, bw, bh);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }, []);

  // Animation loop (skipped under reduced motion, which draws one static frame).
  React.useEffect(() => {
    if (reduced) {
      draw(1, 0);
      return;
    }
    let running = true;
    const loop = (ts: number) => {
      if (!running) return;
      if (document.visibilityState === "visible") {
        const dt = lastTsRef.current ? Math.min(0.05, (ts - lastTsRef.current) / 1000) : 0;
        lastTsRef.current = ts;
        speedRef.current += (targetSpeedRef.current - speedRef.current) * Math.min(1, dt * 4);
        phaseRef.current += speedRef.current * dt;
        let waveAlpha = 1;
        let barAlpha = 0;
        if (burstStartRef.current != null) {
          const p = (ts - burstStartRef.current) / BURST_MS;
          if (p >= 1) burstStartRef.current = null;
          else {
            waveAlpha = Math.abs(Math.cos(p * Math.PI));
            barAlpha = Math.sin(p * Math.PI);
          }
        }
        draw(waveAlpha, barAlpha);
      } else {
        lastTsRef.current = 0;
      }
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      running = false;
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, draw]);

  // Pointer proximity -> target speed.
  React.useEffect(() => {
    if (reduced) return;
    let pending = false;
    const apply = () => {
      pending = false;
      const el = canvasRef.current;
      const ptr = lastPtrRef.current;
      if (!el || !ptr) return;
      const r = el.getBoundingClientRect();
      const dist = Math.hypot(ptr.x - (r.left + r.width / 2), ptr.y - (r.top + r.height / 2));
      const near = 1 - Math.min(1, dist / FOLLOW_RADIUS);
      targetSpeedRef.current = BASE_SPEED + near * (MAX_SPEED - BASE_SPEED);
    };
    const onMove = (e: PointerEvent) => {
      lastPtrRef.current = { x: e.clientX, y: e.clientY };
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(apply);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const onActivate = () => {
    if (reduced) return;
    burstStartRef.current = performance.now();
  };

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="Sound waves. They speed up as your cursor nears. Activate to split them into a spectrum."
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="h-24 w-32" />
    </button>
  );
}
