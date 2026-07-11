import { html, css } from "/utils/markup";
import type { AppSummary } from "/types/app-types";
import { useLocation } from "preact-iso";
import { getLang } from "/utils/lang";

type Props = {
  app: AppSummary;
};

export default function AppCard({ app }: Props) {
  const { path } = useLocation();
  const lang = getLang(path ?? "") ?? "en";

  const view = html`
    <a href="/${lang}/app/${app.slug}" class="app-card" data-scope="AppCard">
      <h3 ui-heading="sm">${app.title}</h3>
      <p class="description">${app.description}</p>
      <div class="meta">
        ${app.ownerNickname ? html`<span>${app.ownerNickname}</span>` : ""}
        ${app.remixCount > 0 ? html`<span>${app.remixCount} remixes</span>` : ""}
      </div>
    </a>
  `;

  const style = css`
    @scope ([data-scope="AppCard"]) to ([data-scope]) {
      & {
        display: block;
        padding: 1.25rem;
        border: 1px solid var(--neutral-200);
        border-radius: 1rem;
        background: white;
        color: inherit;
        transition: border-color 0.15s ease;
      }

      &:hover {
        border-color: var(--neutral-400);
      }

      .description {
        margin-top: 0.5rem;
        color: var(--neutral-600);
        font-size: 0.9375rem;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .meta {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
        font-size: 0.8125rem;
        color: var(--neutral-500);
      }
    }
  `;

  return [view, style];
}
