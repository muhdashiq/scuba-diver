import { Search, XCircle } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const SearchField = forwardRef<HTMLInputElement, { value: string; onChange: (v: string) => void; placeholder?: string; label?: string; className?: string; autoFocus?: boolean }>(
  ({ value, onChange, placeholder = 'Search', label = 'Search', className, autoFocus }, ref) => (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={2.2} aria-hidden="true" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoFocus={autoFocus}
        className="h-10 w-full rounded-[0.625rem] bg-fill pl-9 pr-9 text-body placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-muted-foreground">
          <XCircle className="h-[18px] w-[18px] fill-muted-foreground/30 text-muted-foreground" aria-hidden="true" />
        </button>
      )}
    </div>
  ),
);
SearchField.displayName = 'SearchField';
