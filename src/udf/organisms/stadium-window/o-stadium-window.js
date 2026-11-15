// Loads the interactive stadium (Babylon.js) only when its section is about to
// be seen, or right away when the hero arrow is used.
import { TRIBUNE } from "../../../data/teams.js";

// Looks of the overview (colours in linear RGB). "base" is the live look; the others are
// variants to compare, picked with ?look=1 / ?look=2 / ?look=3 in the address bar.
const LOOKS = {
  // Light studio, matte graphite stadium with a cool sheen.
  base: {
    stageIsDark: false,
    tint: [0.034, 0.036, 0.041],
    shading: [0.35, 2.2], // wider light/shadow range, so the dark stadium reads as a solid object
    facets: [0.28, 1.45], // sides darker, tops lighter
    sheen: { color: [0.07, 0.085, 0.115], range: [0.45, 1.9], direction: [-1, -1], radius: 170 },
    shadow: { opacity: 0.38, offset: [10, 14] },
  },
};
// 1: same as base, deeper contact shadow.
LOOKS["1"] = { ...LOOKS.base, shadow: { opacity: 0.5, offset: [16, 10], blur: 0.26, size: 1.03 } };
// 2: deeper shadow, stadium in clean neutral clay greys (no blue), so the houses stand out under the spotlight.
LOOKS["2"] = {
  ...LOOKS["1"],
  tint: [0.52, 0.52, 0.52],
  shading: [0.7, 1.35],
  facets: [0.72, 1.1],
  sheen: { color: [0.02, 0.02, 0.02], range: [0.86, 1.1], direction: [-1, -1], radius: 170 },
  shadow: { opacity: 0.42, offset: [16, 10], blur: 0.26, size: 1.03 },
};
// 3: dark navy space lit from above, a deep-blue solid stadium and a dense shadow; the spotlit house glows.
LOOKS["3"] = {
  stageIsDark: true,
  tint: [0.007, 0.012, 0.03],
  shading: [0.4, 1.9],
  facets: [0.3, 1.5],
  sheen: { color: [0.012, 0.03, 0.075], range: [0.5, 1.7], direction: [-1, -1], radius: 170 },
  shadow: { opacity: 0.75, offset: [16, 10], blur: 0.26, size: 1.03, color: [0.05, 0.1, 0.22] }, // navy-black
};
const LOOK_ID = new URLSearchParams(window.location.search).get("look");
const LOOK = LOOKS[LOOK_ID] ?? LOOKS.base;
const STAGE_IS_DARK = LOOK.stageIsDark;

