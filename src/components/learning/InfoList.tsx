import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InfoList({ title, items, icon: Icon, tone = 'primary', className }: { title: string; items: string[]; icon: LucideIcon; tone?: 'primary' | 'warning' | 'success'; className?: string }) {
  const tones = { primary: 'bg-primary/10 text-primary', warning: 'bg-warning/15 text-warning', success: 'bg-success/15 text-success' };
  return (
    <div className={cn('rounded-2xl border bg-card p-4', className)}>
      <h3 className="mb-3 flex items-center gap-2 font-bold">
        <span className={cn('rounded-lg p-1.5', tones[tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', tone === 'warning' ? 'bg-warning' : tone === 'success' ? 'bg-success' : 'bg-primary')} aria-hidden="true" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
