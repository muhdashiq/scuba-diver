import { findDiveShops } from '@/services/diveShopService';
import { useAsync } from './useAsync';

export function useDiveShops(coords: { latitude: number; longitude: number } | null, radiusKm: number) {
  const key = coords ? `shops:${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}:${radiusKm}` : null;
  return useAsync(key, (signal) => findDiveShops(coords!.latitude, coords!.longitude, radiusKm, signal), 30 * 60 * 1000);
}
