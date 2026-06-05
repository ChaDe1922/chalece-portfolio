"use client";

import * as React from "react";

/** Probes WebGL support after mount (SSR-safe). Returns null until probed,
 *  then true/false. Used to decide between the 3D tunnel and the CSS fallback. */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setSupported(ctx !== null);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}
