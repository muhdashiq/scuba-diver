import { MessageCircle, RotateCcw } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import type { DiveShop } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from '@/utils/whatsapp';

/** Lets the user review and edit the message before opening WhatsApp click-to-chat. */
export function WhatsAppDialog({ shop, open, onOpenChange }: { shop: DiveShop | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const saved = useAppStore((s) => s.whatsappTemplate);
  const setTemplate = useAppStore((s) => s.setWhatsappTemplate);
  const [message, setMessage] = useState(saved ?? DEFAULT_WHATSAPP_MESSAGE);
  const id = useId();

  useEffect(() => {
    if (open) setMessage(saved ?? DEFAULT_WHATSAPP_MESSAGE);
  }, [open, saved]);

  if (!shop?.whatsapp) return null;
  const url = buildWhatsAppUrl(shop.whatsapp, message);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#1f9e55]" aria-hidden="true" /> Message {shop.name}
          </DialogTitle>
          <DialogDescription>
            Opens WhatsApp to <span className="font-semibold text-foreground">+{shop.whatsapp}</span>. This number comes from OpenStreetMap — please confirm it on the shop’s official website if unsure.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Label htmlFor={id}>Your message</Label>
          <Textarea id={id} value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={1000} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{message.length}/1000</span>
            <button type="button" className="inline-flex items-center gap-1 font-medium hover:text-foreground" onClick={() => setMessage(DEFAULT_WHATSAPP_MESSAGE)}>
              <RotateCcw className="h-3 w-3" aria-hidden="true" /> Reset to default
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setTemplate(message === DEFAULT_WHATSAPP_MESSAGE ? null : message)}>
            Save as my default
          </Button>
          <Button asChild variant="whatsapp">
            <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => onOpenChange(false)}>
              <MessageCircle /> Open WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
