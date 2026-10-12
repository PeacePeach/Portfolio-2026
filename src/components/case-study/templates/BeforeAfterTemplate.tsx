"use client";

import { useId, type ReactNode } from "react";
import { EvidencePanelShell } from "../shared/EvidencePanelShell";
import { EvidencePanelHeader } from "../shared/EvidencePanelHeader";
import { EvidenceColumn, type EvidenceColumnData, type EvidenceImage } from "../shared/EvidenceColumn";
import { CaseStudyContentSwap, CaseStudyPanelReveal, EvidenceStagger } from "../shared/CaseStudyMotion";

type ComparisonRow = { before: EvidenceColumnData; after: EvidenceColumnData };

type ComparisonContent = ComparisonRow & {
  title: string;
  description: string;
  /** `wide`: desktop screenshots at the simple-section width (568px, 16px gaps). */
  size?: "wide";
};

export type BeforeAfterData = ComparisonContent & (
  /** `rows`: further Before / After pairs under the same header, 48px apart. */
  | { variant?: "before-after"; rows?: readonly ComparisonRow[] }
  | { variant: "before-iterated-after"; iterated: EvidenceColumnData }
  | { variant: "grouped-before-after"; groupedSide?: "before"; before: Omit<EvidenceColumnData, "images"> & { images: readonly [EvidenceImage, EvidenceImage] } }
  | { variant: "grouped-before-after"; groupedSide: "after"; after: Omit<EvidenceColumnData, "images"> & { images: readonly [EvidenceImage, EvidenceImage] } }
);

type TemplateNavigation = { navigation?: ReactNode; contentId?: string; activeTabId?: string; contentKey?: string };

/** Structure only. Shared primitives own every visual and motion rule. */
export function BeforeAfterTemplate(props: BeforeAfterData & TemplateNavigation) {
  const titleId = useId();
  const { title, description, before, after, size, navigation, contentId, activeTabId } = props;
  const variant = props.variant ?? "before-after";
  const groupedSide = props.variant === "grouped-before-after" ? props.groupedSide ?? "before" : undefined;
  const pairWidth = (groupedSide === "after" ? after : before).images[0]?.width;
  return <EvidencePanelShell labelledBy={titleId} navigation={navigation} contentId={contentId} activeTabId={activeTabId} layout={variant} groupedSide={groupedSide} pairWidth={pairWidth} size={size}>
    <CaseStudyPanelReveal>
      <CaseStudyContentSwap contentKey={props.contentKey ?? variant}>
        <EvidencePanelHeader id={titleId} title={title} description={description} />
        <EvidenceStagger>
          <EvidenceColumn data={before} label="Before" imageLayout={groupedSide === "before" ? "pair" : "stack"} />
          {props.variant === "before-iterated-after" && <EvidenceColumn data={props.iterated} label="Iterated" />}
          <EvidenceColumn data={after} label="After" emphasis="primary" imageLayout={groupedSide === "after" ? "pair" : "stack"} />
        </EvidenceStagger>
        {props.variant !== "before-iterated-after" && props.variant !== "grouped-before-after" && props.rows?.map((row, index) => <div key={index} className="cs-evidence-row">
          <EvidenceStagger>
            <EvidenceColumn data={row.before} label="Before" />
            <EvidenceColumn data={row.after} label="After" emphasis="primary" />
          </EvidenceStagger>
        </div>)}
      </CaseStudyContentSwap>
    </CaseStudyPanelReveal>
  </EvidencePanelShell>;
}
