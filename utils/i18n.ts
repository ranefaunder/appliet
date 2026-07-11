import type { Language, TranslationKey } from "/types/i18n-types";
import { AVAILABLE_LANGUAGES } from "/i18n/languages";
import { translations as storeTranslations } from "/app/stores/i18nStore";
import { isClient, isServer } from "/utils/env";
import { ssrContext } from "/utils/ssr.client";
import { getLang } from "/utils/lang";

function resolveTranslationLang(langOrRequest?: Language | Request): Language | undefined {
  if (langOrRequest == null) return undefined;
  if (typeof langOrRequest === "object" && "url" in langOrRequest) {
    return getLang((langOrRequest as Request).url) ?? undefined;
  }
  return langOrRequest;
}

function isRequestLike(x: unknown): x is Request {
  return typeof Request !== "undefined" && x instanceof Request;
}

const staticTranslations: Record<Language, Record<string, string>> | null = isServer
  ? await loadStaticTranslationsByLang()
  : null;

export function t(key: TranslationKey): string;
export function t(key: TranslationKey, params: Record<string, string | number>): string;
export function t(key: TranslationKey, langOrRequest: Language | Request): string;
export function t(key: TranslationKey, params: Record<string, string | number>, langOrRequest: Language | Request): string;
export function t(
  key: TranslationKey,
  second?: Record<string, string | number> | Language | Request,
  third?: Language | Request,
): string {
  let params: Record<string, string | number> | undefined;
  let lang: Language | undefined;

  if (second === undefined) {
    lang = resolveTranslationLang(third);
  } else if (typeof second === "string") {
    lang = second as Language;
  } else if (isRequestLike(second)) {
    lang = resolveTranslationLang(second);
  } else if (
    typeof second === "object" &&
    second !== null &&
    !Array.isArray(second) &&
    !isRequestLike(second)
  ) {
    params = second as Record<string, string | number>;
    lang = resolveTranslationLang(third);
  }

  let translations: Record<string, string> = {};
  const store = storeTranslations.value;
  const useStore = isClient && store != null && Object.keys(store).length > 0;
  const useExplicitLang = lang != null && lang in AVAILABLE_LANGUAGES;
  const useClientPath = isClient;
  const useSsr = isServer;

  if (useStore) {
    translations = store;
  } else if (useExplicitLang) {
    translations = staticTranslations?.[lang!] ?? staticTranslations?.en ?? {};
  } else if (useClientPath) {
    const seg = window.location.pathname.split("/")[1];
    if (seg == null) throw new Error("Client: language segment missing from path");
    translations = staticTranslations?.[seg as Language] ?? staticTranslations?.en ?? {};
  } else if (useSsr) {
    const ctxLang = ssrContext().language ?? "en";
    translations = staticTranslations?.[ctxLang] ?? staticTranslations?.en ?? {};
  }

  let translated = translations[key as string] ?? key;

  if (params != null) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      translated = translated.replace(new RegExp(`\\$${paramKey}`, "g"), String(paramValue));
    }
  }

  return translated;
}

async function loadStaticTranslationsByLang(): Promise<Record<Language, Record<string, string>>> {
  const { translations } = await import("/i18n/translations");
  const byKey = translations as Record<string, Partial<Record<Language, string>> & { serverOnly?: boolean }>;
  const langs = Object.keys(AVAILABLE_LANGUAGES) as Language[];
  const byLang = {} as Record<Language, Record<string, string>>;
  for (const lang of langs) {
    byLang[lang] = {};
  }
  for (const key of Object.keys(byKey)) {
    const entry = byKey[key];
    for (const lang of langs) {
      const text =
        entry?.[lang] ??
        (lang === "en" ? key : (entry as Record<string, string>)?.en ?? key);
      byLang[lang][key] = text;
    }
  }
  return byLang;
}
