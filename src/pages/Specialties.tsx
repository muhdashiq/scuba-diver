import { useMemo, useState } from 'react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ListGroup } from '@/components/common/List';
import { LessonRow } from '@/components/learning/LessonRow';
import { SearchField } from '@/components/common/SearchField';
import { EmptyState } from '@/components/common/States';
import { SPECIALTIES, SPECIALTY_CATEGORIES, SPECIALTY_DISCLAIMER } from '@/data/specialties';
import { useAppStore } from '@/store/useAppStore';
import { lessonKey } from '@/hooks/useLearningProgress';
import type { Specialty } from '@/types';
import { cn } from '@/lib/utils';

export default function Specialties() {
  const completed = useAppStore((s) => s.completedLessons);
  const [filter, setFilter] = useState<Specialty['category'] | 'all'>('all');
  const [query, setQuery] = useState('');
  const cats = Object.entries(SPECIALTY_CATEGORIES) as [Specialty['category'], string][];
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPECIALTIES.filter((s) => (filter === 'all' || s.category === filter) && (!q || `${s.title} ${s.summary}`.toLowerCase().includes(q)));
  }, [filter, query]);

  return (
    <>
      <ScreenHeader back={{ to: '/learn', label: 'Learn' }} title="Specialties" subtitle="Preview the knowledge behind popular specialty courses.">
        <SearchField value={query} onChange={setQuery} placeholder="Search specialties" />
      </ScreenHeader>
      <div className="space-y-5">
        <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[['all', 'All'] as const, ...cats].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id} className={cn('h-8 shrink-0 rounded-full px-3.5 text-subhead font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', filter === id ? 'bg-foreground text-background' : 'bg-card hover:bg-accent')}>
              {label}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState title="No specialties found" message="Try a different search or category." />
        ) : (
          <ListGroup footer={SPECIALTY_DISCLAIMER}>
            {list.map((s) => (
              <LessonRow key={s.id} to={`/specialties/${s.id}`} title={s.title} subtitle={`${SPECIALTY_CATEGORIES[s.category]} · ${s.summary}`} illustration={s.illustration} completed={!!completed[lessonKey.specialty(s.id)]} />
            ))}
          </ListGroup>
        )}
      </div>
    </>
  );
}
