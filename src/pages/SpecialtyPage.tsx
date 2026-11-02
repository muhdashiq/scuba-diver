import { AlertTriangle, Backpack, CheckCircle2, Dumbbell, ListChecks } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SPECIALTIES, SPECIALTY_CATEGORIES, SPECIALTY_DISCLAIMER } from '@/data/specialties';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { FavoriteButton, ShareButton } from '@/components/common/ActionButtons';
import { StickyActions } from '@/components/common/StickyActions';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { InfoList } from '@/components/learning/InfoList';
import { KnowledgeCheck } from '@/components/learning/KnowledgeCheck';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/States';
import { useAppStore } from '@/store/useAppStore';
import { lessonKey } from '@/hooks/useLearningProgress';
import { toast } from '@/lib/toast';

export default function SpecialtyPage() {
  const { specialtyId } = useParams();
  const s = SPECIALTIES.find((x) => x.id === specialtyId);
  const key = s ? lessonKey.specialty(s.id) : '';
  const done = useAppStore((st) => !!st.completedLessons[key]);
  const toggle = useAppStore((st) => st.toggleLesson);
  if (!s) return <><ScreenHeader back={{ to: '/specialties', label: 'Specialties' }} title="Not found" /><EmptyState title="Specialty not found" action={<Button asChild variant="tinted"><Link to="/specialties">All specialties</Link></Button>} /></>;
  const route = `/specialties/${s.id}`;

  return (
    <article>
      <ScreenHeader
        back={{ to: '/specialties', label: 'Specialties' }}
        eyebrow={SPECIALTY_CATEGORIES[s.category]}
        title={s.title}
        subtitle={s.summary}
        actions={<><FavoriteButton item={{ id: `specialty:${s.id}`, kind: 'specialty', title: s.title, subtitle: 'Specialty', to: route }} /><ShareButton title={s.title} route={route} /></>}
      />
      <div className="mx-auto max-w-3xl space-y-6">
        <LessonIllustration k={s.illustration} className="aspect-[16/10] rounded-2xl [&_svg]:h-full" />
        <div className="prose-dive space-y-3">{s.overview.map((o) => <p key={o}>{o}</p>)}</div>
        <SafetyNotice title="This preview doesn’t qualify you for specialty dives">{SPECIALTY_DISCLAIMER}</SafetyNotice>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoList title="Typical prerequisites" items={s.prerequisites} icon={ListChecks} />
          <InfoList title="Equipment" items={s.equipment} icon={Backpack} />
        </div>
        <section className="space-y-3">
          <h2 className="text-title2">Theory</h2>
          <ol className="list-group overflow-hidden rounded-2xl bg-card">
            {s.theory.map((t, i) => (
              <li key={t.heading}>
                <div className="relative flex gap-3 px-4 py-3.5" style={{ '--sep-inset': '3.25rem' } as React.CSSProperties}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-footnote font-semibold text-primary">{i + 1}</span>
                  <div>
                    <h3 className="text-headline">{t.heading}</h3>
                    <p className="text-subhead text-muted-foreground">{t.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoList title="Key skills" items={s.skills} icon={Dumbbell} tone="success" />
          <InfoList title="Risks & safety" items={s.risks} icon={AlertTriangle} tone="warning" />
        </div>
        <section className="space-y-3">
          <h2 className="text-title2">Learning pathway</h2>
          <ol className="flex flex-wrap items-center gap-1.5">
            {s.pathway.map((step, i) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className={`rounded-full px-3 py-1.5 text-subhead font-medium ${step === s.title ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>{step}</span>
                {i < s.pathway.length - 1 && <span aria-hidden="true" className="text-muted-foreground">›</span>}
              </li>
            ))}
          </ol>
        </section>
        <section className="space-y-3">
          <h2 className="text-title2">Quick quiz</h2>
          <KnowledgeCheck key={s.id} questions={s.check} onAllCorrect={() => { if (!done) { toggle(key, true); toast.success('All correct — marked as studied'); } }} />
        </section>
        <StickyActions>
          <Button variant={done ? 'secondary' : 'default'} className="flex-1" onClick={() => { toggle(key); if (!done) toast.success('Marked as studied'); }} aria-pressed={done}><CheckCircle2 /> {done ? 'Studied' : 'Mark as Studied'}</Button>
        </StickyActions>
      </div>
    </article>
  );
}
