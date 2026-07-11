"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Play, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.match;

const SOUND = data.soundSignal;
const N = data.n;
// Normalize raw product sums to the same 0..1 scale the challenge lanes use, so the
// demo total (about 1.00 for a match) and the challenge lane total agree.
const NORM = 2 / N;

/** A matching test wave equals the sound (every product is positive, totals add).
 *  A wrong test wave is the sound at a different frequency, so products fight and
 *  cancel. Both are derived from the sound so the lanes stay honest. */
const MATCH_TEST = SOUND.slice();
// Wrong test: a two-cycle cosine sampled at the same points, so it cancels.
const WRONG_TEST = Array.from({ length: N }, (_, n) => Number(Math.cos((2 * Math.PI * 2 * n) / N).toFixed(2)));

type LaneKey = "match" | "wrong";

/** One lane: product bars (signed) and the running-total line. Pure presentation
 *  driven by the products array; the meaning is also in the aria-live summary. */
function Lane({ label, products, accent }: { label: string; products: number[]; accent: "primary" | "muted" }) {
  const total = products.reduce((a, b) => a + b, 0);
  const max = Math.max(0.01, ...products.map((p) => Math.abs(p)));
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="font-mono text-xs text-link">total {(total * NORM).toFixed(2)}</span>
      </div>
      {/* Signed product bars around a center baseline. */}
      <div className="flex h-24 items-stretch gap-1 lg:h-28" aria-hidden="true">
        {products.map((p, i) => {
          const frac = Math.max(-1, Math.min(1, p / max));
          const up = frac >= 0;
          return (
            <div key={i} className="relative flex-1">
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              <div
                className={cn(
                  "absolute inset-x-0 rounded-sm transition-all duration-300",
                  up ? "bg-primary" : "bg-destructive",
                  accent === "muted" && "opacity-70",
                )}
                style={
                  up
                    ? { bottom: "50%", height: `${Math.abs(frac) * 50}%` }
                    : { top: "50%", height: `${Math.abs(frac) * 50}%` }
                }
              />
            </div>
          );
        })}
      </div>
      {/* Running total bar, full width, as a simple line readout. */}
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-300", total >= 0 ? "bg-primary" : "bg-destructive")}
          style={{ width: `${Math.min(100, Math.abs(total * NORM) * 100)}%` }}
        />
      </div>
    </div>
  );
}

/** Screen 17: a match adds up. Run the matching lane (products point the same way,
 *  the total grows) against the wrong lane (products fight and cancel). The
 *  micro-challenge asks which of three lanes hides the frequency, by clicking the
 *  one with the largest total. Bars are decorative; aria-live totals carry it. */
