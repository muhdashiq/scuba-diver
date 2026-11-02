import { Area, AreaChart, CartesianGrid, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from 'framer-motion';
import type { ProfilePoint, UnitSystem } from '@/types';
import { fromMetricDepth, depthUnit } from '@/utils/units';
import { SAFETY_STOP_DEPTH_M, SAFETY_STOP_MINUTES } from '@/utils/divePlanner';

const PHASE_LABEL: Record<ProfilePoint['phase'], string> = { surface: 'Surface', descent: 'End of descent', bottom: 'Start of ascent', ascent: 'Ascent', 'safety-stop': 'End of safety stop' };

export function DiveProfileChart({ profile, units }: { profile: ProfilePoint[]; units: UnitSystem }) {
  const reduce = useReducedMotion();
  if (profile.length < 2) return <p className="py-10 text-center text-subhead text-muted-foreground">Enter valid depth, time and rates to draw the profile.</p>;
  const data = profile.map((p) => ({ ...p, d: Math.round(fromMetricDepth(p.depth, units) * 10) / 10 }));
  const maxD = Math.max(...data.map((p) => p.d));
  const stop = profile.find((p) => p.phase === 'safety-stop');
  const u = depthUnit(units);
  const descentEnd = profile[1];
  const bottomEnd = profile[2];

  return (
    <div className="h-72 w-full sm:h-80" role="img" aria-label={`Planned dive profile: descend to ${maxD} ${u}, bottom phase until ${bottomEnd?.time} minutes, ascend${stop ? ` with a ${SAFETY_STOP_MINUTES}-minute safety stop` : ''}, surface at ${profile[profile.length - 1].time} minutes.`}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="depthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0A84FF" stopOpacity={0.08} />
              <stop offset="1" stopColor="#0A84FF" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeOpacity={0.12} vertical={false} />
          <ReferenceArea x1={0} x2={descentEnd.time} fill="currentColor" fillOpacity={0.03} label={{ value: 'Descent', position: 'insideTop', fontSize: 11, fill: 'currentColor' }} />
          <ReferenceArea x1={descentEnd.time} x2={bottomEnd.time} fill="currentColor" fillOpacity={0.05} label={{ value: 'Bottom phase', position: 'insideTop', fontSize: 11, fill: 'currentColor' }} />
          <ReferenceArea x1={bottomEnd.time} x2={data[data.length - 1].time} fill="currentColor" fillOpacity={0.03} label={{ value: 'Ascent', position: 'insideTop', fontSize: 11, fill: 'currentColor' }} />
          <XAxis dataKey="time" type="number" domain={[0, 'dataMax']} tickFormatter={(v) => `${v}′`} tick={{ fill: 'currentColor', fontSize: 12 }} label={{ value: 'Time (min)', position: 'insideBottom', offset: -4, fontSize: 11, fill: 'currentColor' }} />
          <YAxis dataKey="d" reversed domain={[0, Math.ceil(maxD * 1.15)]} tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(v) => `${v}`} width={44} label={{ value: `Depth (${u})`, angle: -90, position: 'insideLeft', fontSize: 11, fill: 'currentColor' }} />
          {stop && (
            <ReferenceLine y={Math.round(fromMetricDepth(SAFETY_STOP_DEPTH_M, units))} stroke="#FF9F0A" strokeDasharray="6 4" label={{ value: `Safety stop ≈ ${Math.round(fromMetricDepth(SAFETY_STOP_DEPTH_M, units))} ${u}`, position: 'insideBottomRight', fontSize: 11, fill: '#FF9F0A' }} />
          )}
          <Tooltip
            formatter={(v: number) => [`${v} ${u}`, 'Depth']}
            labelFormatter={(t, p) => `${t} min · ${PHASE_LABEL[(p?.[0]?.payload as ProfilePoint | undefined)?.phase ?? 'surface']}`}
            contentStyle={{ background: 'hsl(var(--popover))', border: 'none', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.12)', color: 'hsl(var(--popover-foreground))' }}
          />
          <Area type="linear" dataKey="d" stroke="#0A84FF" strokeWidth={3} fill="url(#depthFill)" isAnimationActive={!reduce} animationDuration={1200} dot={{ r: 3, fill: '#0A84FF' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
