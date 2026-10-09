"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Fades a below-the-fold section in (opacity 0 → 1, 16 px rise) the first
 * time it enters the viewport, then leaves it alone. Motion shares one
 * IntersectionObserver per viewport config, so every instance uses the same
 * observer. With reduced motion the content simply renders; the CSS guard
 * also covers the server render, before the motion hook can know.
 */
export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={`motion-reduce:transform-none! motion-reduce:opacity-100! ${className ?? ""}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
