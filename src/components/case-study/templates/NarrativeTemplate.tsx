"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { X, ZoomIn, ZoomOut } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { duration, swap } from "@/design/motion";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { StoryTextBlock } from "../shared/StoryTextBlock";
import { EvidencePill } from "../shared/EvidencePill";
import { useStickyNarrative } from "../shared/useStickyNarrative";

export type NarrativeImage = {
  src: string; alt: string; width: number; height: number;
  /** High-resolution export for the zoom viewer; without it the image is not zoomable. */
  full?: { src: string; width: number; height: number };
  /** Optional evidence pill above the image, e.g. Before / After (shared `EvidencePill`, 16px above). */
  pill?: { label: string; emphasis?: "primary" | "secondary" };
};

/** One text block and the images it sits beside. */
export type NarrativeStep = {
  id: string; label?: string; title: string; body: string;
  images: readonly NarrativeImage[];
  /** Optional text action that opens the first image's high-resolution view. */
  details?: string;
};

/**
 * `joined`: one rounded surface, dividers between images, scroll scaling (Figma 83:3560).
 * `separate`: each image its own bordered card, 16px apart (Figma 116:667).
 * `plain`: images only, no surface, rounding or scaling (Figma 89:5173).
 */
export type NarrativeImageLayout = "joined" | "separate" | "plain";

export type NarrativeData = {
  label: string;
  steps: readonly NarrativeStep[];
  imageLayout?: NarrativeImageLayout;
};

type Opened = { title: string; image: NarrativeImage & { full: NonNullable<NarrativeImage["full"]> } };

/**
 * Text pinned beside scrolling images. Several steps roll: the pinned text
 * swaps as each step's images reach it. One step keeps its text static.
 */
