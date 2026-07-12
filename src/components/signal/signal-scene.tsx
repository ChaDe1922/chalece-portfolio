"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  SAMPLE_COUNT,
  FOCAL_X,
  FOCAL_Y,
  SIGNAL_IRIS,
  SKILL_CORE,
  morphPoint,
  brightness,
  colorAt,
  type Pt,
} from "@/components/signal/hero-morph";
import { INTRO_DURATION, type SignalStore } from "@/lib/signal-store";

// Normalized -> WebGL space. The form spans the box; the skill node sits at
// FOCAL_X (right of centre). Scale chosen to sit comfortably at the settled
// camera (z=10, fov 42).
const wx = (xn: number) => -4.0 + xn * 8.0;
const wy = (yn: number) => yn * 2.6;

const lerp = THREE.MathUtils.lerp;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type BuiltMorph = {
  root: THREE.Group;
  line: THREE.Line;
  resolve: THREE.Group;
  haloMat: THREE.MeshBasicMaterial;
  burstRing: THREE.Mesh;
  baseColor: THREE.Color;
  disposables: Array<THREE.BufferGeometry | THREE.Material>;
};

function buildMorphField(quality: "high" | "low"): BuiltMorph {
  const root = new THREE.Group();
  const disposables: BuiltMorph["disposables"] = [];
  const seg = quality === "high" ? 20 : 12;

  // The single signal line (one polyline that morphs waveform->...->skill).
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(SAMPLE_COUNT * 3);
  const col = new Float32Array(SAMPLE_COUNT * 3);
  const scratch: Pt = { x: 0, y: 0 };
  const base = new THREE.Color(colorAt(0));
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const u = i / (SAMPLE_COUNT - 1);
    morphPoint(0, u, 0, scratch);
    pos[i * 3] = wx(scratch.x);
    pos[i * 3 + 1] = wy(scratch.y);
    pos[i * 3 + 2] = 0;
    const b = brightness(u);
    col[i * 3] = base.r * b;
    col[i * 3 + 1] = base.g * b;
    col[i * 3 + 2] = base.b * b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 1,
    toneMapped: false,
  });
  disposables.push(geo, mat);
  const line = new THREE.Line(geo, mat);

  // Resolve node (the glowing "skill" focal point): halo + core + spark.
  const resolve = new THREE.Group();
  const irisC = new THREE.Color(SIGNAL_IRIS);
  const haloGeo = new THREE.SphereGeometry(0.36, seg, seg);
  const haloMat = new THREE.MeshBasicMaterial({
    color: irisC.clone(),
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    toneMapped: false,
  });
  const coreGeo = new THREE.SphereGeometry(0.16, seg, seg);
  const coreMat = new THREE.MeshBasicMaterial({ color: irisC.clone(), toneMapped: false });
  const sparkGeo = new THREE.SphereGeometry(0.07, seg, seg);
  const sparkMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(SKILL_CORE),
    toneMapped: false,
  });
  disposables.push(haloGeo, haloMat, coreGeo, coreMat, sparkGeo, sparkMat);
  resolve.add(
    new THREE.Mesh(haloGeo, haloMat),
    new THREE.Mesh(coreGeo, coreMat),
    new THREE.Mesh(sparkGeo, sparkMat),
  );
  resolve.position.set(wx(FOCAL_X), wy(FOCAL_Y), 0);
  resolve.scale.setScalar(0);

  // Burst ring: fires outward when the skill node ignites (see updateMorph).
  const ringGeo = new THREE.RingGeometry(0.8, 1.0, 40);
  const ringMat = new THREE.MeshBasicMaterial({
    color: irisC.clone(),
    transparent: true,
    opacity: 0,
    toneMapped: false,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  disposables.push(ringGeo, ringMat);
  const burstRing = new THREE.Mesh(ringGeo, ringMat);
  burstRing.position.set(wx(FOCAL_X), wy(FOCAL_Y), 0);
  burstRing.scale.setScalar(0.3);

  root.add(line, resolve, burstRing);
  return { root, line, resolve, haloMat, burstRing, baseColor: new THREE.Color(), disposables };
}

function disposeField(field: BuiltMorph) {
  field.disposables.forEach((d) => d.dispose());
}

const scratch: Pt = { x: 0, y: 0 };

function updateMorph(
  field: BuiltMorph,
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

  const dolly = easeOutCubic(clamp01(store.introElapsed / 4.0));
  camera.position.z = lerp(13.5, 10, dolly) + Math.sin(store.time * 0.3) * 0.12 * dolly;

  const root = field.root;
  // Only pointer parallax rotates the form; no idle drift.
  root.rotation.y = lerp(root.rotation.y, interactive ? store.pointerX * 0.18 : 0, 0.06);
  root.rotation.x = lerp(root.rotation.x, interactive ? -store.pointerY * 0.1 : 0, 0.06);

  // Morph the single line + recolour per frame (cyan raw -> iris skill).
  const posAttr = field.line.geometry.attributes.position as THREE.BufferAttribute;
  const colAttr = field.line.geometry.attributes.color as THREE.BufferAttribute;
  const parr = posAttr.array as Float32Array;
  const carr = colAttr.array as Float32Array;
  const br = field.baseColor.set(colorAt(scroll));
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const u = i / (SAMPLE_COUNT - 1);
    morphPoint(scroll, u, store.time, scratch);
    parr[i * 3] = wx(scratch.x);
    parr[i * 3 + 1] = wy(scratch.y);
    parr[i * 3 + 2] = 0;
    const b = brightness(u);
    carr[i * 3] = br.r * b;
    carr[i * 3 + 1] = br.g * b;
    carr[i * 3 + 2] = br.b * b;
  }
  posAttr.needsUpdate = true;
  colAttr.needsUpdate = true;
  field.line.geometry.setDrawRange(
    0,
    Math.max(2, Math.floor(SAMPLE_COUNT * Math.min(1, a * 1.1))),
  );

  // Burst: a one-shot pop + expanding ring when the skill node ignites (the
  // morph resolves). Re-arms if the visitor scrolls back up.
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

  // Node grows in with the intro, flares as the morph resolves (scroll), pops on
  // burst; halo brightens as skill resolves.
  field.resolve.scale.setScalar(easeOutCubic(a) * (0.5 + scroll * 1.1) * pop);
  field.haloMat.opacity = 0.18 + 0.32 * scroll;
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
  const field = React.useMemo(() => buildMorphField(quality), [quality]);
  React.useEffect(() => () => disposeField(field), [field]);
  useFrame((state, delta) => {
    updateMorph(field, store, delta, interactive, state.camera);
  });
  return <primitive object={field.root} />;
}
