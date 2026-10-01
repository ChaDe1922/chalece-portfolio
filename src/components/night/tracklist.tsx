"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { PillarId } from "@/data/pillars";
import { work, type WorkItem } from "@/data/work";
import { CHANNELS, ORDER } from "@/data/mix";
import { useMix } from "./mix-provider";
import { EYEBROW, H2, SHELL } from "./shell";

type Filter = { id: PillarId | null; label: string; tag: string; color: string };

const FILTERS: Filter[] = [
  { id: null, label: "Full mix", tag: "MIX", color: "#ecebe6" },
  ...ORDER.map((id) => ({ id, label: CHANNELS[id].short, tag: "S", color: CHANNELS[id].color })),
];

function TrackLink({ item, color }: { item: WorkItem; color: string }) {
  if (!item.href) return null;
  const label = `${item.linkLabel ?? "open"} →`;
  const className = "inline-flex min-h-11 items-center font-mono text-sm hover:underline";
  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={className} style={{ color }}>
        {label}
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} style={{ color }}>
      {label}
      <span className="sr-only"> for {item.title}, opens in a new tab</span>
    </a>
  );
}

/** Featured work as a tracklist, filtered by the console mix. */
export function Tracklist() {
  const { on, ids, single, full, open, solo, fullMix, setOpen } = useMix();

  const rows = work.map((item, index) => ({ item, index })).filter(({ item }) => on[item.pillar]);
  const workLabel = full
    ? "full mix"
    : single
      ? `solo ${CHANNELS[single].short.toLowerCase()}`
      : ids.length
        ? `blend ${ids.map((id) => CHANNELS[id].short.toLowerCase()).join(" × ")}`
        : "muted";

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-20 lg:scroll-mt-28 border-y border-night-line bg-night-surface"
    >
      <div className={cn(SHELL, "py-16 md:py-24")}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={EYEBROW}>{`// featured work · ${workLabel}`}</p>
            <h2 id="work-heading" className={H2}>
              The tracklist.
            </h2>
          </div>
          <div role="group" aria-label="Filter the tracklist" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const pressed = f.id === null ? full : single === f.id;
              const fg = pressed ? "#0f1115" : f.color;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => (f.id === null ? fullMix() : solo(f.id))}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border px-3.5 text-sm font-medium"
                  style={{ borderColor: pressed ? f.color : "#3a3f4b", background: pressed ? f.color : "transparent", color: fg }}
                >
                  <span
                    aria-hidden="true"
                    className="rounded border px-[5px] py-0.5 font-mono text-[11px]"
                    style={{ borderColor: fg }}
                  >
                    {f.tag}
                  </span>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {rows.length > 0 ? (
          <ul className="mt-9 border-b border-night-line">
            {rows.map(({ item, index }, n) => {
              const expanded = open === index;
              const color = CHANNELS[item.pillar].color;
              const panelId = `track-${index}`;
              return (
                <li
                  key={item.title}
                  className="border-t border-night-line transition-colors duration-200"
                  style={{ background: expanded ? "#1a1e26" : "transparent" }}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : index)}
                      className="grid min-h-[72px] w-full cursor-pointer grid-cols-[32px_1fr_24px] items-center gap-x-3 gap-y-1 px-2 py-4 text-left text-night-fg sm:px-4 md:grid-cols-[48px_1fr_170px_130px_32px] md:gap-5 md:py-0"
                    >
                      <span className="font-mono text-sm text-night-muted">{String(n + 1).padStart(2, "0")}</span>
                      <span className="font-display text-lg font-bold leading-snug md:text-[21px]">{item.title}</span>
                      <span
                        aria-hidden="true"
                        className="col-start-3 row-start-1 text-right font-mono text-lg md:col-start-5"
                        style={{ color }}
                      >
                        {expanded ? "−" : "+"}
                      </span>
                      <span className="col-start-2 flex flex-wrap items-center gap-3 md:contents">
                        <span
                          className="justify-self-start rounded-full border px-3 py-1 text-[13px]"
                          style={{ borderColor: color, color }}
                        >
                          {CHANNELS[item.pillar].short}
                        </span>
                        <span className="font-mono text-[13px] text-night-muted md:text-right">{item.meta}</span>
                      </span>
                    </button>
                  </h3>
                  {expanded && (
                    <div
                      id={panelId}
                      className="grid gap-5 px-2 pb-7 pl-[52px] sm:px-4 sm:pl-[60px] md:grid-cols-[1fr_260px] md:gap-10 md:pl-[84px]"
                    >
                      <p className="text-base leading-relaxed text-night-body">{item.description}</p>
                      <div className="flex flex-col items-start gap-3">
                        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                          {item.tags.map((tag) => (
                            <li key={tag} className="rounded-md bg-night-raised px-2.5 py-[3px] text-xs text-night-body">
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <TrackLink item={item} color={color} />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-9 px-4 py-10 font-mono text-sm text-night-muted">
            All channels are off. Bring one up on the console, or{" "}
            <button
              type="button"
              onClick={fullMix}
              className="cursor-pointer font-mono text-sm text-[#ff7a59] underline"
            >
              go to full mix
            </button>
            .
          </p>
        )}
      </div>
    </section>
  );
}
