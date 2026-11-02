import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  Cylinder,
  Download,
  FolderOpen,
  Info,
  LifeBuoy,
  MapPin,
  OctagonAlert,
  Printer,
  RotateCcw,
  Route,
  Save,
  Thermometer,
  Trash2,
  Users,
  Waves,
  Wind,
} from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { DivePlanInput, PlanMessage } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { LocationSearch } from '@/components/common/LocationSearch';
import { Field, NumberField } from '@/components/dive-planner/Field';
import { DiveProfileChart } from '@/components/dive-planner/DiveProfileChart';
import { GasChart } from '@/components/dive-planner/GasChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, NativeSelect } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { useWeather } from '@/hooks/useWeather';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress } from '@/utils/checklist';
import {
  buildDiveProfile,
  CERTIFICATION_LABELS,
  DEFAULT_PLAN_INPUT,
  estimateGas,
  GAS_LABELS,
  getPlanAdvisories,
  planCompleteness,
  SAFETY_STOP_MINUTES,
  totalRunTime,
  validateDivePlan,
} from '@/utils/divePlanner';
import { buddyConsiderations, CURRENT_LABELS, DIVE_TYPE_LABELS, EMERGENCY_REMINDERS, entryExitInfo, exposureSuggestion, gasConsiderations, VISIBILITY_LABELS } from '@/utils/planSummary';
import { depthUnit, formatDepth, formatPressure, formatSpeed, formatTemp, formatWaveHeight, fromMetricDepth, fromMetricPressure, fromMetricTemp, pressureUnit, tempUnit, toMetricDepth, toMetricPressure, toMetricTemp } from '@/utils/units';
import { describeWeatherCode } from '@/utils/weather';
import { cn } from '@/lib/utils';

const r1 = (n: number) => Math.round(n * 10) / 10;

