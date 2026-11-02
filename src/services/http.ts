export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly kind: 'network' | 'http' | 'parse' | 'timeout' | 'empty' = 'http',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const { timeoutMs = 15000, signal, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), timeoutMs);
  const onAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener('abort', onAbort);

  let response: Response;
  try {
    response = await fetch(url, { ...rest, signal: controller.signal });
  } catch (err) {
    if (signal?.aborted) throw err;
    if (controller.signal.aborted) throw new ApiError('The request timed out. Please try again.', undefined, 'timeout');
    throw new ApiError('Network error — check your connection and try again.', undefined, 'network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  if (!response.ok) {
    const status = response.status;
    const message =
      status === 429
        ? 'The data provider is rate-limiting requests. Please wait a minute and retry.'
        : status >= 500
          ? 'The data provider is temporarily unavailable.'
          : `Request failed (${status}).`;
    throw new ApiError(message, status, 'http');
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('Received an unreadable response from the data provider.', response.status, 'parse');
  }
}

export const errorMessage = (err: unknown) =>
  err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Something went wrong.';
