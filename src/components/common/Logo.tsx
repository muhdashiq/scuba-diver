import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** The app icon — same artwork as public/favicon.svg. */
export function AppIcon({ className }: { className?: string }) {
  const gid = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#0e7490" />
          <stop offset="1" stopColor="#0b3b55" />
        </linearGradient>
        <linearGradient id={`${gid}-lens`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cffafe" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gid})`} />
      <path d="M0 47c8-4 16-4 24 0s16 4 24 0 12-3 16-1v18H0z" fill="#082f49" opacity=".6" />
      <path d="M10 22h44a5 5 0 0 1 5 5v8a8 8 0 0 1-8 8h-9.5l-4.2-4.6a3 3 0 0 0-4.6 0L28.5 43H13a8 8 0 0 1-8-8v-8a5 5 0 0 1 5-5z" fill="#fff" />
      <rect x="10" y="26" width="17.5" height="12.5" rx="4" fill={`url(#${gid}-lens)`} />
      <rect x="36.5" y="26" width="17.5" height="12.5" rx="4" fill={`url(#${gid}-lens)`} />
      <circle cx="49" cy="13" r="4" fill="none" stroke="#e0f2fe" strokeWidth="2" />
      <circle cx="56.5" cy="7" r="2.2" fill="#e0f2fe" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} aria-label="ScubaDive home">
      <AppIcon className="h-8 w-8 shrink-0" />
      <span className="text-headline">ScubaDive</span>
    </Link>
  );
}
