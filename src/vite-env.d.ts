/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string;
  readonly VITE_OPEN_METEO_FORECAST_URL?: string;
  readonly VITE_OPEN_METEO_MARINE_URL?: string;
  readonly VITE_OPEN_METEO_GEOCODING_URL?: string;
  readonly VITE_OVERPASS_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
