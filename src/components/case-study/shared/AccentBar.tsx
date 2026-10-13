/** 4 px rounded accent bar, bright at the top and fading to 20% (Reflection headline, pillar items, testimonials). Stretches to its row. */
export function AccentBar() {
  return <span aria-hidden className="w-1 shrink-0 rounded-full bg-linear-to-b from-(--cs-reflection-accent) to-[color-mix(in_srgb,var(--cs-reflection-accent)_20%,transparent)]" />;
}
