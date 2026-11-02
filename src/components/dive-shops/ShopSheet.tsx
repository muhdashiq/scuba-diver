import { Clock, Globe, Mail, MapPin, MessageCircle, Navigation, Phone, ExternalLink } from 'lucide-react';
import type { DiveShop } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListGroup, ListRow, IconTile } from '@/components/common/List';
import { FavoriteButton, ShareButton } from '@/components/common/ActionButtons';
import { directionsUrl, formatDistance } from '@/utils/geo';

/** Detail sheet for a dive shop with Apple-Maps-style action buttons. */
export function ShopSheet({ shop, onOpenChange, onWhatsApp }: { shop: DiveShop | null; onOpenChange: (o: boolean) => void; onWhatsApp: (s: DiveShop) => void }) {
  return (
    <Dialog open={!!shop} onOpenChange={onOpenChange}>
      <DialogContent>
        {shop && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-title2">{shop.name}</DialogTitle>
              <DialogDescription>{formatDistance(shop.distanceKm)} away · {shop.tags.join(' · ')}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-2">
              <ActionTile href={directionsUrl(shop.latitude, shop.longitude)} icon={Navigation} label="Directions" primary />
              <ActionTile href={shop.phone ? `tel:${shop.phone.replace(/[^\d+]/g, '')}` : undefined} icon={Phone} label="Call" />
              <ActionTile onClick={shop.whatsapp ? () => onWhatsApp(shop) : undefined} icon={MessageCircle} label="WhatsApp" />
              <ActionTile href={shop.website} icon={Globe} label="Website" />
            </div>
            <ListGroup>
              <ListRow leading={<IconTile icon={MapPin} color="bg-[#FF3B30]" />} title={<span className="whitespace-normal">{shop.address ?? 'Address not listed'}</span>} />
              <ListRow leading={<IconTile icon={Phone} color="bg-[#34C759]" />} title={shop.phone ?? 'Phone not listed'} />
              {shop.email && <ListRow href={`mailto:${shop.email}`} leading={<IconTile icon={Mail} color="bg-primary" />} title={shop.email} />}
              <ListRow leading={<IconTile icon={Clock} color="bg-[#FF9500]" />} title={<span className="whitespace-normal">{shop.openingHours ?? 'Opening hours not listed'}</span>} />
              <ListRow href={shop.osmUrl} leading={<IconTile icon={ExternalLink} color="bg-[#8E8E93]" />} title="View on OpenStreetMap" chevron />
            </ListGroup>
            {!shop.whatsapp && <p className="px-1 text-footnote text-muted-foreground">WhatsApp is only offered when the listing includes an international number — we never guess contact details.</p>}
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Listing from OpenStreetMap</Badge>
              <div className="flex">
                <FavoriteButton item={{ id: `shop:${shop.id}`, kind: 'shop', title: shop.name, subtitle: shop.address ?? 'Dive shop', to: `/dive-shops?shop=${encodeURIComponent(shop.id)}` }} />
                <ShareButton title={shop.name} text={`${shop.name}${shop.address ? ` — ${shop.address}` : ''}`} route={`/dive-shops?shop=${encodeURIComponent(shop.id)}`} />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ActionTile({ href, onClick, icon: Icon, label, primary }: { href?: string; onClick?: () => void; icon: typeof Phone; label: string; primary?: boolean }) {
  const disabled = !href && !onClick;
  const cls = `pressable flex h-[3.75rem] flex-col items-center justify-center gap-1 rounded-xl text-caption font-medium [&_svg]:!size-5 ${primary ? 'bg-primary text-primary-foreground' : 'bg-card text-primary'} ${disabled ? 'pointer-events-none opacity-40' : 'hover:opacity-90'}`;
  const content = <><Icon className="h-5 w-5" aria-hidden="true" />{label}</>;
  if (href) return <a href={href} target={href.startsWith('tel:') ? undefined : '_blank'} rel="noopener noreferrer" className={cls}>{content}</a>;
  return <Button variant="plain" className={`${cls} h-[3.75rem] px-0`} onClick={onClick} disabled={disabled} aria-disabled={disabled}>{content}</Button>;
}
