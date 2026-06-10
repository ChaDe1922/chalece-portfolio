"use client";

import * as React from "react";
import { ArrowUpRight, Check, Copy, Send, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyText } from "@/lib/clipboard";
import { launchPrompt, type ToolId } from "@/lib/ai-launch";
import { useVibeBuild, type BuildId } from "@/components/lab/vibe-coding/vibe-context";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.aiPanel;

// Seed the builder's first field from what the learner chose to build.
const BUILD_THING: Record<BuildId, string> = {
  game: "game",
  music: "beat maker",
  school: "study tool",
};

// Tools the toggle can send a pre-filled prompt to (those with a query URL).
const SEND_TOOLS = data.tools.filter((t) => t.query) as ReadonlyArray<(typeof data.tools)[number]>;

/** The "Try it for real" hub beside the lesson. Opens real free AI tools in a
 *  new tab, pre-filling prompts where supported and copying them as a fallback.
 *  No backend, no API key. */
export function AiPanel() {
  const { build } = useVibeBuild();
  const quickPrompts = vibeCodingLab.builds[build ?? "music"].remixPrompts;
  const [tool, setTool] = React.useState<ToolId>("chatgpt");
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [copied, setCopied] = React.useState(false);

  // The first field is seeded from the chosen build until the learner edits it.
  // Deriving it (instead of writing state in an effect) means it tracks a later
  // choice change and still lets them clear or override it.
  const fieldValue = (id: string) =>
    id === "thing" && fields.thing === undefined && build ? BUILD_THING[build] : fields[id] ?? "";

  const builtPrompt = data.builderFields
    .map((f) => {
      const v = fieldValue(f.id).trim();
      return v ? `${f.before} ${v}.` : null;
    })
    .filter(Boolean)
    .join(" ");

  const toolLabel = SEND_TOOLS.find((t) => t.id === tool)?.label ?? "ChatGPT";

  const onCopyBuilt = async () => {
    if (!builtPrompt || !(await copyText(builtPrompt))) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6">
      <header>
        <h2 className="font-heading text-lg font-bold text-foreground">{data.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.intro}</p>
      </header>

      {/* Open a tool */}
      <div className="flex flex-wrap gap-2">
        {data.tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => window.open(t.url, "_blank", "noopener,noreferrer")}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {data.openLabel} {t.label}
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </button>
        ))}
      </div>

      {/* Where prompts go */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-link">{data.toolLabel}</p>
        <div className="mt-2 inline-flex rounded-lg border border-border bg-background p-1">
          {SEND_TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              aria-pressed={tool === t.id}
              className={cn(
                "inline-flex h-8 items-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                tool === t.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt builder */}
      <section aria-label={data.builderLead} className="rounded-xl border border-border bg-background p-4">
        <p className="font-heading text-sm font-semibold text-foreground">{data.builderLead}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{data.builderHelp}</p>
        <div className="mt-3 space-y-2.5">
          {data.builderFields.map((f) => (
            <label key={f.id} className="block text-sm leading-relaxed text-foreground">
              <span>{f.before} </span>
              <input
                type="text"
                value={fieldValue(f.id)}
                onChange={(e) => setFields((prev) => ({ ...prev, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void launchPrompt(tool, builtPrompt)}
            disabled={!builtPrompt}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
          >
            <Send aria-hidden="true" className="size-4" /> {data.send} to {toolLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </button>
          <button
            type="button"
            onClick={onCopyBuilt}
            disabled={!builtPrompt}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
              copied ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-link hover:bg-muted",
            )}
          >
            {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
            {copied ? data.copied : data.copy}
          </button>
        </div>
      </section>

      {/* Idea chips */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-link">{data.ideasLead}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.ideas.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => setFields((prev) => ({ ...prev, thing: idea }))}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Quick remix prompts */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-link">{data.quickLead}</p>
        <ul className="mt-2 space-y-2">
          {quickPrompts.map((p) => (
            <li key={p.text} className="flex items-start gap-2 rounded-lg border border-border bg-background p-2.5">
              <span className="flex-1 text-xs leading-relaxed text-foreground">{p.text}</span>
              <button
                type="button"
                onClick={() => void launchPrompt(tool, p.text)}
                aria-label={`Send to ${toolLabel}: ${p.text}`}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Send aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldAlert aria-hidden="true" className="size-4 text-amber-600 dark:text-amber-400" />
          {data.safetyTitle}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.safety}</p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{data.footnote}</p>
      <p className="text-sm font-medium italic leading-relaxed text-foreground">{data.closing}</p>
    </div>
  );
}
