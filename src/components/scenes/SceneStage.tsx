"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * A fixed-size design canvas (e.g. a 422 × 314 Figma tile) scaled to fit the
 * width of its container, so scenes can be laid out in the design's own
 * pixel units and still fill a fluid tile.
 */
export function SceneStage({
  width,
  height,
  className = "",
  children,
}: {
  width: number;
  height: number;
  className?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / width);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
