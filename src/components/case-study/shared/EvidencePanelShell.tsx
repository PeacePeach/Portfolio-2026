import type { ReactNode } from "react";
import { caseStudyTokens, caseStudyWideEvidenceTokens } from "./caseStudyTokens";

export type EvidenceLayout = "before-after" | "before-iterated-after" | "grouped-before-after";

/**
 * No surface chrome: content sits on the page background; only the tab bar draws dividers.
 * Without tabs there is nothing to swap, so the tab-bar spacing and fixed min height drop out.
 */
export function EvidencePanelShell({ children, navigation, labelledBy, contentId, activeTabId, layout = "before-after", groupedSide, pairWidth, size }: { children: ReactNode; navigation?: ReactNode; labelledBy: string; contentId?: string; activeTabId?: string; layout?: EvidenceLayout; groupedSide?: "before" | "after"; pairWidth?: number; size?: "wide" }) {
  return <section aria-labelledby={labelledBy} className="cs-rules cs-panel" data-layout={layout} data-grouped-side={groupedSide} data-size={size} style={{ ...caseStudyTokens, ...(size === "wide" ? caseStudyWideEvidenceTokens : {}), ...(navigation ? {} : { "--cs-panel-min-height": "auto", "--cs-content-top": "0px" }), ...(pairWidth ? { "--cs-pair-image-width": `${pairWidth}px` } : {}) }}>
    {navigation}
    <div className="cs-panel-content" id={contentId} role={activeTabId ? "tabpanel" : undefined} aria-labelledby={activeTabId} tabIndex={activeTabId ? 0 : undefined}>{children}</div>
  </section>;
}
