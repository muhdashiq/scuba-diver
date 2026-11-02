import { Cloud, CloudSun, Compass, Droplets, Eye, Gauge, Map as MapIcon, RefreshCw, Thermometer, Waves, Wind } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import type { GeoLocation } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { LocationSearch } from '@/components/common/LocationSearch';
import { EmptyState, ErrorState } from '@/components/common/States';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { ConditionBadge } from '@/components/weather/ConditionBadge';
import { HourlyChart } from '@/components/weather/HourlyChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useWeather } from '@/hooks/useWeather';
import { errorMessage, ApiError } from '@/services/http';
import { formatLocation, reverseGeocode } from '@/services/locationService';
import { degreesToCompass, formatSpeed, formatTemp, formatWaveHeight } from '@/utils/units';
import { assessConditions, describeWeatherCode, overallRating } from '@/utils/weather';

const MapView = lazy(() => import('@/components/common/MapView').then((m) => ({ default: m.MapView })));

export default function Weather() {
  const units = useAppStore((s) => s.units);
  const location = useAppStore((s) => s.lastLocation);
  const setLocation = useAppStore((s) => s.setLastLocation);
  const [showMap, setShowMap] = useState(false);
  const weather = useWeather(location);
  const w = weather.data;

  const pickOnMap = async (lat: number, lon: number) => {
    setLocation({ name: `${lat.toFixed(3)}, ${lon.toFixed(3)}`, latitude: lat, longitude: lon });
    const named = await reverseGeocode(lat, lon);
    setLocation(named);
  };

  const select = (l: GeoLocation) => setLocation(l);
  const assessments = w ? assessConditions(w.current, w.marine, units, w.daily[0]) : [];
  const overall = overallRating(assessments);

  return (
    <div className="space-y-6">
      <PageHeader icon={CloudSun} eyebrow="Live data" title="Weather & Conditions" description="Live weather and marine forecasts for your dive location.">
        <div className="rounded-2xl bg-white/95 p-3 text-foreground shadow-lg dark:bg-card">
          <LocationSearch onSelect={select} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{location ? `Selected: ${formatLocation(location)}` : 'Search, use your location, or pick a point on the map.'}</p>
            <Button variant="ghost" size="sm" onClick={() => setShowMap((s) => !s)} aria-expanded={showMap}><MapIcon /> {showMap ? 'Hide map' : 'Select on map'}</Button>
          </div>
        </div>
      </PageHeader>

      {showMap && (
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
          <div className="space-y-2">
            <MapView
              center={location ?? { latitude: 20, longitude: 0 }}
              zoom={location ? 9 : 2}
              markers={location ? [{ id: 'sel', latitude: location.latitude, longitude: location.longitude, label: location.name, kind: 'site' }] : []}
              onPick={pickOnMap}
              className="h-80"
              ariaLabel="Map — click to choose a dive site"
            />
            <p className="text-xs text-muted-foreground">Tap or click the map to select a dive site.</p>
          </div>
        </Suspense>
      )}

      {!location && <EmptyState icon={CloudSun} title="No location selected" message="Choose a dive destination to load live weather, wind and marine conditions." />}

      {location && weather.status === 'loading' && !w && (
        <div className="grid gap-4 lg:grid-cols-3" role="status" aria-label="Loading weather">
          <Skeleton className="h-64 lg:col-span-1" />
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-72 lg:col-span-3" />
        </div>
      )}

      {location && weather.status === 'error' && !w && (
        <ErrorState title="Couldn’t load weather" message={errorMessage(weather.error)} onRetry={weather.refetch} offline={weather.error instanceof ApiError && weather.error.kind === 'network'} />
      )}

      {w && (
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Current weather */}
            <Card className="overflow-hidden">
              <div className="ocean-gradient p-5 text-white">
                <p className="text-sm font-medium text-cyan-100">{formatLocation(w.location)}</p>
                <div className="mt-3 flex items-center gap-4">
                  <WeatherIcon icon={describeWeatherCode(w.current.weatherCode, w.current.isDay).icon} className="h-16 w-16" />
                  <div>
                    <p className="text-5xl font-extrabold tabular">{formatTemp(w.current.temperature, units)}</p>
                    <p className="text-cyan-50">{describeWeatherCode(w.current.weatherCode, w.current.isDay).label}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <Metric icon={Thermometer} label="Air temp (feels like)" value={formatTemp(w.current.apparentTemperature, units)} />
                  <Metric icon={Wind} label="Wind speed" value={formatSpeed(w.current.windSpeed, units)} />
                  <Metric icon={Compass} label="Wind direction" value={`${degreesToCompass(w.current.windDirection)} (${Math.round(w.current.windDirection)}°)`} />
                  <Metric icon={Gauge} label="Wind gusts" value={formatSpeed(w.current.windGusts, units)} />
                  <Metric icon={Droplets} label="Rain chance today" value={w.daily[0]?.precipitationProbabilityMax != null ? `${w.daily[0].precipitationProbabilityMax}%` : 'No data'} />
                  <Metric icon={Cloud} label="Cloud cover" value={`${Math.round(w.current.cloudCover)}%`} />
                  {w.current.visibility != null && <Metric icon={Eye} label="Air visibility (above water)" value={`${(w.current.visibility / 1000).toFixed(1)} km`} />}
                </dl>
              </CardContent>
            </Card>

            {/* Diving conditions */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">Surface conditions for diving</CardTitle>
                  <CardDescription>Generic indicators with explanations — not a dive-site safety rating.</CardDescription>
                </div>
                <ConditionBadge rating={overall} />
              </CardHeader>
              <CardContent className="space-y-4">
                {w.marine ? (
                  <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <MarineTile icon={Thermometer} label="Sea surface temp" value={w.marine.seaSurfaceTemperature != null ? formatTemp(w.marine.seaSurfaceTemperature, units, 1) : '—'} />
                    <MarineTile icon={Waves} label="Wave height" value={w.marine.waveHeight != null ? formatWaveHeight(w.marine.waveHeight, units) : '—'} />
                    <MarineTile icon={Gauge} label="Wave period" value={w.marine.wavePeriod != null ? `${w.marine.wavePeriod.toFixed(1)} s` : '—'} />
                    <MarineTile icon={Compass} label="Wave direction" value={w.marine.waveDirection != null ? `${degreesToCompass(w.marine.waveDirection)} (${Math.round(w.marine.waveDirection)}°)` : '—'} />
                  </dl>
                ) : (
                  <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">Marine data unavailable: {w.marineError ?? 'no data for this location.'}</p>
                )}
                <ul className="space-y-2">
                  {assessments.map((a) => (
                    <li key={a.factor} className="flex flex-col gap-1 rounded-xl border p-3 sm:flex-row sm:items-start sm:gap-3">
                      <div className="flex shrink-0 items-center gap-2 sm:w-52">
                        <ConditionBadge rating={a.rating} />
                        <span className="text-sm font-semibold">{a.factor}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold tabular">{a.value}</span>
                        <span className="text-muted-foreground"> — {a.explanation}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">
                  <strong>Underwater visibility:</strong> not available — no reliable source provides it for arbitrary locations. <strong>Currents:</strong> not inferred from weather. Ask local dive operators about both.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Next 24 hours</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <HourlyChart hourly={w.hourly} units={units} />
              <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" aria-label="Hourly forecast">
                {w.hourly.map((h) => (
                  <li key={h.time} className="flex min-w-[76px] flex-col items-center gap-1 rounded-xl bg-secondary/60 p-2 text-xs">
                    <span className="font-semibold">{new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <WeatherIcon icon={describeWeatherCode(h.weatherCode).icon} className="h-6 w-6" animated={false} />
                    <span className="font-bold tabular">{formatTemp(h.temperature, units)}</span>
                    <span className="tabular text-muted-foreground">{formatSpeed(h.windSpeed, units)}</span>
                    {h.precipitationProbability != null && <span className="tabular text-sky-600 dark:text-sky-400">{h.precipitationProbability}%</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">7-day forecast</CardTitle></CardHeader>
            <CardContent>
              <ul className="divide-y">
                {w.daily.map((d, i) => {
                  const desc = describeWeatherCode(d.weatherCode);
                  return (
                    <li key={d.date} className="grid grid-cols-[minmax(84px,1fr)_auto_1fr] items-center gap-3 py-3 text-sm sm:grid-cols-[140px_auto_1fr_auto]">
                      <span className="font-semibold">{i === 0 ? 'Today' : new Date(d.date).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <WeatherIcon icon={desc.icon} className="h-7 w-7" animated={false} />
                      <span className="text-muted-foreground"><span className="font-semibold text-foreground tabular">{formatTemp(d.tempMax, units)}</span> / {formatTemp(d.tempMin, units)} · {desc.label}</span>
                      <span className="col-span-3 flex flex-wrap gap-x-3 text-xs text-muted-foreground sm:col-span-1 sm:justify-end">
                        <span>Wind {formatSpeed(d.windSpeedMax, units)}{d.windDirectionDominant != null ? ` ${degreesToCompass(d.windDirectionDominant)}` : ''}</span>
                        <span>Gusts {formatSpeed(d.windGustsMax, units)}</span>
                        {d.precipitationProbabilityMax != null && <span>Rain {d.precipitationProbabilityMax}%</span>}
                        {d.waveHeightMax != null && <span>Waves {formatWaveHeight(d.waveHeightMax, units)}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 text-sm">
            <p className="text-muted-foreground">
              Last updated {new Date(w.fetchedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · Data: {w.sources.join(', ')} (open-meteo.com, CC BY 4.0)
            </p>
            <Button variant="outline" size="sm" onClick={weather.refetch} disabled={weather.status === 'loading'}><RefreshCw className={weather.status === 'loading' ? 'animate-spin' : ''} /> Refresh</Button>
          </div>
          {weather.status === 'error' && <p className="text-sm text-destructive" role="alert">Refresh failed: {errorMessage(weather.error)} Showing the last loaded data.</p>}
        </>
      )}

      <SafetyNotice title="Forecasts are only one input">
        Weather and marine models describe broad surface conditions. Local effects — reefs, headlands, tides, surge — can differ greatly. Always get a site briefing from local professionals and be prepared to cancel.
      </SafetyNotice>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Wind; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold tabular">{value}</dd>
      </div>
    </div>
  );
}

function MarineTile({ icon: Icon, label, value }: { icon: typeof Wind; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{label}</dt>
      <dd className="mt-1 text-lg font-bold tabular">{value}</dd>
    </div>
  );
}
