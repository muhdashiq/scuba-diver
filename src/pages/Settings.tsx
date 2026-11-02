import { Download, Info, Lightbulb, RotateCcw, ShieldCheck, Sparkles, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { SegmentedControl } from '@/components/ui/segmented';
import { useAppStore } from '@/store/useAppStore';
import { confirm } from '@/lib/confirm';
import { toast } from '@/lib/toast';
import type { UnitSystem } from '@/types';

export default function Settings() {
  const units = useAppStore((s) => s.units);
  const setUnits = useAppStore((s) => s.setUnits);
  const resetAll = useAppStore((s) => s.resetAll);
  const restartOnboarding = useAppStore((s) => s.restartOnboarding);
  const tipsDismissed = useAppStore((s) => s.dismissedTips.length);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const s = useAppStore.getState();
    const data = { version: 1, exportedAt: new Date().toISOString(), profile: s.profile, units: s.units, completedLessons: s.completedLessons, quizHistory: s.quizHistory, checklist: s.checklist, savedPlans: s.savedPlans, favorites: s.favorites };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `scubadive-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported');
  };

  const importData = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      if (data?.version !== 1 || typeof data.profile !== 'object') throw new Error('That file isn’t a ScubaDive backup.');
      if (!(await confirm({ title: 'Restore this backup?', message: 'Your current profile, progress and plans will be replaced.', confirmLabel: 'Restore' }))) return;
      useAppStore.setState({
        profile: data.profile,
        units: data.units === 'imperial' ? 'imperial' : 'metric',
        completedLessons: data.completedLessons ?? {},
        quizHistory: Array.isArray(data.quizHistory) ? data.quizHistory : [],
        checklist: data.checklist ?? {},
        savedPlans: Array.isArray(data.savedPlans) ? data.savedPlans : [],
        favorites: data.favorites ?? {},
        onboarded: true,
      });
      toast.success('Backup restored');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const reset = async () => {
    if (!(await confirm({ title: 'Erase all data?', message: 'Your profile, progress, quiz history, checklist, plans and favourites will be permanently deleted from this device.', confirmLabel: 'Erase All Data', destructive: true }))) return;
    resetAll();
    toast('All data erased');
  };

  return (
    <>
      <ScreenHeader back={{ to: '/profile', label: 'Profile' }} title="Settings" />
      <div className="space-y-8">
        <section className="space-y-2">
          <h2 className="px-4 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Appearance</h2>
          <ThemeToggle />
          <p className="px-4 text-footnote text-muted-foreground">Auto follows your device’s light or dark setting.</p>
        </section>

        <section className="space-y-2">
          <h2 className="px-4 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Units</h2>
          <SegmentedControl<UnitSystem> label="Units" value={units} onChange={(u) => { setUnits(u); toast.success(u === 'metric' ? 'Using metres, bar and °C' : 'Using feet, psi and °F'); }} options={[{ value: 'metric', label: 'Metric' }, { value: 'imperial', label: 'Imperial' }]} />
          <p className="px-4 text-footnote text-muted-foreground">{units === 'metric' ? 'Metres · bar · °C · km/h · litres' : 'Feet · psi · °F · mph · cubic feet'}</p>
        </section>

        <ListGroup title="Help">
          <ListRow onClick={() => restartOnboarding()} leading={<IconTile icon={Sparkles} color="bg-primary" />} title="Show Welcome Tour" chevron />
          <ListRow onClick={() => { useAppStore.setState({ dismissedTips: [] }); toast.success('Tips will show again'); }} leading={<IconTile icon={Lightbulb} color="bg-[#FFCC00]" />} title="Reset Tips" value={tipsDismissed ? `${tipsDismissed} hidden` : undefined} chevron />
        </ListGroup>

        <ListGroup title="Your data" footer="Everything is stored locally in this browser. Nothing is sent to a server. Export a backup to move to another device.">
          <ListRow onClick={exportData} leading={<IconTile icon={Download} color="bg-[#34C759]" />} title="Export Backup" chevron />
          <ListRow onClick={() => fileRef.current?.click()} leading={<IconTile icon={Upload} color="bg-[#32ADE6]" />} title="Import Backup" chevron />
          <ListRow onClick={reset} leading={<IconTile icon={Trash2} color="bg-[#FF3B30]" />} title="Erase All Data" destructive />
        </ListGroup>
        <input ref={fileRef} type="file" accept="application/json" className="sr-only" tabIndex={-1} aria-label="Choose backup file" onChange={(e) => { const f = e.target.files?.[0]; if (f) importData(f); e.target.value = ''; }} />

        <ListGroup title="About">
          <ListRow leading={<IconTile icon={ShieldCheck} color="bg-[#FF9500]" />} title="Safety" subtitle="ScubaDive is educational. It doesn’t replace training by a qualified instructor, a dive computer, or your training agency’s procedures." />
          <ListRow leading={<IconTile icon={Info} color="bg-[#8E8E93]" />} title="Data sources" subtitle="Weather: Open-Meteo (CC BY 4.0) · Maps & dive shops: © OpenStreetMap contributors" />
          <ListRow leading={<IconTile icon={RotateCcw} color="bg-[#5856D6]" />} title="Version" value="2.0" />
        </ListGroup>
      </div>
    </>
  );
}
