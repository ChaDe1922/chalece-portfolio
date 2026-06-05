"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

// depth 0 = at the entrance; each step dollies one ring spacing (1.5) deeper.
function targetZ(depth: number): number {
  return 5 - depth * 1.5;
}

/** Lerps the camera toward the target depth each frame, driving the demand
 *  loop via invalidate() until it settles, then idles. */
export function MirrorTunnelCamera({ depth }: { depth: number }) {
  const invalidate = useThree((s) => s.invalidate);

  // Wake the demand loop whenever the target depth changes.
  React.useEffect(() => {
    invalidate();
  }, [depth, invalidate]);

  useFrame(({ camera }) => {
    const target = targetZ(depth);
    if (Math.abs(camera.position.z - target) < 0.001) return;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, target, 0.08);
    invalidate();
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={55} near={0.1} far={30} />;
}
