import type { ChecklistCategory, ChecklistState } from '@/types';
import type { CategoryProgress } from '@/utils/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { ListGroup } from '@/components/common/List';
import { cn } from '@/lib/utils';

/** One checklist category as an inset grouped list with round checkmarks. */
export function ChecklistSection({ category, state, progress, onToggle, onSetAll }: { category: ChecklistCategory; state: ChecklistState; progress: CategoryProgress; onToggle: (id: string, v: boolean) => void; onSetAll: (ids: string[], v: boolean) => void }) {
  const complete = progress.done === progress.total;
  return (
    <ListGroup
      title={`${category.title} · ${progress.done}/${progress.total}`}
      action={
        <button type="button" onClick={() => onSetAll(category.items.map((i) => i.id), !complete)} className="text-subhead text-primary hover:opacity-70">
          {complete ? 'Clear' : 'Check All'}
        </button>
      }
      footer={category.description}
    >
      {category.items.map((item) => {
        const checked = !!state[item.id];
        const id = `chk-${item.id}`;
        return (
          <li key={item.id}>
            <label htmlFor={id} className="relative flex min-h-[3rem] cursor-pointer items-start gap-3 px-4 py-3 transition-colors active:bg-accent" style={{ '--sep-inset': '3.25rem' } as React.CSSProperties}>
              <Checkbox id={id} checked={checked} onCheckedChange={(v) => onToggle(item.id, v === true)} className="mt-px" aria-describedby={item.hint ? `${id}-hint` : undefined} />
              <span className="min-w-0 flex-1">
                <span className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-body transition-colors', checked && 'text-muted-foreground')}>
                  {item.label}
                  {item.critical && !checked && <span className="rounded-full bg-destructive/12 px-1.5 py-px text-[11px] font-semibold text-destructive">Critical</span>}
                </span>
                {item.hint && <span id={`${id}-hint`} className="mt-0.5 block text-footnote text-muted-foreground">{item.hint}</span>}
              </span>
            </label>
          </li>
        );
      })}
    </ListGroup>
  );
}
