import type { BunRequest } from "bun";
import { AVAILABLE_LANGUAGES } from "/i18n/languages";

/**
 * Redirect /fi to /fi/ (trailing slash). Must be before /:lang/* in server routes.
 */
export default function redirectRoute(req: BunRequest<"/:lang">) {
  const lang = req.params.lang;
  const url = new URL(req.url);
  if (lang && lang in AVAILABLE_LANGUAGES) {
    return Response.redirect(`${url.origin}/${lang}/${url.search}`, 302);
  }
  return new Response("Not Found", { status: 404 });
}
