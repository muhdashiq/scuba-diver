import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleAlert } from 'lucide-react';
import { useToastStore } from '@/lib/toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[calc(0.5rem+env(safe-area-inset-top))] z-[70] flex flex-col items-center gap-2 px-4 lg:top-4">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            role="status"
            className="pointer-events-auto flex min-h-11 max-w-sm items-center gap-2.5 rounded-full bg-[#1C1C1E]/95 py-2 pl-3.5 pr-2 text-subhead font-medium text-white shadow-lg backdrop-blur dark:bg-[#3A3A3C]/95"
          >
            {t.tone === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#30D158]" aria-hidden="true" />}
            {t.tone === 'error' && <CircleAlert className="h-5 w-5 shrink-0 text-[#FF6961]" aria-hidden="true" />}
            <span className={cn('pr-1.5', t.tone === 'default' && 'pl-0.5')}>{t.message}</span>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="rounded-full bg-white/15 px-3 py-1.5 text-footnote font-semibold text-[#64D2FF] hover:bg-white/25"
              >
                {t.action.label}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
