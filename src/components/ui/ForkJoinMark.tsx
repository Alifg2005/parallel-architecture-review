import { cn } from '../../lib/cn';

/** Brand glyph: one lane forks into three and joins again (the fork–join model). */
export function ForkJoinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9', className)} aria-hidden focusable="false">
      <rect width="40" height="40" rx="11" className="fill-accent" />
      <g fill="none" strokeWidth="2.4" strokeLinecap="round" className="stroke-accent-contrast">
        <path d="M7 20h6M27 20h6M13 20c3 0 3-7 6-7h2c3 0 3 7 6 7M13 20c3 0 3 7 6 7h2c3 0 3-7 6-7M13 20h14" />
      </g>
      <circle cx="13" cy="20" r="2.4" className="fill-warm" />
      <circle cx="27" cy="20" r="2.4" className="fill-warm" />
    </svg>
  );
}
