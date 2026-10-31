// Read-more dialogs: any [data-opens="<dialog id>"] opens a .sheet dialog.
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CLOSE_MS = 250;

  function initDialogs() {
    document.querySelectorAll("[data-opens]").forEach((trigger) => {
      const dialog = document.getElementById(trigger.dataset.opens);
      if (!dialog || typeof dialog.showModal !== "function") return;

      const close = () => {
        if (!dialog.open || dialog.classList.contains("is-closing")) return;
        dialog.classList.add("is-closing");
        window.setTimeout(() => {
          dialog.classList.remove("is-closing");
          dialog.close();
        }, prefersReducedMotion ? 0 : CLOSE_MS);
      };

      trigger.addEventListener("click", () => {
        dialog.showModal();
        document.documentElement.classList.add("has-sheet");
      });
      dialog.addEventListener("close", () => {
        document.documentElement.classList.remove("has-sheet");
        trigger.focus({ preventScroll: true });
      });
      // Esc: animate out instead of the instant native close.
      dialog.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
      // Click outside the card closes it.
      dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
      dialog.querySelectorAll("[data-closes]").forEach((b) => b.addEventListener("click", close));
    });
  }

  initDialogs();
})();
