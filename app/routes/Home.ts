import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import HomeHero from "/app/components/home/HomeHero";
import HowItWorks from "/app/components/home/HowItWorks";
import Philosophy from "/app/components/home/Philosophy";

export const HomePath = "/:lang" as const;

export default function Home(_props: RoutePropsForPath<typeof HomePath>) {
  const view = html`
    <div data-scope="Home">
      <${HomeHero} />

      <section ui-container="md" ui-margin="top-4xl">
        <${HowItWorks} />
      </section>

      <section ui-container="md" ui-margin="top-4xl">
        <${Philosophy} />
      </section>
    </div>
  `;

  const style = css`
    @scope ([data-scope="Home"]) to ([data-scope]) {
      & {
        container-type: inline-size;
        padding-bottom: 6rem;
      }
    }
  `;

  return [view, style];
}
