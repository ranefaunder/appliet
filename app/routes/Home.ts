import { html, css } from "/utils/markup";
import type { RoutePropsForPath } from "preact-iso";
import HomeHero from "/app/components/home/HomeHero";
import Features from "/app/components/home/Features";
import HowItWorks from "/app/components/home/HowItWorks";
import Faq from "/app/components/home/Faq";
import ClosingCta from "/app/components/home/ClosingCta";

export const HomePath = "/:lang" as const;

export default function Home(_props: RoutePropsForPath<typeof HomePath>) {
  const view = html`
    <div data-scope="Home">
      <${HomeHero} />

      <section ui-container="md" ui-margin="top-3xl">
        <${Features} />
      </section>

      <section ui-container="md" ui-margin="top-4xl">
        <${HowItWorks} />
      </section>

      <section ui-container="md" ui-margin="top-4xl">
        <${Faq} />
      </section>

      <section ui-container="md" ui-margin="top-4xl">
        <${ClosingCta} />
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
