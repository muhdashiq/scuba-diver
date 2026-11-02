import { motion } from 'framer-motion';
import { Clock, ExternalLink, Globe, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import type { DiveShop } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { directionsUrl, formatDistance } from '@/utils/geo';
import { Diver } from '@/components/illustrations/Diver';
import { cn } from '@/lib/utils';

export function DiveShopCard({ shop, onWhatsApp, onSelect, selected, compact }: { shop: DiveShop; onWhatsApp?: (s: DiveShop) => void; onSelect?: (s: DiveShop) => void; selected?: boolean; compact?: boolean }) {
  return (
    <motion.article
      layout
      className={cn('flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg', selected && 'ring-2 ring-primary')}
      aria-label={shop.name}
    >
      {!compact && (
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-cyan-600 to-sky-950">
          {shop.image ? (
            <img src={shop.image} alt={`${shop.name}`} loading="lazy" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-full items-center justify-center" aria-hidden="true">
              <Diver className="w-48 opacity-80" animate={false} />
            </div>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">{formatDistance(shop.distanceKm)}</span>
          {!shop.image && <span className="absolute bottom-2 left-3 text-[10px] font-medium text-white/70">No photo listed</span>}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug">
            {onSelect ? (
              <button type="button" className="text-left hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded" onClick={() => onSelect(shop)}>
                {shop.name}
              </button>
            ) : (
              shop.name
            )}
          </h3>
          {compact && <span className="shrink-0 text-xs font-semibold text-muted-foreground">{formatDistance(shop.distanceKm)}</span>}
        </div>
        <div className="flex flex-wrap gap-1">
          {shop.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{shop.address ?? 'Address not listed'}</li>
          {!compact && (
            <>
              <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{shop.phone ? <a className="hover:text-foreground hover:underline" href={`tel:${shop.phone.replace(/[^\d+]/g, '')}`}>{shop.phone}</a> : 'Phone not listed'}</li>
              {shop.email && <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><a className="truncate hover:text-foreground hover:underline" href={`mailto:${shop.email}`}>{shop.email}</a></li>}
              <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span className="break-words">{shop.openingHours ?? 'Opening hours not listed'}</span></li>
              {shop.website && <li className="flex gap-2"><Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><a className="truncate hover:text-foreground hover:underline" href={shop.website} target="_blank" rel="noopener noreferrer">{shop.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></li>}
            </>
          )}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button asChild variant="outline" size="sm">
            <a href={directionsUrl(shop.latitude, shop.longitude)} target="_blank" rel="noopener noreferrer">
              <Navigation /> Directions
            </a>
          </Button>
          {shop.whatsapp && onWhatsApp ? (
            <Button variant="whatsapp" size="sm" onClick={() => onWhatsApp(shop)}>
              <MessageCircle /> WhatsApp
            </Button>
          ) : (
            !compact && <span className="self-center text-xs text-muted-foreground">No international number listed for WhatsApp</span>
          )}
          {!compact && (
            <Button asChild variant="ghost" size="sm">
              <a href={shop.osmUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${shop.name} on OpenStreetMap`}>
                <ExternalLink /> OSM
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
