"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Edit2, Grid, Heart } from "react-feather";
import type { PowerFragment } from "@/content/types";
import { workCopy } from "@/content/work";
import { useLike } from "@/lib/likes";

/** Counters keep a fixed width so a like never shifts the pencil beside it. */
const count = "min-w-[2ch] text-left tabular-nums";

const kinds = {
  case: { icon: Grid, ...workCopy.fragment.case },
  story: { icon: BookOpen, ...workCopy.fragment.story },
};

/**
 * Super power fragment (Figma 25:538, wide layout 27:1695). Every card in a
 * breakpoint has the same size: the image box and row height are fixed and
 * the copy is clamped (title 2 lines, body 6). Image size steps up at sm.
 * Hover lightens the card and turns the call to action white.
 */
export function PowerFragmentCard({ fragment }: { fragment: PowerFragment }) {
  const kind = kinds[fragment.kind];
  const Icon = kind.icon;
  const { liked, toggle } = useLike(fragment.id);

  // The whole card is clickable through the stretched link; the like button sits above it.
  return (
    <article className="group relative rounded-[10px] border border-ink/10 bg-card transition-colors duration-(--duration-underline) ease-out-expo hover:bg-card-hover has-focus-visible:bg-card-hover [--frag-body-h:13.75rem] [--frag-img-h:8.875rem] [--frag-img-w:6.5rem] sm:[--frag-img-h:11.1875rem] sm:[--frag-img-w:8.1875rem]">
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 pt-5 pb-3 type-body-s text-ink/60">
        <span className="flex items-center gap-2">
          <Icon size={18} strokeWidth={1.33} aria-hidden />
          {kind.label}
        </span>
        <Link
          href={`/work/${fragment.project}`}
          aria-label={`${kind.action}: ${fragment.title}`}
          className="flex items-center gap-1 rounded-[10px] outline-offset-4 transition-colors duration-(--duration-underline) ease-out-expo group-hover:text-ink group-has-focus-visible:text-ink after:absolute after:inset-0 after:z-[1] after:rounded-[10px]"
        >
          <span>{kind.action}</span>
          <ArrowRight size={18} strokeWidth={1.33} aria-hidden />
        </Link>
      </div>

      {/* Image and copy sit centred side by side. The row height fits the longest
          allowed copy (two-line title, six-line body, counters), so every card
          in a breakpoint is the same size whatever the text. */}
      <div className="flex h-[calc(var(--frag-body-h)+2.625rem)] items-center gap-5 px-5 pt-[1.375rem] pb-5">
        <div className="relative h-(--frag-img-h) w-(--frag-img-w) shrink-0">
          {fragment.image ? (
            <div className="absolute inset-0 animate-float">
              <Image
                src={fragment.image.src}
                alt={fragment.image.alt}
                fill
                sizes="8.25rem"
                unoptimized={fragment.image.src.endsWith(".svg")}
                className="object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h3 className="line-clamp-2 type-display-xs text-ink">{fragment.title}</h3>
            <p className="line-clamp-6 type-body-s text-ink/60">{fragment.body}</p>
          </div>
          <div className="flex h-[1.125rem] items-center gap-1.5 type-body-xs text-ink">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={liked}
              aria-label={`Like ${fragment.title}`}
              className="relative z-[2] flex cursor-pointer items-center gap-1 transition-transform duration-(--duration-fast) active:scale-90"
            >
              <Heart size={16} strokeWidth={1.33} fill={liked ? "currentColor" : "none"} aria-hidden />
              <span className={count}>{fragment.likes + (liked ? 1 : 0)}</span>
            </button>
            {/* Visitor responses, added on the detail page (planned). Display only here. */}
            <span className="flex items-center gap-1" aria-label={`${fragment.notes} responses`}>
              <Edit2 size={16} strokeWidth={1.33} aria-hidden />
              <span className={count}>{fragment.notes}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
