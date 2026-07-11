import { h } from "preact";
import { html, css } from "/utils/markup";
import { useRef } from "preact/hooks";
import { t } from "/utils/i18n";
import { highlightJavaScript } from "/utils/highlight-js";

type Props = {
  code: string;
  tagName: string;
};

function HighlightedCode({ code }: { code: string }) {
  return h("pre", { class: "code-block", "ui-off": true, "ui-code": "scroll" }, h("code", {
    "ui-off": true,
    dangerouslySetInnerHTML: { __html: highlightJavaScript(code) },
  }));
}

export default function AppCodePreviewDialog({ code, tagName }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  }

  const view = html`
    <dialog
      id="app-code-preview-dialog"
      ref=${dialogRef}
      data-scope="AppCodePreviewDialog"
      ui-dialog="lg"
      closedby="any"
    >
      <header ui-row="x-between y-start gap-lg">
        <div>
          <h2 ui-heading="sm">${t("Web component code")}</h2>
          ${h("p", { class: "tag-name" }, `<${tagName}>`)}
        </div>
        <button
          type="button"
          ui-button="square inline"
          ui-icon="x"
          onClick=${closeDialog}
          aria-label=${t("Close")}
        ></button>
      </header>

      <div class="code-wrap">
        ${h(HighlightedCode, { code })}
      </div>

      <footer ui-row="gap-sm x-end">
        <button type="button" ui-button="secondary sm" onClick=${copyCode}>
          ${t("Copy code")}
        </button>
        <button type="button" ui-button="primary sm" onClick=${closeDialog}>
          ${t("Close")}
        </button>
      </footer>
    </dialog>
  `;

  const style = css`
    @scope ([data-scope="AppCodePreviewDialog"]) to ([data-scope]) {
      .tag-name {
        margin-top: 0.25rem;
        font-size: 0.8125rem;
        color: var(--neutral-500);
        font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace;
      }

      .code-wrap {
        margin-block: 1rem;
        max-height: min(60vh, 32rem);
        overflow: auto;
        border: 1px solid var(--neutral-200);
        border-radius: 0.75rem;
        background: #1e1e1e;
      }

      .code-block {
        margin: 0;
        padding: 1rem 1.25rem;
        font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace;
        font-size: 0.8125rem;
        line-height: 1.6;
        white-space: pre;
        tab-size: 2;
        color: #d4d4d4;
        background: transparent;
        border-radius: 0;
      }

      .code-block > code {
        display: block;
        padding: 0;
        background: none;
        color: #d4d4d4;
      }
    }

    [data-scope="AppCodePreviewDialog"] .code-block .hl-keyword { color: #c586c0; }
    [data-scope="AppCodePreviewDialog"] .code-block .hl-string { color: #ce9178; }
    [data-scope="AppCodePreviewDialog"] .code-block .hl-comment { color: #6a9955; font-style: italic; }
    [data-scope="AppCodePreviewDialog"] .code-block .hl-number { color: #b5cea8; }
    [data-scope="AppCodePreviewDialog"] .code-block .hl-function { color: #dcdcaa; }
    [data-scope="AppCodePreviewDialog"] .code-block .hl-class { color: #4ec9b0; }
    [data-scope="AppCodePreviewDialog"] .code-block .hl-builtin { color: #569cd6; }
  `;

  return [view, style];
}
