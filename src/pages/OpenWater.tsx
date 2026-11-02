import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ListGroup } from '@/components/common/List';
import { LessonRow } from '@/components/learning/LessonRow';
import { Progress } from '@/components/ui/progress';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';

export default function OpenWater() {
  const completed = useAppStore((s) => s.completedLessons);
  const { openWater } = useLearningProgress();
  return (
    <>
      <ScreenHeader
        back={{ to: '/learn', label: 'Learn' }}
        title="Open Water"
        subtitle={
          <span className="flex items-center gap-3 pt-1">
            <Progress value={openWater.percent} className="max-w-[10rem]" aria-label="Open Water progress" />
            <span className="tabular">{openWater.done} of {openWater.total} lessons</span>
          </span>
        }
      />
      <ListGroup footer="These lessons support — but never replace — an Open Water course with in-water training by a qualified instructor.">
        {OPEN_WATER_LESSONS.map((l) => (
          <LessonRow key={l.id} to={`/open-water/${l.id}`} index={l.order} title={l.title} subtitle={`${l.duration} min · ${l.summary}`} illustration={l.illustration} completed={!!completed[l.id]} />
        ))}
      </ListGroup>
    </>
  );
}
