import { Pill } from "@/design-system/components/Pill";
import type { ContentStatus } from "@/content/types";
import { site } from "@/content/site";

export function PlaceholderTag({ status }: { status: ContentStatus }) {
  if (!site.showPlaceholderLabels || status !== "placeholder") return null;
  return <Pill appearance="placeholder">Placeholder</Pill>;
}
