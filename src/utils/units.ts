import type { UnitSystem } from '@/types';

export const M_TO_FT = 3.28084;
export const BAR_TO_PSI = 14.5038;
export const KMH_TO_KNOTS = 0.539957;
export const KMH_TO_MPH = 0.621371;
export const L_TO_CUFT = 0.0353147;

const round = (value: number, decimals = 0) => {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
};

export const metresToFeet = (m: number) => m * M_TO_FT;
export const feetToMetres = (ft: number) => ft / M_TO_FT;
export const barToPsi = (bar: number) => bar * BAR_TO_PSI;
export const psiToBar = (psi: number) => psi / BAR_TO_PSI;
export const celsiusToFahrenheit = (c: number) => (c * 9) / 5 + 32;
export const fahrenheitToCelsius = (f: number) => ((f - 32) * 5) / 9;
export const kmhToKnots = (kmh: number) => kmh * KMH_TO_KNOTS;
export const kmhToMph = (kmh: number) => kmh * KMH_TO_MPH;
export const litresToCubicFeet = (l: number) => l * L_TO_CUFT;

/** Formatting helpers that respect the user's unit preference. Internal values are always metric. */
export const formatDepth = (m: number, units: UnitSystem, decimals = 0) =>
  units === 'imperial' ? `${round(metresToFeet(m), decimals)} ft` : `${round(m, decimals)} m`;

export const formatPressure = (bar: number, units: UnitSystem) =>
  units === 'imperial' ? `${Math.round(barToPsi(bar))} psi` : `${Math.round(bar)} bar`;

export const formatTemp = (c: number, units: UnitSystem, decimals = 0) =>
  units === 'imperial' ? `${round(celsiusToFahrenheit(c), decimals)}°F` : `${round(c, decimals)}°C`;

export const formatSpeed = (kmh: number, units: UnitSystem) =>
  units === 'imperial' ? `${Math.round(kmhToMph(kmh))} mph` : `${Math.round(kmh)} km/h`;

export const formatKnots = (kmh: number) => `${round(kmhToKnots(kmh), 1)} kn`;

export const formatGasVolume = (litres: number, units: UnitSystem) =>
  units === 'imperial' ? `${round(litresToCubicFeet(litres), 1)} cu ft` : `${Math.round(litres)} L`;

export const formatWaveHeight = (m: number, units: UnitSystem) =>
  units === 'imperial' ? `${round(metresToFeet(m), 1)} ft` : `${round(m, 1)} m`;

export const depthUnit = (units: UnitSystem) => (units === 'imperial' ? 'ft' : 'm');
export const pressureUnit = (units: UnitSystem) => (units === 'imperial' ? 'psi' : 'bar');
export const tempUnit = (units: UnitSystem) => (units === 'imperial' ? '°F' : '°C');

/** Convert a value displayed in the user's units back to the metric value stored internally. */
export const toMetricDepth = (value: number, units: UnitSystem) => (units === 'imperial' ? feetToMetres(value) : value);
export const fromMetricDepth = (m: number, units: UnitSystem) => (units === 'imperial' ? metresToFeet(m) : m);
export const toMetricPressure = (value: number, units: UnitSystem) => (units === 'imperial' ? psiToBar(value) : value);
export const fromMetricPressure = (bar: number, units: UnitSystem) => (units === 'imperial' ? barToPsi(bar) : bar);
export const toMetricTemp = (value: number, units: UnitSystem) => (units === 'imperial' ? fahrenheitToCelsius(value) : value);
export const fromMetricTemp = (c: number, units: UnitSystem) => (units === 'imperial' ? celsiusToFahrenheit(c) : c);

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export const degreesToCompass = (deg: number) => COMPASS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];

export { round };
