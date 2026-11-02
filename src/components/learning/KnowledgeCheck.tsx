import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { KnowledgeCheck as KC } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Inline multiple-choice knowledge check with instant feedback. */
export function KnowledgeCheck({ questions, onAllCorrect }: { questions: KC[]; onAllCorrect?: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;

  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== null) return;
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    if (next.every((a, i) => a === questions[i].correctIndex)) onAllCorrect?.();
  };

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const sel = answers[qi];
        return (
          <fieldset key={q.question} className="space-y-3 rounded-2xl border bg-card p-4">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="font-semibold">
              <span className="mr-2 text-primary">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.correctIndex;
                const isSelected = sel === oi;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => choose(qi, oi)}
                    disabled={sel !== null}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      sel === null && 'hover:border-primary hover:bg-primary/5',
                      sel !== null && isCorrect && 'border-success bg-success/10 text-foreground',
                      sel !== null && isSelected && !isCorrect && 'border-destructive bg-destructive/10',
                      sel !== null && !isSelected && !isCorrect && 'opacity-60',
                    )}
                  >
                    {sel !== null && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />}
                    {sel !== null && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />}
                    {opt}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {sel !== null && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={cn('rounded-xl p-3 text-sm', sel === q.correctIndex ? 'bg-success/10' : 'bg-destructive/10')}
                  role="status"
                >
                  <strong>{sel === q.correctIndex ? 'Correct. ' : 'Not quite. '}</strong>
                  {q.explanation}
                </motion.p>
              )}
            </AnimatePresence>
          </fieldset>
        );
      })}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {answered === questions.length ? `You scored ${correct}/${questions.length}.` : `${answered}/${questions.length} answered`}
        </p>
        {answered > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setAnswers(questions.map(() => null))}>
            <RotateCcw /> Retry
          </Button>
        )}
      </div>
    </div>
  );
}
