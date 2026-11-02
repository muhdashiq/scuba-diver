import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { isCorrect } from '@/utils/quizEngine';
import { QUIZ_CATEGORIES } from '@/data/quizQuestions';
import { QuizVisual } from '@/components/illustrations/VisualRegistry';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const KIND_LABEL: Record<QuizQuestion['kind'], string> = {
  'multiple-choice': 'Multiple choice',
  'true-false': 'True / false',
  image: 'Image-based',
  'identify-equipment': 'Identify the equipment',
  scenario: 'Scenario',
};

export function QuizRunner({ questions, timeLimit, onFinish, onQuit }: { questions: QuizQuestion[]; timeLimit: number | null; onFinish: (a: QuizAnswer[]) => void; onQuit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [remaining, setRemaining] = useState(timeLimit ?? 0);
  const startRef = useRef(Date.now());
  const reduce = useReducedMotion();
  const q = questions[index];

  const commit = useCallback(
    (choice: number | null) => {
      if (revealed) return;
      setSelected(choice);
      setRevealed(true);
      setAnswers((a) => [...a, { questionId: q.id, selectedIndex: choice, correct: isCorrect(q, choice), timeTakenMs: Date.now() - startRef.current }]);
    },
    [q, revealed],
  );

  // Timer
  useEffect(() => {
    if (!timeLimit || revealed) return;
    setRemaining(timeLimit);
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = timeLimit - Math.floor((Date.now() - started) / 1000);
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        window.clearInterval(id);
        commit(null);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [index, timeLimit, revealed, commit]);

  const next = () => {
    if (index + 1 >= questions.length) {
      onFinish(answers);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    startRef.current = Date.now();
  };

  // Keyboard shortcuts: 1–4 to answer, Enter for next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = Number(e.key);
      if (!revealed && n >= 1 && n <= q.options.length) commit(n - 1);
      else if (revealed && e.key === 'Enter') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const category = QUIZ_CATEGORIES.find((c) => c.id === q.category)?.label;
  const correctSoFar = answers.filter((a) => a.correct).length;
  const lastCorrect = revealed && selected === q.correctIndex;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="tabular">Question {index + 1} / {questions.length}</span>
          <span className="text-muted-foreground">· {correctSoFar} correct</span>
        </div>
        <div className="flex items-center gap-2">
          {timeLimit && (
            <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold tabular', remaining <= 10 ? 'bg-destructive/15 text-destructive' : 'bg-secondary')} aria-live="off">
              <Clock className="h-4 w-4" aria-hidden="true" /> {remaining}s
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={onQuit}>Quit</Button>
        </div>
      </div>
      <Progress value={((index + (revealed ? 1 : 0)) / questions.length) * 100} aria-label="Quiz progress" />

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline" className="capitalize">{q.difficulty}</Badge>
                <Badge variant="outline">{KIND_LABEL[q.kind]}</Badge>
              </div>
              <h2 className="text-lg font-bold sm:text-xl" id="quiz-q">{q.prompt}</h2>

              {q.visual && (
                <figure className="overflow-hidden rounded-2xl border">
                  <QuizVisual visual={q.visual.key} highlight={q.visual.highlight} showLabels={revealed} className="block h-auto w-full" />
                  <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">{revealed ? 'Labels revealed — see annotations below.' : 'Original illustration. Labels appear after you answer.'}</figcaption>
                </figure>
              )}

              <div role="radiogroup" aria-labelledby="quiz-q" className={cn('grid gap-2', q.options.length > 2 && 'sm:grid-cols-2')}>
                {q.options.map((opt, i) => {
                  const correct = i === q.correctIndex;
                  const chosen = selected === i;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      disabled={revealed}
                      onClick={() => commit(i)}
                      animate={revealed && chosen && !correct && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : revealed && correct && !reduce ? { scale: [1, 1.03, 1] } : undefined}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        'flex min-h-12 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        !revealed && 'hover:border-primary hover:bg-primary/5',
                        revealed && correct && 'border-success bg-success/10',
                        revealed && chosen && !correct && 'border-destructive bg-destructive/10',
                        revealed && !chosen && !correct && 'opacity-55',
                      )}
                    >
                      <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold', revealed && correct && 'bg-success text-success-foreground', revealed && chosen && !correct && 'bg-destructive text-destructive-foreground')}>
                        {revealed && correct ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : revealed && chosen ? <XCircle className="h-4 w-4" aria-hidden="true" /> : i + 1}
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {revealed && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3" role="status" aria-live="polite">
                    <div className={cn('rounded-2xl p-4', lastCorrect ? 'bg-success/10' : 'bg-destructive/10')}>
                      <p className="mb-1 flex items-center gap-2 font-bold">
                        {lastCorrect ? <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" /> : <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />}
                        {selected === null ? 'Time’s up!' : lastCorrect ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                    {q.visual && (
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {q.visual.annotations.map((a) => (
                          <li key={a.label} className="rounded-xl border bg-card p-3 text-sm">
                            <p className="font-semibold">{a.label}</p>
                            <p className="text-muted-foreground">{a.detail}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button onClick={next} size="lg" className="w-full sm:w-auto" autoFocus>
                      {index + 1 >= questions.length ? 'See results' : 'Next question'} <ArrowRight />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      <p className="hidden text-xs text-muted-foreground sm:block">Tip: press 1–{q.options.length} to answer, Enter for the next question.</p>
    </div>
  );
}
