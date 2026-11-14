import { el, prefersReducedMotion as reducedMotion } from "../../runtime/dom.js";

const prefersReducedMotion = reducedMotion();

/* ---------- Word-by-word scroll reveal ---------- */

function splitWords(container) {
  const units = [];
  [...container.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(" "); return; }
        const w = el("span", "m-reveal-word", part);
        units.push(w);
        frag.append(w);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
      node.classList.add("m-reveal-word");
      units.push(node);
    }
  });
  return units;
}

export function initRevealText() {
  const blocks = [...document.querySelectorAll("[data-reveal]")].map((node) => ({ node, words: splitWords(node) }));
  if (blocks.length === 0) return;

  if (prefersReducedMotion) {
    blocks.forEach((b) => b.words.forEach((w) => w.classList.add("is-on")));
    return;
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    blocks.forEach(({ node, words }) => {
      const r = node.getBoundingClientRect();
      const start = vh * 0.85;
      const span = r.height + vh * 0.3;
      const progress = Math.min(1, Math.max(0, (start - r.top) / span));
      // First word is always lit, as in the design.
      const lit = Math.max(1, Math.round(progress * words.length));
      words.forEach((w, i) => w.classList.toggle("is-on", i < lit));
    });
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}
