"use client";

import { useEffect } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { reveal } from "@/design/motion";

/**
 * The site's one reveal: a soft-edged mask whose edge travels from above the
 * block to below it, so the content appears top to bottom. Used by the Know
 * me by panel, the Work page nav and the Work page content.
 */
export function Reveal({
  play = true,
  delay = 0,
  direction = "vertical",
  className,
  children,
}: {
  play?: boolean;
  delay?: number;
  direction?: "vertical" | "horizontal";
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const edge = useMotionValue(-30);
  const axis = direction === "horizontal" ? "to right" : "to bottom";
  const mask = useMotionTemplate`linear-gradient(${axis}, #000 ${edge}%, transparent calc(${edge}% + 30%))`;

  useEffect(() => {
    if (reduce) return edge.set(130);
    if (!play) return;
    const controls = animate(edge, 130, { duration: reveal.duration, ease: reveal.ease, delay });
    return () => controls.stop();
  }, [play, reduce, delay, edge]);

  return (
    <motion.div data-mask-reveal style={{ maskImage: mask, WebkitMaskImage: mask }} className={`motion-reduce:[mask-image:none]! ${className ?? ""}`}>
      {children}
    </motion.div>
  );
}
