import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HourlyPoint, UnitSystem } from '@/types';
import { celsiusToFahrenheit, kmhToMph, metresToFeet } from '@/utils/units';

export function HourlyChart({ hourly, units }: { hourly: HourlyPoint[]; units: UnitSystem }) {
  const imp = units === 'imperial';
  const data = hourly.map((h) => ({
    hour: new Date(h.time).toLocaleTimeString([], { hour: '2-digit' }),
    temp: Math.round(imp ? celsiusToFahrenheit(h.temperature) : h.temperature),
    wind: Math.round(imp ? kmhToMph(h.windSpeed) : h.windSpeed),
    rain: h.precipitationProbability ?? 0,
    wave: h.waveHeight != null ? Math.round((imp ? metresToFeet(h.waveHeight) : h.waveHeight) * 10) / 10 : null,
  }));
  const hasWaves = data.some((d) => d.wave !== null);
  const tip = { background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--popover-foreground))' };
  return (
    <div className="h-72 w-full" role="img" aria-label="24-hour forecast chart of temperature, wind speed, rain probability and wave height">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="hour" tick={{ fill: 'currentColor', fontSize: 11 }} interval={2} />
          <YAxis yAxisId="l" tick={{ fill: 'currentColor', fontSize: 11 }} />
          <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 11 }} hide />
          <Tooltip contentStyle={tip} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="r" dataKey="rain" name="Rain %" fill="#38bdf8" fillOpacity={0.35} radius={[4, 4, 0, 0]} />
          <Line yAxisId="l" type="monotone" dataKey="temp" name={`Temp (${imp ? '°F' : '°C'})`} stroke="#f97316" strokeWidth={2.5} dot={false} />
          <Line yAxisId="l" type="monotone" dataKey="wind" name={`Wind (${imp ? 'mph' : 'km/h'})`} stroke="#14b8a6" strokeWidth={2.5} dot={false} />
          {hasWaves && <Line yAxisId="l" type="monotone" dataKey="wave" name={`Waves (${imp ? 'ft' : 'm'})`} stroke="#6366f1" strokeWidth={2} strokeDasharray="5 4" dot={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
