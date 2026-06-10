"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { launchPrompt } from "@/lib/ai-launch";
import { useVibeBuild } from "@/components/lab/vibe-coding/vibe-context";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

/** In-the-moment nudge: open a real AI in a new tab, pre-filled with the
 *  learner's own starting sentence, before they move on. Lives inside slide
 *  content so it sits above the deck's Next button on every screen size. */
export function TryItCta() {
  const { build } = useVibeBuild();
  const sentence = vibeCodingLab.builds[build ?? "music"].sentence;

  return (
    <div className="rounded-2xl border border-primary/30 bg-[color-mix(in_oklch,var(--link)_8%,var(--card))] p-5 sm:p-6">
      <p className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
        <Sparkles aria-hidden="true" className="size-4 text-link" />
        Try it before you move on
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Open an AI in a new tab and paste your starting sentence. Keep this lesson open so you can come
        back.
      </p>
      <p className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
        {sentence}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void launchPrompt("chatgpt", sentence)}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open ChatGPT in a new tab
          <ArrowUpRight aria-hidden="true" className="size-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </button>
        <button
          type="button"
          onClick={() => void launchPrompt("claude", sentence)}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Claude
          <ArrowUpRight aria-hidden="true" className="size-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </button>
      </div>
    </div>
  );
}
