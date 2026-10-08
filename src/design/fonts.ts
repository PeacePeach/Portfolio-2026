/**
 * Typefaces. Swap a family here and every component follows, because
 * components only use the font-display / font-sans / font-mono utilities
 * (defined in globals.css from these CSS variables).
 */
import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";

export const displayFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

export const bodyFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body-family",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-family",
  display: "swap",
});

/** Extended face for the loader name and counter (wdth axis, see .font-wide). */
export const wideFont = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-wide-family",
  display: "swap",
});

export const fontVariables = [displayFont.variable, bodyFont.variable, monoFont.variable, wideFont.variable].join(" ");
