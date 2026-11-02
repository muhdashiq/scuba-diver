import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Animated circular progress indicator. */
export function ProgressRing({
  value,
  size = 96,
  stroke = 9,
  label,
  className,
  tone = 'ocean',
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
  tone?: 'ocean' | 'success' | 'warning' | 'destructive' | 'light';
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const colors: Record<string, string> = {
    ocean: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    destructive: 'stroke-destructive',
    light: 'stroke-white',
  };
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(clamped)}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={tone === 'light' ? 'stroke-white/25' : 'stroke-fill'} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          className={colors[tone]}
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c - (clamped / 100) * c : c }}
          animate={{ strokeDashoffset: c - (clamped / 100) * c }}
          transition={{ duration: reduce ? 0 : 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children ?? <span className="text-headline tabular">{Math.round(clamped)}%</span>}</div>
    </div>
  );
}
