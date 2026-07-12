import * as THREE from "three";

// Storyboard-as-data camera rig for the Act I journey. The camera pose is a pure
// function of the one global scroll scalar (worldProgress) + this keyframe table.
// cameraAt eases between the bracketing keyframes, lerping position, look-at
// target, and fov. Using a look-at TARGET (never manual eulers, never z-roll)
// makes the atrium turn and the Codio pitch fall out of pure target-lerps.

export type CamMove = "dolly" | "through" | "turn" | "rise" | "settle";

export type CamKey = {
  p: number;
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  move: CamMove;
};

// Corridor runs down -z; camera y baseline 1.2. Later keyframes (atrium/rise)
// are wired now so the path is continuous; those scenes are built in later phases.
export const CAM: CamKey[] = [
  { p: 0.0, pos: [0, 1.2, 20], target: [0, 1.2, 0], fov: 62, move: "dolly" },
  { p: 0.12, pos: [0, 1.2, 16], target: [0, 1.2, 0], fov: 62, move: "dolly" },
  { p: 0.45, pos: [0, 1.2, -26], target: [0, 1.2, -40], fov: 62, move: "dolly" },
  { p: 0.55, pos: [0, 1.2, -40], target: [0, 1.2, -60], fov: 62, move: "through" },
  { p: 0.66, pos: [0, 1.3, -50], target: [0, 1.6, -62], fov: 60, move: "turn" },
  { p: 0.8, pos: [1.5, 1.4, -52], target: [0, 1.8, -63], fov: 60, move: "turn" },
  { p: 0.9, pos: [0, 8, -55], target: [0, 1.0, -66], fov: 58, move: "rise" },
  { p: 1.0, pos: [0, 4, -64], target: [0, 3, -78], fov: 60, move: "settle" },
];

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const _target = new THREE.Vector3();

/** Position + orient the camera for journey progress p (module-level; no React). */
export function cameraAt(p: number, cam: THREE.PerspectiveCamera): void {
  const pp = clamp01(p);
  let i = 0;
  while (i < CAM.length - 2 && pp > CAM[i + 1].p) i++;
  const a = CAM[i];
  const b = CAM[i + 1];
  const span = b.p - a.p;
  const t = smooth(span > 1e-6 ? (pp - a.p) / span : 0);

  cam.position.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t,
  );
  _target.set(
    a.target[0] + (b.target[0] - a.target[0]) * t,
    a.target[1] + (b.target[1] - a.target[1]) * t,
    a.target[2] + (b.target[2] - a.target[2]) * t,
  );
  cam.lookAt(_target);

  const fov = a.fov + (b.fov - a.fov) * t;
  if (Math.abs(cam.fov - fov) > 0.01) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
}
