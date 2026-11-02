import { describe, expect, it } from 'vitest';
import type { DivePlanInput } from '@/types';
import {
  ambientPressureBar,
  buildDiveProfile,
  DEFAULT_PLAN_INPUT,
  estimateGas,
  getPlanAdvisories,
  maximumOperatingDepth,
  planCompleteness,
  totalRunTime,
  validateDivePlan,
} from '../divePlanner';

const valid: DivePlanInput = { ...DEFAULT_PLAN_INPUT, site: 'Test Reef', dateTime: '2026-11-03T09:00' };

describe('validateDivePlan', () => {
  it('accepts a complete, sensible plan', () => {
    expect(validateDivePlan(valid)).toEqual({ valid: true, errors: {} });
  });
  it('requires a site and date', () => {
    const r = validateDivePlan({ ...valid, site: '  ', dateTime: '' });
    expect(r.valid).toBe(false);
    expect(r.errors.site).toBeDefined();
    expect(r.errors.dateTime).toBeDefined();
  });
  it('rejects depths beyond recreational limits and non-positive depths', () => {
    expect(validateDivePlan({ ...valid, maxDepth: 45 }).errors.maxDepth).toMatch(/recreational/);
    expect(validateDivePlan({ ...valid, maxDepth: 0 }).errors.maxDepth).toBeDefined();
    expect(validateDivePlan({ ...valid, maxDepth: NaN }).errors.maxDepth).toBeDefined();
  });
  it('requires reserve below starting pressure', () => {
    expect(validateDivePlan({ ...valid, reservePressure: 200, startPressure: 200 }).errors.reservePressure).toBeDefined();
  });
  it('caps ascent rate', () => {
    expect(validateDivePlan({ ...valid, ascentRate: 25 }).errors.ascentRate).toMatch(/must not exceed/);
  });
  it('validates custom nitrox range', () => {
    expect(validateDivePlan({ ...valid, gas: 'custom-nitrox', customO2: 50 }).errors.customO2).toBeDefined();
    expect(validateDivePlan({ ...valid, gas: 'custom-nitrox', customO2: 30 }).valid).toBe(true);
  });
  it('flags bottom time shorter than descent', () => {
    expect(validateDivePlan({ ...valid, maxDepth: 30, descentRate: 3, bottomTime: 5 }).errors.bottomTime).toBeDefined();
  });
  it('rejects a fractional diver count', () => {
    expect(validateDivePlan({ ...valid, divers: 1.5 }).errors.divers).toBeDefined();
  });
});

describe('buildDiveProfile', () => {
  it('builds descent, bottom, ascent and safety stop phases', () => {
    const p = buildDiveProfile({ maxDepth: 18, bottomTime: 40, descentRate: 18, ascentRate: 9, includeSafetyStop: true });
    expect(p.map((x) => x.phase)).toEqual(['surface', 'descent', 'bottom', 'ascent', 'safety-stop', 'ascent']);
    expect(p[1]).toMatchObject({ time: 1, depth: 18 });
    expect(p[2]).toMatchObject({ time: 40, depth: 18 });
    expect(p[3].depth).toBe(5);
    expect(p[4].time - p[3].time).toBe(3);
    expect(p.at(-1)!.depth).toBe(0);
    expect(totalRunTime(p)).toBeGreaterThan(44);
  });
  it('omits the safety stop when disabled or very shallow', () => {
    expect(buildDiveProfile({ maxDepth: 18, bottomTime: 40, descentRate: 18, ascentRate: 9, includeSafetyStop: false }).some((x) => x.phase === 'safety-stop')).toBe(false);
    expect(buildDiveProfile({ maxDepth: 4, bottomTime: 20, descentRate: 10, ascentRate: 9, includeSafetyStop: true }).some((x) => x.phase === 'safety-stop')).toBe(false);
  });
  it('returns an empty profile for invalid input', () => {
    expect(buildDiveProfile({ maxDepth: 0, bottomTime: 40, descentRate: 18, ascentRate: 9, includeSafetyStop: true })).toEqual([]);
  });
});

describe('gas planning', () => {
  it('computes ambient pressure and MOD', () => {
    expect(ambientPressureBar(10)).toBe(2);
    expect(maximumOperatingDepth(0.32, 1.4)).toBeCloseTo(33.75, 2);
    expect(maximumOperatingDepth(0.21, 1.4)).toBeCloseTo(56.67, 1);
  });
  it('estimates gas use from SAC and depth', () => {
    const profile = [
      { time: 0, depth: 0, phase: 'surface' as const },
      { time: 0, depth: 20, phase: 'descent' as const },
      { time: 10, depth: 20, phase: 'bottom' as const },
    ];
    const g = estimateGas({ cylinderSize: 12, startPressure: 200, reservePressure: 50, sacRate: 20 }, profile);
    expect(g.estimatedUseLitres).toBeCloseTo(600); // 20 L/min × 3 bar × 10 min
    expect(g.usableGasLitres).toBe(1800);
    expect(g.estimatedEndPressure).toBeCloseTo(150);
    expect(g.withinReserve).toBe(true);
  });
  it('detects when the estimate dips into reserve', () => {
    const p = buildDiveProfile({ maxDepth: 30, bottomTime: 50, descentRate: 18, ascentRate: 9, includeSafetyStop: true });
    expect(estimateGas({ cylinderSize: 10, startPressure: 200, reservePressure: 50, sacRate: 25 }, p).withinReserve).toBe(false);
  });
});

describe('advisories and completeness', () => {
  it('warns when depth exceeds typical certification guidance', () => {
    const a = getPlanAdvisories({ ...valid, certification: 'open-water', maxDepth: 25 });
    expect(a.some((m) => m.severity === 'warning' && /training limit/.test(m.title))).toBe(true);
  });
  it('warns when nitrox depth exceeds MOD', () => {
    const a = getPlanAdvisories({ ...valid, certification: 'advanced-open-water', gas: 'ean36', maxDepth: 30 });
    expect(a.some((m) => /exceeds nitrox MOD/.test(m.title))).toBe(true);
  });
  it('always reminds that NDLs are not calculated, and never declares the dive safe', () => {
    const a = getPlanAdvisories(valid);
    expect(a.some((m) => /Decompression status/.test(m.title))).toBe(true);
    expect(a.every((m) => !/safe to dive|cleared/i.test(m.title + m.detail))).toBe(true);
  });
  it('reports plan completeness', () => {
    const c = planCompleteness({ ...valid, latitude: 1, longitude: 2, current: 'light', visibility: 'good' });
    expect(c.percent).toBe(100);
    expect(planCompleteness(DEFAULT_PLAN_INPUT).missing).toContain('Dive site');
  });
});
