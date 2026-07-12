export function appPageUrl(lang: string, slug: string): string {
  return `/${lang}/app/${slug}`;
}

export function appModuleUrl(lang: string, slug: string): string {
  return `/${lang}/app/${slug}/module.js`;
}

export function appEditUrl(lang: string, slug: string): string {
  return `/${lang}/app/${slug}/edit`;
}

/**
 * SPA router scope. Site pages under /{lang}/ are handled client-side, plus the
 * app edit view (/{lang}/app/{slug}/edit). The bare app run page
 * (/{lang}/app/{slug}) is excluded so it does a full page load to the
 * standalone server-rendered runtime.
 */
export function spaRouterScope(lang: string): RegExp {
  return new RegExp(`^/${lang}/(?!app/[^/]+$)`);
}
