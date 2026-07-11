import { html, css } from "/utils/markup";
import { t } from "/utils/i18n";

const STEPS = [
  {
    title: "Describe your idea",
    body: "Tell App Studo what you need — a packing list, budget tracker, or anything else.",
  },
  {
    title: "Use it instantly",
    body: "App Studo generates a working app you can start using right away.",
  },
  {
    title: "Edit, share, remix",
    body: "Improve your app with prompts, publish it, or remix community apps.",
  },
];

export default function HowItWorks() {
  const view = html`
    <section data-scope="HowItWorks">
      <h2 ui-heading="lg" ui-margin="bottom-xl">${t("How it works")}</h2>
      <ol class="steps">
        ${STEPS.map((step, index) => html`
          <li class="step">
            <span class="step-number">${index + 1}</span>
            <div>
              <h3 ui-heading="sm">${t(step.title as Parameters<typeof t>[0])}</h3>
              <p>${t(step.body as Parameters<typeof t>[0])}</p>
            </div>
          </li>
        `)}
      </ol>
    </section>
  `;

  const style = css`
    @scope ([data-scope="HowItWorks"]) to ([data-scope]) {
      .steps {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1.5rem;
      }

      .step {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem;
        align-items: start;
        padding: 1.25rem;
        border: 1px solid var(--neutral-200);
        border-radius: 1rem;
        background: white;
      }

      .step-number {
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: var(--neutral-100);
        font-weight: 600;
        font-size: 0.875rem;
      }

      .step p {
        color: var(--neutral-600);
        margin-top: 0.25rem;
        line-height: 1.5;
      }
    }
  `;

  return [view, style];
}
