"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { reveal } from "@/design/motion";

/**
 * The site's one reveal: a soft-edged mask whose edge travels from above the
 * block to below it, so the content appears top to bottom. Used by the Know
 * me by panel, the Work page nav, the Work page content and case-study evidence
 * panels. Once revealed the mask is dropped: Chromium can keep a stale mask
 * after a resize and hide the whole block.
 */
export function Reveal({
  play = true,
  delay = 0,
  className,
  children,
}: {
  play?: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const edge = useMotionValue(reduce ? 130 : -30);
  const mask = useMotionTemplate`linear-gradient(to bottom, #000 ${edge}%, transparent calc(${edge}% + 30%))`;

  useEffect(() => {
    if (reduce) return edge.set(130);
    if (!play) return;
    const controls = animate(edge, 130, { duration: reveal.duration, ease: reveal.ease, delay });
    controls.then(() => setDone(true));
    return () => controls.stop();
  }, [play, reduce, delay, edge]);

  return (
    <motion.div data-mask-reveal style={done || reduce ? { maskImage: "none", WebkitMaskImage: "none" } : { maskImage: mask, WebkitMaskImage: mask }} className={className}>
      {children}
    </motion.div>
  );
}
