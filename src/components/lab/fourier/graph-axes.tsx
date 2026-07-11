import * as React from "react";

/** A labeled frame around a graph canvas: a vertical y-axis label on the left, and
 *  an x-axis below with tick marks and optional left/right end labels (e.g. "low" /
 *  "high"). Presentational only; wraps whatever graph is passed as children. */
export function GraphAxes({
  children,
  yLabel,
  xLabel,
  xLeft,
  xRight,
  ticks = 8,
}: {
  children: React.ReactNode;
  yLabel?: string;
  xLabel?: string;
  xLeft?: string;
  xRight?: string;
  ticks?: number;
}) {
  const hasEnds = Boolean(xLeft || xRight);
  return (
    <div className="flex items-stretch gap-2">
      {yLabel ? (
        <span
          className="flex shrink-0 items-center justify-center text-xs font-medium text-muted-foreground"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {yLabel}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {children}
        {ticks > 0 ? (
          <div aria-hidden="true" className="mt-1 flex justify-between px-0.5">
            {Array.from({ length: ticks }, (_, i) => (
              <span key={i} className="h-1.5 w-px bg-border" />
            ))}
          </div>
        ) : null}
        {xLabel || hasEnds ? (
          <div className="mt-0.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span className="min-w-0 flex-1 text-left">{xLeft ?? ""}</span>
            {xLabel ? <span className="shrink-0 px-2 text-center">{xLabel} &rarr;</span> : null}
            <span className="min-w-0 flex-1 text-right">{xRight ?? ""}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
