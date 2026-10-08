"use client";

import { createContext, useContext } from "react";

export type IntroState = {
  /** true once the loader counter hits 100% (or straight away when skipped) */
  ready: boolean;
  /** loader was skipped: reduced motion or disabled in site config */
  skipped: boolean;
  /** the loader's HX has landed and the header logo has taken over */
  logoShown: boolean;
};

export const IntroContext = createContext<IntroState>({ ready: true, skipped: true, logoShown: true });

export function useIntro() {
  return useContext(IntroContext);
}
