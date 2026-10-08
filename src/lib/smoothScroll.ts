import { animate } from "motion/react";
import { scrollTo as scrollToken } from "@/design/motion";

/**
 * Eased scroll to an element, then move focus to it for keyboard and
 * screen-reader users. Jumps instantly when reduced motion is preferred.
 */
export function smoothScrollTo(target: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY;
  const focus = () => target.focus({ preventScroll: true });

  if (reduce) {
    window.scrollTo({ top, behavior: "instant" });
    focus();
    return;
  }

  // Native smooth scrolling would fight our easing.
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  const controls = animate(window.scrollY, top, {
    duration: scrollToken.duration,
    ease: scrollToken.ease,
    onUpdate: (y) => window.scrollTo(0, y),
    onComplete: () => {
      html.style.scrollBehavior = prev;
      focus();
    },
  });

  // Let the visitor take over: any wheel/touch/key input cancels the tween.
  const cancel = () => {
    controls.stop();
    html.style.scrollBehavior = prev;
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
  };
  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });
  window.addEventListener("keydown", cancel, { once: true });
}
