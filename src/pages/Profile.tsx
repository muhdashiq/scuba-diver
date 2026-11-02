import { CalendarClock, Heart, History, MapPin, Settings } from 'lucide-react';
import { useState } from 'react';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { Avatar } from '@/components/common/Avatar';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { EditProfileSheet, EXPERIENCE_LABELS } from '@/components/common/EditProfileSheet';
import { useTheme } from '@/components/common/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { CERTIFICATION_LABELS } from '@/utils/divePlanner';

export default function Profile() {
  const profile = useAppStore((s) => s.profile);
  const favorites = useAppStore((s) => s.favorites);
  const quizzes = useAppStore((s) => s.quizHistory);
  const plans = useAppStore((s) => s.savedPlans);
  const units = useAppStore((s) => s.units);
  const progress = useLearningProgress();
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <ScreenHeader title="Profile" actions={<Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>} />
      <div className="space-y-8">
        <section className="flex flex-col items-center gap-2 text-center">
          <button type="button" onClick={() => setEditing(true)} className="pressable rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Edit profile">
            <Avatar name={profile.name} size={88} />
          </button>
          <div>
            <h2 className="text-title2">{profile.name || 'Add your name'}</h2>
            <p className="text-subhead text-muted-foreground">{CERTIFICATION_LABELS[profile.certification]}{profile.agency ? ` · ${profile.agency}` : ''} · {EXPERIENCE_LABELS[profile.experience]}</p>
          </div>
        </section>

        <dl className="grid grid-cols-3 divide-x divide-separator rounded-2xl bg-card py-3.5 text-center">
          <div><dd className="text-title2 tabular">{profile.completedDives}</dd><dt className="text-footnote text-muted-foreground">Dives</dt></div>
          <div><dd className="text-title2 tabular">{progress.overall.done}</dd><dt className="text-footnote text-muted-foreground">Lessons</dt></div>
          <div><dd className="text-title2 tabular">{quizzes.length}</dd><dt className="text-footnote text-muted-foreground">Quizzes</dt></div>
        </dl>

        <ListGroup>
          <ListRow to="/favorites" leading={<IconTile icon={Heart} color="bg-[#FF2D55]" />} title="Favourites" value={Object.keys(favorites).length || undefined} />
          <ListRow to="/history" leading={<IconTile icon={History} color="bg-[#5856D6]" />} title="History" subtitle="Quiz results and completed lessons" />
          <ListRow to="/dive" leading={<IconTile icon={CalendarClock} color="bg-primary" />} title="Dive Plans" value={plans.length || undefined} />
        </ListGroup>

        {profile.preferredLocations.length > 0 && (
          <ListGroup title="Favourite destinations">
            {profile.preferredLocations.map((l) => <ListRow key={l} leading={<IconTile icon={MapPin} color="bg-[#FF3B30]" />} title={l} />)}
          </ListGroup>
        )}

        <ListGroup>
          <ListRow to="/settings" leading={<IconTile icon={Settings} color="bg-[#8E8E93]" />} title="Settings" value={`${theme === 'system' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'} · ${units === 'metric' ? 'Metric' : 'Imperial'}`} />
        </ListGroup>

        <p className="px-4 text-center text-footnote text-muted-foreground">Your profile and progress are stored only on this device.</p>
      </div>
      <EditProfileSheet open={editing} onOpenChange={setEditing} />
    </>
  );
}
