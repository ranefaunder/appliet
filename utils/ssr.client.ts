import type { SsrContext } from "/types/ssr-types";

/** Palvelin rekisteröi `AsyncLocalStorage`in tähän avaimeen (`utils/ssr.server.ts`). */
export const SSR_ALS_GLOBAL_KEY = "__cuukbuukSsrAsyncLocalStorage";

/**
 * Read SSR snapshot context.
 *
 * - Server: reads from AsyncLocalStorage (registered on globalThis by server bundle only)
 * - Client (before ssrFinish): reads from window.__SSR_CONTEXT__
 * - Client (after ssrFinish): returns empty object
 */
export function ssrContext(): SsrContext {
  if (typeof window === "undefined") {
    const als = (globalThis as unknown as Record<string, { getStore: () => SsrContext | undefined } | undefined>)[
      SSR_ALS_GLOBAL_KEY
    ];
    return als?.getStore() ?? {};
  }

  return (window as any).__SSR_CONTEXT__ ?? {};
}

/**
 * Ends the SSR phase on the client.
 * Must be called once after hydrate().
 * Removes the SSR snapshot from window to prevent stale data.
 */
export function ssrFinish() {
  delete (window as any).__SSR_CONTEXT__;
}
