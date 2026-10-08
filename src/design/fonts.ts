/**
 * Typefaces (from the Figma file "AI Portfolio"). Swap a family here and
 * every component follows, because components only use the font-display /
 * font-sans utilities (defined in globals.css from these CSS variables).
 *
 *   display  Archivo Narrow SemiBold: hero statement, HX logo
 *   sans     Archivo (Light for body/nav, SemiBold for the loader name)
 */
import { Archivo, Archivo_Narrow } from "next/font/google";

export const displayFont = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

export const bodyFont = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-body-family",
  display: "swap",
});

export const fontVariables = [displayFont.variable, bodyFont.variable].join(" ");
