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
  laneAlpha,
  laneTint,
  resolveTint,
  convergeAt,
  phasedAssemble,
  mergeFactor,
  mergedPathAlpha,
  waveY,
  elementX,
  laneReveal,
  type Lane,
} from "@/components/signal/signal-lanes";
import { INTRO_DURATION, type SignalStore } from "@/lib/signal-store";

// Normalized -> WebGL space. Resolve point at (5, 0); art starts at x=-3.5
// (~16% from left) so each lane begins right next to its DOM label.
const wx = (xn: number) => -3.5 + xn * 8.5;
// Scale chosen so a lane's centre projects to `50 - center*LANE_VSPAN` at the
// settled camera (z=10, fov 42, half-height ~3.839), matching labels + SVG.
const wy = (yn: number) => yn * 2.96;

const NEUTRAL_C = new THREE.Color(NEUTRAL);
const RESOLVE_C = new THREE.Color(RESOLVE_COLOR);
const lerp = THREE.MathUtils.lerp;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Neutral -> accent -> iris tone (full brightness; faintness comes from
 *  material opacity, matching the SVG's clean look rather than dark ghosts). */
function toneColor(lane: Lane, xn: number, out: THREE.Color): THREE.Color {
  out.copy(NEUTRAL_C).lerp(new THREE.Color(lane.color), laneTint(xn));
  out.lerp(RESOLVE_C, resolveTint(xn));
  return out;
}
/** For vertex-colored lines (no per-vertex alpha): keep a floor so the raw left
 *  reads as faint, never a hard black smear. */
function dimVertex(lane: Lane, xn: number, out: THREE.Color): THREE.Color {
  toneColor(lane, xn, out);
  return out.multiplyScalar(0.42 + 0.58 * laneAlpha(xn));
}

type Lane3D = { lane: Lane; items: THREE.Object3D[]; xs: number[] };

type BuiltField = {
  root: THREE.Group;
  waveform: THREE.Line;
  nodes: Lane3D;
  frames: Lane3D;
  pathway: Lane3D;
  code: THREE.LineSegments;
  mergedPath: THREE.Line;
  resolve: THREE.Group;
  burstRing: THREE.Mesh;
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

/** Filled elements (nodes, curriculum blocks): faint on the left via opacity. */
function buildFilled(
  lane: Lane,
  count: number,
  makeGeo: () => THREE.BufferGeometry,
  disposables: BuiltField["disposables"],
  bright = false,
): Lane3D {
  const geo = makeGeo();
  disposables.push(geo);
  const c = new THREE.Color();
  const items: THREE.Object3D[] = [];
  const xs: number[] = [];
  for (let i = 0; i < count; i++) {
    const xn = elementX(i, count, lane.seed);
    xs.push(xn);
    const mat = new THREE.MeshBasicMaterial({
      color: toneColor(lane, xn, c).clone(),
      transparent: true,
      opacity: laneAlpha(xn),
      depthWrite: false,
      // Additive over the dark field: faint elements read as a faint glow, never
      // a dark "shadow" box.
      blending: THREE.AdditiveBlending,
      toneMapped: !(bright && xn > 0.72),
    });
    disposables.push(mat);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(wx(xn), wy(lane.center), 0);
    m.scale.setScalar(0);
    items.push(m);
  }
  return { lane, items, xs };
}

/** Outline elements (film frames): rect outlines, faint on the left, matching
 *  the SVG's stroke-only frames (never filled ghost blocks). */
function buildOutlines(
  lane: Lane,
  count: number,
  w: number,
  h: number,
  disposables: BuiltField["disposables"],
): Lane3D {
  const plane = new THREE.PlaneGeometry(w, h);
  const edges = new THREE.EdgesGeometry(plane);
  plane.dispose();
  disposables.push(edges);
  const c = new THREE.Color();
  const items: THREE.Object3D[] = [];
  const xs: number[] = [];
  for (let i = 0; i < count; i++) {
    const xn = elementX(i, count, lane.seed);
    xs.push(xn);
    const mat = new THREE.LineBasicMaterial({
      color: toneColor(lane, xn, c).clone(),
      transparent: true,
      opacity: laneAlpha(xn),
      blending: THREE.AdditiveBlending,
    });
    disposables.push(mat);
    const o = new THREE.LineSegments(edges, mat);
    o.position.set(wx(xn), wy(lane.center), 0);
    o.scale.setScalar(0);
    items.push(o);
  }
  return { lane, items, xs };
}

function buildSignalField(quality: "high" | "low"): BuiltField {
  const root = new THREE.Group();
  const disposables: BuiltField["disposables"] = [];
  const c = new THREE.Color();

  // waveform (Sound)
  const wave = LANES[0];
  const wGeo = new THREE.BufferGeometry();
  const wPos = new Float32Array((WAVEFORM_SAMPLES + 1) * 3);
  const wCol = new Float32Array((WAVEFORM_SAMPLES + 1) * 3);
  for (let i = 0; i <= WAVEFORM_SAMPLES; i++) {
    const xn = i / WAVEFORM_SAMPLES;
    wPos[i * 3] = wx(xn);
    wPos[i * 3 + 1] = wy(wave.center + waveY(xn));
    dimVertex(wave, xn, c);
    wCol[i * 3] = c.r;
    wCol[i * 3 + 1] = c.g;
    wCol[i * 3 + 2] = c.b;
  }
  wGeo.setAttribute("position", new THREE.BufferAttribute(wPos, 3));
  wGeo.setAttribute("color", new THREE.BufferAttribute(wCol, 3));
  const wMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1 });
  disposables.push(wGeo, wMat);
  const waveform = new THREE.Line(wGeo, wMat);

  const nodes = buildFilled(LANES[1], NODE_COUNT, () => new THREE.SphereGeometry(0.09, 12, 12), disposables, true);
  const frames = buildOutlines(LANES[2], FRAME_COUNT, 0.34, 0.24, disposables);
  const pathway = buildFilled(LANES[3], PATHWAY_COUNT, () => new THREE.PlaneGeometry(0.3, 0.22), disposables, true);

  // code tokens (dashes)
  const code = LANES[4];
  const codeGeo = new THREE.BufferGeometry();
  const codePos = new Float32Array(CODE_COUNT * 2 * 3);
  const codeCol = new Float32Array(CODE_COUNT * 2 * 3);
  for (let i = 0; i < CODE_COUNT; i++) {
    const xn = elementX(i, CODE_COUNT, code.seed);
    const y = wy(code.center);
    const w = 0.12 + xn * 0.4;
    dimVertex(code, xn, c);
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
  const codeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1 });
  disposables.push(codeGeo, codeMat);
  const codeSeg = new THREE.LineSegments(codeGeo, codeMat);

  // the single merged path (fades in as the lanes collapse to centre)
  const mpGeo = new THREE.BufferGeometry();
  mpGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([wx(0), 0, 0, 5, 0, 0]), 3),
  );
  const mpMat = new THREE.LineBasicMaterial({
    color: RESOLVE_C.clone(),
    transparent: true,
    opacity: 0,
    toneMapped: false,
  });
  disposables.push(mpGeo, mpMat);
  const mergedPath = new THREE.Line(mpGeo, mpMat);

  // resolve node (the glowing "skill" focal point) - no radiating lines
  const resolve = new THREE.Group();
  const coreGeo = new THREE.SphereGeometry(0.16, 20, 20);
  const coreMat = new THREE.MeshBasicMaterial({ color: RESOLVE_C.clone(), toneMapped: false });
  const haloGeo = new THREE.SphereGeometry(0.34, 20, 20);
  const haloMat = new THREE.MeshBasicMaterial({
    color: RESOLVE_C.clone(),
    transparent: true,
    opacity: 0.3,
    toneMapped: false,
    depthWrite: false,
  });
  disposables.push(coreGeo, coreMat, haloGeo, haloMat);
  resolve.add(new THREE.Mesh(haloGeo, haloMat), new THREE.Mesh(coreGeo, coreMat));
  resolve.position.set(5, 0, 0);
  resolve.scale.setScalar(0);

  // Burst ring: fires outward when the Skill node fills (see updateField).
  const ringGeo = new THREE.RingGeometry(0.8, 1.0, 40);
  const ringMat = new THREE.MeshBasicMaterial({
    color: RESOLVE_C.clone(),
    transparent: true,
    opacity: 0,
    toneMapped: false,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  disposables.push(ringGeo, ringMat);
  const burstRing = new THREE.Mesh(ringGeo, ringMat);
  burstRing.position.set(5, 0, 0);
  burstRing.scale.setScalar(0.3);

  root.add(waveform, codeSeg, mergedPath, resolve, burstRing);
  nodes.items.forEach((m) => root.add(m));
  frames.items.forEach((m) => root.add(m));
  pathway.items.forEach((m) => root.add(m));
  if (quality === "low") frames.items.forEach((m) => (m.visible = false));

  return { root, waveform, nodes, frames, pathway, code: codeSeg, mergedPath, resolve, burstRing, disposables };
}

function disposeField(field: BuiltField) {
  field.disposables.forEach((d) => d.dispose());
}

function updateLane(l: Lane3D, assemble: number, scroll: number) {
  const la = phasedAssemble(assemble, l.lane.phase);
  const fade = 1 - mergeFactor(scroll);
  const n = l.items.length;
  for (let i = 0; i < n; i++) {
    const xn = l.xs[i];
    const item = l.items[i] as THREE.Mesh;
    item.position.y = wy(l.lane.center * (1 - convergeAt(xn, scroll)));
    // Scale is draw-in only; the merge dissolves elements via opacity so they
    // fade out cleanly instead of collapsing into shrinking dark boxes.
    item.scale.setScalar(laneReveal(la, i, n));
    (item.material as THREE.Material).opacity = laneAlpha(xn) * fade;
  }
}

function updateField(
  field: BuiltField,
  store: SignalStore,
  delta: number,
  interactive: boolean,
  camera: THREE.Camera,
) {
  const dt = Math.min(delta, 0.05);
  store.time += dt;
  store.introElapsed += dt;
  const a = easeOutCubic(clamp01(store.introElapsed / INTRO_DURATION));
  store.assemble = a;
  const scroll = store.scroll;
  const fade = 1 - mergeFactor(scroll);

  const dolly = easeOutCubic(clamp01(store.introElapsed / 4.0));
  camera.position.z = lerp(13.5, 10, dolly) + Math.sin(store.time * 0.3) * 0.12 * dolly;

  const root = field.root;
  // Only pointer parallax rotates the field; no idle vertical drift, so each
  // lane stays locked level with its label.
  root.rotation.y = lerp(root.rotation.y, interactive ? store.pointerX * 0.2 : 0, 0.06);
  root.rotation.x = lerp(root.rotation.x, interactive ? -store.pointerY * 0.12 : 0, 0.06);

  // Waveform: bend to centre + flatten as it merges; fade out into the path.
  const wave = LANES[0];
  const pos = field.waveform.geometry.attributes.position as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  for (let i = 0; i <= WAVEFORM_SAMPLES; i++) {
    const xn = i / WAVEFORM_SAMPLES;
    const conv = convergeAt(xn, scroll);
    const clean = Math.max(0, (xn - 0.3) / 0.7);
    const w = (waveY(xn) + Math.sin(xn * 6.5 + store.time * 1.4) * 0.06 * clean * a) * (1 - conv);
    arr[i * 3 + 1] = wy(wave.center * (1 - conv) + w);
  }
  pos.needsUpdate = true;
  field.waveform.geometry.setDrawRange(0, Math.max(2, Math.floor((WAVEFORM_SAMPLES + 1) * Math.min(1, a * 1.1))));
  (field.waveform.material as THREE.LineBasicMaterial).opacity = fade;

  updateLane(field.nodes, a, scroll);
  updateLane(field.frames, a, scroll);
  updateLane(field.pathway, a, scroll);

  // Code: bend to centre + fade.
  const code = LANES[4];
  const cpos = field.code.geometry.attributes.position as THREE.BufferAttribute;
  const carr = cpos.array as Float32Array;
  for (let i = 0; i < CODE_COUNT; i++) {
    const xn = elementX(i, CODE_COUNT, code.seed);
    const y = wy(code.center * (1 - convergeAt(xn, scroll)));
    carr[i * 6 + 1] = y;
    carr[i * 6 + 4] = y;
  }
  cpos.needsUpdate = true;
  field.code.geometry.setDrawRange(0, Math.floor(CODE_COUNT * 2 * phasedAssemble(a, code.phase)));
  (field.code.material as THREE.LineBasicMaterial).opacity = fade;

  // The single merged path fades in as the lanes dissolve into it.
  (field.mergedPath.material as THREE.LineBasicMaterial).opacity = mergedPathAlpha(scroll) * a;

  // Burst: a one-shot pop + expanding ring when the Skill node fills (merge
  // completes). Re-arms if the visitor scrolls back up.
  if (store.burstT < 0 && scroll > 0.92) store.burstT = 0;
  if (scroll < 0.5) store.burstT = -1;
  const ringMat = field.burstRing.material as THREE.MeshBasicMaterial;
  let pop = 1;
  if (store.burstT >= 0) {
    store.burstT += dt;
    const b = clamp01(store.burstT / 0.7);
    field.burstRing.scale.setScalar(0.3 + b * 3.4);
    ringMat.opacity = (1 - b) * 0.85;
    pop = 1 + Math.sin(clamp01(store.burstT / 0.32) * Math.PI) * 0.5;
    if (b >= 1) {
      field.burstRing.scale.setScalar(0.3);
      ringMat.opacity = 0;
    }
  } else {
    ringMat.opacity = 0;
  }

  // Resolve node ignites with assemble, flares with scroll, pops on burst.
  field.resolve.scale.setScalar(laneReveal(a, 7, 8) * (1 + scroll * 1.3) * pop);
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
  useFrame((state, delta) => {
    updateField(field, store, delta, interactive, state.camera);
  });
  return <primitive object={field.root} />;
}
