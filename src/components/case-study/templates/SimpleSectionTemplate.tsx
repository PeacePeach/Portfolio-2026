import type { ReactNode } from "react";
import { StoryTextBlock, type StoryTextBlockData } from "../shared/StoryTextBlock";
import { EvidenceColumn, type EvidenceColumnData } from "../shared/EvidenceColumn";
import { caseStudyTokens, caseStudyWideEvidenceTokens } from "../shared/caseStudyTokens";
import { CaseStudyTextReveal, EvidenceStagger } from "../shared/CaseStudyMotion";

export type SimpleSectionData = StoryTextBlockData & {
  /** `center` (default): 400px text centred. `left`: 561px text on the content's left edge (Figma 150:4909). */
  align?: "center" | "left";
} & (
  | { variant?: "container" }
  | { variant: "before-after"; before: EvidenceColumnData; after: EvidenceColumnData }
);

/**
 * Figma 135:1453. Structure only: story text (optional label, title, body) centred,
 * or left-aligned (`align`, Figma 150:4909), over full-width content. `container` takes any children; `before-after` pairs
 * two desktop screenshots under Before / After pills (Figma 110:18922). Without
 * children, `container` is the story text alone.
 */
export function SimpleSectionTemplate({ children, ...props }: SimpleSectionData & { children?: ReactNode }) {
  const { label, title, body, heading, align = "center" } = props;
  const beforeAfter = props.variant === "before-after";
  return <section className="cs-rules cs-simple-section" data-align={align} style={{ ...caseStudyTokens, ...(beforeAfter ? caseStudyWideEvidenceTokens : {}) }}>
    <CaseStudyTextReveal>
      <div className="cs-simple-section-text"><StoryTextBlock label={label} title={title} body={body} heading={heading} /></div>
    </CaseStudyTextReveal>
    {(beforeAfter || children) && <div className="cs-simple-section-content">
      {props.variant === "before-after"
        ? <EvidenceStagger>
            <EvidenceColumn data={props.before} label="Before" />
            <EvidenceColumn data={props.after} label="After" emphasis="primary" />
          </EvidenceStagger>
        : children}
    </div>}
  </section>;
}
