import { useEffect } from "preact/hooks";
import { effect } from "@preact/signals";
import { translations } from "/app/stores/i18nStore";
import { apps } from "/app/stores/appStore";
import { user } from "/app/stores/userStore";

const isDev =
  typeof window !== "undefined" &&
  (window.location?.hostname === "localhost" ||
    (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true);

type DevStoresShape = {
  stores?: {
    i18n?: { translations: Record<string, string> };
    apps?: { apps: unknown[] };
    auth?: { user: unknown };
  };
};

export default function DevStores() {
  function subscribeWindowDevStores() {
    if (!isDev || typeof window === "undefined") return;
    const w = window as unknown as DevStoresShape;
    const unsub = effect(() => {
      w.stores = w.stores ?? {};
      w.stores.i18n = { translations: translations.value };
      w.stores.apps = { apps: apps.value };
      w.stores.auth = { user: user.value };
    });
    return unsub;
  }
  useEffect(() => subscribeWindowDevStores(), []);

  return null;
}
