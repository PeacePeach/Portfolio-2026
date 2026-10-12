"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { markCaseStudyViewed } from "@/lib/viewedCaseStudies";

/** Records each opened case study (`/work/[slug]`) for this session, so Up Next can skip it. */
export function CaseStudyViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const slug = pathname.match(/^\/work\/([^/]+)/)?.[1];
    if (slug) markCaseStudyViewed(slug);
  }, [pathname]);
  return null;
}
