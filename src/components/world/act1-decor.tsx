"use client";
"use no memo";

import * as React from "react";
import * as THREE from "three";
import { SIGNAL_CYAN } from "@/components/signal/hero-morph";

// Declarative Act I decor: the stat plaques on the corridor walls. Text is drawn
// to a 2D canvas and used as a texture on a plane (reliable, no external font
// dependency), framed by a glowing outline. The canvas is aria-hidden; the real
// content is mirrored in the accessible DOM layer (journey).

// Shared plaque frame geometry (one instance, reused across plaques).
const PLAQUE_EDGES = new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.7, 2.3));

type Plaque = { value: string; label: string; side: -1 | 1; z: number };

// The four stats as wall plaques, staggered left / right / left / right down -z.
const PLAQUES: Plaque[] = [
  { value: "48,000+", label: "Learners reached", side: -1, z: -3 },
  { value: "10", label: "Published Coursera courses", side: 1, z: -9 },
  { value: "10+", label: "Years in learning and technology", side: -1, z: -15 },
  { value: "M.S.", label: "Music Technology, Georgia Tech", side: 1, z: -21 },
];
const WALL_X = 5.8;
const PLAQUE_Y = 1.4;

function wrapLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function makePlaqueTexture(value: string, label: string): THREE.CanvasTexture {
  const w = 520;
  const h = 320;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Value (big serif, iris).
  ctx.fillStyle = "#a996ff";
  ctx.font = "italic 500 148px Georgia, 'Times New Roman', serif";
  ctx.fillText(value, w / 2, 118);

  // Label (small, light, up to two lines).
  ctx.fillStyle = "#cbc7d6";
  ctx.font = "38px Georgia, 'Times New Roman', serif";
  const lines = wrapLabel(ctx, label, w - 48);
  const startY = 232;
  lines.forEach((ln, i) => ctx.fillText(ln, w / 2, startY + i * 46));

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export type Act1Decor = {
  plaques: Array<{ z: number; group: THREE.Group | null }>;
};

export function makeAct1Decor(): Act1Decor {
  return { plaques: PLAQUES.map((p) => ({ z: p.z, group: null })) };
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Per-frame proximity fade: a plaque brightens as the camera nears it and fades
 *  quickly once passed. Module-level (no React render). */
export function updateDecor(decor: Act1Decor, camera: THREE.Camera) {
  const camZ = camera.position.z;
  for (const pl of decor.plaques) {
    if (!pl.group) continue;
    const d = Math.abs(camZ - pl.z);
    const passed = camZ < pl.z; // camera has flown past it (travelling toward -z)
    const near = 2;
    const far = passed ? 5 : 14;
    const op = clamp01(1 - (d - near) / (far - near));
    pl.group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const m = mesh.material as THREE.Material | undefined;
      if (m && !Array.isArray(m)) {
        m.transparent = true;
        m.opacity = op;
      }
    });
  }
}

export function Act1Decor({ decor }: { decor: Act1Decor }) {
  const textures = React.useMemo(
    () => PLAQUES.map((p) => makePlaqueTexture(p.value, p.label)),
    [],
  );
  React.useEffect(
    () => () => textures.forEach((t) => t.dispose()),
    [textures],
  );

  return (
    <>
      {PLAQUES.map((p, i) => (
        <group
          key={i}
          position={[p.side * WALL_X, PLAQUE_Y, p.z]}
          rotation={[0, -p.side * (Math.PI / 2), 0]}
          ref={(el) => {
            decor.plaques[i].group = el;
          }}
        >
          <lineSegments geometry={PLAQUE_EDGES}>
            <lineBasicMaterial
              color={SIGNAL_CYAN}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </lineSegments>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[3.4, 2.1]} />
            <meshBasicMaterial
              map={textures[i]}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
