"use client";

import { useId, useState, type ReactNode } from "react";
import { EvidencePanelShell } from "../shared/EvidencePanelShell";
import { EvidencePanelHeader } from "../shared/EvidencePanelHeader";
import { EvidenceColumn, type EvidenceColumnData, type EvidenceImage } from "../shared/EvidenceColumn";
import { CaseStudyTabs, type CaseStudyTab } from "../shared/CaseStudyTabs";
import { CaseStudyContentSwap, CaseStudyPanelReveal, EvidenceStagger } from "../shared/CaseStudyMotion";

type ComparisonRow = { before: EvidenceColumnData; after: EvidenceColumnData };

type ComparisonContent = ComparisonRow & {
  title: string;
  description: string;
  /** Replaces the title and description with any component; the header keeps its spacing. */
  text?: ReactNode;
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

/** One tab of a tabbed panel: its label and its own Before / After configuration. */
export type BeforeAfterTab = CaseStudyTab & { data: BeforeAfterData };

/** `tabs`: several Before / After panels behind shared case-study tabs (Figma 79:2211); the panel swaps per tab. */
export type BeforeAfterTabsData = { tabs: readonly BeforeAfterTab[]; tabsLabel: string };

/** Structure only. Shared primitives own every visual and motion rule. */
export function BeforeAfterTemplate(props: (BeforeAfterData & TemplateNavigation) | BeforeAfterTabsData) {
  return "tabs" in props ? <BeforeAfterTabs {...props} /> : <BeforeAfterPanel {...props} />;
}

function BeforeAfterTabs({ tabs, tabsLabel }: BeforeAfterTabsData) {
  const id = useId();
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find(tab => tab.id === active) ?? tabs[0];
  return <BeforeAfterPanel {...tab.data} contentKey={tab.id} contentId={`${id}panel`} activeTabId={`${id}tab-${tab.id}`} navigation={
    <CaseStudyTabs tabs={tabs} active={tab.id} onChange={setActive} idPrefix={`${id}tab`} panelId={`${id}panel`} label={tabsLabel} />
  } />;
}

function BeforeAfterPanel(props: BeforeAfterData & TemplateNavigation) {
  const titleId = useId();
  const { title, description, before, after, size, navigation, contentId, activeTabId } = props;
  const variant = props.variant ?? "before-after";
  const groupedSide = props.variant === "grouped-before-after" ? props.groupedSide ?? "before" : undefined;
  const pairWidth = (groupedSide === "after" ? after : before).images[0]?.width;
  return <EvidencePanelShell labelledBy={titleId} navigation={navigation} contentId={contentId} activeTabId={activeTabId} layout={variant} groupedSide={groupedSide} pairWidth={pairWidth} size={size}>
    <CaseStudyPanelReveal>
      <CaseStudyContentSwap contentKey={props.contentKey ?? variant}>
        <EvidencePanelHeader id={titleId} title={title} description={description} text={props.text} />
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
