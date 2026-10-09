"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Grid, MessageCircle, Radio } from "react-feather";
import type { Project, SuperPower } from "@/content/types";
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
import { cameBySlide } from "@/lib/pageTransition";
import { useCaseMorph } from "@/lib/caseMorph";
import { Reveal } from "../ui/Reveal";
import { PowerFragmentCard } from "./PowerFragmentCard";
import { ProjectCard } from "./ProjectCard";

const icons = { grid: Grid, radio: Radio, "message-circle": MessageCircle };
/** Feather icons are drawn on a 24 grid; this gives the Figma 1 px line at 18 px. */
const iconProps = { size: 18, strokeWidth: 1.33, "aria-hidden": true } as const;

type Content = { projects: Project[]; powers: SuperPower[] };

export function WorkExplorerFromUrl(content: Content) {
  const param = useSearchParams().get("view");
  const view = isWorkView(param) ? param : defaultWorkView;
  // The router keeps visited pages alive (Activity). Arriving from a link must
  // start fresh: the chosen view, no filters, and the entrance replayed.
  // Switching views on the page only updates the URL, so it is not keyed on
  // the view: the nav stays put and only the content on the right changes.
  const { bfcacheId } = useRouter();
  return <WorkExplorer key={bfcacheId} view={view} {...content} />;
}

/**
 * Work page (Figma 21:196). After the page slide, the left nav reveals top
 * to bottom, then the content for the chosen view does the same. Only the
 * selected category shows its filters.
 */
export function WorkExplorer({
  view: initialView,
  projects,
  powers,
  idle = false,
}: Content & {
  view: WorkView;
  /** Static shell shown while the URL is read: held hidden so the wrong view never flashes. */
  idle?: boolean;
}) {
  const [view, setView] = useState(initialView);
  const [caseFilters, setCaseFilters] = useState<string[]>([]); // empty = All
  // One super power at a time (Figma 25:538); the first is shown on arrival.
  const [powerId, setPowerId] = useState(superPowerFilters[0].id);
  const [timing] = useState(() => (cameBySlide() ? workIntro.afterSlide : workIntro.direct));
  const [switched, setSwitched] = useState(false);
  // A tile is opening its case study: the nav steps out to the left and the other tiles fade.
  const leaving = useCaseMorph() !== null;
  // Follow the URL when something else changes ?view (a link to /work?view=…).
  const [urlView, setUrlView] = useState(initialView);
  if (initialView !== urlView) {
    setUrlView(initialView);
    if (initialView !== view) {
      setSwitched(true);
      setView(initialView);
    }
  }

  const choose = (v: WorkView) => {
    if (v === view) return;
    setSwitched(true);
    setView(v);
    const url = new URL(window.location.href);
    url.searchParams.set("view", v);
    window.history.replaceState(null, "", url);
  };

  const shown = projects.filter((p) => !caseFilters.length || p.tags.some((t) => caseFilters.includes(t)));
  const power = powers.find((p) => p.id === powerId) ?? powers[0];
  const choosePower = ([next]: string[]) => {
    if (!next || next === powerId) return;
    setSwitched(true);
    setPowerId(next);
  };

  return (
    <div className="container-page grid gap-y-12 pt-[calc(var(--spacing-header)+1.875rem)] pb-section md:grid-cols-[14.25rem_minmax(0,1fr)] md:gap-x-(--spacing-margin)">
      <Reveal
        play={!idle}
        delay={timing.nav}
        className="self-start md:sticky md:top-[calc(var(--spacing-header)+1.875rem)]"
      >
        <motion.nav
          aria-label={workCopy.heading}
          initial={false}
          animate={leaving ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="type-body-s uppercase text-ink/60">{workCopy.heading}</p>
          <ul className="mt-5 flex flex-col gap-4">
            {workViews.map((w) => {
              const Icon = icons[w.icon];
              const active = w.id === view;
              const filters =
                w.id === "case-studies" ? caseStudyFilters : w.id === "super-powers" ? superPowerFilters : [];
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
                    <span>{w.label}</span>
                  </button>
                  <FilterList
                    open={active && filters.length > 0}
                    label={`${w.label} filters`}
                    filters={filters}
                    single={w.id === "super-powers"}
                    selected={w.id === "case-studies" ? caseFilters : [powerId]}
                    onChange={w.id === "case-studies" ? setCaseFilters : choosePower}
                  />
                </li>
              );
            })}
          </ul>
        </motion.nav>
      </Reveal>

      <Reveal
        key={view === "super-powers" ? `${view}-${power.id}` : view}
        play={!idle}
        delay={switched ? 0 : timing.content}
        className="min-w-0"
      >
        <motion.div
          initial={false}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {view === "hanxgpt" ? (
            <p className="type-body-m text-ink-muted">{workCopy.hanxgpt}</p>
          ) : view === "super-powers" ? (
            <PowerView power={power} />
          ) : (
            <ProjectGrid projects={shown} />
          )}
        </motion.div>
      </Reveal>
    </div>
  );
}

function PowerView({ power }: { power: SuperPower }) {
  return (
    <section aria-labelledby={`power-${power.id}`}>
      <h2 id={`power-${power.id}`} className="-mt-[0.3125rem] type-display-s uppercase text-ink">
        {power.title}
      </h2>
      <p className="mt-3.5 max-w-[47.8125rem] type-body-m text-ink">{power.description}</p>
      <ul className="mt-14 grid gap-4 xl:grid-cols-2">
        {power.fragments.map((f) => (
          <li key={f.id}>
            <PowerFragmentCard fragment={f} />
          </li>
        ))}
      </ul>
    </section>
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
  single = false,
  selected,
  onChange,
}: {
  open: boolean;
  label: string;
  filters: WorkFilter[];
  /** One choice (radios, Super powers) or several with an "All" reset (checkboxes, Case studies). */
  single?: boolean;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const reduce = useReducedMotion();
  const t = reduce ? { duration: 0 } : workIntro.filters;
  const toggle = (id: string) =>
    onChange(single ? [id] : selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

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
            {single ? null : <FilterBox label="All" checked={!selected.length} onChange={() => onChange([])} />}
            {filters.map((f) => (
              <FilterBox
                key={f.id}
                label={f.label}
                name={single ? label : undefined}
                checked={selected.includes(f.id)}
                onChange={() => toggle(f.id)}
              />
            ))}
          </fieldset>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Checkbox, or a radio when given a group name; both share the 14 px box style. */
function FilterBox({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name?: string;
  checked: boolean;
  onChange: () => void;
}) {
  const radio = name !== undefined;
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 type-body-s">
      <input
        type={radio ? "radio" : "checkbox"}
        name={name}
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={`grid size-3.5 shrink-0 place-items-center ${radio ? "rounded-full" : "rounded-[2px]"} border border-ink/20 transition-colors duration-(--duration-fast) peer-checked:bg-check peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink`}
      >
        {checked ? (
          radio ? (
            <span className="size-1.5 rounded-full bg-canvas" />
          ) : (
            <Check size={10} strokeWidth={3} className="text-canvas" />
          )
        ) : null}
      </span>
      <span
        className={`transition-colors duration-(--duration-base) ${checked ? "text-ink" : "text-ink/60 hover:text-ink"}`}
      >
        {label}
      </span>
    </label>
  );
}
