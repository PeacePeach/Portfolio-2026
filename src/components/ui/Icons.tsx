type IconProps = { className?: string; strokeWidth?: number };

export function ArrowDown({ className, strokeWidth = 1.25 }: IconProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" className={className} aria-hidden="true">
      <path d="M24 2v58M4 40l20 20 20-20" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ArrowUpRight({ className, strokeWidth = 1.25 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 18L18 6M8 6h10v10" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Figma "arrow-right" (18 × 18), drawn in currentColor. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
