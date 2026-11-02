import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  const gid = useId();
  return (
    <Link to="/" className={cn('flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} aria-label="ScubaDive home">
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#0b3b55" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill={`url(#${gid})`} />
        <circle cx="24" cy="26" r="9" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="40" cy="26" r="9" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="46" cy="46" r="4" fill="#cffafe" />
        <circle cx="38" cy="52" r="2.5" fill="#cffafe" />
      </svg>
      <span className={cn('font-display text-lg font-extrabold tracking-tight', light ? 'text-white' : 'text-foreground')}>
        Scuba<span className="text-cyan-500">Dive</span>
      </span>
    </Link>
  );
}
