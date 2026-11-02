import { AlertTriangle, CheckCircle2, ClipboardCheck, RotateCcw, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { ProgressRing } from '@/components/common/ProgressRing';
import { ChecklistCategoryCard } from '@/components/checklist/ChecklistCategoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress, READINESS_COPY } from '@/utils/checklist';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function DiveReadiness() {
  const state = useAppStore((s) => s.checklist);
  const updatedAt = useAppStore((s) => s.checklistUpdatedAt);
  const setItem = useAppStore((s) => s.setChecklistItem);
  const setItems = useAppStore((s) => s.setChecklistItems);
  const reset = useAppStore((s) => s.resetChecklist);
  const progress = computeChecklistProgress(CHECKLIST, state);
  const copy = READINESS_COPY[progress.status];
  const tone = progress.status === 'critical-outstanding' ? 'destructive' : progress.status === 'checklist-complete' ? 'success' : progress.status === 'in-progress' ? 'warning' : 'ocean';

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        eyebrow="Pre-dive"
        title="Dive Readiness"
        description="Work through personal, equipment, buddy and site checks before every dive. Your progress is saved on this device."
        actions={
          <ProgressRing value={progress.percent} tone="light" size={88} label={`Checklist ${progress.percent}% complete`}>
            <span className="text-lg font-extrabold tabular">{progress.percent}%</span>
            <span className="text-[10px] uppercase tracking-wide text-cyan-100">{progress.done}/{progress.total}</span>
          </ProgressRing>
        }
      />
      <SafetyNotice title="A checklist is not a clearance to dive">
        Completing this checklist does not mean you are medically fit or that conditions are safe. If you have any doubt about your health, consult a physician familiar with dive medicine. Anyone can call off a dive at any time.
      </SafetyNotice>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {CHECKLIST.map((cat, i) => (
            <ChecklistCategoryCard key={cat.id} index={i} category={cat} state={state} progress={progress.categories[i]} onToggle={setItem} onSetAll={setItems} />
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start" aria-label="Readiness summary">
          <Card className={cn('border-2', tone === 'destructive' && 'border-destructive/50', tone === 'success' && 'border-success/50', tone === 'warning' && 'border-warning/50')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {progress.status === 'checklist-complete' ? <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" /> : progress.status === 'critical-outstanding' ? <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" /> : <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />}
                {copy.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground" aria-live="polite">{copy.detail}</p>
              <ul className="space-y-2">
                {progress.categories.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span>{c.title}</span>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold tabular', c.percent === 100 ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground')}>{c.percent}%</span>
                  </li>
                ))}
              </ul>
              {progress.criticalOutstanding.length > 0 && (
                <div className="rounded-xl bg-destructive/10 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-destructive"><AlertTriangle className="h-4 w-4" aria-hidden="true" /> Critical items outstanding</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {progress.criticalOutstanding.slice(0, 8).map((i) => <li key={i.id}>• {i.label}</li>)}
                    {progress.criticalOutstanding.length > 8 && <li>…and {progress.criticalOutstanding.length - 8} more</li>}
                  </ul>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 border-t pt-3">
                <p className="text-xs text-muted-foreground">{updatedAt ? `Saved ${new Date(updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}` : 'Not started'}</p>
                <Button variant="outline" size="sm" onClick={() => window.confirm('Reset the checklist for a new dive?') && reset()}><RotateCcw /> New dive</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
