import { describe, expect, it } from 'vitest';
import { barToPsi, celsiusToFahrenheit, degreesToCompass, fahrenheitToCelsius, feetToMetres, formatDepth, formatPressure, formatTemp, metresToFeet, psiToBar, toMetricDepth } from '../units';

describe('unit conversion', () => {
  it('converts depth both ways', () => {
    expect(metresToFeet(10)).toBeCloseTo(32.8084, 3);
    expect(feetToMetres(metresToFeet(18))).toBeCloseTo(18, 6);
  });
  it('converts pressure both ways', () => {
    expect(barToPsi(200)).toBeCloseTo(2900.76, 1);
    expect(psiToBar(barToPsi(50))).toBeCloseTo(50, 6);
  });
  it('converts temperature both ways', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(fahrenheitToCelsius(77)).toBeCloseTo(25, 6);
  });
  it('formats according to unit system', () => {
    expect(formatDepth(18, 'metric')).toBe('18 m');
    expect(formatDepth(18, 'imperial')).toBe('59 ft');
    expect(formatPressure(200, 'imperial')).toBe('2901 psi');
    expect(formatTemp(26, 'imperial')).toBe('79°F');
  });
  it('maps display values back to metric', () => {
    expect(toMetricDepth(60, 'imperial')).toBeCloseTo(18.29, 2);
    expect(toMetricDepth(18, 'metric')).toBe(18);
  });
  it('names compass directions', () => {
    expect(degreesToCompass(0)).toBe('N');
    expect(degreesToCompass(359)).toBe('N');
    expect(degreesToCompass(90)).toBe('E');
    expect(degreesToCompass(225)).toBe('SW');
    expect(degreesToCompass(-90)).toBe('W');
  });
});
