import { useCallback, useState } from 'react';
import type { GeoLocation } from '@/types';
import { getCurrentPosition, reverseGeocode } from '@/services/locationService';

/** Request the browser location on demand (never automatically) and label it. */
export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(async (): Promise<GeoLocation | null> => {
    setLoading(true);
    setError(null);
    try {
      const { latitude, longitude } = await getCurrentPosition();
      const place = await reverseGeocode(latitude, longitude);
      return { ...place, name: place.name || 'Current location' };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to get your location.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { locate, loading, error, clearError: () => setError(null) };
}
