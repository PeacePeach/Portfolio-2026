"use client";

import { useSyncExternalStore } from "react";

/**
 * Case studies this visitor has opened in this browser session (sessionStorage,
 * no backend). Up Next uses it to skip what they've already seen.
 */
const key = "hx-viewed-case-studies";
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function markCaseStudyViewed(slug: string) {
  const viewed = readRaw().split(",").filter(Boolean);
  if (viewed.includes(slug)) return;
  try {
    sessionStorage.setItem(key, [...viewed, slug].join(","));
  } catch {
    // storage blocked: Up Next falls back to the priority order
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Slugs viewed this session; empty on the server and before hydration. */
export function useViewedCaseStudies(): string[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  return raw.split(",").filter(Boolean);
}
