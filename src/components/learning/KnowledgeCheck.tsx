import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { KnowledgeCheck as KC } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Inline knowledge check with instant feedback. */
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
    <div className="space-y-4">
      {questions.map((q, qi) => {
        const sel = answers[qi];
        return (
          <fieldset key={q.question} className="space-y-3 rounded-2xl bg-card p-4">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="text-headline">{q.question}</p>
            <div className="grid gap-2">
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
                      'flex min-h-12 items-center gap-3 rounded-xl bg-fill px-3.5 py-2.5 text-left text-callout transition-[background-color,transform] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      sel === null && 'hover:bg-accent',
                      sel !== null && isCorrect && 'bg-success/12',
                      sel !== null && isSelected && !isCorrect && 'bg-destructive/12',
                      sel !== null && !isSelected && !isCorrect && 'opacity-50',
                    )}
                  >
                    <span className="flex-1">{opt}</span>
                    {sel !== null && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 fill-success text-card" aria-label="Correct answer" />}
                    {sel !== null && isSelected && !isCorrect && <XCircle className="h-5 w-5 shrink-0 fill-destructive text-card" aria-label="Your answer" />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {sel !== null && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-subhead text-muted-foreground" role="status">
                  <strong className={sel === q.correctIndex ? 'text-success' : 'text-destructive'}>{sel === q.correctIndex ? 'Correct. ' : 'Not quite. '}</strong>
                  {q.explanation}
                </motion.p>
              )}
            </AnimatePresence>
          </fieldset>
        );
      })}
      <div className="flex items-center justify-between px-1">
        <p className="text-subhead text-muted-foreground" aria-live="polite">
          {answered === questions.length ? `You scored ${correct} of ${questions.length}.` : `${answered} of ${questions.length} answered`}
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
