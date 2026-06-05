"use client";

import * as THREE from "three";

// Module-level singletons: created once, shared across all rings, never
// mutated. Safe from React Compiler (no hooks) and from re-renders. This file
// only ever loads client-side (the scene is imported via next/dynamic ssr:false).
const RING_GEO = new THREE.TorusGeometry(1.8, 0.04, 8, 64);
const RING_MAT = new THREE.MeshStandardMaterial({
  color: "#1a0f3a",
  emissive: "#6d5ae6", // brand --primary violet
  emissiveIntensity: 1.8,
  roughness: 0.4,
  metalness: 0.1,
});

// 12 rings receding into the fog.
const Z_POSITIONS = Array.from({ length: 12 }, (_, i) => -i * 1.5);

/** A soft additive halo at the vanishing point, drawn from a runtime canvas
 *  (no asset file). */
function makeGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(160,143,255,0.9)");
  g.addColorStop(1, "rgba(160,143,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
const GLOW_TEX = makeGlowTexture();

/** The static tunnel: glowing concentric frames plus a vanishing-point glow.
 *  Nothing animates here; the camera moves. */
export function MirrorTunnelRings() {
  return (
    <>
      {Z_POSITIONS.map((z, i) => (
        <mesh key={i} geometry={RING_GEO} material={RING_MAT} position={[0, 0, z]} />
      ))}
      <sprite position={[0, 0, -20]} scale={[3, 3, 1]}>
        <spriteMaterial
          map={GLOW_TEX ?? undefined}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </sprite>
    </>
  );
}
