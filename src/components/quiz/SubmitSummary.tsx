import { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Selection } from '../../lib/quiz';
import { Button } from '../ui/Button';

interface SubmitSummaryProps {
  selections: Selection[];
  onBack: () => void;
  onGoto: (index: number) => void;
  onSubmit: () => void;
}

export function SubmitSummary({ selections, onBack, onGoto, onSubmit }: SubmitSummaryProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  const unanswered = selections.flatMap((s, i) => (s === null ? [i] : []));
  const answered = selections.length - unanswered.length;

  return (
    <section aria-labelledby="summary-heading" className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-accent uppercase">Before you submit</p>
        <h2 id="summary-heading" ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl">
          You answered {answered} of {selections.length} questions
        </h2>
      </div>

      {unanswered.length === 0 ? (
        <p className="flex items-start gap-2.5 rounded-2xl bg-good-soft p-4 text-good">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
          Every question has an answer. You can still go back and change any of them.
        </p>
      ) : (
        <div className="space-y-3 rounded-2xl border border-warm-line bg-warm-soft p-4">
          <p className="flex items-start gap-2.5 text-warm">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              {unanswered.length} {unanswered.length === 1 ? 'question is' : 'questions are'} unanswered. Unanswered
              questions score zero.
            </span>
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Unanswered questions">
            {unanswered.map((i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onGoto(i)}
                  className="min-h-9 rounded-full border border-warm-line bg-surface px-3 font-mono text-sm text-ink hover:border-warm"
                >
                  Q{i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onBack}>
          Back to questions
        </Button>
        <Button onClick={onSubmit}>
          Submit quiz
        </Button>
      </div>
    </section>
  );
}
