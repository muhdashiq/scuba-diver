import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ScreenHeaderProps {
  title: string;
  /** Small caption shown above the large title (e.g. today's date). */
  eyebrow?: string;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
  actions?: ReactNode;
  /** Extra content under the title, e.g. a search field or segmented control. */
  children?: ReactNode;
}

/**
 * iOS-style navigation: a translucent bar with back button + actions, and a large title that
 * collapses into the bar as you scroll.
 */
export function ScreenHeader({ title, eyebrow, subtitle, back, actions, children }: ScreenHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), { rootMargin: '-56px 0px 0px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        className={cn(
          'sticky top-0 z-30 -mx-4 flex h-[calc(2.75rem+env(safe-area-inset-top))] items-end px-2 pb-1 transition-[background-color,border-color] duration-200 sm:-mx-6 lg:-mx-8 lg:px-4',
          collapsed ? 'bar-material border-b border-separator/70' : 'border-b border-transparent',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {back && (
            <Link to={back.to} className="pressable -ml-1 flex h-10 min-w-0 items-center rounded-lg pr-2 text-body text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronLeft className="h-7 w-7 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              <span className="truncate">{back.label}</span>
            </Link>
          )}
        </div>
        <p aria-hidden={!collapsed} className={cn('pointer-events-none absolute inset-x-24 bottom-3 truncate text-center text-headline transition-opacity duration-200', collapsed ? 'opacity-100' : 'opacity-0')}>
          {title}
        </p>
        <div className="flex flex-1 items-center justify-end gap-1">{actions}</div>
      </div>
      <header className="space-y-1 pb-4 pt-1">
        {eyebrow && <p className="text-footnote font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
        <h1 ref={titleRef} className="text-large-title">
          {title}
        </h1>
        {subtitle && <div className="text-subhead text-muted-foreground">{subtitle}</div>}
        {children && <div className="pt-3">{children}</div>}
      </header>
    </>
  );
}

/** Round icon button used in nav bars (SF-Symbols-like). */
export function BarButton({ label, onClick, children, badge, className }: { label: string; onClick?: () => void; children: ReactNode; badge?: number; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={badge ? `${label} (${badge} new)` : label} className={cn('pressable relative flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:h-[22px] [&_svg]:w-[22px]', className)}>
      {children}
      {!!badge && <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-white ring-2 ring-background">{badge}</span>}
    </button>
  );
}
