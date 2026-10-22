import { OPTION_LETTERS, type QuizQuestion } from '../../content/schema';
import type { Selection } from '../../lib/quiz';
import { cn } from '../../lib/cn';
import { CodeBlock } from '../review/CodeBlock';
import { RichText } from '../review/RichText';

interface QuestionViewProps {
  question: QuizQuestion;
  index: number;
  total: number;
  selection: Selection;
  onSelect: (option: number) => void;
}

export function QuestionView({ question, index, total, selection, onSelect }: QuestionViewProps) {
  const name = `q-${question.id}`;
  return (
    <fieldset className="min-w-0 space-y-5">
      <legend className="contents">
        <span className="mb-3 block font-mono text-xs tracking-[0.14em] text-accent uppercase">
          Question {index + 1} of {total}
        </span>
        <span className="block font-display text-xl leading-snug text-ink sm:text-[1.6rem]">
          <RichText text={question.prompt} />
        </span>
      </legend>

      {question.code && <CodeBlock code={question.code} language="c" />}

      <div className="space-y-3">
        {question.options.map((option, i) => {
          const checked = selection === i;
          return (
            <label
              key={i}
              className={cn(
                'group flex min-h-14 cursor-pointer items-start gap-3.5 rounded-2xl border bg-surface px-4 py-3.5 transition-[border-color,background-color,box-shadow] duration-150',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                checked
                  ? 'border-accent bg-accent-soft shadow-soft'
                  : 'border-line hover:border-line-strong hover:bg-surface-2',
              )}
            >
              <input
                type="radio"
                name={name}
                value={i}
                checked={checked}
                onChange={() => onSelect(i)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  'mt-px flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-medium transition-colors',
                  checked
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-line-strong text-muted group-hover:text-ink',
                )}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1 pt-1 text-[0.98rem] leading-relaxed text-ink">
                <span className="sr-only">Option {OPTION_LETTERS[i]}: </span>
                <RichText text={option} />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
