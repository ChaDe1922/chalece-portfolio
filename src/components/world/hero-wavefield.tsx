"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SIGNAL_CYAN, SIGNAL_IRIS } from "@/components/signal/hero-morph";
import { RIPPLE_MAX, type SignalStore } from "@/lib/signal-store";

// Full-bleed flow-field of signal ribbons behind the hero headline. A fullscreen
// clip-space quad (camera-independent), additive over the obsidian page.
//   - Scroll: a `uReveal` wavefront sweeps up, "uncovering" the waves (faint at
//     rest -> vivid as you scroll), with a bright leading edge.
//   - Hover: the cursor reveals the field locally (a moving spotlight), instead
//     of bending the waves.
//   - Click: a ripple expands from the point, rippling the ribbons + a glow ring.
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
  #define RIPPLE_MAX ${RIPPLE_MAX}
  varying vec2 vUv;
  uniform float uTime;
  uniform float uReveal;
  uniform vec2 uPointer;   // uv 0..1
  uniform float uAspect;
  uniform vec3 uCyan;
  uniform vec3 uIris;
  uniform vec4 uRipples[RIPPLE_MAX]; // xy = uv origin, z = start time, w = strength

  void main() {
    vec2 uv = vUv;
    float x = uv.x;
    vec2 auv = vec2(uv.x * uAspect, uv.y); // aspect-corrected for round ripples

    // Ripples expand outward, ripple the ribbons, and add a glow ring. Each is
    // scaled by its own strength (clicks strong, cursor-move faint).
    float rippleDisp = 0.0;
    float rippleGlow = 0.0;
    for (int i = 0; i < RIPPLE_MAX; i++) {
      vec4 rp = uRipples[i];
      float age = uTime - rp.z;
      if (age < 0.0 || age > 2.4) continue;
      vec2 aorigin = vec2(rp.x * uAspect, rp.y);
      float r = distance(auv, aorigin);
      float radius = age * 0.55;
      float ring = smoothstep(0.075, 0.0, abs(r - radius));
      float fade = exp(-age * 1.6) * rp.w;
      rippleDisp += sin((radius - r) * 40.0) * ring * fade * 0.028;
      rippleGlow += ring * fade;
    }

    float field = 0.0;
    float glow = 0.0;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float base = 0.16 + fi * 0.13;
      float w = base
        + 0.05 * sin(x * 10.0 + uTime * 0.55 + fi * 1.7)
        + 0.022 * sin(x * 21.0 - uTime * 0.42 + fi * 0.9);
      float d = abs((uv.y + rippleDisp) - w);
      field += smoothstep(0.009, 0.0, d);
      glow += smoothstep(0.07, 0.0, d) * 0.11;
    }

    // Scroll reveal wavefront (bottom -> up).
    float front = -0.25 + uReveal * 1.5;
    float coverage = 1.0 - smoothstep(front - 0.25, front, uv.y);
    float edge = smoothstep(0.04, 0.0, abs(uv.y - front)) * (1.0 - smoothstep(0.9, 1.0, uReveal));

    // Hover reveals the field locally around the cursor (a spotlight).
    vec2 apointer = vec2(uPointer.x * uAspect, uPointer.y);
    float hover = smoothstep(0.30, 0.0, distance(auv, apointer));

    float vis = mix(0.10, 1.0, max(coverage, hover));

    vec3 col = mix(uCyan, uIris, x);
    float amp = (field + glow) * vis
      + edge * (field + 0.4)
      + hover * (field + glow) * 0.45         // extra glow under the cursor
      + rippleGlow * (field + 0.6) * 1.15;    // ripple ring
    gl_FragColor = vec4(col * amp, amp);
  }
`;

const smooth01 = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function updateWavefield(
  mat: THREE.ShaderMaterial,
  store: SignalStore,
  delta: number,
  aspect: number,
) {
  const u = mat.uniforms;
  // Drive the shader clock from store.time so click ripples (stamped with
  // store.time) share the same clock and actually render.
  store.time += Math.min(delta, 0.05);
  u.uTime.value = store.time;
  // Uncover completes by ~55% of the hero scroll, while the hero is still in view.
  u.uReveal.value = smooth01(0, 0.55, store.scroll);
  (u.uPointer.value as THREE.Vector2).set(
    (store.pointerX + 1) * 0.5,
    (1 - store.pointerY) * 0.5,
  );
  u.uAspect.value = aspect;
  const rips = u.uRipples.value as THREE.Vector4[];
  for (let i = 0; i < RIPPLE_MAX; i++) {
    rips[i].set(
      store.ripples[i * 4],
      store.ripples[i * 4 + 1],
      store.ripples[i * 4 + 2],
      store.ripples[i * 4 + 3],
    );
  }
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
        uPointer: { value: new THREE.Vector2(-1, -1) },
        uAspect: { value: 1 },
        uCyan: { value: new THREE.Color(SIGNAL_CYAN) },
        uIris: { value: new THREE.Color(SIGNAL_IRIS) },
        uRipples: {
          value: Array.from({ length: RIPPLE_MAX }, () => new THREE.Vector4(0, 0, -1000, 0)),
        },
      },
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = -1;
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

  useFrame((state, delta) =>
    updateWavefield(built.mat, store, delta, state.size.width / state.size.height),
  );

  return <primitive object={built.mesh} />;
}
