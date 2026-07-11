"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/** A LaTeX-styled, color-coded formula. Plain tokens render as math typography;
 *  tokens with a `part` are clickable and open a small color-coded popover with a
 *  description and a concrete example. Fraction tokens render stacked. No KaTeX:
 *  hand-styled so every symbol stays individually clickable. */

export type MathToken =
  | { t: string; part?: string; color?: string; italic?: boolean }
  | { frac: readonly [string, string]; part?: string; color?: string };
export type MathPart = { id: string; label: string; color: string; desc: string; example: string };

function isFrac(tok: MathToken): tok is { frac: readonly [string, string]; part?: string; color?: string } {
  return "frac" in tok;
}

function Fraction({ num, den, color }: { num: string; den: string; color?: string }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle text-[0.62em] leading-none" style={color ? { color } : undefined}>
      <span className="px-1 pb-[1px]">{num}</span>
      <span className="w-full border-t border-current px-1 pt-[1px] text-center">{den}</span>
    </span>
  );
}

export function MathFormula({ tokens, parts, className }: { tokens: readonly MathToken[]; parts: readonly MathPart[]; className?: string }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);
  // Viewport coordinates for the clicked token, so the popover can be portaled to
  // <body> and positioned `fixed` (on top of every card, past any transformed ancestor).
  const [open, setOpen] = React.useState<{ id: string; x: number; y: number } | null>(null);
  const part = open ? parts.find((p) => p.id === open.id) ?? null : null;

  const colorOf = (tok: MathToken) => tok.color ?? (tok.part ? parts.find((p) => p.id === tok.part)?.color : undefined);

  const onToken = (e: React.MouseEvent<HTMLButtonElement>, partId: string) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOpen((cur) => (cur?.id === partId ? null : { id: partId, x: r.left + r.width / 2, y: r.bottom + 8 }));
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (popRef.current?.contains(e.target as Node)) return;
      if ((e.target as HTMLElement).closest("[data-math-token]")) return;
      setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onScroll = () => setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const vw = typeof window !== "undefined" ? window.innerWidth : 360;
  const popW = Math.min(280, vw - 24);
  const left = open ? Math.min(Math.max(open.x, popW / 2 + 8), vw - popW / 2 - 8) : 0;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-2 py-2 text-center font-serif text-xl text-foreground sm:text-2xl">
        {tokens.map((tok, i) => {
          const color = colorOf(tok);
          if (tok.part) {
            return (
              <button
                key={i}
                type="button"
                data-math-token
                onClick={(e) => onToken(e, tok.part!)}
                aria-pressed={open?.id === tok.part}
                className={cn(
                  "rounded-md px-1 py-0.5 font-semibold underline decoration-dotted decoration-from-font underline-offset-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !isFrac(tok) && (tok as { italic?: boolean }).italic ? "italic" : "",
                )}
                style={color ? { color } : undefined}
              >
                {isFrac(tok) ? <Fraction num={tok.frac[0]} den={tok.frac[1]} /> : tok.t}
              </button>
            );
          }
          if (isFrac(tok)) return <Fraction key={i} num={tok.frac[0]} den={tok.frac[1]} color={color} />;
          return (
            <span key={i} className={cn("whitespace-pre", (tok as { italic?: boolean }).italic ? "italic" : "")} style={color ? { color } : { color: "var(--muted-foreground)" }}>
              {tok.t}
            </span>
          );
        })}
      </div>

      {open && part && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popRef}
              role="dialog"
              className="fixed z-[100] -translate-x-1/2 rounded-xl border bg-card p-3 shadow-xl"
              style={{ left, top: open.y, width: popW, borderColor: part.color }}
            >
              <p className="text-sm font-semibold" style={{ color: part.color }}>
                {part.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{part.desc}</p>
              <p className="mt-2 rounded-md bg-muted px-2 py-1 text-xs leading-relaxed text-foreground">
                <span className="font-semibold" style={{ color: part.color }}>
                  Example:{" "}
                </span>
                {part.example}
              </p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
