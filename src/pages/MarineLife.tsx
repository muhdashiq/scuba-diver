import { BrainCircuit, Fish, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MarineEntry, MarineGroup } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { MarineArt } from '@/components/illustrations/MarineArt';
import { EmptyState } from '@/components/common/States';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IUCN_LABELS, MARINE_GROUPS, MARINE_LIFE } from '@/data/marineLife';
import { shuffleArray } from '@/utils/quizEngine';
import { cn } from '@/lib/utils';

const IUCN_TONE: Record<string, string> = { LC: 'success', NT: 'warning', VU: 'warning', EN: 'destructive', CR: 'destructive', DD: 'secondary', NE: 'secondary' };

export default function MarineLife() {
  const [group, setGroup] = useState<MarineGroup | 'all'>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<MarineEntry | null>(null);
  const [quiz, setQuiz] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARINE_LIFE.filter((m) => (group === 'all' || m.group === group) && (!q || `${m.commonName} ${m.scientificName ?? ''} ${m.habitat}`.toLowerCase().includes(q)));
  }, [group, query]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Fish} eyebrow="Visual library" title="Marine Life Library" description="Learn to recognise reef fish, sharks and rays, turtles, corals, critters, wrecks and underwater environments." actions={<Button variant="ocean" onClick={() => setQuiz(true)}><BrainCircuit /> ID quiz</Button>} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search species…" className="pl-9" aria-label="Search marine life" />
        </div>
        <div role="group" aria-label="Filter by group" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[{ id: 'all' as const, label: 'All' }, ...MARINE_GROUPS].map((g) => (
            <button key={g.id} type="button" aria-pressed={group === g.id} onClick={() => setGroup(g.id)} className={cn('min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', group === g.id ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent')}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Fish} title="No matches" message="Try another search or group." />
      ) : (
        <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {list.map((m) => (
              <motion.li key={m.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                <button type="button" onClick={() => setOpen(m)} className="group block h-full w-full overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="overflow-hidden">
                    <MarineArt art={m.art} palette={m.palette} className="block aspect-[10/7] w-full transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="font-bold leading-tight group-hover:text-primary">{m.commonName}</p>
                    {m.scientificName && <p className="truncate text-xs italic text-muted-foreground">{m.scientificName}</p>}
                    {m.iucn && <Badge variant={IUCN_TONE[m.iucn] as 'success'} className="mt-1">IUCN: {IUCN_LABELS[m.iucn]}</Badge>}
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <p className="text-xs text-muted-foreground">All artwork is original and stylised for learning. Scientific names are shown only for specific species; conservation statuses reflect the IUCN Red List at the time of writing — check iucnredlist.org for updates.</p>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl p-0">
          {open && (
            <div>
              <MarineArt art={open.art} palette={open.palette} className="block aspect-[10/5] w-full rounded-t-2xl" label={`Illustration of ${open.commonName}`} />
              <div className="space-y-4 p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{open.commonName}</DialogTitle>
                  <DialogDescription className="italic">{open.scientificName ?? MARINE_GROUPS.find((g) => g.id === open.group)?.label}</DialogDescription>
                </DialogHeader>
                <div className="space-y-1"><h3 className="text-sm font-bold">Habitat</h3><p className="text-sm text-muted-foreground">{open.habitat}</p></div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold">Identification</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">{open.identification.map((i) => <li key={i}>• {i}</li>)}</ul>
                </div>
                <div className="space-y-1">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold"><Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" /> Interesting facts</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">{open.facts.map((f) => <li key={f}>• {f}</li>)}</ul>
                </div>
                <div className="rounded-xl bg-success/10 p-3 text-sm">
                  <p className="mb-1 flex items-center gap-1.5 font-bold"><ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" /> Conservation {open.iucn && <Badge variant={IUCN_TONE[open.iucn] as 'success'}>IUCN: {IUCN_LABELS[open.iucn]}</Badge>}</p>
                  <p className="text-muted-foreground">{open.conservation}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={quiz} onOpenChange={setQuiz}>
        <DialogContent className="max-w-xl">{quiz && <IdQuiz onClose={() => setQuiz(false)} />}</DialogContent>
      </Dialog>
    </div>
  );
}

/** Image-based identification quiz built from the library entries. */
function IdQuiz({ onClose }: { onClose: () => void }) {
  const species = useMemo(() => MARINE_LIFE.filter((m) => m.group !== 'wrecks' && m.group !== 'environments'), []);
  const rounds = useMemo(() => shuffleArray(species).slice(0, 8).map((answer) => ({ answer, options: shuffleArray([answer, ...shuffleArray(species.filter((s) => s.id !== answer.id && s.art !== answer.art)).slice(0, 3)]) })), [species]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= rounds.length;
  const r = rounds[i];

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <DialogTitle className="text-2xl">ID quiz complete</DialogTitle>
        <DialogDescription>You identified {score} of {rounds.length} correctly.</DialogDescription>
        <div className="flex justify-center gap-2"><Button onClick={onClose} variant="outline"><X /> Close</Button></div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Identify this {r.answer.group === 'coral' ? 'coral' : 'animal'}</DialogTitle>
        <DialogDescription>Question {i + 1} of {rounds.length} · Score {score}</DialogDescription>
      </DialogHeader>
      <MarineArt art={r.answer.art} palette={r.answer.palette} className="block aspect-[10/6] w-full rounded-2xl" label="Identify this species" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {r.options.map((o) => {
          const correct = o.id === r.answer.id;
          return (
            <button key={o.id} type="button" disabled={!!picked} onClick={() => { setPicked(o.id); if (correct) setScore((s) => s + 1); }}
              className={cn('min-h-11 rounded-xl border-2 px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', !picked && 'hover:border-primary', picked && correct && 'border-success bg-success/10', picked === o.id && !correct && 'border-destructive bg-destructive/10')}>
              {o.commonName}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="space-y-3" role="status">
          <p className="text-sm text-muted-foreground"><strong className="text-foreground">{r.answer.commonName}:</strong> {r.answer.identification.join('; ')}.</p>
          <Button onClick={() => { setPicked(null); setI((n) => n + 1); }} autoFocus>{i + 1 === rounds.length ? 'Finish' : 'Next'}</Button>
        </div>
      )}
    </div>
  );
}
