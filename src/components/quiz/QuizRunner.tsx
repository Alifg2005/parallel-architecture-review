import { useEffect, useReducer, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ListChecks } from 'lucide-react';
import type { QuizQuestion } from '../../content/schema';
import { scoreQuiz, type QuizResult } from '../../lib/quiz';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { QuestionNavigator } from './QuestionNavigator';
import { QuestionView } from './QuestionView';
import { QuizResults } from './QuizResults';
import { SubmitSummary } from './SubmitSummary';
import { initialQuizState, quizReducer } from './quizState';

interface QuizRunnerProps {
  questions: readonly QuizQuestion[];
  reviewHref: string;
  essaysHref: string;
  onSubmit?: (result: QuizResult) => void;
}

const LETTER_KEYS: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };

/** Generic quiz engine: works for any chapter's `quiz` array. */
export function QuizRunner({ questions, reviewHref, essaysHref, onSubmit }: QuizRunnerProps) {
  const [state, dispatch] = useReducer(quizReducer, questions.length, initialQuizState);
  const submittedRef = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const total = questions.length;
  const question = questions[state.current];
  const answeredCount = state.selections.filter((s) => s !== null).length;

  const submit = () => {
    if (submittedRef.current) return; // guard against double submission
    submittedRef.current = true;
    const result = scoreQuiz(questions, state.selections);
    dispatch({ type: 'submit', result });
    onSubmit?.(result);
  };

  const retry = () => {
    submittedRef.current = false;
    dispatch({ type: 'retry' });
  };

  // Keep the active question in view when moving between questions/phases (not on first render).
  const { current, phase } = state;
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    topRef.current?.scrollIntoView({ block: 'nearest' });
  }, [current, phase]);

  // Keyboard shortcuts: A–D or 1–4 select an option while answering.
  useEffect(() => {
    if (phase !== 'answering') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && (target as HTMLInputElement).type !== 'radio') return;
      const option = LETTER_KEYS[e.key.toLowerCase()];
      if (option !== undefined) {
        e.preventDefault();
        dispatch({ type: 'select', question: current, option });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, current]);

  if (state.phase === 'submitted' && state.result) {
    return (
      <div ref={topRef} className="scroll-mt-24">
        <QuizResults
          questions={questions}
          selections={state.selections}
          result={state.result}
          reviewHref={reviewHref}
          essaysHref={essaysHref}
          onRetry={retry}
        />
      </div>
    );
  }

  if (!question) {
    return <p className="text-muted">This quiz has no questions yet.</p>;
  }

  const isLast = state.current === total - 1;

  return (
    <div ref={topRef} className="grid scroll-mt-24 gap-8 lg:grid-cols-[1fr_15rem] lg:gap-10">
      <div className="min-w-0 space-y-6">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink">
              {state.phase === 'summary' ? 'Review & submit' : `Question ${state.current + 1} of ${total}`}
            </span>
            <span className="text-muted">
              {answeredCount}/{total} answered
            </span>
          </div>
          <ProgressBar value={answeredCount} max={total} label="Questions answered" />
        </div>

        <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8">
          {state.phase === 'summary' ? (
            <SubmitSummary
              selections={state.selections}
              onBack={() => dispatch({ type: 'closeSummary' })}
              onGoto={(i) => dispatch({ type: 'goto', question: i })}
              onSubmit={submit}
            />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <QuestionView
                  question={question}
                  index={state.current}
                  total={total}
                  selection={state.selections[state.current] ?? null}
                  onSelect={(option) => dispatch({ type: 'select', question: state.current, option })}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {state.phase === 'answering' && (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'prev' })}
              disabled={state.current === 0}
              aria-label="Previous question"
            >
              <ArrowLeft className="size-4" aria-hidden /> <span className="hidden sm:inline">Previous</span>
            </Button>
            <p className="hidden text-xs text-faint md:block">Tip: press A–D or 1–4 to choose</p>
            {isLast ? (
              <Button onClick={() => dispatch({ type: 'openSummary' })}>
                <ListChecks className="size-4" aria-hidden /> Review & submit
              </Button>
            ) : (
              <Button onClick={() => dispatch({ type: 'next' })} aria-label="Next question">
                <span>Next</span> <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="mb-3 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">Questions</p>
          <QuestionNavigator
            selections={state.selections}
            current={state.phase === 'answering' ? state.current : -1}
            onGoto={(i) => dispatch({ type: 'goto', question: i })}
          />
        </div>
        {state.phase === 'answering' && (
          <Button variant="secondary" className="w-full" onClick={() => dispatch({ type: 'openSummary' })}>
            <ListChecks className="size-4" aria-hidden /> Finish & review answers
          </Button>
        )}
      </aside>
    </div>
  );
}
