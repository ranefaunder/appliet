import { html, css } from "/utils/markup";
import { useRef, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { t } from "/utils/i18n";
import { getLang } from "/utils/lang";
import { isLoggedIn } from "/app/stores/userStore";
import { apiFetch } from "/utils/api.client";

const EXAMPLES = [
  "tracking my camping gear",
  "a wine journal",
  "my reading list",
  "a home maintenance log",
  "a recipe collection",
];

export default function HomeHero() {
  const { route } = useLocation();
  const lang = getLang(typeof window !== "undefined" ? window.location.pathname : "/en/") ?? "en";
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * EXAMPLES.length));

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const prompt = inputRef.current?.value.trim();
    if (!prompt) return;

    if (!isLoggedIn()) {
      document.getElementById("register-dialog")?.showModal?.();
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch<{ id: string; slug: string }>(`/api/${lang}/app/generate`, {
        method: "POST",
        body: JSON.stringify({ prompt, language: lang }),
      });
      if (result.success) {
        route(`/${lang}/app/${result.data.slug}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const view = html`
    <header data-scope="HomeHero" ui-container="md">
      <div class="content">
        <p class="eyebrow">App Studo</p>
        <h1 class="title" ui-heading="xxl" ui-margin="bottom-md">
          ${t("Build the app you need.")}
        </h1>
        <p class="subtitle" ui-margin="bottom-xl">
          ${t("Describe what you need and App Studo creates a working app in minutes. Use it yourself, share it with others, or remix apps created by the community.")}
        </p>

        <form class="prompt-form" onSubmit=${handleSubmit}>
          <label class="prompt-label" for="app-prompt">${t("Create an app for…")}</label>
          <textarea
            id="app-prompt"
            ref=${inputRef}
            rows="3"
            placeholder=${`Create an app for ${EXAMPLES[placeholderIndex]}.`}
            disabled=${loading}
          ></textarea>
          <div class="actions" ui-row>
            <button type="submit" ui-button="primary" disabled=${loading}>
              ${loading ? t("Creating your app…") : t("Start building")}
            </button>
            <a href="/${lang}/explore" ui-button="secondary">
              ${t("Explore apps")}
            </a>
          </div>
          ${!isLoggedIn()
            ? html`<p class="hint">${t("Sign in to create apps")}</p>`
            : ""}
        </form>
      </div>
    </header>
  `;

  const style = css`
    @scope ([data-scope="HomeHero"]) to ([data-scope]) {
      & {
        container-type: inline-size;
        background: linear-gradient(180deg, var(--neutral-50) 0%, var(--neutral-0, #fff) 100%);
        padding-top: 4rem;
        padding-bottom: 5rem;
        min-height: 55vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .content {
        max-width: 42rem;
        margin-inline: auto;
        text-align: center;
      }

      .eyebrow {
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--neutral-500);
        margin-bottom: 1rem;
      }

      .title {
        font-size: clamp(2rem, 4vw + 1rem, 3.25rem);
        letter-spacing: -0.03em;
        text-wrap: balance;
      }

      .subtitle {
        font-size: 1.125rem;
        color: var(--neutral-600);
        text-wrap: balance;
        line-height: 1.6;
      }

      .prompt-form {
        text-align: left;
        background: white;
        border: 1px solid var(--neutral-200);
        border-radius: 1rem;
        padding: 1.25rem;
        box-shadow: 0 1px 2px rgb(0 0 0 / 4%);
      }

      .prompt-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      textarea {
        width: 100%;
        resize: vertical;
        min-height: 5rem;
        padding: 0.75rem;
        border: 1px solid var(--neutral-200);
        border-radius: 0.75rem;
        font: inherit;
        line-height: 1.5;
      }

      .actions {
        margin-top: 1rem;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .hint {
        margin-top: 0.75rem;
        font-size: 0.8125rem;
        color: var(--neutral-500);
      }
    }
  `;

  return [view, style];
}
