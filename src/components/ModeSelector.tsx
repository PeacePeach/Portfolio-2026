"use client";

import { motion } from "motion/react";
import { duration, ease } from "@/design/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { cn } from "@/lib/cn";

export type ModeOption<T extends string> = { id: T; label: string };

/**
 * Exploration mode switch, set as large type rather than UI chrome.
 * Accessible tablist; arrow keys move between modes.
 */
export function ModeSelector<T extends string>({
  modes,
  active,
  onChange,
  idPrefix,
}: {
  modes: readonly ModeOption<T>[];
  active: T;
  onChange: (id: T) => void;
  idPrefix: string;
}) {
  const ids = modes.map((m) => m.id);
  const { onKeyDown, register } = useRovingTabs(ids, active, onChange, "horizontal");

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
      <span className="meta text-ink-faint md:pb-[0.6em]" id={`${idPrefix}-label`}>
        View by
      </span>
      <div
        role="tablist"
        aria-labelledby={`${idPrefix}-label`}
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-end gap-x-8 gap-y-2 md:gap-x-12"
      >
        {modes.map((m, i) => {
          const selected = m.id === active;
          return (
            <button
              key={m.id}
              ref={register(m.id)}
              role="tab"
              type="button"
              id={`${idPrefix}-tab-${m.id}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(m.id)}
              className={cn(
                "group relative cursor-pointer pb-2 text-left font-display text-headline transition-colors duration-(--duration-base) ease-out-expo",
                selected ? "text-ink" : "text-ink-faint hover:text-ink-muted",
              )}
            >
              <span className="meta absolute -top-4 left-0 text-ink-faint">({String(i + 1).padStart(2, "0")})</span>
              {m.label}
              {selected ? (
                <motion.span
                  layoutId={`${idPrefix}-underline`}
                  className="absolute inset-x-0 bottom-0 h-px bg-ink"
                  transition={{ duration: duration.slow, ease: ease.outExpo }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
