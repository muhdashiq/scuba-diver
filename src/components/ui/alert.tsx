import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, Info, OctagonAlert, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative flex gap-3 rounded-2xl p-4 text-subhead [&>svg]:mt-px [&>svg]:size-5 [&>svg]:shrink-0', {
  variants: {
    variant: {
      info: 'bg-primary/[0.08] [&>svg]:text-primary',
      caution: 'bg-warning/10 [&>svg]:text-warning',
      warning: 'bg-destructive/10 [&>svg]:text-destructive',
      safety: 'bg-warning/10 [&>svg]:text-warning',
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
      <div className="min-w-0 space-y-0.5">
        {title && <p className="font-semibold leading-snug text-foreground">{title}</p>}
        <div className="text-muted-foreground [&_strong]:text-foreground">{children}</div>
      </div>
    </div>
  );
}

export { Alert };
