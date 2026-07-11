import * as React from "react";

/** Renders `text` with lightweight markup: `` `code` `` spans become inline
 *  code, and **bold** spans become a semibold <strong>. Everything else is
 *  plain text. Sibling of Emphasize. Shared across lab lessons. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return (
            <code
              key={i}
              className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[0.85em] text-foreground [font-feature-settings:'liga'_0,'calt'_0]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
