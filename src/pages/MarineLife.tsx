import { Gamepad2, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { MarineEntry, MarineGroup } from '@/types';
import { ScreenHeader, BarButton } from '@/components/common/ScreenHeader';
import { SearchField } from '@/components/common/SearchField';
import { FavoriteButton, ShareButton } from '@/components/common/ActionButtons';
import { MarineArt } from '@/components/illustrations/MarineArt';
import { EmptyState } from '@/components/common/States';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IUCN_LABELS, MARINE_GROUPS, MARINE_LIFE } from '@/data/marineLife';
import { shuffleArray } from '@/utils/quizEngine';
import { cn } from '@/lib/utils';

const IUCN_TONE: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = { LC: 'success', NT: 'warning', VU: 'warning', EN: 'destructive', CR: 'destructive', DD: 'secondary', NE: 'secondary' };

export default function MarineLife() {
  const [group, setGroup] = useState<MarineGroup | 'all'>('all');
  const [query, setQuery] = useState('');
  const [params, setParams] = useSearchParams();
  const [quiz, setQuiz] = useState(false);
  const open = MARINE_LIFE.find((m) => m.id === params.get('entry')) ?? null;
  const setOpen = (m: MarineEntry | null) => setParams(m ? { entry: m.id } : {}, { replace: true });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARINE_LIFE.filter((m) => (group === 'all' || m.group === group) && (!q || `${m.commonName} ${m.scientificName ?? ''} ${m.habitat}`.toLowerCase().includes(q)));
  }, [group, query]);

  return (
    <>
      <ScreenHeader
        back={{ to: '/explore', label: 'Explore' }}
        title="Marine Life"
        subtitle={`${MARINE_LIFE.length} species, habitats and wrecks`}
        actions={<BarButton label="Identification quiz" onClick={() => setQuiz(true)}><Gamepad2 aria-hidden="true" /></BarButton>}
      >
        <SearchField value={query} onChange={setQuery} placeholder="Search species" />
      </ScreenHeader>

      <div className="space-y-5">
        <div role="group" aria-label="Filter by group" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: 'all' as const, label: 'All' }, ...MARINE_GROUPS].map((g) => (
            <button key={g.id} type="button" aria-pressed={group === g.id} onClick={() => setGroup(g.id)} className={cn('h-8 shrink-0 rounded-full px-3.5 text-subhead font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', group === g.id ? 'bg-foreground text-background' : 'bg-card hover:bg-accent')}>
              {g.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState title="No matches" message="Try another name or group." action={<Button variant="tinted" size="sm" onClick={() => { setQuery(''); setGroup('all'); }}>Clear Filters</Button>} />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((m) => (
              <motion.li key={m.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button type="button" onClick={() => setOpen(m)} className="pressable group block w-full overflow-hidden rounded-2xl bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <MarineArt art={m.art} palette={m.palette} className="block aspect-[4/3] w-full" />
                  <div className="space-y-0.5 px-3 py-2.5">
                    <p className="truncate text-subhead font-semibold">{m.commonName}</p>
                    <p className="truncate text-footnote italic text-muted-foreground">{m.scientificName ?? MARINE_GROUPS.find((g) => g.id === m.group)?.label}</p>
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        )}
        <p className="px-1 text-footnote text-muted-foreground">Original, stylised artwork for learning. Conservation statuses reflect the IUCN Red List when written — check iucnredlist.org for updates.</p>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-xl">
          {open && (
            <div className="space-y-5">
              <MarineArt art={open.art} palette={open.palette} className="block aspect-[16/9] w-full rounded-2xl" label={`Illustration of ${open.commonName}`} />
              <div className="flex items-start justify-between gap-3">
                <DialogHeader className="pr-0">
                  <DialogTitle className="text-title2">{open.commonName}</DialogTitle>
                  <DialogDescription className="italic">{open.scientificName ?? MARINE_GROUPS.find((g) => g.id === open.group)?.label}</DialogDescription>
                </DialogHeader>
                <div className="-mr-2 flex shrink-0">
                  <FavoriteButton item={{ id: `marine:${open.id}`, kind: 'marine', title: open.commonName, subtitle: open.scientificName, to: `/marine-life?entry=${open.id}` }} />
                  <ShareButton title={open.commonName} text={`${open.commonName}${open.scientificName ? ` (${open.scientificName})` : ''} — ScubaDive marine life guide`} route={`/marine-life?entry=${open.id}`} />
                </div>
              </div>
              {open.iucn && <Badge variant={IUCN_TONE[open.iucn]}>IUCN: {IUCN_LABELS[open.iucn]}</Badge>}
              <Detail title="Habitat"><p>{open.habitat}</p></Detail>
              <Detail title="How to identify"><ul className="space-y-1">{open.identification.map((i) => <li key={i}>• {i}</li>)}</ul></Detail>
              <Detail title={<><Sparkles className="h-4 w-4 text-[#FF9F0A]" aria-hidden="true" /> Did you know?</>}><ul className="space-y-1">{open.facts.map((f) => <li key={f}>• {f}</li>)}</ul></Detail>
              <div className="rounded-2xl bg-success/[0.08] p-4">
                <p className="mb-1 flex items-center gap-1.5 text-subhead font-semibold"><ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" /> Conservation</p>
                <p className="text-subhead text-muted-foreground">{open.conservation}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={quiz} onOpenChange={setQuiz}>
        <DialogContent>{quiz && <IdQuiz onClose={() => setQuiz(false)} />}</DialogContent>
      </Dialog>
    </>
  );
}

function Detail({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-1">
      <h3 className="flex items-center gap-1.5 text-subhead font-semibold">{title}</h3>
      <div className="text-subhead text-muted-foreground">{children}</div>
    </section>
  );
}

/** Image-based identification quiz built from the library. */
function IdQuiz({ onClose }: { onClose: () => void }) {
  const species = useMemo(() => MARINE_LIFE.filter((m) => m.group !== 'wrecks' && m.group !== 'environments'), []);
  const rounds = useMemo(() => shuffleArray(species).slice(0, 8).map((answer) => ({ answer, options: shuffleArray([answer, ...shuffleArray(species.filter((s) => s.id !== answer.id && s.art !== answer.art)).slice(0, 3)]) })), [species]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const r = rounds[i];

  if (i >= rounds.length) {
    return (
      <div className="space-y-4 py-4 text-center">
        <DialogTitle className="text-title1">{score}/{rounds.length}</DialogTitle>
        <DialogDescription>{score >= 6 ? 'Great spotting — you know your reef!' : 'Nice try. Browse the library and have another go.'}</DialogDescription>
        <Button className="w-full" onClick={onClose}>Done</Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>What’s this?</DialogTitle>
        <DialogDescription>Question {i + 1} of {rounds.length} · {score} correct</DialogDescription>
      </DialogHeader>
      <Progress value={(i / rounds.length) * 100} aria-label="Quiz progress" />
      <MarineArt art={r.answer.art} palette={r.answer.palette} className="block aspect-[16/9] w-full rounded-2xl" label="Identify this species" />
      <div className="grid gap-2">
        {r.options.map((o) => {
          const correct = o.id === r.answer.id;
          return (
            <button key={o.id} type="button" disabled={!!picked} onClick={() => { setPicked(o.id); if (correct) setScore((s) => s + 1); }}
              className={cn('min-h-12 rounded-xl bg-card px-4 text-left text-callout transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', !picked && 'hover:bg-accent', picked && correct && 'bg-success/12 ring-2 ring-success/60', picked === o.id && !correct && 'bg-destructive/12 ring-2 ring-destructive/60', picked && !correct && picked !== o.id && 'opacity-50')}>
              {o.commonName}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="space-y-3" role="status">
          <p className="text-subhead text-muted-foreground"><strong className="text-foreground">{r.answer.commonName}:</strong> {r.answer.identification.join('; ')}.</p>
          <Button className="w-full" onClick={() => { setPicked(null); setI((n) => n + 1); }} autoFocus>{i + 1 === rounds.length ? 'See Score' : 'Next'}</Button>
        </div>
      )}
    </div>
  );
}
