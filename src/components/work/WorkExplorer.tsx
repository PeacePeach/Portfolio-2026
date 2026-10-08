"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Grid, MessageCircle, Radio } from "react-feather";
import type { Project } from "@/content/types";
import {
  caseStudyFilters,
  defaultWorkView,
  isWorkView,
  superPowerFilters,
  workCopy,
  workViews,
  type WorkFilter,
  type WorkView,
} from "@/content/work";
import { workIntro } from "@/design/motion";
import { consumePageSlide } from "@/lib/pageTransition";
import { Reveal } from "../ui/Reveal";
import { ProjectCard } from "./ProjectCard";

const icons = { grid: Grid, radio: Radio, "message-circle": MessageCircle };
/** Feather icons are drawn on a 24 grid; this gives the Figma 1 px line at 18 px. */
const iconProps = { size: 18, strokeWidth: 1.33, "aria-hidden": true } as const;

export function WorkExplorerFromUrl({ projects }: { projects: Project[] }) {
  const param = useSearchParams().get("view");
  return <WorkExplorer view={isWorkView(param) ? param : defaultWorkView} projects={projects} />;
}

/**
 * Work page (Figma 21:196). After the page slide, the left nav reveals top
 * to bottom, then the content for the chosen view does the same. Only the
 * selected category shows its filters.
 */
export function WorkExplorer({ view: initialView, projects }: { view: WorkView; projects: Project[] }) {
  const [view, setView] = useState(initialView);
  const [caseFilters, setCaseFilters] = useState<string[]>([]); // empty = All
  const [powerFilters, setPowerFilters] = useState<string[]>([]); // empty = no filter
  const [timing] = useState(() => (consumePageSlide() ? workIntro.afterSlide : workIntro.direct));
  const [switched, setSwitched] = useState(false);

  const choose = (v: WorkView) => {
    if (v === view) return;
    setSwitched(true);
    setView(v);
    const url = new URL(window.location.href);
    url.searchParams.set("view", v);
    window.history.replaceState(null, "", url);
  };

  const shown =
    view === "case-studies"
      ? projects.filter((p) => !caseFilters.length || p.tags.some((t) => caseFilters.includes(t)))
      : projects.filter((p) => !powerFilters.length || p.powers.some((t) => powerFilters.includes(t)));

  return (
    <div className="container-page grid gap-y-12 pt-[calc(var(--spacing-header)+1.875rem)] pb-section md:grid-cols-[14.25rem_minmax(0,1fr)] md:gap-x-(--spacing-margin)">
      <Reveal delay={timing.nav} className="self-start md:sticky md:top-[calc(var(--spacing-header)+1.875rem)]">
        <nav aria-label={workCopy.heading}>
          <p className="type-body-s uppercase text-ink/60">{workCopy.heading}</p>
          <ul className="mt-5 flex flex-col gap-4">
            {workViews.map((w) => {
              const Icon = icons[w.icon];
              const active = w.id === view;
              const filters = w.id === "case-studies" ? caseStudyFilters : w.id === "super-powers" ? superPowerFilters : [];
              return (
                <li key={w.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(w.id)}
                    className={`flex cursor-pointer items-center gap-2 type-body-s transition-colors duration-(--duration-base) ${
                      active ? "text-ink" : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    <Icon {...iconProps} />
                    <span className="hover-underline">{w.label}</span>
                  </button>
                  <FilterList
                    open={active && filters.length > 0}
                    label={`${w.label} filters`}
                    filters={filters}
                    withAll={w.id === "case-studies"}
                    selected={w.id === "case-studies" ? caseFilters : powerFilters}
                    onChange={w.id === "case-studies" ? setCaseFilters : setPowerFilters}
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </Reveal>

      <Reveal key={view} delay={switched ? 0 : timing.content} className="min-w-0">
        {view === "hanxgpt" ? (
          <p className="type-body-m text-ink-muted">{workCopy.hanxgpt}</p>
        ) : (
          <ProjectGrid projects={shown} />
        )}
      </Reveal>
    </div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  if (!projects.length) return <p className="type-body-m text-ink-muted">{workCopy.empty}</p>;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.map((p) => (
          <motion.li
            key={p.slug}
            layout={!reduce}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: workIntro.filters.duration, ease: workIntro.filters.ease }}
          >
            <ProjectCard project={p} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function FilterList({
  open,
  label,
  filters,
  withAll,
  selected,
  onChange,
}: {
  open: boolean;
  label: string;
  filters: WorkFilter[];
  withAll: boolean;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const reduce = useReducedMotion();
  const t = reduce ? { duration: 0 } : workIntro.filters;
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={t}
          className="overflow-hidden"
        >
          <fieldset className="flex flex-col gap-2 pt-4 pl-[1.625rem]">
            <legend className="sr-only">{label}</legend>
            {withAll ? <FilterBox label="All" checked={!selected.length} onChange={() => onChange([])} /> : null}
            {filters.map((f) => (
              <FilterBox key={f.id} label={f.label} checked={selected.includes(f.id)} onChange={() => toggle(f.id)} />
            ))}
          </fieldset>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FilterBox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 type-body-s">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        aria-hidden="true"
        className="grid size-3.5 shrink-0 place-items-center rounded-[2px] border border-ink/20 transition-colors duration-(--duration-fast) peer-checked:bg-check peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
      >
        {checked ? <Check size={10} strokeWidth={3} className="text-canvas" /> : null}
      </span>
      <span
        className={`hover-underline transition-colors duration-(--duration-base) ${checked ? "text-ink" : "text-ink/60 hover:text-ink"}`}
      >
        {label}
      </span>
    </label>
  );
}
