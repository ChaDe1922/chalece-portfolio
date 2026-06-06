"use client";
"use no memo";

import { useTheme } from "next-themes";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { MirrorTunnelCamera } from "./mirror-tunnel-camera";
import { MirrorTunnelRings } from "./mirror-tunnel-rings";

/** The 3D infinity-mirror tunnel. Decorative (aria-hidden); the depth readout
 *  and Step buttons in the wrapper carry the meaning. Demand frameloop so the
 *  GPU idles between steps; dynamically imported so three never ships to other
 *  routes. */
export function MirrorTunnelScene({ depth }: { depth: number }) {
  const { resolvedTheme } = useTheme();
  const bg = resolvedTheme === "light" ? "#eef0f6" : "#05040d";
  return (
    <div
      aria-hidden="true"
      className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-border bg-[#eef0f6] dark:bg-[#05040d]"
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: false }}
      >
        <color attach="background" args={[bg]} />
        <fogExp2 attach="fog" args={[bg, 0.09]} />
        <MirrorTunnelCamera depth={depth} />
        <MirrorTunnelRings />
        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.3} luminanceSmoothing={0.25} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
