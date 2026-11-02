import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IconTile } from '@/components/common/List';
import { useAppStore } from '@/store/useAppStore';
import type { AppNotification } from '@/hooks/useNotifications';

export function NotificationsSheet({ open, onOpenChange, items }: { open: boolean; onOpenChange: (o: boolean) => void; items: AppNotification[] }) {
  const markRead = useAppStore((s) => s.markNotificationsRead);
  const read = useAppStore((s) => s.readNotifications);
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => markRead(items.map((i) => i.id)), 1200);
    return () => window.clearTimeout(t);
  }, [open, items, markRead]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>Reminders based on your plans, checks and learning.</DialogDescription>
        </DialogHeader>
        <ul className="mt-4 space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <Link to={n.to} onClick={() => onOpenChange(false)} className="pressable flex items-start gap-3 rounded-2xl bg-card p-3.5 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <IconTile icon={n.icon} color={n.color} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-subhead font-semibold">
                    {!read.includes(n.id) && n.id !== 'all-clear' && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="New" />}
                    {n.title}
                  </p>
                  <p className="text-footnote text-muted-foreground">{n.body}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
