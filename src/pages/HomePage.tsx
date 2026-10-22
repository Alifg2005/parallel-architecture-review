import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, CircleDashed, Clock3, ListChecks, PenLine, Timer } from 'lucide-react';
import { course, midterm } from '../content/course';
import { chapters, getCourseScope } from '../content/registry';
import { useProgress, type Progress } from '../lib/progress';
import { cn } from '../lib/cn';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ThreadLanes } from '../components/home/ThreadLanes';
import type { Chapter } from '../content/schema';

function Hero() {
  const first = chapters[0];
  const totalQuestions = chapters.reduce((n, c) => n + c.quiz.length, 0);
  const totalEssays = chapters.reduce((n, c) => n + c.essays.length, 0);

  return (
    <section className="dot-grid relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-14 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-20 lg:pb-20">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden /> Study companion · Midterm edition
          </p>
          <div className="space-y-4">
            <h1 className="text-[2.35rem] leading-[1.05] font-medium sm:text-[3.4rem] lg:text-[3.75rem]">
              {course.name}
              <span className="block text-muted italic">reviewed, practised, understood.</span>
            </h1>
            <p className="max-w-xl text-[1.05rem] text-ink-2">{course.tagline}</p>
            <p className="text-sm text-muted">
              Prepared by <span className="font-medium text-ink">{course.owner}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {first && (
              <ButtonLink to={`/lectures/${first.meta.id}`} size="lg">
                Start with Lecture {first.meta.number} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            )}
            <ButtonLink to="/essays" variant="secondary" size="lg">
              <PenLine className="size-4" aria-hidden /> Essay practice
            </ButtonLink>
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {[
              ['Lectures', chapters.length],
              ['Quiz questions', totalQuestions],
              ['Essay prompts', totalEssays],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="numeral text-3xl text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative rounded-[1.75rem] border border-line bg-surface/80 p-4 shadow-lift backdrop-blur-sm sm:p-6">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">#pragma omp parallel</span>
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-line-strong" />
              <span className="size-2 rounded-full bg-line-strong" />
              <span className="size-2 rounded-full bg-warm" />
            </span>
          </div>
          <ThreadLanes />
          <p className="px-1 pt-1 text-sm text-muted">
            One idea runs through the course: split the work, run it at the same time, then coordinate the results.
          </p>
        </div>
      </div>
    </section>
  );
}

function MidtermSection({ progress }: { progress: Progress }) {
  const scope = getCourseScope().filter((e) => (midterm.lectures as readonly number[]).includes(e.number));
  const available = scope.filter((e) => e.chapter);
  const attempted = available.filter((e) => e.chapter && progress.quizzes[e.chapter.meta.id]).length;
  const reviewed = available.filter((e) => e.chapter && progress.reviewed[e.chapter.meta.id]).length;

  const facts = [
    { icon: CalendarDays, label: 'Planned', value: midterm.week },
    { icon: Clock3, label: 'Exact day', value: midterm.day },
    { icon: Timer, label: 'Duration', value: midterm.duration },
  ];

  return (
    <section id="midterm" aria-labelledby="midterm-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="relative min-w-0 overflow-hidden rounded-3xl bg-ink p-6 text-bg sm:p-8 dark:bg-surface-2 dark:text-ink">
          <div aria-hidden className="pointer-events-none absolute -right-20 -bottom-20 size-56 rounded-full border-[28px] border-accent/20" />
          <p className="font-mono text-[0.72rem] tracking-[0.16em] uppercase opacity-70">Midterm exam</p>
          <h2 id="midterm-heading" className="mt-3 text-[2rem] font-medium text-inherit sm:text-[2.4rem]">
            Lectures {midterm.lectures[0]}–{midterm.lectures[midterm.lectures.length - 1]}
          </h2>
          <p className="mt-2 max-w-sm opacity-80">
            The midterm covers the first six lectures. Use the checklist to see what you have reviewed and tested.
          </p>
          <dl className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-bg/10 p-3.5 dark:bg-bg/60">
                <dt className="flex items-center gap-1.5 text-xs opacity-70">
                  <Icon className="size-3.5" aria-hidden /> {label}
                </dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.72rem] tracking-[0.16em] text-accent uppercase">Your checklist</p>
              <h3 className="mt-2 text-2xl">Exam scope</h3>
            </div>
            <div className="w-full space-y-3 sm:w-56">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted">
                  <span>Reviewed</span>
                  <span>
                    {reviewed}/{available.length}
                  </span>
                </div>
                <ProgressBar value={reviewed} max={available.length} label="Lectures reviewed" tone="warm" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted">
                  <span>Quizzes attempted</span>
                  <span>
                    {attempted}/{available.length}
                  </span>
                </div>
                <ProgressBar value={attempted} max={available.length} label="Quizzes attempted" />
              </div>
            </div>
          </div>
          <ul className="mt-6 divide-y divide-line">
            {scope.map((entry) => {
              const record = entry.chapter ? progress.quizzes[entry.chapter.meta.id] : undefined;
              const isReviewed = entry.chapter ? progress.reviewed[entry.chapter.meta.id] : false;
              return (
                <li key={entry.number} className="flex items-center gap-3 py-3">
                  {isReviewed || record ? (
                    <CheckCircle2 className="size-5 shrink-0 text-good" aria-label="Studied" />
                  ) : (
                    <CircleDashed className="size-5 shrink-0 text-faint" aria-label="Not studied yet" />
                  )}
                  <span className="w-6 shrink-0 font-mono text-sm text-faint">{String(entry.number).padStart(2, '0')}</span>
                  {entry.chapter ? (
                    <Link to={`/lectures/${entry.chapter.meta.id}`} className="min-w-0 flex-1 truncate text-ink hover:text-accent-ink">
                      {entry.title}
                    </Link>
                  ) : (
                    <span className="min-w-0 flex-1 truncate text-muted">{entry.title}</span>
                  )}
                  {!entry.chapter ? (
                    <Badge>Not yet added</Badge>
                  ) : record ? (
                    <Badge tone="accent">
                      Best {record.bestScore}/{record.total}
                    </Badge>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LectureRow({ chapter, progress }: { chapter: Chapter; progress: Progress }) {
  const { meta } = chapter;
  const record = progress.quizzes[meta.id];
  const base = `/lectures/${meta.id}`;
  return (
    <li className="group relative grid gap-5 rounded-3xl border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-soft sm:p-7 md:grid-cols-[5.5rem_1fr_auto] md:items-center md:gap-7">
      <span aria-hidden className="numeral text-[3.25rem] leading-none text-accent/80 transition-colors group-hover:text-accent md:text-[4.25rem]">
        {String(meta.number).padStart(2, '0')}
      </span>
      <div className="min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">Lecture {meta.number}</span>
          {progress.reviewed[meta.id] && <Badge tone="good">Reviewed</Badge>}
          {record && (
            <Badge tone="accent">
              Best {record.bestScore}/{record.total}
            </Badge>
          )}
        </div>
        <h3 className="text-[1.4rem] leading-tight sm:text-[1.6rem]">
          <Link to={base} className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none">
            {meta.title}
          </Link>
        </h3>
        <p className="max-w-2xl text-[0.96rem] text-muted">{meta.description}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted" aria-label="Study activities">
          <li className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden /> ~{meta.estimatedMinutes} min review
          </li>
          <li className="flex items-center gap-1.5">
            <ListChecks className="size-3.5" aria-hidden /> {chapter.quiz.length}-question quiz
          </li>
          <li className="flex items-center gap-1.5">
            <PenLine className="size-3.5" aria-hidden /> {chapter.essays.length} essay prompts
          </li>
        </ul>
      </div>
      <div className="relative z-10 flex gap-2 md:flex-col">
        <ButtonLink to={base} size="sm" className="flex-1 md:flex-none">
          <BookOpen className="size-4" aria-hidden /> Review
        </ButtonLink>
        <ButtonLink to={`${base}/quiz`} size="sm" variant="secondary" className="flex-1 md:flex-none">
          <ListChecks className="size-4" aria-hidden /> Quiz
        </ButtonLink>
        <ButtonLink to={`${base}/essays`} size="sm" variant="ghost" className="flex-1 md:flex-none">
          <PenLine className="size-4" aria-hidden /> Essays
        </ButtonLink>
      </div>
    </li>
  );
}

function LectureDirectory({ progress }: { progress: Progress }) {
  const missing = getCourseScope().filter((e) => !e.chapter);
  return (
    <section id="lectures" aria-labelledby="lectures-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-24 sm:px-6">
      <SectionHeading
        id="lectures-heading"
        eyebrow="Lecture directory"
        title="Pick a lecture, then review, write, test"
        lead="Each lecture has a structured review, essay prompts with model answers, and a 20-question quiz with explanations."
      />
      {chapters.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-line-strong p-8 text-center text-muted">
          No lectures have been added yet.
        </p>
      ) : (
        <ol className="mt-10 space-y-4">
          {chapters.map((c) => (
            <LectureRow key={c.meta.id} chapter={c} progress={progress} />
          ))}
        </ol>
      )}
      {missing.length > 0 && (
        <ul className="mt-4 space-y-3" aria-label="Lectures not yet added">
          {missing.map((m) => (
            <li
              key={m.number}
              className="flex items-center gap-4 rounded-3xl border border-dashed border-line-strong px-5 py-4 text-muted sm:px-7"
            >
              <span className="numeral text-3xl text-faint">{String(m.number).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">{m.title}</span>
              <Badge>Not yet added</Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StudyMethod() {
  const steps = [
    { icon: BookOpen, title: 'Review', text: 'Read the lecture review. Pay special attention to the amber exam-focus notes.' },
    { icon: PenLine, title: 'Write', text: 'Draft an essay answer before revealing the model, then compare the key concepts.' },
    { icon: ListChecks, title: 'Test', text: 'Take the 20-question quiz. Read every explanation, especially for lucky guesses.' },
  ];
  return (
    <section aria-labelledby="method-heading" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
      <SectionHeading id="method-heading" eyebrow="How to use this site" title="A three-pass study loop" />
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative rounded-3xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="numeral text-2xl text-faint">{i + 1}</span>
            </div>
            <h3 className="mt-5 text-xl">{title}</h3>
            <p className={cn('mt-2 text-[0.95rem] text-muted')}>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HomePage() {
  const progress = useProgress();
  return (
    <>
      <Hero />
      <MidtermSection progress={progress} />
      <LectureDirectory progress={progress} />
      <StudyMethod />
    </>
  );
}
