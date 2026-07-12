"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { SIGNAL_CYAN, SIGNAL_IRIS } from "@/components/signal/hero-morph";
import type { WorldStore } from "@/lib/world-store";

// A living 3D wave terrain the camera flies through: a floor and ceiling of
// animated wave-lines receding into the fog. The waves flow over time (alive);
// the camera dollies forward as the approach scroll advances.
const START_Z = 16;
const END_Z = -64;
const ROW_STEP = 1.8;
const FLOOR_ROWS = 64;
const CEIL_ROWS = 44;
const SAMPLES = 56;
const HALF_W = 30;
const FLOOR_Y = -5.5;
const CEIL_Y = 7.5;
const AMP = 1.35;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth01 = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;

/** Flowing wave height at (x, z) and time t. */
function waveY(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.35 + t * 1.05) * 0.6 +
    Math.sin(z * 0.5 + t * 0.8) * 0.5 +
    Math.sin((x * 0.2 - z * 0.26) + t * 1.5) * 0.5
  );
}

type Row = {
  attr: THREE.BufferAttribute;
  xs: Float32Array;
  z: number;
  baseY: number;
  dir: number; // +1 floor (waves up), -1 ceiling (waves down)
};

type BuiltWorld = {
  root: THREE.Group;
  rows: Row[];
  mats: THREE.LineBasicMaterial[];
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

function buildWorld(): BuiltWorld {
  const root = new THREE.Group();
  const disposables: BuiltWorld["disposables"] = [];
  const rows: Row[] = [];
  const mats: THREE.LineBasicMaterial[] = [];
  const cyan = new THREE.Color(SIGNAL_CYAN);
  const iris = new THREE.Color(SIGNAL_IRIS);

  const addBand = (count: number, baseY: number, dir: number, faint: number) => {
    for (let r = 0; r < count; r++) {
      const z = START_Z - r * ROW_STEP;
      const xs = new Float32Array(SAMPLES + 1);
      const pos = new Float32Array((SAMPLES + 1) * 3);
      for (let s = 0; s <= SAMPLES; s++) {
        const x = (s / SAMPLES - 0.5) * HALF_W * 2;
        xs[s] = x;
        pos[s * 3] = x;
        pos[s * 3 + 1] = baseY;
        pos[s * 3 + 2] = z;
      }
      const geo = new THREE.BufferGeometry();
      const attr = new THREE.BufferAttribute(pos, 3);
      geo.setAttribute("position", attr);
      // Colour shifts cyan (far) -> iris (near) across the band.
      const mat = new THREE.LineBasicMaterial({
        color: cyan.clone().lerp(iris, 1 - r / count),
        transparent: true,
        opacity: 0,
        toneMapped: false,
      });
      mat.userData.faint = faint;
      disposables.push(geo, mat);
      mats.push(mat);
      rows.push({ attr, xs, z, baseY, dir });
      root.add(new THREE.Line(geo, mat));
    }
  };

  addBand(FLOOR_ROWS, FLOOR_Y, 1, 0.6);
  addBand(CEIL_ROWS, CEIL_Y, -1, 0.32);

  return { root, rows, mats, disposables };
}

function updateWorld(
  w: BuiltWorld,
  store: WorldStore,
  camera: THREE.Camera,
  delta: number,
) {
  store.time += Math.min(delta, 0.05);
  const t = store.time;
  const p = clamp01(store.worldProgress);
  const fade = smooth01(0.03, 0.22, p);

  // Animate the wave bands (alive).
  for (const row of w.rows) {
    const arr = row.attr.array as Float32Array;
    for (let s = 0; s <= SAMPLES; s++) {
      arr[s * 3 + 1] = row.baseY + row.dir * AMP * waveY(row.xs[s], row.z, t);
    }
    row.attr.needsUpdate = true;
  }
  for (const m of w.mats) m.opacity = fade * (m.userData.faint as number);

  // Fly forward through the terrain as the approach advances.
  camera.position.z = lerp(START_Z, END_Z, ease(p));
  camera.position.y = 1.2;
}

/**
 * The living world scene. The wave bands flow continuously (frameloop=always,
 * gated to mount only near the work run), and the camera flies forward through
 * them as the approach scroll advances. Decorative (aria-hidden host).
 */
export function WorldScene({ store }: { store: WorldStore }) {
  const world = React.useMemo(() => buildWorld(), []);
  React.useEffect(
    () => () => world.disposables.forEach((d) => d.dispose()),
    [world],
  );

  useFrame((state, delta) => updateWorld(world, store, state.camera, delta));

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, START_Z]} fov={62} near={0.1} far={90} />
      <primitive object={world.root} />
    </>
  );
}
