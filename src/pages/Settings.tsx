import { Database, Download, Palette, Ruler, Settings as SettingsIcon, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useTheme } from '@/components/common/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { UnitSystem } from '@/types';

export default function Settings() {
  const units = useAppStore((s) => s.units);
  const setUnits = useAppStore((s) => s.setUnits);
  const resetAll = useAppStore((s) => s.resetAll);
  const { theme, resolvedTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const exportData = () => {
    const s = useAppStore.getState();
    const data = { version: 1, exportedAt: new Date().toISOString(), profile: s.profile, units: s.units, completedLessons: s.completedLessons, quizHistory: s.quizHistory, checklist: s.checklist, savedPlans: s.savedPlans };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `scubadive-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      if (data?.version !== 1 || typeof data.profile !== 'object') throw new Error('Unrecognised backup file.');
      useAppStore.setState({
        profile: data.profile,
        units: data.units === 'imperial' ? 'imperial' : 'metric',
        completedLessons: data.completedLessons ?? {},
        quizHistory: Array.isArray(data.quizHistory) ? data.quizHistory : [],
        checklist: data.checklist ?? {},
        savedPlans: Array.isArray(data.savedPlans) ? data.savedPlans : [],
      });
      setMsg({ ok: true, text: 'Backup restored.' });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Import failed.' });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={SettingsIcon} eyebrow="Account" title="Settings" description="Appearance, units and your data." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Palette className="h-5 w-5 text-primary" aria-hidden="true" /> Theme</CardTitle>
            <CardDescription>System follows your device setting automatically. Currently showing: <strong className="capitalize">{resolvedTheme}</strong>.</CardDescription>
          </CardHeader>
          <CardContent><ThemeToggle showLabels className="w-full justify-between [&>button]:flex-1" /><p className="mt-2 text-xs text-muted-foreground">Saved preference: <span className="capitalize">{theme}</span></p></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Ruler className="h-5 w-5 text-primary" aria-hidden="true" /> Units</CardTitle>
            <CardDescription>Depth, pressure, temperature, speed and gas volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div role="radiogroup" aria-label="Unit system" className="grid grid-cols-2 gap-2">
              {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
                <button key={u} type="button" role="radio" aria-checked={units === u} onClick={() => setUnits(u)} className={cn('rounded-xl border-2 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', units === u ? 'border-primary bg-primary/5' : 'hover:bg-accent')}>
                  <p className="font-bold capitalize">{u}</p>
                  <p className="text-xs text-muted-foreground">{u === 'metric' ? 'm · bar · °C · km/h · L' : 'ft · psi · °F · mph · cu ft'}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Database className="h-5 w-5 text-primary" aria-hidden="true" /> Your data</CardTitle>
            <CardDescription>Everything is stored locally in this browser (LocalStorage). Nothing is sent to a server. Export a backup to move devices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportData}><Download /> Export backup</Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload /> Import backup</Button>
              <input ref={fileRef} type="file" accept="application/json" className="sr-only" aria-label="Choose backup file" onChange={(e) => { const f = e.target.files?.[0]; if (f) importData(f); e.target.value = ''; }} />
              <Button variant="destructive" onClick={() => window.confirm('Delete your profile, progress, quiz history, checklist and saved plans from this device?') && resetAll()}><Trash2 /> Reset all data</Button>
            </div>
            {msg && <p className={cn('text-sm font-medium', msg.ok ? 'text-success' : 'text-destructive')} role="status">{msg.text}</p>}
            <Alert variant="info" title="Ready for cloud sync">The storage layer is abstracted behind an adapter so it can be connected to Supabase (or another backend) with authentication in a future release.</Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
