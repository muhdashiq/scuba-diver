import type { Difficulty, QuizAnswer, QuizCategory, QuizQuestion } from '@/types';

export interface QuizConfig {
  categories: QuizCategory[] | 'all';
  difficulty: Difficulty | 'mixed';
  count: number;
  shuffle: boolean;
}

/** Small deterministic PRNG so shuffles can be reproduced in tests. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleArray<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Shuffle answer options while keeping track of the correct answer. True/false stays in order. */
export function shuffleOptions(question: QuizQuestion, random: () => number = Math.random): QuizQuestion {
  if (question.kind === 'true-false') return question;
  const order = shuffleArray(question.options.map((_, i) => i), random);
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correctIndex: order.indexOf(question.correctIndex),
  };
}

export function filterQuestions(bank: QuizQuestion[], config: Pick<QuizConfig, 'categories' | 'difficulty'>): QuizQuestion[] {
  return bank.filter(
    (q) =>
      (config.categories === 'all' || config.categories.includes(q.category)) &&
      (config.difficulty === 'mixed' || q.difficulty === config.difficulty),
  );
}

export function buildQuiz(bank: QuizQuestion[], config: QuizConfig, random: () => number = Math.random): QuizQuestion[] {
  const pool = filterQuestions(bank, config);
  const ordered = config.shuffle ? shuffleArray(pool, random) : pool;
  const selected = ordered.slice(0, Math.max(1, config.count));
  return config.shuffle ? selected.map((q) => shuffleOptions(q, random)) : selected;
}

export function isCorrect(question: QuizQuestion, selectedIndex: number | null): boolean {
  return selectedIndex !== null && selectedIndex === question.correctIndex;
}

export function scoreQuiz(answers: QuizAnswer[]) {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { total, correct, incorrect: total - correct, percentage };
}

export function scoreByCategory(questions: QuizQuestion[], answers: QuizAnswer[]) {
  const map = new Map<QuizCategory, { correct: number; total: number }>();
  for (const answer of answers) {
    const q = questions.find((x) => x.id === answer.questionId);
    if (!q) continue;
    const entry = map.get(q.category) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answer.correct) entry.correct += 1;
    map.set(q.category, entry);
  }
  return [...map.entries()].map(([category, v]) => ({ category, ...v, percentage: Math.round((v.correct / v.total) * 100) }));
}

export function gradeLabel(percentage: number): { label: string; tone: 'success' | 'warning' | 'destructive' } {
  if (percentage >= 85) return { label: 'Excellent knowledge', tone: 'success' };
  if (percentage >= 70) return { label: 'Good — review the misses', tone: 'success' };
  if (percentage >= 50) return { label: 'Keep studying', tone: 'warning' };
  return { label: 'Revisit the lessons', tone: 'destructive' };
}

export const TIME_PER_QUESTION_SECONDS: Record<Difficulty | 'mixed', number> = {
  beginner: 45,
  intermediate: 40,
  advanced: 35,
  mixed: 40,
};
