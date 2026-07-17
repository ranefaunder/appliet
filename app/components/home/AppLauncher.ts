import { html, css } from "/utils/markup";
import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { t } from "/utils/i18n";
import { getLang } from "/utils/lang";
import { apps, loadApps, clearApps } from "/app/stores/appStore";
import { isLoggedIn, user } from "/app/stores/userStore";
import AppIcon from "/app/components/home/AppIcon";

export default function AppLauncher() {
  const { path } = useLocation();
  const lang = getLang(path ?? "") ?? "en";
  const loggedInUser = user.value;
  const readyApps = apps.value.filter((app) => !app.isDraft);

  useEffect(() => {
    if (loggedInUser) {
      void loadApps();
    } else {
      clearApps();
    }
  }, [loggedInUser?.id]);

  const view = html`
    <div data-scope="AppLauncher">
      ${!isLoggedIn()
        ? html`
          <div class="glass-card" ui-column="gap-md x-center">
            <p class="glass-title">${t("Sign in to open your apps")}</p>
            <button
              type="button"
              ui-button="primary"
              onClick=${() => (document.getElementById("login-dialog") as HTMLDialogElement | null)?.showModal()}
            >
              ${t("Login")}
            </button>
          </div>`
        : readyApps.length === 0
          ? html`
            <div class="glass-card" ui-column="gap-md x-center">
              <p class="glass-title">${t("Use Create to build your first app.")}</p>
              <a href=${`/${lang}/create`} ui-button="primary">${t("Create")}</a>
            </div>`
          : html`
            <div class="grid">
              ${readyApps.map((app) => html`<${AppIcon} app=${app} />`)}
            </div>`}
    </div>
  `;

  const style = css`
    @scope ([data-scope="AppLauncher"]) to ([data-scope]) {
      .grid {
        display: grid;
        grid-template-columns: repeat(var(--home-cols, 4), minmax(0, 1fr));
        column-gap: var(--home-gap-x, 1.05rem);
        row-gap: var(--home-gap-y, 1.55rem);
        justify-items: center;
      }

      .glass-card {
        margin: 18vh auto 0;
        max-width: 17.5rem;
        padding: 1.6rem 1.35rem;
        text-align: center;
        border-radius: 1.65rem;
        background: oklch(from var(--white) l c h / 16%);
        backdrop-filter: blur(36px) saturate(170%);
        -webkit-backdrop-filter: blur(36px) saturate(170%);
        border: 1px solid oklch(from var(--white) l c h / 28%);
        box-shadow:
          0 16px 48px oklch(from var(--black) l c h / 22%),
          inset 0 0.5px 0 oklch(from var(--white) l c h / 40%);
      }

      .glass-title {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: -0.01em;
        color: var(--white);
        text-shadow: 0 1px 2px oklch(from var(--black) l c h / 35%);
      }
    }
  `;

  return [view, style];
}
