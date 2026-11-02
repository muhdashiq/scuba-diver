import type { GeoLocation } from '@/types';
import { API } from './config';
import { ApiError, fetchJson } from './http';

export class GeolocationError extends Error {
  constructor(message: string, public readonly code: 'denied' | 'unavailable' | 'timeout' | 'unsupported') {
    super(message);
    this.name = 'GeolocationError';
  }
}

/** Ask the browser for the user's position. Only called in response to a user action. */
export function getCurrentPosition(timeoutMs = 12000): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(new GeolocationError('Location services are not supported by this browser. Search for a place instead.', 'unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED)
          reject(new GeolocationError('Location permission was denied. You can search for a place manually instead.', 'denied'));
        else if (err.code === err.TIMEOUT) reject(new GeolocationError('Finding your location timed out. Try again or search manually.', 'timeout'));
        else reject(new GeolocationError('Your location is currently unavailable. Search for a place manually.', 'unavailable'));
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 5 * 60 * 1000 },
    );
  });
}

interface GeocodingResponse {
  results?: { id: number; name: string; latitude: number; longitude: number; country?: string; admin1?: string }[];
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = `${API.geocoding}?${new URLSearchParams({ name: q, count: '8', language: 'en', format: 'json' })}`;
  const data = await fetchJson<GeocodingResponse>(url, { signal });
  return (data.results ?? []).map((r) => ({ name: r.name, latitude: r.latitude, longitude: r.longitude, country: r.country, admin1: r.admin1 }));
}

interface NominatimReverse {
  name?: string;
  display_name?: string;
  address?: Record<string, string>;
}

/** Best-effort reverse geocode for labelling a coordinate. Falls back to the coordinates. */
export async function reverseGeocode(latitude: number, longitude: number, signal?: AbortSignal): Promise<GeoLocation> {
  const fallback: GeoLocation = { name: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`, latitude, longitude };
  try {
    const url = `${API.nominatim}/reverse?${new URLSearchParams({ lat: String(latitude), lon: String(longitude), format: 'jsonv2', zoom: '10' })}`;
    const data = await fetchJson<NominatimReverse>(url, { signal, timeoutMs: 8000, headers: { 'Accept-Language': 'en' } });
    const a = data.address ?? {};
    const name = data.name || a.city || a.town || a.village || a.municipality || a.county || a.state;
    if (!name) return fallback;
    return { name, latitude, longitude, country: a.country, admin1: a.state };
  } catch (err) {
    if (err instanceof ApiError || err instanceof Error) return fallback;
    return fallback;
  }
}

export const formatLocation = (l: GeoLocation) => [l.name, l.admin1, l.country].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(', ');
