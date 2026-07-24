import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { useLocation } from "preact-iso";
import { t } from "/utils/i18n";
import { getLang } from "/utils/lang";
import { type AppCategory } from "/utils/app-categories";
import { galleryAppUrl } from "/utils/app-url";
import { appIconSrc } from "/utils/app-icon";
import { previewGradient, draftLetter } from "/utils/app-preview";
import type { GalleryAppCard } from "/types/app-types";
import {
  galleryApps,
  galleryCategories,
  galleryCategory,
  galleryError,
  galleryLoading,
  galleryQuery,
  loadGallery,
} from "/app/stores/galleryStore";

export const GalleryPath = "/:lang/gallery" as const;

function categoryLabel(category: AppCategory): string {
  return t(category);
}

function GalleryCard({ app, lang }: { app: GalleryAppCard; lang: string }) {
  const iconSrc = appIconSrc(app.iconId);
  const gradient = previewGradient(app.slug);
  const letter = draftLetter(app.title);

  return html`
    <a ui-card ui-padding="md" href=${galleryAppUrl(lang, app.slug)} ui-row="y-center gap-md">
      <span class="app-icon" style=${`background: ${gradient}`} aria-hidden="true">
        ${iconSrc
          ? html`<img src=${iconSrc} alt="" width="56" height="56" decoding="async" />`
          : html`<span>${letter}</span>`}
      </span>
      <span ui-column="gap-xs" class="card-copy">
        <strong>${app.title}</strong>
        <small>${app.tagline || app.description}</small>
        ${app.category
          ? html`<small class="meta">${categoryLabel(app.category as AppCategory)}</small>`
          : ""}
      </span>
      <i ui-icon="chevron-right" aria-hidden="true"></i>
    </a>
  `;
}

