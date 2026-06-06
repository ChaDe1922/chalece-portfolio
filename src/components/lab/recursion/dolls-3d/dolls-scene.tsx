"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { DollMesh, DOLL_MATS, TOTAL } from "./doll-mesh";
import { DollsLighting } from "./dolls-lighting";

type Highlight = "base" | "recursive" | null;

const TARGET_SCALES = [1.5, 1.2, 0.96, 0.77, 0.62];
const X_POSITIONS: [number, number, number][] = [
  [-2.4, -0.5, 0],
  [-1.25, -0.5, 0],
  [-0.15, -0.5, 0],
  [0.8, -0.5, 0],
  [1.55, -0.5, 0],
];
// Lift is in each doll's local space (inside the already-scaled group), so the
// lid rises just clear of the body rather than flying off. The lid is set down
// to the LEFT, rotated counter-clockwise so its wide opening faces RIGHT, back
// toward the cup and the next doll emerging into the row.
const LIFT = 0.62;
const ASIDE = 0.42;
const ROT = 1.0;
const BASE_Y = -0.5;
const BASE_COLOR = new THREE.Color("#16a766");
const REC_COLOR = new THREE.Color("#e8924a");
const OFF = new THREE.Color("#000000");

type RefArr = React.RefObject<THREE.Group | null>[];

/** Non-rendering: owns the per-frame lerp + emissive logic, mutating the doll
 *  refs and materials directly. Invalidates while animating or highlighting,
 *  then idles (demand loop). */
function DollsAnimator({
  revealed,
  highlight,
  demoTrigger,
  outerRefs,
  topRefs,
}: {
  revealed: number;
  highlight: Highlight;
  demoTrigger: number;
  outerRefs: RefArr;
  topRefs: RefArr;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const st = React.useRef(Array.from({ length: TOTAL }, () => ({ openT: 0, scaleT: 0, posT: 0 })));
  const lastDemo = React.useRef(demoTrigger);
  const demo = React.useRef({ active: false, idx: 0, dwell: 0 });

  React.useEffect(() => {
    invalidate();
  }, [revealed, highlight, demoTrigger, invalidate]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (demoTrigger !== lastDemo.current) {
      lastDemo.current = demoTrigger;
      demo.current = { active: true, idx: Math.min(TOTAL - 2, Math.max(0, revealed - 1)), dwell: 0 };
    }

    let busy = false;
    const pulse = Math.sin(t * 4) * 0.5 + 0.5;

    for (let i = 0; i < TOTAL; i++) {
      const s = st.current[i];
      const scaleTarget = i < revealed ? 1 : 0;
      const posTarget = scaleTarget; // emerge from the parent into the slot
      let openTarget = revealed > i + 1 && i < TOTAL - 1 ? 1 : 0;
      if (demo.current.active && i === demo.current.idx && i < TOTAL - 1) openTarget = 1;

      s.scaleT = THREE.MathUtils.lerp(s.scaleT, scaleTarget, 0.14);
      s.posT = THREE.MathUtils.lerp(s.posT, posTarget, 0.13);
      s.openT = THREE.MathUtils.lerp(s.openT, openTarget, 0.1);
      if (
        Math.abs(s.scaleT - scaleTarget) > 0.001 ||
        Math.abs(s.posT - posTarget) > 0.001 ||
        Math.abs(s.openT - openTarget) > 0.001
      ) {
        busy = true;
      }

      const outer = outerRefs[i].current;
      const top = topRefs[i].current;
      if (outer) {
        outer.scale.setScalar(TARGET_SCALES[i] * s.scaleT);
        // Slide from the previous doll's slot into this doll's slot.
        const parentX = X_POSITIONS[Math.max(0, i - 1)][0];
        outer.position.x = THREE.MathUtils.lerp(parentX, X_POSITIONS[i][0], s.posT);
        outer.position.y = BASE_Y - (1 - s.posT) * 0.2; // rise out as it settles
      }
      if (top) {
        top.position.y = s.openT * LIFT;
        top.position.x = s.openT * -ASIDE; // lid is set down to the left
        top.rotation.z = s.openT * ROT; // rotated so its opening faces right
      }

      // Emissive: highlight pulses, plus a steady base glow once fully opened.
      const m = DOLL_MATS[i];
      if (highlight === "base" && i === TOTAL - 1) {
        m.emissive.copy(BASE_COLOR);
        m.emissiveIntensity = pulse * 0.7;
      } else if (highlight === "recursive" && i < TOTAL - 1) {
        m.emissive.copy(REC_COLOR);
        m.emissiveIntensity = pulse * 0.35;
      } else if (i === TOTAL - 1 && revealed >= TOTAL) {
        m.emissive.copy(BASE_COLOR);
        m.emissiveIntensity = 0.45;
      } else {
        m.emissive.copy(OFF);
        m.emissiveIntensity = 0;
      }
    }

    if (demo.current.active) {
      const lead = st.current[demo.current.idx];
      if (Math.abs(lead.openT - 1) < 0.02) {
        demo.current.dwell += 1;
        if (demo.current.dwell > 18) demo.current.active = false;
      }
      busy = true;
    }

    if (busy || highlight !== null) invalidate();
  });

  return null;
}

/** The 3D matryoshka stage. Decorative (aria-hidden); the buttons + aria-live
 *  narration in the wrapper carry the meaning. */
export function DollsScene({
  revealed,
  highlight,
  demoTrigger,
}: {
  revealed: number;
  highlight: Highlight;
  demoTrigger: number;
}) {
  const outerRefs = React.useRef<RefArr>(
    Array.from({ length: TOTAL }, () => React.createRef<THREE.Group | null>()),
  ).current;
  const topRefs = React.useRef<RefArr>(
    Array.from({ length: TOTAL }, () => React.createRef<THREE.Group | null>()),
  ).current;

  return (
    <div
      aria-hidden="true"
      className="mx-auto aspect-[21/9] w-full max-w-xl overflow-hidden rounded-xl border border-border bg-[#1a1310]"
    >
      <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ powerPreference: "low-power", antialias: false }}>
        <color attach="background" args={["#1a1310"]} />
        <PerspectiveCamera makeDefault position={[0, 0.1, 5.2]} fov={42} near={0.1} far={20} />
        <DollsLighting />
        {X_POSITIONS.map((p, i) => (
          <DollMesh key={i} index={i} outerRef={outerRefs[i]} topRef={topRefs[i]} position={p} />
        ))}
        <DollsAnimator
          revealed={revealed}
          highlight={highlight}
          demoTrigger={demoTrigger}
          outerRefs={outerRefs}
          topRefs={topRefs}
        />
      </Canvas>
    </div>
  );
}
