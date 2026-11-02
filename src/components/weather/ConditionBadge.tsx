import { AlertTriangle, CheckCircle2, HelpCircle, OctagonX } from 'lucide-react';
import type { ConditionRating } from '@/types';
import { RATING_LABEL } from '@/utils/weather';
import { cn } from '@/lib/utils';

const STYLES: Record<ConditionRating, { cls: string; icon: typeof CheckCircle2 }> = {
  favorable: { cls: 'bg-success/15 text-success', icon: CheckCircle2 },
  caution: { cls: 'bg-warning/15 text-warning', icon: AlertTriangle },
  unfavorable: { cls: 'bg-destructive/15 text-destructive', icon: OctagonX },
  unknown: { cls: 'bg-muted text-muted-foreground', icon: HelpCircle },
};

export function ConditionBadge({ rating, className }: { rating: ConditionRating; className?: string }) {
  const { cls, icon: Icon } = STYLES[rating];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold', cls, className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {RATING_LABEL[rating]}
    </span>
  );
}
