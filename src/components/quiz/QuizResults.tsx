import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Minus, PenLine, RotateCcw, X } from 'lucide-react';
import { OPTION_LETTERS, type QuizQuestion } from '../../content/schema';
import { performanceBand, type QuestionOutcome, type QuizResult, type Selection } from '../../lib/quiz';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import { Button, ButtonLink } from '../ui/Button';
import { CodeBlock } from '../review/CodeBlock';
import { RichText } from '../review/RichText';

interface QuizResultsProps {
  questions: readonly QuizQuestion[];
  selections: Selection[];
  result: QuizResult;
  reviewHref: string;
  essaysHref: string;
  onRetry: () => void;
}

function ScoreRing({ value, total }: { value: number; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : value / total;
  return (
    <svg viewBox="0 0 128 128" className="size-36 shrink-0 -rotate-90 sm:size-40" aria-hidden>
      <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-line" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className="stroke-accent transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
  );
}

const OUTCOME_STYLE: Record<QuestionOutcome, { label: string; icon: typeof Check; tone: 'good' | 'bad' | 'warm' }> = {
  correct: { label: 'Correct', icon: Check, tone: 'good' },
  incorrect: { label: 'Incorrect', icon: X, tone: 'bad' },
  unanswered: { label: 'Unanswered', icon: Minus, tone: 'warm' },
};

export function QuizResults({ questions, selections, result, reviewHref, essaysHref, onRetry }: QuizResultsProps) {
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  const band = performanceBand(result.percentage);
  const visible = questions
    .map((q, i) => ({ q, i, outcome: result.outcomes[i] ?? 'unanswered' }))
    .filter((x) => filter === 'all' || x.outcome !== 'correct');

  return (
    <div className="space-y-10">
      <section aria-labelledby="results-heading" className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
        <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8">
          <div className="relative">
            <ScoreRing value={result.correct} total={result.total} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="numeral text-4xl leading-none text-ink">
                {result.correct}
                <span className="text-xl text-muted">/{result.total}</span>
              </span>
              <span className="mt-1 font-mono text-sm text-muted">{result.percentage}%</span>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
            <Badge tone={band.tone}>{band.label}</Badge>
            <h2 id="results-heading" ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl">
              You scored {result.correct} out of {result.total} ({result.percentage}%)
            </h2>
            <p className="text-muted">{band.message}</p>
          </div>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-line border-t border-line text-center">
          {[
            { label: 'Correct', value: result.correct, cls: 'text-good' },
            { label: 'Incorrect', value: result.incorrect, cls: 'text-bad' },
            { label: 'Unanswered', value: result.unanswered, cls: 'text-warm' },
          ].map((s) => (
            <div key={s.label} className="px-2 py-4">
              <dt className="text-xs text-muted sm:text-sm">{s.label}</dt>
              <dd className={cn('numeral text-2xl', s.cls)}>{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-3 border-t border-line bg-surface-2 p-4 sm:flex-row sm:flex-wrap sm:justify-end sm:p-5">
          <ButtonLink to={essaysHref} variant="ghost">
            <PenLine className="size-4" aria-hidden /> Essay practice
          </ButtonLink>
          <ButtonLink to={reviewHref} variant="secondary">
            <BookOpen className="size-4" aria-hidden /> Back to lecture review
          </ButtonLink>
          <Button onClick={onRetry}>
            <RotateCcw className="size-4" aria-hidden /> Retry quiz
          </Button>
        </div>
      </section>

      <section aria-labelledby="review-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="review-heading" className="text-2xl">
            Question review
          </h2>
          <div role="group" aria-label="Filter questions" className="inline-flex rounded-full border border-line bg-surface p-1">
            {(
              [
                ['all', `All ${result.total}`],
                ['missed', `Missed ${result.incorrect + result.unanswered}`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                  'min-h-9 rounded-full px-3.5 text-sm font-medium transition-colors',
                  filter === key ? 'bg-accent text-accent-contrast' : 'text-muted hover:text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-muted">
            Nothing missed. Every answer was correct.
          </p>
        )}

        <ol className="space-y-4">
          {visible.map(({ q, i, outcome }) => {
            const style = OUTCOME_STYLE[outcome];
            const Icon = style.icon;
            const chosen = selections[i];
            return (
              <li key={q.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-faint">Q{i + 1}</span>
                  <Badge tone={style.tone}>
                    <Icon className="size-3.5" aria-hidden /> {style.label}
                  </Badge>
                  <span className="text-xs text-muted">{q.topic}</span>
                </div>
                <p className="font-display text-lg leading-snug text-ink">
                  <RichText text={q.prompt} />
                </p>
                {q.code && (
                  <div className="mt-3">
                    <CodeBlock code={q.code} language="c" />
                  </div>
                )}
                <ul className="mt-4 space-y-2">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.answer;
                    const isChosen = oi === chosen;
                    return (
                      <li
                        key={oi}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-[0.95rem]',
                          isCorrect
                            ? 'border-good/50 bg-good-soft'
                            : isChosen
                              ? 'border-bad/50 bg-bad-soft'
                              : 'border-line',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-px font-mono text-sm font-semibold',
                            isCorrect ? 'text-good' : isChosen ? 'text-bad' : 'text-faint',
                          )}
                        >
                          {OPTION_LETTERS[oi]}
                        </span>
                        <span className="min-w-0 flex-1 text-ink-2">
                          <RichText text={opt} />
                        </span>
                        {(isCorrect || isChosen) && (
                          <span className={cn('shrink-0 text-xs font-medium', isCorrect ? 'text-good' : 'text-bad')}>
                            {isCorrect && isChosen ? 'Your answer · Correct' : isCorrect ? 'Correct answer' : 'Your answer'}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-[0.95rem] text-ink-2">
                  <span className="font-semibold text-ink">Why: </span>
                  <RichText text={q.explanation} />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <ButtonLink to={reviewHref} variant="secondary">
            <BookOpen className="size-4" aria-hidden /> Back to lecture review
          </ButtonLink>
          <Button onClick={onRetry}>
            <RotateCcw className="size-4" aria-hidden /> Retry quiz
          </Button>
        </div>
      </section>
    </div>
  );
}
