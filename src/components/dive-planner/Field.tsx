import { useId, type ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Field({ label, error, hint, children, className, htmlFor }: { label: string; error?: string; hint?: string; children: ReactNode; className?: string; htmlFor: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-err`} className="text-xs font-medium text-destructive" role="alert">{error}</p>
      ) : (
        hint && <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/** Numeric input with a unit suffix. Value is in display units. */
export function NumberField({ label, value, onChange, unit, error, hint, min, max, step = 1, className }: { label: string; value: number; onChange: (v: number) => void; unit?: string; error?: string; hint?: string; min?: number; max?: number; step?: number; className?: string }) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} htmlFor={id} className={className}>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ''}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={cn(unit && 'pr-14', 'tabular')}
        />
        {unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
    </Field>
  );
}
