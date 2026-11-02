import { Link, NavLink, useLocation } from 'react-router-dom';
import { TABS, activeTab } from '@/data/navigation';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/lib/utils';

/** iPad-style sidebar: the five tabs, with the current tab's screens nested beneath it. */
export function Sidebar() {
  const { pathname } = useLocation();
  const current = activeTab(pathname);
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-separator/70 bg-card/60 lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 pb-6">
        <ul className="space-y-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isTab = current.to === tab.to;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  aria-current={pathname === tab.to ? 'page' : undefined}
                  className={cn('flex h-10 items-center gap-3 rounded-[0.625rem] px-3 text-body transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', isTab && 'bg-primary text-primary-foreground hover:bg-primary')}
                >
                  <Icon className={cn('h-5 w-5', !isTab && 'text-primary')} strokeWidth={2} aria-hidden="true" />
                  {tab.label}
                </Link>
                {isTab && tab.children.length > 0 && (
                  <ul className="mb-2 mt-1 space-y-0.5 pl-4">
                    {tab.children.map(({ to, label }) => (
                      <li key={to}>
                        <NavLink
                          to={to}
                          className={({ isActive }) => cn('flex h-9 items-center rounded-lg pl-6 pr-3 text-subhead text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', isActive && 'bg-accent font-semibold text-foreground')}
                        >
                          {label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
