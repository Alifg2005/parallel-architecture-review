import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { chapters } from '../content/registry';
import { ButtonLink } from '../components/ui/Button';

interface NotFoundPageProps {
  /** "lecture" when a lecture id in the URL does not exist. */
  kind?: 'page' | 'lecture';
}

export function NotFoundPage({ kind = 'page' }: NotFoundPageProps) {
  const heading = kind === 'lecture' ? 'That lecture is not available' : 'Page not found';
  return (
    <section className="mx-auto max-w-2xl px-4 pt-20 text-center sm:px-6">
      <title>{`${heading} — Parallel Computer Architecture`}</title>
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
        <Compass className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl sm:text-4xl">{heading}</h1>
      <p className="mt-3 text-muted">
        {kind === 'lecture'
          ? 'This lecture has not been added yet, or the link is mistyped. Choose one of the available lectures below.'
          : 'The address does not match any page on this site.'}
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink to="/">Back to home</ButtonLink>
      </div>
      {chapters.length > 0 && (
        <nav aria-label="Available lectures" className="mt-10 text-left">
          <p className="mb-3 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">Available lectures</p>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {chapters.map((c) => (
              <li key={c.meta.id}>
                <Link to={`/lectures/${c.meta.id}`} className="flex min-h-12 items-center gap-3 px-4 py-2 hover:text-accent-ink">
                  <span className="font-mono text-sm text-faint">{String(c.meta.number).padStart(2, '0')}</span>
                  {c.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
