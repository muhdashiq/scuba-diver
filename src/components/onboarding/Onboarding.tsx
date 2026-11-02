import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Check, ChevronLeft, ClipboardCheck, Compass, Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented';
import { AppIcon } from '@/components/common/Logo';
import { useAppStore } from '@/store/useAppStore';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { CERTIFICATION_LABELS } from '@/utils/divePlanner';
import { toast } from '@/lib/toast';
import type { CertificationLevel, UnitSystem } from '@/types';
import { cn } from '@/lib/utils';

const FEATURES = [
  { icon: BookOpen, title: 'Learn at your pace', body: 'Visual lessons from Open Water to specialties, with quick quizzes.' },
  { icon: ClipboardCheck, title: 'Prepare every dive', body: 'Pre-dive checks and an educational planner you can share with your buddy.' },
  { icon: Compass, title: 'Explore nearby', body: 'Live conditions, local dive centres and a marine-life field guide.' },
];

const CERTS: CertificationLevel[] = ['none', 'open-water', 'advanced-open-water', 'rescue', 'divemaster', 'instructor'];

/** First-run experience: welcome → about you → location permission pre-prompt. */
export function Onboarding() {
  const [step, setStep] = useState(0);
  const profile = useAppStore((s) => s.profile);
  const units = useAppStore((s) => s.units);
  const update = useAppStore((s) => s.updateProfile);
  const setUnits = useAppStore((s) => s.setUnits);
  const setLocation = useAppStore((s) => s.setLastLocation);
  const finish = useAppStore((s) => s.completeOnboarding);
  const [name, setName] = useState(profile.name);
  const [cert, setCert] = useState<CertificationLevel>(profile.certification);
  const geo = useCurrentLocation();

  const done = (msg = 'You’re all set') => {
    finish();
    toast.success(msg);
  };

  const allowLocation = async () => {
    const l = await geo.locate();
    if (l) {
      setLocation(l);
      done(`Showing conditions near ${l.name}`);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="onb-title" className="fixed inset-0 z-[60] overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex h-11 items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="-ml-2 flex h-10 items-center text-body text-primary" aria-label="Back">
              <ChevronLeft className="h-7 w-7" strokeWidth={2.4} /> Back
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/30')} />
            ))}
          </div>
          {step < 2 ? (
            <button type="button" onClick={() => done()} className="text-body text-primary">
              Skip
            </button>
          ) : (
            <span className="w-10" />
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className="flex flex-1 flex-col">
            {step === 0 && (
              <>
                <div className="flex flex-1 flex-col justify-center py-8">
                  <AppIcon className="mb-6 h-20 w-20 self-center rounded-[1.375rem] shadow-lg" />
                  <h1 id="onb-title" className="text-center text-large-title">
                    Welcome to
                    <br />
                    <span className="text-primary">ScubaDive</span>
                  </h1>
                  <ul className="mt-10 space-y-7">
                    {FEATURES.map(({ icon: Icon, title, body }) => (
                      <li key={title} className="flex gap-4">
                        <Icon className="mt-0.5 h-8 w-8 shrink-0 text-primary" strokeWidth={1.8} aria-hidden="true" />
                        <div>
                          <p className="text-headline">{title}</p>
                          <p className="text-subhead text-muted-foreground">{body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mb-4 text-center text-footnote text-muted-foreground">ScubaDive is an educational companion. It doesn’t replace training, a dive computer or your dive professional.</p>
                <Button size="lg" className="w-full" onClick={() => setStep(1)}>Continue</Button>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex-1 space-y-6 py-6">
                  <div className="space-y-1">
                    <h1 id="onb-title" className="text-title1">About you</h1>
                    <p className="text-subhead text-muted-foreground">We use this to personalise your home screen and dive plans. It stays on this device.</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="onb-name" className="px-1 text-footnote font-medium uppercase tracking-wide text-muted-foreground">First name</label>
                    <Input id="onb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="given-name" maxLength={40} className="bg-card" />
                  </div>
                  <fieldset className="space-y-2">
                    <legend className="mb-2 px-1 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Certification</legend>
                    <ul className="list-group overflow-hidden rounded-2xl bg-card" role="radiogroup">
                      {CERTS.map((c) => (
                        <li key={c}>
                          <button type="button" role="radio" aria-checked={cert === c} onClick={() => setCert(c)} className="relative flex h-11 w-full items-center justify-between px-4 text-left text-body hover:bg-accent/60" style={{ '--sep-inset': '1rem' } as React.CSSProperties}>
                            {c === 'none' ? 'Not certified yet' : CERTIFICATION_LABELS[c]}
                            {cert === c && <Check className="h-5 w-5 text-primary" strokeWidth={2.6} aria-hidden="true" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                  <div className="space-y-2">
                    <p className="px-1 text-footnote font-medium uppercase tracking-wide text-muted-foreground">Units</p>
                    <SegmentedControl<UnitSystem> label="Units" value={units} onChange={setUnits} options={[{ value: 'metric', label: 'Metric (m, bar)' }, { value: 'imperial', label: 'Imperial (ft, psi)' }]} />
                  </div>
                </div>
                <Button size="lg" className="w-full" onClick={() => { update({ name: name.trim(), certification: cert }); setStep(2); }}>Continue</Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                  <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <MapPin className="h-10 w-10" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h1 id="onb-title" className="text-title1">See conditions near you</h1>
                  <p className="mt-2 max-w-xs text-body text-muted-foreground">Allow location to show live weather, sea conditions and dive centres nearby. Your location is only used to look these up.</p>
                  {geo.error && <p className="mt-4 text-subhead text-destructive" role="alert">{geo.error}</p>}
                </div>
                <div className="space-y-2">
                  <Button size="lg" className="w-full" onClick={allowLocation} disabled={geo.loading}>
                    {geo.loading ? <Loader2 className="animate-spin" /> : null} Allow Location
                  </Button>
                  <Button size="lg" variant="ghost" className="w-full" onClick={() => done()}>Not Now</Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
