"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PenTool, Send } from "react-feather";
import { duration } from "@/design/motion";
import { StoryTextBlock, type StoryTextBlockData } from "../StoryTextBlock";
import { caseStudyMotion } from "../caseStudyMotion";
import { caseStudyTokens, caseStudyType } from "../caseStudyTokens";
import { QuickReplyChip } from "./QuickReplyChip";
import { ThinkingIndicator, thinkingDuration } from "./ThinkingIndicator";

type Shared = {
  eyebrow: string;
  title: string;
  placeholder?: string;
  /** Accessible name of the send control. */
  sendLabel?: string;
};

/** Figma 99:39795: ask what the viewer would do, then reveal what happened. */
export type TellMeAboutItPromptData = Shared & {
  variant: "prompt";
  resolved: StoryTextBlockData;
  skipLabel?: string;
  loadingLabel?: string;
};

/** Figma 99:39796: lightweight, local-only case-study feedback. */
export type TellMeAboutItFeedbackData = Shared & {
  variant: "feedback";
  quickReplies?: readonly string[];
  /** Screen-reader confirmation after sending; nothing visible changes. */
  sentAnnouncement?: string;
};

export type TellMeAboutItData = TellMeAboutItPromptData | TellMeAboutItFeedbackData;

/**
 * Interaction and state only. Callers (templates, sections) own the grid,
 * chapter layout and page spacing.
 */
export function TellMeAboutIt(props: TellMeAboutItData & { onSubmit?: (response: string) => void }) {
  return <div className="cs-rules cs-tma" style={caseStudyTokens} data-variant={props.variant}>
    {props.variant === "prompt" ? <PromptInteraction {...props} /> : <FeedbackInteraction {...props} />}
  </div>;
}

type Stage = "idle" | "loading" | "resolved";

function PromptInteraction({ eyebrow, title, placeholder, sendLabel = "Send response and reveal the story", resolved, skipLabel = "Skip and reveal", loadingLabel = "Here’s what I did ...", onSubmit }: TellMeAboutItPromptData & { onSubmit?: (response: string) => void }) {
  const reduce = useReducedMotion();
  const timing = caseStudyMotion(reduce);
  const [response, setResponse] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  // Hold the prompt's height while thinking so the section doesn't collapse.
  const [heldHeight, setHeldHeight] = useState<number>();
  const slot = useRef<HTMLDivElement>(null);
  const loading = useRef<HTMLDivElement>(null);
  const resolution = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage !== "loading") return;
    const timer = window.setTimeout(
      () => setStage("resolved"),
      (reduce ? duration.fast * 3 : thinkingDuration) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [stage, reduce]);

  function reveal(submitted?: string) {
    if (stage !== "idle") return;
    if (submitted) onSubmit?.(submitted);
    setHeldHeight(slot.current?.offsetHeight);
    setStage("loading");
  }

  const exit = { opacity: 0, y: -timing.hidden.y, transition: timing.exit };

  return <div ref={slot} data-stage={stage} style={stage === "loading" ? { minHeight: heldHeight } : undefined} className="cs-tma-slot">
    <AnimatePresence mode="wait" initial={false}>
      {stage === "idle" ? (
        <motion.div key="idle" initial={{ opacity: 1 }} exit={exit}>
          <ResponseForm
            eyebrow={eyebrow}
            title={title}
            titleClassName={caseStudyType.storyTitle}
            value={response}
            onChange={setResponse}
            onSend={() => reveal(response.trim())}
            placeholder={placeholder}
            sendLabel={sendLabel}
            action={<button type="button" onClick={() => reveal()} className="cs-tma-skip hover-underline type-body-s">{skipLabel}</button>}
          />
        </motion.div>
      ) : stage === "loading" ? (
        <motion.div
          key="loading"
          className="cs-tma-thinking-slot"
          initial={timing.hidden}
          animate={{ ...timing.shown, transition: timing.enter }}
          exit={exit}
          onAnimationComplete={() => loading.current?.focus({ preventScroll: true })}
        >
          <ThinkingIndicator ref={loading} label={loadingLabel} reduce={reduce} />
        </motion.div>
      ) : (
        <motion.div
          key="resolved"
          ref={resolution}
          tabIndex={-1}
          className="cs-tma-resolved"
          initial={timing.hidden}
          animate={{ ...timing.shown, transition: timing.enter }}
          onAnimationComplete={() => resolution.current?.focus({ preventScroll: true })}
        >
          <StoryTextBlock {...resolved} />
        </motion.div>
      )}
    </AnimatePresence>
  </div>;
}

function FeedbackInteraction({ eyebrow, title, placeholder, sendLabel = "Send feedback", quickReplies = [], sentAnnouncement = "Feedback sent.", onSubmit }: TellMeAboutItFeedbackData & { onSubmit?: (response: string) => void }) {
  const [response, setResponse] = useState("");
  // Local only; announced to assistive tech, visually neutral.
  const [sent, setSent] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);

  function send() {
    const value = response.trim();
    if (!value) return;
    onSubmit?.(value);
    setResponse("");
    setSent(true);
  }

  return <>
    <ResponseForm
      eyebrow={eyebrow}
      title={title}
      titleClassName="type-heading-m"
      fieldRef={field}
      value={response}
      onChange={(value) => { setResponse(value); setSent(false); }}
      onSend={send}
      placeholder={placeholder}
      sendLabel={sendLabel}
      leading={quickReplies.length > 0 && <div className="cs-tma-chips">
        {quickReplies.map((reply) => <QuickReplyChip
          key={reply}
          selected={response === reply}
          onClick={() => {
            setResponse(reply);
            setSent(false);
            field.current?.focus();
          }}
        >{reply}</QuickReplyChip>)}
      </div>}
    />
    <p role="status" className="sr-only">{sent ? sentAnnouncement : ""}</p>
  </>;
}

/** Shared header, field shell and send control for every variant. */
function ResponseForm({ eyebrow, title, titleClassName, value, onChange, onSend, placeholder, sendLabel, leading, action, fieldRef }: {
  eyebrow: string;
  title: string;
  titleClassName: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  sendLabel: string;
  leading?: ReactNode;
  action?: ReactNode;
  fieldRef?: Ref<HTMLTextAreaElement>;
}) {
  const id = useId();
  const empty = !value.trim();

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (!empty) onSend();
    }
  }

  return <form
    className="cs-tma-form"
    onSubmit={(event) => {
      event.preventDefault();
      if (!empty) onSend();
    }}
  >
    <div className="cs-tma-header">
      <p className={`cs-tma-eyebrow ${caseStudyType.chapterLabel}`}>
        <PenTool className="cs-tma-eyebrow-icon" strokeWidth={1.33} aria-hidden />
        {eyebrow}
      </p>
      <label htmlFor={id} className={`cs-tma-title ${titleClassName}`}>{title}</label>
    </div>
    <div className="cs-tma-field">
      {leading}
      <textarea
        id={id}
        ref={fieldRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="cs-tma-input type-body-s"
      />
      <div className="cs-tma-actions">
        {action}
        <button type="submit" disabled={empty} aria-label={sendLabel} className="cs-tma-send">
          <Send size={18} strokeWidth={1.33} aria-hidden />
        </button>
      </div>
    </div>
  </form>;
}
