import { cn } from "@/lib/utils";

/**
 * Static, server-rendered signal field for the hero. Five signal layers
 * (waveform, data nodes, film frames, curriculum pathway, code tokens) drawn as
 * discrete <g data-layer> groups that read as separate signals on the left and
 * resolve toward a single point on the right, echoing "from signal to skill".
 *
 * This is decorative (aria-hidden): the H1 carries the meaning. It is also the
 * complete reduced-motion / JS-disabled state. A later increment can mount a
 * <canvas> sibling over this identical structure without changing the DOM
 * contract or the semantic order around it (no WebGL).
 */
export function StaticSignalField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 480"
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", className)}
    >
      {/* Faint measurement grid */}
      <g data-layer="grid" stroke="var(--v2-soft-fog)" opacity="0.14">
        {[80, 160, 240, 320, 400].map((y) => (
          <line key={y} x1="24" y1={y} x2="616" y2={y} strokeWidth="1" />
        ))}
        <line x1="470" y1="40" x2="470" y2="440" strokeWidth="1" strokeDasharray="3 6" />
      </g>

      {/* Convergence lines: each lane funnels toward one resolve point */}
      <g data-layer="resolve" stroke="var(--v2-iris)" opacity="0.25" fill="none">
        {[80, 160, 240, 320, 400].map((y) => (
          <path key={y} d={`M470 ${y} L616 240`} strokeWidth="1" />
        ))}
        <circle cx="616" cy="240" r="4" fill="var(--v2-iris)" opacity="0.9" stroke="none" />
      </g>

      {/* Lane labels (decorative, laboratory feel) */}
      <g
        data-layer="labels"
        fill="var(--v2-soft-fog)"
        opacity="0.55"
        fontSize="9"
        fontFamily="var(--font-geist-mono), monospace"
        letterSpacing="1.5"
      >
        <text x="24" y="70">AUDIO</text>
        <text x="24" y="150">SYSTEM</text>
        <text x="24" y="230">MOTION</text>
        <text x="24" y="310">CURRICULUM</text>
        <text x="24" y="390">CODE</text>
      </g>

      {/* 1. waveform (sound) */}
      <g data-layer="waveform" fill="none" stroke="var(--v2-cyan)" strokeWidth="2">
        <path d="M24 80 Q54 44 84 80 T144 80 T204 80 T264 80 T324 80 T384 80 T444 80 T504 80 T564 80" opacity="0.9" />
      </g>

      {/* 2. data nodes (systems) */}
      <g data-layer="nodes" stroke="var(--v2-iris)">
        <polyline
          points="40,168 96,150 152,176 208,158 264,168 320,160 376,164 432,160 488,162 544,160"
          fill="none"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {[40, 96, 152, 208, 264, 320, 376, 432, 488, 544].map((x, i) => {
          const ys = [168, 150, 176, 158, 168, 160, 164, 160, 162, 160];
          return (
            <circle
              key={x}
              cx={x}
              cy={ys[i]}
              r={x > 470 ? 5 : 3.5}
              fill={x > 470 ? "var(--v2-iris)" : "var(--v2-signal-black)"}
              stroke="var(--v2-iris)"
              strokeWidth="1.5"
            />
          );
        })}
      </g>

      {/* 3. film-frame rhythm (motion / video) */}
      <g data-layer="frames" fill="none" stroke="var(--v2-gold)" strokeWidth="1.5" opacity="0.85">
        {[40, 92, 144, 196, 248, 300, 352, 404, 456, 508, 560].map((x) => (
          <rect key={x} x={x} y="226" width="34" height="28" rx="3" />
        ))}
        {[40, 92, 144, 196, 248, 300, 352, 404, 456, 508, 560].map((x) => (
          <line key={`p-${x}`} x1={x + 17} y1="226" x2={x + 17} y2="254" strokeWidth="0.75" opacity="0.5" />
        ))}
      </g>

      {/* 4. curriculum pathway (structure) */}
      <g data-layer="pathway" stroke="var(--v2-coral)">
        <polyline
          points="48,320 120,320 192,320 264,320 336,320 408,320 480,320 552,320"
          fill="none"
          strokeWidth="1.5"
          opacity="0.5"
        />
        {[48, 120, 192, 264, 336, 408, 480, 552].map((x) => (
          <rect
            key={x}
            x={x - 14}
            y="308"
            width="28"
            height="24"
            rx="4"
            fill={x > 470 ? "var(--v2-coral)" : "var(--v2-signal-black)"}
            stroke="var(--v2-coral)"
            strokeWidth="1.5"
            opacity="0.9"
          />
        ))}
      </g>

      {/* 5. code tokens (raw signal) */}
      <g data-layer="code-track" stroke="var(--v2-soft-fog)" strokeWidth="4" strokeLinecap="round">
        {[
          [40, 34],
          [84, 20],
          [116, 48],
          [176, 26],
          [214, 40],
          [266, 18],
          [296, 52],
          [360, 30],
          [402, 22],
          [436, 44],
          [492, 28],
          [532, 36],
        ].map(([x, w]) => (
          <line key={x} x1={x} y1="400" x2={x + w} y2="400" opacity="0.5" />
        ))}
      </g>
    </svg>
  );
}
