import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'accent' | 'warm' | 'good' | 'bad';

const tones: Record<Tone, string> = {
  neutral: 'border-line bg-surface-2 text-muted',
  accent: 'border-transparent bg-accent-soft text-accent-ink',
  warm: 'border-warm-line bg-warm-soft text-warm',
  good: 'border-transparent bg-good-soft text-good',
  bad: 'border-transparent bg-bad-soft text-bad',
};

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
