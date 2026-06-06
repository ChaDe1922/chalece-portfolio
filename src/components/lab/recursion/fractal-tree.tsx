"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Shuffle } from "lucide-react";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/recursion/rich-text";
import { FractalTree2D } from "@/components/lab/recursion/fractal-tree-2d";
import { FractalTree3D } from "@/components/lab/recursion/fractal-tree-3d";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";

const data = recursionLab.slides.fractal;

const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));

/** Slide 5 payoff: a fractal tree drawn by recursion. A 3D tree you can orbit
 *  (with leafy, swaying foliage) when WebGL is available and motion is allowed,
 *  otherwise the 2D canvas fallback. Sliders, presets, and Surprise me drive
 *  whichever visual is shown. Controls are data-no-swipe so dragging never
 *  navigates the deck. */
export function FractalTree() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const [depth, setDepth] = React.useState(5);
  const [angle, setAngle] = React.useState(30);
  const [ratio, setRatio] = React.useState(70);
  const [lean, setLean] = React.useState(0);
  const [leaves, setLeaves] = React.useState(true);
  const [count, setCount] = React.useState(0);

  // Pause/unmount the 3D canvas when the stage is hidden or scrolled offscreen.
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(true);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const use3D = webgl === true && !reduced;

  function applyPreset(preset: (typeof data.presets)[number]) {
    setDepth(preset.depth);
    setAngle(preset.angle);
    setRatio(preset.ratio);
    setLean(preset.lean);
    setLeaves(preset.leaves);
  }
  function surprise() {
    setDepth(rand(5, 9));
    setAngle(rand(15, 55));
    setRatio(rand(60, 85));
    setLean(0);
    setLeaves(true);
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

  const treeProps = { depth, angle, ratio, lean, leaves, onCount: setCount };

  return (
    <div className="lesson-stagger space-y-4">
      {/* Teaching first: what a fractal is, the rule as steps, then in code. */}
      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.teachLead} />
      </p>
      <div className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-4">
        <p className="text-sm font-medium text-foreground">{data.stepsLead}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
          {data.steps.map((s) => (
            <li key={s}>
              <RichText text={s} />
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
        <pre className="whitespace-pre-wrap text-foreground">{data.codeBase}</pre>
        <pre className="mt-1 whitespace-pre-wrap text-foreground">{data.codeRec}</pre>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <RichText text={data.codeNote} />
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <RichText text={data.selfSimilar} />
      </p>

      {/* Then the interaction: grow your own. */}
      <p className="pt-1 text-base leading-relaxed text-foreground">
        <RichText text={data.intro} />
      </p>

      <div ref={stageRef} data-no-swipe>
        {use3D && active ? <FractalTree3D {...treeProps} /> : <FractalTree2D {...treeProps} />}
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
        <span className="font-medium text-link">{data.prompt}</span> <RichText text={data.nature} />
      </p>
    </div>
  );
}
