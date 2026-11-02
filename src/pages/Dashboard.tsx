import { motion } from 'framer-motion';
import { Bell, BookOpen, BrainCircuit, ChevronRight, ClipboardCheck, CloudSun, GraduationCap, MapPin, Route, Store, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHeader, BarButton } from '@/components/common/ScreenHeader';
import { Avatar } from '@/components/common/Avatar';
import { ListGroup, ListRow, IconTile, SectionTitle, SeeAll } from '@/components/common/List';
import { ProgressRing } from '@/components/common/ProgressRing';
import { PullToRefresh } from '@/components/common/PullToRefresh';
import { UnderwaterScene } from '@/components/illustrations/UnderwaterScene';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { NotificationsSheet } from '@/components/notifications/NotificationsSheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useWeather } from '@/hooks/useWeather';
import { useDiveShops } from '@/hooks/useDiveShops';
import { useNotifications } from '@/hooks/useNotifications';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress, READINESS_COPY } from '@/utils/checklist';
import { formatDepth, formatTemp } from '@/utils/units';
import { assessConditions, describeWeatherCode, overallRating, RATING_LABEL } from '@/utils/weather';
import { formatDistance } from '@/utils/geo';
import { DIVE_TYPE_LABELS } from '@/utils/planSummary';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { to: '/planner', label: 'Plan', icon: Route, color: 'bg-primary' },
  { to: '/readiness', label: 'Check', icon: ClipboardCheck, color: 'bg-[#34C759]' },
  { to: '/weather', label: 'Weather', icon: CloudSun, color: 'bg-[#32ADE6]' },
  { to: '/quiz', label: 'Quiz', icon: BrainCircuit, color: 'bg-[#FF9500]' },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard() {
  const profile = useAppStore((s) => s.profile);
  const units = useAppStore((s) => s.units);
  const checklist = useAppStore((s) => s.checklist);
  const plans = useAppStore((s) => s.savedPlans);
  const quizHistory = useAppStore((s) => s.quizHistory);
  const location = useAppStore((s) => s.lastLocation);
  const learning = useLearningProgress();
  const readiness = computeChecklistProgress(CHECKLIST, checklist);
  const weather = useWeather(location);
  const shops = useDiveShops(location, 25);
  const notifications = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const nextDive = useMemo(
    () => plans.filter((p) => p.input.dateTime && new Date(p.input.dateTime).getTime() >= Date.now() - 3 * 3600e3).sort((a, b) => a.input.dateTime.localeCompare(b.input.dateTime))[0],
    [plans],
  );
  const avgQuiz = quizHistory.length ? Math.round(quizHistory.slice(0, 5).reduce((s, r) => s + r.percentage, 0) / Math.min(5, quizHistory.length)) : null;
  const w = weather.data;
  const rating = w ? overallRating(assessConditions(w.current, w.marine, units, w.daily[0])) : null;
  const firstName = profile.name.split(' ')[0];

  return (
    <PullToRefresh onRefresh={() => { weather.refetch(); shops.refetch(); }}>
      <ScreenHeader
        eyebrow={new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
        title={firstName ? `${greeting()}, ${firstName}` : greeting()}
        actions={
          <>
            <BarButton label="Notifications" badge={notifications.unread} onClick={() => setShowNotifications(true)}>
              <Bell aria-hidden="true" />
            </BarButton>
            <Link to="/profile" aria-label="Profile" className="pressable ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar name={profile.name} size={34} />
            </Link>
          </>
        }
      />

      <div className="space-y-8">
        {/* Featured: next dive (Wallet-style card) */}
        <Link to={nextDive ? `/planner?plan=${nextDive.id}` : '/planner'} className="group block rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <motion.div whileTap={{ scale: 0.985 }} className="relative h-48 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#0A84FF] via-[#0071E3] to-[#0B3B55] text-white sm:h-52">
            <UnderwaterScene showDiver={false} minimal />
            <div className="relative z-10 flex h-full flex-col justify-between p-5">
              <p className="text-footnote font-semibold uppercase tracking-wide text-white/80">{nextDive ? 'Next dive' : 'Ready when you are'}</p>
              {nextDive ? (
                <div>
                  <p className="text-title1 leading-tight">{nextDive.input.site}</p>
                  <p className="mt-1 text-subhead text-white/85">
                    {new Date(nextDive.input.dateTime).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {formatDepth(nextDive.input.maxDepth, units)} · {DIVE_TYPE_LABELS[nextDive.input.diveType]}
                  </p>
                </div>
              ) : (
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-title1 leading-tight">Plan your next dive</p>
                    <p className="mt-1 text-subhead text-white/85">Profile, gas estimate and safety reminders.</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-0.5">
                    <ChevronRight className="h-6 w-6" strokeWidth={2.4} aria-hidden="true" />
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </Link>

        {/* Quick actions */}
        <nav aria-label="Quick actions" className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className="pressable flex flex-col items-center gap-1.5 rounded-2xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className={cn('flex h-14 w-14 items-center justify-center rounded-full text-white', color)}>
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="text-footnote font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Summary tiles (Health-style) */}
        <section aria-labelledby="summary-h">
          <SectionTitle><span id="summary-h">Summary</span></SectionTitle>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryTile to="/readiness" icon={ClipboardCheck} label="Readiness" color="text-[#248A3D] dark:text-[#30D158]">
              <div className="flex items-center gap-3">
                <ProgressRing value={readiness.percent} size={44} stroke={5} tone={readiness.status === 'critical-outstanding' ? 'warning' : 'success'} label={`${readiness.percent}% reviewed`}>
                  <span className="text-[11px] font-semibold tabular">{readiness.percent}%</span>
                </ProgressRing>
                <p className="text-footnote leading-snug text-muted-foreground">{READINESS_COPY[readiness.status].title}</p>
              </div>
            </SummaryTile>
            <SummaryTile to="/weather" icon={CloudSun} label="Conditions" color="text-[#0071E3] dark:text-[#64D2FF]">
              {!location ? (
                <p className="text-footnote text-muted-foreground">Set a location to see live conditions.</p>
              ) : !w ? (
                <Skeleton className="h-11 w-full" />
              ) : (
                <div className="flex items-center gap-2">
                  <WeatherIcon icon={describeWeatherCode(w.current.weatherCode, w.current.isDay).icon} className="h-8 w-8" animated={false} />
                  <div>
                    <p className="text-title2 leading-none tabular">{formatTemp(w.current.temperature, units)}</p>
                    <p className={cn('text-footnote font-medium', rating === 'favorable' ? 'text-success' : rating === 'caution' ? 'text-warning' : 'text-destructive')}>{rating && RATING_LABEL[rating]}</p>
                  </div>
                </div>
              )}
            </SummaryTile>
            <SummaryTile to="/learn" icon={GraduationCap} label="Learning" color="text-[#5856D6] dark:text-[#7D7AFF]">
              <p className="text-title2 leading-none tabular">{learning.overall.done}<span className="text-subhead font-normal text-muted-foreground"> / {learning.overall.total}</span></p>
              <p className="mt-1 text-footnote text-muted-foreground">modules completed</p>
            </SummaryTile>
            <SummaryTile to="/quiz" icon={Trophy} label="Quizzes" color="text-[#C93400] dark:text-[#FF9F0A]">
              <p className="text-title2 leading-none tabular">{avgQuiz !== null ? `${avgQuiz}%` : '—'}</p>
              <p className="mt-1 text-footnote text-muted-foreground">{quizHistory.length === 1 ? 'last quiz' : quizHistory.length ? `avg. of last ${Math.min(5, quizHistory.length)}` : 'no quizzes yet'}</p>
            </SummaryTile>
          </div>
        </section>

        {/* Continue learning */}
        {learning.nextLesson && (
          <section aria-labelledby="continue-h">
            <SectionTitle action={<SeeAll to="/open-water" />}><span id="continue-h">Continue learning</span></SectionTitle>
            <Link to={`/open-water/${learning.nextLesson.id}`} className="pressable flex items-center gap-4 rounded-2xl bg-card p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <LessonIllustration k={learning.nextLesson.illustration} compact className="h-16 w-20 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="text-footnote text-muted-foreground">Open Water · Lesson {learning.nextLesson.order}</p>
                <p className="text-headline leading-snug">{learning.nextLesson.title}</p>
                <p className="text-footnote text-muted-foreground">{learning.nextLesson.duration} min</p>
              </div>
              <Button size="sm" variant="tinted" tabIndex={-1} aria-hidden="true">{learning.openWater.done ? 'Resume' : 'Start'}</Button>
            </Link>
          </section>
        )}

        {/* Nearby */}
        <ListGroup title="Nearby dive shops" action={location ? <SeeAll to="/dive-shops" /> : undefined}>
          {!location && <ListRow to="/dive-shops" leading={<IconTile icon={MapPin} color="bg-[#FF9500]" />} title="Find dive centres near you" subtitle="Use your location or search a destination" />}
          {location && shops.status === 'loading' && !shops.data && <ListRow leading={<IconTile icon={Store} color="bg-[#FF9500]" />} title={<Skeleton className="h-4 w-40" />} subtitle={<Skeleton className="mt-1 h-3 w-24" />} />}
          {location && shops.status === 'error' && !shops.data && <ListRow to="/dive-shops" leading={<IconTile icon={Store} color="bg-[#FF9500]" />} title="Couldn’t load dive shops" subtitle="Tap to try again" />}
          {shops.data?.length === 0 && <ListRow to="/dive-shops" leading={<IconTile icon={Store} color="bg-[#FF9500]" />} title="No dive shops listed nearby" subtitle="Try a larger radius" />}
          {shops.data?.slice(0, 3).map((s) => (
            <ListRow key={s.id} to={`/dive-shops?shop=${encodeURIComponent(s.id)}`} leading={<IconTile icon={Store} color="bg-[#FF9500]" />} title={s.name} subtitle={s.address ?? s.tags.join(' · ')} value={formatDistance(s.distanceKm)} />
          ))}
        </ListGroup>

        {/* Recent quiz */}
        {quizHistory[0] && (
          <ListGroup title="Recent activity">
            <ListRow to="/history" leading={<IconTile icon={BrainCircuit} color="bg-[#FF9500]" />} title={`Quiz · ${quizHistory[0].correct}/${quizHistory[0].total} correct`} subtitle={new Date(quizHistory[0].date).toLocaleDateString([], { day: 'numeric', month: 'short' })} value={`${quizHistory[0].percentage}%`} />
            {plans[0] && <ListRow to={`/planner?plan=${plans[0].id}`} leading={<IconTile icon={BookOpen} color="bg-primary" />} title={`Plan · ${plans[0].input.site}`} subtitle={`Saved ${new Date(plans[0].createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}`} />}
          </ListGroup>
        )}
      </div>

      <NotificationsSheet open={showNotifications} onOpenChange={setShowNotifications} items={notifications.items} />
    </PullToRefresh>
  );
}

function SummaryTile({ to, icon: Icon, label, color, children }: { to: string; icon: typeof Bell; label: string; color: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="pressable flex flex-col gap-3 rounded-2xl bg-card p-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className={cn('flex items-center justify-between text-subhead font-semibold', color)}>
        <span className="flex items-center gap-1.5"><Icon className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />{label}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
      </span>
      {children}
    </Link>
  );
}
