"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Camera, FilePenLine, History, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";

const data = gitLab.slides.whyGit;

type Photo = { n: number; content: string };

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/** Slide 1 (on-ramp): feel version history before any jargon. Edit a file, take
 *  snapshots that land on a timeline, then click an earlier one to time travel.
 *  Reveals at the end that Git calls each snapshot a commit. */
export function WhyGit() {
  const reduced = useReducedMotion();
  const [version, setVersion] = React.useState(0);
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [viewing, setViewing] = React.useState<number | null>(null); // index into photos
  const [caption, setCaption] = React.useState<string>(data.captions.start);
  const [flash, setFlash] = React.useState(0);

  const atLatestVersion = version >= data.versions.length - 1;
  const shown = viewing != null ? photos[viewing].content : data.versions[version];

  function edit() {
    setVersion((v) => Math.min(data.versions.length - 1, v + 1));
    setViewing(null);
    setCaption(data.captions.edited);
  }
  function snapshot() {
    setPhotos((p) => {
      const next = [...p, { n: p.length + 1, content: data.versions[version] }];
      setCaption(data.captions.snapped(next.length));
      return next;
    });
    setViewing(null);
    if (!reduced) setFlash((f) => f + 1);
  }
  function travel(i: number) {
    setViewing(i);
    setCaption(data.captions.viewing(photos[i].n));
  }
  function latest() {
    setViewing(null);
    setCaption(data.captions.latest);
  }
  function reset() {
    setVersion(0);
    setPhotos([]);
    setViewing(null);
    setCaption(data.captions.start);
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.intro}</p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>

      {/* The file */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-foreground">{data.fileName}</span>
          {viewing != null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-link">
              <History aria-hidden="true" className="size-3.5" /> Time traveling
            </span>
          ) : null}
        </div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-background">
          <pre className="min-h-32 whitespace-pre-wrap p-4 font-mono text-sm text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
            {shown}
          </pre>
          {/* capture flash */}
          <AnimatePresence>
            {flash > 0 ? (
              <m.div
                key={flash}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 bg-white"
              />
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={edit} disabled={atLatestVersion || viewing != null} className={btnGhost}>
            <FilePenLine aria-hidden="true" className="size-4" /> {data.editLabel}
          </button>
          <button type="button" onClick={snapshot} disabled={viewing != null} className={btnPrimary}>
            <Camera aria-hidden="true" className="size-4" /> {data.snapshotLabel}
          </button>
          {viewing != null ? (
            <button type="button" onClick={latest} className={btnGhost}>
              <History aria-hidden="true" className="size-4" /> {data.latestLabel}
            </button>
          ) : null}
          {photos.length > 0 ? (
            <button type="button" onClick={reset} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="min-h-6 text-sm leading-relaxed text-muted-foreground">
        {caption}
      </p>

      {/* The timeline of snapshots */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-link">Your timeline</p>
        {photos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground">
            {data.takeHint}
          </p>
        ) : (
          <div className="flex flex-wrap gap-3" aria-live="polite">
            {photos.map((photo, i) => {
              const isViewed = viewing === i;
              return (
                <m.button
                  key={photo.n}
                  type="button"
                  onClick={() => travel(i)}
                  aria-label={`View snapshot ${photo.n}`}
                  aria-pressed={isViewed}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "w-32 shrink-0 rounded-lg border-2 p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isViewed ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-link">
                    <Camera aria-hidden="true" className="size-3.5" /> {data.photoLabel(photo.n)}
                  </span>
                  <pre className="mt-1.5 line-clamp-3 h-12 overflow-hidden whitespace-pre-wrap font-mono text-[0.6rem] leading-tight text-muted-foreground">
                    {photo.content}
                  </pre>
                </m.button>
              );
            })}
          </div>
        )}
      </div>

      {photos.length >= 2 ? (
        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.reveal} />
          </p>
        </div>
      ) : null}
    </div>
  );
}
