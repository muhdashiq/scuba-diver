import { motion } from 'framer-motion';
import { useId } from 'react';
import { cn } from '@/lib/utils';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
}

/** iOS segmented control with a sliding thumb. */
export function SegmentedControl<T extends string | number>({ options, value, onChange, label, className, size = 'default' }: { options: SegmentOption<T>[]; value: T; onChange: (v: T) => void; label: string; className?: string; size?: 'default' | 'sm' }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cn('flex w-full rounded-[0.6rem] bg-fill p-0.5', className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.ariaLabel}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[0.5rem] px-2 font-medium text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4',
              size === 'sm' ? 'h-7 text-footnote' : 'h-8 text-subhead',
              active && 'font-semibold text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-[0.5rem] bg-card shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)] dark:bg-[#636366]"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
