import type { ReviewBlock } from '../../content/schema';
import { Callout } from '../ui/Callout';
import { CodeBlock } from './CodeBlock';
import { RichText } from './RichText';

export function ReviewBlockView({ block }: { block: ReviewBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-ink-2">
          <RichText text={block.text} />
        </p>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={block.ordered ? 'list-decimal space-y-2 pl-6 marker:text-accent' : 'space-y-2'}>
          {block.items.map((item, i) => (
            <li key={i} className={block.ordered ? 'pl-1 text-ink-2' : 'relative pl-5 text-ink-2'}>
              {!block.ordered && (
                <span aria-hidden className="absolute top-[0.7em] left-0.5 h-px w-2.5 bg-accent" />
              )}
              <RichText text={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case 'definitions':
      return (
        <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {block.items.map((d) => (
            <div key={d.term} className="grid gap-1 px-4 py-3.5 sm:grid-cols-[minmax(9rem,13rem)_1fr] sm:gap-5 sm:px-5">
              <dt className="font-semibold text-ink">
                <RichText text={d.term} />
              </dt>
              <dd className="text-ink-2">
                <RichText text={d.definition} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'table':
      return (
        <figure className="space-y-2">
          <div className="scroll-x rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[0.92rem]">
              <thead>
                <tr className="bg-surface-2">
                  {block.columns.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="border-b border-line px-4 py-3 font-sans text-xs font-semibold tracking-[0.06em] text-muted uppercase"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-line last:border-0">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                          <RichText text={cell} />
                        </th>
                      ) : (
                        <td key={c} className="px-4 py-3 align-top text-ink-2">
                          <RichText text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="px-1 text-sm text-muted">{block.caption}</figcaption>}
        </figure>
      );

    case 'code':
      return (
        <div className="space-y-3">
          <CodeBlock code={block.code} language={block.language} title={block.title} />
          {block.explanation && (
            <ul className="space-y-1.5 rounded-2xl border border-dashed border-line-strong px-4 py-3 text-[0.94rem] sm:px-5">
              {block.explanation.map((line, i) => (
                <li key={i} className="relative pl-5 text-ink-2">
                  <span aria-hidden className="absolute top-0 left-0 font-mono text-xs leading-7 text-accent">
                    ›
                  </span>
                  <RichText text={line} />
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'callout':
      return (
        <Callout tone={block.tone} title={block.title}>
          {block.text && (
            <p>
              <RichText text={block.text} />
            </p>
          )}
          {block.items && (
            <ul className="space-y-1.5">
              {block.items.map((item, i) => (
                <li key={i} className="relative pl-4">
                  <span aria-hidden className="absolute top-[0.65em] left-0 size-1.5 rounded-full bg-current opacity-50" />
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          )}
        </Callout>
      );

    case 'formula':
      return (
        <div className="rounded-2xl border border-line bg-surface px-4 py-4 sm:px-5">
          {block.label && (
            <p className="mb-1.5 font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">{block.label}</p>
          )}
          <p className="scroll-x font-mono text-[0.95rem] whitespace-nowrap text-ink sm:text-base">{block.expression}</p>
          {block.note && (
            <p className="mt-2 text-sm text-muted">
              <RichText text={block.note} />
            </p>
          )}
        </div>
      );
  }
}
