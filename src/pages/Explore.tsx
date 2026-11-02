import { Fish, Heart, Search, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SearchField } from '@/components/common/SearchField';
import { ListGroup, ListRow, IconTile, SeeAll } from '@/components/common/List';
import { EmptyState } from '@/components/common/States';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { MarineArt } from '@/components/illustrations/MarineArt';
import { useAppStore } from '@/store/useAppStore';
import { searchContent, type SearchResult } from '@/utils/search';
import { MARINE_LIFE } from '@/data/marineLife';
import { Link } from 'react-router-dom';

const SUGGESTIONS = ['Buoyancy', 'Nitrox', 'Turtle', 'Navigation', 'Wreck', 'Equalisation'];

export default function Explore() {
  const [query, setQuery] = useState('');
  const favorites = useAppStore((s) => s.favorites);
  const results = useMemo(() => searchContent(query), [query]);
  const favs = Object.values(favorites).sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 4);
  const groups = ['Lessons', 'Specialties', 'Marine life'] as const;
  const featured = MARINE_LIFE.filter((m) => ['manta', 'green-turtle', 'clownfish', 'spanish-dancer'].includes(m.id));

  const thumb = (r: SearchResult) =>
    r.art ? <MarineArt art={r.art.key} palette={r.art.palette} className="h-10 w-14 shrink-0 rounded-lg" /> : r.illustration ? <LessonIllustration k={r.illustration} compact className="h-10 w-14 shrink-0 rounded-lg [&_svg]:h-full" /> : null;

  return (
    <>
      <ScreenHeader title="Explore" subtitle="Find dive centres, marine life and anything you’ve learned.">
        <SearchField value={query} onChange={setQuery} placeholder="Lessons, specialties, marine life" label="Search ScubaDive" />
      </ScreenHeader>

      {query.trim().length >= 2 ? (
        results.length === 0 ? (
          <EmptyState icon={Search} title={`No results for “${query.trim()}”`} message="Check the spelling or try a broader term." />
        ) : (
          <div className="space-y-6" aria-live="polite">
            {groups.map((g) => {
              const items = results.filter((r) => r.group === g);
              if (!items.length) return null;
              return (
                <ListGroup key={g} title={g}>
                  {items.map((r) => <ListRow key={r.id} to={r.to} leading={thumb(r)} separatorInset="5.5rem" title={r.title} subtitle={<span className="line-clamp-1">{r.subtitle}</span>} />)}
                </ListGroup>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2" aria-label="Suggested searches">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setQuery(s)} className="pressable flex h-8 items-center gap-1.5 rounded-full bg-card px-3 text-subhead hover:bg-accent">
                <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />{s}
              </button>
            ))}
          </div>

          <ListGroup>
            <ListRow to="/dive-shops" leading={<IconTile icon={Store} color="bg-[#FF9500]" size="lg" />} separatorInset="4.75rem" title="Dive Shops Nearby" subtitle="Map, contact details and WhatsApp" />
            <ListRow to="/marine-life" leading={<IconTile icon={Fish} color="bg-teal" size="lg" />} separatorInset="4.75rem" title="Marine Life" subtitle="Field guide with ID quiz" />
          </ListGroup>

          <section className="space-y-2">
            <div className="flex items-end justify-between px-1">
              <h2 className="text-title3">Marine life spotlight</h2>
              <SeeAll to="/marine-life" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featured.map((m) => (
                <Link key={m.id} to={`/marine-life?entry=${m.id}`} className="pressable group overflow-hidden rounded-2xl bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <MarineArt art={m.art} palette={m.palette} className="block aspect-[4/3] w-full" />
                  <p className="truncate px-3 py-2 text-subhead font-medium">{m.commonName}</p>
                </Link>
              ))}
            </div>
          </section>

          <ListGroup title="Favourites" action={favs.length ? <SeeAll to="/favorites" /> : undefined}>
            {favs.length === 0 ? (
              <ListRow leading={<IconTile icon={Heart} color="bg-[#FF2D55]" />} title="No favourites yet" subtitle="Tap the heart on lessons, species or dive shops to save them here." />
            ) : (
              favs.map((f) => <ListRow key={f.id} to={f.to} leading={<IconTile icon={Heart} color="bg-[#FF2D55]" />} title={f.title} subtitle={f.subtitle} />)
            )}
          </ListGroup>
        </div>
      )}
    </>
  );
}
