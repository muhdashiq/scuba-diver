import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';

/** Dismissible contextual tip; stays dismissed once closed. */
export function TipCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const dismissed = useAppStore((s) => s.dismissedTips.includes(id));
  const dismiss = useAppStore((s) => s.dismissTip);
  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.aside initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden" aria-label={`Tip: ${title}`}>
          <div className="relative flex gap-3 rounded-2xl bg-card p-4 pr-11">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFCC00]/20 text-[#B38600] dark:text-[#FFD60A]">
              <Lightbulb className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="space-y-0.5">
              <p className="text-subhead font-semibold">{title}</p>
              <div className="text-subhead text-muted-foreground">{children}</div>
            </div>
            <button type="button" onClick={() => dismiss(id)} aria-label="Dismiss tip" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent">
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
