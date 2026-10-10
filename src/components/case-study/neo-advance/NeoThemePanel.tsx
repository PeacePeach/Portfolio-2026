"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle, XCircle } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { neoHiFiThemes, type NeoHiFiTheme, type NeoThemeState } from "@/content/neoHiFiThemes";
import { duration, swap } from "@/design/motion";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { NeoThemeFrame } from "./NeoThemeFrame";
import "./NeoThemePanel.css";

const ids = neoHiFiThemes.map(theme => theme.id);

export function NeoThemePanel() {
  const [active, setActive] = useState(ids[0]);
  const reduce = useReducedMotion();
  const theme = neoHiFiThemes.find(theme => theme.id === active)!;
  return (
    <ScrollReveal variant="mask" className="mx-auto w-full max-w-[1152px]">
      <section className="neo-theme-panel" aria-label="Hi-fi exploration evidence">
        <ThemeTabs active={active} onSelect={setActive} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id={`neo-${active}-panel`}
            role="tabpanel"
            aria-labelledby={`neo-${active}-tab`}
            tabIndex={0}
            className="neo-theme-content"
            initial={{ opacity: 0, y: reduce ? 0 : swap.offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -swap.offset, transition: reduce ? { duration: duration.fast } : swap.exit }}
            transition={reduce ? { duration: duration.fast } : swap.enter}
          >
            <ThemeHeader theme={theme} />
            <div className={`neo-theme-evidence ${theme.id === "theme-1" ? "neo-theme-pairedTested" : theme.id === "theme-3" ? "neo-theme-pairedRefined" : "neo-theme-threeStates"}`}>
              {theme.states.map(state => <EvidenceColumn key={state.label} state={state} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </ScrollReveal>
  );
}

function ThemeTabs({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const { register, onKeyDown } = useRovingTabs(ids, active, onSelect);
  return (
    <div role="tablist" aria-label="Research themes" className="neo-theme-tabs" onKeyDown={onKeyDown}>
      {neoHiFiThemes.map(theme => (
        <button key={theme.id} ref={register(theme.id)} type="button" role="tab"
          id={`neo-${theme.id}-tab`} aria-controls={`neo-${theme.id}-panel`}
          aria-selected={active === theme.id} tabIndex={active === theme.id ? 0 : -1}
          onClick={() => onSelect(theme.id)}>{theme.tab}</button>
      ))}
    </div>
  );
}

function ThemeHeader({ theme }: { theme: NeoHiFiTheme }) {
  return (
    <header className="neo-theme-header">
      <p className="neo-theme-meta">{theme.label}</p>
      <h3 className={`type-display-s neo-theme-title`}>{theme.title}</h3>
      <p className="neo-theme-description">{theme.description}</p>
    </header>
  );
}

function EvidenceColumn({ state }: { state: NeoThemeState }) {
  return (
    <div className="neo-theme-column" data-evidence-state={state.label}>
      <EvidencePill label={state.label} />
      <div className="neo-theme-visuals">
        {state.frames.map(frame => <NeoThemeFrame key={frame.layers[0].src} frame={frame} />)}
      </div>
      <ul className={`neo-theme-bullets ${state.label === "Tested" ? "neo-theme-testedBullets" : ""}`}>
        {state.bullets.map(bullet => <EvidenceBullet key={bullet.text} bullet={bullet} />)}
      </ul>
    </div>
  );
}

function EvidencePill({ label }: { label: NeoThemeState["label"] }) {
  return <span className="neo-theme-pill" data-refined={label === "Refined"}>{label}</span>;
}

function EvidenceBullet({ bullet }: { bullet: NeoThemeState["bullets"][number] }) {
  const Icon = bullet.kind === "positive" ? CheckCircle : XCircle;
  return <li className="neo-theme-bullet"><Icon aria-hidden="true" size={16} strokeWidth={1.5} color={bullet.kind === "positive" ? "#65C466" : "#E1747A"} /><span>{bullet.text}</span></li>;
}
