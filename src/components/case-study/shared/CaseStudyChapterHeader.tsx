"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { caseStudyMotion } from "./caseStudyMotion";
import { caseStudyTokens, caseStudyType } from "./caseStudyTokens";

export function CaseStudyChapterHeader({ id, children, labelClassName = caseStudyType.chapterLabel }: { id: string; children: string; labelClassName?: string }) {
  const timing = caseStudyMotion(useReducedMotion());
  return <div className="cs-rules cs-chapter" style={caseStudyTokens}>
    <ScrollReveal variant="chapter" className="neo-chapter-header">
      <h2 id={id} className={labelClassName}>{children}</h2>
      <motion.hr className="cs-chapter-divider" variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }} transition={timing.divider} />
    </ScrollReveal>
  </div>;
}
