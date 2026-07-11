import { signal } from "@preact/signals";
import type { AppSummary } from "/types/app-types";
import { ssrContext } from "/utils/ssr.client";
import { apiFetch } from "/utils/api.client";
import { getLang } from "/utils/lang";

export const apps = signal<AppSummary[]>([]);

export function initAppStore(): void {
  const { initialApps } = ssrContext();
  if (initialApps !== undefined) {
    apps.value = initialApps;
  }
}

export async function loadApps(scope: "public" | "mine" = "public"): Promise<void> {
  const lang = getLang(window.location.pathname) ?? "en";
  const query = scope === "mine" ? "?scope=mine" : "";
  const result = await apiFetch<{ apps: AppSummary[] }>(`/api/${lang}/app/list${query}`);
  if (result.success) {
    apps.value = result.data.apps;
  }
}
