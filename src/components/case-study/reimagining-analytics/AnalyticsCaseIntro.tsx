"use client";

import type { ReactNode } from "react";
import { reimaginingAnalyticsIntro } from "@/content/case-study/reimaginingAnalytics";
import { MorphCaseIntro } from "../MorphCaseIntro";
import { AnalyticsHero } from "./AnalyticsHero";

/** Top of the Reimagining Analytics case study (Figma 110:18593): the hero band, title, copy and facts. */
export function AnalyticsCaseIntro({ children }: { children?: ReactNode }) {
  return (
    <MorphCaseIntro
      intro={reimaginingAnalyticsIntro}
      hero={(hidden) => <AnalyticsHero className="mt-(--spacing-header-bar)" style={{ visibility: hidden ? "hidden" : undefined }} />}
    >
      {children}
    </MorphCaseIntro>
  );
}
