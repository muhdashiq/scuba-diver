import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, Circle } from 'react-leaflet';
import { cn } from '@/lib/utils';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  kind?: 'user' | 'shop' | 'site';
  active?: boolean;
}

// Custom div icons avoid Leaflet's default image assets (which break with bundlers/base paths).
const icon = (kind: MapMarker['kind'], active?: boolean) =>
  L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
    html: `<div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${
      kind === 'user' ? '#2563eb' : kind === 'shop' ? (active ? '#f59e0b' : '#0891b2') : '#e11d48'
    };border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.35)"><span style="transform:rotate(45deg);color:white;font-size:13px;font-weight:800">${kind === 'user' ? '●' : kind === 'shop' ? '⚓' : '◆'}</span></div>`,
  });

function ClickHandler({ onPick }: { onPick?: (lat: number, lon: number) => void }) {
  useMapEvents({ click: (e) => onPick?.(e.latlng.lat, e.latlng.lng) });
  return null;
}

function Recenter({ lat, lon, zoom }: { lat: number; lon: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], zoom ?? map.getZoom(), { animate: true });
  }, [lat, lon, zoom, map]);
  return null;
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length < 2) return;
    const b = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude] as [number, number]));
    map.fitBounds(b, { padding: [32, 32], maxZoom: 13 });
  }, [markers, map]);
  return null;
}

export function MapView({
  center,
  zoom = 10,
  markers = [],
  onPick,
  onMarkerClick,
  radiusKm,
  fit,
  className,
  ariaLabel = 'Map',
}: {
  center: { latitude: number; longitude: number };
  zoom?: number;
  markers?: MapMarker[];
  onPick?: (lat: number, lon: number) => void;
  onMarkerClick?: (id: string) => void;
  radiusKm?: number;
  fit?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border', className)} role="region" aria-label={ariaLabel}>
      <MapContainer center={[center.latitude, center.longitude]} zoom={zoom} scrollWheelZoom={false} className="h-full w-full" style={{ minHeight: 280 }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter lat={center.latitude} lon={center.longitude} />
        {fit && <FitBounds markers={markers} />}
        {radiusKm && <Circle center={[center.latitude, center.longitude]} radius={radiusKm * 1000} pathOptions={{ color: '#06b6d4', fillOpacity: 0.05, weight: 1.5 }} />}
        <ClickHandler onPick={onPick} />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]} icon={icon(m.kind, m.active)} eventHandlers={{ click: () => onMarkerClick?.(m.id) }} title={m.label} alt={m.label}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
