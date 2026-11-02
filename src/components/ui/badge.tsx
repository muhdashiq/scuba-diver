import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold [&_svg]:size-3', {
  variants: {
    variant: {
      default: 'bg-primary/12 text-primary',
      secondary: 'bg-fill text-muted-foreground',
      outline: 'border border-separator text-muted-foreground',
      success: 'bg-success/12 text-success',
      warning: 'bg-warning/12 text-warning',
      destructive: 'bg-destructive/12 text-destructive',
      teal: 'bg-teal/12 text-teal',
      solid: 'bg-primary text-primary-foreground',
      glass: 'bg-white/20 text-white backdrop-blur',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
