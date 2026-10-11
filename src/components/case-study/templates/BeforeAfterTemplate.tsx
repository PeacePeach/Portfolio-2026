"use client";

import { useId, type ReactNode } from "react";
import { EvidencePanelShell, type EvidenceSize } from "../shared/EvidencePanelShell";
import { CaseStudySectionHeader } from "../shared/CaseStudySectionHeader";
import { EvidencePanelHeader } from "../shared/EvidencePanelHeader";
import { EvidenceColumn, type EvidenceColumnData, type EvidenceImage } from "../shared/EvidenceColumn";
import { CaseStudyContentSwap, CaseStudyPanelReveal, EvidenceStagger } from "../shared/CaseStudyMotion";

type ComparisonContent = {
  title: string;
  description: string;
  before: EvidenceColumnData;
  after: EvidenceColumnData;
  /** `wide` pairs two desktop screenshots under a section header (Figma 110:18922). */
  size?: EvidenceSize;
};

export type BeforeAfterData = ComparisonContent & (
  | { variant?: "before-after" }
  | { variant: "before-iterated-after"; iterated: EvidenceColumnData }
  | { variant: "grouped-before-after"; groupedSide?: "before"; before: Omit<EvidenceColumnData, "images"> & { images: readonly [EvidenceImage, EvidenceImage] } }
  | { variant: "grouped-before-after"; groupedSide: "after"; after: Omit<EvidenceColumnData, "images"> & { images: readonly [EvidenceImage, EvidenceImage] } }
);

type TemplateNavigation = { navigation?: ReactNode; contentId?: string; activeTabId?: string; contentKey?: string };

/** Structure only. Shared primitives own every visual and motion rule. */
export function BeforeAfterTemplate(props: BeforeAfterData & TemplateNavigation) {
  const titleId = useId();
  const { title, description, before, after, navigation, contentId, activeTabId, size } = props;
  const variant = props.variant ?? "before-after";
  const groupedSide = props.variant === "grouped-before-after" ? props.groupedSide ?? "before" : undefined;
  const pairWidth = (groupedSide === "after" ? after : before).images[0]?.width;
  return <EvidencePanelShell labelledBy={titleId} navigation={navigation} contentId={contentId} activeTabId={activeTabId} layout={variant} groupedSide={groupedSide} pairWidth={pairWidth} size={size}>
    <CaseStudyPanelReveal>
      <CaseStudyContentSwap contentKey={props.contentKey ?? variant}>
        {size === "wide"
          ? <CaseStudySectionHeader id={titleId} title={title} description={description} className="mb-(--cs-header-evidence-gap)" />
          : <EvidencePanelHeader id={titleId} title={title} description={description} />}
        <EvidenceStagger>
          <EvidenceColumn data={before} label="Before" imageLayout={groupedSide === "before" ? "pair" : "stack"} />
          {props.variant === "before-iterated-after" && <EvidenceColumn data={props.iterated} label="Iterated" />}
          <EvidenceColumn data={after} label="After" emphasis="primary" imageLayout={groupedSide === "after" ? "pair" : "stack"} />
        </EvidenceStagger>
      </CaseStudyContentSwap>
    </CaseStudyPanelReveal>
  </EvidencePanelShell>;
}
