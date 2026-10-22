import { Fragment } from 'react';

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

/** Renders the content inline syntax: **bold** and `code`. Plain text otherwise (no HTML). */
export function RichText({ text }: { text: string }) {
  const parts = text.split(INLINE);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
          return (
            <code
              key={i}
              className="rounded-md border border-line bg-code-bg px-1.5 py-px font-mono text-[0.86em] break-words text-code-ink"
            >
              {part.slice(1, -1)}
            </code>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
