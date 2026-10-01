"use client";

import { Fragment } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { LINER_INTRO, LINER_NOTES } from "@/data/mix";
import { useMix } from "./mix-provider";
import { EYEBROW, SHELL } from "./shell";

/** About: headshot on a record sleeve and the liner notes. */
export function LinerNotes() {
  const { accent } = useMix();

  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-20 lg:scroll-mt-28 overflow-hidden">
      <div className={cn(SHELL, "pb-16 pt-20 md:pb-24 md:pt-28")}>
        <p className={EYEBROW}>{"// about · liner notes"}</p>
        <div className="mt-7 grid items-start gap-12 lg:grid-cols-[400px_1fr] lg:gap-[72px]">
          <div className="flex flex-col gap-5">
            <div className="relative aspect-square w-full max-w-[400px]">
              <div
                aria-hidden="true"
                className="absolute right-[-8%] top-[5%] grid aspect-square w-[90%] place-items-center rounded-full border border-night-line bg-night-vinyl"
              >
                <span
                  className="grid aspect-square w-1/3 place-items-center rounded-full transition-colors duration-300"
                  style={{ background: accent }}
                >
                  <span className="size-3 rounded-full bg-night-vinyl" />
                </span>
              </div>
              <Image
                src={site.headshotPath}
                alt={site.name}
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 440px) 400px, 90vw"
                className="rounded-lg object-cover object-top shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
            <p className="font-mono text-xs text-night-muted">CREATE / BUILD / TEACH · ATLANTA, GA</p>
          </div>

          <div>
            <h2
              id="about-heading"
              className="font-display text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.04em] text-night-fg"
            >
              Hi, I&apos;m Chalece.
            </h2>
            <p className="mt-[18px] text-lg leading-[1.65] text-night-body">{LINER_INTRO}</p>
            <dl className="mt-8 grid gap-x-6 gap-y-1 text-[15px] leading-normal text-night-fg sm:grid-cols-[180px_1fr] sm:gap-y-4">
              {LINER_NOTES.map((n) => (
                <Fragment key={n.term}>
                  <dt className="mt-3 pt-[3px] font-mono text-xs tracking-[0.06em] text-night-muted first:mt-0 sm:mt-0">
                    {n.term}
                  </dt>
                  <dd>{n.detail}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
