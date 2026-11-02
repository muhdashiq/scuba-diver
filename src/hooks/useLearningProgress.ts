import { useMemo } from 'react';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { AOW_MODULES } from '@/data/advancedOpenWater';
import { SPECIALTIES } from '@/data/specialties';
import { useAppStore } from '@/store/useAppStore';

export const lessonKey = {
  ow: (id: string) => id,
  aow: (id: string) => id,
  specialty: (id: string) => `spec-${id}`,
};

export function useLearningProgress() {
  const completed = useAppStore((s) => s.completedLessons);
  return useMemo(() => {
    const ow = OPEN_WATER_LESSONS.filter((l) => completed[lessonKey.ow(l.id)]).length;
    const aow = AOW_MODULES.filter((m) => completed[lessonKey.aow(m.id)]).length;
    const spec = SPECIALTIES.filter((s) => completed[lessonKey.specialty(s.id)]).length;
    const total = OPEN_WATER_LESSONS.length + AOW_MODULES.length + SPECIALTIES.length;
    const done = ow + aow + spec;
    const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
    const nextLesson = OPEN_WATER_LESSONS.find((l) => !completed[l.id]);
    return {
      openWater: { done: ow, total: OPEN_WATER_LESSONS.length, percent: pct(ow, OPEN_WATER_LESSONS.length) },
      advanced: { done: aow, total: AOW_MODULES.length, percent: pct(aow, AOW_MODULES.length) },
      specialties: { done: spec, total: SPECIALTIES.length, percent: pct(spec, SPECIALTIES.length) },
      overall: { done, total, percent: pct(done, total) },
      nextLesson,
    };
  }, [completed]);
}
