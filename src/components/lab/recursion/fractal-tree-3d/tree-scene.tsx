"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

const MAX_BRANCHES = 2200;
const MAX_LEAVES = 1100;
const TARGET_H = 3.2; // tree is scaled to about this height, whatever the params

// Low-poly module-level singletons (Compiler-safe, never re-created).
const BRANCH_GEO = new THREE.CylinderGeometry(1, 1, 1, 6, 1);
const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.2, 0.28, 0.13, 0.78, 0, 1);
leafShape.bezierCurveTo(-0.13, 0.78, -0.2, 0.28, 0, 0);
const LEAF_GEO = new THREE.ShapeGeometry(leafShape, 8);

const Y = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);
const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};
const qAxis = (axis: THREE.Vector3, a: number) => new THREE.Quaternion().setFromAxisAngle(axis, a);

type Built = {
  branchM: THREE.Matrix4[];
  branchC: THREE.Color[];
  leafM: THREE.Matrix4[];
  leafC: THREE.Color[];
  count: number;
  fit: number;
};

function buildTree(depth: number, angle: number, ratio: number, lean: number, leaves: boolean): Built {
  const branchM: THREE.Matrix4[] = [];
  const branchC: THREE.Color[] = [];
  const leafM: THREE.Matrix4[] = [];
  const leafC: THREE.Color[] = [];
  const angleRad = (angle * Math.PI) / 180;
  const r = ratio / 100;
  const roll = 1.18; // roll the split plane each level so the tree is truly 3D
  const up = new THREE.Vector3();
  let maxY = 0.001;
  let leafIdx = 0;

  const rec = (pos: THREE.Vector3, quat: THREE.Quaternion, len: number, rad: number, d: number) => {
    up.set(0, 1, 0).applyQuaternion(quat);
    const end = pos.clone().addScaledVector(up, len);
    const mid = pos.clone().addScaledVector(up, len * 0.5);
    if (end.y > maxY) maxY = end.y;

    const m = new THREE.Matrix4().compose(mid, quat.clone(), new THREE.Vector3(rad, len, rad));
    branchM.push(m);
    const t = depth > 0 ? d / depth : 0;
    branchC.push(
      new THREE.Color().setHSL(
        (25 + t * 80) / 360,
        (62 - t * 14) / 100,
        (34 + t * 16) / 100,
        THREE.SRGBColorSpace,
      ),
    );

    if (d >= depth || len < 0.012) {
      if (leaves) {
        const i = leafIdx++;
        const lq = quat
          .clone()
          .multiply(qAxis(Y, hash(i) * Math.PI * 2))
          .multiply(qAxis(X, 0.5 + hash(i + 7) * 0.5));
        const size = 0.26 + hash(i + 3) * 0.12;
        leafM.push(new THREE.Matrix4().compose(end, lq, new THREE.Vector3(size, size, size)));
        leafC.push(
          new THREE.Color().setHSL(
            (95 + hash(i + 1) * 35) / 360,
            0.55,
            0.4 + hash(i + 5) * 0.12,
            THREE.SRGBColorSpace,
          ),
        );
      }
      return;
    }
    const base = quat.clone().multiply(qAxis(Y, roll));
    rec(end, base.clone().multiply(qAxis(X, angleRad)), len * r, rad * 0.72, d + 1);
    rec(end, base.clone().multiply(qAxis(X, -angleRad)), len * r, rad * 0.72, d + 1);
  };

  rec(new THREE.Vector3(0, 0, 0), qAxis(Z, (lean * Math.PI) / 180), 1, 0.05, 0);
  return { branchM, branchC, leafM, leafC, count: branchM.length, fit: TARGET_H / maxY };
}

function TreeInstances({
  depth,
  angle,
  ratio,
  lean,
  leaves,
  onCount,
}: {
  depth: number;
  angle: number;
  ratio: number;
  lean: number;
  leaves: boolean;
  onCount: (n: number) => void;
}) {
  const branchRef = React.useRef<THREE.InstancedMesh>(null);
  const leafRef = React.useRef<THREE.InstancedMesh>(null);
  const groupRef = React.useRef<THREE.Group>(null);
  const uniforms = React.useRef({ uTime: { value: 0 } });

  // Branch + leaf materials (memoized; leaves get a wind sway in the shader).
  const branchMat = React.useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
    [],
  );
  const leafMat = React.useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      roughness: 0.55,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.current.uTime;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float ph = instanceMatrix[3].x * 1.7 + instanceMatrix[3].z * 1.3;
           float h = max(position.y, 0.0);
           transformed.x += sin(uTime * 1.6 + ph) * 0.16 * h;
           transformed.z += cos(uTime * 1.25 + ph) * 0.11 * h;`,
        );
    };
    return m;
  }, []);

  const built = React.useMemo(
    () => buildTree(depth, angle, ratio, lean, leaves),
    [depth, angle, ratio, lean, leaves],
  );

  React.useLayoutEffect(() => {
    const bm = branchRef.current;
    if (bm) {
      built.branchM.forEach((m, i) => {
        bm.setMatrixAt(i, m);
        bm.setColorAt(i, built.branchC[i]);
      });
      bm.count = built.branchM.length;
      bm.instanceMatrix.needsUpdate = true;
      if (bm.instanceColor) bm.instanceColor.needsUpdate = true;
    }
    const lm = leafRef.current;
    if (lm) {
      built.leafM.forEach((m, i) => {
        lm.setMatrixAt(i, m);
        lm.setColorAt(i, built.leafC[i]);
      });
      lm.count = built.leafM.length;
      lm.instanceMatrix.needsUpdate = true;
      if (lm.instanceColor) lm.instanceColor.needsUpdate = true;
    }
    if (groupRef.current) groupRef.current.scale.setScalar(built.fit);
    onCount(built.count);
  }, [built, onCount]);

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={groupRef}>
      {/* frustumCulled off: when the instance count changes (e.g. leaves toggled
          0 <-> N) the cached bounding sphere goes stale and the mesh can be
          culled at some camera angles, making leaves flicker in and out. */}
      <instancedMesh ref={branchRef} args={[BRANCH_GEO, branchMat, MAX_BRANCHES]} frustumCulled={false} />
      <instancedMesh ref={leafRef} args={[LEAF_GEO, leafMat, MAX_LEAVES]} frustumCulled={false} />
    </group>
  );
}

/** Slide 5 payoff, 3D: a recursive tree you can orbit, with leaf-shaped foliage
 *  that sways in a breeze. Decorative aria-hidden canvas; the controls, count
 *  readout, and 2D fallback carry the meaning. Transparent over a themed CSS
 *  gradient. */
export function TreeScene(props: {
  depth: number;
  angle: number;
  ratio: number;
  lean: number;
  leaves: boolean;
  onCount: (n: number) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-[#faf9f6] to-[#eee9f2] shadow-sm dark:from-[#0d1016] dark:to-[#161b22]"
    >
      <Canvas dpr={[1, 1.5]} gl={{ powerPreference: "low-power", antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.8, 6.0]} fov={45} near={0.1} far={50} />
        <OrbitControls
          makeDefault
          target={[0, 1.5, 0]}
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={9}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI * 0.52}
        />
        <hemisphereLight args={["#fff6e8", "#3a3326", 0.7]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 6, 4]} intensity={1.2} color="#fff4e6" />
        <TreeInstances {...props} />
      </Canvas>
    </div>
  );
}
