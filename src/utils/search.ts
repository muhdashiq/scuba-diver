import type { IllustrationKey, MarineArtKey } from '@/types';
import { OPEN_WATER_LESSONS } from '@/data/openWater';
import { AOW_MODULES } from '@/data/advancedOpenWater';
import { SPECIALTIES } from '@/data/specialties';
import { MARINE_LIFE } from '@/data/marineLife';

export interface SearchResult {
  id: string;
  group: 'Lessons' | 'Specialties' | 'Marine life';
  title: string;
  subtitle: string;
  to: string;
  illustration?: IllustrationKey;
  art?: { key: MarineArtKey; palette: [string, string] };
  score: number;
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

function score(q: string, title: string, body: string) {
  const t = norm(title);
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/\s+/).some((w) => w.startsWith(q))) return 60;
  if (t.includes(q)) return 40;
  if (norm(body).includes(q)) return 15;
  return 0;
}

/** Simple client-side search across all bundled educational content (works offline). */
export function searchContent(query: string, limit = 30): SearchResult[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const results: SearchResult[] = [];
  for (const l of OPEN_WATER_LESSONS) {
    const s = score(q, l.title, `${l.summary} ${l.objectives.join(' ')} ${l.sections.map((x) => x.heading).join(' ')}`);
    if (s) results.push({ id: `ow:${l.id}`, group: 'Lessons', title: l.title, subtitle: `Open Water · Lesson ${l.order}`, to: `/open-water/${l.id}`, illustration: l.illustration, score: s });
  }
  for (const m of AOW_MODULES) {
    const s = score(q, m.title, `${m.summary} ${m.theory.join(' ')}`);
    if (s) results.push({ id: `aow:${m.id}`, group: 'Lessons', title: m.title, subtitle: 'Advanced Open Water', to: `/advanced-open-water/${m.id}`, illustration: m.illustration, score: s });
  }
  for (const sp of SPECIALTIES) {
    const s = score(q, sp.title, `${sp.summary} ${sp.overview.join(' ')}`);
    if (s) results.push({ id: `sp:${sp.id}`, group: 'Specialties', title: sp.title, subtitle: sp.summary, to: `/specialties/${sp.id}`, illustration: sp.illustration, score: s });
  }
  for (const m of MARINE_LIFE) {
    const s = score(q, `${m.commonName} ${m.scientificName ?? ''}`, `${m.habitat} ${m.identification.join(' ')}`);
    if (s) results.push({ id: `ml:${m.id}`, group: 'Marine life', title: m.commonName, subtitle: m.scientificName ?? m.habitat, to: `/marine-life?entry=${m.id}`, art: { key: m.art, palette: m.palette }, score: s });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
