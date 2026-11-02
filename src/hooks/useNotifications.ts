import { useMemo } from 'react';
import { BookOpen, BrainCircuit, CalendarClock, ClipboardCheck, CloudLightning, Sparkles, type LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CHECKLIST } from '@/data/checklist';
import { computeChecklistProgress } from '@/utils/checklist';
import { useLearningProgress } from './useLearningProgress';
import { useWeather } from './useWeather';
import { assessConditions, overallRating } from '@/utils/weather';

export interface AppNotification {
  id: string;
  icon: LucideIcon;
  color: string;
  title: string;
  body: string;
  to: string;
}

const DAY = 86400e3;

/** In-app reminders derived from the user's own data — no server, no fabricated alerts. */
export function useNotifications() {
  const plans = useAppStore((s) => s.savedPlans);
  const checklist = useAppStore((s) => s.checklist);
  const quizzes = useAppStore((s) => s.quizHistory);
  const read = useAppStore((s) => s.readNotifications);
  const units = useAppStore((s) => s.units);
  const location = useAppStore((s) => s.lastLocation);
  const learning = useLearningProgress();
  const weather = useWeather(location);

  const items = useMemo(() => {
    const out: AppNotification[] = [];
    const now = Date.now();
    const upcoming = plans
      .filter((p) => p.input.dateTime && new Date(p.input.dateTime).getTime() > now && new Date(p.input.dateTime).getTime() - now < 2 * DAY)
      .sort((a, b) => a.input.dateTime.localeCompare(b.input.dateTime))[0];
    if (upcoming) {
      const when = new Date(upcoming.input.dateTime);
      out.push({ id: `dive-${upcoming.id}`, icon: CalendarClock, color: 'bg-primary', title: `Upcoming dive: ${upcoming.input.site}`, body: `${when.toLocaleDateString([], { weekday: 'long' })} at ${when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Review your plan with your buddy.`, to: `/planner?plan=${upcoming.id}` });
      const ready = computeChecklistProgress(CHECKLIST, checklist);
      if (ready.criticalOutstanding.length) {
        out.push({ id: `check-${upcoming.id}`, icon: ClipboardCheck, color: 'bg-[#34C759]', title: 'Pre-dive check outstanding', body: `${ready.criticalOutstanding.length} critical items to review before your dive.`, to: '/readiness' });
      }
    }
    if (weather.data) {
      const rating = overallRating(assessConditions(weather.data.current, weather.data.marine, units, weather.data.daily[0]));
      if (rating === 'unfavorable') out.push({ id: `wx-${weather.data.daily[0]?.date}-${location?.name}`, icon: CloudLightning, color: 'bg-[#FF9500]', title: `Rough conditions near ${location?.name}`, body: 'Today’s forecast shows unfavourable surface conditions. Check with local operators.', to: '/weather' });
    }
    if (learning.nextLesson) {
      out.push({ id: `lesson-${learning.nextLesson.id}`, icon: BookOpen, color: 'bg-[#5856D6]', title: learning.openWater.done ? 'Continue learning' : 'Start your first lesson', body: learning.nextLesson.title, to: `/open-water/${learning.nextLesson.id}` });
    }
    const lastQuiz = quizzes[0] ? new Date(quizzes[0].date).getTime() : 0;
    if (now - lastQuiz > 14 * DAY) {
      out.push({ id: `quiz-${Math.floor(now / (7 * DAY))}`, icon: BrainCircuit, color: 'bg-[#FF9500]', title: 'Keep your knowledge fresh', body: 'A 5-minute quiz before your next dive helps skills stick.', to: '/quiz' });
    }
    if (!out.length) out.push({ id: 'all-clear', icon: Sparkles, color: 'bg-teal', title: 'You’re all caught up', body: 'We’ll remind you here about upcoming dives and checks.', to: '/' });
    return out;
  }, [plans, checklist, quizzes, weather.data, units, location, learning]);

  const unread = items.filter((n) => n.id !== 'all-clear' && !read.includes(n.id)).length;
  return { items, unread };
}
