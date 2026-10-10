import { caseStudyType } from "./caseStudyTokens";

export type StoryTextBlockData = {
  label?: string;
  title: string;
  body: string;
};

/** Shared story typography and spacing; content stays in configuration. */
export function StoryTextBlock({ label, title, body }: StoryTextBlockData) {
  return <article className="cs-story-text">
    <header className="cs-story-text-header">
      {label && <p className={caseStudyType.chapterLabel}>{label}</p>}
      <h2 className={caseStudyType.storyTitle}>{title}</h2>
    </header>
    <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{body}</p>
  </article>;
}
