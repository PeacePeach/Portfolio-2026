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

