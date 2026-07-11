import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import { useEffect } from "preact/hooks";
import { t } from "/utils/i18n";
import { apps, loadApps } from "/app/stores/appStore";
import AppCard from "/app/components/generals/AppCard";
import { getLang } from "/utils/lang";
import { useLocation } from "preact-iso";

export const ExplorePath = "/:lang/explore" as const;

export default function Explore(_props: RoutePropsForPath<typeof ExplorePath>) {
  const { path } = useLocation();
  const lang = getLang(path ?? "") ?? "en";
  const list = apps.value;

  useEffect(() => {
    void loadApps("public");
  }, []);

  const view = html`
    <div data-scope="Explore" ui-container="md" ui-margin="top-2xl">
      <header class="page-header">
        <p class="eyebrow">${t("Explore")}</p>
        <h1 ui-heading="xl">${t("Explore apps")}</h1>
        <p class="subtitle">${t("Discover apps built by the community.")}</p>
      </header>

      ${list.length === 0
        ? html`
          <div class="empty">
            <span class="empty-icon" aria-hidden="true">✨</span>
            <p ui-heading="sm">${t("No apps yet")}</p>
            <p>${t("Be the first to publish an app to the community gallery.")}</p>
            <a href="/${lang}/" ui-button="primary">${t("Start building")}</a>
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

      .page-header {
        max-width: 36rem;
        margin-bottom: 2.5rem;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.875rem;
        border-radius: 999px;
        background: var(--white);
        border: 1px solid var(--neutral-200);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--neutral-700);
        margin-bottom: 1rem;
      }

      .subtitle {
        margin-top: 0.75rem;
        font-size: 1.125rem;
        color: var(--neutral-600);
        line-height: 1.6;
        text-wrap: balance;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
        gap: 1.25rem;
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 4rem 2rem;
        text-align: center;
        border: 1px solid var(--neutral-200);
        border-radius: 1.25rem;
        background:
          radial-gradient(60% 80% at 50% 0%, oklch(from var(--primary-100) l c h / 60%), transparent 70%),
          var(--white);
        color: var(--neutral-600);
      }

      .empty-icon {
        font-size: 2rem;
        line-height: 1;
        margin-bottom: 0.25rem;
      }
    }
  `;

  return [view, style];
}
