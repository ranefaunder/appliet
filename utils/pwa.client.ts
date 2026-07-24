/**
 * Registers Service Worker for PWA
 * Provides offline support and automatic updates
 */
export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    let didRefreshForUpdate = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (didRefreshForUpdate) return;
      didRefreshForUpdate = true;
      window.location.reload();
    });

    // Sama origin kuin sivu — ei CDN/staticRoot (cross-origin SW ei kelpaa).
    navigator.serviceWorker
      .register("/static/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        console.info("[PWA] Service Worker registered:", registration.scope);

        // Check for updates immediately and periodically.
        void registration.update();
        const updateIntervalMs = 5 * 60 * 1000;
        window.setInterval(() => {
          void registration.update();
        }, updateIntervalMs);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.info("[PWA] New version available! Refresh to update.");
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn("[PWA] Service Worker registration failed:", error);
      });
  });
}

