import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeading({ eyebrow, title, lead, id, as: Tag = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {eyebrow && (
        <p className="font-mono text-[0.72rem] font-medium tracking-[0.16em] text-accent uppercase">{eyebrow}</p>
      )}
      <Tag id={id} className="text-[1.75rem] font-medium sm:text-4xl">
        {title}
      </Tag>
      {lead && <p className="max-w-2xl text-muted">{lead}</p>}
    </div>
  );
}
