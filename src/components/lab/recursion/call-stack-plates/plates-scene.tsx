"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const MAX = 6; // covers countdown(5) down to countdown(0)
const GAP = 0.32;
const MID = ((MAX - 1) * GAP) / 2;
const BOTTOM_Y = -MID;

// Module-level singletons (Compiler-safe, never re-created).
const PLATE_GEO = new THREE.CylinderGeometry(0.4, 0.44, 0.18, 44);
const FRAME_MAT = new THREE.MeshStandardMaterial({ color: "#6d5ae6", roughness: 0.5, metalness: 0.05 });
const BASE_MAT = new THREE.MeshStandardMaterial({ color: "#16a766", roughness: 0.5, metalness: 0.05 });

type RefArr = React.RefObject<THREE.Mesh | null>[];

const lerp = THREE.MathUtils.lerp;

/** Non-rendering: lerps each plate's presence (scale) and stack height from the
 *  active `stack`. A plate for value k drops in when called and lifts off when
 *  it returns. Invalidates while animating, then idles (demand loop). */
function PlatesAnimator({ stack, plateRefs }: { stack: number[]; plateRefs: RefArr }) {
  const invalidate = useThree((s) => s.invalidate);
  const st = React.useRef(Array.from({ length: MAX }, () => ({ presentT: 0 })));
  const lastIdx = React.useRef(Array.from({ length: MAX }, () => 0));

  React.useEffect(() => {
    invalidate();
  }, [stack, invalidate]);

  useFrame(() => {
    let busy = false;
    for (let k = 0; k < MAX; k++) {
      const idx = stack.indexOf(k);
      const present = idx >= 0;
      if (present) lastIdx.current[k] = idx;
      const s = st.current[k];
      const target = present ? 1 : 0;
      s.presentT = lerp(s.presentT, target, 0.16);
      if (Math.abs(s.presentT - target) > 0.001) busy = true;

      const mesh = plateRefs[k].current;
      if (mesh) {
        const yBase = BOTTOM_Y + lastIdx.current[k] * GAP;
        // Off-slot (entering or leaving) sits a little higher, so it drops in
        // on a call and lifts off on a return.
        mesh.position.y = yBase + (1 - s.presentT) * 0.55;
        const sc = Math.max(0.0001, s.presentT);
        mesh.scale.set(sc, sc, sc);
        mesh.visible = s.presentT > 0.01;
      }
    }
    if (busy) invalidate();
  });

  return null;
}

/** Decorative 3D plates beside the call stack (aria-hidden; the DOM frame list
 *  carries the meaning). Transparent canvas so it blends on the card in light
 *  and dark. Demand frameloop so the GPU idles between steps. */
export function PlatesScene({ stack }: { stack: number[] }) {
  const plateRefs = React.useRef<RefArr>(
    Array.from({ length: MAX }, () => React.createRef<THREE.Mesh | null>()),
  ).current;

  return (
    <div aria-hidden="true" className="h-[300px] w-full">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: true, alpha: true }}
      >
        {/* Pulled back and tilted down so disc tops read and the full plate
            width fits the narrow column, still aimed at the stack center. */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0.8, 5.2]}
          rotation={[-0.153, 0, 0]}
          fov={30}
          near={0.1}
          far={20}
        />
        <ambientLight intensity={0.75} color="#fff6ee" />
        <directionalLight position={[2, 4, 3]} intensity={1.1} color="#fff4e6" />
        {Array.from({ length: MAX }, (_, k) => (
          <mesh
            key={k}
            ref={plateRefs[k]}
            geometry={PLATE_GEO}
            material={k === 0 ? BASE_MAT : FRAME_MAT}
            visible={false}
          />
        ))}
        <PlatesAnimator stack={stack} plateRefs={plateRefs} />
      </Canvas>
    </div>
  );
}
