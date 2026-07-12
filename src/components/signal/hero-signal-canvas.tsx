"use client";
"use no memo";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { HeroWavefield } from "@/components/world/hero-wavefield";
import type { SignalStore } from "@/lib/signal-store";

/**
 * The single WebGL canvas for the whole site (hero only). Transparent (alpha)
 * so the obsidian page shows through; obsidian fog fades distant lanes for
 * depth. Bloom only on the high-quality tier. Dynamically imported (ssr:false)
 * by the signal-field wrapper so three never ships in the initial route bundle.
 * The static SVG stays mounted underneath as the instant fallback.
 */
export function HeroSignalCanvas({
  store,
  quality,
  onReady,
  onContextLost,
}: {
  store: SignalStore;
  quality: "high" | "low";
  onReady: () => void;
  onContextLost: () => void;
}) {
  return (
    <Canvas
      frameloop="always"
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      gl={{ powerPreference: "low-power", antialias: false, alpha: true }}
      camera={{ position: [0, 0, 13.5], fov: 42, near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost();
          },
          { once: true },
        );
        requestAnimationFrame(() => onReady());
      }}
    >
      <fogExp2 attach="fog" args={["#09090d", 0.02]} />
      <HeroWavefield store={store} />
      {quality === "high" ? (
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
