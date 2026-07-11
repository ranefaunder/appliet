import type { BunRequest } from "bun";
import { resolveStaticRootFromUrl } from "/utils/static.server";
import { getMeta } from "/utils/meta.server";
import { serverSideRender } from "/utils/ssr.server";
import { createSsrContext } from "/server/ssr";
import { AVAILABLE_LANGUAGES } from "/i18n/languages";
import { escapeHtmlAttribute } from "/utils/sanitize.server";
import App from "/app/App";

const LANGUAGE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export default async function (req: BunRequest<"/:lang/"> | BunRequest<"/:lang/*">): Promise<Response> {
  if (req.params.lang && !(req.params.lang in AVAILABLE_LANGUAGES)) {
    return Response.redirect("/", 302);
  }

  req.cookies?.set({
    name: "appstudo-language",
    value: req.params.lang,
    path: "/",
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const ssrContext = createSsrContext(req);
  const staticRoot = resolveStaticRootFromUrl(req.url);
  const [ssrHtml, metaHead] = await Promise.all([serverSideRender(req, App, ssrContext), getMeta(req)]);

  const html = /*html*/ `<!DOCTYPE html>
    <html lang="${escapeHtmlAttribute(req.params.lang)}">
      <head>
        ${metaHead}
        <link rel="stylesheet" href="${escapeHtmlAttribute(`${staticRoot}/styles/faunder-ui.css`)}" />
        <link rel="stylesheet" href="${escapeHtmlAttribute(`${staticRoot}/styles/style.css`)}" />
        <link rel="stylesheet" href="${escapeHtmlAttribute(`${staticRoot}/styles/font-faces.css`)}" />
      </head>
      <body>
        <div id="app">${ssrHtml}</div>
        <script>
          window.__SSR_CONTEXT__ = ${JSON.stringify(ssrContext)};
        </script>
        <script type="module" src="/app.js"></script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
