import type { GasEstimate, UnitSystem } from '@/types';
import { formatGasVolume, formatPressure } from '@/utils/units';
import { cn } from '@/lib/utils';

/** Visual bar of estimated gas use vs. usable gas above reserve. */
export function GasChart({ gas, units, reserve }: { gas: GasEstimate; units: UnitSystem; reserve: number }) {
  const total = gas.usableGasLitres;
  const pct = total > 0 ? Math.min(100, (gas.estimatedUseLitres / total) * 100) : 100;
  const over = !gas.withinReserve;
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estimated use</p>
          <p className="text-xl font-extrabold tabular">{formatGasVolume(gas.estimatedUseLitres, units)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Usable above reserve</p>
          <p className="text-xl font-extrabold tabular">{formatGasVolume(total, units)}</p>
        </div>
      </div>
      <div className="relative h-5 overflow-hidden rounded-full bg-secondary" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Estimated gas use as a percentage of usable gas">
        <div className={cn('h-full rounded-full transition-[width] duration-700', over ? 'bg-destructive' : pct > 80 ? 'bg-warning' : 'bg-gradient-to-r from-cyan-500 to-teal-400')} style={{ width: `${pct}%` }} />
      </div>
      <ul className="flex flex-wrap gap-2 text-xs">
        {gas.byPhase.map((p) => (
          <li key={p.phase} className="rounded-full bg-muted px-2.5 py-1 font-medium">{p.phase}: {formatGasVolume(p.litres, units)}</li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Estimated end pressure ≈ <strong className={cn('tabular', over ? 'text-destructive' : 'text-foreground')}>{formatPressure(Math.max(0, gas.estimatedEndPressure), units)}</strong> (planned reserve {formatPressure(reserve, units)}).
      </p>
    </div>
  );
}
