import { laneLabelAnchors, LANES } from "@/components/signal/signal-lanes";

/**
 * Crisp, accessible DOM labels over the signal field (WebGL text is bad; this
 * layer stays sharp in both the SVG and WebGL states). The five discipline
 * labels sit in the left gutter, aligned to each lane's start where the signal
 * is dim, then the eye follows the lanes as they converge (unlabeled) into the
 * bright "Skill" node on the right. Decorative; the H1 carries the meaning.
 */
export function SignalLabels() {
  const anchors = laneLabelAnchors();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {anchors.map((a, i) => (
        <span
          key={a.kind}
          className="absolute left-[1%] flex -translate-y-1/2 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          style={{ top: `${a.topPct}%` }}
        >
          <span
            className="h-1 w-1 shrink-0 rounded-full"
            style={{ background: LANES[i].color, opacity: 0.75 }}
          />
          {a.label}
        </span>
      ))}
      <span className="absolute right-[1.5%] top-[61%] font-mono text-[10px] uppercase tracking-[0.18em] text-signal-iris">
        Skill
      </span>
    </div>
  );
}
