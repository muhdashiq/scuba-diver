import { toast } from './toast';

/** Absolute URL for an in-app route (hash routing keeps it working on GitHub Pages). */
export const appUrl = (route: string) => `${window.location.origin}${window.location.pathname}#${route.startsWith('/') ? route : `/${route}`}`;

/** Use the native share sheet when available; otherwise copy the link. */
export async function share({ title, text, route }: { title: string; text?: string; route: string }) {
  const url = appUrl(route);
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(text ? `${text}\n${url}` : url);
    toast.success('Link copied');
  } catch {
    toast.error('Sharing isn’t available on this device');
  }
}
