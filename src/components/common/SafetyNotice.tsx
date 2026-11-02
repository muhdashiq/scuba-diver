import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/** Prominent educational / safety disclaimer used across the app. */
export function SafetyNotice({ title = 'Educational use only', children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <aside role="note" className={cn('flex gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm', className)}>
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </aside>
  );
}
