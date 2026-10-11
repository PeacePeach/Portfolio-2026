"use client";

import { useState } from "react";
import { BeforeAfterTemplate } from "../templates/BeforeAfterTemplate";
import { CaseStudyTabs } from "../shared/CaseStudyTabs";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { neoAdvanceValidationThemes } from "@/content/case-study/neoAdvance";

/** Figma 79:2211: one Before / After template, each theme tab is configuration. */
export function NeoThemePanel() {
  const [active, setActive] = useState("1");
  const theme = neoAdvanceValidationThemes.find(theme => theme.id === active)!;
  return <div style={caseStudyTokens} className="cs-section">
    <BeforeAfterTemplate {...theme.data} contentKey={active} contentId="neo-theme-panel" activeTabId={`neo-theme-tab-${active}`} navigation={
      <CaseStudyTabs tabs={neoAdvanceValidationThemes} active={active} onChange={setActive} idPrefix="neo-theme-tab" panelId="neo-theme-panel" label="Research themes" />
    } />
  </div>;
}
