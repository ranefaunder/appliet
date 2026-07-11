import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import { useEffect } from "preact/hooks";
import { t } from "/utils/i18n";
import { apps, loadApps } from "/app/stores/appStore";
import AppCard from "/app/components/generals/AppCard";
import { isLoggedIn } from "/app/stores/userStore";

export const MyAppsPath = "/:lang/apps" as const;

export default function MyApps(_props: RoutePropsForPath<typeof MyAppsPath>) {
  const list = apps.value;

  useEffect(() => {
    void loadApps("mine");
  }, []);

  const view = html`
    <div data-scope="MyApps" ui-container="md" ui-margin="top-2xl">
      <header ui-margin="bottom-2xl">
        <h1 ui-heading="xl">${t("My apps")}</h1>
      </header>

      ${!isLoggedIn()
        ? html`<p>${t("Sign in to create apps")}</p>`
        : list.length === 0
          ? html`
            <div class="empty">
              <p ui-heading="sm">${t("No apps yet")}</p>
              <a href="../" ui-button="primary">${t("Start building")}</a>
            </div>`
          : html`
            <div class="grid">
              ${list.map((app) => html`<${AppCard} app=${app} />`)}
            </div>`}
    </div>
  `;

  const style = css`
    @scope ([data-scope="MyApps"]) to ([data-scope]) {
      & {
        padding-bottom: 6rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        gap: 1rem;
      }

      .empty {
        padding: 3rem;
        text-align: center;
        border: 1px dashed var(--neutral-300);
        border-radius: 1rem;
      }
    }
  `;

  return [view, style];
}
