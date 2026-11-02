import { AlertCircle, Inbox, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('flex items-center justify-center gap-3 py-10 text-muted-foreground', className)}>
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, offline }: { title?: string; message?: string; onRetry?: () => void; offline?: boolean }) {
  const Icon = offline ? WifiOff : AlertCircle;
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
      <Icon className="h-8 w-8 text-destructive" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-1 text-sm text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw /> Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, action }: { icon?: typeof Inbox; title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center">
      <div className="rounded-2xl bg-secondary p-3">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border p-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <CardGridSkeleton count={3} />
    </div>
  );
}
