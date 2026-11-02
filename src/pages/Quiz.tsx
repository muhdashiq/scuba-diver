import { BrainCircuit, History, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { QuizSetup, type QuizSetupValue } from '@/components/quiz/QuizSetup';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QUIZ_QUESTIONS } from '@/data/quizQuestions';
import { buildQuiz, scoreQuiz, TIME_PER_QUESTION_SECONDS } from '@/utils/quizEngine';
import { useAppStore, uid } from '@/store/useAppStore';

type Phase = { name: 'setup' } | { name: 'running'; questions: QuizQuestion[]; config: QuizSetupValue; run: number } | { name: 'results'; questions: QuizQuestion[]; answers: QuizAnswer[]; config: QuizSetupValue };

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>({ name: 'setup' });
  const history = useAppStore((s) => s.quizHistory);
  const addResult = useAppStore((s) => s.addQuizResult);
  const clear = useAppStore((s) => s.clearQuizHistory);

  const start = (config: QuizSetupValue) => setPhase({ name: 'running', questions: buildQuiz(QUIZ_QUESTIONS, config), config, run: Date.now() });

  const finish = (questions: QuizQuestion[], answers: QuizAnswer[], config: QuizSetupValue) => {
    const s = scoreQuiz(answers);
    addResult({ id: uid(), date: new Date().toISOString(), categories: config.categories, difficulty: config.difficulty, timed: config.timed, total: s.total, correct: s.correct, percentage: s.percentage, answers });
    setPhase({ name: 'results', questions, answers, config });
  };

  const chartData = [...history].reverse().map((r, i) => ({ n: i + 1, score: r.percentage, date: new Date(r.date).toLocaleDateString() }));

  return (
    <div className="space-y-6">
      <PageHeader icon={BrainCircuit} eyebrow="Test your knowledge" title="Knowledge Quiz" description="Multiple choice, true/false, image-based, identify-the-equipment and scenario questions with instant feedback." />
      <SafetyNotice title="Educational quiz — not an official exam">
        This quiz is for self-study. It is not a certification examination and passing it does not qualify you to dive. Content follows widely taught recreational principles; your agency’s materials and instructor take precedence.
      </SafetyNotice>

      {phase.name === 'setup' && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3"><QuizSetup onStart={start} /></div>
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base"><History className="h-5 w-5 text-primary" aria-hidden="true" /> Knowledge progress</CardTitle>
              {history.length > 0 && <Button variant="ghost" size="sm" onClick={() => window.confirm('Clear all quiz history?') && clear()}><Trash2 /> Clear</Button>}
            </CardHeader>
            <CardContent>
              {history.length < 2 ? (
                <p className="text-sm text-muted-foreground">Complete at least two quizzes to see your progress over time.</p>
              ) : (
                <div className="h-52" role="img" aria-label={`Quiz scores over time, latest ${history[0].percentage}%`}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ left: -16, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="qz" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#06b6d4" stopOpacity={0.5} />
                          <stop offset="1" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeOpacity={0.15} />
                      <XAxis dataKey="n" tick={{ fill: 'currentColor', fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} labelFormatter={(_, p) => p?.[0]?.payload?.date ?? ''} contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} />
                      <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fill="url(#qz)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="mt-3 text-sm text-muted-foreground">{history.length} quiz{history.length === 1 ? '' : 'zes'} completed · {QUIZ_QUESTIONS.length} questions in the bank</p>
            </CardContent>
          </Card>
        </div>
      )}

      {phase.name === 'running' && (
        <QuizRunner
          key={phase.run}
          questions={phase.questions}
          timeLimit={phase.config.timed ? TIME_PER_QUESTION_SECONDS[phase.config.difficulty] : null}
          onFinish={(answers) => finish(phase.questions, answers, phase.config)}
          onQuit={() => setPhase({ name: 'setup' })}
        />
      )}

      {phase.name === 'results' && (
        <QuizResults
          questions={phase.questions}
          answers={phase.answers}
          onRetry={() => start(phase.config)}
          onNew={() => setPhase({ name: 'setup' })}
        />
      )}
    </div>
  );
}
