/**
 * Typefaces (from the Figma file "AI Portfolio", frame 10:196). Swap a family
 * here and every component follows, because components only use the
 * font-display / font-sans utilities (defined in globals.css from these CSS
 * variables).
 *
 *   display  Fraunces (SOFT 0, WONK 1): hero statement, loader name, HX logo
 *   sans     Geist: body, nav, loader percentage, Know me by panel
 */
import { Fraunces, Geist } from "next/font/google";

export const displayFont = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display-family",
  display: "swap",
});

export const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});

export const fontVariables = [displayFont.variable, bodyFont.variable].join(" ");
