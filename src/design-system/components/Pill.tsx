import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const styles = {
  evidence: "cs-pill type-body-xs cs-small-text",
  project: "type-body-xs rounded-full border border-secondary bg-tag text-secondary px-2.5 py-1",
  placeholder: "type-label-s rounded-full border border-line px-2 py-0.5 text-tertiary",
  muted: "type-body-xs rounded-full border border-border-default bg-surface-3 text-secondary px-2.5 py-1",
} as const;

/** Existing visual treatments, preserved verbatim. Evidence inherits its case-study scope. */
export function Pill({ appearance = "project", emphasis = "secondary", className, ...props }: ComponentPropsWithoutRef<"span"> & {
  appearance?: keyof typeof styles;
  emphasis?: "primary" | "secondary";
}) {
  return <span {...props} data-emphasis={appearance === "evidence" ? emphasis : undefined} className={cn(styles[appearance], className)} />;
}
