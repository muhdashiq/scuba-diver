import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Clock, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { isCorrect } from '@/utils/quizEngine';
import { QUIZ_CATEGORIES } from '@/data/quizQuestions';
import { QuizVisual } from '@/components/illustrations/VisualRegistry';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { confirm } from '@/lib/confirm';
import { cn } from '@/lib/utils';

const KIND_LABEL: Record<QuizQuestion['kind'], string> = {
  'multiple-choice': 'Multiple choice',
  'true-false': 'True or false',
  image: 'Image',
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
      if (navigator.vibrate) navigator.vibrate(isCorrect(q, choice) ? 10 : [12, 40, 12]);
    },
    [q, revealed],
  );

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
    if (index + 1 >= questions.length) return onFinish(answers);
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    startRef.current = Date.now();
  };

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

  const quit = async () => {
    if (await confirm({ title: 'End this quiz?', message: 'Your progress in this quiz won’t be saved.', confirmLabel: 'End Quiz', destructive: true })) onQuit();
  };

  const category = QUIZ_CATEGORIES.find((c) => c.id === q.category)?.label;
  const lastCorrect = revealed && selected === q.correctIndex;

  return (
    <div className="mx-auto max-w-2xl space-y-5 pt-2">
      <div className="flex items-center gap-3">
        <button type="button" onClick={quit} aria-label="End quiz" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fill text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <Progress value={((index + (revealed ? 1 : 0)) / questions.length) * 100} aria-label="Quiz progress" className="h-2" />
        <span className="shrink-0 text-subhead font-semibold tabular text-muted-foreground">{index + 1}/{questions.length}</span>
        {timeLimit && (
          <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-subhead font-semibold tabular', remaining <= 10 ? 'bg-destructive/12 text-destructive' : 'bg-fill')}>
            <Clock className="h-4 w-4" aria-hidden="true" /> {remaining}s
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={reduce ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -20 }} transition={{ duration: 0.18 }} className="space-y-5">
          <div className="space-y-2">
            <p className="text-footnote font-semibold uppercase tracking-wide text-muted-foreground">{category} · <span className="capitalize">{q.difficulty}</span> · {KIND_LABEL[q.kind]}</p>
            <h1 className="text-title2" id="quiz-q">{q.prompt}</h1>
          </div>

          {q.visual && (
            <figure className="overflow-hidden rounded-2xl">
              <QuizVisual visual={q.visual.key} highlight={q.visual.highlight} showLabels={revealed} className="block h-auto w-full" />
              <figcaption className="sr-only">{revealed ? 'Labels revealed.' : 'Labels appear after you answer.'}</figcaption>
            </figure>
          )}

          <div role="radiogroup" aria-labelledby="quiz-q" className="grid gap-2">
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
                  animate={revealed && chosen && !correct && !reduce ? { x: [0, -5, 5, -3, 3, 0] } : undefined}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    'flex min-h-[3.25rem] items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left text-callout transition-[background-color,transform] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    !revealed && 'hover:bg-accent',
                    revealed && correct && 'bg-success/12 ring-2 ring-success/60',
                    revealed && chosen && !correct && 'bg-destructive/12 ring-2 ring-destructive/60',
                    revealed && !chosen && !correct && 'opacity-50',
                  )}
                >
                  <span className="flex-1">{opt}</span>
                  {revealed && correct && <CheckCircle2 className="h-6 w-6 shrink-0 fill-success text-card" aria-label="Correct answer" />}
                  {revealed && chosen && !correct && <XCircle className="h-6 w-6 shrink-0 fill-destructive text-card" aria-label="Your answer" />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" role="status" aria-live="polite">
                <div className="space-y-1 rounded-2xl bg-card p-4">
                  <p className={cn('text-headline', lastCorrect ? 'text-success' : 'text-destructive')}>{selected === null ? 'Time’s up' : lastCorrect ? 'Correct' : 'Not quite'}</p>
                  <p className="text-subhead text-foreground/85">{q.explanation}</p>
                  {q.visual && (
                    <ul className="mt-3 space-y-1.5 border-t border-separator pt-3 text-footnote">
                      {q.visual.annotations.map((a) => <li key={a.label}><strong>{a.label}</strong> <span className="text-muted-foreground">— {a.detail}</span></li>)}
                    </ul>
                  )}
                </div>
                <Button onClick={next} size="lg" className="w-full" autoFocus>{index + 1 >= questions.length ? 'See Results' : 'Continue'}</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
