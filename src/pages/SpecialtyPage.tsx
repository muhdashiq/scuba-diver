import { AlertTriangle, ArrowLeft, Backpack, BookOpen, CheckCircle2, Dumbbell, ListChecks, Route } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SPECIALTIES, SPECIALTY_CATEGORIES, SPECIALTY_DISCLAIMER } from '@/data/specialties';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { InfoList } from '@/components/learning/InfoList';
import { KnowledgeCheck } from '@/components/learning/KnowledgeCheck';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/States';
import { useAppStore } from '@/store/useAppStore';
import { lessonKey } from '@/hooks/useLearningProgress';

export default function SpecialtyPage() {
  const { specialtyId } = useParams();
  const s = SPECIALTIES.find((x) => x.id === specialtyId);
  const key = s ? lessonKey.specialty(s.id) : '';
  const done = useAppStore((st) => !!st.completedLessons[key]);
  const toggle = useAppStore((st) => st.toggleLesson);
  if (!s) return <EmptyState title="Specialty not found" action={<Button asChild><Link to="/specialties">Back</Link></Button>} />;

  return (
    <article className="mx-auto max-w-5xl space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2"><Link to="/specialties"><ArrowLeft /> Specialties</Link></Button>
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Badge variant="secondary">{SPECIALTY_CATEGORIES[s.category]}</Badge>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{s.title}</h1>
          <p className="text-lg text-muted-foreground">{s.summary}</p>
          <div className="prose-dive space-y-2">{s.overview.map((o) => <p key={o}>{o}</p>)}</div>
        </div>
        <LessonIllustration k={s.illustration} className="aspect-[16/10] rounded-3xl border shadow-lg" />
      </div>

      <SafetyNotice title="This lesson does not qualify you for specialty dives">{SPECIALTY_DISCLAIMER}</SafetyNotice>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoList title="Prerequisites (typical)" items={s.prerequisites} icon={ListChecks} />
        <InfoList title="Required equipment" items={s.equipment} icon={Backpack} />
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold"><BookOpen className="h-5 w-5 text-primary" aria-hidden="true" /> Theory lessons</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {s.theory.map((t, i) => (
            <Card key={t.heading}>
              <CardContent className="space-y-2 p-5">
                <span className="text-xs font-bold text-primary">Lesson {i + 1}</span>
                <h3 className="font-bold">{t.heading}</h3>
                <p className="text-sm text-muted-foreground">{t.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoList title="Important skills" items={s.skills} icon={Dumbbell} tone="success" />
        <InfoList title="Risks & safety considerations" items={s.risks} icon={AlertTriangle} tone="warning" />
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Route className="h-5 w-5 text-primary" aria-hidden="true" /> Recommended learning pathway</h2>
        <ol className="flex flex-wrap items-center gap-2">
          {s.pathway.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${step === s.title ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{step}</span>
              {i < s.pathway.length - 1 && <span aria-hidden="true" className="text-muted-foreground">→</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Interactive quiz</h2>
        <KnowledgeCheck key={s.id} questions={s.check} onAllCorrect={() => toggle(key, true)} />
      </section>
      <Button variant={done ? 'outline' : 'ocean'} onClick={() => toggle(key)} aria-pressed={done}><CheckCircle2 /> {done ? 'Mark as not complete' : 'Mark as studied'}</Button>
    </article>
  );
}
