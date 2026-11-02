import { ArrowUpRight, Droplets, MapPin, Navigation, Thermometer, Waves, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GeoLocation } from '@/types';
import { useWeather } from '@/hooks/useWeather';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { errorMessage } from '@/services/http';
import { formatLocation } from '@/services/locationService';
import { degreesToCompass, formatSpeed, formatTemp, formatWaveHeight } from '@/utils/units';
import { assessConditions, describeWeatherCode, overallRating } from '@/utils/weather';
import { WeatherIcon } from './WeatherIcon';
import { ConditionBadge } from './ConditionBadge';

/** Compact live weather card for the dashboard. */
export function WeatherSummaryCard({ location }: { location: GeoLocation | null }) {
  const units = useAppStore((s) => s.units);
  const weather = useWeather(location);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Current conditions</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/weather">
            Details <ArrowUpRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!location && (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Choose a dive location to see live weather and marine conditions.</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/weather">
                <Navigation /> Set location
              </Link>
            </Button>
          </div>
        )}
        {location && weather.status === 'loading' && !weather.data && (
          <div className="space-y-3" role="status" aria-label="Loading weather">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {location && weather.status === 'error' && !weather.data && (
          <div className="space-y-2 text-sm">
            <p className="text-destructive">{errorMessage(weather.error)}</p>
            <Button variant="outline" size="sm" onClick={weather.refetch}>
              Retry
            </Button>
          </div>
        )}
        {weather.data && (() => {
          const w = weather.data;
          const desc = describeWeatherCode(w.current.weatherCode, w.current.isDay);
          const rating = overallRating(assessConditions(w.current, w.marine, units, w.daily[0]));
          return (
            <div className="space-y-4">
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {formatLocation(w.location)}
              </p>
              <div className="flex items-center gap-4">
                <WeatherIcon icon={desc.icon} className="h-14 w-14" />
                <div>
                  <p className="text-4xl font-extrabold tabular">{formatTemp(w.current.temperature, units)}</p>
                  <p className="text-sm text-muted-foreground">{desc.label}</p>
                </div>
                <div className="ml-auto">
                  <ConditionBadge rating={rating} />
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Wind className="h-4 w-4 text-primary" aria-hidden="true" /><dt className="sr-only">Wind</dt><dd>{formatSpeed(w.current.windSpeed, units)} {degreesToCompass(w.current.windDirection)}</dd></div>
                <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-primary" aria-hidden="true" /><dt className="sr-only">Rain chance</dt><dd>{w.daily[0]?.precipitationProbabilityMax ?? '—'}% rain</dd></div>
                <div className="flex items-center gap-2"><Waves className="h-4 w-4 text-primary" aria-hidden="true" /><dt className="sr-only">Waves</dt><dd>{w.marine?.waveHeight != null ? formatWaveHeight(w.marine.waveHeight, units) : 'No wave data'}</dd></div>
                <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary" aria-hidden="true" /><dt className="sr-only">Sea temperature</dt><dd>{w.marine?.seaSurfaceTemperature != null ? `Sea ${formatTemp(w.marine.seaSurfaceTemperature, units)}` : 'No SST data'}</dd></div>
              </dl>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(w.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {w.sources.join(' + ')}
              </p>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
