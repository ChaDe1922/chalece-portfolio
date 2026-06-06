"use client";

import dynamic from "next/dynamic";

// Code-split: three / rapier load only when this scene mounts (lab route only).
const PlatesPhysicsScene = dynamic(
  () =>
    import("@/components/lab/recursion/no-base-case-plates/plates-physics-scene").then(
      (m) => m.PlatesPhysicsScene,
    ),
  { ssr: false, loading: () => <div className="h-[300px] w-full" aria-hidden="true" /> },
);

/** Thin wrapper so the physics scene (three + rapier) is dynamically imported.
 *  Gating (WebGL / reduced-motion / onscreen) is handled by the slide. */
export function NoBaseCasePlates({
  count,
  phase,
}: {
  count: number;
  phase: "idle" | "running" | "crashed";
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <PlatesPhysicsScene count={count} phase={phase} />
    </div>
  );
}
