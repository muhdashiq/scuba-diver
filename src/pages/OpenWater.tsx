import { Waves } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { LessonCard } from '@/components/learning/LessonCard';
import { ProgressRing } from '@/components/common/ProgressRing';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';

export default function OpenWater() {
  const completed = useAppStore((s) => s.completedLessons);
  const { openWater } = useLearningProgress();
  return (
    <div className="space-y-8">
      <PageHeader
        icon={Waves}
        eyebrow="Learning pathway"
        title="Open Water Diver"
        description="Fifteen lessons covering the knowledge behind your first certification. Work through them in order and check your understanding as you go."
        actions={
          <ProgressRing value={openWater.percent} tone="light" size={84} label={`Open Water progress ${openWater.percent}%`}>
            <span className="text-base font-extrabold">{openWater.done}/{openWater.total}</span>
            <span className="text-[10px] uppercase tracking-wide text-cyan-100">lessons</span>
          </ProgressRing>
        }
      />
      <SafetyNotice>These lessons support — but never replace — an Open Water course with in-water training by a qualified instructor.</SafetyNotice>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {OPEN_WATER_LESSONS.map((l) => (
          <li key={l.id}>
            <LessonCard to={`/open-water/${l.id}`} index={l.order} title={l.title} summary={l.summary} illustration={l.illustration} duration={l.duration} completed={!!completed[l.id]} />
          </li>
        ))}
      </ol>
    </div>
  );
}
