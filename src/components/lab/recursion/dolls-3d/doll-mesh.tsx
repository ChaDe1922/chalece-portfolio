"use client";

import * as React from "react";
import * as THREE from "three";

export const TOTAL = 5;
export const DOLL_COLORS = ["#d8412f", "#e8924a", "#6d5ae6", "#3aa6a0", "#16a766"];

// Matryoshka silhouette as a lathe profile (radius x, height y), unit height.
const v = (x: number, y: number) => new THREE.Vector2(x, y);
const BOTTOM_PTS = [v(0.001, -0.5), v(0.22, -0.49), v(0.3, -0.4), v(0.33, -0.18), v(0.28, 0)];
const TOP_PTS = [
  v(0.28, 0),
  v(0.26, 0.1),
  v(0.2, 0.22),
  v(0.15, 0.3),
  v(0.18, 0.36),
  v(0.22, 0.42),
  v(0.2, 0.46),
  v(0.1, 0.5),
  v(0.001, 0.5),
];

function halves(segments: number) {
  return {
    bottom: new THREE.LatheGeometry(BOTTOM_PTS, segments),
    top: new THREE.LatheGeometry(TOP_PTS, segments),
  };
}
// Module-level singletons (Compiler-safe, never re-created).
const GEO = { large: halves(32), medium: halves(24), small: halves(20) } as const;
type SizeClass = keyof typeof GEO;
const SIZE_CLASS: SizeClass[] = ["large", "medium", "medium", "small", "small"];

/** Per-doll painted-wood materials. The animator mutates `.emissive` for the
 *  base glow and the highlight pulses. */
export const DOLL_MATS = DOLL_COLORS.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.72, metalness: 0 }),
);

// One shared face, drawn once to a canvas texture.
function makeFaceTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const s = 128;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  // cheeks
  ctx.fillStyle = "rgba(225,120,120,0.5)";
  ctx.beginPath();
  ctx.arc(40, 80, 9, 0, Math.PI * 2);
  ctx.arc(88, 80, 9, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  ctx.fillStyle = "#2a2530";
  ctx.beginPath();
  ctx.ellipse(48, 58, 5, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(80, 58, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // smile
  ctx.strokeStyle = "#b5495a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(64, 78, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  return new THREE.CanvasTexture(c);
}
const FACE_TEX = makeFaceTexture();
const FACE_GEO = new THREE.PlaneGeometry(1, 1);
const FACE_MAT = new THREE.MeshBasicMaterial({
  map: FACE_TEX ?? undefined,
  transparent: true,
  depthWrite: false,
});

/** One doll: a static bottom half and a liftable top group (which carries the
 *  face). The animator mutates `outerRef` (reveal scale) and `topRef` (open
 *  lift) directly each frame, so this is a pure render with no per-frame React. */
export function DollMesh({
  index,
  outerRef,
  topRef,
  position,
}: {
  index: number;
  outerRef: React.RefObject<THREE.Group | null>;
  topRef: React.RefObject<THREE.Group | null>;
  position: [number, number, number];
}) {
  const g = GEO[SIZE_CLASS[index]];
  const mat = DOLL_MATS[index];
  return (
    <group ref={outerRef} position={position} scale={0}>
      <mesh geometry={g.bottom} material={mat} />
      <group ref={topRef}>
        <mesh geometry={g.top} material={mat} />
        <mesh geometry={FACE_GEO} material={FACE_MAT} position={[0, 0.38, 0.2]} scale={[0.26, 0.16, 1]} />
      </group>
    </group>
  );
}
