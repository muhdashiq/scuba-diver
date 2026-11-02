import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { SegmentedControl } from '@/components/ui/segmented';
import type { ThemePreference } from '@/types';

/** Appearance picker: Light / Dark / Automatic. */
export function ThemeToggle({ className }: { className?: string; showLabels?: boolean }) {
  const { theme, setTheme } = useTheme();
  return (
    <SegmentedControl<ThemePreference>
      label="Appearance"
      className={className}
      value={theme}
      onChange={setTheme}
      options={[
        { value: 'light', label: <><Sun /> Light</>, ariaLabel: 'Light theme' },
        { value: 'dark', label: <><Moon /> Dark</>, ariaLabel: 'Dark theme' },
        { value: 'system', label: <><Monitor /> Auto</>, ariaLabel: 'System theme' },
      ]}
    />
  );
}
