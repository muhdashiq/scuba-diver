import type { GeoLocation } from '@/types';
import { getWeather } from '@/services/weatherService';
import { useAsync } from './useAsync';

export function useWeather(location: GeoLocation | null) {
  const key = location ? `weather:${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}` : null;
  return useAsync(key, (signal) => getWeather(location!, signal), 15 * 60 * 1000);
}
