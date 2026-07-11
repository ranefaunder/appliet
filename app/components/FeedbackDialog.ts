import { html, css } from "/utils/markup";
import { useRef, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { t } from "/utils/i18n";
import { getLang } from "/utils/lang";
import { apiFetch } from "/utils/api.client";

const FEEDBACK_MAIL = "rane@faunder.fi";

export default function FeedbackDialog() {
  const { path } = useLocation();
  const lang = getLang(path ?? "") ?? "en";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  function closeDialog() {
    setSendError("");
    dialogRef.current?.close();
  }

  function handleMessageInput(e: Event) {
    setMessage((e.target as HTMLTextAreaElement).value);
    if (sendError) setSendError("");
  }

  async function handleSendFeedback() {
    const text = message.trim();
    if (!text) return;
    setSending(true);
    setSendError("");
    const pageUrl =
      typeof globalThis.location !== "undefined" ? globalThis.location.href : "";
    const result = await apiFetch(`/api/${lang}/feedback/send`, {
      method: "POST",
      body: JSON.stringify({ message: text, pageUrl }),
    });
    setSending(false);
    if (result.success) {
      setMessage("");
      closeDialog();
      return;
    }
    setSendError(result.error.message ?? t("Feedback could not be sent. Please try again."));
  }

  const mailtoHref = `mailto:${FEEDBACK_MAIL}?subject=${encodeURIComponent("Cuukbuuk feedback")}`;
  const canSend = message.trim().length > 0 && !sending;

  const view = html`
    <dialog id="feedback-dialog" data-scope="FeedbackDialog" ref=${dialogRef} ui-dialog="sm" closedby="any">
      <header ui-row="x-between y-start gap-lg">
        <h2>${t("Feedback")}</h2>
        <button ui-button="square inline" ui-icon="x" onClick=${closeDialog} aria-label=${t("Close")}></button>
      </header>
      <div ui-padding="bottom-xs">
        <p class="feedback-intro">
          ${t(
            "I would love your feedback. Tell me what you like, what I should improve, or what you would like to see—I read every message. You can also email me (the founder) directly at "
          )}<a href=${mailtoHref}>${FEEDBACK_MAIL}</a>.
        </p>

        <div ui-field ui-margin="top-md">
          <textarea
            id="feedback-message"
            name="feedback-message"
            rows="5"
            placeholder=${t("Write your feedback here…")}
            value=${message}
            onInput=${handleMessageInput}
            autocomplete="off"
            disabled=${sending}
            aria-invalid=${sendError ? "true" : undefined}
            aria-describedby=${sendError ? "feedback-send-error" : undefined}
          ></textarea>
          <p id="feedback-send-error" role="alert" class="feedback-error">${sendError}</p>
        </div>
      </div>
      <footer ui-row="gap-sm x-end">
        <button type="button" ui-button="tertiary" onClick=${closeDialog} disabled=${sending}>
          ${t("Cancel")}
        </button>
        <button
          type="button"
          ui-button="primary"
          onClick=${handleSendFeedback}
          disabled=${!canSend}
          aria-busy=${sending}
        >
          ${t("Send Feedback")}
        </button>
      </footer>
    </dialog>
  `;

  const style = css`
    @scope ([data-scope="FeedbackDialog"]) to ([data-scope]) {
      .feedback-intro {
        font-size: 0.875rem;
        color: var(--neutral-600);
      }

      .feedback-error {
        min-height: 1.25rem;
        margin: 0.25rem 0 0 0;
        font-size: 0.875rem;
        color: var(--danger-600, #b91c1c);
      }

      .feedback-error:empty {
        display: none;
      }
    }
  `;

  return [view, style];
}
