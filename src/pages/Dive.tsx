import { CalendarClock, ClipboardCheck, CloudSun, Route, Trash2 } from 'lucide-react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { EmptyState } from '@/components/common/States';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useWeather } from '@/hooks/useWeather';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress, READINESS_COPY } from '@/utils/checklist';
import { formatDepth, formatTemp } from '@/utils/units';
import { describeWeatherCode } from '@/utils/weather';
import { DIVE_TYPE_LABELS } from '@/utils/planSummary';
import { confirm } from '@/lib/confirm';
import { toast } from '@/lib/toast';
import type { SavedDivePlan } from '@/types';

export default function Dive() {
  const plans = useAppStore((s) => s.savedPlans);
  const deletePlan = useAppStore((s) => s.deletePlan);
  const units = useAppStore((s) => s.units);
  const checklist = useAppStore((s) => s.checklist);
  const location = useAppStore((s) => s.lastLocation);
  const weather = useWeather(location);
  const readiness = computeChecklistProgress(CHECKLIST, checklist);
  const now = Date.now();
  const upcoming = plans.filter((p) => p.input.dateTime && new Date(p.input.dateTime).getTime() >= now - 3 * 3600e3).sort((a, b) => a.input.dateTime.localeCompare(b.input.dateTime));
  const past = plans.filter((p) => !upcoming.includes(p));

  const remove = async (p: SavedDivePlan) => {
    if (!(await confirm({ title: `Delete “${p.input.site}”?`, message: 'This dive plan will be removed from this device.', confirmLabel: 'Delete Plan', destructive: true }))) return;
    deletePlan(p.id);
    toast('Plan deleted', { action: { label: 'Undo', onClick: () => useAppStore.setState((s) => ({ savedPlans: [p, ...s.savedPlans] })) } });
  };

  const planRow = (p: SavedDivePlan) => (
    <ListRow
      key={p.id}
      to={`/planner?plan=${p.id}`}
      leading={<IconTile icon={CalendarClock} color="bg-primary" />}
      title={p.input.site}
      subtitle={`${p.input.dateTime ? new Date(p.input.dateTime).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'No date'} · ${formatDepth(p.input.maxDepth, units)} · ${DIVE_TYPE_LABELS[p.input.diveType]}`}
      chevron={false}
      trailing={
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(p); }} aria-label={`Delete plan ${p.input.site}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-[18px] w-[18px]" />
        </button>
      }
    />
  );

  return (
    <>
      <ScreenHeader title="Dive" subtitle="Plan, check and go — with your buddy." />
      <div className="space-y-8">
        <ListGroup>
          <ListRow to="/planner" leading={<IconTile icon={Route} color="bg-primary" size="lg" />} separatorInset="4.75rem" title="Plan a Dive" subtitle="Profile, gas estimate and safety reminders" />
          <ListRow to="/readiness" leading={<IconTile icon={ClipboardCheck} color="bg-[#34C759]" size="lg" />} separatorInset="4.75rem" title="Readiness Check" subtitle={`${readiness.percent}% reviewed · ${READINESS_COPY[readiness.status].title}`} />
          <ListRow
            to="/weather"
            leading={<IconTile icon={CloudSun} color="bg-[#32ADE6]" size="lg" />}
            separatorInset="4.75rem"
            title="Weather & Conditions"
            subtitle={!location ? 'Choose a location' : weather.data ? `${location.name} · ${formatTemp(weather.data.current.temperature, units)}, ${describeWeatherCode(weather.data.current.weatherCode, weather.data.current.isDay).label}` : location.name}
          />
        </ListGroup>

        {plans.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No dive plans yet" message="Create a plan to see your dive profile, estimate gas and keep safety reminders handy." action={<Button asChild><Link to="/planner">Plan a Dive</Link></Button>} />
        ) : (
          <>
            {upcoming.length > 0 && <ListGroup title="Upcoming">{upcoming.map(planRow)}</ListGroup>}
            {past.length > 0 && <ListGroup title="Saved plans">{past.map(planRow)}</ListGroup>}
          </>
        )}

        <p className="px-4 text-footnote text-muted-foreground">ScubaDive’s planner is educational. It doesn’t calculate decompression and never clears you to dive — agree every plan with your buddy and dive professional.</p>
      </div>
    </>
  );
}
