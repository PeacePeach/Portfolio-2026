import type { Ref } from "react";
import { duration } from "@/design/motion";

// Seven dots form the H; the blue dot follows its two stems and crossbar.
const hTrace = "M10 10V42V26H42V42V10V26H10V10";
const hDots = [[10, 10], [42, 10], [10, 26], [26, 26], [42, 26], [10, 42], [42, 42]];

/** One loop of the H trace; also how long the interaction "thinks". */
export const thinkingDuration = duration.image + duration.base;

/** The existing H loader, extracted from the Neo early-discovery story. */
export function ThinkingIndicator({ label, reduce, ref }: { label: string; reduce: boolean | null; ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref} role="status" tabIndex={-1} className="cs-tma-thinking">
    <svg viewBox="0 0 52 52" className="cs-tma-thinking-mark" aria-hidden="true">
      {hDots.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.5" fill="currentColor" />)}
      {reduce ? (
        <circle cx="10" cy="10" r="5.5" fill="var(--color-highlight)" />
      ) : (
        <circle r="5.5" fill="var(--color-highlight)" className="motion-reduce:hidden">
          <animateMotion path={hTrace} dur={`${thinkingDuration}s`} repeatCount="indefinite" calcMode="paced" />
        </circle>
      )}
    </svg>
    <p className="type-body-m-tight">{label}</p>
  </div>;
}
