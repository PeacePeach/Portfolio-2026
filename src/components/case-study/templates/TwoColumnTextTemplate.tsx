import type { CSSProperties } from "react";
import { StoryTextBlock, type StoryTextBlockData } from "../shared/StoryTextBlock";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { CaseStudyTextReveal } from "../shared/CaseStudyMotion";
import { TellMeAboutIt, type TellMeAboutItData } from "../shared/tell-me-about-it/TellMeAboutIt";
import { UpNext } from "../shared/UpNext";
import { caseStudyType } from "../shared/caseStudyTokens";

/** A column is static story text, a Tell Me About It interaction, or Up Next (`after`: this case study's slug). */
export type TwoColumnTextColumn = StoryTextBlockData | { tellMeAboutIt: TellMeAboutItData } | { upNext: { after: string } };

export type TwoColumnTextData = {
  /** Optional Display title centred 16px above two 280px columns (the story title-to-body gap) 48px apart (Figma 114:2736). */
  title?: string;
  columns: readonly [TwoColumnTextColumn, TwoColumnTextColumn];
};

/** Figma 114:2736 scaled to 16px body: 280px columns 48px apart under a title. */
const titledColumnTokens = { "--cs-text-column-width": "280px", "--cs-text-column-gap": "calc(var(--spacing) * 12)" } as CSSProperties;

/** Figma 83:3445. Structure only; shared rules own layout, typography and motion. */
export function TwoColumnTextTemplate({ title, columns }: TwoColumnTextData) {
  const cells = columns.map((column, index) => <CaseStudyTextReveal key={index} index={index}>
    {"tellMeAboutIt" in column ? <TellMeAboutIt {...column.tellMeAboutIt} /> : "upNext" in column ? <UpNext after={column.upNext.after} /> : <StoryTextBlock {...column} />}
  </CaseStudyTextReveal>);
  if (!title) return <section className="cs-rules cs-section cs-text-columns" style={caseStudyTokens}>{cells}</section>;
  return <section className="cs-rules cs-section flex flex-col gap-(--cs-story-body-gap)" style={{ ...caseStudyTokens, ...titledColumnTokens }}>
    <CaseStudyTextReveal><h2 className={`${caseStudyType.storyTitle} text-center`}>{title}</h2></CaseStudyTextReveal>
    <div className="cs-text-columns">{cells}</div>
  </section>;
}
