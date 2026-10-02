"use client";

import { useState } from "react";
import { teaching } from "@/data/teaching";
import { ChevronIcon } from "@/components/lab/course/icons";

/** The andragogy beliefs as numbered rows beside a heading column. The first is open. */
export function TeachingBeliefs() {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section
      aria-labelledby="teaching-heading"
      className="mt-14 border-t border-night-line pt-9 lg:mt-[72px] lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14 lg:pt-12"
    >
      <div>
        <p className="font-mono text-[13px] text-night-muted">{teaching.eyebrow}</p>
        <h2
          id="teaching-heading"
          className="mt-3 font-display text-[30px] leading-[1.08] font-bold tracking-[-0.03em] text-night-fg text-balance lg:text-[38px]"
        >
          {teaching.heading}
        </h2>
        <p className="mt-3.5 text-[15px] leading-[1.6] text-night-body lg:text-base">{teaching.lede}</p>
      </div>

      <ul className="mt-5 border-b border-night-line lg:mt-0">
        {teaching.principles.map((p, i) => {
          const isOpen = open.has(i);
          const panelId = `belief-panel-${i}`;
          return (
            <li key={p.title} className="border-t border-night-line">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex min-h-[60px] w-full cursor-pointer items-center gap-3 py-3 text-left text-night-fg lg:min-h-16 lg:gap-4"
              >
                <span className="w-6 shrink-0 font-mono text-xs text-night-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base leading-[1.35] font-semibold lg:text-lg">{p.title}</span>
                <span className="text-night-muted">
                  <ChevronIcon up={isOpen} />
                </span>
              </button>
              <p
                id={panelId}
                hidden={!isOpen}
                className="mb-5 ml-9 max-w-[560px] text-[15px] leading-[1.6] text-night-body text-pretty lg:ml-10 lg:text-base"
              >
                {p.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
