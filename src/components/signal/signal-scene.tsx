"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  LANES,
  NEUTRAL,
  RESOLVE_COLOR,
  NODE_COUNT,
  FRAME_COUNT,
  PATHWAY_COUNT,
  CODE_COUNT,
  WAVEFORM_SAMPLES,
  convergeFactor,
  laneAlpha,
  laneTint,
  resolveTint,
  laneYNorm,
  waveY,
  elementX,
  laneReveal,
  type Lane,
} from "@/components/signal/signal-lanes";
import type { SignalStore } from "@/lib/signal-store";

// Normalized -> WebGL space. Resolve point at (5, 0); art starts at x=-3.4
// (~17% from left) to leave a gutter for the DOM labels, matching the SVG.
const wx = (xn: number) => -3.4 + xn * 8.4;
const wy = (yn: number) => yn * 2.6;
const baseline = (lane: Lane, xn: number) => lane.center * (1 - convergeFactor(xn));

const NEUTRAL_C = new THREE.Color(NEUTRAL);
const RESOLVE_C = new THREE.Color(RESOLVE_COLOR);
const lerp = THREE.MathUtils.lerp;

/** Per-position tone: neutral -> accent -> iris across the width. */
function toneColor(lane: Lane, xn: number, out: THREE.Color): THREE.Color {
  out.copy(NEUTRAL_C).lerp(new THREE.Color(lane.color), laneTint(xn));
  out.lerp(RESOLVE_C, resolveTint(xn));
  return out;
}
/** Dim on the left (dark = dim on the obsidian bg), bright on the right. */
function dimTone(lane: Lane, xn: number, out: THREE.Color): THREE.Color {
  toneColor(lane, xn, out);
  return out.multiplyScalar(0.15 + 0.85 * laneAlpha(xn));
}

type MeshLane = { meshes: THREE.Mesh[]; xs: number[] };

