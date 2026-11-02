import { describe, expect, it } from 'vitest';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { buildQuiz, filterQuestions, gradeLabel, isCorrect, mulberry32, scoreByCategory, scoreQuiz, shuffleOptions } from '../quizEngine';
import { QUIZ_QUESTIONS } from '@/data/quizQuestions';

const q = (id: string, category: QuizQuestion['category'], correctIndex = 0): QuizQuestion => ({
  id, category, difficulty: 'beginner', kind: 'multiple-choice', prompt: id, options: ['a', 'b', 'c', 'd'], correctIndex, explanation: '',
});
const ans = (questionId: string, correct: boolean): QuizAnswer => ({ questionId, selectedIndex: correct ? 0 : 1, correct, timeTakenMs: 1000 });

describe('quiz scoring', () => {
  it('scores answers', () => {
    expect(scoreQuiz([ans('1', true), ans('2', false), ans('3', true), ans('4', true)])).toEqual({ total: 4, correct: 3, incorrect: 1, percentage: 75 });
    expect(scoreQuiz([])).toEqual({ total: 0, correct: 0, incorrect: 0, percentage: 0 });
  });
  it('treats timeouts as incorrect', () => {
    expect(isCorrect(q('x', 'fundamentals', 2), null)).toBe(false);
    expect(isCorrect(q('x', 'fundamentals', 2), 2)).toBe(true);
  });
  it('breaks scores down by category', () => {
    const qs = [q('a', 'equipment'), q('b', 'equipment'), q('c', 'navigation')];
    const r = scoreByCategory(qs, [ans('a', true), ans('b', false), ans('c', true)]);
    expect(r).toEqual(expect.arrayContaining([
      expect.objectContaining({ category: 'equipment', correct: 1, total: 2, percentage: 50 }),
      expect.objectContaining({ category: 'navigation', correct: 1, total: 1, percentage: 100 }),
    ]));
  });
  it('grades scores', () => {
    expect(gradeLabel(90).tone).toBe('success');
    expect(gradeLabel(55).tone).toBe('warning');
    expect(gradeLabel(20).tone).toBe('destructive');
  });
});

describe('quiz building', () => {
  it('keeps the correct answer when options are shuffled', () => {
    const original = q('s', 'fundamentals', 2);
    for (let seed = 1; seed < 20; seed++) {
      const s = shuffleOptions(original, mulberry32(seed));
      expect(s.options[s.correctIndex]).toBe('c');
      expect([...s.options].sort()).toEqual(['a', 'b', 'c', 'd']);
    }
  });
  it('filters by category and difficulty', () => {
    const r = filterQuestions(QUIZ_QUESTIONS, { categories: ['navigation'], difficulty: 'beginner' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.category === 'navigation' && x.difficulty === 'beginner')).toBe(true);
  });
  it('builds a randomised quiz of the requested size', () => {
    const r = buildQuiz(QUIZ_QUESTIONS, { categories: 'all', difficulty: 'mixed', count: 10, shuffle: true }, mulberry32(42));
    expect(r).toHaveLength(10);
    expect(new Set(r.map((x) => x.id)).size).toBe(10);
    r.forEach((x) => {
      const orig = QUIZ_QUESTIONS.find((o) => o.id === x.id)!;
      expect(x.options[x.correctIndex]).toBe(orig.options[orig.correctIndex]);
    });
  });
});
