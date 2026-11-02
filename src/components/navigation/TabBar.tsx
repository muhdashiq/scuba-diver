import { Link, useLocation } from 'react-router-dom';
import { TABS, activeTab } from '@/data/navigation';
import { cn } from '@/lib/utils';

/** iOS tab bar: five destinations, always within thumb reach. */
export function TabBar() {
  const { pathname } = useLocation();
  const current = activeTab(pathname);
  return (
    <nav aria-label="Tab bar" className="bar-material fixed inset-x-0 bottom-0 z-40 border-t border-separator/70 lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5 safe-bottom">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = current.to === to;
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className={cn('flex h-[3.25rem] flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium tracking-tight text-muted-foreground transition-colors active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', active && 'text-primary')}
              >
                <Icon className="h-[25px] w-[25px]" strokeWidth={active ? 2.3 : 1.8} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
