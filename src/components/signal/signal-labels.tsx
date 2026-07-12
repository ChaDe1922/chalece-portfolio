import { laneLabelAnchors, LANES } from "@/components/signal/signal-lanes";

/**
 * Crisp, accessible DOM labels over the signal field (WebGL text is bad; this
 * layer stays sharp in both the SVG and WebGL states). Each label is
 * right-aligned so its accent dot butts up against the left edge of the art
 * (~16%), i.e. every signal begins right next to its label. The eye then follows
 * the lanes as they converge into the bright "Skill" node on the right.
 * Decorative; the H1 carries the meaning.
 */
export function SignalLabels() {
  const anchors = laneLabelAnchors();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {anchors.map((a, i) => (
        <span
          key={a.kind}
          className="absolute flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          // right edge at 16% from the left, so the dot sits at the lane's start.
          style={{ right: "84%", top: `${a.topPct}%` }}
        >
          {a.label}
          <span
            className="h-1 w-1 shrink-0 rounded-full"
            style={{ background: LANES[i].color, opacity: 0.8 }}
          />
        </span>
      ))}
      <span className="absolute right-[1.5%] top-[61%] font-mono text-[10px] uppercase tracking-[0.18em] text-signal-iris">
        Skill
      </span>
    </div>
  );
}
