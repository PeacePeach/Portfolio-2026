"use client";

import { useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";

/**
 * A fixed-size design canvas (e.g. a 422 × 314 Figma tile) scaled to cover
 * its container, so scenes can be laid out in the design's own pixel units
 * and still fill a fluid tile (also one stretched taller than the design).
 */
export function SceneStage({
  width,
  height,
  className = "",
  children,
  ref,
}: {
  width: number;
  height: number;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}) {
  const box = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => box.current!);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.max(el.clientWidth / width, el.clientHeight / height));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <div className="absolute top-0 left-1/2 origin-top" style={{ width, height, transform: `translateX(-50%) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
