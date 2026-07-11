import { signal } from "@preact/signals";
import { ssrContext } from "/utils/ssr.client";
import { isClient } from "/utils/env";
import { getLang } from "/utils/lang";
import { translations as staticTranslations } from "/i18n/translations";

export const translations = signal<Record<string, string>>({});

export function initI18nStore(): void {
  const ctx = ssrContext();
  const fromCtx = ctx?.initialTranslations;
  if (fromCtx && Object.keys(fromCtx).length > 0) {
    translations.value = fromCtx;
    return;
  }
  if (isClient) {
    const langKey = getLang(window.location.pathname) ?? "en";
    const result: Record<string, string> = {};
    const keys = Object.keys(staticTranslations) as (keyof typeof staticTranslations)[];
    for (const key of keys) {
      const val = staticTranslations[key];
      if (val && typeof val === "object" && "serverOnly" in val && (val as { serverOnly?: boolean }).serverOnly) continue;
      result[key] = langKey === "en" ? key : (val?.[langKey] ?? key);
    }
    translations.value = result;
  }
}
