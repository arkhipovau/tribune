import { el } from "../../runtime/dom.js";

/* ---------- In-page links: jump, don't scroll through everything ---------- */
// A smooth scroll from the menu ran through the pinned stadium and How it works
// (and could get caught by the stadium's auto-glide). Instead the page fades to
// white for a moment, jumps, and fades back in. The fixed header stays visible.
const VEIL_IN_MS = 180;

export function initPageVeil() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const veil = el("div", "page-veil");
  veil.setAttribute("aria-hidden", "true");
  document.body.append(veil);

  const targetTop = (hash) => {
    if (hash === "#top") return 0;
    const target = document.getElementById(hash.slice(1));
    return target ? target.getBoundingClientRect().top + scrollY : null;
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute("href");
    if (hash === "#" || hash === "#stadium") return; // the stadium arrow has its own glide
    link.addEventListener("click", (e) => {
      const top = targetTop(hash);
      if (top === null) return;
      e.preventDefault();
      const jump = () => {
        scrollTo({ top: targetTop(hash), behavior: "instant" });
        history.replaceState(null, "", hash);
      };
      if (reduce.matches) { jump(); return; }
      veil.classList.add("is-on");
      setTimeout(() => {
        jump();
        setTimeout(() => veil.classList.remove("is-on"), 30); // a timer, not rAF: never stuck in background tabs
      }, VEIL_IN_MS);
    });
  });
}
