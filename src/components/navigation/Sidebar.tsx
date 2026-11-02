import { NavLink } from 'react-router-dom';
import { NAV_GROUP_LABELS, NAV_ITEMS, type NavItem } from '@/data/navigation';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

function groupItems() {
  const groups = new Map<NavItem['group'], NavItem[]>();
  NAV_ITEMS.forEach((i) => groups.set(i.group, [...(groups.get(i.group) ?? []), i]));
  return [...groups.entries()];
}

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main navigation" className="space-y-5">
      {groupItems().map(([group, items]) => (
        <div key={group} className="space-y-1">
          {NAV_GROUP_LABELS[group] && <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{NAV_GROUP_LABELS[group]}</p>}
          <ul className="space-y-0.5">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive && 'bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-background', isActive && 'bg-primary text-primary-foreground group-hover:bg-primary')}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r bg-card/80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavList />
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3">
        <span className="text-xs font-medium text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
