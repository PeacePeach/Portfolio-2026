import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Only repeated surface chrome. Layout, headings and interaction belong to callers. */
export function Panel({ as: Tag = "div", surface = "card", className, ...props }: ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "article";
  surface?: "card" | "evidence";
}) {
  return <Tag {...props} className={cn("rounded-surface border", surface === "card" ? "border-ink/10 bg-card" : "border-[rgb(255_255_255_/_10%)] bg-surface-2", className)} />;
}
