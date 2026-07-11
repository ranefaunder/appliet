import { useEffect } from "preact/hooks";

/**
 * Headless component: ylläpitää documentin CSS-muuttujaa
 * --visual-viewport-height (1 % näkyvän viewportin korkeudesta, px).
 * Käyttö: height: calc(var(--visual-viewport-height, 1dvh) * 100);
 * Tarpeen mm. mobiililla, jolloin näppäimistö pienentää visual viewportia.
 */
export default function VisualViewportHeight() {
  function subscribeViewportHeightVar() {
    const vp = window.visualViewport;
    if (!vp) return;

    function updateHeightUnit() {
      if (!vp) return;
      const onePercentHeightPx = vp.height * 0.01;
      document.documentElement.style.setProperty(
        "--visual-viewport-height",
        `${onePercentHeightPx}px`
      );
    }

    vp.addEventListener("resize", updateHeightUnit);
    updateHeightUnit();
    return () => vp.removeEventListener("resize", updateHeightUnit);
  }
  useEffect(() => subscribeViewportHeightVar(), []);

  return null;
}
