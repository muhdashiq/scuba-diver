import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Bubbles } from '@/components/illustrations/Bubbles';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  eyebrow?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Ocean-gradient page banner used at the top of every section. */
export function PageHeader({ title, description, icon: Icon, eyebrow, actions, children, className }: PageHeaderProps) {
  return (
    <header className={cn('ocean-gradient relative overflow-hidden rounded-3xl px-5 py-7 text-white shadow-xl shadow-cyan-950/20 sm:px-8 sm:py-9', className)}>
      <Bubbles count={8} />
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{eyebrow}</p>}
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
            {Icon && (
              <span className="rounded-2xl bg-white/15 p-2 ring-1 ring-white/25 backdrop-blur">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
              </span>
            )}
            {title}
          </motion.h1>
          {description && <p className="text-sm text-cyan-50/90 sm:text-base">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children && <div className="relative mt-5">{children}</div>}
    </header>
  );
}
