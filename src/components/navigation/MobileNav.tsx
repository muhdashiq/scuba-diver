import { Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MOBILE_PRIMARY, NAV_ITEMS } from '@/data/navigation';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Logo } from '@/components/common/Logo';
import { ThemeCycleButton, ThemeToggle } from '@/components/common/ThemeToggle';
import { NavList } from './Sidebar';
import { cn } from '@/lib/utils';

export function MobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-3 backdrop-blur-xl lg:hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open navigation menu"
        aria-haspopup="dialog"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <Logo />
      <ThemeCycleButton />
    </header>
  );
}

export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="left" className="flex flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Logo />
        </div>
        <DialogTitle className="sr-only">Navigation menu</DialogTitle>
        <DialogDescription className="sr-only">Choose a section of ScubaDive</DialogDescription>
        <div className="flex-1 overflow-y-auto p-3">
          <NavList onNavigate={() => onOpenChange(false)} />
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">Theme</span>
          <ThemeToggle showLabels />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BottomTabBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const items = MOBILE_PRIMARY.map((to) => NAV_ITEMS.find((i) => i.to === to)!).filter(Boolean);
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ to, short, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn('flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', isActive && 'text-primary')
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn('flex h-7 w-12 items-center justify-center rounded-full transition-colors', isActive && 'bg-primary/15')}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {short}
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li>
          <button type="button" onClick={onOpenMenu} className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" aria-haspopup="dialog">
            <span className="flex h-7 w-12 items-center justify-center rounded-full">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </span>
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  return { open, setOpen, openMenu: () => setOpen(true) };
}
