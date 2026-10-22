import type { ReactNode } from 'react';
import { AlertTriangle, BookMarked, GraduationCap, Info, Lightbulb } from 'lucide-react';
import type { CalloutTone } from '../../content/schema';
import { cn } from '../../lib/cn';

const config: Record<CalloutTone, { icon: typeof Info; label: string; box: string; iconClass: string }> = {
  exam: { icon: GraduationCap, label: 'Exam focus', box: 'border-warm-line bg-warm-soft', iconClass: 'text-warm' },
  tip: { icon: Lightbulb, label: 'Tip', box: 'border-transparent bg-accent-soft', iconClass: 'text-accent-ink' },
  warning: { icon: AlertTriangle, label: 'Watch out', box: 'border-transparent bg-bad-soft', iconClass: 'text-bad' },
  note: { icon: Info, label: 'Note', box: 'border-line bg-surface-2', iconClass: 'text-muted' },
  example: { icon: BookMarked, label: 'Example', box: 'border-accent/40 bg-surface', iconClass: 'text-accent' },
};

interface CalloutProps {
  tone: CalloutTone;
  title?: string;
  children: ReactNode;
}

export function Callout({ tone, title, children }: CalloutProps) {
  const { icon: Icon, label, box, iconClass } = config[tone];
  return (
    <aside className={cn('flex gap-3 rounded-2xl border p-4 sm:p-5', box)} aria-label={title ?? label}>
      <Icon className={cn('mt-0.5 size-5 shrink-0', iconClass)} aria-hidden />
      <div className="min-w-0 flex-1 space-y-2 text-[0.95rem] text-ink-2">
        <p className={cn('font-sans text-xs font-semibold tracking-[0.08em] uppercase', iconClass)}>{title ?? label}</p>
        {children}
      </div>
    </aside>
  );
}
