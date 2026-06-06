"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CylinderCollider } from "@react-three/rapier";

const PLATE_R = 0.62;
const PLATE_H = 0.26;
// Module-level singletons (Compiler-safe, never re-created).
const PLATE_GEO = new THREE.CylinderGeometry(PLATE_R, PLATE_R, PLATE_H, 32);
const PLATE_MAT = new THREE.MeshStandardMaterial({ color: "#6d5ae6", roughness: 0.5, metalness: 0.05 });

// Stable pseudo-random in [-0.5,0.5] from an index (no Math.random, so the
// build is repeatable across renders for the same plate).
const wob = (i: number, salt: number) => (((i * 1103515245 + salt * 12345) % 1000) / 1000 - 0.5);

/** One plate dropped onto the pile. The lean grows with height (quadratic) so
 *  the tower builds, then leans past its base and topples, like calls piling up
 *  with no base case to stop them. */
function Plate({ i }: { i: number }) {
  const x = i * 0.04 + i * i * 0.006 + wob(i, 7) * 0.05;
  const z = wob(i, 31) * 0.05;
  const y = i * (PLATE_H + 0.005) + 0.34; // spawn just above its slot, drop in
  const rot = wob(i, 13) * 0.06;
  return (
    <RigidBody
      colliders={false}
      position={[x, y, z]}
      rotation={[rot, 0, rot * 0.5]}
      friction={0.55}
      restitution={0.05}
      linearDamping={0.04}
      angularDamping={0.05}
    >
      <CylinderCollider args={[PLATE_H / 2, PLATE_R]} />
      <mesh geometry={PLATE_GEO} material={PLATE_MAT} />
    </RigidBody>
  );
}

/** Physics plate tower for the no-base-case slide: plates drop in fast as the
 *  calls pile up, then topple and crash (real Rapier rigid bodies). Decorative
 *  (aria-hidden); the DOM stack + traceback carry the meaning. Transparent
 *  canvas so it blends on the card. Pauses the sim once it settles. */
export function PlatesPhysicsScene({
  count,
  phase,
}: {
  count: number;
  phase: "idle" | "running" | "crashed";
}) {
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (phase !== "crashed") {
      setPaused(false);
      return;
    }
    const t = setTimeout(() => setPaused(true), 4000); // idle after the dust settles
    return () => clearTimeout(t);
  }, [phase]);

  const plates = Array.from({ length: count }, (_, i) => i);

  return (
    <div aria-hidden="true" className="h-[340px] w-full">
      <Canvas
        frameloop={paused ? "demand" : "always"}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[1.3, 2.0, 8.7]} rotation={[-0.19, 0, 0]} fov={42} near={0.1} far={40} />
        <ambientLight intensity={0.7} color="#fff6ee" />
        <directionalLight position={[3, 6, 4]} intensity={1.1} color="#fff4e6" />
        <Physics gravity={[0, -12, 0]} paused={paused}>
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[8, 0.1, 8]} position={[0, -0.1, 0]} />
          </RigidBody>
          {plates.map((i) => (
            <Plate key={i} i={i} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
}
