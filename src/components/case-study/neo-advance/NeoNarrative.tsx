"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { X, ZoomIn, ZoomOut } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Pill } from "@/design-system";
import { neoAdvanceNarrative } from "@/content/neoAdvance";
import { duration, swap } from "@/design/motion";
import { caseStudyTokens, caseStudyType } from "../shared/caseStudyTokens";
import { useStickyNarrative } from "./useStickyNarrative";

/** One rolling-narrative step: pinned text beside `/images/neo/{id}.webp`, zoomable to `{id}-full.webp`. */
export type NarrativePanel = {
  id: string; title: string; subtitle: string; alt: string;
  width: number; height: number; fullWidth: number; fullHeight: number;
  /** Optional text action that opens the high-resolution view. */
  details?: string;
};
type Panel = NarrativePanel;

export function NeoNarrative({ panels = neoAdvanceNarrative, label = "Lending platform research and frameworks" }: { panels?: readonly NarrativePanel[]; label?: string }) {
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
    <section aria-label={label} style={caseStudyTokens} className="cs-rules cs-section mx-auto w-full max-w-[1152px]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320fr)_minmax(0,704fr)] lg:gap-x-32">
        <StickyNarrativeText id={panels[active].id} title={panels[active].title} body={panels[active].subtitle} action={panels[active].details && (
          <DetailsButton label={panels[active].details} onClick={button => { trigger.current = button; setOpened(panels[active]); }} />
        )} />
        <div ref={stack} className="min-w-0 lg:rounded-[20px] lg:bg-surface" data-neo-panels>
          {panels.map(panel => (
            <VisualPanel key={panel.id} panel={panel} first={panel === panels[0]} last={panel === panels[panels.length - 1]} scaleEnabled={desktop && !reduce} onOpen={button => {
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
export function StickyNarrativeText({ id, title, body, action }: { id: string; title: string; body: string; action?: ReactNode }) {
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
            {action}
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

/** Figma 98:577: opens the active panel's high-resolution view. */
function DetailsButton({ label, onClick }: { label: string; onClick: (button: HTMLButtonElement) => void }) {
  return <button type="button" aria-haspopup="dialog" onClick={event => onClick(event.currentTarget)} className="mt-6 cursor-pointer">
    <Pill appearance="evidence" emphasis="primary">{label}</Pill>
  </button>;
}

function VisualPanel({ panel, first, last, scaleEnabled, onOpen }: {
  panel: Panel;
  first: boolean;
  last: boolean;
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
        className={`relative block w-full cursor-zoom-in appearance-none overflow-hidden border-0 bg-transparent p-0 text-left outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-[color:rgba(255,255,255,0.18)] focus-visible:outline-offset-[-1px] ${first ? "rounded-t-[20px]" : ""} ${last ? "rounded-b-[20px]" : ""}`}
      >
        {!first && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-px bg-ink/10 lg:block" />}
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

/**
 * Fit-to-screen viewer. Zoom (button, or click the image) shows the image at
 * half its pixel size (sharp on 2x screens); drag or scroll to pan, and the
 * clicked point stays under the pointer.
 */
function ImageViewer({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const focus = useRef<{ fx: number; fy: number; cx: number; cy: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const reduce = useReducedMotion();
  // Half the pixel width stays sharp on 2x screens; small images still zoom past the fitted size.
  const zoomWidth = Math.max(panel.fullWidth / 2, typeof window === "undefined" ? 0 : window.innerWidth * 1.5);
  function closeViewer() {
    // Release native modality before returning focus to the page trigger.
    dialog.current?.close();
    onClose();
  }
  /** Toggle zoom; `point` keeps that spot of the image under the pointer. */
  function toggle(point?: { clientX: number; clientY: number; rect: DOMRect }) {
    if (!zoomed) {
      const rect = point?.rect;
      focus.current = rect && point
        ? { fx: (point.clientX - rect.left) / rect.width, fy: (point.clientY - rect.top) / rect.height, cx: point.clientX, cy: point.clientY }
        : { fx: 0.5, fy: 0.5, cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
    }
    setZoomed(!zoomed);
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
  useEffect(() => {
    const el = scroller.current, f = focus.current;
    if (!zoomed || !el || !f) return;
    const height = zoomWidth * panel.fullHeight / panel.fullWidth;
    el.scrollTo({ left: f.fx * zoomWidth - f.cx, top: f.fy * height - f.cy });
  }, [zoomed, zoomWidth, panel.fullHeight, panel.fullWidth]);

  const control = "flex size-8 cursor-pointer items-center justify-center rounded-(--cs-tma-send-radius) bg-(--cs-tma-send-fill) text-ink/60 transition-colors duration-(--duration-base) ease-out-expo hover:text-primary active:scale-90";
  const image = (className: string, style?: React.CSSProperties) => <Image
    src={`/images/neo/${panel.id}-full.webp`}
    alt={panel.alt}
    width={panel.fullWidth}
    height={panel.fullHeight}
    unoptimized
    loading="eager"
    draggable={false}
    style={style}
    className={className}
  />;

  return (
    <dialog
      ref={dialog}
      // Portaled to <body>, outside the section's token scope.
      style={caseStudyTokens}
      aria-label={`${panel.title} — high-resolution image`}
      onCancel={event => { event.preventDefault(); closeViewer(); }}
      onKeyDown={event => {
        // Keep focus on the viewer's controls.
        if (event.key !== "Tab") return;
        event.preventDefault();
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-viewer-control]"));
        const index = controls.indexOf(document.activeElement as HTMLButtonElement);
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
      }}
      onClick={event => { if (event.target === event.currentTarget) closeViewer(); }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-6 text-primary backdrop:bg-background/90 open:flex open:items-center open:justify-center"
    >
      {zoomed ? (
        <div
          ref={scroller}
          className="absolute inset-0 cursor-grab overflow-auto overscroll-contain active:cursor-grabbing"
          onPointerDown={event => {
            const el = event.currentTarget;
            drag.current = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop, moved: false };
          }}
          onPointerMove={event => {
            const d = drag.current;
            if (!d || !event.buttons) return;
            if (Math.abs(event.clientX - d.x) + Math.abs(event.clientY - d.y) > 4) d.moved = true;
            event.currentTarget.scrollTo({ left: d.left - (event.clientX - d.x), top: d.top - (event.clientY - d.y) });
          }}
          onPointerUp={() => {
            // A click without dragging zooms back out.
            if (drag.current && !drag.current.moved) setZoomed(false);
            drag.current = null;
          }}
        >
          {image("block h-auto max-w-none", { width: zoomWidth })}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: duration.fast } : swap.enter} className="flex max-h-full max-w-full items-center justify-center">
          <button type="button" tabIndex={-1} aria-hidden onClick={event => toggle({ clientX: event.clientX, clientY: event.clientY, rect: event.currentTarget.getBoundingClientRect() })} className="block cursor-zoom-in border-0 bg-transparent p-0">
            {image("block h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full object-contain")}
          </button>
        </motion.div>
      )}
      <div className="absolute top-4 right-4 flex gap-2">
        <button type="button" data-viewer-control aria-pressed={zoomed} aria-label={zoomed ? "Zoom out" : "Zoom in"} onClick={() => toggle()} className={control}>
          {zoomed ? <ZoomOut size={18} strokeWidth={1.33} aria-hidden /> : <ZoomIn size={18} strokeWidth={1.33} aria-hidden />}
        </button>
        <button type="button" data-viewer-control autoFocus aria-label="Close image viewer" onClick={closeViewer} className={control}>
          <X size={18} strokeWidth={1.33} aria-hidden />
        </button>
      </div>
    </dialog>
  );
}