export function NarrativeTemplate({ label, steps, imageLayout = "joined" }: NarrativeData) {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState<Opened | null>(null);
  const stack = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const { desktop, active } = useStickyNarrative(stack);
  const step = steps[active] ?? steps[0];
  const joined = imageLayout === "joined";
  const allImages = steps.flatMap(s => s.images);
  // Pill-labelled images read as blocks: 16px pill to image, 32px within a step, 64px between steps.
  const labelled = allImages.some(image => image.pill);

  function open(button: HTMLButtonElement, title: string, image: NarrativeImage) {
    if (!image.full) return;
    trigger.current = button;
    setOpened({ title, image: { ...image, full: image.full } });
  }
  function close() {
    setOpened(null);
    trigger.current?.focus({ preventScroll: true });
  }
  const zoomTarget = step.images.find(image => image.full);

  return (
    <section aria-label={label} style={caseStudyTokens} className="cs-rules cs-section mx-auto w-full max-w-[1152px]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320fr)_minmax(0,704fr)] lg:gap-x-32">
        <StickyNarrativeText id={step.id} label={step.label} title={step.title} body={step.body} action={step.details && zoomTarget && (
          <DetailsButton label={step.details} onClick={button => open(button, step.title, zoomTarget)} />
        )} />
        <div ref={stack} className={`min-w-0 ${joined ? "lg:rounded-[20px] lg:bg-surface" : ""} ${imageLayout === "separate" ? `lg:flex lg:flex-col ${labelled ? "lg:gap-16" : "lg:gap-4"}` : ""}`}>
          {steps.map(s => (
            <div key={s.id} data-narrative-step={s.id} className="mb-12 lg:mb-0">
              <ScrollReveal className="mb-6 lg:hidden">
                <StoryTextBlock heading="section" label={s.label} title={s.title} body={s.body} />
              </ScrollReveal>
              <div className={imageLayout === "separate" ? `flex flex-col ${labelled ? "gap-8" : "gap-4"}` : ""}>
                {s.images.map(image => (
                  <NarrativeFrame
                    key={image.src}
                    image={image}
                    title={s.title}
                    layout={imageLayout}
                    first={image === allImages[0]}
                    last={image === allImages[allImages.length - 1]}
                    scaleEnabled={joined && desktop && !reduce}
                    onOpen={button => open(button, s.title, image)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {opened && createPortal(<ImageViewer title={opened.title} image={opened.image} onClose={close} />, document.body)}
    </section>
  );
}

/** Desktop-only sticky column: the active text swaps with the site swap motion. */
export function StickyNarrativeText({ id, label, title, body, action }: { id: string; label?: string; title: string; body: string; action?: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <div className="hidden min-w-0 self-start lg:sticky lg:top-[calc(var(--spacing-header)+1.875rem)] lg:block" data-narrative-sticky>
      <ScrollReveal>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={id}
            initial={{ opacity: 0, y: reduce ? 0 : swap.offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -swap.offset, transition: reduce ? { duration: duration.fast } : swap.exit }}
            transition={reduce ? { duration: duration.fast } : swap.enter}
          >
            <StoryTextBlock heading="section" label={label} title={title} body={body} />
            {action}
          </motion.div>
        </AnimatePresence>
      </ScrollReveal>
    </div>
  );
}

/** Figma 98:577: opens the active step's high-resolution view. */
function DetailsButton({ label, onClick }: { label: string; onClick: (button: HTMLButtonElement) => void }) {
  return <button type="button" aria-haspopup="dialog" onClick={event => onClick(event.currentTarget)} className="type-body-s mt-6 h-[34px] cursor-pointer rounded-control border border-(--cs-secondary) bg-(--cs-tab-selected-fill) px-8 text-(--cs-primary) transition-colors duration-(--duration-base) ease-out-expo hover:border-(--cs-primary)">
    {label}
  </button>;
}

function NarrativeFrame({ image, title, layout, first, last, scaleEnabled, onOpen }: {
  image: NarrativeImage;
  title: string;
  layout: NarrativeImageLayout;
  first: boolean;
  last: boolean;
  scaleEnabled: boolean;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start center", "end center"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);
  const joined = layout === "joined";
  const frame = layout === "separate"
    ? "rounded-surface border border-ink/10"
    : joined ? `${first ? "rounded-t-[20px]" : ""} ${last ? "rounded-b-[20px]" : ""}` : "";
  const picture = <>
    {joined && !first && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-px bg-ink/10 lg:block" />}
    <div className="overflow-hidden">
      <motion.div style={{ scale: scaleEnabled ? scale : 1 }} className="origin-center motion-reduce:transform-none!">
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized className="block h-auto w-full" />
      </motion.div>
    </div>
  </>;
  const button = image.full && (
    <button
      type="button"
      aria-label={`View ${title} in high resolution`}
      aria-haspopup="dialog"
      onClick={event => onOpen(event.currentTarget)}
      className={`relative block w-full cursor-zoom-in appearance-none overflow-hidden border-0 bg-transparent p-0 text-left outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-[color:rgba(255,255,255,0.18)] focus-visible:outline-offset-[-1px] ${frame}`}
    >
      {picture}
    </button>
  );
  // A pill and its image reveal together as one block, so a pill never shows above an empty space.
  if (image.pill) return (
    <div ref={target}>
      <ScrollReveal className="flex flex-col items-start gap-4">
        <EvidencePill label={image.pill.label} emphasis={image.pill.emphasis} />
        {button || <div className={`relative w-full overflow-hidden ${frame}`}>{picture}</div>}
      </ScrollReveal>
    </div>
  );
  return (
    <div ref={target}>
      {button || <ScrollReveal className={`relative overflow-hidden ${frame}`}>{picture}</ScrollReveal>}
    </div>
  );
}

/**
 * Fit-to-screen viewer. Zoom (button, or click the image) shows the image at
 * half its pixel size (sharp on 2x screens); drag or scroll to pan, and the
 * clicked point stays under the pointer.
 */
function ImageViewer({ title, image: { alt, full }, onClose }: { title: string; image: Opened["image"]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const focus = useRef<{ fx: number; fy: number; cx: number; cy: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const reduce = useReducedMotion();
  // Half the pixel width stays sharp on 2x screens; small images still zoom past the fitted size.
  const zoomWidth = Math.max(full.width / 2, typeof window === "undefined" ? 0 : window.innerWidth * 1.5);
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
    const height = zoomWidth * full.height / full.width;
    el.scrollTo({ left: f.fx * zoomWidth - f.cx, top: f.fy * height - f.cy });
  }, [zoomed, zoomWidth, full.height, full.width]);

  const control = "flex size-8 cursor-pointer items-center justify-center rounded-(--cs-tma-send-radius) bg-(--cs-tma-send-fill) text-ink/60 transition-colors duration-(--duration-base) ease-out-expo hover:text-primary active:scale-90";
  const picture = (className: string, style?: React.CSSProperties) => <Image
    src={full.src}
    alt={alt}
    width={full.width}
    height={full.height}
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
      aria-label={`${title} — high-resolution image`}
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
          {picture("block h-auto max-w-none", { width: zoomWidth })}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: duration.fast } : swap.enter} className="flex max-h-full max-w-full items-center justify-center">
          <button type="button" tabIndex={-1} aria-hidden onClick={event => toggle({ clientX: event.clientX, clientY: event.clientY, rect: event.currentTarget.getBoundingClientRect() })} className="block cursor-zoom-in border-0 bg-transparent p-0">
            {picture("block h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full object-contain")}
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
