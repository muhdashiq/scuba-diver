import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Titled bullet list on a single surface. */
export function InfoList({ title, items, icon: Icon, tone = 'primary', className }: { title: string; items: string[]; icon: LucideIcon; tone?: 'primary' | 'warning' | 'success'; className?: string }) {
  const color = tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : 'text-primary';
  return (
    <section className={cn('rounded-2xl bg-card p-4', className)}>
      <h3 className="mb-2.5 flex items-center gap-2 text-headline">
        <Icon className={cn('h-5 w-5', color)} strokeWidth={2.2} aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-2 text-subhead">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span className={cn('mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-current', color)} aria-hidden="true" />
            <span className="text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
