"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Camera, FilePenLine, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";
import { CuriousNote } from "@/components/lab/git/curious-note";

const data = gitLab.slides.snapshot;
const ORIGINAL = data.files.map((f) => ({ name: f.name, blob: f.blob }));

type Tree = { name: string; blob: string }[];

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/** Slide 2: a commit is a snapshot, not a diff. Take a photo, change one file,
 *  take another; an object store below shows each unique file stored once and
 *  reused across photos. */
export function Snapshot() {
  const reduced = useReducedMotion();
  const [readmeBlob, setReadmeBlob] = React.useState<string>(
    ORIGINAL.find((f) => f.name === data.editedFile)!.blob,
  );
  const [snapshots, setSnapshots] = React.useState<Tree[]>([]);
  const [flash, setFlash] = React.useState(0);

  const dirty = readmeBlob === data.editedBlob;
  const working: Tree = ORIGINAL.map((f) =>
    f.name === data.editedFile ? { name: f.name, blob: readmeBlob } : { name: f.name, blob: f.blob },
  );

  const edit = () => setReadmeBlob(data.editedBlob);
  const commit = () => {
    setSnapshots((s) => [...s, working.map((f) => ({ ...f }))]);
    if (!reduced) setFlash((n) => n + 1);
  };
  const reset = () => {
    setReadmeBlob(ORIGINAL.find((f) => f.name === data.editedFile)!.blob);
    setSnapshots([]);
  };

  const done = snapshots.length >= 2;

  // The object store: every unique file content, stored once, in first-seen order.
  const store: string[] = [];
  for (const tree of snapshots) for (const f of tree) if (!store.includes(f.blob)) store.push(f.blob);

  // What the most recent photo reused vs added (for the caption).
  let reuseCaption: string | null = null;
  if (snapshots.length >= 2) {
    const prevBlobs = new Set(snapshots.slice(0, -1).flatMap((t) => t.map((f) => f.blob)));
    const last = snapshots[snapshots.length - 1];
    const reused = last.filter((f) => prevBlobs.has(f.blob)).map((f) => f.blob);
    const added = last.filter((f) => !prevBlobs.has(f.blob)).map((f) => f.blob);
    reuseCaption =
      `Photo ${snapshots.length} reused ${reused.join(", ")}` +
      (added.length ? ` and stored ${added.join(", ")} fresh.` : ".");
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.teach} />
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>

      {/* Working directory */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-link">Working directory</p>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {dirty ? data.dirtyNote : data.cleanNote}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <ul className="space-y-2">
            {working.map((f) => {
              const changed = f.name === data.editedFile && dirty;
              return (
                <li
                  key={f.name}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 transition-colors",
                    changed
                      ? "border-amber-300 bg-amber-50/60 dark:border-amber-800/70 dark:bg-amber-950/20"
                      : "border-border bg-background",
                  )}
                >
                  <span className="font-mono text-sm text-foreground">{f.name}</span>
                  <span className="flex items-center gap-2">
                    {changed ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.7rem] font-medium text-amber-700 dark:text-amber-300">
                        {data.newTag}
                      </span>
                    ) : null}
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {f.blob}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
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
          <button type="button" onClick={edit} disabled={dirty} className={btnGhost}>
            <FilePenLine aria-hidden="true" className="size-4" /> {data.editLabel}
          </button>
          <button type="button" onClick={commit} disabled={done} className={btnPrimary}>
            <Camera aria-hidden="true" className="size-4" /> {data.commitLabel}
          </button>
          {snapshots.length > 0 ? (
            <button type="button" onClick={reset} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          ) : null}
        </div>
      </div>

      {/* Committed photos */}
      {snapshots.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {snapshots.map((tree, i) => {
            const prev = i > 0 ? snapshots[i - 1] : null;
            return (
              <m.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <p className="flex items-center gap-1.5 font-heading text-sm font-semibold text-foreground">
                  <Camera aria-hidden="true" className="size-4 text-link" /> {data.snapshotLabel(i + 1)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{data.treeLead}</p>
                <ul className="mt-3 space-y-1.5">
                  {tree.map((f) => {
                    const reused = prev?.some((pf) => pf.name === f.name && pf.blob === f.blob);
                    return (
                      <li key={f.name} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-foreground">{f.name}</span>
                        <span className="flex items-center gap-2">
                          {reused ? (
                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.7rem] font-medium text-emerald-700 dark:text-emerald-300">
                              {data.reuseTag}
                            </span>
                          ) : null}
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                            {f.blob}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </m.div>
            );
          })}
        </div>
      ) : null}

      {/* Object store: each unique file stored once */}
      {store.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-link">Object store</p>
          <p className="mt-1 text-xs text-muted-foreground">Each unique file content is stored once, by its id.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AnimatePresence>
              {store.map((blob) => (
                <m.span
                  key={blob}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground"
                >
                  {blob}
                </m.span>
              ))}
            </AnimatePresence>
          </div>
          {reuseCaption ? (
            <p aria-live="polite" className="mt-3 text-sm text-foreground">
              {reuseCaption}
            </p>
          ) : null}
        </div>
      ) : null}

      {done ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={data.insight} />
            </p>
          </div>
          <CuriousNote title={data.curiousTitle} body={data.curiousBody} />
        </div>
      ) : null}
    </div>
  );
}
