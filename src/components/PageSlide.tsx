import { ViewTransition } from "react";

/**
 * Wraps a page so Links tagged nav-forward / nav-back slide it (see the page
 * slide rules in globals.css). Other navigations do not animate.
 */
export function PageSlide({ children }: { children: React.ReactNode }) {
  const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };
  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
