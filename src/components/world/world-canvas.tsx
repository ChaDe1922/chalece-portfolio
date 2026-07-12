"use client";
"use no memo";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { WorldScene } from "./world-scene";
import type { WorldStore } from "@/lib/world-store";

/**
 * The persistent world canvas: a fixed, transparent 3D layer behind the content
 * that shows the distant wave rooms (visible through the cinematic sections;
 * ivory sections paint over it). Demand frameloop so the GPU idles between
 * scroll moves. Dynamically imported (ssr:false) so three never ships in the
 * initial route bundle.
 */
export function WorldCanvas({
  store,
  registerInvalidate,
  quality,
}: {
  store: WorldStore;
  registerInvalidate: (fn: () => void) => void;
  quality: "high" | "low";
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      gl={{ powerPreference: "low-power", antialias: false, alpha: true }}
    >
      <fogExp2 attach="fog" args={["#09090d", 0.05]} />
      <WorldScene store={store} registerInvalidate={registerInvalidate} />
      {quality === "high" ? (
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.3} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
