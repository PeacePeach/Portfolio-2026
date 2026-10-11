"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudyMotion } from "./caseStudyMotion";

/** Only inner content swaps. The shell and tabs remain mounted. */
export function CaseStudyContentSwap({ contentKey, children }: { contentKey: string; children: ReactNode }) {
  const timing = caseStudyMotion(useReducedMotion());
  return <AnimatePresence initial={false} mode="wait">
    <motion.div key={contentKey} initial={timing.hidden} animate={{ ...timing.shown, transition: timing.enter }} exit={{ opacity: 0, transition: timing.exit }}>{children}</motion.div>
  </AnimatePresence>;
}

export function CaseStudyPanelReveal({ children }: { children: ReactNode }) {
  return <Reveal>{children}</Reveal>;
}

export function EvidenceStagger({ children }: { children: ReactNode }) {
  const timing = caseStudyMotion(useReducedMotion());
  return <motion.div className="cs-evidence-columns" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0 }} variants={{ shown: { transition: { staggerChildren: timing.stagger } } }}>{children}</motion.div>;
}

export function EvidenceReveal({ children }: { children: ReactNode }) {
  const timing = caseStudyMotion(useReducedMotion());
  return <motion.div className="cs-evidence-item" variants={{ hidden: timing.hidden, shown: { ...timing.shown, transition: timing.enter } }}>{children}</motion.div>;
}

/** Text templates share the site's scroll reveal and case-study stagger. */
export function CaseStudyTextReveal({ children, index = 0 }: { children: ReactNode; index?: number }) {
  const timing = caseStudyMotion(useReducedMotion());
  return <ScrollReveal className="cs-text-column" delay={index * timing.stagger}>{children}</ScrollReveal>;
}
