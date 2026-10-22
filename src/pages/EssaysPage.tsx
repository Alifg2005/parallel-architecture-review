import { useSearchParams } from 'react-router-dom';
import { chapters } from '../content/registry';
import { cn } from '../lib/cn';
import { EssayCard } from '../components/essays/EssayCard';

/** All essay prompts across lectures, filterable by lecture (?lecture=lecture-03). */
export function EssaysPage() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('lecture');
  const visible = chapters.filter((c) => !selected || c.meta.id === selected);
  const total = chapters.reduce((n, c) => n + c.essays.length, 0);

  const select = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set('lecture', id);
    else next.delete('lecture');
    setParams(next, { replace: true });
  };

  return (
    <>
      <title>Essay practice — Parallel Computer Architecture</title>
      <header className="dot-grid border-b border-line">
        <div className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <p className="font-mono text-[0.72rem] tracking-[0.16em] text-accent uppercase">Essay & short-answer practice</p>
          <h1 className="mt-3 text-[2.1rem] font-medium sm:text-5xl">Practise writing it, not just recognising it</h1>
          <p className="mt-4 max-w-2xl text-muted">
            {total} exam-style prompts across {chapters.length} lectures. Draft an answer, reveal the model, then check
            the key concepts and the suggested structure.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <div role="group" aria-label="Filter by lecture" className="scroll-x -mx-4 px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2">
            {[{ id: null, label: 'All lectures' }, ...chapters.map((c) => ({ id: c.meta.id, label: `Lecture ${c.meta.number}` }))].map(
              (f) => {
                const active = selected === f.id || (!selected && f.id === null);
                return (
                  <button
                    key={f.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => select(f.id)}
                    className={cn(
                      'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors',
                      active
                        ? 'border-accent bg-accent text-accent-contrast'
                        : 'border-line bg-surface text-ink-2 hover:border-line-strong',
                    )}
                  >
                    {f.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-line-strong p-8 text-center text-muted">
            No essay questions match this filter.{' '}
            <button type="button" className="font-medium text-accent-ink underline" onClick={() => select(null)}>
              Show all lectures
            </button>
          </p>
        ) : (
          <div className="mt-8 space-y-14">
            {visible.map((c) => (
              <section key={c.meta.id} aria-labelledby={`${c.meta.id}-essays`} className="space-y-5">
                <h2 id={`${c.meta.id}-essays`} className="flex items-baseline gap-3 text-2xl sm:text-3xl">
                  <span className="numeral text-accent">{String(c.meta.number).padStart(2, '0')}</span>
                  {c.meta.title}
                </h2>
                {c.essays.map((e, i) => (
                  <EssayCard key={e.id} essay={e} index={i} />
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
