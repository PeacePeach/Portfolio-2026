import { CornerUpRight } from "react-feather";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getProject } from "@/content";
import { caseStudyType } from "./caseStudyTokens";

/** Figma 99:39393: the next case study's Work page tile (panel shown) under a Tell Me About It–style eyebrow,
 *  16px below it, filling the column so its bottom meets the neighbouring column's. */
export function UpNext({ slug, eyebrow = "UP NEXT" }: { slug: string; eyebrow?: string }) {
  const project = getProject(slug);
  if (!project) return null;
  return <div className="flex h-full flex-col gap-4">
    <p className={`cs-tma-eyebrow ${caseStudyType.chapterLabel}`}>
      <CornerUpRight className="cs-tma-eyebrow-icon" strokeWidth={1.33} aria-hidden />
      {eyebrow}
    </p>
    <ProjectCard project={project} revealed className="aspect-[422/314] flex-1" />
  </div>;
}
