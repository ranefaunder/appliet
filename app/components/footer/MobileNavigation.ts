import { html, css } from "/utils/markup";
import { useLocation } from "preact-iso";
import { getLang } from "/utils/lang";
import { t } from "/utils/i18n";

function isHomePath(path: string, lang: string): boolean {
  const normalized = path.replace(/\/+$/, "") || "/";
  return normalized === `/${lang}` || normalized === "";
}

function isCreatePath(path: string, lang: string): boolean {
  return path.includes(`/${lang}/create`);
}

function isSettingsPath(path: string, lang: string): boolean {
  return path.includes(`/${lang}/settings`);
}

const DOCK_ITEMS = [
  {
    key: "apps",
    href: (lang: string) => `/${lang}/`,
    label: "Apps" as const,
    image: "/static/images/dock-apps.png",
    tone: "image",
    active: isHomePath,
  },
  {
    key: "create",
    href: (lang: string) => `/${lang}/create`,
    label: "Create" as const,
    icon: "magic-wand",
    tone: "violet",
    active: isCreatePath,
  },
  {
    key: "settings",
    href: (lang: string) => `/${lang}/settings`,
    label: "Settings" as const,
    icon: "user-circle-gear",
    tone: "slate",
    active: isSettingsPath,
  },
] as const;

/** Apple-tyylinen squircle-maski (continuous corner). */
const SQUIRCLE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path fill="black" d="M50 0C77.6 0 88.5 0 94.3 5.7C100 11.5 100 22.4 100 50C100 77.6 100 88.5 94.3 94.3C88.5 100 77.6 100 50 100C22.4 100 11.5 100 5.7 94.3C0 88.5 0 77.6 0 50C0 22.4 0 11.5 5.7 5.7C11.5 0 22.4 0 50 0Z"/>
  </svg>`,
)}")`;

export default function MobileNavigation() {
  const { path: locationPath } = useLocation();
  const path = locationPath ?? "";
  const lang = getLang(path) ?? "en";
  const onHome = isHomePath(path, lang);

  const view = html`
    <nav
      data-scope="MobileNavigation"
      class=${onHome ? "chrome on-home" : "chrome"}
      aria-label=${t("Apps")}
    >
      <div class="chrome-inner">
        <div class="dock-shell">
          ${DOCK_ITEMS.map((item) => {
            const active = item.active(path, lang);
            const image = "image" in item ? item.image : null;
            const icon = "icon" in item ? item.icon : null;
            return html`
              <a
                class=${`dock-item ${item.tone}${active ? " active" : ""}`}
                href=${item.href(lang)}
                aria-label=${t(item.label)}
                aria-current=${active ? "page" : undefined}
              >
                <span class=${image ? "dock-glyph image" : "dock-glyph"}>
                  ${image
                    ? html`<img
                        class="dock-img"
                        src=${image}
                        alt=""
                        width="128"
                        height="128"
                        decoding="async"
                      />`
                    : html`<i ui-icon=${`${icon} lg`} aria-hidden="true"></i>`}
                  ${image ? "" : html`<span class="dock-shine" aria-hidden="true"></span>`}
                </span>
              </a>`;
          })}
        </div>
      </div>
    </nav>
  `;

  const style = css`
    @scope ([data-scope="MobileNavigation"]) to ([data-scope]) {
      &.chrome {
        --dock-icon: clamp(3.65rem, 15.4vw, 4.25rem);
        --home-width: min(100%, 24.75rem);
        --home-inline: 1.7rem;
        --dock-gap: 0.85rem;
        --squircle: ${SQUIRCLE_MASK};

        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        display: flex;
        justify-content: center;
        padding: 0 var(--home-inline) calc(0.55rem + env(safe-area-inset-bottom, 0px));
        pointer-events: none;
        background: transparent;
        border: none;
      }

      .chrome-inner {
        pointer-events: auto;
        width: min(100%, var(--home-width));
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .dock-shell {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: var(--dock-gap);
        width: 100%;
        padding: 0.7rem 1rem;
        border-radius: 2.1rem;
        background: oklch(from var(--white) l c h / 18%);
        backdrop-filter: blur(50px) saturate(190%);
        -webkit-backdrop-filter: blur(50px) saturate(190%);
        border: 1px solid oklch(from var(--white) l c h / 28%);
        box-shadow:
          0 12px 40px oklch(from var(--black) l c h / 18%),
          inset 0 0.5px 0 oklch(from var(--white) l c h / 45%),
          inset 0 -0.5px 0 oklch(from var(--black) l c h / 8%);
      }

      .dock-item {
        display: grid;
        place-items: center;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .dock-glyph {
        position: relative;
        display: grid;
        place-items: center;
        width: var(--dock-icon);
        height: var(--dock-icon);
        color: var(--white);
        filter: drop-shadow(0 1px 0.5px oklch(from var(--black) l c h / 16%))
          drop-shadow(0 6px 12px oklch(from var(--black) l c h / 20%));
        transition: transform 0.18s cubic-bezier(0.2, 0.9, 0.2, 1);
        -webkit-mask-image: var(--squircle);
        mask-image: var(--squircle);
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
      }

      .dock-glyph.image {
        background: transparent;
      }

      .dock-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .dock-item.violet .dock-glyph {
        background:
          radial-gradient(120% 90% at 30% 15%, oklch(from var(--white) l c h / 32%), transparent 42%),
          linear-gradient(165deg, #ffa9f0 0%, #bf5af2 45%, #8944ab 100%);
      }

      .dock-item.slate .dock-glyph {
        background:
          radial-gradient(120% 90% at 30% 15%, oklch(from var(--white) l c h / 40%), transparent 42%),
          linear-gradient(165deg, #e5e5ea 0%, #8e8e93 52%, #636366 100%);
      }

      .dock-shine {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(
          180deg,
          oklch(from var(--white) l c h / 30%) 0%,
          oklch(from var(--white) l c h / 6%) 40%,
          transparent 55%
        );
      }

      .dock-item:hover .dock-glyph,
      .dock-item:focus-visible .dock-glyph {
        transform: scale(1.04);
      }

      .dock-item:active .dock-glyph {
        transform: scale(0.88);
        transition-duration: 0.07s;
      }

      .dock-item.active .dock-glyph {
        filter: drop-shadow(0 1px 0.5px oklch(from var(--black) l c h / 16%))
          drop-shadow(0 6px 12px oklch(from var(--black) l c h / 20%))
          brightness(1.06);
      }

      /* Muilla sivuilla dock vain mobiilissa; etusivulla myös desktopilla. */
      @media (min-width: 700px) {
        &:not(.on-home) {
          display: none;
        }

        &.on-home {
          --dock-icon: 4.15rem;
          --home-width: min(100%, 46rem);
          --home-inline: 2.75rem;
          --dock-gap: 1.5rem;
        }

        &.on-home .dock-shell {
          padding: 0.8rem 1.35rem;
          border-radius: 2.35rem;
        }
      }

      @media (min-width: 1024px) {
        &.on-home {
          --dock-icon: 4.35rem;
          --home-width: min(100%, 58rem);
          --home-inline: 3.5rem;
          --dock-gap: 2rem;
        }

        &.on-home .dock-shell {
          max-width: 28rem;
          padding: 0.85rem 1.5rem;
        }
      }

      @media (min-width: 1280px) {
        &.on-home {
          --dock-icon: 4.5rem;
          --home-width: min(100%, 66rem);
          --home-inline: 4rem;
        }
      }
    }
  `;

  return [view, style];
}
