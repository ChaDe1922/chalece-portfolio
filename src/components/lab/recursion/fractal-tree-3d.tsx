"use client";

import dynamic from "next/dynamic";

// Code-split: three / drei load only when this scene mounts (lab route only).
const TreeScene = dynamic(
  () => import("@/components/lab/recursion/fractal-tree-3d/tree-scene").then((m) => m.TreeScene),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="aspect-[4/3] w-full rounded-xl border border-border bg-gradient-to-b from-[#faf9f6] to-[#eee9f2] dark:from-[#0d1016] dark:to-[#161b22]"
      />
    ),
  },
);

/** Thin wrapper so three/drei are dynamically imported. Gating (WebGL /
 *  reduced-motion / onscreen) is handled by the controller. */
export function FractalTree3D(props: {
  depth: number;
  angle: number;
  ratio: number;
  lean: number;
  leaves: boolean;
  onCount: (n: number) => void;
}) {
  return <TreeScene {...props} />;
}
