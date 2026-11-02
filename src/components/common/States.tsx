import { CircleAlert, Inbox, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('flex items-center justify-center gap-2.5 py-10 text-muted-foreground', className)}>
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-subhead">{label}</span>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, offline }: { title?: string; message?: string; onRetry?: () => void; offline?: boolean }) {
  const Icon = offline ? WifiOff : CircleAlert;
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-10 text-center">
      <Icon className="h-10 w-10 text-muted-foreground" strokeWidth={1.6} aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-headline">{title}</p>
        {message && <p className="mx-auto max-w-xs text-subhead text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="tinted" size="sm" onClick={onRetry}>
          <RefreshCw /> Try Again
        </Button>
      )}
    </div>
  );
}

/** Friendly empty state: what this is, why it's empty, and the one thing to do next. */
export function EmptyState({ icon: Icon = Inbox, title, message, action, className }: { icon?: typeof Inbox; title: string; message?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-10 text-center', className)}>
      <Icon className="h-11 w-11 text-muted-foreground/70" strokeWidth={1.5} aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-headline">{title}</p>
        {message && <p className="mx-auto max-w-xs text-subhead text-muted-foreground">{message}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-5 pt-14" role="status" aria-label="Loading">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <ListSkeleton rows={3} />
    </div>
  );
}
