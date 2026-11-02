import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Section({ title, description, action, children, className, id }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section className={cn('space-y-4', className)} aria-labelledby={id}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id={id} className="text-xl font-bold sm:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