export function initStadiumWindow() {

  const section = document.getElementById("stadium");
  if (!section) return;
  if (LOOKS[LOOK_ID]) section.dataset.look = LOOK_ID; // css: stage background per look
  const mount = section.querySelector(".o-stadium__mount");
  const fallback = section.querySelector(".o-stadium__fallback");
  const base = new URL("assets/stadium/", document.baseURI);
  const teams = TRIBUNE;

  const hasWebGL = () => {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (error) {
      return false;
    }
  };

  let started = false;
  async function start() {
    if (started) return;
    started = true;
    observer.disconnect();
    if (!hasWebGL()) { fallback.hidden = false; return; }
    try {
      const { mountStadium } = await import(new URL(`js/stadium.js?v=${__STADIUM_VERSION__}`, base).href); // version busts stale caches
      mountStadium(mount, {
        modelsUrl: new URL("models/", base).href,
        liteModelsUrl: new URL("models-lite/", base).href, // small textures first; full ones on opening a house
        envUrl: new URL("env/environmentSpecular.env", base).href,
        meshoptDecoderUrl: new URL("meshopt_decoder.js", base).href,
        // Only clubs that already have a page get the "open club page" link.
        teamHref: (id) => (teams && teams.teams.some((t) => t.id === id) ? `team.html?id=${encodeURIComponent(id)}` : null),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        panels: false, // the card shows the model only
        overviewTint: LOOK.tint,
        overviewShading: LOOK.shading,
        overviewFacets: LOOK.facets,
        overviewSheen: LOOK.sheen,
        overviewZoomOut: 1.12, // a bit smaller in the open window, with room around it
        groundShadow: LOOK.shadow, // soft contact shadow on the studio floor
        hardwareScaling: 1 / Math.min(window.devicePixelRatio || 1, 2), // crisp on Retina
      });
    } catch (error) {
      console.error("Stadium failed to load", error);
      fallback.textContent = "The stadium could not be loaded. Please refresh the page.";
      fallback.hidden = false;
    }
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) start();
  }, { rootMargin: "800px 0px" });
  observer.observe(section);

  /* ---------- Window zoom: card → full screen → card while scrolling through ---------- */

  const frame = section.querySelector(".o-stadium");
  const CARD = { left: 37, right: 39, radius: 30, ratio: 791 / 1364, zoom: 1.12 };
  // The closed card sits centred in the sticky frame. The frame locks the moment the card
  // reaches the centre of the screen; only then the window opens, holds, and closes again.
  // CSS scale of the scene when the window is fully open. Keep 1: scaling the canvas down crops the
  // stadium at the canvas edges. The stadium is made smaller by the camera instead (overviewZoomOut).
  const OPEN_ZOOM = 1;
  const OPEN_SPAN = 0.9;  // scroll (in viewport heights) spent opening, and again closing
  // On approach the card starts a little lower and rides up into place as you scroll.
  const RISE = 0.4;        // start this many viewport heights lower…
  const RISE_SCALE = 0.06; // …and this much narrower (window only), then ride up and widen into place
  const zoomEnabled = () =>
    !window.matchMedia("(max-width: 900px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Sine ease: soft start and finish without a fast middle.
  const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  function updateWindow() {
    if (!zoomEnabled()) {
      ["--clip-t", "--clip-r", "--clip-b", "--clip-l", "--clip-rad", "--zoom", "--zoom-y"].forEach((v) => frame.style.removeProperty(v));
      ["--rise"].forEach((v) => section.style.removeProperty(v));
      return;
    }
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const span = vh * OPEN_SPAN;
    const opening = ease(clamp01(-rect.top / span));
    const closing = ease(clamp01((vh + span - rect.bottom) / span));
    const open = Math.min(opening, 1 - closing);
    const closed = 1 - open;

    const cardH = (vw - CARD.left - CARD.right) * CARD.ratio;
    const offset = Math.max(0, (vh - cardH) / 2);
    // Approach (before the card reaches the centre): the window starts lower and narrower,
    // then rides up and widens into place. Only the window shrinks, never the stadium inside.
    const approach = ease(clamp01(rect.top / vh)); // 1 → a screen away, 0 → card centred
    const shrinkX = (vw - CARD.left - CARD.right) * RISE_SCALE * approach / 2;
    const shrinkY = cardH * RISE_SCALE * approach / 2;
    section.style.setProperty("--rise", `${(RISE * vh * approach).toFixed(2)}px`);
    frame.style.setProperty("--clip-t", `${(offset * closed + shrinkY).toFixed(2)}px`);
    frame.style.setProperty("--clip-l", `${(CARD.left * closed + shrinkX).toFixed(2)}px`);
    frame.style.setProperty("--clip-r", `${(CARD.right * closed + shrinkX).toFixed(2)}px`);
    frame.style.setProperty("--clip-b", `${(offset * closed + shrinkY).toFixed(2)}px`);
    // The header sits over the dark stage while the window is open: switch it to its light variant
    // only while the dark stage is actually behind it.
    const HEADER_BOTTOM = 64; // px; the fixed header's lower edge
    const stageTop = offset * closed + shrinkY; // visible top edge of the window inside the sticky frame
    const stageUnderHeader = rect.top <= 1 && rect.bottom >= HEADER_BOTTOM && stageTop < HEADER_BOTTOM / 2;
    // The stage is light now, so the header keeps its normal (dark) look. Flip STAGE_IS_DARK if the stage goes dark again.
    document.documentElement.classList.toggle("is-stage-dark", STAGE_IS_DARK && stageUnderHeader);
    frame.style.setProperty("--clip-rad", `${(CARD.radius * closed).toFixed(2)}px`);
    // A touch of scale inside the window sells the "flying into it" feeling.
    frame.style.setProperty("--zoom", (OPEN_ZOOM + (CARD.zoom - OPEN_ZOOM) * closed).toFixed(4));
    frame.style.setProperty("--zoom-y", "50%");
  }
  /* Settling into the open stadium is left to the browser: a native scroll-snap point
     (css: .stadium-scroll__snap, proximity) sits where the window is fully open.
     A scripted auto-glide fought trackpad inertia and felt jerky. The only scripted
     scroll left is the hero arrow; snapping is switched off while it runs. */
  const ARROW_GLIDE_MS = 1600;
  const root = document.documentElement;

  function glideTo(target, duration = ARROW_GLIDE_MS) {
    const from = window.scrollY;
    const t0 = performance.now();
    root.classList.add("is-gliding");
    const step = () => {
      const k = clamp01((performance.now() - t0) / duration);
      window.scrollTo({ top: from + (target - from) * ease(k), behavior: "instant" });
      if (k < 1) requestAnimationFrame(step);
      else root.classList.remove("is-gliding");
    };
    requestAnimationFrame(step);
  }

  // Updated straight from the scroll event: it only writes a few CSS variables,
  // and rAF-throttling can leave the window half-open in background tabs.
  window.addEventListener("scroll", updateWindow, { passive: true });
  window.addEventListener("resize", updateWindow);
  updateWindow();

  /* ---------- Hero arrow: jump to the open, locked window ---------- */

  const HEADER_OFFSET = 84; // mobile: the card sits under the fixed header
  const layoutTop = (el) => {
    let y = 0;
    for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
    return y;
  };
  document.querySelectorAll('a[href="#stadium"]').forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    start();
    const top = layoutTop(section);
    // Desktop: land exactly where the window is fully open (the snap point).
    const target = zoomEnabled() ? top + window.innerHeight * OPEN_SPAN : top - HEADER_OFFSET;
    if (zoomEnabled()) glideTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
    history.replaceState(null, "", "#stadium");
  }));
}
