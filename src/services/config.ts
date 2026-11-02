const env = import.meta.env;

export const API = {
  forecast: (env.VITE_OPEN_METEO_FORECAST_URL as string | undefined) ?? 'https://api.open-meteo.com/v1/forecast',
  marine: (env.VITE_OPEN_METEO_MARINE_URL as string | undefined) ?? 'https://marine-api.open-meteo.com/v1/marine',
  geocoding: (env.VITE_OPEN_METEO_GEOCODING_URL as string | undefined) ?? 'https://geocoding-api.open-meteo.com/v1/search',
  overpass: (env.VITE_OVERPASS_URL as string | undefined) ?? 'https://overpass-api.de/api/interpreter',
  nominatim: 'https://nominatim.openstreetmap.org',
};
