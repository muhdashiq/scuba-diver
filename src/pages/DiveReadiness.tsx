import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ProgressRing } from '@/components/common/ProgressRing';
import { TipCard } from '@/components/common/TipCard';
import { ChecklistSection } from '@/components/checklist/ChecklistSection';
import { Button } from '@/components/ui/button';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress, READINESS_COPY } from '@/utils/checklist';
import { useAppStore } from '@/store/useAppStore';
import { confirm } from '@/lib/confirm';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

export default function DiveReadiness() {
  const state = useAppStore((s) => s.checklist);
  const updatedAt = useAppStore((s) => s.checklistUpdatedAt);
  const setItem = useAppStore((s) => s.setChecklistItem);
  const setItems = useAppStore((s) => s.setChecklistItems);
  const reset = useAppStore((s) => s.resetChecklist);
  const progress = computeChecklistProgress(CHECKLIST, state);
  const copy = READINESS_COPY[progress.status];
  const tone = progress.status === 'critical-outstanding' ? 'warning' : progress.status === 'checklist-complete' ? 'success' : 'ocean';
  const StatusIcon = progress.status === 'checklist-complete' ? CheckCircle2 : progress.status === 'critical-outstanding' ? AlertTriangle : ShieldCheck;

  const newDive = async () => {
    if (!(await confirm({ title: 'Start a new checklist?', message: 'All ticks will be cleared for your next dive.', confirmLabel: 'Clear Checklist', destructive: true }))) return;
    const previous = state;
    reset();
    toast('Checklist cleared', { action: { label: 'Undo', onClick: () => setItems(Object.keys(previous).filter((k) => previous[k]), true) } });
  };

  return (
    <>
      <ScreenHeader
        back={{ to: '/dive', label: 'Dive' }}
        title="Readiness Check"
        actions={progress.done > 0 ? <Button variant="ghost" size="sm" onClick={newDive}>New Dive</Button> : undefined}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <section aria-live="polite" className="flex items-center gap-4 rounded-2xl bg-card p-4">
            <ProgressRing value={progress.percent} size={72} stroke={8} tone={tone} label={`${progress.percent}% reviewed`}>
              <span className="text-headline tabular">{progress.percent}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className={cn('flex items-center gap-1.5 text-headline', tone === 'warning' && 'text-warning', tone === 'success' && 'text-success')}>
                <StatusIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {copy.title}
              </p>
              <p className="text-subhead text-muted-foreground">{copy.detail}</p>
              {updatedAt && <p className="mt-1 text-footnote text-muted-foreground">Saved {new Date(updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>}
            </div>
          </section>

          <TipCard id="readiness-buddy" title="Do this with your buddy">
            Go through the buddy section together on the surface, fully kitted up. Anyone can call off a dive at any time.
          </TipCard>

          {CHECKLIST.map((cat, i) => (
            <ChecklistSection key={cat.id} category={cat} state={state} progress={progress.categories[i]} onToggle={setItem} onSetAll={setItems} />
          ))}

          <p className="px-4 text-footnote text-muted-foreground">
            This checklist is a memory aid. Completing it doesn’t mean you are medically fit or that conditions are safe. If in doubt about your health, consult a physician familiar with dive medicine.
          </p>
        </div>

        <aside className="hidden lg:block" aria-label="Progress by category">
          <div className="sticky top-16 space-y-1.5">
            <h2 className="px-4 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Overview</h2>
            <ul className="list-group overflow-hidden rounded-2xl bg-card">
              {progress.categories.map((c) => (
                <li key={c.id}>
                  <div className="relative flex items-center justify-between px-4 py-3 text-subhead">
                    <span>{c.title}</span>
                    <span className={cn('tabular', c.percent === 100 ? 'text-success' : 'text-muted-foreground')}>{c.done}/{c.total}</span>
                  </div>
                </li>
              ))}
            </ul>
            {progress.criticalOutstanding.length > 0 && <p className="px-4 pt-2 text-footnote text-warning">{progress.criticalOutstanding.length} critical item{progress.criticalOutstanding.length > 1 ? 's' : ''} outstanding</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
