import { Heart, Share } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, type Favorite } from '@/store/useAppStore';
import { share } from '@/lib/share';
import { toast } from '@/lib/toast';
import { BarButton } from './ScreenHeader';
import { cn } from '@/lib/utils';

/** Heart toggle that saves an item to Favorites. */
export function FavoriteButton({ item, className }: { item: Omit<Favorite, 'addedAt'>; className?: string }) {
  const active = useAppStore((s) => !!s.favorites[item.id]);
  const toggle = useAppStore((s) => s.toggleFavorite);
  return (
    <BarButton
      label={active ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
      className={className}
      onClick={() => {
        const added = toggle(item);
        toast.success(added ? 'Added to Favourites' : 'Removed from Favourites');
      }}
    >
      <motion.span key={String(active)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 15 }} className="flex">
        <Heart className={cn(active && 'fill-current text-[#FF2D55]')} aria-hidden="true" />
      </motion.span>
    </BarButton>
  );
}

export function ShareButton({ title, text, route, className }: { title: string; text?: string; route: string; className?: string }) {
  return (
    <BarButton label={`Share ${title}`} onClick={() => share({ title, text, route })} className={className}>
      <Share aria-hidden="true" />
    </BarButton>
  );
}
