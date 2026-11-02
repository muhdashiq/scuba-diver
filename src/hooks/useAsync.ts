import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: T | null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: T | null; error: unknown };

/**
 * Run an abortable async task whenever `key` changes (null = don't run).
 * Results are cached in-memory per key for `ttlMs` to avoid hammering free APIs.
 */
const cache = new Map<string, { at: number; data: unknown }>();

export function useAsync<T>(key: string | null, task: (signal: AbortSignal) => Promise<T>, ttlMs = 10 * 60 * 1000) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle', data: null, error: null });
  const [nonce, setNonce] = useState(0);
  const taskRef = useRef(task);
  taskRef.current = task;
  const forceRef = useRef(false);

  useEffect(() => {
    if (!key) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }
    const cached = cache.get(key);
    if (cached && !forceRef.current && Date.now() - cached.at < ttlMs) {
      setState({ status: 'success', data: cached.data as T, error: null });
      return;
    }
    forceRef.current = false;
    const controller = new AbortController();
    setState((s) => ({ status: 'loading', data: s.data, error: null }));
    taskRef.current(controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return;
        cache.set(key, { at: Date.now(), data });
        setState({ status: 'success', data, error: null });
      },
      (error) => {
        if (controller.signal.aborted) return;
        setState((s) => ({ status: 'error', data: s.data, error }));
      },
    );
    return () => controller.abort();
  }, [key, nonce, ttlMs]);

  const refetch = useCallback(() => {
    forceRef.current = true;
    setNonce((n) => n + 1);
  }, []);

  return { ...state, refetch };
}

export const clearAsyncCache = () => cache.clear();
