import { AlertTriangle, ClipboardCheck, Download, Info, LifeBuoy, MapPin, OctagonAlert, Printer, Save, Share, Thermometer, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { DivePlanInput, PlanMessage } from '@/types';
import { ScreenHeader, BarButton } from '@/components/common/ScreenHeader';
import { LocationSearch } from '@/components/common/LocationSearch';
import { StickyActions } from '@/components/common/StickyActions';
import { TipCard } from '@/components/common/TipCard';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { FormSection, NumberRow, SelectRow, SwitchRow, TextRow } from '@/components/dive-planner/Field';
import { DiveProfileChart } from '@/components/dive-planner/DiveProfileChart';
import { GasChart } from '@/components/dive-planner/GasChart';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
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
import { depthUnit, formatDepth, formatSpeed, formatTemp, formatWaveHeight, fromMetricDepth, fromMetricPressure, fromMetricTemp, pressureUnit, tempUnit, toMetricDepth, toMetricPressure, toMetricTemp } from '@/utils/units';
import { describeWeatherCode } from '@/utils/weather';
import { confirm } from '@/lib/confirm';
import { toast } from '@/lib/toast';
import { share } from '@/lib/share';
import { cn } from '@/lib/utils';

const r1 = (n: number) => Math.round(n * 10) / 10;
const opts = <T extends string>(o: Record<T, string>) => (Object.entries(o) as [T, string][]).map(([value, label]) => ({ value, label }));

export default function DivePlanner() {
  const units = useAppStore((s) => s.units);
  const profile = useAppStore((s) => s.profile);
  const draft = useAppStore((s) => s.planDraft);
  const setDraft = useAppStore((s) => s.setPlanDraft);
  const savedPlans = useAppStore((s) => s.savedPlans);
  const savePlan = useAppStore((s) => s.savePlan);
  const updatePlan = useAppStore((s) => s.updatePlan);
  const deletePlan = useAppStore((s) => s.deletePlan);
  const checklist = useAppStore((s) => s.checklist);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = params.get('plan');
  const editing = savedPlans.find((p) => p.id === planId);

  const fresh = (): DivePlanInput => ({ ...DEFAULT_PLAN_INPUT, certification: profile.certification === 'none' ? 'open-water' : profile.certification, experience: profile.experience });
  const [input, setInput] = useState<DivePlanInput>(() => editing?.input ?? draft ?? fresh());
  const [touched, setTouched] = useState<Set<keyof DivePlanInput>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState<'plan' | 'summary'>('plan');

  useEffect(() => {
    if (editing) setInput(editing.input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  useEffect(() => {
    if (editing) return;
    const t = window.setTimeout(() => setDraft(input), 400);
    return () => window.clearTimeout(t);
  }, [input, setDraft, editing]);

  const set = <K extends keyof DivePlanInput>(k: K, v: DivePlanInput[K]) => {
    setInput((cur) => ({ ...cur, [k]: v }));
    setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));
  };

  const validation = useMemo(() => validateDivePlan(input), [input]);
  const err = (k: keyof DivePlanInput) => (submitted || touched.has(k) ? validation.errors[k] : undefined);
  const diveProfile = useMemo(() => (validation.valid ? buildDiveProfile(input) : []), [input, validation.valid]);
  const gas = useMemo(() => (diveProfile.length ? estimateGas(input, diveProfile) : undefined), [input, diveProfile]);
  const advisories = useMemo(() => (validation.valid ? sortAdvisories(getPlanAdvisories(input, gas)) : []), [input, gas, validation.valid]);
  const completeness = planCompleteness(input);
  const readiness = computeChecklistProgress(CHECKLIST, checklist);
  const runTime = totalRunTime(diveProfile);
  const loc = input.latitude !== undefined && input.longitude !== undefined ? { name: input.site, latitude: input.latitude, longitude: input.longitude } : null;
  const weather = useWeather(loc);
  const diveDate = input.dateTime ? input.dateTime.slice(0, 10) : null;
  const forecastDay = weather.data?.daily.find((d) => d.date === diveDate);
  const errorCount = Object.keys(validation.errors).length;

  const handleSave = () => {
    setSubmitted(true);
    if (!validation.valid) {
      toast.error(`${errorCount} field${errorCount > 1 ? 's need' : ' needs'} attention`);
      setView('plan');
      return;
    }
    if (editing) {
      updatePlan(editing.id, input);
      toast.success('Plan updated');
    } else {
      const p = savePlan(input);
      setParams({ plan: p.id });
      setDraft(null);
      toast.success('Plan saved');
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!(await confirm({ title: 'Delete this plan?', message: `“${editing.input.site}” will be removed from this device.`, confirmLabel: 'Delete Plan', destructive: true }))) return;
    deletePlan(editing.id);
    toast('Plan deleted', { action: { label: 'Undo', onClick: () => useAppStore.setState((s) => ({ savedPlans: [editing, ...s.savedPlans] })) } });
    navigate('/dive');
  };

  const handleShare = () => {
    const text = [
      `Dive plan: ${input.site || 'Unnamed site'}`,
      input.dateTime && new Date(input.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      `Max depth ${formatDepth(input.maxDepth, units)} · ${input.bottomTime} min bottom time · ${GAS_LABELS[input.gas]}`,
      `Reserve ${Math.round(fromMetricPressure(input.reservePressure, units))} ${pressureUnit(units)} · ${DIVE_TYPE_LABELS[input.diveType]}`,
      'Educational plan from ScubaDive — agree the final plan with your buddy and dive professional.',
    ].filter(Boolean).join('\n');
    share({ title: `Dive plan: ${input.site}`, text, route: editing ? `/planner?plan=${editing.id}` : '/planner' });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ plan: input, generatedAt: new Date().toISOString(), note: 'Educational dive plan from ScubaDive — not a decompression schedule.' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dive-plan-${(input.site || 'site').replace(/\W+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Plan exported');
  };

  const startNew = () => {
    setInput(fresh());
    setParams({});
    setTouched(new Set());
    setSubmitted(false);
  };

  const form = (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }} noValidate aria-label="Dive plan inputs">
      <TipCard id="planner-intro" title="How the planner works">Enter your site and plan. The summary updates as you type — switch to <strong>Summary</strong> to review the profile, gas estimate and reminders.</TipCard>

      <FormSection title="Site & time">
        <TextRow label="Dive site" value={input.site} onChange={(v) => set('site', v)} placeholder="e.g. Blue Hole, Dahab" error={err('site')} stacked />
        <div className="px-4 py-3">
          <p className="mb-2 text-footnote text-muted-foreground">Add coordinates for the live forecast (optional)</p>
          <LocationSearch label="Search site coordinates" placeholder="Search town or dive area" onSelect={(l) => { setInput((c) => ({ ...c, site: c.site || l.name, latitude: l.latitude, longitude: l.longitude })); toast.success(`Location set: ${l.name}`); }} />
          {loc && (
            <p className="mt-2 flex items-center gap-1.5 text-footnote text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {loc.latitude.toFixed(3)}, {loc.longitude.toFixed(3)}
              <button type="button" className="ml-1 font-semibold text-primary" onClick={() => setInput((c) => ({ ...c, latitude: undefined, longitude: undefined }))}>Remove</button>
            </p>
          )}
        </div>
        <TextRow label="Date & time" type="datetime-local" value={input.dateTime} onChange={(v) => set('dateTime', v)} error={err('dateTime')} />
        <SelectRow label="Dive type" value={input.diveType} onChange={(v) => set('diveType', v)} options={opts(DIVE_TYPE_LABELS)} />
      </FormSection>

      <FormSection title="Divers">
        <SelectRow label="Certification" value={input.certification} onChange={(v) => set('certification', v)} options={opts(CERTIFICATION_LABELS)} />
        <SelectRow label="Experience" value={input.experience} onChange={(v) => set('experience', v)} options={[{ value: 'novice', label: 'Novice (< 20 dives)' }, { value: 'intermediate', label: 'Intermediate (20–100)' }, { value: 'experienced', label: 'Experienced (100+)' }, { value: 'professional', label: 'Dive professional' }]} />
        <NumberRow label="Divers in team" value={input.divers} onChange={(v) => set('divers', Math.round(v))} min={1} max={30} error={err('divers')} />
      </FormSection>

      <FormSection title="Depth & time" footer="Bottom time runs from leaving the surface to starting the ascent. Follow your computer; slower ascents are safer.">
        <NumberRow label="Maximum depth" unit={depthUnit(units)} value={r1(fromMetricDepth(input.maxDepth, units))} onChange={(v) => set('maxDepth', toMetricDepth(v, units))} min={1} step={units === 'imperial' ? 5 : 1} error={err('maxDepth')} />
        <NumberRow label="Bottom time" unit="min" value={input.bottomTime} onChange={(v) => set('bottomTime', v)} min={1} error={err('bottomTime')} />
        <NumberRow label="Descent rate" unit={`${depthUnit(units)}/min`} value={r1(fromMetricDepth(input.descentRate, units))} onChange={(v) => set('descentRate', toMetricDepth(v, units))} error={err('descentRate')} />
        <NumberRow label="Ascent rate" unit={`${depthUnit(units)}/min`} value={r1(fromMetricDepth(input.ascentRate, units))} onChange={(v) => set('ascentRate', toMetricDepth(v, units))} error={err('ascentRate')} />
        <SwitchRow label={`Show safety stop (${SAFETY_STOP_MINUTES} min)`} checked={input.includeSafetyStop} onChange={(v) => set('includeSafetyStop', v)} />
      </FormSection>

      <FormSection title="Gas" footer="Used only for a simplified, educational gas estimate. An aluminium 80 is roughly 11.1 L.">
        <SelectRow label="Breathing gas" value={input.gas} onChange={(v) => set('gas', v)} options={opts(GAS_LABELS)} />
        {input.gas === 'custom-nitrox' && <NumberRow label="Oxygen" unit="%" value={input.customO2 ?? 32} onChange={(v) => set('customO2', v)} min={22} max={40} error={err('customO2')} />}
        <NumberRow label="Cylinder size" unit="L" value={input.cylinderSize} onChange={(v) => set('cylinderSize', v)} step={0.5} error={err('cylinderSize')} />
        <NumberRow label="Start pressure" unit={pressureUnit(units)} value={Math.round(fromMetricPressure(input.startPressure, units))} onChange={(v) => set('startPressure', toMetricPressure(v, units))} step={units === 'imperial' ? 100 : 10} error={err('startPressure')} />
        <NumberRow label="Reserve" unit={pressureUnit(units)} value={Math.round(fromMetricPressure(input.reservePressure, units))} onChange={(v) => set('reservePressure', toMetricPressure(v, units))} step={units === 'imperial' ? 100 : 10} error={err('reservePressure')} hint="Use the reserve your agency or operator teaches" />
        <NumberRow label="Air consumption (SAC)" unit="L/min" value={input.sacRate} onChange={(v) => set('sacRate', v)} error={err('sacRate')} hint="Relaxed divers ~15–20; new or stressed divers often 25+" />
      </FormSection>

      <FormSection title="Conditions" footer="Forecasts don’t describe currents or underwater visibility — ask local operators.">
        <NumberRow label="Water temperature" unit={tempUnit(units)} value={r1(fromMetricTemp(input.waterTemp, units))} onChange={(v) => set('waterTemp', toMetricTemp(v, units))} error={err('waterTemp')} />
        {weather.data?.marine?.seaSurfaceTemperature != null && (
          <div className="px-4 py-2.5">
            <button type="button" className="text-subhead text-primary" onClick={() => set('waterTemp', r1(weather.data!.marine!.seaSurfaceTemperature!))}>
              Use forecast sea temperature ({formatTemp(weather.data.marine.seaSurfaceTemperature, units, 1)})
            </button>
          </div>
        )}
        <SelectRow label="Current" value={input.current} onChange={(v) => set('current', v)} options={opts(CURRENT_LABELS)} />
        <SelectRow label="Visibility" value={input.visibility} onChange={(v) => set('visibility', v)} options={opts(VISIBILITY_LABELS)} />
      </FormSection>
    </form>
  );

  const summary = (
    <section className="space-y-6" aria-label="Dive plan summary">
      <div className="space-y-3 rounded-2xl bg-card p-4">
        <div>
          <p className="text-footnote text-muted-foreground">{input.dateTime ? new Date(input.dateTime).toLocaleString([], { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'No date set'}</p>
          <h2 className="text-title2">{input.site || 'Unnamed site'}</h2>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Max depth', formatDepth(input.maxDepth, units)],
            ['Bottom', `${input.bottomTime} min`],
            ['Total', runTime ? `≈ ${Math.round(runTime)} min` : '—'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-fill px-2 py-2.5">
              <dt className="text-caption text-muted-foreground">{k}</dt>
              <dd className="text-headline tabular">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-1.5">
          <div className="flex justify-between text-footnote"><span className="text-muted-foreground">Plan completeness</span><span className="tabular text-muted-foreground">{completeness.done}/{completeness.total}</span></div>
          <Progress value={completeness.percent} aria-label="Plan completeness" />
          {completeness.missing.length > 0 && <p className="text-footnote text-muted-foreground">Still to confirm: {completeness.missing.join(', ')}.</p>}
        </div>
      </div>

      {!validation.valid && (
        <Alert variant="caution" title="Finish the plan to see the profile">
          {errorCount} field{errorCount > 1 ? 's need' : ' needs'} attention. <button type="button" className="font-semibold text-primary" onClick={() => { setSubmitted(true); setView('plan'); }}>Review fields</button>
        </Alert>
      )}

      <section className="space-y-2">
        <h2 className="px-1 text-title3">Dive profile</h2>
        <div className="rounded-2xl bg-card p-3 pt-4">
          <DiveProfileChart profile={diveProfile} units={units} />
          {diveProfile.length > 0 && input.includeSafetyStop && input.maxDepth > 5 && (
            <p className="mt-2 flex gap-2 px-1 text-footnote text-muted-foreground"><Info className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> Many agencies recommend about {SAFETY_STOP_MINUTES} minutes near {formatDepth(5, units)} on no-decompression dives. Follow your training and computer.</p>
          )}
        </div>
        <p className="px-1 text-footnote text-muted-foreground">Illustrative profile of your inputs — not a decompression schedule.</p>
      </section>

      {gas && (
        <section className="space-y-2">
          <h2 className="px-1 text-title3">Gas & equipment</h2>
          <div className="space-y-4 rounded-2xl bg-card p-4">
            <GasChart gas={gas} units={units} reserve={input.reservePressure} />
            <ul className="space-y-1.5 border-t border-separator pt-3 text-subhead text-foreground/85">
              {gasConsiderations(input).map((g) => <li key={g} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{g}</li>)}
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /><span><strong>Exposure protection:</strong> {exposureSuggestion(input.waterTemp)}</span></li>
            </ul>
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 px-1 text-title3"><Thermometer className="h-5 w-5 text-primary" aria-hidden="true" /> Conditions</h2>
        <div className="space-y-3 rounded-2xl bg-card p-4">
          <dl className="grid grid-cols-2 gap-3 text-subhead sm:grid-cols-4">
            <div><dt className="text-footnote text-muted-foreground">Water</dt><dd className="font-semibold">{formatTemp(input.waterTemp, units)}</dd></div>
            <div><dt className="text-footnote text-muted-foreground">Current</dt><dd className="font-semibold">{CURRENT_LABELS[input.current]}</dd></div>
            <div><dt className="text-footnote text-muted-foreground">Visibility</dt><dd className="font-semibold">{VISIBILITY_LABELS[input.visibility]}</dd></div>
            <div><dt className="text-footnote text-muted-foreground">Type</dt><dd className="font-semibold">{DIVE_TYPE_LABELS[input.diveType]}</dd></div>
          </dl>
          <div className="border-t border-separator pt-3 text-subhead">
            {!loc && <p className="text-muted-foreground">Add coordinates in the plan to include the forecast for your dive day.</p>}
            {loc && weather.status === 'loading' && <p className="text-muted-foreground" role="status">Loading forecast…</p>}
            {loc && weather.status === 'error' && <p className="text-muted-foreground">Forecast unavailable. <button type="button" className="font-semibold text-primary" onClick={weather.refetch}>Retry</button></p>}
            {loc && weather.data && !forecastDay && <p className="text-muted-foreground">No forecast for {diveDate ?? 'that date'} yet — forecasts cover 7 days.</p>}
            {forecastDay && (
              <p>
                <strong>{new Date(forecastDay.date).toLocaleDateString([], { weekday: 'long' })}:</strong>{' '}
                <span className="text-muted-foreground">
                  {describeWeatherCode(forecastDay.weatherCode).label}, {formatTemp(forecastDay.tempMin, units)}–{formatTemp(forecastDay.tempMax, units)}, wind up to {formatSpeed(forecastDay.windSpeedMax, units)}
                  {forecastDay.precipitationProbabilityMax != null && `, ${forecastDay.precipitationProbabilityMax}% rain`}
                  {forecastDay.waveHeightMax != null && `, waves up to ${formatWaveHeight(forecastDay.waveHeightMax, units)}`}. <Link to="/weather" className="text-primary">Details</Link>
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {advisories.length > 0 && (
        <section className="space-y-2">
          <h2 className="flex items-center gap-2 px-1 text-title3"><AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" /> Things to consider</h2>
          <div className="space-y-2">
            {advisories.map((a) => <Alert key={a.title} variant={a.severity === 'warning' ? 'warning' : a.severity === 'caution' ? 'caution' : 'info'} title={a.title}>{a.detail}</Alert>)}
          </div>
        </section>
      )}

      <ListBlock title="Buddy" icon={Users} items={buddyConsiderations(input)} />
      <ListBlock title="Entry & exit" icon={MapPin} items={entryExitInfo(input)} />
      <ListBlock title="Emergency plan" icon={LifeBuoy} items={EMERGENCY_REMINDERS} warn />

      <ListGroup>
        <ListRow to="/readiness" leading={<IconTile icon={ClipboardCheck} color="bg-[#34C759]" />} title="Readiness Check" subtitle={`${readiness.percent}% reviewed`} />
      </ListGroup>

      <Alert variant="safety" title="Agree the final plan">
        This is an educational starting point, not a decompression schedule or clearance to dive. Agree the final plan with your buddy/team and the responsible dive professional, and follow your dive computer.
      </Alert>
    </section>
  );

  return (
    <>
      <ScreenHeader
        back={{ to: '/dive', label: 'Dive' }}
        title={editing ? 'Edit Plan' : 'Dive Planner'}
        subtitle={editing ? `Saved ${new Date(editing.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}` : 'Educational planning assistant'}
        actions={
          <>
            {editing && <Button variant="ghost" size="sm" onClick={startNew}>New</Button>}
            <BarButton label="Share plan" onClick={handleShare}><Share aria-hidden="true" /></BarButton>
            {editing && <BarButton label="Delete plan" onClick={handleDelete} className="text-destructive hover:bg-destructive/10"><Trash2 aria-hidden="true" /></BarButton>}
          </>
        }
      >
        <SegmentedControl className="xl:hidden" label="View" value={view} onChange={setView} options={[{ value: 'plan', label: 'Plan' }, { value: 'summary', label: 'Summary' }]} />
      </ScreenHeader>

      <p className="mb-6 flex gap-2 rounded-2xl bg-warning/[0.08] p-3.5 text-footnote text-muted-foreground">
        <OctagonAlert className="mt-px h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
        <span><strong className="text-foreground">Not a dive computer.</strong> No decompression limits are calculated and nothing here clears you to dive.</span>
      </p>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className={cn(view !== 'plan' && 'hidden xl:block')}>{form}</div>
        <div className={cn(view !== 'summary' && 'hidden xl:block')}>{summary}</div>
      </div>

      <StickyActions>
        <Button className="flex-1" onClick={handleSave}><Save /> {editing ? 'Update Plan' : 'Save Plan'}</Button>
        <Button variant="secondary" size="icon" onClick={() => window.print()} aria-label="Print plan" disabled={!validation.valid}><Printer /></Button>
        <Button variant="secondary" size="icon" onClick={handleExport} aria-label="Export plan as JSON" disabled={!validation.valid}><Download /></Button>
      </StickyActions>
    </>
  );
}

function sortAdvisories(a: PlanMessage[]) {
  const order = { warning: 0, caution: 1, info: 2 };
  return [...a].sort((x, y) => order[x.severity] - order[y.severity]);
}

function ListBlock({ title, icon: Icon, items, warn }: { title: string; icon: typeof Users; items: string[]; warn?: boolean }) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-center gap-2 px-1 text-title3"><Icon className={cn('h-5 w-5', warn ? 'text-warning' : 'text-primary')} aria-hidden="true" /> {title}</h2>
      <ul className="space-y-2 rounded-2xl bg-card p-4 text-subhead text-foreground/85">
        {items.map((i) => <li key={i} className="flex gap-2.5"><span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', warn ? 'bg-warning' : 'bg-primary')} aria-hidden="true" />{i}</li>)}
      </ul>
    </section>
  );
}
