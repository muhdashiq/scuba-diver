import { describe, expect, it } from 'vitest';
import { useAppStore } from './useAppStore';

describe('app store', () => {
  it('toggles favourites', () => {
    const item = { id: 'lesson:ow-01', kind: 'lesson' as const, title: 'Intro', to: '/open-water/ow-01' };
    expect(useAppStore.getState().toggleFavorite(item)).toBe(true);
    expect(useAppStore.getState().favorites['lesson:ow-01']).toMatchObject({ title: 'Intro' });
    expect(useAppStore.getState().toggleFavorite(item)).toBe(false);
    expect(useAppStore.getState().favorites['lesson:ow-01']).toBeUndefined();
  });
  it('updates and deletes saved plans', () => {
    const p = useAppStore.getState().savePlan({ site: 'Reef' } as never);
    useAppStore.getState().updatePlan(p.id, { site: 'Reef 2' } as never);
    expect(useAppStore.getState().savedPlans.find((x) => x.id === p.id)?.input.site).toBe('Reef 2');
    useAppStore.getState().deletePlan(p.id);
    expect(useAppStore.getState().savedPlans.some((x) => x.id === p.id)).toBe(false);
  });
  it('remembers dismissed tips and read notifications without duplicates', () => {
    useAppStore.getState().dismissTip('t1');
    useAppStore.getState().dismissTip('t1');
    expect(useAppStore.getState().dismissedTips.filter((t) => t === 't1')).toHaveLength(1);
    useAppStore.getState().markNotificationsRead(['a', 'b', 'a']);
    expect(useAppStore.getState().readNotifications).toEqual(expect.arrayContaining(['a', 'b']));
  });
  it('migrates v1 data so existing users skip onboarding', () => {
    const migrate = useAppStore.persist.getOptions().migrate!;
    expect(migrate({ profile: { name: 'Sam' } }, 1)).toMatchObject({ onboarded: true, favorites: {} });
    expect(migrate({ profile: { name: '' } }, 1)).toMatchObject({ onboarded: false });
  });
});
