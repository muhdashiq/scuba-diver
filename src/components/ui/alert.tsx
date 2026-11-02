import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, Info, OctagonAlert, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative flex gap-3 rounded-2xl border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0', {
  variants: {
    variant: {
      info: 'border-primary/30 bg-primary/5 text-foreground [&>svg]:text-primary',
      caution: 'border-warning/40 bg-warning/10 text-foreground [&>svg]:text-warning',
      warning: 'border-destructive/40 bg-destructive/10 text-foreground [&>svg]:text-destructive',
      safety: 'border-amber-500/40 bg-amber-500/10 text-foreground [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400',
    },
  },
  defaultVariants: { variant: 'info' },
});

const ICONS = { info: Info, caution: AlertTriangle, warning: OctagonAlert, safety: ShieldAlert } as const;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
  icon?: boolean;
}

function Alert({ className, variant = 'info', title, children, icon = true, ...props }: AlertProps) {
  const Icon = ICONS[variant ?? 'info'];
  return (
    <div role={variant === 'warning' ? 'alert' : 'note'} className={cn(alertVariants({ variant }), className)} {...props}>
      {icon && <Icon aria-hidden="true" />}
      <div className="min-w-0 space-y-1">
        {title && <p className="font-semibold leading-tight">{title}</p>}
        <div className="text-muted-foreground [&_strong]:text-foreground">{children}</div>
      </div>
    </div>
  );
}

export { Alert };
