import { StoryTextBlock, type StoryTextBlockData } from "../shared/StoryTextBlock";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { CaseStudyTextReveal } from "../shared/CaseStudyMotion";
import { TellMeAboutIt, type TellMeAboutItData } from "../shared/tell-me-about-it/TellMeAboutIt";

/** A column is static story text, or a Tell Me About It interaction. */
export type TwoColumnTextColumn = StoryTextBlockData | { tellMeAboutIt: TellMeAboutItData };

export type TwoColumnTextData = {
  columns: readonly [TwoColumnTextColumn, TwoColumnTextColumn];
};

/** Figma 83:3445. Structure only; shared rules own layout, typography and motion. */
export function TwoColumnTextTemplate({ columns }: TwoColumnTextData) {
  return <section className="cs-rules cs-text-columns" style={caseStudyTokens}>
    {columns.map((column, index) => <CaseStudyTextReveal key={index} index={index}>
      {"tellMeAboutIt" in column ? <TellMeAboutIt {...column.tellMeAboutIt} /> : <StoryTextBlock {...column} />}
    </CaseStudyTextReveal>)}
  </section>;
}
