"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { SIGNAL_CYAN, SIGNAL_IRIS } from "@/components/signal/hero-morph";
import type { WorldStore } from "@/lib/world-store";

// The camera starts far down the corridor and dollies into the wave room as the
// approach scroll advances.
const FAR_Z = 26;
const NEAR_Z = 9;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth01 = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;

type BuiltWorld = {
  root: THREE.Group;
  lineMats: THREE.LineBasicMaterial[];
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

/** A "wave room": a back wall of horizontal wave-lines you dolly toward, flanked
 *  by side streaks that stream past, with a glowing core. Static composition;
 *  the camera provides the motion. Colours cyan -> iris. */
function buildWorld(): BuiltWorld {
  const root = new THREE.Group();
  const disposables: BuiltWorld["disposables"] = [];
  const lineMats: THREE.LineBasicMaterial[] = [];
  const cyan = new THREE.Color(SIGNAL_CYAN);
  const iris = new THREE.Color(SIGNAL_IRIS);

  const addLine = (pos: Float32Array, tint: number) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: cyan.clone().lerp(iris, tint),
      transparent: true,
      opacity: 0,
      toneMapped: false,
    });
    disposables.push(geo, mat);
    lineMats.push(mat);
    root.add(new THREE.Line(geo, mat));
  };

  // Back wall of waves at z = 0.
  const WALL_LINES = 22;
  const SAMPLES = 120;
  const W = 20;
  const H = 14;
  for (let i = 0; i < WALL_LINES; i++) {
    const y = (i / (WALL_LINES - 1) - 0.5) * H;
    const pos = new Float32Array((SAMPLES + 1) * 3);
    for (let s = 0; s <= SAMPLES; s++) {
      const xn = s / SAMPLES;
      const wave = 0.35 * Math.sin(xn * 18 + i * 1.3) + 0.18 * Math.sin(xn * 33 - i * 0.7);
      pos[s * 3] = (xn - 0.5) * W;
      pos[s * 3 + 1] = y + wave;
      pos[s * 3 + 2] = 0;
    }
    addLine(pos, i / (WALL_LINES - 1));
  }

  // Side streaks running along z, streaming past as the camera advances.
  const STREAKS = 7;
  const N = 64;
  for (const side of [-1, 1]) {
    for (let i = 0; i < STREAKS; i++) {
      const baseY = (i / (STREAKS - 1) - 0.5) * H * 0.9;
      const baseX = side * (W * 0.5 + 1 + i * 0.35);
      const pos = new Float32Array((N + 1) * 3);
      for (let s = 0; s <= N; s++) {
        const zn = s / N;
        pos[s * 3] = baseX + 0.4 * Math.sin(zn * 14 + i * 1.1);
        pos[s * 3 + 1] = baseY + 0.3 * Math.sin(zn * 9 + i);
        pos[s * 3 + 2] = FAR_Z - 2 - zn * (FAR_Z + 0);
      }
      addLine(pos, i / (STREAKS - 1));
    }
  }

  return { root, lineMats, disposables };
}

function updateWorld(
  w: BuiltWorld,
  store: WorldStore,
  camera: THREE.Camera,
  invalidate: () => void,
) {
  const p = clamp01(store.worldProgress);
  // Fade in as the approach begins (so it never clashes with the hero above).
  const fade = smooth01(0.04, 0.2, p);
  for (const m of w.lineMats) m.opacity = fade * 0.6;

  const target = lerp(FAR_Z, NEAR_Z, ease(p));
  if (Math.abs(camera.position.z - target) > 0.003) {
    camera.position.z = lerp(camera.position.z, target, 0.1);
    invalidate();
  }
}

/**
 * The persistent world scene. As the approach scroll advances (store.world
 * progress), the camera dollies from far down the corridor into the wave room.
 * Demand frameloop: the GPU idles when the scroll (and settle lerp) stops.
 * Decorative (aria-hidden host); the DOM sections carry the meaning.
 */
export function WorldScene({
  store,
  registerInvalidate,
}: {
  store: WorldStore;
  registerInvalidate: (fn: () => void) => void;
}) {
  const invalidate = useThree((s) => s.invalidate);
  React.useEffect(() => {
    registerInvalidate(invalidate);
    invalidate();
  }, [registerInvalidate, invalidate]);

  const world = React.useMemo(() => buildWorld(), []);
  React.useEffect(
    () => () => world.disposables.forEach((d) => d.dispose()),
    [world],
  );

  useFrame((state) => updateWorld(world, store, state.camera, invalidate));

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, FAR_Z]} fov={50} near={0.1} far={60} />
      <primitive object={world.root} />
    </>
  );
}
