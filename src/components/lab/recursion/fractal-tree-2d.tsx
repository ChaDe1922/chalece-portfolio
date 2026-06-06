"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

/** Branch color: warm brown trunk (t=0) to fresh green tips (t=1). */
export function branchColor(t: number) {
  const h = 25 + t * 80;
  const s = 65 - t * 18;
  const l = 28 + t * 14;
  return `hsl(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%)`;
}

type Props = {
  depth: number;
  angle: number;
  ratio: number;
  lean: number;
  leaves: boolean;
  onCount: (n: number) => void;
};

/** The original 2D canvas fractal tree, drawn by recursion with a level-by-level
 *  grow. Used as the reduced-motion / no-WebGL fallback for the 3D tree. The
 *  canvas is device-pixel-ratio scaled and theme-aware. */
export function FractalTree2D({ depth, angle, ratio, lean, leaves, onCount }: Props) {
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const growRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rd = React.useRef(0); // currently rendered max depth

  const p = React.useRef({ angle, ratio, leaves, lean, depth, reduced, theme: resolvedTheme });
  p.current = { angle, ratio, leaves, lean, depth, reduced, theme: resolvedTheme };

  const drawAt = React.useCallback(
    (maxDepth: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { angle, ratio, leaves, lean } = p.current;

      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.getBoundingClientRect().width || 480;
      const cssH = Math.round(cssW * 0.72);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isLight = p.current.theme === "light";
      const bg = ctx.createLinearGradient(0, 0, 0, cssH);
      bg.addColorStop(0, isLight ? "#faf9f6" : "#0d1016");
      bg.addColorStop(1, isLight ? "#eee9f2" : "#161b22");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cssW, cssH);

      const angleRad = (angle * Math.PI) / 180;
      const leanRad = (lean * Math.PI) / 180;
      const r = ratio / 100;
      const startX = cssW / 2;
      const startY = cssH - 10;
      const trunkLength = cssH * 0.24;
      let branches = 0;

      const drawBranch = (x: number, y: number, a: number, length: number, d: number) => {
        if (d > maxDepth || length < 1.5) return;
        branches++;
        const endX = x + Math.sin(a) * length;
        const endY = y - Math.cos(a) * length;
        const t = maxDepth > 0 ? d / maxDepth : 0;
        const lineWidth = Math.max(0.8, (maxDepth - d + 1) * (3 / (maxDepth + 1)) * 1.5);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = branchColor(t);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
        if (leaves && d === maxDepth && maxDepth > 0) {
          const leafR = Math.max(1.5, lineWidth * 1.8);
          ctx.beginPath();
          ctx.arc(endX, endY, leafR, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${(95 + Math.random() * 25).toFixed(0)},65%,45%,0.85)`;
          ctx.fill();
        }
        drawBranch(endX, endY, a - angleRad, length * r, d + 1);
        drawBranch(endX, endY, a + angleRad, length * r, d + 1);
      };

      drawBranch(startX, startY, leanRad, trunkLength, 0);
      onCount(branches);
    },
    [onCount],
  );

  const schedule = React.useCallback(
    (maxDepth: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        drawAt(maxDepth);
      });
    },
    [drawAt],
  );

  const grow = React.useCallback(
    (target: number) => {
      if (growRef.current) clearInterval(growRef.current);
      if (p.current.reduced) {
        rd.current = target;
        schedule(target);
        return;
      }
      let cur = 0;
      rd.current = 0;
      schedule(0);
      growRef.current = setInterval(() => {
        cur += 1;
        rd.current = cur;
        schedule(cur);
        if (cur >= target && growRef.current) {
          clearInterval(growRef.current);
          growRef.current = null;
        }
      }, 110);
    },
    [schedule],
  );

  // Grow from scratch whenever depth changes (mount, preset, surprise, slider).
  React.useEffect(() => {
    grow(depth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depth]);

  // Live edits to the other params, theme, and resize repaint at current depth.
  React.useEffect(() => {
    schedule(rd.current);
  }, [angle, ratio, lean, leaves, resolvedTheme, schedule]);

  React.useEffect(() => {
    const ro = new ResizeObserver(() => schedule(rd.current));
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (growRef.current) clearInterval(growRef.current);
    };
  }, [schedule]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`A fractal tree at depth ${depth}, drawn by a recursive function.`}
      className="block w-full rounded-xl border border-border shadow-sm"
    />
  );
}
