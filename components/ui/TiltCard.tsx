"use client";

import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Lightweight GPU-accelerated 3D perspective tilt wrapper.
 * Updates CSS custom properties (--rx, --ry, --gx, --gy) on pointer move
 * for smooth 3D card depth and cursor specular sheen on desktop fine pointers.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const xRatio = (e.clientX - rect.left) / rect.width;
      const yRatio = (e.clientY - rect.top) / rect.height;
      const rx = ((0.5 - yRatio) * maxTilt * 2).toFixed(2);
      const ry = ((xRatio - 0.5) * maxTilt * 2).toFixed(2);
      const gx = (xRatio * 100).toFixed(1);
      const gy = (yRatio * 100).toFixed(1);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--gx", `${gx}%`);
        el.style.setProperty("--gy", `${gy}%`);
      });
    },
    [maxTilt]
  );

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "50%");
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-3d ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
