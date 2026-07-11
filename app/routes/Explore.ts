import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import { useEffect } from "preact/hooks";
import { t } from "/utils/i18n";
import { apps, loadApps } from "/app/stores/appStore";
import AppCard from "/app/components/generals/AppCard";

export const ExplorePath = "/:lang/explore" as const;

export default function Explore(_props: RoutePropsForPath<typeof ExplorePath>) {
  const list = apps.value;

  useEffect(() => {
    void loadApps("public");
  }, []);

  const view = html`
    <div data-scope="Explore" ui-container="md" ui-margin="top-2xl">
      <header ui-margin="bottom-2xl">
        <h1 ui-heading="xl">${t("Explore apps")}</h1>
        <p class="subtitle">${t("Be the first to publish an app to the community gallery.")}</p>
      </header>

      ${list.length === 0
        ? html`
          <div class="empty">
            <p ui-heading="sm">${t("No apps yet")}</p>
            <p>${t("Be the first to publish an app to the community gallery.")}</p>
          </div>`
        : html`
          <div class="grid">
            ${list.map((app) => html`<${AppCard} app=${app} />`)}
          </div>`}
    </div>
  `;

  const style = css`
    @scope ([data-scope="Explore"]) to ([data-scope]) {
      & {
        padding-bottom: 6rem;
      }

      .subtitle {
        color: var(--neutral-600);
        margin-top: 0.5rem;
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
        color: var(--neutral-600);
      }
    }
  `;

  return [view, style];
}
