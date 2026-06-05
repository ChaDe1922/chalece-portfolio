"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { LogIn, LogOut } from "lucide-react";
import { recursionLab } from "@/data/recursion-lab";
import { MirrorRoomCssFallback } from "@/components/lab/recursion/mirror-room-css-fallback";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";

const data = recursionLab.slides.mirror;
const MAX = data.maxDepth; // 7

// Code-split: three / R3F load only when this 3D scene mounts (lab route only),
// never on the marketing pages or the server render.
const MirrorTunnelScene = dynamic(
  () =>
    import("@/components/lab/recursion/mirror-tunnel/mirror-tunnel-scene").then(
      (m) => m.MirrorTunnelScene,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="mx-auto aspect-square w-full max-w-xs rounded-xl border border-border bg-[#05040d]"
      />
    ),
  },
);

/** Slide 1 hook: step into an infinity mirror. Self-reference, before the word
 *  recursion. The visual is a 3D tunnel when WebGL is available and motion is
 *  allowed; otherwise the CSS illusion. The teaching, buttons, and depth
 *  readout live here and drive whichever visual is shown. */
export function MirrorRoom() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport(); // null until probed (server + first paint)
  const [depth, setDepth] = React.useState(0);

  // Pause (unmount) the WebGL canvas when the tab is hidden or the stage is
  // scrolled offscreen, so the render loop genuinely stops on mobile.
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(true);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const use3D = webgl === true && !reduced;

  return (
    <div className="lesson-stagger space-y-5">
      {/* Teaching first */}
      <p className="text-lg leading-relaxed text-foreground">{data.intro}</p>

      <p className="sr-only">
        An interactive tunnel of nested reflections. Use the Step inside and Step back out buttons
        to travel deeper, and read your depth below.
      </p>

      {/* Then the interaction. 3D tunnel or the CSS fallback, same depth state.
          The 3D canvas unmounts when the stage is hidden/offscreen (active). */}
      <div ref={stageRef}>
        {use3D && active ? (
          <MirrorTunnelScene depth={depth} />
        ) : use3D ? (
          <div
            aria-hidden="true"
            className="mx-auto aspect-square w-full max-w-xs rounded-xl border border-border bg-[#05040d]"
          />
        ) : (
          <MirrorRoomCssFallback depth={depth} reduced={!!reduced} />
        )}
      </div>

      <p aria-live="polite" className="text-center text-sm font-medium text-foreground">
        {data.depthNote(depth, MAX)}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setDepth((d) => Math.min(MAX, d + 1))}
          disabled={depth >= MAX}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <LogIn aria-hidden="true" className="size-4" /> {data.stepIn}
        </button>
        <button
          type="button"
          onClick={() => setDepth((d) => Math.max(0, d - 1))}
          disabled={depth === 0}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <LogOut aria-hidden="true" className="size-4" /> {data.stepOut}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{data.prompt}</p>
    </div>
  );
}
