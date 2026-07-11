"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** "Tap the compression": a static field of dot clusters, some bunched (a
 *  compression) and some spread apart (a rarefaction). Tapping a bunched cluster
 *  identifies a compression. Real buttons, keyboard-operable, aria-live result. */
export function TapCompression() {
  const clusters = [
    { id: 0, compressed: false },
    { id: 1, compressed: true },
    { id: 2, compressed: false },
    { id: 3, compressed: true },
    { id: 4, compressed: false },
  ];
  const [solved, setSolved] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const pick = (compressed: boolean) => {
    if (compressed) {
      setSolved(true);
      setMsg("");
    } else {
      setMsg("That cluster is spread out, which is a rarefaction. Look for where the dots bunch tightly together.");
    }
  };

  if (solved) {
    return (
      <CheckCard label="Tap the compression" solved>
        <SuccessCover objective="Spot a compression in the moving air." rationale="Yes. Where the dots bunch tightly together, the air is compressed." />
      </CheckCard>
    );
  }

  return (
    <CheckCard label="Tap the compression" solved={false}>
      <p className="text-sm leading-relaxed text-muted-foreground">Tap the spot where the air is squeezed tightest.</p>
      <div className="mt-3 flex items-stretch justify-between gap-2 rounded-lg border border-border bg-background p-3">
        {clusters.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pick(c.compressed)}
            aria-label={c.compressed ? "A bunched cluster of dots" : "A spread-out cluster of dots"}
            className="flex h-16 flex-1 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden="true" className={cn("flex", c.compressed ? "gap-0.5" : "gap-2.5")}>
              {[0, 1, 2, 3].map((d) => (
                <span key={d} className="size-2 rounded-full bg-primary/70" />
              ))}
            </span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted-foreground">{msg}</p>
    </CheckCard>
  );
}
