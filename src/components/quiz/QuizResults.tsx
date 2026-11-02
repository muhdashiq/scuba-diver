import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { gradeLabel, scoreByCategory, scoreQuiz } from '@/utils/quizEngine';
import { QUIZ_CATEGORIES } from '@/data/quizQuestions';
import { ProgressRing } from '@/components/common/ProgressRing';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented';
import { Progress } from '@/components/ui/progress';
import { QuizVisual } from '@/components/illustrations/VisualRegistry';
import { ListGroup } from '@/components/common/List';
import { StickyActions } from '@/components/common/StickyActions';

export function QuizResults({ questions, answers, onRetry, onNew }: { questions: QuizQuestion[]; answers: QuizAnswer[]; onRetry: () => void; onNew: () => void }) {
  const score = scoreQuiz(answers);
  const grade = gradeLabel(score.percentage);
  const byCat = scoreByCategory(questions, answers).map((c) => ({ ...c, label: QUIZ_CATEGORIES.find((x) => x.id === c.category)?.label ?? c.category }));
  const [tab, setTab] = useState<'incorrect' | 'correct'>(score.incorrect ? 'incorrect' : 'correct');
  const review = questions.map((q) => ({ q, a: answers.find((x) => x.questionId === q.id) })).filter(({ a }) => (tab === 'correct' ? a?.correct : !a?.correct));

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <ProgressRing value={score.percentage} size={132} stroke={12} tone={grade.tone === 'success' ? 'success' : grade.tone === 'warning' ? 'warning' : 'destructive'} label={`Score ${score.percentage}%`}>
          <span className="text-title1 tabular">{score.percentage}%</span>
        </ProgressRing>
        <h1 className="text-title1">{grade.label}</h1>
        <p className="text-subhead text-muted-foreground">{score.correct} of {score.total} correct</p>
      </div>

      {byCat.length > 1 && (
        <ListGroup title="By topic">
          {byCat.map((c) => (
            <li key={c.category}>
              <div className="relative flex items-center gap-3 px-4 py-3" style={{ '--sep-inset': '1rem' } as React.CSSProperties}>
                <span className="w-36 shrink-0 truncate text-subhead">{c.label}</span>
                <Progress value={c.percentage} aria-label={`${c.label} ${c.percentage}%`} indicatorClassName={c.percentage >= 70 ? 'bg-success' : c.percentage >= 50 ? 'bg-warning' : 'bg-destructive'} />
                <span className="w-10 shrink-0 text-right text-subhead tabular text-muted-foreground">{c.percentage}%</span>
              </div>
            </li>
          ))}
        </ListGroup>
      )}

      <section className="space-y-3">
        <SegmentedControl label="Review answers" value={tab} onChange={setTab} options={[{ value: 'incorrect', label: <><XCircle /> Missed ({score.incorrect})</> }, { value: 'correct', label: <><CheckCircle2 /> Correct ({score.correct})</> }]} />
        {review.length === 0 && <p className="py-6 text-center text-subhead text-muted-foreground">{tab === 'incorrect' ? 'Nothing missed — excellent!' : 'No correct answers this time. Review the lessons and try again.'}</p>}
        <div className="space-y-2">
          {review.map(({ q, a }) => (
            <details key={q.id} className="group rounded-2xl bg-card p-4">
              <summary className="flex cursor-pointer list-none items-start gap-3 rounded text-callout font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {a?.correct ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 fill-success text-card" aria-hidden="true" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 fill-destructive text-card" aria-hidden="true" />}
                <span>{q.prompt}</span>
              </summary>
              <div className="mt-3 space-y-2 pl-8 text-subhead">
                {q.visual && <QuizVisual visual={q.visual.key} highlight={q.visual.highlight} showLabels className="w-full max-w-md rounded-xl" />}
                <p><span className="text-muted-foreground">Your answer: </span>{a?.selectedIndex == null ? 'No answer (time ran out)' : q.options[a.selectedIndex]}</p>
                {!a?.correct && <p><span className="text-muted-foreground">Correct: </span><strong className="text-success">{q.options[q.correctIndex]}</strong></p>}
                <p className="text-muted-foreground">{q.explanation}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <StickyActions>
        <Button variant="tinted" className="flex-1" onClick={onRetry}><RotateCcw /> Retry</Button>
        <Button className="flex-1" onClick={onNew}>New Quiz</Button>
      </StickyActions>
    </div>
  );
}
