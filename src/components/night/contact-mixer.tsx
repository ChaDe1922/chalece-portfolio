"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { PillarId } from "@/data/pillars";
import { CHANNELS, ORDER } from "@/data/mix";
import { mixParts, partsToKey, resumeHref, type MixPart, type ResumePreview } from "@/data/resume-mix";
import { useMix } from "./mix-provider";

const EASE = "ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none";

/** A horizontal send: how loud this craft is in the resume. Far left is off. */
function SendFader({ id }: { id: PillarId }) {
  const { on, levels, setLevel } = useMix();
  const ch = CHANNELS[id];
  const value = on[id] ? levels[id] : 0;
  const inputId = `send-${id}`;

  return (
    <div className="grid grid-cols-[96px_1fr_38px] items-center gap-2.5 sm:grid-cols-[132px_1fr_44px] sm:gap-3.5">
      <label
        htmlFor={inputId}
        className={cn("flex items-center gap-2 text-sm font-semibold leading-tight", value ? "text-night-fg" : "text-night-muted")}
      >
        <span aria-hidden="true" className="size-2 flex-none rounded-full" style={{ background: value ? ch.color : "#3a3f4b" }} />
        {ch.short}
      </label>
      <input
        id={inputId}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-valuetext={value ? `${value} percent` : "Off"}
        onChange={(e) => setLevel(id, Number(e.target.value))}
        className="send-fader"
        style={{ "--cc": ch.color, "--p": `${value}%` } as CSSProperties}
      />
      <output htmlFor={inputId} className="text-right font-mono text-[13px] tabular-nums text-night-body">
        {value || "off"}
      </output>
    </div>
  );
}

export function Sends() {
  return (
    <div className="flex flex-col gap-3.5">
      {ORDER.map((id) => (
        <SendFader key={id} id={id} />
      ))}
    </div>
  );
}

const BAR = "block h-[3px] rounded-sm bg-[#c9c8c2]";
/** Grey bars drawn per entry, by tier. A sketch of depth, not a count. */
const BARS_AT = { 1: 1, 2: 2, 3: 3 } as const;

function Heading({ children, color }: { children: string; color?: string }) {
  return (
    <p className="flex items-center gap-[5px] font-mono text-[7px] uppercase leading-none tracking-[0.12em]">
      {color && <span className="size-1.5 rounded-[1px]" style={{ background: color }} />}
      {children}
    </p>
  );
}

/** A thumbnail of the first page, following the mix. Decorative. */
function MiniPage({ preview, parts }: { preview: ResumePreview; parts: MixPart[] }) {
  const tierOf = new Map(parts.map((p) => [p.id, p.tier]));
  const headline =
    parts.length === 1 ? preview[parts[0].id].soloHeadline : parts.map((p) => preview[p.id].title).join(" | ");
  const left = ORDER.flatMap((id) =>
    preview[id].entries.filter((e) => e.kind === "role" && e.minTier > (tierOf.get(id) ?? 0)),
  ).length;

  return (
    <div
      aria-hidden="true"
      className="flex aspect-[8.5/11] flex-col gap-[9px] overflow-hidden rounded-md bg-[#ecebe6] p-4 pb-3.5 text-[#1b1d22] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
    >
      <div>
        <p className="font-display text-[13px] font-bold leading-none tracking-[-0.02em]">Chalece DeLaCoudray</p>
        <p className="mt-1 min-h-[1.2em] text-[8.5px] font-medium leading-[1.2] text-[#444850]">{headline}</p>
      </div>
      <div className="flex flex-col gap-[3px]">
        <Heading>Summary</Heading>
        <span className={BAR} />
        <span className={cn(BAR, "w-[82%]")} />
      </div>
      {parts.length > 0 && (
        <div className="flex flex-col gap-[3px]">
          <Heading>Skills</Heading>
          {parts.map((p) => (
            <span
              key={p.id}
              className={cn(BAR, "opacity-55 transition-[width] duration-300", EASE)}
              style={{ background: CHANNELS[p.id].color, width: `${40 + p.tier * 18}%` }}
            />
          ))}
        </div>
      )}
      {parts.map((p) => (
        <div key={p.id} className="flex flex-col gap-[3px]">
          <Heading color={CHANNELS[p.id].color}>{preview[p.id].section}</Heading>
          {preview[p.id].entries
            .filter((e) => e.minTier <= p.tier)
            .map((e) => (
              <div key={e.title} className="flex flex-col gap-[3px]">
                <span className="text-[7.5px] font-semibold leading-[1.25]">{e.title}</span>
                {Array.from({ length: Math.min(e.bullets, BARS_AT[p.tier]) }, (_, i) => (
                  <span key={i} className={cn(BAR, "w-[82%]")} />
                ))}
              </div>
            ))}
        </div>
      ))}
      {parts.length > 0 && left > 0 && (
        <div className="flex flex-col gap-[3px] text-[#5b5e66]">
          <Heading>Additional Experience</Heading>
          {Array.from({ length: left }, (_, i) => (
            <span key={i} className={cn(BAR, "w-[64%]")} />
          ))}
        </div>
      )}
      <div className="flex flex-col gap-[3px] text-[#5b5e66]">
        <Heading>Education</Heading>
        <span className={cn(BAR, "w-[64%]")} />
        <span className={cn(BAR, "w-[64%]")} />
      </div>
      <div className="flex flex-col gap-[3px] text-[#5b5e66]">
        <Heading>Publications</Heading>
        <span className={cn(BAR, "w-[82%]")} />
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

/** The master bus: the blend as one meter, a page thumbnail, and the download. */
export function MasterStrip({ preview }: { preview: ResumePreview }) {
  const { on, levels } = useMix();
  const parts = mixParts(levels, on);
  const key = parts.length ? partsToKey(parts) : null;
  const button = "inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[10px] px-6 text-base font-semibold";

  return (
    <div className="flex flex-col gap-3.5 rounded-[18px] border border-night-line-strong bg-night-strip p-[18px]">
      <div aria-hidden="true" className="flex items-baseline justify-between gap-3.5 font-mono text-xs">
        <span className="tracking-[0.1em] text-night-fg">MASTER</span>
        <span className="text-right text-night-muted">
          {parts.length ? parts.map((p) => CHANNELS[p.id].short).join(" → ") : "silent"}
        </span>
      </div>
      <div aria-hidden="true" className="flex h-2.5 gap-0.5 overflow-hidden rounded-[5px] bg-night-line">
        {parts.map((p) => (
          <span
            key={p.id}
            className={cn("h-full basis-0 transition-[flex-grow] duration-300", EASE)}
            style={{ flexGrow: levels[p.id], background: CHANNELS[p.id].color }}
          />
        ))}
      </div>
      <MiniPage preview={preview} parts={parts} />
      {key ? (
        <a
          href={resumeHref(key)}
          download
          className={cn(button, "text-night transition-colors duration-200")}
          style={{ background: CHANNELS[parts[0].id].color }}
        >
          <DownloadIcon />
          Download resume<span className="sr-only">, PDF</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-describedby="mix-empty"
          className={cn(button, "cursor-not-allowed border border-night-line-strong text-night-muted")}
        >
          <DownloadIcon />
          Download resume
        </button>
      )}
      {key ? (
        <p className="font-mono text-xs text-night-muted">PDF, ready for applicant tracking systems</p>
      ) : (
        <p id="mix-empty" className="font-mono text-xs text-night-muted">
          Bring up a channel.
        </p>
      )}
    </div>
  );
}