type BuiltField = {
  root: THREE.Group;
  waveform: THREE.Line;
  waveBaseY: Float32Array;
  nodes: MeshLane;
  frames: MeshLane;
  pathway: MeshLane;
  code: THREE.LineSegments;
  convergence: THREE.LineSegments;
  resolve: THREE.Group;
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

function buildDiscrete(
  lane: Lane,
  count: number,
  makeGeo: () => THREE.BufferGeometry,
  disposables: BuiltField["disposables"],
  bright = false,
): MeshLane {
  const geo = makeGeo();
  disposables.push(geo);
  const c = new THREE.Color();
  const meshes: THREE.Mesh[] = [];
  const xs: number[] = [];
  for (let i = 0; i < count; i++) {
    const xn = elementX(i, count, lane.seed);
    xs.push(xn);
    dimTone(lane, xn, c);
    const mat = new THREE.MeshBasicMaterial({
      color: c.clone(),
      toneMapped: !(bright && xn > 0.72),
    });
    disposables.push(mat);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(wx(xn), wy(laneYNorm(lane, xn)), 0);
    m.scale.setScalar(0);
    meshes.push(m);
  }
  return { meshes, xs };
}

function buildSignalField(quality: "high" | "low"): BuiltField {
  const root = new THREE.Group();
  const disposables: BuiltField["disposables"] = [];
  const c = new THREE.Color();

  // --- waveform (Sound) as a vertex-colored line ---------------------------
  const wave = LANES[0];
  const wGeo = new THREE.BufferGeometry();
  const wPos = new Float32Array((WAVEFORM_SAMPLES + 1) * 3);
  const wCol = new Float32Array((WAVEFORM_SAMPLES + 1) * 3);
  const waveBaseY = new Float32Array(WAVEFORM_SAMPLES + 1);
  for (let i = 0; i <= WAVEFORM_SAMPLES; i++) {
    const xn = i / WAVEFORM_SAMPLES;
    const yn = baseline(wave, xn) + waveY(xn);
    waveBaseY[i] = wy(yn);
    wPos[i * 3] = wx(xn);
    wPos[i * 3 + 1] = wy(yn);
    dimTone(wave, xn, c);
    wCol[i * 3] = c.r;
    wCol[i * 3 + 1] = c.g;
    wCol[i * 3 + 2] = c.b;
  }
  wGeo.setAttribute("position", new THREE.BufferAttribute(wPos, 3));
  wGeo.setAttribute("color", new THREE.BufferAttribute(wCol, 3));
  const wMat = new THREE.LineBasicMaterial({ vertexColors: true });
  disposables.push(wGeo, wMat);
  const waveform = new THREE.Line(wGeo, wMat);

  // --- discrete lanes ------------------------------------------------------
  const nodes = buildDiscrete(
    LANES[1],
    NODE_COUNT,
    () => new THREE.SphereGeometry(0.09, 12, 12),
    disposables,
    true,
  );
  const frames = buildDiscrete(
    LANES[2],
    FRAME_COUNT,
    () => new THREE.PlaneGeometry(0.34, 0.24),
    disposables,
  );
  const pathway = buildDiscrete(
    LANES[3],
    PATHWAY_COUNT,
    () => new THREE.BoxGeometry(0.3, 0.22, 0.05),
    disposables,
    true,
  );

  // --- code tokens (dashes) as a vertex-colored line-segment set -----------
  const code = LANES[4];
  const codeGeo = new THREE.BufferGeometry();
  const codePos = new Float32Array(CODE_COUNT * 2 * 3);
  const codeCol = new Float32Array(CODE_COUNT * 2 * 3);
  for (let i = 0; i < CODE_COUNT; i++) {
    const xn = elementX(i, CODE_COUNT, code.seed);
    const y = wy(laneYNorm(code, xn));
    const w = 0.12 + xn * 0.4;
    dimTone(code, xn, c);
    const set = (o: number, xx: number) => {
      codePos[o] = xx;
      codePos[o + 1] = y;
      codePos[o + 2] = 0;
      codeCol[o] = c.r;
      codeCol[o + 1] = c.g;
      codeCol[o + 2] = c.b;
    };
    set(i * 6, wx(xn) - w);
    set(i * 6 + 3, wx(xn) + w);
  }
  codeGeo.setAttribute("position", new THREE.BufferAttribute(codePos, 3));
  codeGeo.setAttribute("color", new THREE.BufferAttribute(codeCol, 3));
  const codeMat = new THREE.LineBasicMaterial({ vertexColors: true });
  disposables.push(codeGeo, codeMat);
  const codeSeg = new THREE.LineSegments(codeGeo, codeMat);

  // --- convergence lines (each lane's right end -> resolve) ----------------
  const rightEnds: Array<[number, number]> = [
    [wx(0.9), waveBaseY[Math.round(WAVEFORM_SAMPLES * 0.9)]],
    [wx(nodes.xs[NODE_COUNT - 1]), wy(laneYNorm(LANES[1], nodes.xs[NODE_COUNT - 1]))],
    [wx(frames.xs[FRAME_COUNT - 1]), wy(laneYNorm(LANES[2], frames.xs[FRAME_COUNT - 1]))],
    [wx(pathway.xs[PATHWAY_COUNT - 1]), wy(laneYNorm(LANES[3], pathway.xs[PATHWAY_COUNT - 1]))],
    [wx(0.98), wy(laneYNorm(LANES[4], 0.98))],
  ];
  const convGeo = new THREE.BufferGeometry();
  const convPos = new Float32Array(rightEnds.length * 2 * 3);
  rightEnds.forEach(([x, y], i) => {
    convPos[i * 6] = x;
    convPos[i * 6 + 1] = y;
    convPos[i * 6 + 3] = 5;
    convPos[i * 6 + 4] = 0;
  });
  convGeo.setAttribute("position", new THREE.BufferAttribute(convPos, 3));
  const convMat = new THREE.LineBasicMaterial({
    color: RESOLVE_C.clone(),
    transparent: true,
    opacity: 0.5,
    toneMapped: false,
  });
  disposables.push(convGeo, convMat);
  const convergence = new THREE.LineSegments(convGeo, convMat);

  // --- resolve node (the glowing "skill" focal point) ----------------------
  const resolve = new THREE.Group();
  const coreGeo = new THREE.SphereGeometry(0.16, 20, 20);
  const coreMat = new THREE.MeshBasicMaterial({ color: RESOLVE_C.clone(), toneMapped: false });
  const haloGeo = new THREE.SphereGeometry(0.32, 20, 20);
  const haloMat = new THREE.MeshBasicMaterial({
    color: RESOLVE_C.clone(),
    transparent: true,
    opacity: 0.28,
    toneMapped: false,
  });
  disposables.push(coreGeo, coreMat, haloGeo, haloMat);
  const core = new THREE.Mesh(coreGeo, coreMat);
  const halo = new THREE.Mesh(haloGeo, haloMat);
  resolve.add(halo, core);
  resolve.position.set(5, 0, 0);
  resolve.scale.setScalar(0);

  root.add(waveform, codeSeg, convergence, resolve);
  nodes.meshes.forEach((m) => root.add(m));
  frames.meshes.forEach((m) => root.add(m));
  pathway.meshes.forEach((m) => root.add(m));
  if (quality === "low") frames.meshes.forEach((m) => (m.visible = false));

  return {
    root,
    waveform,
    waveBaseY,
    nodes,
    frames,
    pathway,
    code: codeSeg,
    convergence,
    resolve,
    disposables,
  };
}

function disposeField(field: BuiltField) {
  field.disposables.forEach((d) => d.dispose());
}

function revealMeshes(lane: MeshLane, assemble: number) {
  const n = lane.meshes.length;
  for (let i = 0; i < n; i++) lane.meshes[i].scale.setScalar(laneReveal(assemble, i, n));
}

function updateField(field: BuiltField, store: SignalStore, delta: number, interactive: boolean) {
  const dt = Math.min(delta, 0.05);
  store.time += dt;
  store.assemble = lerp(store.assemble, store.targetAssemble, 1 - Math.pow(0.02, dt));
  const a = store.assemble;
  const scroll = store.scroll;

  const root = field.root;
  const targetRotY = interactive ? store.pointerX * 0.22 : 0;
  const targetRotX = interactive ? -store.pointerY * 0.14 : 0;
  root.rotation.y = lerp(root.rotation.y, targetRotY, 0.08);
  root.rotation.x = lerp(root.rotation.x, targetRotX, 0.08);
  root.scale.y = lerp(1, 0.05, scroll);
  root.position.y = Math.sin(store.time * 0.25) * 0.04 * (1 - scroll);

  // Waveform: base shape + a gentle undulation on the aligned (right) portion.
  const pos = field.waveform.geometry.attributes.position as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  for (let i = 0; i <= WAVEFORM_SAMPLES; i++) {
    const xn = i / WAVEFORM_SAMPLES;
    const clean = Math.max(0, (xn - 0.3) / 0.7);
    arr[i * 3 + 1] =
      field.waveBaseY[i] + Math.sin(xn * 6.5 + store.time * 1.4) * 0.06 * clean * a;
  }
  pos.needsUpdate = true;
  field.waveform.geometry.setDrawRange(
    0,
    Math.max(2, Math.floor((WAVEFORM_SAMPLES + 1) * Math.min(1, a * 1.1))),
  );

  revealMeshes(field.nodes, a);
  revealMeshes(field.frames, a);
  revealMeshes(field.pathway, a);

  field.code.geometry.setDrawRange(0, Math.floor(CODE_COUNT * 2 * a));
  field.convergence.geometry.setDrawRange(0, Math.floor(field.convergence.geometry.attributes.position.count * a));
  (field.convergence.material as THREE.LineBasicMaterial).opacity = a * (0.4 + scroll * 0.5);

  field.resolve.scale.setScalar(laneReveal(a, 7, 8) * (1 + scroll * 1.1));
}

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
