import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import type { ClientMeta } from "/utils/meta.server";
import { apiFetch } from "/utils/api.client";
import { getLang } from "/utils/lang";

function metaElementsByName(name: string): Element[] {
  if (name === "title") return Array.from(document.querySelectorAll("head > title"));
  if (name === "description") return Array.from(document.querySelectorAll('meta[name="description"]'));
  if (name.startsWith("og:")) {
    return Array.from(document.querySelectorAll(`meta[property="${name}"]`));
  }
  return [];
}

function updateMetaElement(element: Element, value: string) {
  if (element instanceof HTMLTitleElement) {
    element.textContent = value;
    return;
  }
  if (element instanceof HTMLMetaElement) {
    element.content = value;
  }
}

export default function MetaUpdater() {
  const { path } = useLocation();

  async function updateMeta() {
    const lang = getLang(path ?? "") ?? "en";
    try {
      const result = await apiFetch<ClientMeta>(`/api/${lang}/meta?path=${encodeURIComponent(path)}`);
      if (!result.success) return;
      for (const [name, value] of Object.entries(result.data)) {
        for (const element of metaElementsByName(name)) {
          updateMetaElement(element, value);
        }
      }
    } catch (error) {
      console.warn("Failed to update meta:", error);
    }
  }

  useEffect(() => {
    void updateMeta();
  }, [path]);

  return null;
}
