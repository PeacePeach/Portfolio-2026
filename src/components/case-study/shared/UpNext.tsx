"use client";

import { CornerUpRight } from "react-feather";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getUpNextCandidates } from "@/content";
import { useViewedCaseStudies } from "@/lib/viewedCaseStudies";
import { caseStudyType } from "./caseStudyTokens";

/** Figma 99:39393: the next case study's Work page tile (panel shown) under a Tell Me About It–style eyebrow,
 *  16px below it, filling the column so its bottom meets the neighbouring column's. Recommends the first case
 *  study in `upNextOrder` that isn't `after` and hasn't been opened this session; once all have been seen,
 *  the first in order. */
export function UpNext({ after, eyebrow = "UP NEXT" }: { after: string; eyebrow?: string }) {
  const viewed = useViewedCaseStudies();
  const candidates = getUpNextCandidates(after);
  const project = candidates.find(project => !viewed.includes(project.slug)) ?? candidates[0];
  if (!project) return null;
  return <div className="flex h-full flex-col gap-4">
    <p className={`cs-tma-eyebrow ${caseStudyType.chapterLabel}`}>
      <CornerUpRight className="cs-tma-eyebrow-icon" strokeWidth={1.33} aria-hidden />
      {eyebrow}
    </p>
    <ProjectCard key={project.slug} project={project} revealed className="aspect-[422/314] flex-1" />
  </div>;
}
