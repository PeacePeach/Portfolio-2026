"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Capability, Project } from "@/content/types";
import type { EvidenceItem } from "@/content";
import { site } from "@/content/site";
import { swap } from "@/design/motion";
import { ModeSelector, type ModeOption } from "./ModeSelector";
import { ProjectGallery } from "./ProjectGallery";
import { CapabilitySelector } from "./CapabilitySelector";
import { EvidencePreview } from "./EvidencePreview";

type Mode = "project" | "capability";

/** Ask AI will join this list in a later version. */
const MODES: readonly ModeOption<Mode>[] = [
  { id: "project", label: "Project" },
  { id: "capability", label: "Capability" },
];

/**
 * Section 02. Visitors pick a mental model: whole projects, or evidence of
 * a capability across projects. State is mirrored to the URL
 * (?view=capability&capability=design-systems#explore) so views can be shared.
 */
export function ExploreSection({
  id,
  projects,
  capabilities,
  evidence,
}: {
  id: string;
  projects: Project[];
  capabilities: Capability[];
  evidence: Record<string, EvidenceItem[]>;
}) {
  const [mode, setMode] = useState<Mode>("project");
  const [capabilityId, setCapabilityId] = useState(capabilities[0]?.id ?? "");

  // Restore from URL after hydration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const cap = params.get("capability");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from URL */
    if (view === "project" || view === "capability") setMode(view);
    if (cap && capabilities.some((c) => c.id === cap)) {
      setMode("capability");
      setCapabilityId(cap);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [capabilities]);

  const syncUrl = useCallback((m: Mode, cap: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", m);
    if (m === "capability") url.searchParams.set("capability", cap);
    else url.searchParams.delete("capability");
    window.history.replaceState(null, "", url);
  }, []);

  const changeMode = (m: Mode) => {
    setMode(m);
    syncUrl(m, capabilityId);
  };
  const changeCapability = (c: string) => {
    setCapabilityId(c);
    syncUrl("capability", c);
  };

  const counts = Object.fromEntries(capabilities.map((c) => [c.id, evidence[c.id]?.length ?? 0]));
  const activeCapability = capabilities.find((c) => c.id === capabilityId) ?? capabilities[0];

  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className="container-page pt-section outline-none">
      <div className="grid-page items-end gap-y-8 border-t border-line pt-6">
        <p className="type-label-s col-span-4 md:col-span-3 text-ink-muted">
          02 <span className="text-ink-faint">{"//"}</span> 02
        </p>
        <p className="type-label-s col-span-4 md:col-span-4 md:col-start-9 text-ink-muted">{site.explore.intro}</p>
      </div>

      <h2 id={`${id}-title`} className="mt-10 type-display-l uppercase md:mt-16">
        {site.explore.title}
      </h2>

      <div className="mt-14 md:mt-20">
        <ModeSelector modes={MODES} active={mode} onChange={changeMode} idPrefix={`${id}-mode`} />
      </div>

      <div id={`${id}-mode-panel`} role="tabpanel" aria-labelledby={`${id}-mode-tab-${mode}`} className="mt-14 md:mt-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: swap.offset * 2 }}
            animate={{ opacity: 1, y: 0, transition: { ...swap.enter, duration: 0.7 } }}
            exit={{ opacity: 0, transition: swap.exit }}
          >
            {mode === "project" ? (
              <ProjectGallery projects={projects} />
            ) : (
              <div className="grid-page gap-y-10">
                <div className="col-span-4 md:col-span-5">
                  <div className="md:sticky md:top-24">
                    <CapabilitySelector
                      capabilities={capabilities}
                      counts={counts}
                      active={activeCapability.id}
                      onChange={changeCapability}
                      idPrefix={`${id}-cap`}
                    />
                  </div>
                </div>
                <div className="col-span-4 md:col-span-6 md:col-start-7">
                  <EvidencePreview
                    capability={activeCapability}
                    items={evidence[activeCapability.id] ?? []}
                    idPrefix={`${id}-cap`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
