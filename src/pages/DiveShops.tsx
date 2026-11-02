import { LayoutGrid, Map as MapIcon, Store } from 'lucide-react';
import { lazy, Suspense, useId, useMemo, useState } from 'react';
import type { DiveShop, GeoLocation } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';
import { LocationSearch } from '@/components/common/LocationSearch';
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/States';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { DiveShopCard } from '@/components/dive-shops/DiveShopCard';
import { WhatsAppDialog } from '@/components/dive-shops/WhatsAppDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { NativeSelect } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/useAppStore';
import { useDiveShops } from '@/hooks/useDiveShops';
import { errorMessage } from '@/services/http';
import { formatLocation } from '@/services/locationService';

const MapView = lazy(() => import('@/components/common/MapView').then((m) => ({ default: m.MapView })));

export default function DiveShops() {
  const location = useAppStore((s) => s.lastLocation);
  const setLocation = useAppStore((s) => s.setLastLocation);
  const [radius, setRadius] = useState(25);
  const [view, setView] = useState<'both' | 'map' | 'cards'>('both');
  const [selected, setSelected] = useState<string | null>(null);
  const [waShop, setWaShop] = useState<DiveShop | null>(null);
  const [onlyWhatsApp, setOnlyWhatsApp] = useState(false);
  const radiusId = useId();
  const shops = useDiveShops(location, radius);

  const list = useMemo(() => (shops.data ?? []).filter((s) => !onlyWhatsApp || s.whatsapp), [shops.data, onlyWhatsApp]);
  const markers = useMemo(
    () => [
      ...(location ? [{ id: 'me', latitude: location.latitude, longitude: location.longitude, label: `Search centre: ${location.name}`, kind: 'user' as const }] : []),
      ...list.map((s) => ({ id: s.id, latitude: s.latitude, longitude: s.longitude, label: s.name, kind: 'shop' as const, active: s.id === selected })),
    ],
    [list, location, selected],
  );

  const focusShop = (id: string) => {
    if (id === 'me') return;
    setSelected(id);
    document.getElementById(`shop-${id.replace('/', '-')}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Store} eyebrow="Explore" title="Nearby Dive Shops" description="Find dive centres near you or your destination and contact them directly.">
        <div className="space-y-3 rounded-2xl bg-white/95 p-3 text-foreground shadow-lg dark:bg-card">
          <LocationSearch onSelect={(l: GeoLocation) => setLocation(l)} />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor={radiusId} className="text-xs">Radius</Label>
              <NativeSelect id={radiusId} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="h-9 w-28">
                {[5, 10, 25, 50].map((r) => <option key={r} value={r}>{r} km</option>)}
              </NativeSelect>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium">
              <input type="checkbox" checked={onlyWhatsApp} onChange={(e) => setOnlyWhatsApp(e.target.checked)} className="h-4 w-4 accent-cyan-600" />
              Only shops with a WhatsApp-ready number
            </label>
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="ml-auto">
              <TabsList aria-label="Result view">
                <TabsTrigger value="both"><LayoutGrid /> <span className="hidden sm:inline">Map + list</span><span className="sm:hidden">Both</span></TabsTrigger>
                <TabsTrigger value="map"><MapIcon /> Map</TabsTrigger>
                <TabsTrigger value="cards"><LayoutGrid /> Cards</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </PageHeader>

      {!location && <EmptyState icon={Store} title="Where are you diving?" message="Allow location access with “My location”, or search for a town or dive destination." />}

      {location && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {shops.status === 'loading' ? `Searching within ${radius} km of ${formatLocation(location)}…` : shops.data ? `${list.length} dive shop${list.length === 1 ? '' : 's'} within ${radius} km of ${formatLocation(location)}` : ''}
        </p>
      )}

      {location && shops.status === 'error' && !shops.data && <ErrorState title="Couldn’t load dive shops" message={errorMessage(shops.error)} onRetry={shops.refetch} />}

      {location && (shops.data || shops.status === 'loading') && (
        <div className={view === 'both' ? 'grid grid-cols-1 gap-5 lg:grid-cols-5' : 'space-y-5'}>
          {view !== 'cards' && (
            <div className={view === 'both' ? 'lg:col-span-2 lg:sticky lg:top-6 lg:self-start' : ''}>
              <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
                <MapView center={location} zoom={11} markers={markers} onMarkerClick={focusShop} radiusKm={radius} fit={list.length > 0} className={view === 'map' ? 'h-[70vh]' : 'h-80 lg:h-[70vh]'} ariaLabel="Map of nearby dive shops" />
              </Suspense>
            </div>
          )}
          {view !== 'map' && (
            <div className={view === 'both' ? 'lg:col-span-3' : ''}>
              {shops.status === 'loading' && !shops.data && <CardGridSkeleton count={4} />}
              {shops.data && list.length === 0 && (
                <EmptyState icon={Store} title="No dive shops found" message={`No dive centres are listed on OpenStreetMap within ${radius} km${onlyWhatsApp ? ' with a WhatsApp-ready number' : ''}. Try a larger radius or a nearby town.`} />
              )}
              <div className={view === 'both' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
                {list.map((s) => (
                  <div key={s.id} id={`shop-${s.id.replace('/', '-')}`}>
                    <DiveShopCard shop={s} selected={s.id === selected} onSelect={(x) => setSelected(x.id)} onWhatsApp={setWaShop} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <SafetyNotice title="About these listings">
        Listings come from OpenStreetMap, a community-maintained map. Details can be incomplete or out of date, and inclusion is not an endorsement. We never invent contact details: WhatsApp is only offered when a listing includes an international-format number.
        Check certifications, reviews and safety standards before booking.
      </SafetyNotice>

      <WhatsAppDialog shop={waShop} open={!!waShop} onOpenChange={(o) => !o && setWaShop(null)} />
    </div>
  );
}
