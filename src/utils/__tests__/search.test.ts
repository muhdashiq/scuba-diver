import { describe, expect, it } from 'vitest';
import { searchContent } from '../search';

describe('content search', () => {
  it('ignores very short queries', () => {
    expect(searchContent('a')).toEqual([]);
  });
  it('finds lessons, specialties and marine life, best matches first', () => {
    const nitrox = searchContent('nitrox');
    expect(nitrox[0]).toMatchObject({ group: 'Specialties', title: 'Enriched Air Nitrox', to: '/specialties/nitrox' });
    expect(searchContent('turtle').some((r) => r.group === 'Marine life' && r.to.includes('green-turtle'))).toBe(true);
    expect(searchContent('buoyancy').some((r) => r.group === 'Lessons')).toBe(true);
  });
  it('is case- and accent-insensitive', () => {
    expect(searchContent('MANTA').length).toBeGreaterThan(0);
    expect(searchContent('équalisation').length).toBeGreaterThan(0);
  });
});
