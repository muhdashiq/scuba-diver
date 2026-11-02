import { CheckCircle2, RotateCcw, Settings2, XCircle } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { gradeLabel, scoreByCategory, scoreQuiz } from '@/utils/quizEngine';
import { QUIZ_CATEGORIES } from '@/data/quizQuestions';
import { ProgressRing } from '@/components/common/ProgressRing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizVisual } from '@/components/illustrations/VisualRegistry';

export function QuizResults({ questions, answers, onRetry, onNew }: { questions: QuizQuestion[]; answers: QuizAnswer[]; onRetry: () => void; onNew: () => void }) {
  const score = scoreQuiz(answers);
  const grade = gradeLabel(score.percentage);
  const byCat = scoreByCategory(questions, answers).map((c) => ({ ...c, label: QUIZ_CATEGORIES.find((x) => x.id === c.category)?.label ?? c.category }));
  const review = questions.map((q) => ({ q, a: answers.find((x) => x.questionId === q.id) }));

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="ocean-gradient flex flex-col items-center gap-4 p-6 text-center text-white sm:flex-row sm:text-left">
          <ProgressRing value={score.percentage} size={120} stroke={11} tone="light" label={`Score ${score.percentage}%`}>
            <span className="text-3xl font-extrabold tabular">{score.percentage}%</span>
          </ProgressRing>
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">Final score</p>
            <h2 className="text-2xl font-extrabold">{grade.label}</h2>
            <p className="text-cyan-50/90">{score.correct} correct · {score.incorrect} incorrect · {score.total} questions</p>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <Button onClick={onRetry} className="bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"><RotateCcw /> Retry</Button>
            <Button onClick={onNew} variant="ocean"><Settings2 /> New quiz</Button>
          </div>
        </div>
      </Card>

      {byCat.length > 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Score by category</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64 w-full" role="img" aria-label={`Category scores: ${byCat.map((c) => `${c.label} ${c.percentage}%`).join(', ')}`}>
              <ResponsiveContainer>
                <BarChart data={byCat} layout="vertical" margin={{ left: 12, right: 16 }}>
                  <CartesianGrid horizontal={false} strokeOpacity={0.15} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <YAxis type="category" dataKey="label" width={130} tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--popover-foreground))' }} />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                    {byCat.map((c) => <Cell key={c.category} fill={c.percentage >= 70 ? '#14b8a6' : c.percentage >= 50 ? '#f59e0b' : '#f43f5e'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Answer review</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="incorrect">
            <TabsList>
              <TabsTrigger value="incorrect"><XCircle /> Incorrect ({score.incorrect})</TabsTrigger>
              <TabsTrigger value="correct"><CheckCircle2 /> Correct ({score.correct})</TabsTrigger>
            </TabsList>
            {(['incorrect', 'correct'] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-3">
                {review.filter(({ a }) => (tab === 'correct' ? a?.correct : !a?.correct)).length === 0 && (
                  <p className="py-4 text-sm text-muted-foreground">{tab === 'incorrect' ? 'No incorrect answers — excellent!' : 'No correct answers this time. Review the lessons and try again.'}</p>
                )}
                {review
                  .filter(({ a }) => (tab === 'correct' ? a?.correct : !a?.correct))
                  .map(({ q, a }) => (
                    <details key={q.id} className="group rounded-2xl border bg-card p-4 open:shadow-sm">
                      <summary className="flex cursor-pointer list-none items-start gap-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                        {a?.correct ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />}
                        <span>{q.prompt}</span>
                      </summary>
                      <div className="mt-3 space-y-2 pl-8 text-sm">
                        {q.visual && <QuizVisual visual={q.visual.key} highlight={q.visual.highlight} showLabels className="w-full max-w-md rounded-xl" />}
                        <p><span className="text-muted-foreground">Your answer: </span><strong>{a?.selectedIndex === null || a?.selectedIndex === undefined ? 'No answer (timed out)' : q.options[a.selectedIndex]}</strong></p>
                        {!a?.correct && <p><span className="text-muted-foreground">Correct answer: </span><strong className="text-success">{q.options[q.correctIndex]}</strong></p>}
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    </details>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
