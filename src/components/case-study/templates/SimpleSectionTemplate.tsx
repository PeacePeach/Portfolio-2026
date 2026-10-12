import type { ReactNode } from "react";
import { StoryTextBlock, type StoryTextBlockData } from "../shared/StoryTextBlock";
import { EvidenceColumn, type EvidenceColumnData } from "../shared/EvidenceColumn";
import { caseStudyCompactTokens, caseStudyTokens, caseStudyWideEvidenceTokens } from "../shared/caseStudyTokens";
import { CaseStudyTextReveal, EvidenceStagger } from "../shared/CaseStudyMotion";

export type SimpleSectionData = StoryTextBlockData & {
  /** `center` (default): 400px text centred. `left`: 561px text on the content's left edge (Figma 150:4909). */
  align?: "center" | "left";
  /** From 1280px: text and content sit 128px in from each side, for screenshots smaller than full width (Figma 43:215). */
  inset?: boolean;
  /** Halves the text-to-content gap (64px to 32px). */
  compact?: boolean;
  /** `horizontal` (Figma 166:5550): from 1024px the text (320) sits beside the content (704), 128px apart, vertically centred. */
  layout?: "stacked" | "horizontal";
} & (
  | { variant?: "container" }
  | { variant: "before-after"; before: EvidenceColumnData; after: EvidenceColumnData }
);

/**
 * Figma 135:1453. Structure only: story text (optional label, title, body) centred,
 * or left-aligned (`align`, Figma 150:4909), over full-width content. `container` takes any children; `before-after` pairs
 * two desktop screenshots under Before / After pills (Figma 110:18922). `layout: "horizontal"` puts the text
 * beside the content instead of over it (Figma 166:5550). Without
 * children, `container` is the story text alone.
 */
export function SimpleSectionTemplate({ children, ...props }: SimpleSectionData & { children?: ReactNode }) {
  const { label, title, body, heading, text, align = "center", inset, compact, layout } = props;
  const beforeAfter = props.variant === "before-after";
  return <section className="cs-rules cs-simple-section" data-align={align} data-inset={inset || undefined} data-layout={layout === "horizontal" ? layout : undefined} style={{ ...caseStudyTokens, ...(beforeAfter ? caseStudyWideEvidenceTokens : {}), ...(compact ? caseStudyCompactTokens : {}) }}>
    <CaseStudyTextReveal>
      <div className="cs-simple-section-text"><StoryTextBlock label={label} title={title} body={body} heading={heading} text={text} /></div>
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