export default function Gallery(_props: RoutePropsForPath<typeof GalleryPath>) {
  const { path } = useLocation();
  const lang = getLang(path ?? "") ?? "en";
  const draftQ = useSignal(galleryQuery.value);
  const searchOpen = useSignal(Boolean(galleryQuery.value.trim()));
  const searchRef = useRef<HTMLInputElement>(null);
  const apps = galleryApps.value;
  const loading = galleryLoading.value;
  const category = galleryCategory.value;
  const categories = galleryCategories.value;
  const visibleCategories =
    category && !categories.includes(category) ? [...categories, category] : categories;
  const featured = apps[0] ?? null;
  const rest = featured ? apps.slice(1) : apps;
  const showFeatured = Boolean(featured && !galleryQuery.value.trim() && !category);

  useEffect(() => {
    void loadGallery();
  }, []);

  useEffect(() => {
    if (searchOpen.value) searchRef.current?.focus();
  }, [searchOpen.value]);

  function submitSearch(e: Event) {
    e.preventDefault();
    void loadGallery({ q: draftQ.value });
  }

  function openSearch() {
    searchOpen.value = true;
  }

  function onSearchBlur() {
    if (draftQ.value.trim()) return;
    searchOpen.value = false;
    if (galleryQuery.value.trim()) void loadGallery({ q: "" });
  }

  function selectCategory(next: AppCategory | null) {
    void loadGallery({ category: next });
  }

  const view = html`
    <div data-scope="Gallery" ui-column>
      <header ui-padding="inline-md block-md" ui-column="gap-md" class="top">
        <div class="top-row">
          <div class="top-start">
            <a
              href=${`/${lang}/`}
              ui-button="tertiary square sm"
              ui-icon="arrow-left"
              aria-label=${t("Back")}
            ></a>
          </div>
          <div class="top-center">
            <h1 ui-heading="sm">${t("App Gallery")}</h1>
          </div>
          <div class="top-end">
            ${searchOpen.value
              ? html`
                <form onSubmit=${submitSearch} ui-field class="top-search">
                  <label class="sr-only" for="gallery-search">${t("Search apps")}</label>
                  <input
                    id="gallery-search"
                    ref=${searchRef}
                    type="search"
                    ui-input="sm"
                    placeholder=${t("Search apps")}
                    value=${draftQ.value}
                    onInput=${(e: Event) => {
                      draftQ.value = (e.target as HTMLInputElement).value;
                    }}
                    onBlur=${onSearchBlur}
                  />
                </form>`
              : html`
                <button
                  type="button"
                  ui-button="tertiary square sm"
                  ui-icon="search"
                  aria-label=${t("Search apps")}
                  onClick=${openSearch}
                ></button>`}
          </div>
        </div>

        ${visibleCategories.length > 0
          ? html`
            <div class="chips" role="tablist" aria-label=${t("Categories")} ui-row="gap-sm">
              <button
                type="button"
                ui-button=${!category ? "primary sm" : "tertiary sm"}
                onClick=${() => selectCategory(null)}
              >
                ${t("All")}
              </button>
              ${visibleCategories.map(
                (c) => html`
                  <button
                    type="button"
                    ui-button=${category === c ? "primary sm" : "tertiary sm"}
                    onClick=${() => selectCategory(c)}
                  >
                    ${categoryLabel(c)}
                  </button>`,
              )}
            </div>`
          : ""}
      </header>

      <div class="body" ui-column="gap-lg">
        ${loading && apps.length === 0
          ? html`
            <div ui-column="gap-md x-center y-center" ui-padding="xl">
              <i ui-icon="spinner lg"></i>
              <p>${t("Loading…")}</p>
            </div>`
          : galleryError.value
            ? html`<p role="alert">${galleryError.value}</p>`
            : apps.length === 0
              ? html`
                <div ui-column="gap-sm x-center" ui-padding="xl">
                  <p ui-heading="sm">${t("No apps in App Gallery yet")}</p>
                  <p>${t("Apps published to App Gallery will show up here.")}</p>
                </div>`
              : html`
                ${showFeatured
                  ? html`
                    <a
                      class="featured"
                      ui-card
                      ui-padding="lg"
                      href=${galleryAppUrl(lang, featured!.slug)}
                      ui-row="x-between y-center gap-md"
                    >
                      <div ui-column="gap-xs" class="featured-copy">
                        <small>${t("Featured")}</small>
                        <strong ui-heading="sm">${featured!.title}</strong>
                        <p>${featured!.tagline || featured!.description}</p>
                      </div>
                      <span
                        class="app-icon lg"
                        style=${`background: ${previewGradient(featured!.slug)}`}
                        aria-hidden="true"
                      >
                        ${appIconSrc(featured!.iconId)
                          ? html`<img
                              src=${appIconSrc(featured!.iconId)!}
                              alt=""
                              width="72"
                              height="72"
                            />`
                          : html`<span>${draftLetter(featured!.title)}</span>`}
                      </span>
                    </a>`
                  : ""}

                <section ui-column="gap-sm">
                  <h2 ui-heading="sm">
                    ${category
                      ? categoryLabel(category)
                      : galleryQuery.value.trim()
                        ? t("Results")
                        : t("New & Noteworthy")}
                  </h2>
                  <div ui-column="gap-sm">
                    ${(showFeatured ? rest : apps).map(
                      (app) => html`<${GalleryCard} app=${app} lang=${lang} />`,
                    )}
                  </div>
                </section>`}
      </div>
    </div>
  `;

  const style = css`
    @scope ([data-scope="Gallery"]) to ([data-scope]) {
      & {
        flex: 1;
        min-height: 0;
        background: var(--neutral-50);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .top {
        flex: none;
        padding-top: calc(0.75rem + env(safe-area-inset-top, 0px));
        border-bottom: 1px solid var(--neutral-200);
        background: color-mix(in oklab, var(--neutral-50) 88%, var(--white));
        backdrop-filter: blur(12px);
      }

      .top-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
      }

      .top-start {
        justify-self: start;
      }

      .top-center {
        justify-self: center;
        min-width: 0;
        text-align: center;
      }

      .top-center h1 {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .top-end {
        justify-self: stretch;
        min-width: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .top-search {
        width: 100%;
        min-width: 0;
      }

      .top-search input {
        min-height: 2.25rem;
        height: 2.25rem;
        padding-block: 0.25rem;
        font-size: 0.875rem;
        line-height: 1.2;
      }

      .chips {
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .chips::-webkit-scrollbar {
        display: none;
      }

      .body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
      }

      .card-copy {
        min-width: 0;
        flex: 1;
      }

      .card-copy small,
      .card-copy p {
        color: var(--neutral-500);
      }

      .card-copy .meta {
        font-weight: 600;
      }

      .card-copy strong,
      .card-copy p,
      .card-copy small {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-copy strong {
        -webkit-line-clamp: 1;
      }

      .card-copy p,
      .card-copy small:not(.meta) {
        -webkit-line-clamp: 2;
      }

      .featured {
        border-color: transparent;
        background: linear-gradient(135deg, #0a84ff 0%, #007aff 55%, #0066d6 100%);
        color: #fff;
        box-shadow: 0 12px 28px rgba(0, 122, 255, 0.28);
      }

      .featured:hover {
        background: linear-gradient(135deg, #1a8fff 0%, #0a84ff 55%, #0070e0 100%);
      }

      .featured-copy {
        min-width: 0;
        flex: 1;
      }

      .featured-copy small {
        color: rgba(255, 255, 255, 0.78);
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .featured-copy strong,
      .featured-copy p {
        color: #fff;
      }

      .featured-copy p {
        opacity: 0.9;
      }

      .app-icon {
        flex: none;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 0.85rem;
        overflow: hidden;
        display: grid;
        place-items: center;
        color: var(--white);
        font-weight: 700;
        font-size: 1.25rem;
      }

      .app-icon.lg {
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 1rem;
        font-size: 1.75rem;
      }

      .app-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      @media (min-width: 720px) {
        .top,
        .body {
          width: min(100%, 36rem);
          margin-inline: auto;
        }
      }
    }
  `;

  return [view, style];
}
