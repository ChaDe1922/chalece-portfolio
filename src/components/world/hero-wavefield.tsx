"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SIGNAL_CYAN, SIGNAL_IRIS } from "@/components/signal/hero-morph";
import type { SignalStore } from "@/lib/signal-store";

// Full-bleed flow-field of signal ribbons behind the hero headline. A fullscreen
// clip-space quad (camera-independent), additive over the obsidian page. The
// `uReveal` wavefront sweeps up from the bottom as the hero scrolls, "uncovering"
// the waves (faint at rest -> full as you scroll), with a bright leading edge.
// Cheap: one fragment pass, no scene graph.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uReveal;
  uniform vec2 uPointer;
  uniform vec3 uCyan;
  uniform vec3 uIris;

  void main() {
    vec2 uv = vUv;
    float x = uv.x;

    float field = 0.0;
    float glow = 0.0;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float base = 0.16 + fi * 0.13;
      float w = base
        + 0.05 * sin(x * 10.0 + uTime * 0.55 + fi * 1.7)
        + 0.022 * sin(x * 21.0 - uTime * 0.42 + fi * 0.9);
      w += uPointer.y * 0.025 * (fi - 2.5);
      float d = abs(uv.y - w);
      field += smoothstep(0.009, 0.0, d);
      glow += smoothstep(0.07, 0.0, d) * 0.16;
    }

    // Reveal wavefront rising from the bottom as uReveal grows.
    float front = -0.25 + uReveal * 1.5;
    float coverage = 1.0 - smoothstep(front - 0.25, front, uv.y);
    float edge = smoothstep(0.04, 0.0, abs(uv.y - front)) * (1.0 - smoothstep(0.9, 1.0, uReveal));
    float vis = mix(0.10, 1.0, coverage);

    vec3 col = mix(uCyan, uIris, x);
    float amp = (field + glow) * vis + edge * (field + 0.5);
    gl_FragColor = vec4(col * amp, amp);
  }
`;

const smooth01 = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function updateWavefield(mat: THREE.ShaderMaterial, store: SignalStore, delta: number) {
  const u = mat.uniforms;
  u.uTime.value += Math.min(delta, 0.05);
  // Uncover completes by ~55% of the hero scroll, while the hero is still in view.
  u.uReveal.value = smooth01(0, 0.55, store.scroll);
  (u.uPointer.value as THREE.Vector2).set(store.pointerX, store.pointerY);
}

export function HeroWavefield({ store }: { store: SignalStore }) {
  const built = React.useMemo(() => {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uCyan: { value: new THREE.Color(SIGNAL_CYAN) },
        uIris: { value: new THREE.Color(SIGNAL_IRIS) },
      },
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = -1; // draw behind the signal line
    mesh.frustumCulled = false;
    return { geo, mat, mesh };
  }, []);

  React.useEffect(
    () => () => {
      built.geo.dispose();
      built.mat.dispose();
    },
    [built],
  );

  useFrame((_, delta) => updateWavefield(built.mat, store, delta));

  return <primitive object={built.mesh} />;
}
