import { List, LocateFixed, Map as MapIcon, MapPin, Search, Store } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DiveShop } from '@/types';
import { ScreenHeader, BarButton } from '@/components/common/ScreenHeader';
import { EmptyState, ErrorState, ListSkeleton } from '@/components/common/States';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { PullToRefresh } from '@/components/common/PullToRefresh';
import { ShopSheet } from '@/components/dive-shops/ShopSheet';
import { WhatsAppDialog } from '@/components/dive-shops/WhatsAppDialog';
import { LocationSheet } from '@/components/weather/LocationSheet';
import { SegmentedControl } from '@/components/ui/segmented';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useDiveShops } from '@/hooks/useDiveShops';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { errorMessage } from '@/services/http';
import { formatDistance } from '@/utils/geo';
import { cn } from '@/lib/utils';

const MapView = lazy(() => import('@/components/common/MapView').then((m) => ({ default: m.MapView })));

export default function DiveShops() {
  const location = useAppStore((s) => s.lastLocation);
  const setLocation = useAppStore((s) => s.setLastLocation);
  const [params, setParams] = useSearchParams();
  const [radius, setRadius] = useState(25);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [onlyWhatsApp, setOnlyWhatsApp] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [waShop, setWaShop] = useState<DiveShop | null>(null);
  const geo = useCurrentLocation();
  const shops = useDiveShops(location, radius);

  const list = useMemo(() => (shops.data ?? []).filter((s) => !onlyWhatsApp || s.whatsapp), [shops.data, onlyWhatsApp]);
  const selectedId = params.get('shop');
  const selected = (shops.data ?? []).find((s) => s.id === selectedId) ?? null;
  const select = (id: string | null) => setParams(id ? { shop: id } : {}, { replace: true });

  useEffect(() => {
    if (selectedId && shops.data && !selected) select(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops.data]);

  const markers = useMemo(
    () => [
      ...(location ? [{ id: 'me', latitude: location.latitude, longitude: location.longitude, label: location.name, kind: 'user' as const }] : []),
      ...list.map((s) => ({ id: s.id, latitude: s.latitude, longitude: s.longitude, label: s.name, kind: 'shop' as const, active: s.id === selectedId })),
    ],
    [list, location, selectedId],
  );

  const useMine = async () => {
    const l = await geo.locate();
    if (l) setLocation(l);
  };

  return (
    <PullToRefresh onRefresh={() => shops.refetch()}>
      <ScreenHeader
        back={{ to: '/explore', label: 'Explore' }}
        title="Dive Shops"
        subtitle={location ? <button type="button" onClick={() => setSheet(true)} className="flex items-center gap-1 text-primary"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Near {location.name} · {radius} km</button> : 'Find dive centres near you or your destination.'}
        actions={location ? <BarButton label="Change location" onClick={() => setSheet(true)}><Search aria-hidden="true" /></BarButton> : undefined}
      >
        {location && <SegmentedControl label="View" value={view} onChange={setView} options={[{ value: 'list', label: <><List /> List</> }, { value: 'map', label: <><MapIcon /> Map</> }]} />}
      </ScreenHeader>

      {!location && (
        <EmptyState
          icon={Store}
          title="Find dive centres nearby"
          message="Share your location or search a destination. We’ll show dive shops listed on OpenStreetMap."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={useMine} disabled={geo.loading}><LocateFixed /> Use My Location</Button>
              <Button variant="tinted" onClick={() => setSheet(true)}>Search a Place</Button>
            </div>
          }
        />
      )}
      {geo.error && !location && <p className="mt-3 text-center text-footnote text-destructive" role="alert">{geo.error}</p>}

      {location && (
        <div className="space-y-5">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filters">
            {[5, 10, 25, 50].map((r) => (
              <button key={r} type="button" aria-pressed={radius === r} onClick={() => setRadius(r)} className={cn('h-8 shrink-0 rounded-full px-3.5 text-subhead font-medium transition-colors', radius === r ? 'bg-foreground text-background' : 'bg-card hover:bg-accent')}>{r} km</button>
            ))}
            <button type="button" aria-pressed={onlyWhatsApp} onClick={() => setOnlyWhatsApp((v) => !v)} className={cn('h-8 shrink-0 rounded-full px-3.5 text-subhead font-medium transition-colors', onlyWhatsApp ? 'bg-[#1f9e55] text-white' : 'bg-card hover:bg-accent')}>WhatsApp</button>
          </div>

          {shops.status === 'error' && !shops.data && <ErrorState title="Couldn’t load dive shops" message={errorMessage(shops.error)} onRetry={shops.refetch} />}

          {view === 'map' && (shops.data || shops.status === 'loading') && (
            <Suspense fallback={<Skeleton className="h-[60vh] w-full rounded-2xl" />}>
              <MapView center={location} zoom={11} markers={markers} onMarkerClick={(id) => id !== 'me' && select(id)} radiusKm={radius} fit={list.length > 0} className="h-[60vh]" ariaLabel="Map of nearby dive shops" />
            </Suspense>
          )}

          {view === 'list' && (
            <>
              {shops.status === 'loading' && !shops.data && <ListSkeleton rows={5} />}
              {shops.data && list.length === 0 && <EmptyState icon={Store} title="No dive shops found" message={`Nothing listed within ${radius} km${onlyWhatsApp ? ' with a WhatsApp number' : ''}. Try a larger radius.`} action={radius < 50 ? <Button variant="tinted" onClick={() => setRadius(50)}>Search 50 km</Button> : undefined} />}
              {list.length > 0 && (
                <ListGroup footer="Listings come from OpenStreetMap and may be incomplete or out of date. Inclusion isn’t an endorsement — check credentials and reviews before booking." aria-live="polite">
                  {list.map((s) => (
                    <ListRow key={s.id} onClick={() => select(s.id)} chevron leading={<IconTile icon={Store} color="bg-[#FF9500]" />} title={s.name} subtitle={s.address ?? s.tags.join(' · ')} value={formatDistance(s.distanceKm)} />
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </div>
      )}

      <ShopSheet shop={selected} onOpenChange={(o) => !o && select(null)} onWhatsApp={(s) => { select(null); setWaShop(s); }} />
      <WhatsAppDialog shop={waShop} open={!!waShop} onOpenChange={(o) => !o && setWaShop(null)} />
      <LocationSheet open={sheet} onOpenChange={setSheet} current={location} onSelect={setLocation} title="Search near" />
    </PullToRefresh>
  );
}
