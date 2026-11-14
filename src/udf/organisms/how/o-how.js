/* ---------- How it works ---------- */

// Desktop: the section is pinned and the scroll walks through the steps; each next photo
// slides up over the previous one (which drifts up a little). Elsewhere: click to switch.
const HOW_WIPE = 0.7;        // share of each step's scroll spent on the photo wipe
const HOW_RISE = 130;        // % of the card height the next card travels up from (below the screen)
const HOW_BACK = 0.08;       // how much the covered card shrinks
const HOW_BLUR = 6;          // px blur on the covered card
const clamp01 = (v) => Math.min(1, Math.max(0, v));
// Gentle sine ease: the card never moves much faster than the page scrolls.
const easeInOut = (t) => (1 - Math.cos(Math.PI * t)) / 2;

export function initHow() {
  const section = document.getElementById("how");
  if (!section) return;
  const steps = [...section.querySelectorAll(".step")];
  const slides = [...section.querySelectorAll(".how__slide")];
  const bars = [...section.querySelectorAll(".how__bars i")];
  const last = steps.length - 1;
  const pinQuery = matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
  let active = -1;

  const setActive = (index) => {
    if (index === active) return;
    active = index;
    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
      s.querySelector(".step__head").setAttribute("aria-expanded", String(i === index));
    });
  };

  const range = () => section.offsetHeight - innerHeight;
  const progress = () => clamp01(-section.getBoundingClientRect().top / Math.max(1, range()));

  const renderPinned = () => {
    const seg = progress() * last;
    const wipe = slides.map((_, k) => (k === 0 ? 1 : easeInOut(clamp01((seg - (k - 1) - (1 - HOW_WIPE) / 2) / HOW_WIPE))));
    slides.forEach((slide, k) => {
      const own = wipe[k];
      const next = wipe[k + 1] || 0;
      slide.style.transform = `translateY(${(1 - own) * HOW_RISE}%) scale(${1 - next * HOW_BACK})`;
      slide.style.filter = next > 0.001 ? `blur(${next * HOW_BLUR}px)` : "";
      slide.style.setProperty("--dim", (next * 0.35).toFixed(3));
      slide.style.setProperty("--lift", (own > 0 && own < 1 ? 0.12 : 0).toFixed(2));
      slide.style.visibility = own <= 0 ? "hidden" : "";
    });
    bars.forEach((bar, i) => bar.style.setProperty("--fill", i === 0 ? 1 : wipe[i]));
    setActive(wipe.filter((w) => w > 0.5).length - 1);
  };

  const renderStatic = (index) => {
    slides.forEach((slide, k) => {
      ["transform", "filter", "visibility"].forEach((prop) => { slide.style[prop] = ""; });
      slide.style.removeProperty("--dim");
      slide.classList.toggle("is-shown", k <= index);
    });
    bars.forEach((bar, i) => bar.style.setProperty("--fill", i <= index ? 1 : 0));
    setActive(index);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking || !pinQuery.matches) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; renderPinned(); });
  };

  const applyMode = () => {
    section.classList.toggle("how--pinned", pinQuery.matches);
    if (pinQuery.matches) renderPinned();
    else renderStatic(Math.max(0, active));
  };

  steps.forEach((step, i) => {
    step.querySelector(".step__head").addEventListener("click", () => {
      if (!pinQuery.matches) { renderStatic(i); return; }
      const top = section.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (i / last) * range(), behavior: "smooth" });
    });
  });

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  pinQuery.addEventListener("change", applyMode);
  applyMode();
}
