"use client";

import * as React from "react";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.fractal;

/** Branch color: warm brown trunk (t=0) to fresh green tips (t=1). */
function branchColor(t: number) {
  const h = 25 + t * 80;
  const s = 65 - t * 18;
  const l = 28 + t * 14;
  return `hsl(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%)`;
}

/** Slide 5 payoff: a fractal tree drawn by a recursive function. Ported from
 *  the curriculum prototype to a device-pixel-ratio scaled React canvas with a
 *  premium dark stage. Controls are keyboard accessible; the tree redraws
 *  instantly (no stroke animation), so it is reduced-motion safe. */
export function FractalTree() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const [depth, setDepth] = React.useState(5);
  const [angle, setAngle] = React.useState(30);
  const [ratio, setRatio] = React.useState(70);
  const [leaves, setLeaves] = React.useState(true);
  const [count, setCount] = React.useState(0);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.getBoundingClientRect().width || 480;
    const cssH = Math.round(cssW * 0.72);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Premium dark stage so the tree pops in both site themes.
    const bg = ctx.createLinearGradient(0, 0, 0, cssH);
    bg.addColorStop(0, "#0d1016");
    bg.addColorStop(1, "#161b22");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cssW, cssH);

    const angleRad = (angle * Math.PI) / 180;
    const r = ratio / 100;
    const startX = cssW / 2;
    const startY = cssH - 10;
    const trunkLength = cssH * 0.24;
    let branches = 0;

    const drawBranch = (x: number, y: number, a: number, length: number, d: number) => {
      if (d > depth || length < 1.5) return;
      branches++;
      const endX = x + Math.sin(a) * length;
      const endY = y - Math.cos(a) * length;
      const t = depth > 0 ? d / depth : 0;
      const lineWidth = Math.max(0.8, (depth - d + 1) * (3 / (depth + 1)) * 1.5);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = branchColor(t);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
      if (leaves && d === depth) {
        const leafR = Math.max(1.5, lineWidth * 1.8);
        ctx.beginPath();
        ctx.arc(endX, endY, leafR, 0, Math.PI * 2);
        const leafHue = 95 + Math.random() * 25;
        ctx.fillStyle = `hsla(${leafHue.toFixed(0)},65%,45%,0.85)`;
        ctx.fill();
      }
      drawBranch(endX, endY, a - angleRad, length * r, d + 1);
      drawBranch(endX, endY, a + angleRad, length * r, d + 1);
    };

    drawBranch(startX, startY, 0, trunkLength, 0);
    setCount(branches);
  }, [depth, angle, ratio, leaves]);

  // Redraw on parameter change and on resize.
  React.useEffect(() => {
    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        draw();
      });
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  const slider = (
    id: string,
    label: string,
    value: number,
    min: number,
    max: number,
    set: (n: number) => void,
    suffix = "",
  ) => (
    <div className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border [accent-color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <span className="text-right font-mono text-sm font-bold text-link">
        {value}
        {suffix}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Teaching first: what a fractal is, and the rule in code. */}
      <p className="text-lg leading-relaxed text-foreground">{data.teach}</p>
      <div className="rounded-xl border border-border bg-card p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
        <pre className="whitespace-pre-wrap text-foreground">{data.codeBase}</pre>
        <pre className="mt-1 whitespace-pre-wrap text-foreground">{data.codeRec}</pre>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{data.codeNote}</p>

      {/* Then the interaction: grow your own. */}
      <p className="pt-1 text-base leading-relaxed text-foreground">{data.intro}</p>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`A fractal tree at depth ${depth}, drawn with ${count} branches by a recursive function.`}
        className="block w-full rounded-xl border border-border shadow-sm"
      />

      <p aria-live="polite" className="text-center text-sm italic text-muted-foreground">
        Depth <strong className="not-italic text-link">{depth}</strong>:{" "}
        <strong className="not-italic text-link">{count.toLocaleString()}</strong> branch
        {count === 1 ? "" : "es"} drawn by recursion
      </p>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        {slider("depth-slider", "Depth", depth, 1, 9, setDepth)}
        {slider("angle-slider", "Angle", angle, 10, 60, setAngle, "°")}
        {slider("ratio-slider", "Ratio", ratio, 50, 90, setRatio, "%")}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="leaves-toggle"
            type="checkbox"
            checked={leaves}
            onChange={(e) => setLeaves(e.target.checked)}
            className="size-4 cursor-pointer [accent-color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label htmlFor="leaves-toggle" className="cursor-pointer text-sm text-foreground">
            Show leaves at the branch tips
          </label>
        </div>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground">
        <span className="font-medium text-link">{data.prompt}</span> {data.nature}
      </p>
    </div>
  );
}
