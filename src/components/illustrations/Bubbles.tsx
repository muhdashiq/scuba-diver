import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

/** Lightweight rising bubbles. Rendered as a few absolutely-positioned divs. */
export function Bubbles({ count = 14, className = '' }: { count?: number; className?: string }) {
  const reduce = useReducedMotion();
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        size: 6 + ((i * 13) % 16),
        delay: (i * 0.9) % 7,
        duration: 7 + ((i * 7) % 6),
        drift: ((i % 3) - 1) * 14,
      })),
    [count],
  );
  if (reduce) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {bubbles.map((b) => (
        <motion.span
          key={b.id}
          className="absolute bottom-0 rounded-full border border-white/50 bg-white/15 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.35)]"
          style={{ left: `${b.left}%`, width: b.size, height: b.size }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: [40, -520], x: [0, b.drift, -b.drift, 0], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
