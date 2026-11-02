import { describe, expect, it } from 'vitest';
import { computeChecklistProgress, READINESS_COPY } from '../checklist';
import { CHECKLIST } from '@/data/checklist';

const all = Object.fromEntries(CHECKLIST.flatMap((c) => c.items).map((i) => [i.id, true]));
const criticalOnly = Object.fromEntries(CHECKLIST.flatMap((c) => c.items).filter((i) => i.critical).map((i) => [i.id, true]));

describe('checklist progress', () => {
  it('starts empty', () => {
    const p = computeChecklistProgress(CHECKLIST, {});
    expect(p.done).toBe(0);
    expect(p.percent).toBe(0);
    expect(p.status).toBe('not-started');
    expect(p.categories).toHaveLength(4);
  });
  it('flags outstanding critical checks', () => {
    const p = computeChecklistProgress(CHECKLIST, { 'p-rest': true });
    expect(p.status).toBe('critical-outstanding');
    expect(p.criticalOutstanding.some((i) => i.id === 'p-fit')).toBe(true);
  });
  it('is in progress when only non-critical items remain', () => {
    expect(computeChecklistProgress(CHECKLIST, criticalOnly).status).toBe('in-progress');
  });
  it('reports per-category and overall completion', () => {
    const personal = Object.fromEntries(CHECKLIST[0].items.map((i) => [i.id, true]));
    const p = computeChecklistProgress(CHECKLIST, personal);
    expect(p.categories[0].percent).toBe(100);
    expect(p.categories[1].percent).toBe(0);
    expect(p.done).toBe(CHECKLIST[0].items.length);
  });
  it('completes without ever declaring the diver safe', () => {
    const p = computeChecklistProgress(CHECKLIST, all);
    expect(p.percent).toBe(100);
    expect(p.status).toBe('checklist-complete');
    const copy = READINESS_COPY[p.status];
    expect(copy.title).not.toMatch(/safe|cleared|ready to dive/i);
    expect(copy.detail).toMatch(/not a medical or operational clearance/);
  });
  it('covers all required categories', () => {
    expect(CHECKLIST.map((c) => c.id)).toEqual(['personal', 'equipment', 'buddy', 'site']);
  });
});
