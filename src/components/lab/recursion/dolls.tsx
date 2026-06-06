"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { FolderInput, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";
import { Emphasize } from "@/components/lab/recursion/emphasize";
import { Dolls2DFallback } from "@/components/lab/recursion/dolls-2d-fallback";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";

const data = recursionLab.slides.dolls;
const TOTAL = 5;
type Highlight = "base" | "recursive" | null;

const DollsScene = dynamic(
  () => import("@/components/lab/recursion/dolls-3d/dolls-scene").then((m) => m.DollsScene),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="mx-auto aspect-[21/9] w-full max-w-xl rounded-xl border border-border bg-[#1a1310]"
      />
    ),
  },
);

/** Slide 2: name the two parts, then open the 3D nesting dolls to the base
 *  case. The teaching comes first; the rule terms are clickable and drive the
 *  scene. 3D when WebGL is available and motion is allowed, else the 2D SVG. */
export function Dolls() {
  const deck = useDeck();
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const [revealed, setRevealed] = React.useState(1);
  const [highlight, setHighlight] = React.useState<Highlight>(null);
  const [demoTrigger, setDemoTrigger] = React.useState(0);
  const atBase = revealed >= TOTAL;

  React.useEffect(() => {
    if (atBase) deck.markComplete(data.id);
  }, [atBase, deck]);

  // Clickable terms: highlight the matching dolls and play a short demo.
  const clearTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  function showCase(which: "base" | "recursive") {
    if (which === "base") setRevealed(TOTAL); // open to the base so it can glow
    setHighlight(which);
    setDemoTrigger((d) => d + 1);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setHighlight(null), 3000);
  }
  React.useEffect(() => () => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
  }, []);

  // Pause/unmount the canvas when the stage is hidden or offscreen.
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
  const narration = atBase
    ? data.narrate.base
    : revealed > 1
      ? data.narrate.open(revealed, TOTAL)
      : data.openInstr;

  return (
    <div className="lesson-stagger space-y-5">
      {/* Teaching first: the two rules and the definition. */}
      <p className="text-lg leading-relaxed text-foreground">
        <Emphasize text={data.teachLead} terms={["recursion", "two parts"]} />
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.rules.map((rule) => {
          const on = highlight === rule.id;
          return (
            <button
              key={rule.id}
              type="button"
              onClick={() => showCase(rule.id as "base" | "recursive")}
              aria-pressed={on}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on
                  ? "border-primary bg-primary/10 ring-2 ring-primary"
                  : "border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] hover:border-primary/50",
              )}
            >
              <span className="font-heading text-base font-semibold text-link">{rule.term}</span>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{rule.text}</p>
              <span className="mt-2 inline-block text-xs font-medium text-link">
                {on ? "Showing this in the dolls" : "Click to see it in the dolls"}
              </span>
            </button>
          );
        })}
      </div>
      <p className="rounded-xl border border-border bg-card p-4 text-base leading-relaxed text-foreground">
        <Emphasize
          text={data.definition}
          terms={["Recursion", "recursion", "base case", "recursive case"]}
        />
      </p>

      {/* Then the interaction reinforces both parts. */}
      <p className="pt-1 text-base leading-relaxed text-muted-foreground">
        <Emphasize text={data.interactLead} terms={["recursive case", "base case"]} />
      </p>

      <div ref={stageRef}>
        {use3D && active ? (
          <DollsScene revealed={revealed} highlight={highlight} demoTrigger={demoTrigger} />
        ) : use3D ? (
          <div
            aria-hidden="true"
            className="mx-auto aspect-[21/9] w-full max-w-xl rounded-xl border border-border bg-[#1a1310]"
          />
        ) : (
          <Dolls2DFallback revealed={revealed} highlight={highlight} />
        )}
      </div>

      <p aria-live="polite" className="min-h-6 text-center text-sm text-foreground">
        {narration}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(TOTAL, r + 1))}
          disabled={atBase}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <FolderInput aria-hidden="true" className="size-4" /> {data.open}
        </button>
        {revealed > 1 ? (
          <button
            type="button"
            onClick={() => {
              setRevealed(1);
              setHighlight(null);
            }}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> {data.reset}
          </button>
        ) : null}
      </div>
    </div>
  );
}
