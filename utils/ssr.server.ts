import "@preact/signals";
import { AsyncLocalStorage } from "node:async_hooks";
import { h, type ComponentType } from "preact";
import { locationStub } from "preact-iso/prerender";
import renderToString from "preact-render-to-string";
import type { SsrContext } from "/types/ssr-types";
import { SSR_ALS_GLOBAL_KEY } from "/utils/ssr.client";

const ssrStorage = new AsyncLocalStorage<SsrContext>();

(globalThis as unknown as Record<string, typeof ssrStorage>)[SSR_ALS_GLOBAL_KEY] = ssrStorage;

/**
 * Render application with SSR context.
 *
 * Sets up request-scoped SSR snapshot and runs synchronous `renderToString` (avoids `renderToStringAsync` + @preact/signals SSR issues).
 */
export async function serverSideRender(
  req: Request,
  App: ComponentType,
  ssrContext: SsrContext
): Promise<string> {
  return ssrStorage.run(ssrContext, async () => {
    const url = new URL(req.url);

    locationStub(url.pathname + url.search);

    const html = renderToString(h(App, {})) + `<script type="isodata"></script>`;
    return html;
  });
}
