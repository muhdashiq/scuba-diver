import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CertificationLevel, ExperienceLevel, UserProfile } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormSection, SelectRow, TextRow } from '@/components/dive-planner/Field';
import { useAppStore } from '@/store/useAppStore';
import { CERTIFICATION_LABELS } from '@/utils/divePlanner';
import { toast } from '@/lib/toast';
import { Avatar } from './Avatar';

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = { novice: 'Novice', intermediate: 'Intermediate', experienced: 'Experienced', professional: 'Professional' };

export function EditProfileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const profile = useAppStore((s) => s.profile);
  const update = useAppStore((s) => s.updateProfile);
  const [form, setForm] = useState<UserProfile>(profile);
  const [loc, setLoc] = useState('');
  useEffect(() => {
    if (open) setForm(profile);
  }, [open, profile]);

  const save = () => {
    update({ ...form, name: form.name.trim(), agency: form.agency.trim(), completedDives: Math.max(0, Math.round(form.completedDives || 0)) });
    toast.success('Profile updated');
    onOpenChange(false);
  };
  const addLoc = () => {
    const v = loc.trim();
    if (v && !form.preferredLocations.includes(v)) setForm({ ...form, preferredLocations: [...form.preferredLocations, v] });
    setLoc('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose>
        <div className="-mx-1 flex items-center justify-between pb-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <DialogHeader className="pr-0 text-center">
            <DialogTitle className="text-headline">Edit Profile</DialogTitle>
            <DialogDescription className="sr-only">Update your diver details</DialogDescription>
          </DialogHeader>
          <Button variant="ghost" size="sm" className="font-semibold" onClick={save}>Done</Button>
        </div>
        <div className="space-y-6 pt-2">
          <div className="flex justify-center"><Avatar name={form.name} size={80} /></div>
          <FormSection>
            <TextRow label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" />
            <TextRow label="Agency" value={form.agency} onChange={(v) => setForm({ ...form, agency: v })} placeholder="PADI, SSI, BSAC…" />
          </FormSection>
          <FormSection title="Diving">
            <SelectRow<CertificationLevel> label="Certification" value={form.certification} onChange={(v) => setForm({ ...form, certification: v })} options={(Object.entries(CERTIFICATION_LABELS) as [CertificationLevel, string][]).map(([value, label]) => ({ value, label }))} />
            <SelectRow<ExperienceLevel> label="Experience" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} options={(Object.entries(EXPERIENCE_LABELS) as [ExperienceLevel, string][]).map(([value, label]) => ({ value, label }))} />
            <div className="relative flex items-center justify-between px-4 py-2">
              <span className="text-body" id="dives-label">Logged dives</span>
              <div className="flex items-center gap-1 rounded-lg bg-fill p-0.5" role="group" aria-labelledby="dives-label">
                <button type="button" aria-label="Decrease dives" onClick={() => setForm({ ...form, completedDives: Math.max(0, form.completedDives - 1) })} className="flex h-8 w-10 items-center justify-center rounded-md hover:bg-accent"><Minus className="h-4 w-4" /></button>
                <input aria-label="Logged dives" inputMode="numeric" value={form.completedDives} onChange={(e) => setForm({ ...form, completedDives: Number(e.target.value.replace(/\D/g, '')) || 0 })} className="w-12 bg-transparent text-center text-body tabular focus:outline-none" />
                <button type="button" aria-label="Increase dives" onClick={() => setForm({ ...form, completedDives: form.completedDives + 1 })} className="flex h-8 w-10 items-center justify-center rounded-md hover:bg-accent"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </FormSection>
          <FormSection title="Favourite destinations">
            {form.preferredLocations.map((l) => (
              <div key={l} className="relative flex items-center justify-between px-4 py-2.5">
                <span className="text-body">{l}</span>
                <button type="button" aria-label={`Remove ${l}`} onClick={() => setForm({ ...form, preferredLocations: form.preferredLocations.filter((x) => x !== l) })} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="relative flex items-center gap-2 px-4 py-1.5">
              <input value={loc} onChange={(e) => setLoc(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLoc(); } }} placeholder="Add destination" aria-label="Add destination" className="h-9 flex-1 bg-transparent text-body placeholder:text-muted-foreground/70 focus:outline-none" />
              <Button variant="ghost" size="sm" onClick={addLoc} disabled={!loc.trim()}>Add</Button>
            </div>
          </FormSection>
        </div>
      </DialogContent>
    </Dialog>
  );
}
