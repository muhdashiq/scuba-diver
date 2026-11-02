import type { DiveShop } from '@/types';
import { haversineKm } from '@/utils/geo';
import { normalizeInternationalPhone } from '@/utils/whatsapp';
import { API } from './config';
import { ApiError, fetchJson } from './http';

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/**
 * Query OpenStreetMap (via Overpass) for dive centres. Results are community-maintained
 * listings — we show exactly what OSM contains and never invent missing contact details.
 */
export function buildOverpassQuery(lat: number, lon: number, radiusMeters: number) {
  const a = `(around:${Math.round(radiusMeters)},${lat.toFixed(5)},${lon.toFixed(5)})`;
  return `[out:json][timeout:25];
(
  nwr["shop"="scuba_diving"]${a};
  nwr["amenity"="dive_centre"]${a};
  nwr["club"="scuba_diving"]${a};
  nwr["sport"="scuba_diving"]["shop"]${a};
  nwr["sport"="scuba_diving"]["office"]${a};
  nwr["sport"="scuba_diving"]["tourism"]${a};
  nwr["sport"="scuba_diving"]["leisure"="sports_centre"]${a};
);
out center tags 80;`;
}

const pick = (tags: Record<string, string>, ...keys: string[]) => keys.map((k) => tags[k]).find((v) => v && v.trim());

function formatAddress(tags: Record<string, string>): string | undefined {
  if (tags['addr:full']) return tags['addr:full'];
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
  const parts = [street, tags['addr:city'] || tags['addr:place'] || tags['addr:suburb'], tags['addr:postcode'], tags['addr:country']].filter(Boolean);
  return parts.length ? parts.join(', ') : undefined;
}

function normaliseWebsite(url?: string) {
  if (!url) return undefined;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(u)) return `https://${u}`;
  return undefined;
}

export function parseOverpass(elements: OverpassElement[], originLat: number, originLon: number): DiveShop[] {
  const shops: DiveShop[] = [];
  const seen = new Set<string>();
  for (const el of elements) {
    const tags = el.tags ?? {};
    const name = tags.name?.trim();
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!name || lat === undefined || lon === undefined) continue;
    const key = `${name.toLowerCase()}|${lat.toFixed(3)}|${lon.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const phone = pick(tags, 'phone', 'contact:phone', 'contact:mobile', 'mobile');
    const whatsappRaw = pick(tags, 'contact:whatsapp', 'whatsapp');
    const whatsapp = normalizeInternationalPhone(whatsappRaw) ?? normalizeInternationalPhone(phone) ?? undefined;
    const services = [tags.shop === 'scuba_diving' && 'Dive shop', tags.amenity === 'dive_centre' && 'Dive centre', tags.club && 'Club', tags['scuba_diving:courses'] === 'yes' && 'Courses', tags['scuba_diving:rental'] === 'yes' && 'Rental', tags['scuba_diving:filling'] && 'Fills']
      .filter(Boolean) as string[];

    shops.push({
      id: `${el.type}/${el.id}`,
      name,
      latitude: lat,
      longitude: lon,
      distanceKm: haversineKm(originLat, originLon, lat, lon),
      address: formatAddress(tags),
      phone: phone?.split(';')[0].trim(),
      whatsapp,
      website: normaliseWebsite(pick(tags, 'website', 'contact:website', 'url')),
      email: pick(tags, 'email', 'contact:email'),
      openingHours: tags.opening_hours,
      image: tags.image && /^https:\/\//.test(tags.image) ? tags.image : undefined,
      osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      tags: services.length ? services : ['Diving'],
    });
  }
  return shops.sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function findDiveShops(lat: number, lon: number, radiusKm = 25, signal?: AbortSignal): Promise<DiveShop[]> {
  const body = new URLSearchParams({ data: buildOverpassQuery(lat, lon, radiusKm * 1000) });
  const data = await fetchJson<{ elements?: OverpassElement[]; remark?: string }>(API.overpass, {
    method: 'POST',
    body,
    signal,
    timeoutMs: 30000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if (!data.elements) throw new ApiError(data.remark ?? 'The map data service returned no results.', undefined, 'empty');
  return parseOverpass(data.elements, lat, lon);
}
