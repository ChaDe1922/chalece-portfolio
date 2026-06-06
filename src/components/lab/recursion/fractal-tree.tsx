"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/recursion/rich-text";

const data = recursionLab.slides.fractal;

/** Branch color: warm brown trunk (t=0) to fresh green tips (t=1). */
function branchColor(t: number) {
  const h = 25 + t * 80;
  const s = 65 - t * 18;
  const l = 28 + t * 14;
  return `hsl(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%)`;
}

const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));

/** Slide 5 payoff: a fractal tree drawn by recursion. Sliders + presets +
 *  Surprise me, with a gentle level-by-level grow animation. The canvas is
 *  device-pixel-ratio scaled; controls are keyboard accessible and marked
 *  data-no-swipe so dragging never navigates the deck. Reduced motion draws
 *  the final tree at once. */
export function FractalTree() {
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [depth, setDepth] = React.useState(5);
  const [angle, setAngle] = React.useState(30);
  const [ratio, setRatio] = React.useState(70);
  const [lean, setLean] = React.useState(0);
  const [leaves, setLeaves] = React.useState(true);
  const [count, setCount] = React.useState(0);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const growRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rd = React.useRef(0); // currently rendered max depth

  // Mirror live params into refs so the animation loop never reads stale state.
  const p = React.useRef({ angle, ratio, leaves, lean, depth, reduced, theme: resolvedTheme });
  p.current = { angle, ratio, leaves, lean, depth, reduced, theme: resolvedTheme };

  const drawAt = React.useCallback((maxDepth: number) => {
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
    setCount(branches);
  }, []);

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

  // Grow level by level from 0 to target (instant under reduced motion).
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

  // Initial grow on mount, and redraw at the current depth on resize.
  React.useEffect(() => {
    grow(p.current.depth);
    const ro = new ResizeObserver(() => schedule(rd.current));
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (growRef.current) clearInterval(growRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Repaint when the theme flips so the background follows light/dark.
  React.useEffect(() => {
    schedule(rd.current);
  }, [resolvedTheme, schedule]);

  // Slider edits redraw instantly at the new settings (responsive, no grow).
  function setDepthNow(v: number) {
    setDepth(v);
    rd.current = v;
    p.current.depth = v;
    schedule(v);
  }
  function setAngleNow(v: number) {
    setAngle(v);
    p.current.angle = v;
    schedule(rd.current);
  }
  function setRatioNow(v: number) {
    setRatio(v);
    p.current.ratio = v;
    schedule(rd.current);
  }
  function setLeavesNow(v: boolean) {
    setLeaves(v);
    p.current.leaves = v;
    schedule(rd.current);
  }

  function applyPreset(preset: (typeof data.presets)[number]) {
    setDepth(preset.depth);
    setAngle(preset.angle);
    setRatio(preset.ratio);
    setLean(preset.lean);
    setLeaves(preset.leaves);
    p.current = { ...p.current, depth: preset.depth, angle: preset.angle, ratio: preset.ratio, lean: preset.lean, leaves: preset.leaves };
    grow(preset.depth);
  }

  function surprise() {
    const d = rand(5, 9);
    const a = rand(15, 55);
    const ra = rand(60, 85);
    setDepth(d);
    setAngle(a);
    setRatio(ra);
    setLean(0);
    setLeaves(true);
    p.current = { ...p.current, depth: d, angle: a, ratio: ra, lean: 0, leaves: true };
    grow(d);
  }

  const slider = (
    id: string,
    label: string,
    value: number,
    min: number,
    max: number,
    set: (n: number) => void,
    suffix = "",
  ) => {
    const pct = ((value - min) / (max - min)) * 100;
    return (
      <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 font-mono text-xs font-semibold text-primary-foreground"
            style={{ left: `${pct}%` }}
          >
            {value}
            {suffix}
          </span>
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={(e) => set(parseInt(e.target.value, 10))}
            className="lab-slider w-full"
            aria-valuetext={`${value}${suffix}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="lesson-stagger space-y-4">
      {/* Teaching first: what a fractal is, and the rule in code. */}
      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.teach} />
      </p>
      <div className="rounded-xl border border-border bg-card p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
        <pre className="whitespace-pre-wrap text-foreground">{data.codeBase}</pre>
        <pre className="mt-1 whitespace-pre-wrap text-foreground">{data.codeRec}</pre>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <RichText text={data.codeNote} />
      </p>

      {/* Then the interaction: grow your own. */}
      <p className="pt-1 text-base leading-relaxed text-foreground">
        <RichText text={data.intro} />
      </p>

      <div data-no-swipe>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`A fractal tree at depth ${depth}, drawn with ${count} branches by a recursive function.`}
          className="block w-full rounded-xl border border-border shadow-sm"
        />
      </div>

      <p aria-live="polite" className="text-center text-sm italic text-muted-foreground">
        Depth <strong className="not-italic text-link">{depth}</strong>:{" "}
        <strong className="not-italic text-link">{count.toLocaleString()}</strong> branch
        {count === 1 ? "" : "es"} drawn by recursion
      </p>

      {/* Presets + surprise */}
      <div className="flex flex-wrap gap-2" data-no-swipe>
        {data.presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={surprise}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Shuffle aria-hidden="true" className="size-4" /> {data.randomize}
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-4 pt-7" data-no-swipe>
        {slider("depth-slider", "Depth", depth, 1, 9, setDepthNow)}
        {slider("angle-slider", "Angle", angle, 10, 60, setAngleNow, "°")}
        {slider("ratio-slider", "Ratio", ratio, 50, 90, setRatioNow, "%")}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="leaves-toggle"
            type="checkbox"
            checked={leaves}
            onChange={(e) => setLeavesNow(e.target.checked)}
            className="size-4 cursor-pointer [accent-color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label htmlFor="leaves-toggle" className="cursor-pointer text-sm text-foreground">
            Show leaves at the branch tips
          </label>
        </div>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground">
        <span className="font-medium text-link">{data.prompt}</span> <RichText text={data.nature} />
      </p>
    </div>
  );
}
