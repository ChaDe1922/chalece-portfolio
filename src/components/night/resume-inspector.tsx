"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode, type Ref } from "react";

import { cn } from "@/lib/utils";
import type { Clip } from "@/data/timeline";

type Props = {
  id: string;
  clip: Clip;
  lane: { name: string; color: string };
  open: boolean;
  onToggle: () => void;
  ref?: Ref<HTMLElement>;
  /** Count and transport, shown in the dock header. */
  children: ReactNode;
};

/**
 * The docked editor: the selected clip's details, pinned to the bottom of the
 * screen while the timeline is in view, like the editor pane under a DAW's
 * arrange view. It settles back into the page once the timeline scrolls past.
 */
export function ResumeInspector({ id, clip, lane, open, onToggle, ref, children }: Props) {
  const body = useRef<HTMLDivElement>(null);
  const where = [clip.org, clip.place].filter(Boolean).join(" · ");
  const external = clip.link && !clip.link.href.startsWith("/");
  const linkClass =
    "mt-4 inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-4 text-sm font-medium text-night-fg hover:bg-night-raised";

  // A long clip scrolls inside the dock. The next clip starts from its top.
  useEffect(() => {
    if (body.current) body.current.scrollTop = 0;
  }, [clip.id]);

  return (
    <aside
      ref={ref}
      id={id}
      aria-label="Clip details"
      className="sticky bottom-0 z-[35] mt-4 rounded-t-[20px] border border-b-0 border-night-line-strong bg-night-surface shadow-[0_-18px_40px_rgba(0,0,0,0.5)] print:static print:shadow-none"
    >
      <span aria-hidden="true" className="mx-auto mt-2 -mb-0.5 block h-1 w-10 rounded-sm bg-night-line-strong md:hidden" />
      <div className="flex flex-wrap items-center justify-between gap-x-3.5 gap-y-2 border-b border-night-line py-2.5 pr-3 pl-[18px] md:pr-3.5 md:pl-[22px]">
        <p className="flex min-w-0 items-center gap-2 font-mono text-xs" style={{ color: lane.color }}>
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: lane.color }} />
          {lane.name} · {clip.label}
        </p>
        {!open && (
          <p className="min-w-0 flex-[1_1_200px] truncate text-sm font-semibold text-night-fg">{clip.role}</p>
        )}
        <div className="flex items-center gap-2 md:gap-3">
          {children}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-body`}
            onClick={onToggle}
            className="min-h-11 cursor-pointer rounded-[10px] border border-night-line-strong px-3 font-mono whitespace-nowrap text-xs font-medium text-night-body transition-colors duration-200 hover:text-night-fg"
          >
            {open ? (
              "Hide"
            ) : (
              <>
                <span className="md:hidden">Details</span>
                <span className="hidden md:inline">Show details</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div
        ref={body}
        id={`${id}-body`}
        hidden={!open}
        className={cn(
          "max-h-[40svh] overflow-auto px-[18px] pt-3.5 pb-[18px] md:max-h-[34svh] md:px-[22px] md:pt-[18px] md:pb-[22px]",
          open && "grid gap-x-9 gap-y-2 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]"
        )}
      >
        <div>
          <h3 className="font-display text-[19px] font-bold leading-tight tracking-[-0.02em] text-night-fg text-balance md:text-[22px]">
            {clip.role}
          </h3>
          <p className="mt-1.5 text-[15px] text-night-muted">{where}</p>
          {clip.link &&
            (external ? (
              <a
                href={clip.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                style={{ borderColor: lane.color }}
              >
                {clip.link.label} ↗<span className="sr-only">, opens in a new tab</span>
              </a>
            ) : (
              <Link href={clip.link.href} className={linkClass} style={{ borderColor: lane.color }}>
                {clip.link.label} →
              </Link>
            ))}
        </div>
        <ul className="grid gap-x-7 gap-y-2.5 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {clip.points.map((point) => (
            <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-night-body text-pretty">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0" style={{ background: lane.color }} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
