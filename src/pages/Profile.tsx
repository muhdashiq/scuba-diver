import { Award, BookOpenCheck, BrainCircuit, MapPin, Palette, Plus, Route, Save, UserRound, X } from 'lucide-react';
import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CertificationLevel, ExperienceLevel, UserProfile } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressRing } from '@/components/common/ProgressRing';
import { Field, NumberField } from '@/components/dive-planner/Field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, NativeSelect } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useTheme } from '@/components/common/ThemeProvider';
import { CERTIFICATION_LABELS } from '@/utils/divePlanner';
import { formatDepth } from '@/utils/units';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { AOW_MODULES } from '@/data/advancedOpenWater';
import { SPECIALTIES } from '@/data/specialties';

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = { novice: 'Novice', intermediate: 'Intermediate', experienced: 'Experienced', professional: 'Professional' };

function lessonTitle(key: string) {
  if (key.startsWith('spec-')) return SPECIALTIES.find((s) => `spec-${s.id}` === key)?.title;
  return OPEN_WATER_LESSONS.find((l) => l.id === key)?.title ?? AOW_MODULES.find((m) => m.id === key)?.title;
}

export default function Profile() {
  const profile = useAppStore((s) => s.profile);
  const update = useAppStore((s) => s.updateProfile);
  const units = useAppStore((s) => s.units);
  const completed = useAppStore((s) => s.completedLessons);
  const quizHistory = useAppStore((s) => s.quizHistory);
  const plans = useAppStore((s) => s.savedPlans);
  const progress = useLearningProgress();
  const { theme } = useTheme();
  const [form, setForm] = useState<UserProfile>(profile);
  const [newLoc, setNewLoc] = useState('');
  const [saved, setSaved] = useState(false);
  const ids = { name: useId(), cert: useId(), agency: useId(), exp: useId(), loc: useId() };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update({ ...form, name: form.name.trim(), completedDives: Math.max(0, Math.round(form.completedDives || 0)) });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  const addLoc = () => {
    const v = newLoc.trim();
    if (v && !form.preferredLocations.includes(v)) setForm({ ...form, preferredLocations: [...form.preferredLocations, v] });
    setNewLoc('');
  };
  const completedList = Object.entries(completed).sort((a, b) => b[1].localeCompare(a[1]));

  return (
    <div className="space-y-6">
      <PageHeader icon={UserRound} eyebrow="Account" title="My Profile" description="Your diving profile and learning history are stored on this device." />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={save} className="lg:col-span-2" aria-label="Edit profile">
          <Card>
            <CardHeader><CardTitle className="text-base">Diver details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor={ids.name}><Input id={ids.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="given-name" maxLength={60} /></Field>
              <Field label="Certification level" htmlFor={ids.cert}>
                <NativeSelect id={ids.cert} value={form.certification} onChange={(e) => setForm({ ...form, certification: e.target.value as CertificationLevel })}>
                  {Object.entries(CERTIFICATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </NativeSelect>
              </Field>
              <Field label="Training agency (optional)" htmlFor={ids.agency}><Input id={ids.agency} value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} placeholder="e.g. PADI, SSI, NAUI, BSAC" maxLength={40} /></Field>
              <Field label="Diving experience" htmlFor={ids.exp}>
                <NativeSelect id={ids.exp} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value as ExperienceLevel })}>
                  {Object.entries(EXPERIENCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </NativeSelect>
              </Field>
              <NumberField label="Completed dives" value={form.completedDives} onChange={(v) => setForm({ ...form, completedDives: v })} min={0} />
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor={ids.loc} className="text-sm font-medium">Preferred diving locations</label>
                <div className="flex gap-2">
                  <Input id={ids.loc} value={newLoc} onChange={(e) => setNewLoc(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLoc(); } }} placeholder="Add a destination" />
                  <Button type="button" variant="outline" onClick={addLoc} aria-label="Add location"><Plus /></Button>
                </div>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {form.preferredLocations.map((l) => (
                    <li key={l}><Badge variant="secondary" className="gap-1.5 py-1 pl-3"><MapPin />{l}<button type="button" onClick={() => setForm({ ...form, preferredLocations: form.preferredLocations.filter((x) => x !== l) })} aria-label={`Remove ${l}`} className="rounded-full p-0.5 hover:bg-background"><X /></button></Badge></li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Button type="submit" variant="ocean"><Save /> Save profile</Button>
                {saved && <span className="text-sm font-medium text-success" role="status">Saved</span>}
              </div>
            </CardContent>
          </Card>
        </form>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="h-5 w-5 text-primary" aria-hidden="true" /> Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <ProgressRing value={progress.overall.percent} size={84} label={`Learning ${progress.overall.percent}%`} />
              <div className="text-sm">
                <p className="font-bold">{CERTIFICATION_LABELS[profile.certification]}</p>
                <p className="text-muted-foreground">{profile.completedDives} dives · {EXPERIENCE_LABELS[profile.experience]}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Lessons done</dt><dd className="text-lg font-bold">{progress.overall.done}</dd></div>
              <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Quizzes</dt><dd className="text-lg font-bold">{quizHistory.length}</dd></div>
              <div className="rounded-xl bg-secondary/60 p-3"><dt className="text-xs text-muted-foreground">Saved plans</dt><dd className="text-lg font-bold">{plans.length}</dd></div>
              <div className="rounded-xl bg-secondary/60 p-3"><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Palette className="h-3 w-3" aria-hidden="true" />Theme</dt><dd className="text-lg font-bold capitalize">{theme}</dd></div>
            </dl>
            <Button asChild variant="outline" size="sm"><Link to="/settings">Theme & settings</Link></Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpenCheck className="h-5 w-5 text-primary" aria-hidden="true" /> Completed lessons</CardTitle></CardHeader>
          <CardContent>
            {completedList.length === 0 ? <p className="text-sm text-muted-foreground">No lessons completed yet. <Link className="font-semibold text-primary hover:underline" to="/open-water">Start learning</Link></p> : (
              <ul className="max-h-72 space-y-2 overflow-auto text-sm">
                {completedList.map(([k, d]) => <li key={k} className="flex justify-between gap-2"><span className="truncate">{lessonTitle(k) ?? k}</span><span className="shrink-0 text-xs text-muted-foreground">{new Date(d).toLocaleDateString()}</span></li>)}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-5 w-5 text-primary" aria-hidden="true" /> Quiz history</CardTitle></CardHeader>
          <CardContent>
            {quizHistory.length === 0 ? <p className="text-sm text-muted-foreground">No quizzes taken yet.</p> : (
              <ul className="max-h-72 space-y-2 overflow-auto text-sm">
                {quizHistory.map((q) => <li key={q.id} className="flex justify-between gap-2"><span>{new Date(q.date).toLocaleDateString()} · {q.difficulty}</span><span className="font-bold tabular">{q.correct}/{q.total} ({q.percentage}%)</span></li>)}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Route className="h-5 w-5 text-primary" aria-hidden="true" /> Saved dive plans</CardTitle></CardHeader>
          <CardContent>
            {plans.length === 0 ? <p className="text-sm text-muted-foreground">No saved plans. <Link className="font-semibold text-primary hover:underline" to="/planner">Plan a dive</Link></p> : (
              <ul className="max-h-72 space-y-2 overflow-auto text-sm">
                {plans.map((p) => <li key={p.id}><Link to={`/planner?plan=${p.id}`} className="flex justify-between gap-2 rounded-lg hover:text-primary"><span className="truncate font-medium">{p.input.site}</span><span className="shrink-0 text-xs text-muted-foreground">{formatDepth(p.input.maxDepth, units)} · {p.input.bottomTime} min</span></Link></li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
