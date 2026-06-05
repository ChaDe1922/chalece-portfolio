"use client";
"use no memo";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

// depth 0 = at the entrance; each step dollies one ring spacing (1.5) deeper.
function targetZ(depth: number): number {
  return 5 - depth * 1.5;
}

/** Each frame: dolly the camera toward the target depth, and add a slow idle
 *  sway so the tunnel feels alive and parallaxes gently even between steps.
 *  Only runs when motion is allowed (the reduced-motion path uses the CSS
 *  fallback instead, so this never animates under reduced motion). */
export function MirrorTunnelCamera({ depth }: { depth: number }) {
  useFrame((state) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetZ(depth), 0.08);
    // Gentle, slow idle parallax (a few tenths of a unit, ~18 to 22s period).
    cam.position.x = Math.sin(t * 0.35) * 0.2;
    cam.position.y = Math.cos(t * 0.28) * 0.15;
    cam.lookAt(0, 0, -100);
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={55} near={0.1} far={30} />;
}
