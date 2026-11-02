import type { ConditionAssessment, ConditionRating, CurrentWeather, DailyPoint, MarineConditions, UnitSystem } from '@/types';
import { degreesToCompass, formatSpeed, formatTemp, formatWaveHeight } from './units';

export type WeatherIconKey = 'sun' | 'moon' | 'partly' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

/** WMO weather interpretation codes as used by Open-Meteo. */
export function describeWeatherCode(code: number, isDay = true): { label: string; icon: WeatherIconKey } {
  if (code === 0) return { label: 'Clear sky', icon: isDay ? 'sun' : 'moon' };
  if (code === 1) return { label: 'Mainly clear', icon: isDay ? 'sun' : 'moon' };
  if (code === 2) return { label: 'Partly cloudy', icon: 'partly' };
  if (code === 3) return { label: 'Overcast', icon: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Fog', icon: 'fog' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'drizzle' };
  if (code >= 61 && code <= 67) return { label: code >= 65 ? 'Heavy rain' : 'Rain', icon: 'rain' };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'snow' };
  if (code >= 80 && code <= 82) return { label: 'Rain showers', icon: 'rain' };
  if (code === 85 || code === 86) return { label: 'Snow showers', icon: 'snow' };
  if (code >= 95) return { label: code === 95 ? 'Thunderstorm' : 'Thunderstorm with hail', icon: 'storm' };
  return { label: 'Unknown', icon: 'cloud' };
}

export const isThunderstorm = (code: number) => code >= 95;

/*
 * Thresholds below are generic, conservative surface-condition indicators used for education.
 * They are not dive-site safety ratings: local operators, site exposure, entry type and the
 * divers' experience matter far more. Underwater visibility and current cannot be inferred from
 * ordinary weather forecasts, so we never rate them here.
 */
export const WIND_THRESHOLDS_KMH = { caution: 20, unfavorable: 35 } as const;
export const GUST_THRESHOLDS_KMH = { caution: 35, unfavorable: 50 } as const;
export const WAVE_THRESHOLDS_M = { caution: 1, unfavorable: 2 } as const;

export function rateValue(value: number, t: { caution: number; unfavorable: number }): ConditionRating {
  if (!Number.isFinite(value)) return 'unknown';
  if (value >= t.unfavorable) return 'unfavorable';
  if (value >= t.caution) return 'caution';
  return 'favorable';
}

export function assessConditions(current: CurrentWeather, marine: MarineConditions | null, units: UnitSystem, today?: DailyPoint): ConditionAssessment[] {
  const out: ConditionAssessment[] = [];

  const windRating = rateValue(current.windSpeed, WIND_THRESHOLDS_KMH);
  out.push({
    factor: 'Wind',
    value: `${formatSpeed(current.windSpeed, units)} ${degreesToCompass(current.windDirection)}`,
    rating: windRating,
    explanation:
      windRating === 'favorable'
        ? 'Light to moderate wind usually means manageable surface chop. Onshore vs offshore direction matters for shore entries.'
        : windRating === 'caution'
          ? 'Fresh wind can build surface chop and make boat pick-ups and surface swims harder. Consider sheltered sites.'
          : 'Strong wind typically produces rough surface conditions; many operators cancel or move to sheltered sites.',
  });

  const gustRating = rateValue(current.windGusts, GUST_THRESHOLDS_KMH);
  out.push({
    factor: 'Wind gusts',
    value: formatSpeed(current.windGusts, units),
    rating: gustRating,
    explanation: gustRating === 'favorable' ? 'Gusts are modest.' : 'Strong gusts make surface conditions unpredictable, especially for small boats.',
  });

  if (isThunderstorm(current.weatherCode) || (today && isThunderstorm(today.weatherCode))) {
    out.push({
      factor: 'Thunderstorms',
      value: 'Forecast',
      rating: 'unfavorable',
      explanation: 'Lightning is a serious hazard on the surface and on boats. Postpone until storms have passed.',
    });
  }

  const rainProb = today?.precipitationProbabilityMax;
  if (rainProb !== null && rainProb !== undefined) {
    const rainRating: ConditionRating = rainProb >= 70 ? 'caution' : 'favorable';
    out.push({
      factor: 'Rain probability (today)',
      value: `${rainProb}%`,
      rating: rainRating,
      explanation: rainRating === 'favorable' ? 'Rain is unlikely to affect the surface interval.' : 'Rain is likely. Heavy rain can affect boat operations, surface comfort and nearby river run-off.',
    });
  }

  if (marine) {
    if (marine.waveHeight !== null) {
      const waveRating = rateValue(marine.waveHeight, WAVE_THRESHOLDS_M);
      out.push({
        factor: 'Wave height',
        value: formatWaveHeight(marine.waveHeight, units),
        rating: waveRating,
        explanation:
          waveRating === 'favorable'
            ? 'Small waves offshore. Conditions at a specific beach or reef can still differ.'
            : waveRating === 'caution'
              ? 'Moderate waves can make shore entries and exits challenging and cause surge in shallow water.'
              : 'Large waves create surge and dangerous entries/exits. Shore diving is generally not advisable.',
      });
    }
    if (marine.wavePeriod !== null) {
      const long = marine.wavePeriod >= 12;
      out.push({
        factor: 'Wave period',
        value: `${marine.wavePeriod.toFixed(1)} s`,
        rating: long && (marine.waveHeight ?? 0) >= 1 ? 'caution' : 'favorable',
        explanation: long
          ? 'Long-period swell carries more energy and can cause strong surge near the bottom on shallow sites.'
          : 'Short-period waves are usually wind-driven chop.',
      });
    }
    if (marine.seaSurfaceTemperature !== null) {
      const sst = marine.seaSurfaceTemperature;
      out.push({
        factor: 'Sea surface temp.',
        value: formatTemp(sst, units, 1),
        rating: sst < 10 ? 'caution' : 'favorable',
        explanation:
          sst < 10
            ? 'Cold water — plan thermal protection (often a dry suit) and cold-water rated regulators. Temperature at depth may be colder still.'
            : 'Surface temperature only. Thermoclines can make deeper water noticeably colder.',
      });
    }
  }

  return out;
}

export const RATING_LABEL: Record<ConditionRating, string> = {
  favorable: 'Favourable',
  caution: 'Caution',
  unfavorable: 'Unfavourable',
  unknown: 'No data',
};

export function overallRating(items: ConditionAssessment[]): ConditionRating {
  if (!items.length) return 'unknown';
  if (items.some((i) => i.rating === 'unfavorable')) return 'unfavorable';
  if (items.some((i) => i.rating === 'caution')) return 'caution';
  return 'favorable';
}
