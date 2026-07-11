import { html, css } from "/utils/markup";
import { t } from "/utils/i18n";

const EXAMPLES = [
  "Packing List",
  "Reading Journal",
  "Budget Tracker",
  "Recipe Book",
  "Habit Tracker",
];

export default function Philosophy() {
  const view = html`
    <section data-scope="Philosophy">
      <h2 ui-heading="lg" ui-margin="bottom-md">${t("Personal tools, not enterprise software")}</h2>
      <p class="lead" ui-margin="bottom-xl">${t("Every idea deserves its own app.")}</p>
      <div class="examples">
        ${EXAMPLES.map((name) => html`<span class="chip">${name}</span>`)}
      </div>
    </section>
  `;

  const style = css`
    @scope ([data-scope="Philosophy"]) to ([data-scope]) {
      .lead {
        font-size: 1.125rem;
        color: var(--neutral-600);
      }

      .examples {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .chip {
        padding: 0.375rem 0.75rem;
        border-radius: 999px;
        background: var(--neutral-100);
        font-size: 0.875rem;
      }
    }
  `;

  return [view, style];
}
