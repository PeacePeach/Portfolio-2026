"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { duration, swap } from "../tokens/motion";

/** Preserve the established earlier/faster chapter reveal and divider stagger. */
export function ChapterHeaderReveal({ children, className, dividerClassName }: { children: ReactNode; className?: string; dividerClassName?: string }) {
  const reduce = useReducedMotion();
  return <ScrollReveal variant="chapter" className={className}>
    {children}
    <motion.hr className={dividerClassName} variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }} transition={{ duration: reduce ? 0 : duration.base, delay: reduce ? 0 : swap.stagger, ease: "easeOut" }} />
  </ScrollReveal>;
}
