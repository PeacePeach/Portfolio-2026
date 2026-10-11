"use client";

import { useRef, type KeyboardEvent, type CSSProperties } from "react";

/**
 * Keyboard support for an ARIA tablist with automatic activation:
 * arrows move and select, Home/End jump to the ends.
 */
export function useRovingTabs<T extends string>(
  ids: readonly T[],
  active: T,
  onSelect: (id: T) => void,
  orientation: "horizontal" | "vertical" | "both" = "horizontal",
) {
  const refs = useRef(new Map<T, HTMLButtonElement | null>());

  const onKeyDown = (e: KeyboardEvent) => {
    const i = ids.indexOf(active);
    const prevKeys = orientation === "vertical" ? ["ArrowUp"] : orientation === "horizontal" ? ["ArrowLeft"] : ["ArrowUp", "ArrowLeft"];
    const nextKeys = orientation === "vertical" ? ["ArrowDown"] : orientation === "horizontal" ? ["ArrowRight"] : ["ArrowDown", "ArrowRight"];
    let next = -1;
    if (nextKeys.includes(e.key)) next = (i + 1) % ids.length;
    else if (prevKeys.includes(e.key)) next = (i - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onSelect(ids[next]);
    refs.current.get(ids[next])?.focus();
  };

  const register = (id: T) => (el: HTMLButtonElement | null) => {
    refs.current.set(id, el);
  };

  return { onKeyDown, register };
}

export type Tab = { id: string; label: string };
export type TabsProps = {
  tabs: readonly Tab[]; active: string; onChange: (id: string) => void;
  idPrefix: string; panelId: string; label?: string;
  appearance?: "outline" | "filled"; style?: CSSProperties;
};

/** Existing theme-tab presentation; other selectors retain their own visuals. */
export function Tabs({ tabs, active, onChange, idPrefix, panelId, label = "Evidence views", appearance = "outline", style }: TabsProps) {
  const { register, onKeyDown } = useRovingTabs(tabs.map(t => t.id), active, onChange);
  return <div className="cs-rules cs-tabs" style={style} data-appearance={appearance} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
    {tabs.map(tab => <button key={tab.id} ref={register(tab.id)} type="button" role="tab" id={`${idPrefix}-${tab.id}`} aria-controls={panelId} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => onChange(tab.id)} className="type-body-s">{tab.label}</button>)}
  </div>;
}
