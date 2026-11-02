import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import type { ThemePreference } from '@/types';
import { cn } from '@/lib/utils';

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/** Segmented control for choosing the theme. */
export function ThemeToggle({ className, showLabels = false }: { className?: string; showLabels?: boolean }) {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Colour theme" className={cn('inline-flex items-center gap-1 rounded-xl bg-muted p-1', className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active && 'bg-background text-foreground shadow-sm',
              !showLabels && 'w-8 px-0',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {showLabels && label}
          </button>
        );
      })}
    </div>
  );
}

/** Single button that cycles light → dark → system (compact header use). */
export function ThemeCycleButton({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const next: ThemePreference = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const Icon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme}. Switch to ${next}`}
      className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
