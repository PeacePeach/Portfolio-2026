import { caseStudyType } from "./caseStudyTokens";

export type StoryTextBlockData = {
  /** Optional small label above the title. */
  label?: string;
  title: string;
  body: string;
  /** `chapter` (default): Display 32 title. `section`: Heading M title (Figma 138:1719). */
  heading?: "chapter" | "section";
};

/** Shared story typography and spacing; content stays in configuration. */
export function StoryTextBlock({ label, title, body, heading = "chapter" }: StoryTextBlockData) {
  return <article className="cs-story-text">
    <header className="cs-story-text-header">
      {label && <p className={caseStudyType.chapterLabel}>{label}</p>}
      <h2 className={heading === "section" ? caseStudyType.sectionTitle : caseStudyType.storyTitle}>{title}</h2>
    </header>
    <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{body}</p>
  </article>;
}
