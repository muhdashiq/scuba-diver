import { create } from 'zustand';

export type ToastTone = 'default' | 'success' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
}

interface ToastState {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>, durationMs?: number) => void;
  dismiss: (id: number) => void;
}

let seq = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t, durationMs = 2800) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    window.setTimeout(() => get().dismiss(id), durationMs);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Show a short, non-blocking confirmation (iOS-style banner). */
export const toast = Object.assign((message: string, opts?: { action?: ToastItem['action'] }) => useToastStore.getState().push({ message, tone: 'default', ...opts }, opts?.action ? 5000 : undefined), {
  success: (message: string, opts?: { action?: ToastItem['action'] }) => useToastStore.getState().push({ message, tone: 'success', ...opts }, opts?.action ? 5000 : undefined),
  error: (message: string) => useToastStore.getState().push({ message, tone: 'error' }, 4000),
});
