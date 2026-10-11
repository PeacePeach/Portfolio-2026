"use client";

import { ChapterHeaderReveal } from "@/design-system/components/ChapterHeaderReveal";
import { caseStudyTokens, caseStudyType } from "./caseStudyTokens";

/** Figma 83:3301: one chapter-header style for every case study. */
export function CaseStudyChapterHeader({ id, children }: { id: string; children: string }) {
  return <div className="cs-rules cs-chapter" style={caseStudyTokens}>
    <ChapterHeaderReveal className="neo-chapter-header" dividerClassName="cs-chapter-divider">
      <h2 id={id} className={caseStudyType.chapterLabel}>{children}</h2>
    </ChapterHeaderReveal>
  </div>;
}
