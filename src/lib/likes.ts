"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Per-visitor likes, kept in this browser only (no backend yet). The shown
 * count is the content's base count plus this visitor's own like.
 */
const key = (id: string) => `hx-like:${id}`;
const listeners = new Set<() => void>();

function read(id: string): boolean {
  try {
    return localStorage.getItem(key(id)) === "1";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useLike(id: string) {
  const liked = useSyncExternalStore(subscribe, () => read(id), () => false);
  const toggle = useCallback(() => {
    try {
      if (read(id)) localStorage.removeItem(key(id));
      else localStorage.setItem(key(id), "1");
    } catch {
      // storage blocked: the like simply doesn't stick
    }
    listeners.forEach((l) => l());
  }, [id]);
  return { liked, toggle };
}
