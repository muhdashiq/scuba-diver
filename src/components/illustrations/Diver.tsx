import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';

/** Original stylised scuba diver, swimming to the left. */
export function Diver({ className, animate = true }: { className?: string; animate?: boolean }) {
  const reduce = useReducedMotion();
  const kick = animate && !reduce;
  const uid = useId();
  const suit = `${uid}-suit`;
  const tank = `${uid}-tank`;
  return (
    <svg viewBox="0 0 320 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={suit} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id={tank} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* tank */}
      <rect x="92" y="22" width="92" height="24" rx="12" fill={`url(#${tank})`} />
      <rect x="80" y="28" width="16" height="12" rx="3" fill="#94a3b8" />
      <circle cx="80" cy="34" r="6" fill="#475569" />
      {/* hose */}
      <path d="M78 36 C 66 50, 60 56, 50 56" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* torso */}
      <path d="M60 48 C 80 36, 170 38, 196 50 C 205 56, 200 70, 188 72 L 76 74 C 58 74, 50 58, 60 48 Z" fill={`url(#${suit})`} />
      {/* BCD */}
      <path d="M96 44 L 170 44 L 172 70 L 94 72 Z" fill="#0e7490" opacity="0.9" />
      <rect x="120" y="60" width="26" height="6" rx="2" fill="#0f172a" />
      {/* head */}
      <circle cx="46" cy="58" r="17" fill="#1e293b" />
      {/* mask */}
      <path d="M28 52 h18 a6 6 0 0 1 6 6 v4 a6 6 0 0 1 -6 6 h-18 z" fill="#67e8f9" stroke="#0f172a" strokeWidth="3" />
      <path d="M31 55 l8 0" stroke="#ecfeff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* regulator */}
      <rect x="34" y="70" width="12" height="8" rx="3" fill="#0f172a" />
      {/* arm */}
      <path d="M80 70 C 70 84, 60 88, 52 90" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="91" r="6" fill="#0f172a" />
      {/* computer */}
      <rect x="58" y="82" width="12" height="9" rx="2" fill="#22d3ee" />
      {/* legs + fins */}
      <motion.g
        style={{ originX: '196px', originY: '60px' }}
        animate={kick ? { rotate: [-6, 6, -6] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M190 52 L 250 46" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />
        <path d="M248 46 L 304 30 L 300 48 Z" fill="#facc15" />
      </motion.g>
      <motion.g
        style={{ originX: '196px', originY: '66px' }}
        animate={kick ? { rotate: [6, -6, 6] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M190 66 L 250 72" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
        <path d="M248 72 L 304 70 L 296 88 Z" fill="#eab308" />
      </motion.g>
    </svg>
  );
}
