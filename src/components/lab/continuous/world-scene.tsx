"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const START_Z = 8;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

type Built = {
  root: THREE.Group;
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

/** Build the connective world once: concentric station "portals" receding into
 *  the fog, plus a drifting particle field between them. Nothing animates here;
 *  the camera flies through it (demand loop). */
function buildWorld(stationZ: number[]): Built {
  const root = new THREE.Group();
  const disposables: Built["disposables"] = [];
  const ringGeo = new THREE.TorusGeometry(2.2, 0.05, 8, 80);
  disposables.push(ringGeo);
  const cyan = new THREE.Color("#66dff2");
  const iris = new THREE.Color("#8e75ff");

  stationZ.forEach((z, i) => {
    const t = stationZ.length > 1 ? i / (stationZ.length - 1) : 0;
    const mat = new THREE.MeshBasicMaterial({
      color: cyan.clone().lerp(iris, t),
      toneMapped: false,
      transparent: true,
      opacity: 0.9,
    });
    disposables.push(mat);
    // A small cluster of concentric rings per station reads as a portal.
    for (let r = 0; r < 3; r++) {
      const m = new THREE.Mesh(ringGeo, mat);
      m.position.set(0, 0, z - r * 0.35);
      m.scale.setScalar(1 - r * 0.14);
      root.add(m);
    }
  });

  // Connective particle field between the first and last station.
  const N = 700;
  const pos = new Float32Array(N * 3);
  const zStart = stationZ[0] + 6;
  const zEnd = stationZ[stationZ.length - 1] - 6;
  for (let i = 0; i < N; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 1.5 + Math.random() * 6;
    pos[i * 3] = Math.cos(ang) * rad;
    pos[i * 3 + 1] = Math.sin(ang) * rad;
    pos[i * 3 + 2] = zStart + Math.random() * (zEnd - zStart);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({
    color: "#8e75ff",
    size: 0.05,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  disposables.push(pGeo, pMat);
  root.add(new THREE.Points(pGeo, pMat));

  return { root, disposables };
}

/**
 * The continuous-world scene: the camera flies straight down -z through the
 * station portals as scroll progress advances. Demand frameloop, so the GPU
 * idles whenever the scroll (and the settle lerp) stops. Decorative
 * (aria-hidden on the canvas host); the DOM captions carry the meaning.
 */
export function WorldScene({
  progressRef,
  registerInvalidate,
  stationZ,
}: {
  progressRef: React.RefObject<number>;
  registerInvalidate: (fn: () => void) => void;
  stationZ: number[];
}) {
  const invalidate = useThree((s) => s.invalidate);
  React.useEffect(() => {
    registerInvalidate(invalidate);
    invalidate();
  }, [registerInvalidate, invalidate]);

  const world = React.useMemo(() => buildWorld(stationZ), [stationZ]);
  React.useEffect(
    () => () => world.disposables.forEach((d) => d.dispose()),
    [world],
  );

  const endZ = stationZ[stationZ.length - 1] - 6;
  useFrame((state) => {
    const cam = state.camera;
    const target = THREE.MathUtils.lerp(START_Z, endZ, clamp01(progressRef.current));
    if (Math.abs(cam.position.z - target) > 0.002) {
      cam.position.z = THREE.MathUtils.lerp(cam.position.z, target, 0.1);
      invalidate();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, START_Z]} fov={60} near={0.1} far={80} />
      <primitive object={world.root} />
    </>
  );
}
