"use client";

import { useState } from "react";
import { BeforeAfterTemplate, type BeforeAfterData } from "@/components/case-study/templates/BeforeAfterTemplate";
import { CaseStudyTabs } from "@/components/case-study/shared/CaseStudyTabs";

export function BeforeAfterPreview({ examples }: { examples: readonly { id: string; label: string; data: BeforeAfterData }[] }) {
  const [active, setActive] = useState(examples[0].id);
  const example = examples.find(item => item.id === active) ?? examples[0];
  return <BeforeAfterTemplate {...example.data}
    navigation={<CaseStudyTabs tabs={examples} active={example.id} onChange={setActive} idPrefix="before-after-tab" panelId="before-after-content" />}
    contentKey={example.id} contentId="before-after-content" activeTabId={`before-after-tab-${example.id}`}
  />;
}
