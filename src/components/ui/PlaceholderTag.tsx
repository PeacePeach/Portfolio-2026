import type { ContentStatus } from "@/content/types";
import { site } from "@/content/site";

export function PlaceholderTag({ status }: { status: ContentStatus }) {
  if (!site.showPlaceholderLabels || status !== "placeholder") return null;
  return <span className="type-label-s rounded-full border border-line px-2 py-0.5 text-tertiary">Placeholder</span>;
}
