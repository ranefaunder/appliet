import type { ComponentChildren, ComponentType } from "preact";
import { h } from "preact";
import { html, css } from "/utils/markup";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Dialogs from "/app/components/Dialogs";

type LayoutProps = {
  children: ComponentChildren;
};

export default function Layout({ children }: LayoutProps) {
  const view = html`
    <div data-scope="Layout">
      <${Header} />
      <main class="layout-main">
        ${children}
      </main>
      <${Footer} />
      <${Dialogs} />
    </div>
  `;

  const style = css`
    @scope ([data-scope="Layout"]) to ([data-scope]) {
      & {
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }

      .layout-main {
        flex-grow: 1;
      }
    }
  `;

  return [style, view];
}

export function withLayout<P extends object>(Page: ComponentType<P>) {
  return function LayoutRoute(props: P) {
    return h(Layout, { children: h(Page, props) });
  };
}
