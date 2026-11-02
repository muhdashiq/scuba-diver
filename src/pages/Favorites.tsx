import { BookOpen, Fish, Heart, Sparkles, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { EmptyState } from '@/components/common/States';
import { Button } from '@/components/ui/button';
import { useAppStore, type Favorite, type FavoriteKind } from '@/store/useAppStore';
import { toast } from '@/lib/toast';

const KIND: Record<FavoriteKind, { label: string; icon: typeof Heart; color: string }> = {
  lesson: { label: 'Lessons', icon: BookOpen, color: 'bg-primary' },
  module: { label: 'Lessons', icon: BookOpen, color: 'bg-[#5856D6]' },
  specialty: { label: 'Specialties', icon: Sparkles, color: 'bg-[#AF52DE]' },
  marine: { label: 'Marine life', icon: Fish, color: 'bg-teal' },
  shop: { label: 'Dive shops', icon: Store, color: 'bg-[#FF9500]' },
};

export default function Favorites() {
  const favorites = useAppStore((s) => s.favorites);
  const toggle = useAppStore((s) => s.toggleFavorite);
  const items = Object.values(favorites).sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  const groups = [...new Set(items.map((f) => KIND[f.kind].label))];

  const remove = (f: Favorite) => {
    toggle(f);
    toast('Removed from Favourites', { action: { label: 'Undo', onClick: () => toggle(f) } });
  };

  return (
    <>
      <ScreenHeader back={{ to: '/profile', label: 'Profile' }} title="Favourites" />
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="No favourites yet" message="Tap the heart on any lesson, specialty, species or dive shop to keep it here." action={<Button asChild><Link to="/explore">Explore</Link></Button>} />
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <ListGroup key={g} title={g}>
              {items.filter((f) => KIND[f.kind].label === g).map((f) => (
                <ListRow
                  key={f.id}
                  to={f.to}
                  leading={<IconTile icon={KIND[f.kind].icon} color={KIND[f.kind].color} />}
                  title={f.title}
                  subtitle={f.subtitle}
                  chevron={false}
                  trailing={
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(f); }} aria-label={`Remove ${f.title} from favourites`} className="flex h-9 w-9 items-center justify-center rounded-full text-[#FF2D55] hover:bg-[#FF2D55]/10">
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  }
                />
              ))}
            </ListGroup>
          ))}
        </div>
      )}
    </>
  );
}
