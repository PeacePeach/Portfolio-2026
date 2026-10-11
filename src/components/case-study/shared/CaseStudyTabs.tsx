"use client";

import { Tabs, type TabsProps } from "@/design-system/components/Tabs";
import { caseStudyTokens } from "./caseStudyTokens";
export type { Tab as CaseStudyTab } from "@/design-system/components/Tabs";

/** Domain adapter supplies existing case-study values; shared Tabs owns rendering. */
export function CaseStudyTabs(props: Omit<TabsProps, "style">) {
  return <Tabs {...props} style={caseStudyTokens} />;
}
