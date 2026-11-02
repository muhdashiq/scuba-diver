import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { Bubbles } from './Bubbles';
import { Diver } from './Diver';
import { Fish } from './Fish';

/** Animated underwater backdrop for hero sections. Purely decorative. */
export function UnderwaterScene({ showDiver = true, className = '' }: { showDiver?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const ray = useId();
  const swim = (duration: number, delay = 0, from = '110%', to = '-30%') =>
    reduce ? {} : { initial: { x: from }, animate: { x: [from, to] }, transition: { duration, delay, repeat: Infinity, ease: 'linear' as const } };

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Light rays */}
      <svg className="absolute inset-0 h-full w-full opacity-40 mix-blend-screen" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id={ray} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.9" />
            <stop offset="1" stopColor="#e0f2fe" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="18,0 26,0 44,100 22,100" fill={`url(#${ray})`} opacity="0.35" />
        <polygon points="40,0 46,0 64,100 50,100" fill={`url(#${ray})`} opacity="0.25" />
        <polygon points="62,0 70,0 92,100 74,100" fill={`url(#${ray})`} opacity="0.3" />
      </svg>
      {/* Caustic shimmer */}
      <div className="absolute -inset-10 animate-caustics bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_30%)]" />

      {/* Fish school */}
      <motion.div className="absolute top-[18%] w-24 sm:w-28" {...swim(26, 0)}>
        <Fish body="#fb923c" fin="#ea580c" variant="tropical" />
      </motion.div>
      <motion.div className="absolute top-[30%] w-12 sm:w-16" {...swim(20, 4)}>
        <Fish body="#fde047" fin="#facc15" stripe="#0f172a" variant="round" />
      </motion.div>
      <motion.div className="absolute top-[52%] w-16 opacity-80 sm:w-20" {...swim(32, 9, '-30%', '120%')}>
        <Fish body="#38bdf8" fin="#0ea5e9" stripe="#fde047" variant="slim" flip />
      </motion.div>
      <motion.div className="absolute top-[24%] w-10 opacity-70" {...swim(24, 12)}>
        <Fish body="#a78bfa" fin="#7c3aed" variant="striped" />
      </motion.div>

      {showDiver && (
        <motion.div
          className="absolute right-[4%] top-[36%] hidden w-56 sm:block sm:w-72 lg:w-80"
          animate={reduce ? undefined : { y: [0, -10, 0], x: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Diver />
        </motion.div>
      )}

      {/* Seabed and coral */}
      <svg className="absolute bottom-0 left-0 h-28 w-full sm:h-36" viewBox="0 0 800 140" preserveAspectRatio="none">
        <path d="M0 110 C 120 80, 220 120, 360 100 S 600 80, 800 104 V140 H0 Z" fill="#082f49" opacity="0.85" />
        <path d="M0 124 C 160 104, 300 132, 460 118 S 700 110, 800 122 V140 H0 Z" fill="#04192b" />
        <g fill="none" strokeLinecap="round">
          <path d="M90 118 C 88 90, 70 80, 74 60 M88 98 C 100 86, 112 84, 110 66 M80 88 C 64 84, 60 74, 56 64" stroke="#f472b6" strokeWidth="6" />
          <path d="M620 116 C 622 86, 640 74, 636 54 M626 92 C 610 82, 604 70, 606 58 M632 84 C 652 78, 656 66, 660 56" stroke="#fb7185" strokeWidth="6" />
          <path d="M300 118 C 296 98, 310 92, 306 76 M318 118 C 322 96, 334 90, 332 74" stroke="#2dd4bf" strokeWidth="5" />
        </g>
        <ellipse cx="460" cy="112" rx="34" ry="18" fill="#a16207" opacity="0.8" />
        <path d="M432 108 q 28 -20 56 0" stroke="#fde68a" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M444 104 q 16 -12 32 0" stroke="#fde68a" strokeWidth="2" fill="none" opacity="0.5" />
        {[180, 200, 520, 720, 740].map((x, i) => (
          <path key={x} d={`M${x} 124 C ${x - 6} 100, ${x + 8} 90, ${x} ${70 - (i % 2) * 12}`} stroke="#14b8a6" strokeWidth="4" fill="none" opacity="0.7" />
        ))}
      </svg>
      <Bubbles count={16} />
    </div>
  );
}
