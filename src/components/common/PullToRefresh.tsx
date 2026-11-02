import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';

const THRESHOLD = 72;

/** Touch pull-to-refresh for mobile. No-ops on mouse/desktop. */
export function PullToRefresh({ onRefresh, children }: { onRefresh: () => Promise<unknown> | void; children: ReactNode }) {
  const y = useMotionValue(0);
  const rotate = useTransform(y, [0, THRESHOLD], [0, 270]);
  const opacity = useTransform(y, [0, 24, THRESHOLD], [0, 0.4, 1]);
  const start = useRef<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    start.current = window.scrollY <= 0 && !refreshing ? e.touches[0].clientY : null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (start.current === null) return;
    const dy = e.touches[0].clientY - start.current;
    if (dy > 0) y.set(Math.min(110, dy * 0.45));
  };
  const onTouchEnd = async () => {
    if (start.current === null) return;
    start.current = null;
    if (y.get() >= THRESHOLD) {
      setRefreshing(true);
      animate(y, 52, { type: 'spring', stiffness: 400, damping: 30 });
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        animate(y, 0, { type: 'spring', stiffness: 400, damping: 34 });
      }
    } else animate(y, 0, { type: 'spring', stiffness: 400, damping: 34 });
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="relative">
      <motion.div style={{ opacity, height: y }} className="flex items-center justify-center overflow-hidden" aria-hidden={!refreshing}>
        <motion.span style={{ rotate: refreshing ? undefined : rotate }} className="text-muted-foreground">
          <Loader2 className={refreshing ? 'h-6 w-6 animate-spin' : 'h-6 w-6'} />
        </motion.span>
        {refreshing && <span className="sr-only" role="status">Refreshing</span>}
      </motion.div>
      {children}
    </div>
  );
}
