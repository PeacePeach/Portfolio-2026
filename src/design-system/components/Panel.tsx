import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Only repeated surface chrome. Layout, headings and interaction belong to callers. */
export function Panel({ as: Tag = "div", className, ...props }: ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "article";
}) {
  return <Tag {...props} className={cn("rounded-surface border border-ink/10 bg-card", className)} />;
}
