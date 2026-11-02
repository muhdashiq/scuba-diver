import { describe, expect, it } from 'vitest';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../quizQuestions';
import { OPEN_WATER_LESSONS } from '../openWater';
import { AOW_MODULES } from '../advancedOpenWater';
import { SPECIALTIES } from '../specialties';
import { MARINE_LIFE } from '../marineLife';
import type { KnowledgeCheck } from '@/types';

const checkValid = (c: KnowledgeCheck) => c.correctIndex >= 0 && c.correctIndex < c.options.length && c.explanation.length > 0;

describe('educational content integrity', () => {
  it('has well-formed quiz questions across all categories and difficulties', () => {
    expect(new Set(QUIZ_QUESTIONS.map((q) => q.id)).size).toBe(QUIZ_QUESTIONS.length);
    for (const q of QUIZ_QUESTIONS) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(20);
      if (q.kind === 'image' || q.kind === 'identify-equipment') expect(q.visual?.annotations.length).toBeGreaterThan(0);
    }
    for (const c of QUIZ_CATEGORIES) expect(QUIZ_QUESTIONS.some((q) => q.category === c.id)).toBe(true);
    for (const d of ['beginner', 'intermediate', 'advanced']) expect(QUIZ_QUESTIONS.some((q) => q.difficulty === d)).toBe(true);
    for (const k of ['multiple-choice', 'true-false', 'image', 'identify-equipment', 'scenario']) expect(QUIZ_QUESTIONS.some((q) => q.kind === k)).toBe(true);
  });
  it('has 15 Open Water lessons with objectives and checks', () => {
    expect(OPEN_WATER_LESSONS).toHaveLength(15);
    OPEN_WATER_LESSONS.forEach((l, i) => {
      expect(l.order).toBe(i + 1);
      expect(l.objectives.length).toBeGreaterThan(0);
      expect(l.check.every(checkValid)).toBe(true);
    });
  });
  it('has 10 AOW modules and 17 specialties with valid quizzes', () => {
    expect(AOW_MODULES).toHaveLength(10);
    expect(SPECIALTIES).toHaveLength(17);
    [...AOW_MODULES, ...SPECIALTIES].forEach((m) => expect(m.check.every(checkValid)).toBe(true));
  });
  it('has unique marine-life entries in every group', () => {
    expect(new Set(MARINE_LIFE.map((m) => m.id)).size).toBe(MARINE_LIFE.length);
    expect(new Set(MARINE_LIFE.map((m) => m.group)).size).toBe(9);
  });
});
