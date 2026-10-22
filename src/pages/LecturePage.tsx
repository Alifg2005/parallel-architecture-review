import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Info, ListChecks, PenLine, Target } from 'lucide-react';
import { getAdjacentChapters, getChapter } from '../content/registry';
import { setReviewed, useProgress } from '../lib/progress';
import { cn } from '../lib/cn';
import { LectureHeader } from '../components/layout/LectureHeader';
import { ReviewBlockView } from '../components/review/ReviewBlockView';
import { RichText } from '../components/review/RichText';
import { TableOfContents, type TocItem } from '../components/review/TableOfContents';
import { ButtonLink } from '../components/ui/Button';
import { Callout } from '../components/ui/Callout';
import { NotFoundPage } from './NotFoundPage';

export function LecturePage() {
  const { chapterId } = useParams();
  const chapter = getChapter(chapterId);
  const progress = useProgress();

  const toc = useMemo<TocItem[]>(
    () =>
      chapter
        ? [
            { id: 'objectives', title: 'Learning objectives' },
            ...chapter.sections.map((s) => ({ id: s.id, title: s.title })),
            { id: 'exam-points', title: 'Important exam points' },
            { id: 'quick-revision', title: 'Quick revision' },
          ]
        : [],
    [chapter],
  );

  if (!chapter) return <NotFoundPage kind="lecture" />;

  const { meta } = chapter;
  const { prev, next } = getAdjacentChapters(meta.id);
  const reviewed = Boolean(progress.reviewed[meta.id]);
  const base = `/lectures/${meta.id}`;

  return (
    <>
      <title>{`Lecture ${meta.number}: ${meta.title} — Review`}</title>
      <LectureHeader chapter={chapter} />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:gap-14">
        <article className="min-w-0 space-y-14">
          <details className="rounded-2xl border border-line bg-surface p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium text-ink">Contents ({toc.length} sections)</summary>
            <ol className="mt-3 space-y-1.5 text-sm">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="flex gap-2 py-1 text-muted hover:text-accent-ink">
                    <span className="font-mono text-xs leading-6 text-faint">{String(i + 1).padStart(2, '0')}</span>
                    {t.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <section id="objectives" aria-labelledby="objectives-h" className="scroll-mt-24">
            <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
              <h2 id="objectives-h" className="flex items-center gap-2.5 text-2xl">
                <Target className="size-5 text-accent" aria-hidden /> Learning objectives
              </h2>
              <p className="mt-1 text-sm text-muted">After studying this lecture you should be able to:</p>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {meta.objectives.map((o, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl bg-surface-2 p-3.5 text-[0.95rem] text-ink-2">
                    <span className="font-mono text-xs leading-6 text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <RichText text={o} />
                    </span>
                  </li>
                ))}
              </ol>
              {meta.sourceNote && (
                <p className="mt-5 flex gap-2 text-sm text-muted">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    <RichText text={meta.sourceNote} />
                  </span>
                </p>
              )}
            </div>
          </section>

          {chapter.sections.map((section, i) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24 space-y-5">
              <header className="space-y-2">
                <p className="font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">
                  Part {String(i + 1).padStart(2, '0')}
                </p>
                <h2 id={`${section.id}-h`} className="text-[1.65rem] sm:text-3xl">
                  {section.title}
                </h2>
                {section.summary && (
                  <p className="text-[1.05rem] text-muted">
                    <RichText text={section.summary} />
                  </p>
                )}
              </header>
              <div className="space-y-5 leading-relaxed">
                {section.blocks.map((block, bi) => (
                  <ReviewBlockView key={bi} block={block} />
                ))}
              </div>
            </section>
          ))}

          <section id="exam-points" aria-labelledby="exam-points-h" className="scroll-mt-24 space-y-4">
            <h2 id="exam-points-h" className="text-[1.65rem] sm:text-3xl">
              Important exam points
            </h2>
            <Callout tone="exam" title="Know these cold">
              <ul className="space-y-2.5">
                {chapter.examPoints.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-xs leading-6 text-warm">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <RichText text={p} />
                    </span>
                  </li>
                ))}
              </ul>
            </Callout>
          </section>

          <section id="quick-revision" aria-labelledby="quick-revision-h" className="scroll-mt-24 space-y-4">
            <h2 id="quick-revision-h" className="text-[1.65rem] sm:text-3xl">
              Quick revision
            </h2>
            <ol className="grid gap-2.5 sm:grid-cols-2">
              {chapter.quickRevision.map((p, i) => (
                <li key={i} className="flex gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.95rem] text-ink-2">
                  <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                  <span>
                    <RichText text={p} />
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-label="Next steps" className="space-y-5 rounded-3xl border border-line bg-surface-2 p-5 sm:p-7">
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(e) => setReviewed(meta.id, e.target.checked)}
                className="size-5 accent-[var(--accent)]"
              />
              <span className="font-medium text-ink">I have reviewed this lecture</span>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <ButtonLink to={`${base}/quiz`} size="lg">
                <ListChecks className="size-4" aria-hidden /> Take the 20-question quiz
              </ButtonLink>
              <ButtonLink to={`${base}/essays`} size="lg" variant="secondary">
                <PenLine className="size-4" aria-hidden /> Practise essay questions
              </ButtonLink>
            </div>
          </section>

          <nav aria-label="Other lectures" className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/lectures/${prev.meta.id}`}
                className="group rounded-2xl border border-line p-4 transition-colors hover:border-accent"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <ArrowLeft className="size-3.5" aria-hidden /> Previous · Lecture {prev.meta.number}
                </span>
                <span className="mt-1 block font-display text-lg text-ink group-hover:text-accent-ink">{prev.meta.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/lectures/${next.meta.id}`}
                className={cn('group rounded-2xl border border-line p-4 text-right transition-colors hover:border-accent')}
              >
                <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
                  Next · Lecture {next.meta.number} <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="mt-1 block font-display text-lg text-ink group-hover:text-accent-ink">{next.meta.title}</span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents items={toc} />
            <div className="space-y-2 border-t border-line pt-5">
              <ButtonLink to={`${base}/quiz`} size="sm" className="w-full">
                <ListChecks className="size-4" aria-hidden /> Quiz
              </ButtonLink>
              <ButtonLink to={`${base}/essays`} size="sm" variant="secondary" className="w-full">
                <PenLine className="size-4" aria-hidden /> Essays
              </ButtonLink>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
