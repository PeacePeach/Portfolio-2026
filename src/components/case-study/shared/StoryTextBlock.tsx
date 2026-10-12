import type { ReactNode } from "react";
import { caseStudyType } from "./caseStudyTokens";

export type StoryTextBlockData = {
  /** Optional small label above the title. */
  label?: string;
  /** Also the block's accessible name and image titles when `text` replaces it. */
  title: string;
  body?: string;
  /** `chapter` (default): Display 32 title. `section`: Heading M title (Figma 138:1719). */
  heading?: "chapter" | "section";
  /**
   * Replaces the label, title and body with any component (e.g. an icon with text).
   * The template keeps its width, spacing and reveal around it.
   */
  text?: ReactNode;
};

/** Shared story typography and spacing; content stays in configuration. */
export function StoryTextBlock({ label, title, body, heading = "chapter", text }: StoryTextBlockData) {
  if (text) return <article className="cs-story-text" aria-label={title}>{text}</article>;
  return <article className="cs-story-text" data-heading={heading}>
    <header className="cs-story-text-header">
      {label && <p className={caseStudyType.chapterLabel}>{label}</p>}
      <h2 className={heading === "section" ? caseStudyType.sectionTitle : caseStudyType.storyTitle}>{title}</h2>
    </header>
    {body && <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{body}</p>}
  </article>;
}
