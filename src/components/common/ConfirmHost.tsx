import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useConfirmStore } from '@/lib/confirm';
import { cn } from '@/lib/utils';

/** Renders confirm() requests as an iOS action sheet (phones) / alert (larger screens). */
export function ConfirmHost() {
  const req = useConfirmStore((s) => s.request);
  const settle = useConfirmStore((s) => s.settle);
  return (
    <Dialog open={!!req} onOpenChange={(o) => !o && settle(false)}>
      <DialogContent side="sheet" hideClose hideGrabber className="bg-transparent px-2 pt-0 sm:bg-background sm:p-0">
        {req && (
          <div className="space-y-2 sm:space-y-0">
            <div className="overflow-hidden rounded-[0.875rem] bg-popover text-center sm:rounded-none sm:bg-transparent">
              <div className="space-y-1 px-5 py-4 sm:pt-6">
                <DialogTitle className="text-headline">{req.title}</DialogTitle>
                {req.message ? <DialogDescription className="text-footnote">{req.message}</DialogDescription> : <DialogDescription className="sr-only">Confirm action</DialogDescription>}
              </div>
              <button
                type="button"
                onClick={() => settle(true)}
                className={cn('block h-14 w-full border-t border-separator text-title3 font-normal hover:bg-accent focus-visible:bg-accent focus-visible:outline-none sm:h-12 sm:text-body sm:font-semibold', req.destructive ? 'text-destructive' : 'text-primary')}
                autoFocus
              >
                {req.confirmLabel ?? 'Confirm'}
              </button>
              <button type="button" onClick={() => settle(false)} className="hidden h-12 w-full border-t border-separator text-body text-primary hover:bg-accent focus-visible:bg-accent focus-visible:outline-none sm:block">
                {req.cancelLabel ?? 'Cancel'}
              </button>
            </div>
            <button type="button" onClick={() => settle(false)} className="block h-14 w-full rounded-[0.875rem] bg-popover text-title3 font-semibold text-primary hover:bg-accent focus-visible:outline-none sm:hidden">
              {req.cancelLabel ?? 'Cancel'}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
