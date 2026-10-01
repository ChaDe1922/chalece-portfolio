"use client";

import { cn } from "@/lib/utils";
import { ROLE_SUBJECT, roleMailto, site } from "@/data/site";
import type { PillarId } from "@/data/pillars";
import { CHANNELS, DEFAULT_PITCH, ORDER, ROLE_COPY, ROLE_ORDER } from "@/data/mix";
import type { ResumePreview } from "@/data/resume-mix";
import { MasterStrip, Sends } from "./contact-mixer";
import { useMix } from "./mix-provider";
import { EYEBROW, SHELL } from "./shell";

/** The preset whose saved mix matches the faders exactly, if any. */
function matchPreset(on: Record<PillarId, boolean>, levels: Record<PillarId, number>): PillarId | null {
  const hit = ROLE_ORDER.find((role) =>
    ORDER.every((id) => {
      const want = ROLE_COPY[role].preset[id];
      return want > 0 ? on[id] && levels[id] === want : !on[id];
    }),
  );
  return hit ?? null;
}

/** Contact: the visitor mixes the crafts, and the resume download follows the mix. */
export function NightContact({ preview }: { preview: ResumePreview }) {
  const { on, levels, applyPreset } = useMix();
  const preset = matchPreset(on, levels);
  const role = preset ? ROLE_COPY[preset] : null;
  const subject = role?.subject ?? ROLE_SUBJECT;
  const mailto = roleMailto(subject);

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-20 lg:scroll-mt-28">
      <div className={cn(SHELL, "pb-20 pt-20 md:pb-[104px] md:pt-28")}>
        <p className={EYEBROW}>{"// contact · based in atlanta, open to remote roles"}</p>
        <h2
          id="contact-heading"
          className="mt-4 font-display text-[clamp(3.5rem,9vw,5.5rem)] font-bold leading-none tracking-[-0.045em] text-night-fg"
        >
          Let&apos;s <span className="text-signal transition-colors duration-300">talk.</span>
        </h2>

        <p id="mix-label" className="mt-8 font-mono text-[13px] text-night-muted">
          WHAT MATTERS MOST TO YOU?
        </p>
        <div
          role="group"
          aria-labelledby="mix-label"
          className="mt-3 inline-flex flex-col gap-1.5 rounded-[14px] border border-night-line bg-night-surface p-1.5 sm:flex-row"
        >
          {ROLE_ORDER.map((id) => {
            const selected = preset === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => applyPreset(ROLE_COPY[id].preset)}
                className="min-h-12 cursor-pointer rounded-[10px] px-5 text-left text-[15px] font-semibold transition-colors duration-200 sm:text-center"
                style={{ background: selected ? CHANNELS[id].color : "transparent", color: selected ? "#0f1115" : "#b3b5bb" }}
              >
                {ROLE_COPY[id].label}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mt-6 max-w-[640px] text-lg leading-relaxed text-night-fg md:text-xl">
          {role?.pitch ?? DEFAULT_PITCH}
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <Sends />
          </div>

          <div className="w-full max-w-[400px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
            <MasterStrip preview={preview} />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <div className="flex flex-wrap gap-3">
              <a
                href={mailto}
                className="inline-flex h-[54px] items-center gap-2.5 rounded-[10px] bg-signal px-6 text-base font-semibold text-night"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {role ? "Email me about this role" : "Email me"}
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[54px] items-center rounded-[10px] border border-night-line-strong px-6 text-base font-medium text-night-fg hover:border-night-fg"
              >
                LinkedIn<span className="sr-only">, opens in a new tab</span>
              </a>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[54px] items-center rounded-[10px] border border-night-line-strong px-6 text-base font-medium text-night-fg hover:border-night-fg"
              >
                GitHub<span className="sr-only">, opens in a new tab</span>
              </a>
            </div>
            <p className="mt-3.5 break-words font-mono text-xs text-night-muted">
              {site.email} · subject: {subject}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
