import type { ReactNode } from 'react';

/** Primary actions pinned within thumb reach, above the tab bar on phones. */
export function StickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 -mx-4 mt-6 px-4 pb-2 pt-3 sm:-mx-6 sm:px-6 lg:bottom-4 lg:mx-0 lg:px-0">
      <div className="bar-material flex gap-2 rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-separator/60 lg:bg-card">{children}</div>
    </div>
  );
}
