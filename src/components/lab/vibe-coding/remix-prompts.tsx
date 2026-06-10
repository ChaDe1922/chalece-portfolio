"use client";

import * as React from "react";
import { Check, Copy, HelpCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyText } from "@/lib/clipboard";
import { launchPrompt } from "@/lib/ai-launch";
import { useVibeBuild } from "@/components/lab/vibe-coding/vibe-context";
import { TryItCta } from "@/components/lab/vibe-coding/try-it-cta";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.slides.remix;

type Tag = (typeof vibeCodingLab.builds.music.remixPrompts)[number]["tag"];

/** Per-build slide heading ("Remix your game." / "...beat maker." / "...study
 *  tool.") used as the deck titleNode so it reflects the learner's choice. */
export function RemixTitle() {
  const { build } = useVibeBuild();
  const b = vibeCodingLab.builds[build ?? "music"];
  return (
    <>
      {data.titlePrefix} {b.noun}.
    </>
  );
}

const TAG_STYLES: Record<Tag, string> = {
  Sound: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Visual: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  Behavior: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

function PromptCard({
  tag,
  text,
  selected,
  onPick,
}: {
  tag: Tag;
  text: string;
  selected: boolean;
  onPick: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors",
        selected ? "border-primary/60 ring-1 ring-primary/30" : "border-border",
      )}
    >
      <span className={cn("self-start rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", TAG_STYLES[tag])}>
        {tag}
      </span>
      <button
        type="button"
        onClick={onPick}
        aria-pressed={selected}
        className="flex-1 rounded-md text-left text-sm leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {text}
      </button>
      <div className="flex items-center gap-2 self-end">
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Prompt copied" : `Copy prompt: ${text}`}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            copied ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-link hover:bg-muted",
          )}
        >
          {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={() => void launchPrompt("chatgpt", text)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Send aria-hidden="true" className="size-3.5" /> {data.send}
          <span className="sr-only"> (opens in a new tab)</span>
        </button>
      </div>
    </div>
  );
}

/** Slide 3: pick a remix direction, then sharpen it. The follow-up teaches that
 *  a prompt gets better with one more concrete detail. */
export function RemixPrompts() {
  const { build } = useVibeBuild();
  const prompts = vibeCodingLab.builds[build ?? "music"].remixPrompts;
  const [picked, setPicked] = React.useState<number | null>(null);
  const [refine, setRefine] = React.useState("");
  const [idea, setIdea] = React.useState("");

  const pickedText = picked !== null ? prompts[picked].text : "";

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.eyebrow}</p>
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{data.dek}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {prompts.map((p, i) => (
          <PromptCard
            key={p.text}
            tag={p.tag}
            text={p.text}
            selected={picked === i}
            onPick={() => {
              setPicked(i);
              setRefine("");
            }}
          />
        ))}
      </div>

      {/* Vote follow-up: make the chosen prompt clearer. */}
      {picked !== null ? (
        <div aria-live="polite" className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
          <p className="font-heading text-base font-semibold text-foreground">{data.voteFeedback}</p>
          <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <HelpCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
            {data.followupQuestion}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.followupExamples.map((ex) => (
              <span key={ex} className="rounded-full bg-accent px-2.5 py-1 text-xs text-foreground">
                {ex}
              </span>
            ))}
          </div>
          <textarea
            value={refine}
            onChange={(e) => setRefine(e.target.value)}
            rows={2}
            placeholder={data.followupPlaceholder}
            className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => void launchPrompt("chatgpt", refine.trim() ? `${pickedText} ${refine.trim()}` : pickedText)}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Send aria-hidden="true" className="size-4" /> {data.send}
            <span className="sr-only"> (opens in a new tab)</span>
          </button>
        </div>
      ) : null}

      {/* Your own idea. */}
      <div className="rounded-xl border border-dashed border-primary/50 bg-card p-4">
        <p className="inline-block rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-link">
          {data.yourIdeaTag}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{data.yourIdeaHint}</p>
        <ul className="mt-1 space-y-0.5">
          {data.yourIdeaTemplate.map((line) => (
            <li key={line} className="font-mono text-xs text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
              {line}
            </li>
          ))}
        </ul>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          placeholder={data.yourIdeaPlaceholder}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={() => void launchPrompt("chatgpt", idea)}
          disabled={idea.trim().length === 0}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <Send aria-hidden="true" className="size-4" /> {data.send}
          <span className="sr-only"> (opens in a new tab)</span>
        </button>
      </div>

      <TryItCta />
    </div>
  );
}
