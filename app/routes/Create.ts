import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { t } from "/utils/i18n";
import { getLang } from "/utils/lang";
import { user } from "/app/stores/userStore";
import { apiFetch } from "/utils/api.client";
import { appEditUrl } from "/utils/app-url";
import Dialogs from "/app/components/Dialogs";

export const CreatePath = "/:lang/create" as const;

/** Boots a new draft + welcome chat, then opens the shared AppEdit workspace. */
export default function Create(_props: RoutePropsForPath<typeof CreatePath>) {
  const { path, route } = useLocation();
  const lang = getLang(path ?? "") ?? "en";
  const [error, setError] = useState<string | null>(null);
  const loggedIn = !!user.value;

  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;

    async function start() {
      const result = await apiFetch<{ id: string; slug: string }>(`/api/${lang}/app/generate`, {
        method: "POST",
        body: JSON.stringify({ language: lang }),
      });
      if (cancelled) return;
      if (!result.success) {
        setError(result.error.message ?? result.error.code);
        return;
      }
      route(appEditUrl(lang, result.data.slug), true);
    }

    void start();
    return () => {
      cancelled = true;
    };
  }, [lang, loggedIn]);

  const view = html`
    <div data-scope="Create">
      ${!loggedIn
        ? html`
          <div class="state">
            <p ui-heading="sm">${t("Sign in to apply your ideas")}</p>
            <button
              type="button"
              ui-button="primary"
              onClick=${() => (document.getElementById("login-dialog") as HTMLDialogElement | null)?.showModal()}
            >
              ${t("Login")}
            </button>
            <a class="back" href=${`/${lang}/`}>${t("My Applets")}</a>
          </div>`
        : error
          ? html`
            <div class="state">
              <p>${error}</p>
              <a href=${`/${lang}/`} ui-button="primary">${t("My Applets")}</a>
            </div>`
          : html`
            <div class="state">
              <span class="spinner" aria-hidden="true"></span>
              <p>${t("Starting chat…")}</p>
            </div>`}
      <${Dialogs} />
    </div>
  `;

  const style = css`
    @scope ([data-scope="Create"]) to ([data-scope]) {
      & {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        background: var(--neutral-100);
      }

      .state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
        color: var(--neutral-600);
      }

      .back {
        color: var(--neutral-600);
        font-size: 0.875rem;
      }

      .spinner {
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid var(--neutral-300);
        border-top-color: var(--primary-600);
        border-radius: 50%;
        animation: create-spin 0.7s linear infinite;
      }

      @keyframes create-spin {
        to { transform: rotate(360deg); }
      }
    }
  `;

  return [view, style];
}
