"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Edit2, Grid, Heart } from "react-feather";
import type { PowerFragment } from "@/content/types";
import { workCopy } from "@/content/work";
import { useLike } from "@/lib/likes";

const kinds = {
  case: { icon: Grid, ...workCopy.fragment.case },
  story: { icon: BookOpen, ...workCopy.fragment.story },
};

/**
 * Super power fragment (Figma 25:538). Every card in a breakpoint has the same
 * size: the image box and the copy area are fixed, so longer text never
 * stretches a card. Sizes step up at sm.
 */
export function PowerFragmentCard({ fragment }: { fragment: PowerFragment }) {
  const kind = kinds[fragment.kind];
  const Icon = kind.icon;
  const { liked, toggle } = useLike(fragment.id);

  // The whole card is clickable through the stretched link; the like button sits above it.
  return (
    <article
      className="group relative rounded-[10px] border border-ink/10 bg-card transition-colors duration-(--duration-underline) ease-out-expo hover:bg-card-hover has-focus-visible:bg-card-hover [--frag-img-h:8.875rem] [--frag-img-w:6.5rem] [--frag-text-h:8.8125rem] sm:[--frag-img-h:11.1875rem] sm:[--frag-img-w:8.1875rem] sm:[--frag-text-h:12.75rem]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 pt-5 pb-3 type-body-s text-ink/60">
        <span className="flex items-center gap-2">
          <Icon size={18} strokeWidth={1.33} aria-hidden />
          {kind.label}
        </span>
        <Link
          href={`/work/${fragment.project}`}
          aria-label={`${kind.action}: ${fragment.title}`}
          className="flex items-center gap-1 rounded-[10px] outline-offset-4 after:absolute after:inset-0 after:z-[1] after:rounded-[10px]"
        >
          <span className="hover-underline">{kind.action}</span>
          <ArrowRight size={18} strokeWidth={1.33} aria-hidden />
        </Link>
      </div>

      <div className="flex gap-5 px-5 pt-[1.375rem] pb-5">
        <div className="flex shrink-0 flex-col items-center gap-6">
          <div className="relative h-(--frag-img-h) w-(--frag-img-w)">
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
          <div className="flex h-[1.125rem] items-center gap-3 type-body-xs text-ink">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={liked}
              aria-label={`Like ${fragment.title}`}
              className="relative z-[2] flex cursor-pointer items-center gap-1 transition-transform duration-(--duration-fast) active:scale-90"
            >
              <Heart size={16} strokeWidth={1.33} fill={liked ? "currentColor" : "none"} aria-hidden />
              {fragment.likes + (liked ? 1 : 0)}
            </button>
            {/* Visitor responses on the detail page (planned); counts up with each one. */}
            <span className="flex items-center gap-1" aria-label={`${fragment.notes} responses`}>
              <Edit2 size={16} strokeWidth={1.33} aria-hidden />
              {fragment.notes}
            </span>
          </div>
        </div>

        {/* Fixed height; copy that runs long fades out rather than growing the card. */}
        <div className="flex h-(--frag-text-h) min-w-0 flex-1 flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-1.5rem),transparent)]">
          <h3 className="type-display-xs text-ink">{fragment.title}</h3>
          <p className="type-body-s text-ink/60">{fragment.body}</p>
        </div>
      </div>
    </article>
  );
}
