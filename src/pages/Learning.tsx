import { ArrowRight, BrainCircuit, Fish, GraduationCap, Mountain, Sparkles, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { SafetyNotice } from '@/components/common/SafetyNotice';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { Progress } from '@/components/ui/progress';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import type { IllustrationKey } from '@/types';

export default function Learning() {
  const p = useLearningProgress();
  const courses: { to: string; title: string; desc: string; icon: typeof Waves; ill: IllustrationKey; progress?: { done: number; total: number; percent: number } }[] = [
    { to: '/open-water', title: 'Open Water Diver', desc: 'Fifteen foundational lessons — physics, equipment, skills and planning.', icon: Waves, ill: 'diver', progress: p.openWater },
    { to: '/advanced-open-water', title: 'Advanced Open Water', desc: 'Adventure modules from deep and navigation to wreck and drift diving.', icon: Mountain, ill: 'profile', progress: p.advanced },
    { to: '/specialties', title: 'Specialty Learning Center', desc: 'Nitrox, dry suit, sidemount, ice, rescue and more.', icon: Sparkles, ill: 'nitrox', progress: p.specialties },
    { to: '/quiz', title: 'Knowledge Quiz', desc: 'Image-based and scenario questions across eleven categories.', icon: BrainCircuit, ill: 'signals' },
    { to: '/marine-life', title: 'Marine Life Library', desc: 'Identify reef fish, sharks, turtles, corals and more.', icon: Fish, ill: 'fish' },
  ];
  return (
    <div className="space-y-8">
      <PageHeader icon={GraduationCap} eyebrow="Learning center" title="Learn Scuba" description="Structured, visual learning pathways to prepare for your training and dives." />
      <SafetyNotice title="Learning here does not certify you">
        ScubaDive supports your studies. Certification requires a course with a qualified instructor from a recognised training agency, including in-water training.
      </SafetyNotice>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(({ to, title, desc, icon: Icon, ill, progress }, i) => (
          <motion.div key={to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}>
            <Link to={to} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <LessonIllustration k={ill} className="aspect-[16/9]" compact />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="flex items-center gap-2 text-lg font-bold group-hover:text-primary"><Icon className="h-5 w-5 text-primary" aria-hidden="true" />{title}</h2>
                <p className="text-sm text-muted-foreground">{desc}</p>
                {progress && (
                  <div className="mt-auto space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground"><span>Progress</span><span className="tabular">{progress.done}/{progress.total}</span></div>
                    <Progress value={progress.percent} aria-label={`${title} progress`} />
                  </div>
                )}
                {!progress && <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">Open <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
