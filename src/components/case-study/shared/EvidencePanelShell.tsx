import { Panel } from "@/design-system/components/Panel";
import type { ReactNode } from "react";
import { caseStudyTokens } from "./caseStudyTokens";

export type EvidenceLayout = "before-after" | "before-iterated-after" | "grouped-before-after";

export function EvidencePanelShell({ children, navigation, labelledBy, contentId, activeTabId, layout = "before-after", groupedSide, pairWidth }: { children: ReactNode; navigation?: ReactNode; labelledBy: string; contentId?: string; activeTabId?: string; layout?: EvidenceLayout; groupedSide?: "before" | "after"; pairWidth?: number }) {
  return <Panel as="section" surface="evidence" aria-labelledby={labelledBy} className="cs-rules cs-panel" data-layout={layout} data-grouped-side={groupedSide} style={{ ...caseStudyTokens, ...(pairWidth ? { "--cs-pair-image-width": `${pairWidth}px` } : {}) }}>
    {navigation}
    <div className="cs-panel-content" id={contentId} role={activeTabId ? "tabpanel" : undefined} aria-labelledby={activeTabId} tabIndex={activeTabId ? 0 : undefined}>{children}</div>
  </Panel>;
}
