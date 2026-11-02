import { Play, Shuffle, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Difficulty, QuizCategory } from '@/types';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '@/data/quizQuestions';
import { filterQuestions, type QuizConfig } from '@/utils/quizEngine';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SegmentedControl } from '@/components/ui/segmented';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { StickyActions } from '@/components/common/StickyActions';
import { cn } from '@/lib/utils';

export interface QuizSetupValue extends QuizConfig {
  timed: boolean;
}

export function QuizSetup({ onStart }: { onStart: (v: QuizSetupValue) => void }) {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed');
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [shuffle, setShuffle] = useState(true);

  const cfgCats = categories.length ? categories : ('all' as const);
  const available = useMemo(() => filterQuestions(QUIZ_QUESTIONS, { categories: cfgCats, difficulty }).length, [cfgCats, difficulty]);
  const toggle = (c: QuizCategory) => setCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="flex items-end justify-between px-4">
          <h2 className="text-footnote font-medium uppercase tracking-wide text-muted-foreground">Topics</h2>
          {categories.length > 0 && <button type="button" className="text-subhead text-primary" onClick={() => setCategories([])}>Clear</button>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Topics">
          {QUIZ_CATEGORIES.map((c) => {
            const on = categories.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on} title={c.description} onClick={() => toggle(c.id)} className={cn('h-9 rounded-full px-3.5 text-subhead font-medium transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', on ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent')}>
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="px-4 text-footnote text-muted-foreground">{categories.length ? `${categories.length} selected` : 'All topics'} · {available} question{available === 1 ? '' : 's'} available</p>
      </section>

      <section className="space-y-2">
        <h2 className="px-4 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Difficulty</h2>
        <SegmentedControl label="Difficulty" value={difficulty} onChange={setDifficulty} options={[{ value: 'mixed', label: 'Mixed' }, { value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }]} />
      </section>

      <section className="space-y-2">
        <h2 className="px-4 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Questions</h2>
        <SegmentedControl label="Number of questions" value={count} onChange={setCount} options={[5, 10, 15, 20].map((n) => ({ value: n, label: String(n) }))} />
      </section>

      <ListGroup footer="Timed mode gives you around 40 seconds per question.">
        <ListRow leading={<IconTile icon={Timer} color="bg-[#FF9500]" />} title={<label htmlFor="quiz-timed">Timed mode</label>} trailing={<Switch id="quiz-timed" checked={timed} onCheckedChange={setTimed} />} />
        <ListRow leading={<IconTile icon={Shuffle} color="bg-[#5856D6]" />} title={<label htmlFor="quiz-shuffle">Shuffle questions</label>} trailing={<Switch id="quiz-shuffle" checked={shuffle} onCheckedChange={setShuffle} />} />
      </ListGroup>

      <StickyActions>
        <Button size="lg" className="flex-1" disabled={available === 0} onClick={() => onStart({ categories: cfgCats, difficulty, count, shuffle, timed })}>
          <Play className="fill-current" /> Start Quiz
        </Button>
      </StickyActions>
    </div>
  );
}
