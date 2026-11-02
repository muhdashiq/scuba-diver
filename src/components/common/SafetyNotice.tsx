import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Calm, consistent safety note. Present but not shouting. */
export function SafetyNotice({ title = 'For learning, not certification', children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <aside role="note" className={cn('flex gap-3 rounded-2xl bg-warning/[0.08] p-4 text-subhead', className)}>
      <ShieldCheck className="mt-px h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
      <div className="space-y-0.5">
        <p className="font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground [&_strong]:text-foreground">{children}</div>
      </div>
    </aside>
  );
}
