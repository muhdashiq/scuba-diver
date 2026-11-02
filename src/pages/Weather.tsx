import { CloudSun, Droplets, LocateFixed, MapPin, Navigation2, Wind } from 'lucide-react';
import { useState } from 'react';
import { ScreenHeader, BarButton } from '@/components/common/ScreenHeader';
import { EmptyState, ErrorState } from '@/components/common/States';
import { PullToRefresh } from '@/components/common/PullToRefresh';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { ConditionBadge } from '@/components/weather/ConditionBadge';
import { HourlyChart } from '@/components/weather/HourlyChart';
import { LocationSheet } from '@/components/weather/LocationSheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useWeather } from '@/hooks/useWeather';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { errorMessage, ApiError } from '@/services/http';
import { formatLocation } from '@/services/locationService';
import { degreesToCompass, formatSpeed, formatTemp, formatWaveHeight } from '@/utils/units';
import { assessConditions, describeWeatherCode, overallRating } from '@/utils/weather';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const RATING_DOT = { favorable: 'bg-success', caution: 'bg-warning', unfavorable: 'bg-destructive', unknown: 'bg-muted-foreground' } as const;

export default function Weather() {
  const units = useAppStore((s) => s.units);
  const location = useAppStore((s) => s.lastLocation);
  const setLocation = useAppStore((s) => s.setLastLocation);
  const [sheet, setSheet] = useState(false);
  const geo = useCurrentLocation();
  const weather = useWeather(location);
  const w = weather.data;
  const assessments = w ? assessConditions(w.current, w.marine, units, w.daily[0]) : [];
  const overall = overallRating(assessments);
  const temps = w ? w.daily.flatMap((d) => [d.tempMin, d.tempMax]) : [];
  const lo = Math.min(...temps);
  const hi = Math.max(...temps);

  const useMine = async () => {
    const l = await geo.locate();
    if (l) {
      setLocation(l);
      toast.success(`Showing ${l.name}`);
    }
  };

  return (
    <PullToRefresh onRefresh={() => weather.refetch()}>
      <ScreenHeader
        back={{ to: '/dive', label: 'Dive' }}
        title="Conditions"
        actions={<BarButton label="Change location" onClick={() => setSheet(true)}><MapPin aria-hidden="true" /></BarButton>}
      />

      {!location && (
        <EmptyState
          icon={CloudSun}
          title="Where are you diving?"
          message="Choose a destination to see live weather, wind and sea conditions."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={useMine} disabled={geo.loading}><LocateFixed /> Use My Location</Button>
              <Button variant="tinted" onClick={() => setSheet(true)}>Search a Place</Button>
            </div>
          }
        />
      )}
      {geo.error && !location && <p className="mt-3 text-center text-footnote text-destructive" role="alert">{geo.error}</p>}

      {location && weather.status === 'loading' && !w && (
        <div className="space-y-4" role="status" aria-label="Loading weather">
          <div className="flex flex-col items-center gap-2 py-6"><Skeleton className="h-4 w-32" /><Skeleton className="h-20 w-36" /><Skeleton className="h-4 w-24" /></div>
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      )}

      {location && weather.status === 'error' && !w && <ErrorState title="Couldn’t load the forecast" message={errorMessage(weather.error)} onRetry={weather.refetch} offline={weather.error instanceof ApiError && weather.error.kind === 'network'} />}

      {w && (
        <div className="space-y-6">
          {/* Hero */}
          <section className="flex flex-col items-center py-2 text-center" aria-label="Current weather">
            <button type="button" onClick={() => setSheet(true)} className="flex items-center gap-1 rounded-full px-3 py-1 text-title3 hover:bg-accent">
              <Navigation2 className="h-4 w-4 rotate-45 fill-current text-primary" aria-hidden="true" />
              {w.location.name}
            </button>
            <p className="text-footnote text-muted-foreground">{formatLocation(w.location).replace(`${w.location.name}, `, '') || ' '}</p>
            <div className="mt-1 flex items-center gap-2">
              <WeatherIcon icon={describeWeatherCode(w.current.weatherCode, w.current.isDay).icon} className="h-12 w-12" />
              <p className="text-[4.5rem] font-extralight leading-none tracking-tight tabular">{formatTemp(w.current.temperature, units)}</p>
            </div>
            <p className="text-headline">{describeWeatherCode(w.current.weatherCode, w.current.isDay).label}</p>
            <p className="text-subhead text-muted-foreground">
              H: {formatTemp(w.daily[0].tempMax, units)} · L: {formatTemp(w.daily[0].tempMin, units)} · Feels like {formatTemp(w.current.apparentTemperature, units)}
            </p>
          </section>

          {/* Diving conditions */}
          <section className="space-y-2" aria-labelledby="dive-cond">
            <div className="flex items-center justify-between px-1">
              <h2 id="dive-cond" className="text-title3">Surface conditions</h2>
              <ConditionBadge rating={overall} />
            </div>
            <div className="overflow-hidden rounded-2xl bg-card">
              <dl className="grid grid-cols-2 gap-px bg-separator/60 sm:grid-cols-4">
                {[
                  ['Sea temp', w.marine?.seaSurfaceTemperature != null ? formatTemp(w.marine.seaSurfaceTemperature, units, 1) : '—'],
                  ['Waves', w.marine?.waveHeight != null ? formatWaveHeight(w.marine.waveHeight, units) : '—'],
                  ['Wind', `${formatSpeed(w.current.windSpeed, units)} ${degreesToCompass(w.current.windDirection)}`],
                  ['Gusts', formatSpeed(w.current.windGusts, units)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card p-3.5">
                    <dt className="text-footnote text-muted-foreground">{k}</dt>
                    <dd className="text-title3 tabular">{v}</dd>
                  </div>
                ))}
              </dl>
              {!w.marine && <p className="border-t border-separator px-4 py-3 text-footnote text-muted-foreground">Marine data unavailable: {w.marineError ?? 'no data for this location.'}</p>}
              <ul className="list-group border-t border-separator">
                {assessments.map((a) => (
                  <li key={a.factor}>
                    <div className="relative flex gap-3 px-4 py-3">
                      <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', RATING_DOT[a.rating])} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-subhead"><span className="font-semibold">{a.factor}</span> <span className="text-muted-foreground tabular">· {a.value}</span><span className="sr-only"> — {a.rating}</span></p>
                        <p className="text-footnote text-muted-foreground">{a.explanation}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="px-1 text-footnote text-muted-foreground">Generic surface indicators, not a dive-site safety rating. Underwater visibility and currents can’t be inferred from forecasts — ask local operators.</p>
          </section>

          {/* Hourly */}
          <section className="space-y-2" aria-labelledby="hourly-h">
            <h2 id="hourly-h" className="px-1 text-title3">Next 24 hours</h2>
            <div className="rounded-2xl bg-card py-3">
              <ul className="no-scrollbar flex gap-1 overflow-x-auto px-3" aria-label="Hourly forecast">
                {w.hourly.map((h, i) => (
                  <li key={h.time} className="flex min-w-[3.5rem] flex-col items-center gap-1.5 py-1 text-subhead">
                    <span className="text-footnote font-medium text-muted-foreground">{i === 0 ? 'Now' : new Date(h.time).toLocaleTimeString([], { hour: 'numeric' })}</span>
                    <WeatherIcon icon={describeWeatherCode(h.weatherCode).icon} className="h-6 w-6" animated={false} />
                    <span className="font-semibold tabular">{formatTemp(h.temperature, units)}</span>
                    <span className="flex items-center gap-0.5 text-caption text-muted-foreground tabular"><Wind className="h-3 w-3" aria-hidden="true" />{Math.round(units === 'imperial' ? h.windSpeed * 0.621 : h.windSpeed)}</span>
                    {h.precipitationProbability != null && h.precipitationProbability > 0 && <span className="text-caption font-medium text-[#0071E3] tabular dark:text-[#64D2FF]">{h.precipitationProbability}%</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-separator px-2 pt-3">
                <HourlyChart hourly={w.hourly} units={units} />
              </div>
            </div>
          </section>

          {/* Daily */}
          <section className="space-y-2" aria-labelledby="daily-h">
            <h2 id="daily-h" className="px-1 text-title3">7-day forecast</h2>
            <ul className="list-group overflow-hidden rounded-2xl bg-card">
              {w.daily.map((d, i) => {
                const left = ((d.tempMin - lo) / Math.max(1, hi - lo)) * 100;
                const width = ((d.tempMax - d.tempMin) / Math.max(1, hi - lo)) * 100;
                return (
                  <li key={d.date}>
                    <div className="relative grid grid-cols-[3.25rem_2rem_2.75rem_1fr] items-center gap-2 px-4 py-2.5 text-body sm:grid-cols-[4rem_2rem_3rem_2.75rem_1fr_auto]">
                      <span className="font-medium">{i === 0 ? 'Today' : new Date(d.date).toLocaleDateString([], { weekday: 'short' })}</span>
                      <WeatherIcon icon={describeWeatherCode(d.weatherCode).icon} className="h-6 w-6" animated={false} />
                      <span className="hidden text-footnote font-medium text-[#0071E3] tabular dark:text-[#64D2FF] sm:block">{d.precipitationProbabilityMax ? <><Droplets className="mr-0.5 inline h-3 w-3" aria-hidden="true" />{d.precipitationProbabilityMax}%</> : ''}</span>
                      <span className="text-right text-muted-foreground tabular">{formatTemp(d.tempMin, units)}</span>
                      <span className="flex items-center gap-2">
                        <span className="relative h-1.5 flex-1 rounded-full bg-fill" aria-hidden="true">
                          <span className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#64D2FF] via-[#FFD60A] to-[#FF9F0A]" style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }} />
                        </span>
                        <span className="w-10 text-right tabular">{formatTemp(d.tempMax, units)}</span>
                      </span>
                      <span className="col-span-4 -mt-1 text-footnote text-muted-foreground sm:col-span-1 sm:mt-0 sm:text-right">
                        {formatSpeed(d.windSpeedMax, units)}{d.waveHeightMax != null ? ` · ${formatWaveHeight(d.waveHeightMax, units)} waves` : ''}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="px-1 text-center text-footnote text-muted-foreground">
            Updated {new Date(w.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {w.sources.join(' & ')} (CC BY 4.0) ·{' '}
            <button type="button" className="text-primary" onClick={weather.refetch} disabled={weather.status === 'loading'}>{weather.status === 'loading' ? 'Refreshing…' : 'Refresh'}</button>
          </p>
          {weather.status === 'error' && <p className="text-center text-footnote text-destructive" role="alert">Refresh failed: {errorMessage(weather.error)}</p>}
        </div>
      )}

      <LocationSheet open={sheet} onOpenChange={setSheet} current={location} onSelect={(l) => { setLocation(l); toast.success(`Showing ${l.name}`); }} />
    </PullToRefresh>
  );
}
