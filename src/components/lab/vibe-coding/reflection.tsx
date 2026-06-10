"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  FileDown,
  GraduationCap,
  ListChecks,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CursorTrail } from "@/components/cursor-glow";
import { ClickRipple } from "@/components/click-ripple";
import { site } from "@/data/site";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.slides.reflection;
const parsons = data.parsons;

const ANSWER = parsons.steps.map((s) => s.id);
const STEP_BY_ID: Record<string, { label: string; body: string }> = Object.fromEntries(
  parsons.steps.map((s) => [s.id, { label: s.label, body: s.body }]),
);
// A fixed scramble (not the answer) so there is no hydration mismatch.
const INITIAL: string[] = ["test", "remix", "say"];

/** lucide removed brand icons, so LinkedIn is an inline glyph (matches the
 *  portfolio contact section). */
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

/** Parsons problem: order the three steps. Up/down reorder is fully keyboard
 *  and screen-reader accessible. */
function ParsonsCheck() {
  const [order, setOrder] = React.useState<string[]>(INITIAL);
  const [checked, setChecked] = React.useState(false);

  const isCorrect = order.every((id, i) => id === ANSWER[i]);
  const solved = checked && isCorrect;

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    setOrder((prev) => {
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setChecked(false);
  };

  return (
    <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-link">
          <ListChecks aria-hidden="true" className="size-4" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-link">Quick self-check</span>
      </div>
      <p className="text-base font-medium text-foreground">{parsons.lead}</p>
      <p className="mt-1 text-sm text-muted-foreground">{parsons.instruction}</p>

      <ul className="mt-3 space-y-2">
        {order.map((id, i) => {
          const step = STEP_BY_ID[id];
          return (
            <li
              key={id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                solved ? "border-emerald-400 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20" : "border-border bg-background",
              )}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-heading text-sm font-bold text-link">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-sm font-semibold text-foreground">{step.label}</span>
                <span className="block text-sm text-muted-foreground">{step.body}</span>
              </span>
              <span className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || solved}
                  aria-label={`Move ${step.label} up`}
                  className="grid size-7 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronUp aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1 || solved}
                  aria-label={`Move ${step.label} down`}
                  className="grid size-7 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronDown aria-hidden="true" className="size-4" />
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      {!solved ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="mt-3 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {parsons.check}
        </button>
      ) : null}

      <div aria-live="polite">
        {solved ? (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm leading-relaxed text-foreground">
            <CircleCheckBig aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {parsons.success}
          </p>
        ) : checked ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-destructive">Not quite. </span>
            {parsons.retry}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Slide 4: conclusion + outro. Recap what the learner did, order the loop
 *  (Parsons check), then wrap up with contact, mirroring the recursion outro. */
export function Reflection() {
  return (
    <div className="lesson-stagger space-y-6">
      {/* The close gets the portfolio's cursor trail + click ripple, both of
          which self-disable under reduced motion and clean up on slide leave. */}
      <CursorTrail />
      <ClickRipple />

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.eyebrow}</p>

      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">{data.takeawaysLead}</h3>
        <ol className="mt-4 space-y-5">
          {data.takeaways.map((t, i) => (
            <li key={t.head} className="flex gap-4">
              <span className="font-heading text-2xl font-bold leading-none text-primary">{i + 1}</span>
              <div>
                <h4 className="font-heading text-base font-semibold text-foreground">{t.head}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ParsonsCheck />

      <p className="text-lg leading-relaxed text-foreground">{data.closing}</p>

      {/* What you can do now */}
      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.recapLead}</p>
        <ul className="mt-3 space-y-2">
          {data.recap.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
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
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link"
              />
            </div>
            <p className="mt-4 font-heading text-lg font-semibold text-foreground">{label}</p>
            <p className="mt-1 break-words text-sm text-muted-foreground">{value}</p>
            {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        ))}
      </div>

      {/* CTAs */}
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
