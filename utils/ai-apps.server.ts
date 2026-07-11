import { requestJsonFromAi } from "/utils/ai-core.server";
import { appConfigSchema, type AppConfig } from "/types/app-config-types";
import type { Language } from "/types/i18n-types";
import { AVAILABLE_LANGUAGES } from "/i18n/languages";

const aiAppSchema = appConfigSchema.omit({ version: true, status: true, prompt: true });

export async function generateAppConfig(prompt: string, language: Language): Promise<AppConfig | null> {
  const langName = AVAILABLE_LANGUAGES[language]?.name ?? "English";

  const systemPrompt = `You build small personal apps for App Studo. Each app is a single, self-contained Web Component (custom element) written in vanilla JavaScript.

Return one JSON object with:
- title: short app name (max 60 chars), not the raw user prompt
- description: 1-2 sentences describing what the app does
- emoji: one relevant emoji
- tagName: valid custom element name, lowercase with at least one hyphen (e.g. "run-log", "wine-journal")
- code: complete JavaScript that registers the custom element

STRICT RULES for "code":
- Must call customElements.define("<tagName>", class extends HTMLElement { ... }) with the exact tagName you chose.
- Vanilla JavaScript only. NO imports, NO external libraries, NO CDN links, NO network requests (no fetch/XMLHttpRequest/WebSocket).
- Use Shadow DOM (this.attachShadow({ mode: "open" })) and put ALL markup and CSS inside the shadow root so styles never leak.
- The component is fully interactive and complete: it builds its own UI, handles input, and renders results.
- Persist ALL user data itself using localStorage (or IndexedDB for larger/complex data). Key every storage entry with a unique prefix derived from the tagName, e.g. "app-studo:<tagName>:...". Load saved data in connectedCallback and save on every change.
- Do NOT rely on any external CSS, fonts, or global variables. Everything self-contained.
- Modern, calm, minimal UI (system font stack, generous spacing, rounded corners, subtle borders). Mobile-friendly, responsive.
- Robust: guard against JSON.parse errors on stored data.
- All user-visible text in ${langName}.

Design the app to solve exactly the user's need, and nothing more. Keep it small and focused.`;

  const generated = await requestJsonFromAi({
    systemPrompt,
    userPrompt: `Create an app for: ${prompt}`,
    schema: aiAppSchema,
  });

  if (!generated) return null;

  // Varmistus: koodissa on oltava annetun tagNamen rekisteröinti.
  if (!generated.code.includes(generated.tagName)) return null;

  return {
    version: 2,
    status: "ready",
    prompt,
    ...generated,
  };
}
