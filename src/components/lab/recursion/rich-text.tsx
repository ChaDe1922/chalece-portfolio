import * as React from "react";

/** Renders `text` with each `backtick`-wrapped span styled as inline code.
 *  Keeps the rest of the string as plain text. Sibling of Emphasize. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
          <code
            key={i}
            className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[0.85em] text-foreground [font-feature-settings:'liga'_0,'calt'_0]"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
