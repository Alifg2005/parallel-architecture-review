import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

export interface TocItem {
  id: string;
  title: string;
}

/** Sticky section navigation that highlights the section currently in view. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-mono text-[0.7rem] tracking-[0.16em] text-faint uppercase">On this page</p>
      <ol className="space-y-0.5 border-l border-line">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={cn(
                '-ml-px flex gap-2.5 border-l-2 py-1.5 pr-2 pl-3.5 leading-snug transition-colors',
                active === item.id
                  ? 'border-accent font-medium text-ink'
                  : 'border-transparent text-muted hover:border-line-strong hover:text-ink',
              )}
            >
              <span className="font-mono text-[0.7rem] leading-5 text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