export default function DivePlanner() {
  const units = useAppStore((s) => s.units);
  const profile = useAppStore((s) => s.profile);
  const draft = useAppStore((s) => s.planDraft);
  const setDraft = useAppStore((s) => s.setPlanDraft);
  const savedPlans = useAppStore((s) => s.savedPlans);
  const savePlan = useAppStore((s) => s.savePlan);
  const deletePlan = useAppStore((s) => s.deletePlan);
  const checklist = useAppStore((s) => s.checklist);
  const [params, setParams] = useSearchParams();
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [touched, setTouched] = useState<Set<keyof DivePlanInput>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);

  const [input, setInput] = useState<DivePlanInput>(() => draft ?? { ...DEFAULT_PLAN_INPUT, certification: profile.certification, experience: profile.experience });

  // Load a saved plan via ?plan=<id>
  useEffect(() => {
    const id = params.get('plan');
    if (!id) return;
    const p = savedPlans.find((x) => x.id === id);
    if (p) setInput(p.input);
  }, [params, savedPlans]);

  // Persist the working draft
  useEffect(() => {
    const t = window.setTimeout(() => setDraft(input), 400);
    return () => window.clearTimeout(t);
  }, [input, setDraft]);

  const set = <K extends keyof DivePlanInput>(k: K, v: DivePlanInput[K]) => {
    setInput((cur) => ({ ...cur, [k]: v }));
    setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));
  };

  const validation = useMemo(() => validateDivePlan(input), [input]);
  // Only surface field errors once the user has edited that field or tried to save.
  const err = (k: keyof DivePlanInput) => (submitted || touched.has(k) ? validation.errors[k] : undefined);
  const diveProfile = useMemo(() => (validation.valid ? buildDiveProfile(input) : []), [input, validation.valid]);
  const gas = useMemo(() => (diveProfile.length ? estimateGas(input, diveProfile) : undefined), [input, diveProfile]);
  const advisories = useMemo(() => (validation.valid ? getPlanAdvisories(input, gas) : []), [input, gas, validation.valid]);
  const completeness = planCompleteness(input);
  const readiness = computeChecklistProgress(CHECKLIST, checklist);
  const runTime = totalRunTime(diveProfile);
  const loc = input.latitude !== undefined && input.longitude !== undefined ? { name: input.site, latitude: input.latitude, longitude: input.longitude } : null;
  const weather = useWeather(loc);
  const diveDate = input.dateTime ? input.dateTime.slice(0, 10) : null;
  const forecastDay = weather.data?.daily.find((d) => d.date === diveDate);

  const ids = { site: useId(), cert: useId(), exp: useId(), gas: useId(), current: useId(), vis: useId(), type: useId(), date: useId(), stop: useId() };

  const handleSave = () => {
    if (!validation.valid) return;
    const p = savePlan(input);
    setParams({ plan: p.id });
    setSavedMsg('Plan saved to this device.');
    window.setTimeout(() => setSavedMsg(null), 3000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ plan: input, generatedAt: new Date().toISOString(), note: 'Educational dive plan from ScubaDive — not a decompression schedule.' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dive-plan-${(input.site || 'site').replace(/\W+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Route} eyebrow="Educational planning assistant" title="Dive Planner" description="Enter your plan to visualise the profile, estimate gas use and review safety considerations." />

      <SafetyNotice title="Not a dive computer or decompression planner">
        This tool is an educational planning aid. It does <strong>not</strong> calculate decompression schedules or no-decompression limits, and it never clears you to dive.
        Gas figures are simplified estimates. Use a dive computer, follow your training agency’s procedures, and seek qualified supervision where appropriate.
        <strong> The final plan must be agreed with your buddy/team and the responsible dive professional.</strong>
      </SafetyNotice>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* ---------------- Form ---------------- */}
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); handleSave(); }} noValidate aria-label="Dive plan inputs">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-5 w-5 text-primary" aria-hidden="true" /> Site & time</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Dive site / location" htmlFor={ids.site} error={err('site')}>
                <Input id={ids.site} value={input.site} onChange={(e) => set('site', e.target.value)} placeholder="e.g. Blue Hole, Dahab" aria-invalid={!!err('site')} />
              </Field>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Optional: find coordinates for live conditions</p>
                <LocationSearch
                  label="Search site coordinates"
                  placeholder="Search nearest town or dive area…"
                  onSelect={(l) => setInput((c) => ({ ...c, site: c.site || l.name, latitude: l.latitude, longitude: l.longitude }))}
                />
                {loc && <p className="text-xs text-muted-foreground">Coordinates: {loc.latitude.toFixed(3)}, {loc.longitude.toFixed(3)} <button type="button" className="ml-2 font-semibold text-primary hover:underline" onClick={() => setInput((c) => ({ ...c, latitude: undefined, longitude: undefined }))}>clear</button></p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Dive date & time" htmlFor={ids.date} error={err('dateTime')}>
                  <Input id={ids.date} type="datetime-local" value={input.dateTime} onChange={(e) => set('dateTime', e.target.value)} aria-invalid={!!err('dateTime')} />
                </Field>
                <Field label="Dive type" htmlFor={ids.type}>
                  <NativeSelect id={ids.type} value={input.diveType} onChange={(e) => set('diveType', e.target.value as DivePlanInput['diveType'])}>
                    {Object.entries(DIVE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </NativeSelect>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5 text-primary" aria-hidden="true" /> Divers</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Certification level" htmlFor={ids.cert}>
                <NativeSelect id={ids.cert} value={input.certification} onChange={(e) => set('certification', e.target.value as DivePlanInput['certification'])}>
                  {Object.entries(CERTIFICATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </NativeSelect>
              </Field>
              <Field label="Experience level" htmlFor={ids.exp}>
                <NativeSelect id={ids.exp} value={input.experience} onChange={(e) => set('experience', e.target.value as DivePlanInput['experience'])}>
                  <option value="novice">Novice (&lt; 20 dives)</option>
                  <option value="intermediate">Intermediate (20–100)</option>
                  <option value="experienced">Experienced (100+)</option>
                  <option value="professional">Dive professional</option>
                </NativeSelect>
              </Field>
              <NumberField label="Number of divers" value={input.divers} onChange={(v) => set('divers', Math.round(v))} min={1} max={30} error={err('divers')} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Waves className="h-5 w-5 text-primary" aria-hidden="true" /> Depth & time</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Planned maximum depth" unit={depthUnit(units)} value={r1(fromMetricDepth(input.maxDepth, units))} onChange={(v) => set('maxDepth', toMetricDepth(v, units))} min={1} step={units === 'imperial' ? 5 : 1} error={err('maxDepth')} />
              <NumberField label="Planned bottom time" unit="min" value={input.bottomTime} onChange={(v) => set('bottomTime', v)} min={1} error={err('bottomTime')} hint="From leaving the surface to starting the ascent" />
              <NumberField label="Descent rate" unit={`${depthUnit(units)}/min`} value={r1(fromMetricDepth(input.descentRate, units))} onChange={(v) => set('descentRate', toMetricDepth(v, units))} error={err('descentRate')} />
              <NumberField label="Ascent rate" unit={`${depthUnit(units)}/min`} value={r1(fromMetricDepth(input.ascentRate, units))} onChange={(v) => set('ascentRate', toMetricDepth(v, units))} error={err('ascentRate')} hint="Follow your computer; slower is safer" />
              <div className="flex items-center gap-3 sm:col-span-2">
                <Switch id={ids.stop} checked={input.includeSafetyStop} onCheckedChange={(v) => set('includeSafetyStop', v)} />
                <Label htmlFor={ids.stop}>Show a {SAFETY_STOP_MINUTES}-minute safety stop near {formatDepth(5, units)} where applicable</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Cylinder className="h-5 w-5 text-primary" aria-hidden="true" /> Gas</CardTitle>
              <CardDescription>Used for an educational gas-use estimate only.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Cylinder size (water capacity)" unit="L" value={input.cylinderSize} onChange={(v) => set('cylinderSize', v)} step={0.5} error={err('cylinderSize')} hint="An aluminium 80 is roughly 11.1 L" />
              <Field label="Breathing gas" htmlFor={ids.gas}>
                <NativeSelect id={ids.gas} value={input.gas} onChange={(e) => set('gas', e.target.value as DivePlanInput['gas'])}>
                  {Object.entries(GAS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </NativeSelect>
              </Field>
              {input.gas === 'custom-nitrox' && <NumberField label="Oxygen percentage" unit="% O₂" value={input.customO2 ?? 32} onChange={(v) => set('customO2', v)} min={22} max={40} error={err('customO2')} />}
              <NumberField label="Starting pressure" unit={pressureUnit(units)} value={Math.round(fromMetricPressure(input.startPressure, units))} onChange={(v) => set('startPressure', toMetricPressure(v, units))} step={units === 'imperial' ? 100 : 10} error={err('startPressure')} />
              <NumberField label="Reserve pressure" unit={pressureUnit(units)} value={Math.round(fromMetricPressure(input.reservePressure, units))} onChange={(v) => set('reservePressure', toMetricPressure(v, units))} step={units === 'imperial' ? 100 : 10} error={err('reservePressure')} hint="Use the reserve taught by your agency/operator" />
              <NumberField label="Surface air consumption (SAC)" unit="L/min" value={input.sacRate} onChange={(v) => set('sacRate', v)} error={err('sacRate')} hint="Relaxed divers ~15–20; new or stressed divers often 25+" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wind className="h-5 w-5 text-primary" aria-hidden="true" /> Conditions</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <NumberField label="Water temperature" unit={tempUnit(units)} value={r1(fromMetricTemp(input.waterTemp, units))} onChange={(v) => set('waterTemp', toMetricTemp(v, units))} error={err('waterTemp')} />
                {weather.data?.marine?.seaSurfaceTemperature != null && (
                  <button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => set('waterTemp', Math.round(weather.data!.marine!.seaSurfaceTemperature! * 10) / 10)}>
                    Use forecast sea-surface temp ({formatTemp(weather.data.marine.seaSurfaceTemperature, units, 1)})
                  </button>
                )}
              </div>
              <Field label="Current" htmlFor={ids.current} hint="Ask local operators — forecasts don’t show currents">
                <NativeSelect id={ids.current} value={input.current} onChange={(e) => set('current', e.target.value as DivePlanInput['current'])}>
                  {Object.entries(CURRENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </NativeSelect>
              </Field>
              <Field label="Visibility (reported)" htmlFor={ids.vis}>
                <NativeSelect id={ids.vis} value={input.visibility} onChange={(e) => set('visibility', e.target.value as DivePlanInput['visibility'])}>
                  {Object.entries(VISIBILITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </NativeSelect>
              </Field>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="ocean" disabled={!validation.valid}><Save /> Save plan</Button>
            <Button type="button" variant="outline" onClick={() => window.print()} disabled={!validation.valid}><Printer /> Print</Button>
            <Button type="button" variant="outline" onClick={handleExport} disabled={!validation.valid}><Download /> Export JSON</Button>
            <Button type="button" variant="ghost" onClick={() => { setInput({ ...DEFAULT_PLAN_INPUT, certification: profile.certification, experience: profile.experience }); setParams({}); setTouched(new Set()); setSubmitted(false); }}><RotateCcw /> Reset</Button>
          </div>
          {savedMsg && <p className="text-sm font-medium text-success" role="status">{savedMsg}</p>}
          {!validation.valid && <p className={cn('text-sm', submitted ? 'text-destructive' : 'text-muted-foreground')} role="status">{Object.keys(validation.errors).length} field{Object.keys(validation.errors).length > 1 ? 's' : ''} still need{Object.keys(validation.errors).length > 1 ? '' : 's'} attention before the plan summary can be generated.</p>}
        </form>

        {/* ---------------- Output ---------------- */}
        <section className="space-y-5" aria-label="Dive plan summary" id="plan-summary">
          <Card className="overflow-hidden">
            <div className="ocean-gradient p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Educational dive plan summary</p>
              <h2 className="mt-1 text-2xl font-extrabold">{input.site || 'Unnamed site'}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="glass"><CalendarDays /> {input.dateTime ? new Date(input.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No date'}</Badge>
                <Badge variant="glass">{DIVE_TYPE_LABELS[input.diveType]}</Badge>
                <Badge variant="glass">Max {formatDepth(input.maxDepth, units)}</Badge>
                <Badge variant="glass">{input.bottomTime} min bottom time</Badge>
                {runTime > 0 && <Badge variant="glass">≈ {Math.round(runTime)} min total</Badge>}
              </div>
            </div>
            <CardContent className="space-y-2 p-5">
              <div className="flex justify-between text-sm"><span className="font-semibold">Plan completeness</span><span className="tabular text-muted-foreground">{completeness.done}/{completeness.total}</span></div>
              <Progress value={completeness.percent} aria-label="Plan completeness" />
              {completeness.missing.length > 0 && <p className="text-xs text-muted-foreground">Still to confirm: {completeness.missing.join(', ')}.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dive profile visualisation</CardTitle>
              <CardDescription>Illustrative profile of the plan you entered — not a decompression schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <DiveProfileChart profile={diveProfile} units={units} />
              {diveProfile.length > 0 && (
                <ol className="mt-4 grid gap-2 sm:grid-cols-4" aria-label="Dive timeline">
                  {[
                    { label: 'Descent', from: 0, to: diveProfile[1].time },
                    { label: 'Bottom', from: diveProfile[1].time, to: diveProfile[2].time },
                    ...(input.includeSafetyStop && input.maxDepth > 5
                      ? [{ label: 'Ascent to stop', from: diveProfile[2].time, to: diveProfile[3].time }, { label: 'Safety stop', from: diveProfile[3].time, to: diveProfile[4].time }]
                      : [{ label: 'Ascent', from: diveProfile[2].time, to: runTime }]),
                  ].map((ph) => (
                    <li key={ph.label} className="rounded-xl bg-secondary/60 p-3 text-sm">
                      <p className="font-semibold">{ph.label}</p>
                      <p className="tabular text-xs text-muted-foreground">{ph.from}–{ph.to} min · {r1(ph.to - ph.from)} min</p>
                    </li>
                  ))}
                </ol>
              )}
              {diveProfile.length > 0 && input.includeSafetyStop && input.maxDepth > 5 && (
                <p className="mt-3 flex gap-2 text-xs text-muted-foreground"><Info className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> Safety stop reminder: many agencies recommend about {SAFETY_STOP_MINUTES} minutes near {formatDepth(5, units)} on no-decompression dives. Whether and how to stop depends on your training and computer.</p>
              )}
            </CardContent>
          </Card>

          {gas && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gas & equipment considerations</CardTitle>
                <CardDescription>Ideal-gas estimate using your SAC rate and the deepest depth for the bottom phase. Real consumption varies with workload, stress, cold and current.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <GasChart gas={gas} units={units} reserve={input.reservePressure} />
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {gasConsiderations(input).map((g) => <li key={g} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{g}</li>)}
                  <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /><span><strong className="text-foreground">Exposure protection:</strong> {exposureSuggestion(input.waterTemp)}</span></li>
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Thermometer className="h-5 w-5 text-primary" aria-hidden="true" /> Expected environmental conditions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Water temp</dt><dd className="font-bold">{formatTemp(input.waterTemp, units)}</dd></div>
                <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Current</dt><dd className="font-bold">{CURRENT_LABELS[input.current]}</dd></div>
                <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Visibility</dt><dd className="font-bold">{VISIBILITY_LABELS[input.visibility]}</dd></div>
                <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Dive type</dt><dd className="font-bold">{DIVE_TYPE_LABELS[input.diveType]}</dd></div>
              </dl>
              {!loc && <p className="text-sm text-muted-foreground">Add coordinates above to include the live weather forecast for your dive day.</p>}
              {loc && weather.status === 'loading' && <p className="text-sm text-muted-foreground" role="status">Loading forecast…</p>}
              {loc && weather.status === 'error' && <p className="text-sm text-muted-foreground">Forecast unavailable right now. <button type="button" className="font-semibold text-primary hover:underline" onClick={weather.refetch}>Retry</button></p>}
              {loc && weather.data && !forecastDay && <p className="text-sm text-muted-foreground">No forecast is available for {diveDate ?? 'the selected date'} yet (forecasts cover 7 days).</p>}
              {forecastDay && (
                <div className="rounded-xl border p-3 text-sm">
                  <p className="font-semibold">Forecast for {new Date(forecastDay.date).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                  <p className="text-muted-foreground">
                    {describeWeatherCode(forecastDay.weatherCode).label} · {formatTemp(forecastDay.tempMin, units)}–{formatTemp(forecastDay.tempMax, units)} air · wind up to {formatSpeed(forecastDay.windSpeedMax, units)} (gusts {formatSpeed(forecastDay.windGustsMax, units)})
                    {forecastDay.precipitationProbabilityMax != null && ` · ${forecastDay.precipitationProbabilityMax}% rain chance`}
                    {forecastDay.waveHeightMax != null && ` · waves up to ${formatWaveHeight(forecastDay.waveHeightMax, units)}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Source: Open-Meteo. Surface forecasts do not describe underwater visibility or currents. <Link to="/weather" className="font-semibold text-primary hover:underline">Full conditions</Link></p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <ListCard title="Buddy considerations" icon={Users} items={buddyConsiderations(input)} />
            <ListCard title="Entry & exit" icon={MapPin} items={entryExitInfo(input)} />
          </div>
          <ListCard title="Emergency planning reminders" icon={LifeBuoy} items={EMERGENCY_REMINDERS} tone="warning" />

          {advisories.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" /> Plan advisories</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {sortAdvisories(advisories).map((a) => (
                  <Alert key={a.title} variant={a.severity === 'warning' ? 'warning' : a.severity === 'caution' ? 'caution' : 'info'} title={a.title}>{a.detail}</Alert>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', readiness.status === 'checklist-complete' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning')}>
                <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="font-bold">Safety checklist — {readiness.percent}% reviewed</p>
                <p className="text-sm text-muted-foreground">Complete personal, equipment, buddy and site checks before this dive.</p>
              </div>
              <Button asChild variant="outline"><Link to="/readiness">Open checklist</Link></Button>
            </CardContent>
          </Card>

          <Alert variant="safety" title="Agree the final plan">
            This summary is a starting point for discussion. Agree the final dive plan with your buddy/team and the appropriate dive professional, follow your dive computer, and abort if anything does not feel right.
          </Alert>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FolderOpen className="h-5 w-5 text-primary" aria-hidden="true" /> Saved plans</CardTitle></CardHeader>
            <CardContent>
              {savedPlans.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved plans yet.</p>
              ) : (
                <ul className="divide-y">
                  {savedPlans.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{p.input.site}</p>
                        <p className="text-xs text-muted-foreground">{p.input.dateTime ? new Date(p.input.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No date'} · {formatDepth(p.input.maxDepth, units)} · {p.input.bottomTime} min · {formatPressure(p.input.startPressure, units)}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { setParams({ plan: p.id }); setInput(p.input); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Load</Button>
                      <Button size="icon" variant="ghost" aria-label={`Delete plan for ${p.input.site}`} onClick={() => window.confirm('Delete this plan?') && deletePlan(p.id)}><Trash2 /></Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function sortAdvisories(a: PlanMessage[]) {
  const order = { warning: 0, caution: 1, info: 2 };
  return [...a].sort((x, y) => order[x.severity] - order[y.severity]);
}

function ListCard({ title, icon: Icon, items, tone }: { title: string; icon: typeof Users; items: string[]; tone?: 'warning' }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Icon className={cn('h-5 w-5', tone === 'warning' ? 'text-warning' : 'text-primary')} aria-hidden="true" /> {title}</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((i) => (
            <li key={i} className="flex gap-2">{tone === 'warning' ? <OctagonAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" /> : <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />}{i}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
