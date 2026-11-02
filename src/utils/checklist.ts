import type { ChecklistCategory, ChecklistItem, ChecklistState } from '@/types';

export interface CategoryProgress {
  id: string;
  title: string;
  done: number;
  total: number;
  percent: number;
  criticalOutstanding: ChecklistItem[];
}

export type ReadinessStatus = 'not-started' | 'in-progress' | 'critical-outstanding' | 'checklist-complete';

export interface ChecklistProgress {
  done: number;
  total: number;
  percent: number;
  categories: CategoryProgress[];
  criticalOutstanding: ChecklistItem[];
  status: ReadinessStatus;
}

export function computeChecklistProgress(categories: ChecklistCategory[], state: ChecklistState): ChecklistProgress {
  const cats: CategoryProgress[] = categories.map((c) => {
    const done = c.items.filter((i) => state[i.id]).length;
    return {
      id: c.id,
      title: c.title,
      done,
      total: c.items.length,
      percent: c.items.length ? Math.round((done / c.items.length) * 100) : 0,
      criticalOutstanding: c.items.filter((i) => i.critical && !state[i.id]),
    };
  });
  const done = cats.reduce((s, c) => s + c.done, 0);
  const total = cats.reduce((s, c) => s + c.total, 0);
  const criticalOutstanding = cats.flatMap((c) => c.criticalOutstanding);
  const percent = total ? Math.round((done / total) * 100) : 0;

  let status: ReadinessStatus;
  if (done === 0) status = 'not-started';
  else if (done === total) status = 'checklist-complete';
  else if (criticalOutstanding.length > 0) status = 'critical-outstanding';
  else status = 'in-progress';

  return { done, total, percent, categories: cats, criticalOutstanding, status };
}

/**
 * Human-readable summary. Deliberately never states that a diver is "safe" or "cleared":
 * a completed checklist only means the listed items were reviewed.
 */
export const READINESS_COPY: Record<ReadinessStatus, { title: string; detail: string }> = {
  'not-started': {
    title: 'Checklist not started',
    detail: 'Work through each category with your buddy before kitting up.',
  },
  'in-progress': {
    title: 'In progress',
    detail: 'All critical checks are ticked, but some items remain. Finish the list before entering the water.',
  },
  'critical-outstanding': {
    title: 'Critical checks outstanding',
    detail: 'One or more critical items are not yet confirmed. Resolve them before the dive — or do not dive.',
  },
  'checklist-complete': {
    title: 'All items reviewed',
    detail:
      'You have reviewed every item. This is a memory aid, not a medical or operational clearance. If anything feels wrong, call the dive — any diver can end any dive at any time.',
  },
};
