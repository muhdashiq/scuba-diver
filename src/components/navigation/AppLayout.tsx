import { motion, useReducedMotion } from 'framer-motion';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageSkeleton } from '@/components/common/States';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Toaster } from '@/components/common/Toaster';
import { ConfirmHost } from '@/components/common/ConfirmHost';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';

export function AppLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const onboarded = useAppStore((s) => s.onboarded);
  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <ScrollToTop />
      <Sidebar />
      <div className="lg:pl-64">
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] focus:outline-none sm:px-6 lg:px-8 lg:pb-12">
          {/* Enter-only transition: an exit animation would re-render the new Outlet inside the old wrapper. */}
          <Suspense fallback={<PageSkeleton />}>
            <motion.div key={location.pathname} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
      <TabBar />
      <Toaster />
      <ConfirmHost />
      {!onboarded && <Onboarding />}
    </div>
  );
}
