import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { course } from '../../content/course';
import { cn } from '../../lib/cn';
import { ForkJoinMark } from '../ui/ForkJoinMark';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { to: '/#lectures', label: 'Lectures' },
  { to: '/essays', label: 'Essay practice' },
  { to: '/#midterm', label: 'Midterm' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = (active: boolean) =>
    cn(
      'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
      active ? 'bg-accent-soft text-accent-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-3 rounded-xl" aria-label={`${course.name} — home`}>
          <ForkJoinMark className="shrink-0 transition-transform duration-200 group-hover:-rotate-6" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[1.02rem] font-medium text-ink">{course.name}</span>
            <span className="block truncate text-xs text-muted">{course.owner}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) =>
            l.to.startsWith('/#') ? (
              <Link key={l.to} to={l.to} className={linkClass(false)}>
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => linkClass(isActive)}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-bg px-4 pt-2 pb-4 md:hidden">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-ink-2 hover:bg-surface-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
