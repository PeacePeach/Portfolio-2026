import { StoryTextBlock, type StoryTextBlockData } from "../shared/StoryTextBlock";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { CaseStudyTextReveal } from "../shared/CaseStudyMotion";

export type TwoColumnTextData = {
  columns: readonly [StoryTextBlockData, StoryTextBlockData];
};

/** Figma 83:3445. Structure only; shared rules own layout, typography and motion. */
export function TwoColumnTextTemplate({ columns }: TwoColumnTextData) {
  return <section className="cs-rules cs-text-columns" style={caseStudyTokens}>
    {columns.map((column, index) => <CaseStudyTextReveal key={index} index={index}>
      <StoryTextBlock {...column} />
    </CaseStudyTextReveal>)}
  </section>;
}
