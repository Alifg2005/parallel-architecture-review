import { Link } from 'react-router-dom';
import { course } from '../../content/course';
import { chapters } from '../../content/registry';
import { ForkJoinMark } from '../ui/ForkJoinMark';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ForkJoinMark className="size-8" />
            <p className="font-display text-lg">{course.name}</p>
          </div>
          <p className="max-w-sm text-sm text-muted">
            An independent study companion built by {course.owner}. The notes and questions are original summaries
            written for revision. The lecture slides are not published here.
          </p>
        </div>
        <nav aria-label="Lectures" className="text-sm">
          <p className="mb-3 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">Lectures</p>
          <ul className="space-y-2">
            {chapters.map((c) => (
              <li key={c.meta.id}>
                <Link to={`/lectures/${c.meta.id}`} className="text-ink-2 hover:text-accent-ink">
                  {c.meta.number}. {c.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Study tools" className="text-sm">
          <p className="mb-3 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">Study</p>
          <ul className="space-y-2">
            <li>
              <Link to="/#lectures" className="text-ink-2 hover:text-accent-ink">
                Lecture directory
              </Link>
            </li>
            <li>
              <Link to="/essays" className="text-ink-2 hover:text-accent-ink">
                Essay practice
              </Link>
            </li>
            <li>
              <Link to="/#midterm" className="text-ink-2 hover:text-accent-ink">
                Midterm overview
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-faint sm:px-6">
          © {new Date().getFullYear()} {course.owner}. Progress is saved only in this browser.
        </p>
      </div>
    </footer>
  );
}
