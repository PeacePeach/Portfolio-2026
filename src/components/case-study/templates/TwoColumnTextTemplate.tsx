import { StoryTextBlock, type StoryTextBlockData } from "../shared/StoryTextBlock";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { CaseStudyTextReveal } from "../shared/CaseStudyMotion";
import { TellMeAboutIt, type TellMeAboutItData } from "../shared/tell-me-about-it/TellMeAboutIt";
import { UpNext } from "../shared/UpNext";

/** A column is static story text, a Tell Me About It interaction, or the next case study (project slug). */
export type TwoColumnTextColumn = StoryTextBlockData | { tellMeAboutIt: TellMeAboutItData } | { upNext: string };

export type TwoColumnTextData = {
  columns: readonly [TwoColumnTextColumn, TwoColumnTextColumn];
};

/** Figma 83:3445. Structure only; shared rules own layout, typography and motion. */
export function TwoColumnTextTemplate({ columns }: TwoColumnTextData) {
  return <section className="cs-rules cs-section cs-text-columns" style={caseStudyTokens}>
    {columns.map((column, index) => <CaseStudyTextReveal key={index} index={index}>
      {"tellMeAboutIt" in column ? <TellMeAboutIt {...column.tellMeAboutIt} /> : "upNext" in column ? <UpNext slug={column.upNext} /> : <StoryTextBlock {...column} />}
    </CaseStudyTextReveal>)}
  </section>;
}
