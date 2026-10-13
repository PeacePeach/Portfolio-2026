"use client";

import { useSyncExternalStore } from "react";

/** A numbered chapter, read from its `CaseStudyChapterHeader` ("01 _ EARLY DISCOVERY"). */
export type CaseStudyChapter = { id: string; number: string; label: string };

/**
 * The chapters currently on the page, so the nav can show case-study progress
 * (Header). Each `CaseStudyChapterHeader` registers itself while mounted;
 * headers without a number (Mutexa's "How the product works") are left out.
 */
const chapters = new Map<string, CaseStudyChapter>();
const listeners = new Set<() => void>();
const empty: CaseStudyChapter[] = [];
let snapshot: CaseStudyChapter[] = empty;

function publish() {
  snapshot = [...chapters.values()].sort((a, b) => Number(a.number) - Number(b.number));
  for (const listener of listeners) listener();
}

export function registerChapter(id: string, title: string) {
  const match = /^(\d+)\s*_\s*(.+)$/.exec(title.trim());
  if (!match) return () => {};
  chapters.set(id, { id, number: match[1], label: match[2] });
  publish();
  return () => {
    chapters.delete(id);
    publish();
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCaseStudyChapters() {
  return useSyncExternalStore(subscribe, () => snapshot, () => empty);
}
