import { ArrowLeft, Backpack, BookOpen, CheckCircle2, ClipboardList, Dumbbell, Mountain, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AOW_MODULES, AOW_NOTE } from '@/data/advancedOpenWater';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { LessonCard } from '@/components/learning/LessonCard';
import { InfoList } from '@/components/learning/InfoList';
import { KnowledgeCheck } from '@/components/learning/KnowledgeCheck';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/States';
import { useAppStore } from '@/store/useAppStore';

export default function AdvancedOpenWater() {
  const { moduleId } = useParams();
  const completed = useAppStore((s) => s.completedLessons);
  const toggle = useAppStore((s) => s.toggleLesson);

  if (moduleId) {
    const m = AOW_MODULES.find((x) => x.id === moduleId);
    if (!m) return <EmptyState title="Module not found" action={<Button asChild><Link to="/advanced-open-water">Back</Link></Button>} />;
    const done = !!completed[m.id];
    return (
      <article className="mx-auto max-w-5xl space-y-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2"><Link to="/advanced-open-water"><ArrowLeft /> Advanced Open Water</Link></Button>
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Badge variant="secondary">Adventure module</Badge>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{m.title}</h1>
            <p className="text-lg text-muted-foreground">{m.summary}</p>
            {done && <Badge variant="success"><CheckCircle2 /> Completed</Badge>}
          </div>
          <LessonIllustration k={m.illustration} className="aspect-[16/10] rounded-3xl border shadow-lg" />
        </div>
        <SafetyNotice title="Agency requirements vary">{AOW_NOTE}</SafetyNotice>
        <div className="grid gap-4 md:grid-cols-2">
          <InfoList title="Theory" items={m.theory} icon={BookOpen} className="md:col-span-2" />
          <InfoList title="Equipment considerations" items={m.equipment} icon={Backpack} />
          <InfoList title="Planning" items={m.planning} icon={ClipboardList} />
          <InfoList title="Skills overview" items={m.skills} icon={Dumbbell} tone="success" />
          <InfoList title="Safety considerations" items={m.safety} icon={ShieldAlert} tone="warning" />
        </div>
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Knowledge quiz</h2>
          <KnowledgeCheck key={m.id} questions={m.check} onAllCorrect={() => toggle(m.id, true)} />
        </section>
        <Button variant={done ? 'outline' : 'ocean'} onClick={() => toggle(m.id)} aria-pressed={done}><CheckCircle2 /> {done ? 'Mark as not complete' : 'Mark module complete'}</Button>
      </article>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader icon={Mountain} eyebrow="Learning pathway" title="Advanced Open Water" description="Adventure modules that build on your Open Water foundation — theory, equipment, planning, skills and safety." />
      <SafetyNotice title="How many adventure dives?">{AOW_NOTE}</SafetyNotice>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AOW_MODULES.map((m, i) => (
          <LessonCard key={m.id} to={`/advanced-open-water/${m.id}`} index={i + 1} title={m.title} summary={m.summary} illustration={m.illustration} completed={!!completed[m.id]} meta={`${m.check.length}-question quiz`} />
        ))}
      </div>
    </div>
  );
}
