import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { ESSAY_STYLE_LABELS, type EssayQuestion } from '../../content/schema';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import { CodeBlock } from '../review/CodeBlock';
import { RichText } from '../review/RichText';

interface EssayCardProps {
  essay: EssayQuestion;
  index: number;
  /** Optional label (e.g. "Lecture 3") when essays from several lectures are listed together. */
  context?: string;
}

export function EssayCard({ essay, index, context }: EssayCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [showPad, setShowPad] = useState(false);
  const answerId = useId();
  const padId = useId();

  return (
    <article className="rounded-3xl border border-line bg-surface p-5 sm:p-7" aria-labelledby={`${answerId}-q`}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="numeral text-2xl leading-none text-accent">{String(index + 1).padStart(2, '0')}</span>
        <Badge tone="accent">{ESSAY_STYLE_LABELS[essay.style]}</Badge>
        {context && <Badge>{context}</Badge>}
      </div>

      <h3 id={`${answerId}-q`} className="font-display text-xl leading-snug sm:text-[1.4rem]">
        <RichText text={essay.prompt} />
      </h3>

      {essay.code && (
        <div className="mt-4">
          <CodeBlock code={essay.code} language="c" />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-expanded={revealed}
          aria-controls={answerId}
          className={cn(
            'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
            revealed
              ? 'border border-line-strong bg-surface text-ink hover:border-accent'
              : 'bg-accent text-accent-contrast hover:bg-accent-ink',
          )}
        >
          {revealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          {revealed ? 'Hide model answer' : 'Reveal model answer'}
        </button>
        <button
          type="button"
          onClick={() => setShowPad((s) => !s)}
          aria-expanded={showPad}
          aria-controls={padId}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink-2 hover:bg-surface-2"
        >
          <ChevronDown className={cn('size-4 transition-transform', showPad && 'rotate-180')} aria-hidden />
          Draft your answer first
        </button>
      </div>

      {showPad && (
        <div id={padId} className="mt-4 space-y-1.5">
          <label htmlFor={`${padId}-text`} className="text-sm text-muted">
            Scratchpad (not saved). Write your attempt, then compare it with the model answer.
          </label>
          <textarea
            id={`${padId}-text`}
            rows={5}
            className="w-full resize-y rounded-2xl border border-line bg-surface-2 p-3.5 text-base text-ink placeholder:text-faint focus:border-accent"
            placeholder="Start with a one-line definition, then explain…"
          />
        </div>
      )}

      <AnimatePresence initial={false}>
        {revealed && (
          <motion.div
            id={answerId}
            role="region"
            aria-label="Model answer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-6 border-t border-line pt-6 lg:grid-cols-[1fr_17rem]">
              <div className="min-w-0 space-y-3">
                <p className="font-mono text-[0.7rem] tracking-[0.16em] text-accent uppercase">Model answer</p>
                {essay.modelAnswer.map((p, i) => (
                  <p key={i} className="text-ink-2">
                    <RichText text={p} />
                  </p>
                ))}
                <div className="rounded-2xl border border-warm-line bg-warm-soft p-4 text-[0.95rem] text-ink-2">
                  <p className="mb-1 text-xs font-semibold tracking-[0.08em] text-warm uppercase">Why it matters</p>
                  <RichText text={essay.whyItMatters} />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">Key concepts</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {essay.keyConcepts.map((k) => (
                      <li key={k} className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-sm text-ink-2">
                        <RichText text={k} />
                      </li>
                    ))}
                  </ul>
                </div>
                {essay.structure && (
                  <div>
                    <p className="mb-2 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">
                      Suggested structure
                    </p>
                    <ol className="space-y-1.5 text-sm text-ink-2">
                      {essay.structure.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-mono text-xs leading-5 text-accent">{i + 1}.</span>
                          <span>
                            <RichText text={s} />
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
