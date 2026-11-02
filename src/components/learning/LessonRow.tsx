import { CheckCircle2 } from 'lucide-react';
import type { IllustrationKey } from '@/types';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { ListRow } from '@/components/common/List';

/** List row with a lesson thumbnail and completion state. */
export function LessonRow({ to, title, subtitle, illustration, completed, index }: { to: string; title: string; subtitle?: string; illustration: IllustrationKey; completed?: boolean; index?: number }) {
  return (
    <ListRow
      to={to}
      separatorInset="5.75rem"
      leading={
        <span className="relative shrink-0">
          <LessonIllustration k={illustration} compact className="h-12 w-[4.25rem] rounded-[0.625rem] [&_svg]:h-full" />
          {index !== undefined && <span className="absolute left-1 top-1 rounded-[5px] bg-black/50 px-1 text-[10px] font-semibold leading-4 text-white">{index}</span>}
        </span>
      }
      title={<span className="whitespace-normal leading-snug">{title}</span>}
      subtitle={subtitle}
      trailing={completed ? <CheckCircle2 className="h-5 w-5 shrink-0 fill-success text-card" aria-label="Completed" /> : undefined}
    />
  );
}