export function MatchLanes() {
  const [ran, setRan] = React.useState<Set<LaneKey>>(new Set());
  const [pick, setPick] = React.useState<string | null>(null);
  const [challengeMsg, setChallengeMsg] = React.useState("");

  const matchProducts = React.useMemo(() => SOUND.map((s, i) => Number((s * MATCH_TEST[i]).toFixed(3))), []);
  const wrongProducts = React.useMemo(() => SOUND.map((s, i) => Number((s * WRONG_TEST[i]).toFixed(3))), []);
  const matchTotal = matchProducts.reduce((a, b) => a + b, 0);
  const wrongTotal = wrongProducts.reduce((a, b) => a + b, 0);

  const run = (lane: LaneKey) => setRan((prev) => new Set(prev).add(lane));
  const compare = () => setRan(new Set<LaneKey>(["match", "wrong"]));

  const showMatch = ran.has("match");
  const showWrong = ran.has("wrong");
  const solvedChallenge = pick === data.laneAnswer;

  const pickLane = React.useCallback((id: string) => {
    setPick(id);
    if (id === data.laneAnswer) {
      const lane = data.lanes.find((l) => l.id === id);
      setChallengeMsg(`Correct. The ${lane?.label ?? "matching"} lane has the largest total, so that frequency is hiding in the sound.`);
    } else {
      setChallengeMsg("Not the largest total. The hidden frequency is the lane whose products add up the most.");
    }
  }, []);

  // Pointer drag of the "Present" badge; drop it on the lane under the pointer. The
  // lane buttons stay clickable and keyboard-operable as the accessible fallback.
  const [drag, setDrag] = React.useState<{ x: number; y: number; offX: number; offY: number; w: number } | null>(null);
  const [hoverLane, setHoverLane] = React.useState<string | null>(null);
  const laneRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  React.useEffect(() => {
    if (!drag) return;
    const laneAt = (x: number, y: number): string | null => {
      for (const [id, el] of laneRefs.current) {
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
      }
      return null;
    };
    const onMove = (e: PointerEvent) => {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      setHoverLane(laneAt(e.clientX, e.clientY));
    };
    const onUp = (e: PointerEvent) => {
      const id = laneAt(e.clientX, e.clientY);
      setDrag(null);
      setHoverLane(null);
      if (id) pickLane(id);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, pickLane]);

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => run("match")}
            aria-pressed={showMatch}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.testMatchLabel}
          </button>
          <button
            type="button"
            onClick={() => run("wrong")}
            aria-pressed={showWrong}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.testWrongLabel}
          </button>
          <button
            type="button"
            onClick={compare}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {data.compareLabel}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {showMatch ? (
            <Lane label={data.matchLaneLabel} products={matchProducts} accent="primary" />
          ) : (
            <div className="grid place-items-center rounded-xl border border-dashed border-border bg-background p-3 text-center text-sm text-muted-foreground">
              {data.matchLaneLabel}: run it to see the bars
            </div>
          )}
          {showWrong ? (
            <Lane label={data.wrongLaneLabel} products={wrongProducts} accent="muted" />
          ) : (
            <div className="grid place-items-center rounded-xl border border-dashed border-border bg-background p-3 text-center text-sm text-muted-foreground">
              {data.wrongLaneLabel}: run it to see the bars
            </div>
          )}
        </div>

        {showMatch || showWrong ? (
          <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
            {showMatch && showWrong
              ? `Matching total ${(matchTotal * NORM).toFixed(2)} versus wrong total ${(wrongTotal * NORM).toFixed(2)}. The matching lane grows; the wrong lane cancels toward zero.`
              : showMatch
                ? `Matching total ${(matchTotal * NORM).toFixed(2)}. The products point the same way and add up.`
                : `Wrong total ${(wrongTotal * NORM).toFixed(2)}. The products fight, some positive and some negative, and cancel.`}
          </p>
        ) : null}
          </div>
        }
        aside={
          <>
            {/* Micro-challenge: Which one is hiding? */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-foreground">{data.challengeLead}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>

        {!solvedChallenge ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                const r = e.currentTarget.getBoundingClientRect();
                setDrag({ x: e.clientX, y: e.clientY, offX: e.clientX - r.left, offY: e.clientY - r.top, w: r.width });
              }}
              className={cn(
                "inline-flex cursor-grab touch-none items-center gap-1.5 rounded-full border-2 border-dashed border-primary/60 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-link transition-opacity active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                drag && "opacity-40",
              )}
            >
              <CircleCheck aria-hidden="true" className="size-4" /> Present
            </button>
            <span className="text-xs text-muted-foreground">Drag onto a lane, or tap a lane below.</span>
          </div>
        ) : null}

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {data.lanes.map((lane) => {
            const selected = pick === lane.id;
            const correct = selected && lane.id === data.laneAnswer;
            const wrong = selected && lane.id !== data.laneAnswer;
            const hovering = hoverLane === lane.id;
            return (
              <button
                key={lane.id}
                type="button"
                ref={(el) => {
                  if (el) laneRefs.current.set(lane.id, el);
                  else laneRefs.current.delete(lane.id);
                }}
                onClick={() => pickLane(lane.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  correct && "border-primary bg-primary/10",
                  wrong && "border-destructive bg-destructive/10",
                  hovering && !selected && "border-primary bg-primary/10 ring-2 ring-primary",
                  !selected && !hovering && "border-border bg-background hover:bg-muted",
                )}
              >
                <span className="block text-sm font-semibold text-foreground">{lane.label}</span>
                <span className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${lane.total * 100}%` }} />
                </span>
                <span className="mt-1 block font-mono text-xs text-link">total {lane.total.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-foreground">
          {challengeMsg}
        </p>

        {drag && typeof document !== "undefined"
          ? createPortal(
              <div
                className="pointer-events-none fixed z-[100] inline-flex items-center gap-1.5 rounded-full border-2 border-primary bg-card px-3 py-1.5 text-sm font-semibold text-link shadow-xl"
                style={{ left: drag.x - drag.offX, top: drag.y - drag.offY }}
              >
                <CircleCheck aria-hidden="true" className="size-4" /> Present
              </div>,
              document.body,
            )
          : null}
      </div>

            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <RichText text={data.insight} />
              </p>
            </div>
          </>
        }
      />
    </div>
  );
}
