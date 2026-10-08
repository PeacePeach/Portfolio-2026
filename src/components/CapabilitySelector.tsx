"use client";

import { motion } from "motion/react";
import type { Capability } from "@/content/types";
import { duration, ease } from "@/design/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { cn } from "@/lib/cn";

/** Vertical list of capabilities set as large type. ARIA tablist. */
export function CapabilitySelector({
  capabilities,
  counts,
  active,
  onChange,
  idPrefix,
}: {
  capabilities: Capability[];
  counts: Record<string, number>;
  active: string;
  onChange: (id: string) => void;
  idPrefix: string;
}) {
  const ids = capabilities.map((c) => c.id);
  const { onKeyDown, register } = useRovingTabs(ids, active, onChange, "both");

  return (
    <div role="tablist" aria-orientation="vertical" aria-label="Capabilities" onKeyDown={onKeyDown} className="flex flex-col">
      {capabilities.map((c, i) => {
        const selected = c.id === active;
        return (
          <button
            key={c.id}
            ref={register(c.id)}
            role="tab"
            type="button"
            id={`${idPrefix}-tab-${c.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(c.id)}
            className={cn(
              "group relative grid cursor-pointer grid-cols-[2.25rem_1fr_auto] items-baseline border-t border-line py-5 text-left md:grid-cols-[3rem_1fr_auto] md:py-6",
              "transition-colors duration-(--duration-base) ease-out-expo",
              selected ? "text-ink" : "text-ink-faint hover:text-ink-muted",
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`${idPrefix}-marker`}
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full bg-ink"
                transition={{ duration: duration.slow, ease: ease.outExpo }}
              />
            ) : null}
            <span className="meta">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-title md:text-heading">{c.label}</span>
            <span className="meta tabular-nums">({counts[c.id] ?? 0})</span>
          </button>
        );
      })}
    </div>
  );
}
