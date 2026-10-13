import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { caseStudyTokens, caseStudyType } from "../shared/caseStudyTokens";
import { AccentBar } from "../shared/AccentBar";

export type ReflectionData = {
  headline: string;
  body: string;
  /** `bar` (default): 4px rounded accent bar beside the headline. `none`: headline alone. */
  accent?: "bar" | "none";
};

/** Figma 89:5173 / 99:38841: reflection headline, then supporting copy, in one centered 500px column. */
export function ReflectionTemplate({ headline, body, accent = "bar" }: ReflectionData) {
  return <section aria-label="Reflection" style={caseStudyTokens} className="cs-rules cs-section">
    {/* Accent bar 16px to the headline; 33px from headline to body. */}
    <ScrollReveal className="mx-auto flex max-w-[500px] flex-col gap-[33px]">
      <blockquote className={`${caseStudyType.storyTitle} flex gap-4 text-(--cs-primary)`}>
        {accent === "bar" && <AccentBar />}
        <span>{headline}</span>
      </blockquote>
      <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{body}</p>
    </ScrollReveal>
  </section>;
}
