"use client";

import type { ReactNode } from "react";
import { neoAdvanceIntro } from "@/content/neoAdvance";
import { MorphCaseIntro } from "../MorphCaseIntro";
import { NeoHero } from "./NeoHero";

/** Top of the Neo Advance case study (Figma 51:24883): the hero band, title, copy and facts. */
export function NeoCaseIntro({ children }: { children?: ReactNode }) {
  return (
    <MorphCaseIntro
      intro={neoAdvanceIntro}
      hero={(hidden) => <NeoHero className="mt-(--spacing-header-bar)" style={{ visibility: hidden ? "hidden" : undefined }} />}
    >
      {children}
    </MorphCaseIntro>
  );
}
