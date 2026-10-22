import { cn } from '../../lib/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  tone?: 'accent' | 'good' | 'warm';
  className?: string;
}

export function ProgressBar({ value, max, label, tone = 'accent', className }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const fill = tone === 'good' ? 'bg-good' : tone === 'warm' ? 'bg-warm' : 'bg-accent';
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-line', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-300 ease-out', fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
