/**
 * Persistence abstraction. The app currently ships with a LocalStorage adapter.
 * To move to Supabase (or any backend), implement this interface — e.g. read/write a
 * `user_state` row keyed by the authenticated user id — and pass it to `setPersistenceAdapter`
 * before the store hydrates. The rest of the app does not need to change.
 */
export interface PersistenceAdapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

const memory = new Map<string, string>();

export const memoryAdapter: PersistenceAdapter = {
  getItem: (k) => memory.get(k) ?? null,
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
};

export const localStorageAdapter: PersistenceAdapter = {
  getItem: (k) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return memoryAdapter.getItem(k);
    }
  },
  setItem: (k, v) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      memoryAdapter.setItem(k, v);
    }
  },
  removeItem: (k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      memoryAdapter.removeItem(k);
    }
  },
};

let current: PersistenceAdapter = localStorageAdapter;
export const getPersistenceAdapter = () => current;
export const setPersistenceAdapter = (adapter: PersistenceAdapter) => {
  current = adapter;
};
