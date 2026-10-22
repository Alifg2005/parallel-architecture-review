import { Link, NavLink } from 'react-router-dom';
import { BookOpen, ChevronRight, ListChecks, PenLine } from 'lucide-react';
import type { Chapter } from '../../content/schema';
import { cn } from '../../lib/cn';

interface LectureHeaderProps {
  chapter: Chapter;
  /** Page-specific title (h1). Defaults to the lecture title. */
  title?: string;
  lead?: string;
}

export function LectureHeader({ chapter, title, lead }: LectureHeaderProps) {
  const { meta } = chapter;
  const base = `/lectures/${meta.id}`;
  const tabs = [
    { to: base, label: 'Review', icon: BookOpen, end: true },
    { to: `${base}/essays`, label: 'Essays', icon: PenLine, end: false },
    { to: `${base}/quiz`, label: 'Quiz', icon: ListChecks, end: false },
  ];

  return (
    <header className="dot-grid border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-accent-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link to="/#lectures" className="hover:text-accent-ink">
                Lectures
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-ink-2">
              Lecture {meta.number}
            </li>
          </ol>
        </nav>

        <div className="flex items-start gap-4 sm:gap-6">
          <span aria-hidden className="numeral -mt-1 text-[3.6rem] leading-none text-accent sm:text-[5.5rem]">
            {String(meta.number).padStart(2, '0')}
          </span>
          <div className="min-w-0 space-y-3 pt-1">
            <p className="font-mono text-[0.72rem] tracking-[0.16em] text-muted uppercase">Lecture {meta.number}</p>
            <h1 className="text-[1.85rem] font-medium sm:text-[2.6rem]">{title ?? meta.title}</h1>
            <p className="max-w-3xl text-muted">{lead ?? meta.description}</p>
          </div>
        </div>

        <nav aria-label="Lecture sections" className="scroll-x mt-8 -mb-px">
          <ul className="flex min-w-max gap-1">
            {tabs.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors',
                      isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink',
                    )
                  }
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
