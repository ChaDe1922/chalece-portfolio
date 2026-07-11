"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** BucketSort: sort each item into its correct bucket. Click an item in the tray
 *  to select it, then click a bucket. If item.bucket matches the bucket id it
 *  locks into that bucket; otherwise an aria-live "not quite" fires and the
 *  selection resets. Keyboard-operable (real buttons), no HTML5 drag. Solved when
 *  every item is placed correctly. Powers "choose the better view", "place the
 *  sound", "tool sorting", "audio repair", and "same vs new frequency". */

type Bucket = { id: string; label: string };
type Item = { id: string; label: string; bucket: string };

type Props = {
  label: string;
  prompt: string;
  buckets: readonly Bucket[];
  items: readonly Item[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

export function BucketSort({ label, prompt, buckets, items, successText, objective, onSolved }: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [placed, setPlaced] = React.useState<Record<string, string>>({}); // itemId -> bucketId
  const [status, setStatus] = React.useState("");

  const itemById = React.useMemo(() => {
    const m = new Map<string, Item>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  const remaining = React.useMemo(() => items.filter((it) => !placed[it.id]), [items, placed]);
  const solved = items.length > 0 && items.every((it) => placed[it.id] === it.bucket);

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  const pickItem = (id: string) => {
    setSelected((cur) => (cur === id ? null : id));
    const it = itemById.get(id);
    setStatus(it ? `Selected "${it.label}". Now choose a bucket.` : "");
  };

  const placeInBucket = (bucket: Bucket) => {
    if (!selected) {
      setStatus("Choose an item first, then a bucket.");
      return;
    }
    const it = itemById.get(selected);
    if (!it) {
      setSelected(null);
      return;
    }
    if (it.bucket === bucket.id) {
      setPlaced((prev) => ({ ...prev, [it.id]: bucket.id }));
      setSelected(null);
      setStatus(`Placed "${it.label}" in ${bucket.label}.`);
    } else {
      setStatus(`Not quite. "${it.label}" does not belong in ${bucket.label}. Try again.`);
      setSelected(null);
    }
  };

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">
        <RichText text={prompt} />
      </p>

      <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</p>
      <div className="flex min-h-11 flex-wrap gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-2">
        {remaining.length === 0 ? (
          <span className="px-1 py-1 text-sm text-muted-foreground">All items placed. Check your buckets.</span>
        ) : (
          remaining.map((it) => {
            const isSel = selected === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => pickItem(it.id)}
                aria-pressed={isSel}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSel
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted",
                )}
              >
                <RichText text={it.label} />
              </button>
            );
          })
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {buckets.map((bucket) => {
          const inBucket = items.filter((it) => placed[it.id] === bucket.id);
          return (
            <div key={bucket.id} className="rounded-lg border border-border bg-card p-3">
              <button
                type="button"
                onClick={() => placeInBucket(bucket)}
                aria-label={`Place selected item in bucket: ${bucket.label}`}
                className="w-full rounded-md border border-dashed border-border bg-background px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RichText text={bucket.label} />
              </button>
              <ul className="mt-2 space-y-1.5">
                {inBucket.length === 0 ? (
                  <li className="px-1 text-xs text-muted-foreground">Empty</li>
                ) : (
                  inBucket.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50/50 px-2.5 py-1.5 text-sm text-foreground dark:border-emerald-800/70 dark:bg-emerald-950/20"
                    >
                      <Check aria-hidden="true" className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <RichText text={it.label} />
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status}
      </p>
    </CheckCard>
  );
}
