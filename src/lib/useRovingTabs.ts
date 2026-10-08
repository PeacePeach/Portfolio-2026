"use client";

import { useRef, type KeyboardEvent } from "react";

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
