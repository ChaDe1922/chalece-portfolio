"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  LANES,
  RESOLVE,
  X_START,
  X_END,
  NODE_COUNT,
  FRAME_COUNT,
  PATHWAY_COUNT,
  CODE_COUNT,
  WAVEFORM_SEGMENTS,
  laneReveal,
} from "@/components/signal/signal-lanes";
import type { SignalStore } from "@/lib/signal-store";

type BuiltField = {
  root: THREE.Group;
  waveform: THREE.Line;
  nodes: THREE.Mesh[];
  frames: THREE.Mesh[];
  pathway: THREE.Mesh[];
  code: THREE.LineSegments;
  convergence: THREE.LineSegments;
  resolve: THREE.Mesh;
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

const lerp = THREE.MathUtils.lerp;
const laneX = (t: number) => X_START + (X_END - X_START) * t;

/** Build every THREE object once. Mutated imperatively in useFrame; never in
 *  the React render body. */
function buildSignalField(quality: "high" | "low"): BuiltField {
  const root = new THREE.Group();
  const disposables: BuiltField["disposables"] = [];
  const track = <T extends THREE.BufferGeometry | THREE.Material>(x: T): T => {
    disposables.push(x);
    return x;
  };

  const basic = (color: string, opacity = 1, bright = false) =>
    track(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: opacity < 1,
        opacity,
        toneMapped: !bright,
      }),
    );
  const lineMat = (color: string, opacity = 1) =>
    track(
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
      }),
    );

  // --- waveform (cyan) -----------------------------------------------------
  const wLane = LANES[0];
  const wGeo = track(new THREE.BufferGeometry());
  const wPos = new Float32Array((WAVEFORM_SEGMENTS + 1) * 3);
  for (let i = 0; i <= WAVEFORM_SEGMENTS; i++) {
    wPos[i * 3] = laneX(i / WAVEFORM_SEGMENTS);
    wPos[i * 3 + 1] = wLane.y;
    wPos[i * 3 + 2] = wLane.z;
  }
  wGeo.setAttribute("position", new THREE.BufferAttribute(wPos, 3));
  const waveform = new THREE.Line(wGeo, lineMat(wLane.color, 0.95));

  // --- data nodes (iris) ---------------------------------------------------
  const nLane = LANES[1];
  const nodeGeo = track(new THREE.SphereGeometry(0.075, 12, 12));
  const nodes: THREE.Mesh[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / (NODE_COUNT - 1);
    const bright = t > 0.72;
    const m = new THREE.Mesh(nodeGeo, basic(nLane.color, 1, bright));
    m.position.set(laneX(t), nLane.y + Math.sin(t * 7) * 0.14, nLane.z);
    m.scale.setScalar(0);
    nodes.push(m);
  }

  // --- film frames (gold) --------------------------------------------------
  const fLane = LANES[2];
  const frameGeo = track(new THREE.PlaneGeometry(0.28, 0.22));
  const frames: THREE.Mesh[] = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    const t = i / (FRAME_COUNT - 1);
    const m = new THREE.Mesh(frameGeo, basic(fLane.color, 0.55));
    m.position.set(laneX(t), fLane.y, fLane.z);
    m.scale.setScalar(0);
    frames.push(m);
  }

  // --- curriculum pathway (coral) -----------------------------------------
  const pLane = LANES[3];
  const pathGeo = track(new THREE.BoxGeometry(0.26, 0.2, 0.06));
  const pathway: THREE.Mesh[] = [];
  for (let i = 0; i < PATHWAY_COUNT; i++) {
    const t = i / (PATHWAY_COUNT - 1);
    const bright = t > 0.72;
    const m = new THREE.Mesh(pathGeo, basic(pLane.color, 0.9, bright));
    m.position.set(laneX(t), pLane.y, pLane.z);
    m.scale.setScalar(0);
    pathway.push(m);
  }

  // --- code tokens (soft fog) as dashes -----------------------------------
  const cLane = LANES[4];
  const codeGeo = track(new THREE.BufferGeometry());
  const codePos = new Float32Array(CODE_COUNT * 2 * 3);
  let cx = X_START + 0.2;
  for (let i = 0; i < CODE_COUNT; i++) {
    const w = 0.25 + ((i * 37) % 11) * 0.06; // pseudo-random widths, deterministic
    codePos[i * 6] = cx;
    codePos[i * 6 + 1] = cLane.y;
    codePos[i * 6 + 2] = cLane.z;
    codePos[i * 6 + 3] = cx + w;
    codePos[i * 6 + 4] = cLane.y;
    codePos[i * 6 + 5] = cLane.z;
    cx += w + 0.28;
  }
  codeGeo.setAttribute("position", new THREE.BufferAttribute(codePos, 3));
  const code = new THREE.LineSegments(codeGeo, lineMat(cLane.color, 0.5));

  // --- convergence lines (each lane -> resolve point) ----------------------
  const convGeo = track(new THREE.BufferGeometry());
  const convPos = new Float32Array(LANES.length * 2 * 3);
  LANES.forEach((lane, i) => {
    convPos[i * 6] = X_END;
    convPos[i * 6 + 1] = lane.y;
    convPos[i * 6 + 2] = lane.z;
    convPos[i * 6 + 3] = RESOLVE.x;
    convPos[i * 6 + 4] = RESOLVE.y;
    convPos[i * 6 + 5] = RESOLVE.z;
  });
  convGeo.setAttribute("position", new THREE.BufferAttribute(convPos, 3));
  const convergence = new THREE.LineSegments(convGeo, lineMat(RESOLVE.color, 0.25));

  // --- resolve node --------------------------------------------------------
  const resolveGeo = track(new THREE.SphereGeometry(0.12, 16, 16));
  const resolve = new THREE.Mesh(resolveGeo, basic(RESOLVE.color, 1, true));
  resolve.position.set(RESOLVE.x, RESOLVE.y, RESOLVE.z);
  resolve.scale.setScalar(0);

  root.add(waveform, code, convergence, resolve);
  nodes.forEach((m) => root.add(m));
  frames.forEach((m) => root.add(m));
  pathway.forEach((m) => root.add(m));

  // Low-quality tier trims the film frames (least legible layer) to cut fill.
  if (quality === "low") {
    frames.forEach((m) => (m.visible = false));
  }

  return {
    root,
    waveform,
    nodes,
    frames,
    pathway,
    code,
    convergence,
    resolve,
    disposables,
  };
}

