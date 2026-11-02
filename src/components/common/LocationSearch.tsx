import { Loader2, LocateFixed, MapPin, Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { GeoLocation } from '@/types';
import { formatLocation, searchPlaces } from '@/services/locationService';
import { errorMessage } from '@/services/http';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Accessible place search (combobox) with an optional "use my location" button. */
export function LocationSearch({ onSelect, placeholder = 'Search a place', showLocate = true, label = 'Search location', className }: { onSelect: (l: GeoLocation) => void; placeholder?: string; showLocate?: boolean; label?: string; className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const geo = useCurrentLocation();
  const listId = useId();
  const inputId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await searchPlaces(q, controller.signal);
        setResults(r);
        setOpen(true);
        setActive(r.length ? 0 : -1);
      } catch (err) {
        if (!controller.signal.aborted) setError(errorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (l: GeoLocation) => {
    onSelect(l);
    setQuery(formatLocation(l));
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') setOpen(false);
  };

  const locate = async () => {
    const l = await geo.locate();
    if (l) choose(l);
  };

  return (
    <div ref={wrapRef} className={cn('space-y-2', className)}>
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={2.2} aria-hidden="true" />
          <input
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="h-10 w-full rounded-[0.625rem] bg-fill pl-9 pr-9 text-body placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            autoComplete="off"
          />
          {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-label="Searching" />}
          {open && results.length > 0 && (
            <ul id={listId} role="listbox" className="absolute z-50 mt-1.5 max-h-72 w-full overflow-auto rounded-xl bg-popover p-1 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-separator/60">
              {results.map((r, i) => (
                <li
                  key={`${r.latitude},${r.longitude},${i}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(r);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn('flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-body', i === active && 'bg-accent')}
                >
                  <MapPin className="h-[18px] w-[18px] shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{formatLocation(r)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {showLocate && (
          <Button type="button" variant="tinted" onClick={locate} disabled={geo.loading} aria-label="Use my current location" className="h-10 shrink-0 rounded-[0.625rem] px-3">
            {geo.loading ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            <span className="hidden sm:inline">Current Location</span>
          </Button>
        )}
      </div>
      {(error || geo.error) && <p className="text-footnote text-destructive" role="alert">{error ?? geo.error}</p>}
      {open && !loading && query.trim().length >= 2 && results.length === 0 && !error && <p className="text-footnote text-muted-foreground">No places found. Try a nearby town or region.</p>}
    </div>
  );
}
