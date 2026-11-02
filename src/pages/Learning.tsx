import { BookOpen, BrainCircuit, Mountain, Sparkles } from 'lucide-react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { ProgressRing } from '@/components/common/ProgressRing';
import { Progress } from '@/components/ui/progress';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useAppStore } from '@/store/useAppStore';

export default function Learning() {
  const p = useLearningProgress();
  const quizzes = useAppStore((s) => s.quizHistory);
  const courses = [
    { to: '/open-water', title: 'Open Water Diver', icon: BookOpen, color: 'bg-primary', prog: p.openWater, unit: 'lessons' },
    { to: '/advanced-open-water', title: 'Advanced Open Water', icon: Mountain, color: 'bg-[#5856D6]', prog: p.advanced, unit: 'modules' },
    { to: '/specialties', title: 'Specialties', icon: Sparkles, color: 'bg-[#AF52DE]', prog: p.specialties, unit: 'specialties' },
  ];
  return (
    <>
      <ScreenHeader title="Learn" subtitle="Visual lessons that prepare you for training and dives." />
      <div className="space-y-8">
        <div className="flex items-center gap-4 rounded-2xl bg-card p-4">
          <ProgressRing value={p.overall.percent} size={64} stroke={7} label={`Overall progress ${p.overall.percent}%`} />
          <div>
            <p className="text-headline">Your progress</p>
            <p className="text-subhead text-muted-foreground">{p.overall.done} of {p.overall.total} completed{p.nextLesson ? ` · Next: ${p.nextLesson.title}` : ''}</p>
          </div>
        </div>

        <ListGroup title="Courses">
          {courses.map((c) => (
            <ListRow
              key={c.to}
              to={c.to}
              leading={<IconTile icon={c.icon} color={c.color} size="lg" />}
              separatorInset="4.75rem"
              title={c.title}
              subtitle={
                <span className="flex items-center gap-2 pt-1">
                  <Progress value={c.prog.percent} className="h-1 max-w-[8rem]" aria-label={`${c.title} progress`} />
                  <span className="tabular">{c.prog.done}/{c.prog.total} {c.unit}</span>
                </span>
              }
            />
          ))}
        </ListGroup>

        <ListGroup title="Practice">
          <ListRow to="/quiz" leading={<IconTile icon={BrainCircuit} color="bg-[#FF9500]" size="lg" />} separatorInset="4.75rem" title="Knowledge Quiz" subtitle={quizzes.length ? `Last score ${quizzes[0].percentage}% · ${quizzes.length} taken` : '73 questions · 11 topics'} />
        </ListGroup>

        <p className="px-4 text-footnote text-muted-foreground">Lessons support — but never replace — a course with a qualified instructor from a recognised training agency. Completing them does not certify you.</p>
      </div>
    </>
  );
}
