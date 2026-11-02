import type { DailyPoint, GeoLocation, HourlyPoint, MarineConditions, WeatherBundle } from '@/types';
import { API } from './config';
import { ApiError, errorMessage, fetchJson } from './http';

interface ForecastResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: (number | null)[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: (number | null)[];
  };
  error?: boolean;
  reason?: string;
}

interface MarineResponse {
  current?: {
    wave_height: number | null;
    wave_direction: number | null;
    wave_period: number | null;
    swell_wave_height: number | null;
    sea_surface_temperature: number | null;
  };
  hourly?: { time: string[]; wave_height: (number | null)[] };
  daily?: { time: string[]; wave_height_max: (number | null)[] };
  error?: boolean;
  reason?: string;
}

const FORECAST_PARAMS = {
  current: 'temperature_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility',
  hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
  timezone: 'auto',
  forecast_days: '7',
  wind_speed_unit: 'kmh',
};

const MARINE_PARAMS = {
  current: 'wave_height,wave_direction,wave_period,swell_wave_height,sea_surface_temperature',
  hourly: 'wave_height',
  daily: 'wave_height_max',
  timezone: 'auto',
  forecast_days: '7',
};

const buildUrl = (base: string, params: Record<string, string>) => `${base}?${new URLSearchParams(params).toString()}`;

export function parseForecast(data: ForecastResponse): Pick<WeatherBundle, 'current' | 'hourly' | 'daily'> {
  if (data.error) throw new ApiError(data.reason ?? 'The weather provider returned an error.', undefined, 'http');
  const c = data.current;
  if (!c || !data.hourly || !data.daily) throw new ApiError('No weather data is available for this location.', undefined, 'empty');

  // Keep the next 24 hours from "now" (current.time is in the location's local time).
  const startIdx = Math.max(0, data.hourly.time.findIndex((t) => t >= c.time.slice(0, 13)));
  const hourly: HourlyPoint[] = data.hourly.time.slice(startIdx, startIdx + 24).map((time, k) => {
    const i = startIdx + k;
    return {
      time,
      temperature: data.hourly!.temperature_2m[i],
      precipitationProbability: data.hourly!.precipitation_probability[i] ?? null,
      windSpeed: data.hourly!.wind_speed_10m[i],
      windGusts: data.hourly!.wind_gusts_10m[i],
      weatherCode: data.hourly!.weather_code[i],
    };
  });

  const daily: DailyPoint[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily!.weather_code[i],
    tempMax: data.daily!.temperature_2m_max[i],
    tempMin: data.daily!.temperature_2m_min[i],
    precipitationProbabilityMax: data.daily!.precipitation_probability_max[i] ?? null,
    windSpeedMax: data.daily!.wind_speed_10m_max[i],
    windGustsMax: data.daily!.wind_gusts_10m_max[i],
    windDirectionDominant: data.daily!.wind_direction_10m_dominant[i] ?? null,
  }));

  return {
    current: {
      time: c.time,
      temperature: c.temperature_2m,
      apparentTemperature: c.apparent_temperature,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      windGusts: c.wind_gusts_10m,
      cloudCover: c.cloud_cover,
      precipitation: c.precipitation,
      weatherCode: c.weather_code,
      isDay: c.is_day === 1,
      visibility: c.visibility,
    },
    hourly,
    daily,
  };
}

export function parseMarine(data: MarineResponse): { marine: MarineConditions | null; hourlyWaves: Map<string, number | null>; dailyWaves: Map<string, number | null> } {
  if (data.error) throw new ApiError(data.reason ?? 'Marine data unavailable.', undefined, 'http');
  const c = data.current;
  const hourlyWaves = new Map<string, number | null>();
  data.hourly?.time.forEach((t, i) => hourlyWaves.set(t, data.hourly!.wave_height[i] ?? null));
  const dailyWaves = new Map<string, number | null>();
  data.daily?.time.forEach((t, i) => dailyWaves.set(t, data.daily!.wave_height_max[i] ?? null));

  if (!c) return { marine: null, hourlyWaves, dailyWaves };
  const marine: MarineConditions = {
    waveHeight: c.wave_height ?? null,
    wavePeriod: c.wave_period ?? null,
    waveDirection: c.wave_direction ?? null,
    swellWaveHeight: c.swell_wave_height ?? null,
    seaSurfaceTemperature: c.sea_surface_temperature ?? null,
  };
  const allNull = Object.values(marine).every((v) => v === null);
  return { marine: allNull ? null : marine, hourlyWaves, dailyWaves };
}

export async function getWeather(location: GeoLocation, signal?: AbortSignal): Promise<WeatherBundle> {
  const coords = { latitude: location.latitude.toFixed(4), longitude: location.longitude.toFixed(4) };
  const forecastUrl = buildUrl(API.forecast, { ...coords, ...FORECAST_PARAMS });
  const marineUrl = buildUrl(API.marine, { ...coords, ...MARINE_PARAMS });

  const [forecastRes, marineRes] = await Promise.allSettled([
    fetchJson<ForecastResponse>(forecastUrl, { signal }),
    fetchJson<MarineResponse>(marineUrl, { signal }),
  ]);

  if (forecastRes.status === 'rejected') throw forecastRes.reason;
  const base = parseForecast(forecastRes.value);

  let marine: MarineConditions | null = null;
  let marineError: string | undefined;
  if (marineRes.status === 'fulfilled') {
    try {
      const parsed = parseMarine(marineRes.value);
      marine = parsed.marine;
      base.hourly = base.hourly.map((h) => ({ ...h, waveHeight: parsed.hourlyWaves.get(h.time) ?? null }));
      base.daily = base.daily.map((d) => ({ ...d, waveHeightMax: parsed.dailyWaves.get(d.date) ?? null }));
      if (!marine) marineError = 'No marine data for this point — it may be inland or outside the marine model coverage.';
    } catch (err) {
      marineError = errorMessage(err);
    }
  } else {
    marineError = errorMessage(marineRes.reason);
  }

  return {
    location,
    ...base,
    marine,
    marineError,
    fetchedAt: new Date().toISOString(),
    sources: ['Open-Meteo Forecast API', ...(marine ? ['Open-Meteo Marine API'] : [])],
  };
}
