import { AlertTriangle, CheckCheck, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChecklistCategory, ChecklistState } from '@/types';
import type { CategoryProgress } from '@/utils/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ChecklistCategoryCard({ category, state, progress, onToggle, onSetAll, index }: { category: ChecklistCategory; state: ChecklistState; progress: CategoryProgress; onToggle: (id: string, v: boolean) => void; onSetAll: (ids: string[], v: boolean) => void; index: number }) {
  const [open, setOpen] = useState(true);
  const complete = progress.done === progress.total;
  const panelId = `cl-${category.id}`;
  return (
    <section className={cn('overflow-hidden rounded-2xl border bg-card shadow-sm', complete && 'border-success/50')} aria-labelledby={`${panelId}-h`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId} className="flex w-full items-center gap-4 p-4 text-left hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold', complete ? 'bg-success text-success-foreground' : 'bg-primary/10 text-primary')}>
          {complete ? <CheckCheck className="h-5 w-5" aria-hidden="true" /> : String.fromCharCode(65 + index)}
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h2 id={`${panelId}-h`} className="font-bold">{category.title}</h2>
            <span className="text-sm font-semibold tabular text-muted-foreground">{progress.done}/{progress.total}</span>
          </div>
          <Progress value={progress.percent} aria-label={`${category.title} ${progress.percent}% complete`} indicatorClassName={complete ? 'from-emerald-500 to-teal-400' : undefined} />
          {progress.criticalOutstanding.length > 0 && (
            <p className="flex items-center gap-1 text-xs font-semibold text-destructive"><AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> {progress.criticalOutstanding.length} critical check{progress.criticalOutstanding.length > 1 ? 's' : ''} outstanding</p>
          )}
        </div>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="space-y-1 border-t px-4 pb-4 pt-3">
              <div className="flex items-center justify-between pb-2">
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <Button variant="ghost" size="sm" onClick={() => onSetAll(category.items.map((i) => i.id), !complete)}>{complete ? 'Clear' : 'Tick all'}</Button>
              </div>
              <ul className="space-y-1">
                {category.items.map((item) => {
                  const checked = !!state[item.id];
                  const id = `chk-${item.id}`;
                  return (
                    <li key={item.id}>
                      <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent/50', checked && 'bg-success/5')}>
                        <Checkbox id={id} checked={checked} onCheckedChange={(v) => onToggle(item.id, v === true)} className="mt-0.5" aria-describedby={item.hint ? `${id}-hint` : undefined} />
                        <span className="min-w-0 flex-1">
                          <span className={cn('flex flex-wrap items-center gap-2 text-sm font-medium', checked && 'text-muted-foreground line-through decoration-success/60')}>
                            {item.label}
                            {item.critical && <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide no-underline', checked ? 'bg-muted text-muted-foreground' : 'bg-destructive/15 text-destructive')}>Critical</span>}
                          </span>
                          {item.hint && <span id={`${id}-hint`} className="mt-0.5 block text-xs text-muted-foreground">{item.hint}</span>}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
