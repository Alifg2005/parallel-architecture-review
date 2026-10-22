import type { Selection } from '../../lib/quiz';
import { cn } from '../../lib/cn';

interface QuestionNavigatorProps {
  selections: Selection[];
  current: number;
  onGoto: (index: number) => void;
}

export function QuestionNavigator({ selections, current, onGoto }: QuestionNavigatorProps) {
  return (
    <nav aria-label="Jump to question">
      <ol className="grid grid-cols-10 gap-1.5 lg:grid-cols-5">
        {selections.map((s, i) => {
          const answered = s !== null;
          const isCurrent = i === current;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onGoto(i)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Question ${i + 1}${answered ? ', answered' : ', not answered'}`}
                className={cn(
                  'flex aspect-square w-full min-w-0 items-center justify-center rounded-lg border font-mono text-xs transition-colors sm:text-[0.8rem]',
                  isCurrent && 'ring-2 ring-accent ring-offset-2 ring-offset-bg',
                  answered
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-line bg-surface text-muted hover:border-line-strong hover:text-ink',
                )}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
