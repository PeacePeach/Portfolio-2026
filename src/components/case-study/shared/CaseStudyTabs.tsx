"use client";

import { useRovingTabs } from "@/lib/useRovingTabs";
import { caseStudyTokens } from "./caseStudyTokens";

export type CaseStudyTab = { id: string; label: string };

export function CaseStudyTabs({ tabs, active, onChange, idPrefix, panelId, label = "Evidence views", appearance = "outline" }: {
  tabs: readonly CaseStudyTab[]; active: string; onChange: (id: string) => void; idPrefix: string; panelId: string; label?: string; appearance?: "outline" | "filled";
}) {
  const { register, onKeyDown } = useRovingTabs(tabs.map(t => t.id), active, onChange);
  return <div className="cs-rules cs-tabs" style={caseStudyTokens} data-appearance={appearance} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
    {tabs.map(tab => <button key={tab.id} ref={register(tab.id)} type="button" role="tab" id={`${idPrefix}-${tab.id}`} aria-controls={panelId} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => onChange(tab.id)} className="type-body-s">{tab.label}</button>)}
  </div>;
}
