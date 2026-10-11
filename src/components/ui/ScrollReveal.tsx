"use client";

import type { ReactNode } from "react";
import { duration } from "@/design/motion";
import { motion, useReducedMotion } from "motion/react";

const tags = { div: motion.div, li: motion.li, hr: motion.hr };

/**
 * Fades one block in (opacity 0 → 1, 16 px rise) the first time it enters
 * the viewport, then leaves it alone. Pages wrap small pieces (a divider, a
 * heading, one card) so a section unfolds piece by piece as it scrolls in;
 * `delay` staggers siblings that enter together. Motion shares one
 * IntersectionObserver per viewport config, so every instance uses the same
 * observer. With reduced motion the content simply renders; the CSS guard
 * also covers the server render, before the motion hook can know.
 */
export function ScrollReveal({
  as = "div",
  delay = 0,
  variant = "default",
  className,
  children,
}: {
  as?: keyof typeof tags;
  delay?: number;
  variant?: "default" | "chapter";
  className?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const M = tags[as];
  return (
    <M
      className={`motion-reduce:transform-none! motion-reduce:opacity-100! ${className ?? ""}`}
      data-reveal={variant}
      initial="hidden"
      whileInView="shown"
      variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } }}
      viewport={variant === "chapter"
        ? { once: true, amount: 0, margin: "0px 0px -15% 0px" }
        : { once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0 : variant === "chapter" ? duration.base : 0.4, ease: "easeOut", delay: reduce ? 0 : delay }}
    >
      {children}
    </M>
  );
}
