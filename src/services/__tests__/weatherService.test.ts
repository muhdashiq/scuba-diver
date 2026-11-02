import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, parseForecast } from '../weatherService';
import { ApiError } from '../http';

const loc = { name: 'Test', latitude: 27.9, longitude: 34.3 };
const forecast = {
  current: { time: '2026-11-02T10:00', temperature_2m: 28, apparent_temperature: 30, is_day: 1, precipitation: 0, weather_code: 1, cloud_cover: 10, wind_speed_10m: 12, wind_direction_10m: 300, wind_gusts_10m: 20, visibility: 20000 },
  hourly: { time: ['2026-11-02T09:00', '2026-11-02T10:00', '2026-11-02T11:00'], temperature_2m: [27, 28, 29], precipitation_probability: [0, 5, null], weather_code: [1, 1, 2], wind_speed_10m: [10, 12, 14], wind_gusts_10m: [18, 20, 22] },
  daily: { time: ['2026-11-02'], weather_code: [1], temperature_2m_max: [30], temperature_2m_min: [24], precipitation_probability_max: [10], wind_speed_10m_max: [20], wind_gusts_10m_max: [30], wind_direction_10m_dominant: [300] },
};
const marine = { current: { wave_height: 0.7, wave_direction: 310, wave_period: 6, swell_wave_height: 0.4, sea_surface_temperature: 27.1 }, hourly: { time: ['2026-11-02T10:00'], wave_height: [0.7] }, daily: { time: ['2026-11-02'], wave_height_max: [1.1] } };

const json = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));

afterEach(() => vi.restoreAllMocks());

describe('weatherService', () => {
  it('parses forecasts starting from the current hour', () => {
    const r = parseForecast(forecast);
    expect(r.current.temperature).toBe(28);
    expect(r.hourly[0].time).toBe('2026-11-02T10:00');
    expect(r.hourly[1].precipitationProbability).toBeNull();
    expect(r.daily[0].tempMax).toBe(30);
  });
  it('merges forecast and marine data', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => (String(url).includes('marine') ? json(marine) : json(forecast)));
    const w = await getWeather(loc);
    expect(w.marine?.seaSurfaceTemperature).toBe(27.1);
    expect(w.hourly[0].waveHeight).toBe(0.7);
    expect(w.daily[0].waveHeightMax).toBe(1.1);
    expect(w.sources).toContain('Open-Meteo Marine API');
  });
  it('keeps forecast data when the marine API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => (String(url).includes('marine') ? json({ error: true, reason: 'No data' }, 400) : json(forecast)));
    const w = await getWeather(loc);
    expect(w.marine).toBeNull();
    expect(w.marineError).toBeTruthy();
    expect(w.current.temperature).toBe(28);
  });
  it('reports marine "no data" when every marine value is null', async () => {
    const empty = { current: { wave_height: null, wave_direction: null, wave_period: null, swell_wave_height: null, sea_surface_temperature: null } };
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => (String(url).includes('marine') ? json(empty) : json(forecast)));
    const w = await getWeather(loc);
    expect(w.marine).toBeNull();
    expect(w.marineError).toMatch(/inland|coverage/);
  });
  it('throws a friendly error on HTTP failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => json({}, 503));
    await expect(getWeather(loc)).rejects.toThrow(/temporarily unavailable/);
  });
  it('throws a rate-limit message on 429', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => json({}, 429));
    await expect(getWeather(loc)).rejects.toThrow(/rate-limiting/);
  });
  it('throws a network error when fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')));
    const err = await getWeather(loc).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.kind).toBe('network');
  });
  it('rejects responses without data', () => {
    expect(() => parseForecast({})).toThrow(/No weather data/);
    expect(() => parseForecast({ error: true, reason: 'Invalid latitude' })).toThrow('Invalid latitude');
  });
});
