"use client";
"use no memo";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { WorldScene } from "./world-scene";
import type { WorldStore } from "@/lib/world-store";

/**
 * The persistent world canvas: a fixed, transparent 3D layer behind the content
 * showing the living wave terrain the camera flies through. frameloop=always so
 * the waves stay alive; the layer only mounts it near the work run. Dynamically
 * imported (ssr:false) so three never ships in the initial route bundle.
 */
export function WorldCanvas({
  store,
  quality,
}: {
  store: WorldStore;
  quality: "high" | "low";
}) {
  return (
    <Canvas
      frameloop="always"
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      gl={{ powerPreference: "low-power", antialias: false, alpha: true }}
    >
      <fogExp2 attach="fog" args={["#09090d", 0.028]} />
      <WorldScene store={store} />
      {quality === "high" ? (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.3} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
