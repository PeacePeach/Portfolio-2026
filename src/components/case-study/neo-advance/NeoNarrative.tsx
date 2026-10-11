"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { X } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { neoAdvanceNarrative as panels } from "@/content/neoAdvance";
import { duration, swap } from "@/design/motion";
import { caseStudyTokens, caseStudyType } from "../shared/caseStudyTokens";
import { useStickyNarrative } from "./useStickyNarrative";

type Panel = (typeof panels)[number];

export function NeoNarrative() {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState<Panel | null>(null);
  const stack = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const { desktop, active } = useStickyNarrative(stack);

  function close() {
    setOpened(null);
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    // A section within a chapter: shared section spacing. Later chapters give
    // the final short panel room to reach the center activation band.
    <section aria-label="Lending platform research and frameworks" style={caseStudyTokens} className="cs-rules cs-section mx-auto w-full max-w-[1152px]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320fr)_minmax(0,704fr)] lg:gap-x-32">
        <StickyNarrativeText id={panels[active].id} title={panels[active].title} body={panels[active].subtitle} />
        <div ref={stack} className="min-w-0 lg:rounded-[20px] lg:bg-surface" data-neo-panels>
          {panels.map(panel => (
            <VisualPanel key={panel.id} panel={panel} scaleEnabled={desktop && !reduce} onOpen={button => {
              trigger.current = button;
              setOpened(panel);
            }} />
          ))}
        </div>
      </div>
      {opened && createPortal(<ImageViewer panel={opened} onClose={close} />, document.body)}
    </section>
  );
}

/** Desktop-only sticky column: the active text swaps with the site swap motion. */
export function StickyNarrativeText({ id, title, body }: { id: string; title: string; body: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="hidden min-w-0 self-start lg:sticky lg:top-[calc(var(--spacing-header)+1.875rem)] lg:block" data-neo-sticky>
      <ScrollReveal>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={id}
            initial={{ opacity: 0, y: reduce ? 0 : swap.offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -swap.offset, transition: reduce ? { duration: duration.fast } : swap.exit }}
            transition={reduce ? { duration: duration.fast } : swap.enter}
          >
            <NarrativeText title={title} body={body} />
          </motion.div>
        </AnimatePresence>
      </ScrollReveal>
    </div>
  );
}

/** Figma 83:3560: Heading M title over Body M, on the shared story-text spacing. */
export function NarrativeText({ title, body }: { title: string; body: string }) {
  return <article className="cs-story-text">
    <h2 className="type-heading-m text-(--cs-bullet-text)">{title}</h2>
    <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{body}</p>
  </article>;
}

function VisualPanel({ panel, scaleEnabled, onOpen }: {
  panel: Panel;
  scaleEnabled: boolean;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start center", "end center"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);
  return (
    <div ref={target} data-neo-panel={panel.id} className="mb-12 lg:mb-0">
      <ScrollReveal className="mb-6 lg:hidden">
        <NarrativeText title={panel.title} body={panel.subtitle} />
      </ScrollReveal>
      <button
        type="button"
        aria-label={`View ${panel.title} in high resolution`}
        aria-haspopup="dialog"
        onClick={event => onOpen(event.currentTarget)}
        className={`relative block w-full cursor-zoom-in appearance-none overflow-hidden border-0 bg-transparent p-0 text-left outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-[color:rgba(255,255,255,0.18)] focus-visible:outline-offset-[-1px] ${panel.id === panels[0].id ? "rounded-t-[20px]" : panel.id === panels[panels.length - 1].id ? "rounded-b-[20px]" : ""}`}
      >
        {panel.id !== panels[0].id && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-px bg-ink/10 lg:block" />}
        <div className="overflow-hidden">
          <motion.div style={{ scale: scaleEnabled ? scale : 1 }} className="origin-center motion-reduce:transform-none!">
            <Image
              src={`/images/neo/${panel.id}.webp`}
              alt={panel.alt}
              width={panel.width}
              height={panel.height}
              unoptimized
              className="block h-auto w-full"
            />
          </motion.div>
        </div>
      </button>
    </div>
  );
}

function ImageViewer({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  function closeViewer() {
    // Release native modality before returning focus to the page trigger.
    dialog.current?.close();
    onClose();
  }
  useEffect(() => {
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      // Portaled to <body>, outside the section's token scope.
      style={caseStudyTokens}
      aria-label={`${panel.title} — high-resolution image`}
      onCancel={event => { event.preventDefault(); closeViewer(); }}
      onKeyDown={event => {
        // The close button is the viewer's sole focusable control.
        if (event.key === "Tab") {
          event.preventDefault();
          event.currentTarget.querySelector("button")?.focus();
        }
      }}
      onClick={event => { if (event.target === event.currentTarget) closeViewer(); }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-6 text-primary backdrop:bg-background/90 open:flex open:items-center open:justify-center"
    >
      <button type="button" autoFocus aria-label="Close image viewer" onClick={closeViewer} className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-(--cs-tma-send-radius) bg-(--cs-tma-send-fill) text-ink/60 transition-colors duration-(--duration-base) ease-out-expo hover:text-primary active:scale-90">
        <X size={18} strokeWidth={1.33} aria-hidden />
      </button>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: duration.fast } : swap.enter} className="pointer-events-none flex max-h-full max-w-full items-center justify-center">
        <Image
          src={`/images/neo/${panel.id}-full.webp`}
          alt={panel.alt}
          width={panel.fullWidth}
          height={panel.fullHeight}
          unoptimized
          loading="eager"
          className="pointer-events-auto block h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full object-contain"
        />
      </motion.div>
    </dialog>
  );
}
