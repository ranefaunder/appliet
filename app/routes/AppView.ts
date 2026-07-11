import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import AppRuntime from "/app/components/app/AppRuntime";

export const AppViewPath = "/:lang/app/:slug" as const;

export default function AppView(props: RoutePropsForPath<typeof AppViewPath>) {
  const slug = props.params.slug;

  const view = html`
    <div data-scope="AppView" ui-container="md" ui-margin="top-2xl">
      <${AppRuntime} slug=${slug} />
    </div>
  `;

  const style = css`
    @scope ([data-scope="AppView"]) to ([data-scope]) {
      & {
        padding-bottom: 6rem;
      }
    }
  `;

  return [view, style];
}
