"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** SpotTheError: scan a set of lines and click the one that is wrong. Clicking the
 *  line flagged with wrong:true solves the challenge and reveals revealText below
 *  the lines; clicking a correct line gives gentle aria-live feedback. Lines are
 *  real buttons (keyboard-operable, visible focus). Powers "error detective". */

type Line = { id: string; text: string; wrong?: boolean };

type Props = {
  label: string;
  prompt: string;
  lines: readonly Line[];
  revealText: string;
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

export function SpotTheError({ label, prompt, lines, revealText, successText, objective, onSolved }: Props) {
  const [foundId, setFoundId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("");
  const solved = foundId !== null;

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  const pick = (line: Line) => {
    if (solved) return;
    if (line.wrong) {
      setFoundId(line.id);
      setStatus("You found the error.");
    } else {
      setStatus("That line is fine. Keep looking.");
    }
  };

  return (
    <CheckCard label={label} solved={solved}>
      <p className="text-base font-medium text-foreground">
        <RichText text={prompt} />
      </p>

      <ul className="mt-4 space-y-2">
        {lines.map((line) => {
          const isFound = foundId === line.id;
          return (
            <li key={line.id}>
              <button
                type="button"
                onClick={() => pick(line)}
                disabled={solved}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                  isFound
                    ? "border-emerald-300 bg-emerald-50/50 text-foreground dark:border-emerald-800/70 dark:bg-emerald-950/20"
                    : "border-border bg-background text-foreground hover:bg-muted",
                )}
              >
                <span className="flex-1 font-mono text-[0.85em] [font-feature-settings:'liga'_0,'calt'_0]">
                  <RichText text={line.text} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {solved ? (
        <div className="mt-4">
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm leading-relaxed text-foreground">
            <RichText text={revealText} />
          </p>
          <div className="mt-4">
            <SuccessCover objective={objective} rationale={successText} />
          </div>
        </div>
      ) : (
        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
          {status}
        </p>
      )}
    </CheckCard>
  );
}
