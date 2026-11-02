import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IllustrationKey } from '@/types';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  to: string;
  title: string;
  summary: string;
  illustration: IllustrationKey;
  completed?: boolean;
  index?: number;
  meta?: string;
  duration?: number;
}

export function LessonCard({ to, title, summary, illustration, completed, index, meta, duration }: LessonCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="h-full">
      <Link
        to={to}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-cyan-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <LessonIllustration k={illustration} compact className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
          {index !== undefined && (
            <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              {String(index).padStart(2, '0')}
            </span>
          )}
          {completed && (
            <Badge variant="success" className="absolute right-3 top-3 bg-success text-success-foreground">
              <CheckCircle2 /> Done
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className={cn('font-bold leading-snug group-hover:text-primary')}>{title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>
          <div className="mt-auto flex items-center gap-3 pt-2 text-xs font-medium text-muted-foreground">
            {duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {duration} min
              </span>
            )}
            {meta && <span>{meta}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
