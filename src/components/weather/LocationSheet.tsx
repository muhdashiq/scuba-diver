import { lazy, Suspense } from 'react';
import type { GeoLocation } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationSearch } from '@/components/common/LocationSearch';
import { reverseGeocode } from '@/services/locationService';

const MapView = lazy(() => import('@/components/common/MapView').then((m) => ({ default: m.MapView })));

/** Bottom sheet for choosing a location by search, current position or map tap. */
export function LocationSheet({ open, onOpenChange, current, onSelect, title = 'Choose location' }: { open: boolean; onOpenChange: (o: boolean) => void; current: GeoLocation | null; onSelect: (l: GeoLocation) => void; title?: string }) {
  const pick = (l: GeoLocation) => {
    onSelect(l);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Search, use your current location, or tap the map.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <LocationSearch onSelect={pick} />
          {open && (
            <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
              <MapView
                center={current ?? { latitude: 20, longitude: 0 }}
                zoom={current ? 9 : 2}
                markers={current ? [{ id: 'sel', latitude: current.latitude, longitude: current.longitude, label: current.name, kind: 'site' }] : []}
                onPick={async (lat, lon) => pick(await reverseGeocode(lat, lon))}
                className="h-64"
                ariaLabel="Map — tap to choose a location"
              />
            </Suspense>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
