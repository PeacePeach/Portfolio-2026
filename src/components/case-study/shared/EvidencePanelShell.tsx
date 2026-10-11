import type { ReactNode } from "react";
import { caseStudyTokens, caseStudyWideTokens } from "./caseStudyTokens";

/** `wide`: two desktop screenshots side by side (Figma 110:18922). */
export type EvidenceSize = "default" | "wide";

export type EvidenceLayout = "before-after" | "before-iterated-after" | "grouped-before-after";

/** No surface chrome: content sits on the page background; only the tab bar draws dividers. */
export function EvidencePanelShell({ children, navigation, labelledBy, contentId, activeTabId, layout = "before-after", groupedSide, pairWidth, size = "default" }: { children: ReactNode; navigation?: ReactNode; labelledBy: string; contentId?: string; activeTabId?: string; layout?: EvidenceLayout; groupedSide?: "before" | "after"; pairWidth?: number; size?: EvidenceSize }) {
  return <section aria-labelledby={labelledBy} className="cs-rules cs-panel" data-layout={layout} data-grouped-side={groupedSide} data-size={size} style={{ ...caseStudyTokens, ...(size === "wide" ? caseStudyWideTokens : {}), ...(pairWidth ? { "--cs-pair-image-width": `${pairWidth}px` } : {}) }}>
    {navigation}
    <div className="cs-panel-content" id={contentId} role={activeTabId ? "tabpanel" : undefined} aria-labelledby={activeTabId} tabIndex={activeTabId ? 0 : undefined}>{children}</div>
  </section>;
}
