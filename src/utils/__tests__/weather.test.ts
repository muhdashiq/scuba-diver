import { describe, expect, it } from 'vitest';
import type { CurrentWeather } from '@/types';
import { assessConditions, describeWeatherCode, overallRating, rateValue } from '../weather';

const current: CurrentWeather = { time: '2026-11-02T10:00', temperature: 28, apparentTemperature: 30, windSpeed: 10, windDirection: 90, windGusts: 15, cloudCover: 20, precipitation: 0, weatherCode: 1, isDay: true };

describe('weather condition assessment', () => {
  it('describes WMO codes', () => {
    expect(describeWeatherCode(0).label).toBe('Clear sky');
    expect(describeWeatherCode(0, false).icon).toBe('moon');
    expect(describeWeatherCode(95).icon).toBe('storm');
  });
  it('rates values against thresholds', () => {
    const t = { caution: 1, unfavorable: 2 };
    expect(rateValue(0.5, t)).toBe('favorable');
    expect(rateValue(1.5, t)).toBe('caution');
    expect(rateValue(3, t)).toBe('unfavorable');
    expect(rateValue(NaN, t)).toBe('unknown');
  });
  it('rates calm conditions favourable', () => {
    const items = assessConditions(current, { waveHeight: 0.4, wavePeriod: 5, waveDirection: 90, swellWaveHeight: 0.2, seaSurfaceTemperature: 27 }, 'metric');
    expect(overallRating(items)).toBe('favorable');
  });
  it('flags strong wind, big waves and thunderstorms', () => {
    const items = assessConditions({ ...current, windSpeed: 45, weatherCode: 95 }, { waveHeight: 2.5, wavePeriod: 13, waveDirection: 0, swellWaveHeight: 2, seaSurfaceTemperature: 20 }, 'metric');
    expect(overallRating(items)).toBe('unfavorable');
    expect(items.find((i) => i.factor === 'Thunderstorms')?.rating).toBe('unfavorable');
    expect(items.find((i) => i.factor === 'Wave height')?.rating).toBe('unfavorable');
  });
  it('never rates underwater visibility or current', () => {
    const items = assessConditions(current, null, 'metric');
    expect(items.some((i) => /visibility|current/i.test(i.factor))).toBe(false);
    expect(overallRating([])).toBe('unknown');
  });
});
