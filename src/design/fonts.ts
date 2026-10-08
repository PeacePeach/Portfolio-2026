/**
 * Typefaces. Swap a family here and every component follows, because
 * components only use the font-display / font-sans / font-mono utilities
 * (defined in globals.css from these CSS variables).
 */
import { Inter_Tight, JetBrains_Mono } from "next/font/google";

export const displayFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

export const bodyFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body-family",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-family",
  display: "swap",
});

export const fontVariables = [displayFont.variable, bodyFont.variable, monoFont.variable].join(" ");
