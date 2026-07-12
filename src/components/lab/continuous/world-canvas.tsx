"use client";
"use no memo";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { WorldScene } from "./world-scene";

/**
 * The single WebGL canvas for the continuous-world prototype. Demand frameloop
 * so the GPU idles between scroll movements; dynamically imported (ssr:false) so
 * three never ships to other routes. Decorative; the DOM captions carry meaning.
 */
export function WorldCanvas({
  progressRef,
  registerInvalidate,
  stationZ,
}: {
  progressRef: React.RefObject<number>;
  registerInvalidate: (fn: () => void) => void;
  stationZ: number[];
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      gl={{ powerPreference: "low-power", antialias: false }}
    >
      <color attach="background" args={["#05040d"]} />
      <fogExp2 attach="fog" args={["#05040d", 0.035]} />
      <WorldScene
        progressRef={progressRef}
        registerInvalidate={registerInvalidate}
        stationZ={stationZ}
      />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.25} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
