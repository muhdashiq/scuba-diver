import { motion } from 'framer-motion';
import {
  Anchor,
  ArrowRight,
  Award,
  BrainCircuit,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  Mountain,
  Route,
  Sparkles,
  Store,
  Trophy,
  Waves,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { UnderwaterScene } from '@/components/illustrations/UnderwaterScene';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/common/ProgressRing';
import { WeatherSummaryCard } from '@/components/weather/WeatherSummaryCard';
import { DiveShopCard } from '@/components/dive-shops/DiveShopCard';
import { LessonIllustration } from '@/components/illustrations/LessonIllustration';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useDiveShops } from '@/hooks/useDiveShops';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress, READINESS_COPY } from '@/utils/checklist';
import { CERTIFICATION_LABELS } from '@/utils/divePlanner';
import { formatDepth } from '@/utils/units';
import { QUIZ_CATEGORIES } from '@/data/quizQuestions';
import { cn } from '@/lib/utils';

const QUICK_LINKS = [
  { to: '/open-water', title: 'Open Water', desc: '15 core lessons', icon: Waves, illustration: 'diver' as const },
  { to: '/advanced-open-water', title: 'Advanced Open Water', desc: '10 adventure modules', icon: Mountain, illustration: 'profile' as const },
  { to: '/specialties', title: 'Specialties', desc: '17 specialty previews', icon: Sparkles, illustration: 'nitrox' as const },
  { to: '/quiz', title: 'Knowledge Quiz', desc: 'Test yourself', icon: BrainCircuit, illustration: 'signals' as const },
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
  const lastLocation = useAppStore((s) => s.lastLocation);
  const progress = useLearningProgress();
  const readiness = computeChecklistProgress(CHECKLIST, checklist);
  const shops = useDiveShops(lastLocation, 25);

  const upcoming = useMemo(
    () =>
      plans
        .filter((p) => p.input.dateTime && new Date(p.input.dateTime).getTime() >= Date.now() - 6 * 3600 * 1000)
        .sort((a, b) => a.input.dateTime.localeCompare(b.input.dateTime))
        .slice(0, 3),
    [plans],
  );
  const avgQuiz = quizHistory.length ? Math.round(quizHistory.reduce((s, r) => s + r.percentage, 0) / quizHistory.length) : null;
  const readinessTone = readiness.status === 'critical-outstanding' ? 'destructive' : readiness.status === 'checklist-complete' ? 'success' : 'warning';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="ocean-gradient relative min-h-[300px] overflow-hidden rounded-3xl text-white shadow-2xl shadow-cyan-950/30 sm:min-h-[340px]">
        <UnderwaterScene />
        <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-6 sm:p-8 lg:max-w-[62%]">
          <div className="space-y-3">
            <Badge variant="glass">
              <Award /> {CERTIFICATION_LABELS[profile.certification]}
              {profile.agency && ` · ${profile.agency}`}
            </Badge>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {greeting()}
              {profile.name ? `, ${profile.name}` : ''}.
            </motion.h1>
            <p className="max-w-md text-cyan-50/90">
              Learn, check, plan and explore — your smart diving companion for every stage of your underwater journey.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ocean" size="lg">
              <Link to="/planner">
                <Route /> Plan a dive
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25">
              <Link to="/readiness">
                <ClipboardCheck /> Pre-dive check
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Your diving at a glance" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile icon={Anchor} label="Dives logged" value={String(profile.completedDives)} sub={profile.completedDives ? 'Keep exploring' : 'Update in profile'} to="/profile" />
        <Card className="col-span-1 flex items-center gap-3 p-4">
          <ProgressRing value={progress.overall.percent} size={64} stroke={7} label={`Learning progress ${progress.overall.percent}%`}>
            <span className="text-sm font-bold tabular">{progress.overall.percent}%</span>
          </ProgressRing>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Learning</p>
            <p className="text-sm font-semibold">{progress.overall.done}/{progress.overall.total} modules</p>
          </div>
        </Card>
        <StatTile
          icon={ClipboardCheck}
          label="Dive readiness"
          value={`${readiness.percent}%`}
          sub={READINESS_COPY[readiness.status].title}
          tone={readinessTone}
          to="/readiness"
        />
        <StatTile icon={Trophy} label="Quiz average" value={avgQuiz !== null ? `${avgQuiz}%` : '—'} sub={`${quizHistory.length} quiz${quizHistory.length === 1 ? '' : 'zes'} taken`} to="/quiz" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Learning progress */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" /> Learning progress</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/learn">All courses <ArrowRight /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: 'Open Water', ...progress.openWater, to: '/open-water' },
              { label: 'Advanced Open Water', ...progress.advanced, to: '/advanced-open-water' },
              { label: 'Specialties', ...progress.specialties, to: '/specialties' },
            ].map((row) => (
              <Link key={row.label} to={row.to} className="block space-y-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{row.label}</span>
                  <span className="tabular text-muted-foreground">{row.done}/{row.total}</span>
                </div>
                <Progress value={row.percent} aria-label={`${row.label} progress`} />
              </Link>
            ))}
            {progress.nextLesson && (
              <div className="flex items-center gap-4 rounded-2xl bg-secondary/60 p-3">
                <LessonIllustration k={progress.nextLesson.illustration} compact className="h-16 w-24 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Up next</p>
                  <p className="truncate font-semibold">{progress.nextLesson.title}</p>
                </div>
                <Button asChild size="sm"><Link to={`/open-water/${progress.nextLesson.id}`}>Start</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>

        <WeatherSummaryCard location={lastLocation} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming plans */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-5 w-5 text-primary" aria-hidden="true" /> Upcoming dive plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>No upcoming plans yet.</p>
                <Button asChild variant="outline" size="sm"><Link to="/planner"><Route /> Create a plan</Link></Button>
              </div>
            ) : (
              upcoming.map((p) => (
                <Link key={p.id} to={`/planner?plan=${p.id}`} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-[10px] font-bold uppercase">{new Date(p.input.dateTime).toLocaleDateString([], { month: 'short' })}</span>
                    <span className="text-sm font-extrabold leading-none">{new Date(p.input.dateTime).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.input.site}</p>
                    <p className="text-xs text-muted-foreground">{formatDepth(p.input.maxDepth, units)} · {p.input.bottomTime} min · {p.input.diveType}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Nearby shops */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base"><Store className="h-5 w-5 text-primary" aria-hidden="true" /> Nearby dive shops</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/dive-shops">Map view <ArrowRight /></Link></Button>
          </CardHeader>
          <CardContent>
            {!lastLocation && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Set a location to discover dive centres listed on OpenStreetMap.</p>
                <Button asChild variant="outline" size="sm"><Link to="/dive-shops"><MapPin /> Find dive shops</Link></Button>
              </div>
            )}
            {lastLocation && shops.status === 'loading' && <p className="text-sm text-muted-foreground" role="status">Searching near {lastLocation.name}…</p>}
            {lastLocation && shops.status === 'error' && <p className="text-sm text-muted-foreground">Couldn’t load dive shops right now. <Link className="text-primary underline" to="/dive-shops">Try on the dive shops page</Link>.</p>}
            {shops.data && shops.data.length === 0 && <p className="text-sm text-muted-foreground">No dive shops listed within 25 km of {lastLocation?.name}.</p>}
            {shops.data && shops.data.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {shops.data.slice(0, 3).map((s) => <DiveShopCard key={s.id} shop={s} compact />)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick access */}
      <section className="space-y-4" aria-labelledby="quick-access">
        <h2 id="quick-access" className="text-xl font-bold">Quick access</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {QUICK_LINKS.map(({ to, title, desc, icon: Icon, illustration }) => (
            <motion.div key={to} whileHover={{ y: -4 }}>
              <Link to={to} className="group block overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <LessonIllustration k={illustration} compact className="aspect-[16/9]" />
                <div className="flex items-center gap-2 p-3">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold group-hover:text-primary">{title}</p>
                    <p className="truncate text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent quizzes */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-5 w-5 text-primary" aria-hidden="true" /> Recent quiz results</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link to="/quiz">Take a quiz <ArrowRight /></Link></Button>
        </CardHeader>
        <CardContent>
          {quizHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quizzes yet — test your knowledge before your next dive.</p>
          ) : (
            <ul className="divide-y">
              {quizHistory.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <span className={cn('flex h-10 w-14 items-center justify-center rounded-xl text-sm font-extrabold tabular', r.percentage >= 70 ? 'bg-success/15 text-success' : r.percentage >= 50 ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive')}>
                    {r.percentage}%
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {r.categories === 'all' ? 'All categories' : r.categories.map((c) => QUIZ_CATEGORIES.find((q) => q.id === c)?.label).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.correct}/{r.total} correct · {r.difficulty} · {r.timed ? 'timed' : 'untimed'} · {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub, to, tone }: { icon: typeof Anchor; label: string; value: string; sub: string; to: string; tone?: 'success' | 'warning' | 'destructive' }) {
  const toneCls = tone === 'success' ? 'text-success bg-success/15' : tone === 'warning' ? 'text-warning bg-warning/15' : tone === 'destructive' ? 'text-destructive bg-destructive/15' : 'text-primary bg-primary/10';
  return (
    <Link to={to} className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="flex h-full items-center gap-3 p-4 transition-shadow group-hover:shadow-md">
        <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', toneCls)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold tabular leading-tight">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{sub}</p>
        </div>
      </Card>
    </Link>
  );
}
