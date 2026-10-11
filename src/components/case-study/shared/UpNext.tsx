import { CornerUpRight } from "react-feather";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getProject } from "@/content";
import { caseStudyType } from "./caseStudyTokens";

/** Figma 99:39393: the next case study, as its Work page tile under a Tell Me About It–style eyebrow. */
export function UpNext({ slug, eyebrow = "UP NEXT" }: { slug: string; eyebrow?: string }) {
  const project = getProject(slug);
  if (!project) return null;
  return <div className="cs-tma-header">
    <p className={`cs-tma-eyebrow ${caseStudyType.chapterLabel}`}>
      <CornerUpRight className="cs-tma-eyebrow-icon" strokeWidth={1.33} aria-hidden />
      {eyebrow}
    </p>
    <ProjectCard project={project} />
  </div>;
}
