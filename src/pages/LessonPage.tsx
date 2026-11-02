import { ArrowRight, CheckCircle2, Lightbulb, Target } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { useAppStore } from '@/store/useAppStore';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { FavoriteButton, ShareButton } from '@/components/common/ActionButtons';
import { StickyActions } from '@/components/common/StickyActions';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { KnowledgeCheck } from '@/components/learning/KnowledgeCheck';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/States';
import { PressureVolumeDiagram } from '@/components/illustrations/ScienceDiagrams';
import { HandSignalArt } from '@/components/illustrations/HandSignals';
import { toast } from '@/lib/toast';

export default function LessonPage() {
  const { lessonId } = useParams();
  const idx = OPEN_WATER_LESSONS.findIndex((l) => l.id === lessonId);
  const lesson = OPEN_WATER_LESSONS[idx];
  const completed = useAppStore((s) => (lesson ? !!s.completedLessons[lesson.id] : false));
  const toggle = useAppStore((s) => s.toggleLesson);

  if (!lesson) return <><ScreenHeader back={{ to: '/open-water', label: 'Open Water' }} title="Not found" /><EmptyState title="Lesson not found" message="That lesson doesn’t exist." action={<Button asChild variant="tinted"><Link to="/open-water">All lessons</Link></Button>} /></>;
  const next = OPEN_WATER_LESSONS[idx + 1];
  const route = `/open-water/${lesson.id}`;

  const markDone = () => {
    toggle(lesson.id);
    if (!completed) toast.success('Lesson completed');
  };

  return (
    <article>
      <ScreenHeader
        back={{ to: '/open-water', label: 'Open Water' }}
        eyebrow={`Lesson ${lesson.order} of ${OPEN_WATER_LESSONS.length} · ${lesson.duration} min`}
        title={lesson.title}
        subtitle={lesson.summary}
        actions={
          <>
            <FavoriteButton item={{ id: `lesson:${lesson.id}`, kind: 'lesson', title: lesson.title, subtitle: 'Open Water lesson', to: route }} />
            <ShareButton title={lesson.title} text={`${lesson.title} — ScubaDive lesson`} route={route} />
          </>
        }
      />

      <div className="mx-auto max-w-3xl space-y-8">
        <figure className="overflow-hidden rounded-2xl">
          <LessonIllustration k={lesson.illustration} className="aspect-[16/10] w-full [&_svg]:h-full" />
        </figure>

        <section className="rounded-2xl bg-card p-4">
          <h2 className="mb-2.5 flex items-center gap-2 text-headline"><Target className="h-5 w-5 text-primary" aria-hidden="true" /> You’ll learn to</h2>
          <ul className="space-y-2 text-subhead">
            {lesson.objectives.map((o) => <li key={o} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{o}</li>)}
          </ul>
        </section>

        {lesson.sections.map((s, i) => (
          <section key={s.heading} className="space-y-3">
            <h2 className="text-title2">{s.heading}</h2>
            <div className="prose-dive space-y-3">{s.body.map((p) => <p key={p}>{p}</p>)}</div>
            {s.bullets && (
              <ul className="list-group overflow-hidden rounded-2xl bg-card">
                {s.bullets.map((b) => (
                  <li key={b}><div className="relative flex gap-3 px-4 py-3 text-callout"><CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-success" aria-hidden="true" />{b}</div></li>
                ))}
              </ul>
            )}
            {lesson.id === 'ow-03' && i === 0 && <PressureVolumeDiagram className="w-full rounded-2xl" />}
            {lesson.id === 'ow-10' && i === 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(['ok', 'problem', 'up', 'out-of-air'] as const).map((sig) => (
                  <HandSignalArt key={sig} signal={sig} className="w-full rounded-2xl" caption={{ ok: 'OK', problem: 'Problem', up: 'Up', 'out-of-air': 'Out of air' }[sig]} />
                ))}
              </div>
            )}
          </section>
        ))}

        <section className="space-y-2 rounded-2xl bg-card p-4">
          <h2 className="text-headline">In the real world</h2>
          <p className="text-subhead text-foreground/85">{lesson.realWorld}</p>
        </section>

        <section className="space-y-2 rounded-2xl bg-[#FFCC00]/12 p-4">
          <h2 className="flex items-center gap-2 text-headline"><Lightbulb className="h-5 w-5 text-[#B38600] dark:text-[#FFD60A]" aria-hidden="true" /> Key takeaways</h2>
          <ul className="space-y-1 text-subhead text-foreground/85">{lesson.keyTakeaways.map((k) => <li key={k}>• {k}</li>)}</ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-title2">Check your understanding</h2>
          <KnowledgeCheck key={lesson.id} questions={lesson.check} onAllCorrect={() => { if (!completed) { toggle(lesson.id, true); toast.success('All correct — lesson completed'); } }} />
        </section>

        <StickyActions>
          <Button variant={completed ? 'secondary' : 'default'} className="flex-1" onClick={markDone} aria-pressed={completed}>
            <CheckCircle2 /> {completed ? 'Completed' : 'Mark Complete'}
          </Button>
          {next && (
            <Button asChild variant="tinted" className="flex-1">
              <Link to={`/open-water/${next.id}`}>Next Lesson <ArrowRight /></Link>
            </Button>
          )}
        </StickyActions>
      </div>
    </article>
  );
}
