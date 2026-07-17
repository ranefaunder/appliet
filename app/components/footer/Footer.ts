import { html, css } from "/utils/markup";
import { t } from "/utils/i18n";
import { socialLinks } from "/app/stores/configStore";

export default function Footer() {
  const view = html`
    <footer data-scope="Footer" ui-container="lg" ui-column="gap-md" ui-margin="top-4xl" ui-padding="block-2xl bottom-3xl">
      <p class="tagline">${t("Your apps evolve with your needs.")}</p>
      <div ui-row="gap-md">
        <a href=${socialLinks.twitter} target="_blank" rel="noopener noreferrer" ui-link="inherit">X</a>
        <a href=${socialLinks.bluesky} target="_blank" rel="noopener noreferrer" ui-link="inherit">Bluesky</a>
      </div>
      <p>© ${new Date().getFullYear()} Abblet</p>
    </footer>
  `;

  const style = css`
    @scope ([data-scope="Footer"]) to ([data-scope]) {
      & {
        color: var(--neutral-500);
        font-size: 0.875rem;
      }

      .tagline {
        font-size: 1rem;
        color: var(--neutral-700);
      }
    }
  `;

  return [view, style];
}
