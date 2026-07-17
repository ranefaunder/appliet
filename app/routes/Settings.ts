import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";
import { t } from "/utils/i18n";
import { user, logout, updateMarketingOptIn } from "/app/stores/userStore";

export const SettingsPath = "/:lang/settings" as const;

export default function Settings({ params }: RoutePropsForPath<typeof SettingsPath>) {
  const { route } = useLocation();
  const { lang } = params;

  function redirectIfGuest() {
    if (!user.value) {
      route(`/${lang}/login?next=${encodeURIComponent(`/${lang}/settings`)}`, true);
    }
  }
  useEffect(() => redirectIfGuest(), [lang, route]);

  if (!user.value) return null;

  async function handleLogout() {
    await logout();
    route(`/${lang}/`, true);
  }

  async function handleMarketingChange(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    await updateMarketingOptIn(checked);
  }

  const view = html`
    <div data-scope="Settings" ui-container="sm" ui-padding="block-xl" ui-column="gap-lg">
      <header>
        <h1 ui-heading="lg">${t("Settings")}</h1>
      </header>

      <section ui-card ui-padding="lg" ui-column="gap-md">
        <h2 ui-heading="sm">${t("Account")}</h2>
        <div ui-column="gap-xs">
          <p class="email">${user.value.email}</p>
          ${user.value.nickname ? html`<p class="nickname">${user.value.nickname}</p>` : ""}
        </div>
        <button type="button" ui-button="tertiary" onClick=${handleLogout}>
          ${t("Log out")}
        </button>
      </section>

      <section ui-card ui-padding="lg">
        <label ui-row="gap-sm y-center">
          <input
            type="checkbox"
            checked=${user.value.marketingOptIn === true}
            onChange=${handleMarketingChange}
          />
          <span>${t("Email me about Abblet updates")}</span>
        </label>
      </section>
    </div>
  `;

  const style = css`
    @scope ([data-scope="Settings"]) to ([data-scope]) {
      .email {
        margin: 0;
        color: var(--neutral-800);
        word-break: break-word;
      }

      .nickname {
        margin: 0;
        color: var(--neutral-500);
        font-size: 0.875rem;
      }
    }
  `;

  return [view, style];
}
