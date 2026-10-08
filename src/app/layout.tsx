import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/design/fonts";
import { site } from "@/content/site";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="meta sr-only z-50 bg-ink px-3 py-2 text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
