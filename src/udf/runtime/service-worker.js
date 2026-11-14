// Registers public/sw.js (stadium file cache). Skipped in dev and where unsupported.
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  navigator.serviceWorker.register(new URL("sw.js", document.baseURI)).catch((error) => {
    console.warn("Service worker registration failed:", error);
  });
}
