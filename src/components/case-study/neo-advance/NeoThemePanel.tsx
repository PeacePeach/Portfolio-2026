"use client";

import { useState } from "react";
import { BeforeAfterTemplate } from "../templates/BeforeAfterTemplate";
import { CaseStudyTabs } from "../shared/CaseStudyTabs";
import { neoAdvanceValidationThemes } from "@/content/case-study/neoAdvance";

export function NeoThemePanel() {
  const [active, setActive] = useState("1");
  const theme = neoAdvanceValidationThemes.find(theme => theme.id === active)!;
  return <div className="neo-validation-panel">
    <BeforeAfterTemplate {...theme.data} contentKey={active} contentId="neo-theme-panel" activeTabId={`neo-theme-tab-${active}`} navigation={
      <CaseStudyTabs tabs={neoAdvanceValidationThemes} active={active} onChange={setActive} idPrefix="neo-theme-tab" panelId="neo-theme-panel" label="Research themes" appearance="filled" />
    } />
  </div>;
}
