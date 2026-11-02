import { useId, type ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

/** iOS form section: a titled inset group of rows. */
export function FormSection({ title, footer, children }: { title?: string; footer?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-1.5">
      {title && <h2 className="px-4 text-footnote font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>}
      <div className="form-group overflow-hidden rounded-2xl bg-card">{children}</div>
      {footer && <p className="px-4 text-footnote text-muted-foreground">{footer}</p>}
    </section>
  );
}

function RowShell({ label, htmlFor, error, hint, children, stacked }: { label: string; htmlFor: string; error?: string; hint?: string; children: ReactNode; stacked?: boolean }) {
  return (
    <div className="relative px-4 py-2.5">
      <div className={cn('flex min-h-7 gap-3', stacked ? 'flex-col gap-1.5' : 'items-center justify-between')}>
        <label htmlFor={htmlFor} className="shrink-0 text-body">{label}</label>
        {children}
      </div>
      {error ? (
        <p id={`${htmlFor}-err`} className="mt-1 text-footnote text-destructive" role="alert">{error}</p>
      ) : (
        hint && <p id={`${htmlFor}-hint`} className="mt-1 text-footnote text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/** Number input aligned right with a unit, like iOS settings. Value is in display units. */
export function NumberRow({ label, value, onChange, unit, error, hint, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; unit?: string; error?: string; hint?: string; min?: number; max?: number; step?: number }) {
  const id = useId();
  return (
    <RowShell label={label} htmlFor={id} error={error} hint={hint}>
      <div className={cn('flex items-center gap-1 rounded-lg px-2 py-1 transition-colors focus-within:bg-fill', error && 'bg-destructive/10')}>
        <input
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
          className="w-20 bg-transparent text-right text-body tabular text-muted-foreground focus:text-foreground focus:outline-none"
        />
        {unit && <span className="text-body text-muted-foreground">{unit}</span>}
      </div>
    </RowShell>
  );
}

export function SelectRow<T extends string>({ label, value, onChange, options, hint }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; hint?: string }) {
  const id = useId();
  return (
    <RowShell label={label} htmlFor={id} hint={hint}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="min-w-0 max-w-[60%] cursor-pointer appearance-none truncate rounded-lg bg-transparent bg-[length:12px] bg-[right_0.5rem_center] bg-no-repeat py-1 pl-2 pr-7 text-right text-body text-muted-foreground hover:bg-fill focus:bg-fill focus:outline-none bg-[url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 15 5 5 5-5M7 9l5-5 5 5'/%3E%3C/svg%3E&quot;)]"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </RowShell>
  );
}

export function TextRow({ label, value, onChange, placeholder, error, type = 'text', stacked }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string; type?: string; stacked?: boolean }) {
  const id = useId();
  return (
    <RowShell label={label} htmlFor={id} error={error} stacked={stacked}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn('min-w-0 bg-transparent text-body placeholder:text-muted-foreground/70 focus:outline-none', stacked ? 'w-full' : 'flex-1 text-right text-muted-foreground focus:text-foreground')}
      />
    </RowShell>
  );
}

export function SwitchRow({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <RowShell label={label} htmlFor={id} hint={hint}>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </RowShell>
  );
}
