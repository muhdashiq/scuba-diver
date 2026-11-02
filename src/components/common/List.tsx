import { ChevronRight, type LucideIcon } from 'lucide-react';
import type React from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** Inset grouped list (iOS Settings style). */
export function ListGroup({ title, footer, action, children, className, ...rest }: { title?: ReactNode; footer?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; 'aria-live'?: 'polite' }) {
  return (
    <section className={cn('space-y-1.5', className)} {...rest}>
      {(title || action) && (
        <div className="flex items-end justify-between px-4">
          {title && <h2 className="text-footnote font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>}
          {action}
        </div>
      )}
      <ul className="list-group overflow-hidden rounded-2xl bg-card">{children}</ul>
      {footer && <p className="px-4 text-footnote text-muted-foreground">{footer}</p>}
    </section>
  );
}

/** Coloured rounded-square icon tile (like Settings app icons). */
export function IconTile({ icon: Icon, color = 'bg-primary', size = 'md' }: { icon: LucideIcon; color?: string; size?: 'md' | 'lg' }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center text-white', color, size === 'md' ? 'h-[1.875rem] w-[1.875rem] rounded-[0.5rem]' : 'h-11 w-11 rounded-xl')}>
      <Icon className={size === 'md' ? 'h-[18px] w-[18px]' : 'h-6 w-6'} strokeWidth={2.1} aria-hidden="true" />
    </span>
  );
}

interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  value?: ReactNode;
  trailing?: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  chevron?: boolean;
  destructive?: boolean;
  className?: string;
  ariaLabel?: string;
  /** Left inset of the separator line; defaults to align with the text. */
  separatorInset?: string;
}

/** A single row. Becomes a link or button when `to`, `href` or `onClick` is set. */
export function ListRow({ title, subtitle, leading, value, trailing, to, href, onClick, chevron, destructive, className, ariaLabel, separatorInset }: ListRowProps) {
  const interactive = !!(to || href || onClick);
  const content = (
    <>
      {leading}
      <span className="min-w-0 flex-1 py-0.5">
        <span className={cn('block truncate text-body', destructive && 'text-destructive')}>{title}</span>
        {subtitle && <span className="mt-0.5 block text-footnote text-muted-foreground">{subtitle}</span>}
      </span>
      {value !== undefined && <span className="shrink-0 text-body text-muted-foreground tabular">{value}</span>}
      {trailing}
      {(chevron ?? (interactive && !onClick)) && <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/60" strokeWidth={2.4} aria-hidden="true" />}
    </>
  );
  const style = { '--sep-inset': separatorInset ?? (leading ? '3.625rem' : '1rem') } as React.CSSProperties;
  const cls = cn('relative flex min-h-[2.875rem] w-full items-center gap-3 px-4 py-2 text-left', interactive && 'transition-colors hover:bg-accent/60 active:bg-accent focus-visible:bg-accent focus-visible:outline-none', className);
  return (
    <li>
      {to ? (
        <Link to={to} className={cls} style={style} aria-label={ariaLabel}>{content}</Link>
      ) : href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style} aria-label={ariaLabel}>{content}</a>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={cls} style={style} aria-label={ariaLabel}>{content}</button>
      ) : (
        <div className={cls} style={style}>{content}</div>
      )}
    </li>
  );
}

/** Section heading with optional trailing "See all" style action. */
export function SectionTitle({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-end justify-between gap-3 px-1 pb-2', className)}>
      <h2 className="text-title3">{children}</h2>
      {action}
    </div>
  );
}

export function SeeAll({ to, label = 'See All' }: { to: string; label?: string }) {
  return (
    <Link to={to} className="rounded-md text-body text-primary hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {label}
    </Link>
  );
}
