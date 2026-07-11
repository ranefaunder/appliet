import { html, css } from "/utils/markup";
import { useState, useRef, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { login } from "/app/stores/userStore";
import { getLang } from "/utils/lang";
import { t } from "/utils/i18n";

type OpenDetail = { email: string; showCodeSentInfo?: boolean };

export default function LoginCodeDialog() {
  const { path } = useLocation();
  const lang = getLang(path ?? "") ?? "en";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [showCodeSentInfo, setShowCodeSentInfo] = useState(true);

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleVerifyCode(e: Event) {
    e.preventDefault();
    setVerifyingCode(true);
    setError("");
    const ok = await login(email.trim(), code.trim());
    setVerifyingCode(false);
    if (!ok) {
      setError("Invalid code");
      return;
    }
    closeDialog();
    setEmail("");
    setCode("");
  }

  useEffect(() => {
    function handler(e: CustomEvent<OpenDetail>) {
      const emailVal = e.detail?.email?.trim() ?? "";
      if (!emailVal) return;
      setEmail(emailVal);
      setShowCodeSentInfo(e.detail?.showCodeSentInfo !== false);
      setCode("");
      setError("");
      requestAnimationFrame(() => {
        dialogRef.current?.showModal();
        codeInputRef.current?.focus();
      });
    }
    window.addEventListener("open-login-dialog-for-code", handler as EventListener);
    return () => window.removeEventListener("open-login-dialog-for-code", handler as EventListener);
  }, []);

  const view = html`
    <dialog id="login-code-dialog" data-scope="LoginCodeDialog" ref=${dialogRef} ui-dialog="xs" closedby="any">
      <header ui-row="x-between y-start gap-lg">
        <h2>Enter login code</h2>
        <button ui-button="square inline" ui-icon="x" onClick=${closeDialog} aria-label="Close"></button>
      </header>
      <form id="login-verify-form" onSubmit=${handleVerifyCode} ui-column="gap-md">
        ${showCodeSentInfo && html`<p class="code-info">Check your inbox and enter the 6-digit code.</p>`}
        <div ui-field>
          <label for="login-code-email">Email</label>
          <input type="email" id="login-code-email" value=${email} readOnly />
        </div>
        <div ui-field>
          <label for="login-code-input">Login code</label>
          <input
            class="code-input"
            type="text"
            id="login-code-input"
            ref=${codeInputRef}
            value=${code}
            onInput=${(e: Event) => {
              const val = (e.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 6);
              setCode(val);
            }}
            maxLength=${6}
            required
            inputmode="numeric"
          />
          <p role="error">${error || ""}</p>
        </div>
      </form>
      <footer ui-column="gap-md">
        <button type="submit" form="login-verify-form" ui-button="primary block" disabled=${verifyingCode}>
          ${t("Login")}
        </button>
      </footer>
    </dialog>
  `;

  const style = css`
    @scope ([data-scope="LoginCodeDialog"]) to ([data-scope]) {
      .code-info {
        font-size: 0.875rem;
        color: var(--neutral-600);
      }
      .code-input {
        font-weight: 600;
        font-size: 1.25rem;
        letter-spacing: 0.25rem;
      }
    }
  `;

  return [view, style];
}
