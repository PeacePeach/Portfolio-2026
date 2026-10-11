"use client";

import { ChapterHeaderReveal } from "@/design-system/components/ChapterHeaderReveal";
import { caseStudyTokens, caseStudyType } from "./caseStudyTokens";

export function CaseStudyChapterHeader({ id, children, labelClassName = caseStudyType.chapterLabel }: { id: string; children: string; labelClassName?: string }) {
  return <div className="cs-rules cs-chapter" style={caseStudyTokens}>
    <ChapterHeaderReveal className="neo-chapter-header" dividerClassName="cs-chapter-divider">
      <h2 id={id} className={labelClassName}>{children}</h2>
    </ChapterHeaderReveal>
  </div>;
}
