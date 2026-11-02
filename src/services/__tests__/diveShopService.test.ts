import { describe, expect, it } from 'vitest';
import { buildOverpassQuery, parseOverpass } from '../diveShopService';

describe('diveShopService', () => {
  it('builds an Overpass query around the point', () => {
    const q = buildOverpassQuery(27.9, 34.3, 25000);
    expect(q).toContain('"shop"="scuba_diving"');
    expect(q).toContain('around:25000,27.90000,34.30000');
  });
  it('parses, de-duplicates and sorts shops by distance', () => {
    const shops = parseOverpass(
      [
        { type: 'node', id: 1, lat: 28.0, lon: 34.3, tags: { name: 'Far Divers', shop: 'scuba_diving' } },
        { type: 'way', id: 2, center: { lat: 27.91, lon: 34.3 }, tags: { name: 'Near Divers', amenity: 'dive_centre', phone: '+20 69 123 4567', website: 'neardivers.example', 'addr:street': 'Main St', 'addr:city': 'Town' } },
        { type: 'node', id: 3, lat: 27.91, lon: 34.3, tags: { name: 'Near Divers', shop: 'scuba_diving' } },
        { type: 'node', id: 4, lat: 27.92, lon: 34.3, tags: { shop: 'scuba_diving' } },
      ],
      27.9,
      34.3,
    );
    expect(shops.map((s) => s.name)).toEqual(['Near Divers', 'Far Divers']);
    expect(shops[0]).toMatchObject({ whatsapp: '20691234567', website: 'https://neardivers.example', address: 'Main St, Town' });
    expect(shops[0].distanceKm).toBeLessThan(shops[1].distanceKm);
  });
  it('never invents contact details', () => {
    const [shop] = parseOverpass([{ type: 'node', id: 9, lat: 1, lon: 1, tags: { name: 'Local Divers', shop: 'scuba_diving', phone: '012 345 678' } }], 1, 1);
    expect(shop.phone).toBe('012 345 678');
    expect(shop.whatsapp).toBeUndefined();
    expect(shop.website).toBeUndefined();
    expect(shop.address).toBeUndefined();
  });
});
