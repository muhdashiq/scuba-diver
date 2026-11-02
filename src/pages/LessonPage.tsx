import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Globe2, Lightbulb, Target } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { useAppStore } from '@/store/useAppStore';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { KnowledgeCheck } from '@/components/learning/KnowledgeCheck';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/States';
import { PressureVolumeDiagram } from '@/components/illustrations/ScienceDiagrams';
import { HandSignalArt } from '@/components/illustrations/HandSignals';

export default function LessonPage() {
  const { lessonId } = useParams();
  const idx = OPEN_WATER_LESSONS.findIndex((l) => l.id === lessonId);
  const lesson = OPEN_WATER_LESSONS[idx];
  const completed = useAppStore((s) => (lesson ? !!s.completedLessons[lesson.id] : false));
  const toggle = useAppStore((s) => s.toggleLesson);

  if (!lesson) {
    return <EmptyState title="Lesson not found" message="That lesson doesn’t exist." action={<Button asChild><Link to="/open-water">Back to Open Water</Link></Button>} />;
  }
  const prev = OPEN_WATER_LESSONS[idx - 1];
  const next = OPEN_WATER_LESSONS[idx + 1];

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/open-water"><ArrowLeft /> Open Water lessons</Link>
      </Button>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Lesson {lesson.order} of {OPEN_WATER_LESSONS.length}</Badge>
          <Badge variant="outline">{lesson.duration} min read</Badge>
          {completed && <Badge variant="success"><CheckCircle2 /> Completed</Badge>}
        </div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.summary}</p>
      </header>

      <figure className="overflow-hidden rounded-3xl border shadow-lg">
        <LessonIllustration k={lesson.illustration} className="aspect-[16/10] w-full" />
        <figcaption className="bg-card px-4 py-2 text-xs text-muted-foreground">Original illustration — diagrams are simplified for learning.</figcaption>
      </figure>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Target className="h-5 w-5 text-primary" aria-hidden="true" /> Learning objectives</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-2 text-sm"><Circle className="mt-1 h-3 w-3 shrink-0 text-primary" aria-hidden="true" />{o}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {lesson.sections.map((s, i) => (
          <section key={s.heading} className="space-y-3">
            <h2 className="flex items-center gap-2 text-xl font-bold"><BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />{s.heading}</h2>
            <div className="prose-dive space-y-3">
              {s.body.map((p) => <p key={p}>{p}</p>)}
            </div>
            {s.bullets && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 rounded-xl border bg-card p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />{b}</li>
                ))}
              </ul>
            )}
            {/* Supplementary diagrams for specific lessons */}
            {lesson.id === 'ow-03' && i === 0 && <PressureVolumeDiagram className="w-full rounded-2xl" />}
            {lesson.id === 'ow-10' && i === 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(['ok', 'problem', 'up', 'out-of-air'] as const).map((sig) => (
                  <HandSignalArt key={sig} signal={sig} className="w-full rounded-2xl" caption={{ ok: 'OK', problem: 'Problem', up: 'Up', 'out-of-air': 'Out of air' }[sig]} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-5">
            <h2 className="flex items-center gap-2 font-bold"><Globe2 className="h-5 w-5 text-primary" aria-hidden="true" /> Real-world example</h2>
            <p className="text-sm text-muted-foreground">{lesson.realWorld}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <h2 className="flex items-center gap-2 font-bold"><Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" /> Key takeaways</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {lesson.keyTakeaways.map((k) => <li key={k}>• {k}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Knowledge check</h2>
        <KnowledgeCheck key={lesson.id} questions={lesson.check} onAllCorrect={() => toggle(lesson.id, true)} />
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant={completed ? 'outline' : 'ocean'} onClick={() => toggle(lesson.id)} aria-pressed={completed}>
          <CheckCircle2 /> {completed ? 'Mark as not complete' : 'Mark lesson complete'}
        </Button>
        <div className="flex gap-2">
          {prev && <Button asChild variant="ghost"><Link to={`/open-water/${prev.id}`}><ArrowLeft /> Previous</Link></Button>}
          {next && <Button asChild><Link to={`/open-water/${next.id}`}>Next <ArrowRight /></Link></Button>}
        </div>
      </div>
    </article>
  );
}
