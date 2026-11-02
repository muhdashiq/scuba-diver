import { BookOpen, BrainCircuit, CalendarClock, History as HistoryIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { EmptyState } from '@/components/common/States';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented';
import { useAppStore } from '@/store/useAppStore';
import { QUIZ_CATEGORIES } from '@/data/quizQuestions';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { AOW_MODULES } from '@/data/advancedOpenWater';
import { SPECIALTIES } from '@/data/specialties';
import { formatDepth } from '@/utils/units';
import { confirm } from '@/lib/confirm';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

function lessonInfo(key: string) {
  if (key.startsWith('spec-')) {
    const s = SPECIALTIES.find((x) => `spec-${x.id}` === key);
    return s && { title: s.title, to: `/specialties/${s.id}`, sub: 'Specialty' };
  }
  const l = OPEN_WATER_LESSONS.find((x) => x.id === key);
  if (l) return { title: l.title, to: `/open-water/${l.id}`, sub: 'Open Water' };
  const m = AOW_MODULES.find((x) => x.id === key);
  return m && { title: m.title, to: `/advanced-open-water/${m.id}`, sub: 'Advanced Open Water' };
}

const dayLabel = (iso: string) => new Date(iso).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });

export default function History() {
  const [tab, setTab] = useState<'quizzes' | 'lessons' | 'plans'>('quizzes');
  const quizzes = useAppStore((s) => s.quizHistory);
  const clearQuizzes = useAppStore((s) => s.clearQuizHistory);
  const completed = useAppStore((s) => s.completedLessons);
  const plans = useAppStore((s) => s.savedPlans);
  const units = useAppStore((s) => s.units);
  const lessons = Object.entries(completed).sort((a, b) => b[1].localeCompare(a[1]));

  const clear = async () => {
    if (!(await confirm({ title: 'Clear quiz history?', message: 'All saved quiz results will be deleted from this device.', confirmLabel: 'Clear History', destructive: true }))) return;
    const prev = quizzes;
    clearQuizzes();
    toast('Quiz history cleared', { action: { label: 'Undo', onClick: () => useAppStore.setState({ quizHistory: prev }) } });
  };

  return (
    <>
      <ScreenHeader back={{ to: '/profile', label: 'Profile' }} title="History" actions={tab === 'quizzes' && quizzes.length ? <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={clear}>Clear</Button> : undefined}>
        <SegmentedControl label="History type" value={tab} onChange={setTab} options={[{ value: 'quizzes', label: 'Quizzes' }, { value: 'lessons', label: 'Lessons' }, { value: 'plans', label: 'Plans' }]} />
      </ScreenHeader>

      {tab === 'quizzes' && (quizzes.length === 0 ? (
        <EmptyState icon={BrainCircuit} title="No quiz results yet" message="Take a quick quiz — your scores will appear here so you can track progress." action={<Button asChild><Link to="/quiz">Take a Quiz</Link></Button>} />
      ) : (
        <ListGroup>
          {quizzes.map((q) => (
            <ListRow
              key={q.id}
              leading={<IconTile icon={BrainCircuit} color="bg-[#FF9500]" />}
              title={q.categories === 'all' ? 'All topics' : q.categories.map((c) => QUIZ_CATEGORIES.find((x) => x.id === c)?.label).join(', ')}
              subtitle={`${dayLabel(q.date)} · ${q.correct}/${q.total} correct · ${q.difficulty}${q.timed ? ' · timed' : ''}`}
              value={<span className={cn('font-semibold', q.percentage >= 70 ? 'text-success' : q.percentage >= 50 ? 'text-warning' : 'text-destructive')}>{q.percentage}%</span>}
            />
          ))}
        </ListGroup>
      ))}

      {tab === 'lessons' && (lessons.length === 0 ? (
        <EmptyState icon={BookOpen} title="No lessons completed yet" message="Lessons you finish will be listed here with the date." action={<Button asChild><Link to="/learn">Start Learning</Link></Button>} />
      ) : (
        <ListGroup>
          {lessons.map(([k, d]) => {
            const info = lessonInfo(k);
            return info ? <ListRow key={k} to={info.to} leading={<IconTile icon={BookOpen} color="bg-[#5856D6]" />} title={info.title} subtitle={`${info.sub} · ${dayLabel(d)}`} /> : null;
          })}
        </ListGroup>
      ))}

      {tab === 'plans' && (plans.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No dive plans yet" action={<Button asChild><Link to="/planner">Plan a Dive</Link></Button>} />
      ) : (
        <ListGroup>
          {plans.map((p) => <ListRow key={p.id} to={`/planner?plan=${p.id}`} leading={<IconTile icon={CalendarClock} color="bg-primary" />} title={p.input.site} subtitle={`Saved ${dayLabel(p.createdAt)} · ${formatDepth(p.input.maxDepth, units)} · ${p.input.bottomTime} min`} />)}
        </ListGroup>
      ))}
      <span className="sr-only"><HistoryIcon /></span>
    </>
  );
}
