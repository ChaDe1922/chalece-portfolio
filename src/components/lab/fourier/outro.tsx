"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, FileDown, GraduationCap, Mail, Play, Sparkles } from "lucide-react";
import { fourierLab } from "@/data/fourier-lab";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { PartialGraphs } from "./partial-graphs";
import { CursorTrail } from "@/components/cursor-glow";
import { ClickRipple } from "@/components/click-ripple";
import { site } from "@/data/site";

const data = fourierLab.slides.outro;

const FLUTE_AMPS = [1, 0.25, 0.1, 0.05, 0, 0];
const VIOLIN_AMPS = [1, 0.8, 0.6, 0.5, 0.35, 0.28];

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const channels = [
  { label: "Email", value: site.email, href: site.links.email, Icon: Mail, external: false },
  { label: "LinkedIn", value: "in/chalecedelacoudray", href: site.links.linkedin, Icon: LinkedinIcon, external: true },
  { label: "Coursera", value: "7 published courses", href: site.links.coursera, Icon: GraduationCap, external: true },
];

/** Closing slide: re-ask the flute vs violin question, hear them and reveal both
 *  spectra, reflect, then the takeaway, closing, and contact. */
export function Outro() {
  const engine = useAudioEngineContext();
  const [revealed, setRevealed] = React.useState(false);
  const [reflection, setReflection] = React.useState("");
  const [showRubric, setShowRubric] = React.useState(false);

  React.useEffect(() => {
    engine.preloadSamples([data.fluteSample, data.violinSample]);
  }, [engine]);

  const play = (url: string, gain: number) => {
    engine.ensure();
    void engine.playSample(url, { gain });
  };

  return (
    <div className="lesson-stagger space-y-6">
      <CursorTrail />
      <ClickRipple />

      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.lead} />
      </p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => play(data.fluteSample, 0.95)}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.fluteLabel}
          </button>
          <button
            type="button"
            onClick={() => play(data.violinSample, 0.85)}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.violinLabel}
          </button>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            aria-pressed={revealed}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sparkles aria-hidden="true" className="size-4" /> {data.revealLabel}
          </button>
          <AudioControls engine={engine} />
        </div>
        {revealed ? (
          <div className="grid gap-4 sm:grid-cols-2" aria-live="polite">
            <figure className="space-y-1">
              <PartialGraphs amps={FLUTE_AMPS} view="bars" className="[&_canvas]:h-32" />
              <figcaption className="text-center text-xs font-medium text-muted-foreground">Flute: a few strong components</figcaption>
            </figure>
            <figure className="space-y-1">
              <PartialGraphs amps={VIOLIN_AMPS} view="bars" className="[&_canvas]:h-32" />
              <figcaption className="text-center text-xs font-medium text-muted-foreground">Violin: a broader, stronger stack</figcaption>
            </figure>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <label htmlFor="final-reflect" className="text-base font-medium text-foreground">
          {data.reflectPrompt}
        </label>
        <textarea
          id="final-reflect"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder={data.reflectPlaceholder}
          rows={3}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={() => setShowRubric(true)}
          className="mt-3 inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Compare with a strong answer
        </button>
        {showRubric ? (
          <p aria-live="polite" className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-sm leading-relaxed text-foreground">
            {data.reflectRubric}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.takeawayLead}</p>
        <ul className="mt-3 space-y-2">
          {data.takeaway.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-foreground">{data.closing}</p>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground">{data.contactLead}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {channels.map(({ label, value, href, Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-link/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex items-center justify-between">
              <Icon aria-hidden="true" className="size-6 text-link" />
              <ArrowUpRight aria-hidden="true" className="size-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link" />
            </div>
            <p className="mt-4 font-heading text-lg font-semibold text-foreground">{label}</p>
            <p className="mt-1 break-words text-sm text-muted-foreground">{value}</p>
            {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> {data.backToPortfolio}
        </Link>
        <a
          href={site.resumePath}
          download
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileDown aria-hidden="true" className="size-4" /> {data.resume}
        </a>
      </div>

      <p className="pt-2 text-sm italic text-muted-foreground">{data.byline}</p>
    </div>
  );
}
