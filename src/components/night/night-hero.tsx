"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { PillarId } from "@/data/pillars";
import { roleMailto } from "@/data/site";
import { CHANNELS, HERO_BLURB, ORDER } from "@/data/mix";
import { useMix } from "./mix-provider";
import { SHELL } from "./shell";

const OFF = "#262a33";

/** The 30 equalizer bars: ten per pillar, lit by the mix or a hovered verb. */
function bars(on: Record<PillarId, boolean>, single: PillarId | null, hover: PillarId | null) {
  return Array.from({ length: 30 }, (_, i) => {
    const id = ORDER[Math.floor(i / 10)];
    const base = 20 + Math.round(70 * Math.abs(Math.sin(i * 0.7 + 1.3)));
    const lit = hover ? hover === id : on[id];
    const boost = hover ? lit : single === id;
    const height = boost ? Math.min(100, base + 18) : lit ? base : Math.round(base * 0.45);
    return { height: `${height}%`, color: lit ? CHANNELS[id].color : OFF };
  });
}

/** Hero: each verb solos its pillar across the whole page. */
export function NightHero() {
  const { on, ids, single, full, soloOrFull } = useMix();
  const [hover, setHover] = useState<PillarId | null>(null);

  const showId = hover ?? single;
  let label: string;
  if (showId) label = `${hover && hover !== single ? "preview" : "solo"}: ${CHANNELS[showId].name.toLowerCase()}`;
  else if (full) label = "now playing: full mix · music technology · software · learning design";
  else if (ids.length === 2) label = `blend: ${ids.map((id) => CHANNELS[id].short.toLowerCase()).join(" × ")}`;
  else label = "no signal · pick a verb";

  const verb = (id: PillarId, word: string) => {
    const lit = single === id;
    return (
      <button
        type="button"
        aria-pressed={lit}
        onClick={() => soloOrFull(id)}
        onMouseEnter={() => setHover(id)}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover(id)}
        onBlur={() => setHover(null)}
        className="cursor-pointer border-b-[0.0625em] bg-transparent px-[0.04em] leading-none tracking-[-0.045em] transition-colors duration-200"
        style={{ color: lit ? CHANNELS[id].color : "#ecebe6", borderColor: lit ? CHANNELS[id].color : "transparent" }}
      >
        {word}
      </button>
    );
  };

  return (
    <section id="top" className="scroll-mt-20 lg:scroll-mt-28">
      <div className={cn(SHELL, "pt-14 md:pt-[104px]")}>
        <p className="font-mono text-sm text-night-muted">
          <span aria-hidden="true" style={{ color: showId ? CHANNELS[showId].color : "var(--signal)" }}>
            ●
          </span>{" "}
          {label}
        </p>
        <h1 className="mt-7 max-w-[1000px] font-display text-[clamp(3rem,7.5vw,6rem)] font-bold leading-[0.98] tracking-[-0.045em] text-night-fg">
          I {verb("music-tech", "create,")} I {verb("software", "build,")} and I {verb("curriculum", "teach.")}
        </h1>
        <div className="mt-9 flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <p className="max-w-[580px] text-lg leading-relaxed text-night-body md:text-[19px]">
            {showId ? CHANNELS[showId].blurb : HERO_BLURB}
          </p>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <div className="flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex h-[52px] items-center gap-2.5 rounded-[10px] bg-signal px-6 text-base font-semibold text-night transition-colors duration-200"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
                </svg>
                See the work
              </a>
              <a
                href={roleMailto()}
                className="inline-flex h-[52px] items-center rounded-[10px] border border-night-line-strong px-6 text-base font-medium text-night-fg hover:border-night-fg"
              >
                Email me about a role
              </a>
            </div>
            <Link
              href="/lab"
              className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-night-muted underline decoration-night-line-strong underline-offset-4 hover:text-night-fg hover:decoration-night-fg"
            >
              Try a lesson <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="mt-14 flex h-[120px] items-end gap-1 md:mt-[72px] sm:gap-1.5">
          {bars(on, single, hover).map((b, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[3px] transition-[height,background-color] duration-300 ease-out motion-reduce:transition-none"
              style={{ height: b.height, background: b.color }}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-night-line" />
    </section>
  );
}
