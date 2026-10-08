"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { heroIntro } from "@/design/motion";
import { cn } from "@/lib/cn";

/**
 * A line of text that rises into view from behind a mask.
 * Used by the hero entrance; reduced motion shows it in place.
 */
export function MaskReveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const { delay, line } = heroIntro;
  return (
    // Padding + negative margin keeps descenders and the period inside the mask.
    <span className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: line.duration, ease: line.ease, delay: delay + index * line.stagger }}
      >
        {children}
      </motion.span>
    </span>
  );
}
