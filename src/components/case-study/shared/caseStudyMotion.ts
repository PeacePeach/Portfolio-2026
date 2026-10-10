import { duration, swap } from "@/design/motion";

/** Case-study behavior only; all durations/easing come from site motion. */
export function caseStudyMotion(reduce: boolean | null) {
  return {
    enter: reduce ? { duration: 0 } : swap.enter,
    exit: reduce ? { duration: 0 } : swap.exit,
    hidden: { opacity: 0, y: reduce ? 0 : swap.offset },
    shown: { opacity: 1, y: 0 },
    stagger: reduce ? 0 : swap.stagger,
    divider: { duration: reduce ? 0 : duration.base, delay: reduce ? 0 : swap.stagger, ease: "easeOut" as const },
  };
}
