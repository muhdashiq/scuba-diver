import { BrainCircuit, Play, Timer } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { Difficulty, QuizCategory } from '@/types';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '@/data/quizQuestions';
import { filterQuestions, type QuizConfig } from '@/utils/quizEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface QuizSetupValue extends QuizConfig {
  timed: boolean;
}

const DIFFICULTIES: { id: Difficulty | 'mixed'; label: string }[] = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export function QuizSetup({ onStart }: { onStart: (v: QuizSetupValue) => void }) {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed');
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const timedId = useId();
  const shuffleId = useId();

  const cfgCats = categories.length ? categories : ('all' as const);
  const available = useMemo(() => filterQuestions(QUIZ_QUESTIONS, { categories: cfgCats, difficulty }).length, [cfgCats, difficulty]);
  const toggle = (c: QuizCategory) => setCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" aria-hidden="true" /> Build your quiz</CardTitle>
        <CardDescription>Pick categories (or none for all), a difficulty and a mode.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-semibold">Categories</legend>
          <div className="flex flex-wrap gap-2">
            {QUIZ_CATEGORIES.map((c) => {
              const on = categories.includes(c.id);
              return (
                <button key={c.id} type="button" aria-pressed={on} title={c.description} onClick={() => toggle(c.id)}
                  className={cn('min-h-10 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', on ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent')}>
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">{categories.length ? `${categories.length} selected` : 'All categories'}</p>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Difficulty</legend>
          <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-muted p-1">
            {DIFFICULTIES.map((d) => (
              <button key={d.id} type="button" aria-pressed={difficulty === d.id} onClick={() => setDifficulty(d.id)}
                className={cn('min-h-9 rounded-xl px-3 text-sm font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', difficulty === d.id && 'bg-background text-foreground shadow-sm')}>
                {d.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Number of questions</legend>
          <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-muted p-1">
            {[5, 10, 15, 20].map((n) => (
              <button key={n} type="button" aria-pressed={count === n} onClick={() => setCount(n)}
                className={cn('min-h-9 min-w-12 rounded-xl px-3 text-sm font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', count === n && 'bg-background text-foreground shadow-sm')}>
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{available} matching question{available === 1 ? '' : 's'} available{available < count ? ` — the quiz will use all ${available}` : ''}.</p>
        </fieldset>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-3">
            <Switch id={timedId} checked={timed} onCheckedChange={setTimed} />
            <Label htmlFor={timedId} className="flex items-center gap-1.5"><Timer className="h-4 w-4" aria-hidden="true" /> Timed mode</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id={shuffleId} checked={shuffle} onCheckedChange={setShuffle} />
            <Label htmlFor={shuffleId}>Randomise questions & answers</Label>
          </div>
        </div>

        <Button size="lg" variant="ocean" disabled={available === 0} onClick={() => onStart({ categories: cfgCats, difficulty, count, shuffle, timed })}>
          <Play /> Start quiz
        </Button>
      </CardContent>
    </Card>
  );
}
