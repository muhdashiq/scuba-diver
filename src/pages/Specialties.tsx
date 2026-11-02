import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { LessonCard } from '@/components/learning/LessonCard';
import { SPECIALTIES, SPECIALTY_CATEGORIES, SPECIALTY_DISCLAIMER } from '@/data/specialties';
import { useAppStore } from '@/store/useAppStore';
import { lessonKey } from '@/hooks/useLearningProgress';
import { cn } from '@/lib/utils';
import type { Specialty } from '@/types';

export default function Specialties() {
  const completed = useAppStore((s) => s.completedLessons);
  const [filter, setFilter] = useState<Specialty['category'] | 'all'>('all');
  const list = filter === 'all' ? SPECIALTIES : SPECIALTIES.filter((s) => s.category === filter);
  const cats = Object.entries(SPECIALTY_CATEGORIES) as [Specialty['category'], string][];
  return (
    <div className="space-y-8">
      <PageHeader icon={Sparkles} eyebrow="Specialty learning center" title="Specialties" description="Explore the knowledge behind popular diving specialties — overview, prerequisites, equipment, theory, skills and risks." />
      <SafetyNotice title="Educational previews — not certification">{SPECIALTY_DISCLAIMER}</SafetyNotice>
      <div role="group" aria-label="Filter specialties" className="flex flex-wrap gap-2">
        {[['all', 'All'] as const, ...cats].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={cn('min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', filter === id ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent')}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <LessonCard key={s.id} to={`/specialties/${s.id}`} title={s.title} summary={s.summary} illustration={s.illustration} completed={!!completed[lessonKey.specialty(s.id)]} meta={SPECIALTY_CATEGORIES[s.category]} />
        ))}
      </div>
    </div>
  );
}
