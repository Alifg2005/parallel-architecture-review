import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { CodeLanguage } from '../../content/schema';
import { tokenize } from '../../lib/highlight';

const LANGUAGE_LABEL: Record<CodeLanguage, string> = { c: 'C', asm: 'Assembly', text: 'Output', shell: 'Shell' };

interface CodeBlockProps {
  code: string;
  language: CodeLanguage;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const tokens = useMemo(() => tokenize(code, language), [code, language]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (insecure context) — the code is still selectable */
    }
  };

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-code-bg">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <span className="min-w-0 truncate font-mono text-xs text-muted">{title ?? LANGUAGE_LABEL[language]}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted transition-colors hover:bg-surface hover:text-ink"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <pre className="scroll-x px-4 py-3.5 font-mono text-[0.8rem] leading-relaxed text-code-ink sm:text-[0.84rem]">
        <code>
          {tokens.map((t, i) =>
            t.kind === 'plain' ? (
              t.text
            ) : (
              <span key={i} className={`tok-${t.kind}`}>
                {t.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}
