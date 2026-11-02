import { Backpack, BookOpen, CheckCircle2, ClipboardList, Dumbbell, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AOW_MODULES, AOW_NOTE } from '@/data/advancedOpenWater';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { FavoriteButton, ShareButton } from '@/components/common/ActionButtons';
import { StickyActions } from '@/components/common/StickyActions';
import { ListGroup } from '@/components/common/List';
import { LessonRow } from '@/components/learning/LessonRow';
import { InfoList } from '@/components/learning/InfoList';
import { KnowledgeCheck } from '@/components/learning/KnowledgeCheck';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/common/States';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { toast } from '@/lib/toast';

export default function AdvancedOpenWater() {
  const { moduleId } = useParams();
  const completed = useAppStore((s) => s.completedLessons);
  const toggle = useAppStore((s) => s.toggleLesson);
  const { advanced } = useLearningProgress();

  if (moduleId) {
    const m = AOW_MODULES.find((x) => x.id === moduleId);
    if (!m) return <><ScreenHeader back={{ to: '/advanced-open-water', label: 'Advanced' }} title="Not found" /><EmptyState title="Module not found" action={<Button asChild variant="tinted"><Link to="/advanced-open-water">All modules</Link></Button>} /></>;
    const done = !!completed[m.id];
    const route = `/advanced-open-water/${m.id}`;
    return (
      <article>
        <ScreenHeader
          back={{ to: '/advanced-open-water', label: 'Advanced' }}
          eyebrow="Adventure module"
          title={m.title}
          subtitle={m.summary}
          actions={<><FavoriteButton item={{ id: `module:${m.id}`, kind: 'module', title: m.title, subtitle: 'Advanced Open Water', to: route }} /><ShareButton title={m.title} route={route} /></>}
        />
        <div className="mx-auto max-w-3xl space-y-6">
          <LessonIllustration k={m.illustration} className="aspect-[16/10] rounded-2xl [&_svg]:h-full" />
          <InfoList title="Theory" items={m.theory} icon={BookOpen} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoList title="Equipment" items={m.equipment} icon={Backpack} />
            <InfoList title="Planning" items={m.planning} icon={ClipboardList} />
            <InfoList title="Skills" items={m.skills} icon={Dumbbell} tone="success" />
            <InfoList title="Safety" items={m.safety} icon={ShieldAlert} tone="warning" />
          </div>
          <p className="px-1 text-footnote text-muted-foreground">{AOW_NOTE}</p>
          <section className="space-y-3">
            <h2 className="text-title2">Quick quiz</h2>
            <KnowledgeCheck key={m.id} questions={m.check} onAllCorrect={() => { if (!done) { toggle(m.id, true); toast.success('All correct — module completed'); } }} />
          </section>
          <StickyActions>
            <Button variant={done ? 'secondary' : 'default'} className="flex-1" onClick={() => { toggle(m.id); if (!done) toast.success('Module completed'); }} aria-pressed={done}><CheckCircle2 /> {done ? 'Completed' : 'Mark Complete'}</Button>
          </StickyActions>
        </div>
      </article>
    );
  }

  return (
    <>
      <ScreenHeader
        back={{ to: '/learn', label: 'Learn' }}
        title="Advanced Open Water"
        subtitle={<span className="flex items-center gap-3 pt-1"><Progress value={advanced.percent} className="max-w-[10rem]" aria-label="Advanced progress" /><span className="tabular">{advanced.done} of {advanced.total} modules</span></span>}
      />
      <div className="space-y-6">
        <SafetyNotice title="Adventure dives vary by agency">{AOW_NOTE}</SafetyNotice>
        <ListGroup>
          {AOW_MODULES.map((m, i) => (
            <LessonRow key={m.id} to={`/advanced-open-water/${m.id}`} index={i + 1} title={m.title} subtitle={m.summary} illustration={m.illustration} completed={!!completed[m.id]} />
          ))}
        </ListGroup>
      </div>
    </>
  );
}
