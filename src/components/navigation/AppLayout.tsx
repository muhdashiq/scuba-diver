import { motion, useReducedMotion } from 'framer-motion';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageSkeleton } from '@/components/common/States';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Sidebar } from './Sidebar';
import { BottomTabBar, MobileHeader, MobileMenu, useMobileMenu } from './MobileNav';

export function AppLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const menu = useMobileMenu();
  return (
    <div className="page-backdrop min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <ScrollToTop />
      <Sidebar />
      <MobileHeader onOpenMenu={menu.openMenu} />
      <MobileMenu open={menu.open} onOpenChange={menu.setOpen} />
      <div className="lg:pl-72">
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 pb-28 pt-4 focus:outline-none sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          {/* Enter-only transition: an exit animation would re-render the new Outlet inside the old wrapper. */}
          <Suspense fallback={<PageSkeleton />}>
            <motion.div
              key={location.pathname}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
          <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
            <p>
              ScubaDive is an educational companion. It is not a substitute for training by a qualified instructor, a dive computer, or the procedures of a recognised training agency.
              Weather data: Open-Meteo. Map data © OpenStreetMap contributors.
            </p>
          </footer>
        </main>
      </div>
      <BottomTabBar onOpenMenu={menu.openMenu} />
    </div>
  );
}
