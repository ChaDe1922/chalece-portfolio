"use client";

/** Minimal warm rig for the dolls: soft fill + a key from upper-left + a cool
 *  rim to separate them from the dark stage. No HDR fetch, no shadow maps. */
export function DollsLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff8f0" />
      <directionalLight position={[-2, 3, 3]} intensity={1.6} color="#fff4e6" />
      <directionalLight position={[3, 1, -2]} intensity={0.4} color="#c8d8ff" />
    </>
  );
}
