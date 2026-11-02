import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** iOS-style buttons: filled, tinted, gray, plain and destructive. */
const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap font-semibold transition-[transform,background-color,opacity,color] duration-150 ease-out active:scale-[0.97] active:opacity-80 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[1.15em] [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        tinted: 'bg-primary/12 text-primary hover:bg-primary/[0.18]',
        secondary: 'bg-fill text-foreground hover:bg-accent',
        outline: 'border border-separator bg-card text-foreground hover:bg-accent',
        ghost: 'text-primary hover:bg-primary/10',
        plain: 'text-foreground hover:bg-accent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        'destructive-tinted': 'bg-destructive/12 text-destructive hover:bg-destructive/[0.18]',
        link: 'text-primary underline-offset-4 hover:underline',
        whatsapp: 'bg-[#1f9e55] text-white hover:bg-[#1a8a4a]',
      },
      size: {
        default: 'h-11 rounded-xl px-4 text-callout',
        sm: 'h-9 rounded-full px-3.5 text-subhead',
        lg: 'h-[3.25rem] rounded-[0.875rem] px-6 text-headline',
        icon: 'h-11 w-11 rounded-full text-callout',
        'icon-sm': 'h-9 w-9 rounded-full text-subhead',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