function disposeField(field: BuiltField) {
  field.disposables.forEach((d) => d.dispose());
}

/** Ease + apply the store to the built objects. Runs entirely inside useFrame. */
function updateField(
  field: BuiltField,
  store: SignalStore,
  delta: number,
  interactive: boolean,
) {
  const dt = Math.min(delta, 0.05);
  store.time += dt;
  store.assemble = lerp(store.assemble, store.targetAssemble, 1 - Math.pow(0.02, dt));
  const a = store.assemble;
  const scroll = store.scroll;

  // Root: pointer parallax (eased) + scroll compression into a line + drift.
  const root = field.root;
  const targetRotY = interactive ? store.pointerX * 0.2 : 0;
  const targetRotX = interactive ? -store.pointerY * 0.14 : 0;
  root.rotation.y = lerp(root.rotation.y, targetRotY, 0.08);
  root.rotation.x = lerp(root.rotation.x, targetRotX, 0.08);
  root.scale.y = lerp(1, 0.05, scroll);
  root.position.y = Math.sin(store.time * 0.25) * 0.04 * (1 - scroll);

  // Waveform: live displacement + progressive draw-in.
  const wLane = LANES[0];
  const pos = field.waveform.geometry.attributes.position as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  const amp = 0.42 * a;
  const prox = interactive ? 1 + Math.abs(store.pointerY) * 0.6 : 1;
  for (let i = 0; i <= WAVEFORM_SEGMENTS; i++) {
    const x = arr[i * 3];
    arr[i * 3 + 1] =
      wLane.y + Math.sin(x * 1.6 + store.time * 1.6) * amp * prox;
  }
  pos.needsUpdate = true;
  field.waveform.geometry.setDrawRange(
    0,
    Math.max(2, Math.floor((WAVEFORM_SEGMENTS + 1) * Math.min(1, a * 1.1))),
  );

  // Staggered scale-in for the discrete lanes.
  applyReveal(field.nodes, a);
  applyReveal(field.frames, a);
  applyReveal(field.pathway, a);

  // Code + convergence draw-in.
  field.code.geometry.setDrawRange(0, Math.floor(CODE_COUNT * 2 * a));
  field.convergence.geometry.setDrawRange(0, Math.floor(LANES.length * 2 * a));
  (field.convergence.material as THREE.LineBasicMaterial).opacity =
    a * (0.2 + scroll * 0.55);

  // Resolve node ignites with assemble, then flares with scroll.
  field.resolve.scale.setScalar(laneReveal(a, 9, 10) * (1 + scroll * 0.9));
}

function applyReveal(items: THREE.Mesh[], assemble: number) {
  const n = items.length;
  for (let i = 0; i < n; i++) {
    items[i].scale.setScalar(laneReveal(assemble, i, n));
  }
}

/**
 * The animated hero signal field. One useFrame drives everything from the plain
 * store; the objects are built once in useMemo. `interactive` is false on the
 * low tier (mobile/coarse pointer) to drop parallax.
 */
export function SignalScene({
  store,
  quality,
  interactive,
}: {
  store: SignalStore;
  quality: "high" | "low";
  interactive: boolean;
}) {
  const field = React.useMemo(() => buildSignalField(quality), [quality]);

  React.useEffect(() => () => disposeField(field), [field]);

  useFrame((_, delta) => {
    updateField(field, store, delta, interactive);
  });

  return <primitive object={field.root} />;
}
