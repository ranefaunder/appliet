import { html, css } from "/utils/markup";
import { getLang } from "/utils/lang";
import { t } from "/utils/i18n";
/** Oletusreitillä ei ole path-mallia; router välittää matchPropsina. */
type NotFoundPageProps = {
  path: string;
  query: Record<string, string>;
  params: Record<string, string>;
};

export default function NotFound({ path, params }: NotFoundPageProps) {
  const currentLang = params.lang || getLang(path) || "en";
  
  const view = html`
    <div data-scope="NotFound" class="not-found-container">
      <div class="not-found-content">
        <h1 class="not-found-404">404</h1>
        <h2 class="xl not-found-title">${t("Page not found")}</h2>
        <p class="not-found-description">
          The page you are looking for does not exist or has been moved.
        </p>
        <a 
          href=${`/${currentLang}/`} 
          ui-button="primary lg"
        >
          ${t("Go home")}
        </a>
      </div>
    </div>
  `;

  const style = css`
    @scope ([data-scope="NotFound"]) to ([data-scope]) {
      .not-found-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        padding: 2rem;
      }

      .not-found-content {
        text-align: center;
      }

      .not-found-404 {
        font-size: 6rem;
        font-weight: 700;
        color: var(--neutral-300);
        margin-bottom: 1rem;
        line-height: 1;
      }

      .not-found-title {
        margin-bottom: 0.5rem;
      }

      .not-found-description {
        margin-bottom: 2rem;
        color: var(--neutral-600);
      }
    }
  `;

  return [view, style];
}
