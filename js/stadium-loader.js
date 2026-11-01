// Loads the interactive stadium (Babylon.js) only when its section is about to
// be seen, or right away when the hero arrow is used.
(() => {
  "use strict";

  const section = document.getElementById("stadium");
  if (!section) return;
  const mount = section.querySelector(".stadium__mount");
  const fallback = section.querySelector(".stadium__fallback");
  const base = new URL("assets/stadium/", document.baseURI);
  const teams = window.TRIBUNE;

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
      const { mountStadium } = await import(new URL("js/stadium.js", base).href);
      mountStadium(mount, {
        modelsUrl: new URL("models/", base).href,
        envUrl: new URL("env/environmentSpecular.env", base).href,
        meshoptDecoderUrl: new URL("meshopt_decoder.js", base).href,
        // Only clubs that already have a page get the "open club page" link.
        teamHref: (id) => (teams && teams.teams.some((t) => t.id === id) ? `team.html?id=${encodeURIComponent(id)}` : null),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        panels: false, // the card shows the model only
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

  const frame = section.querySelector(".stadium");
  const CARD = { left: 37, right: 39, radius: 30, ratio: 791 / 1364, zoom: 1.12 };
  // The closed card sits centred in the sticky frame. The frame locks the moment the card
  // reaches the centre of the screen; only then the window opens, holds, and closes again.
  const OPEN_SPAN = 0.9;  // scroll (in viewport heights) spent opening, and again closing
  // On approach the card starts a little lower and rides up into place as you scroll.
  const RISE = 0.3;        // start this many viewport heights lower…
  const RISE_SCALE = 0.06; // …and this much smaller, then ride up and grow into place
  const zoomEnabled = () =>
    !window.matchMedia("(max-width: 900px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Sine ease: soft start and finish without a fast middle.
  const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  function updateWindow() {
    if (!zoomEnabled()) {
      ["--clip-t", "--clip-r", "--clip-b", "--clip-l", "--clip-rad", "--zoom", "--zoom-y"].forEach((v) => frame.style.removeProperty(v));
      ["--rise", "--rise-scale"].forEach((v) => section.style.removeProperty(v));
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
    frame.style.setProperty("--clip-t", `${(offset * closed).toFixed(2)}px`);
    frame.style.setProperty("--clip-l", `${(CARD.left * closed).toFixed(2)}px`);
    frame.style.setProperty("--clip-r", `${(CARD.right * closed).toFixed(2)}px`);
    frame.style.setProperty("--clip-b", `${(offset * closed).toFixed(2)}px`);
    frame.style.setProperty("--clip-rad", `${(CARD.radius * closed).toFixed(2)}px`);
    // A touch of scale inside the window sells the "flying into it" feeling.
    frame.style.setProperty("--zoom", (1 + (CARD.zoom - 1) * closed).toFixed(4));
    frame.style.setProperty("--zoom-y", "50%");
    // Set on the section: the frame moves with it and the hero photo underneath follows.
    const approach = ease(clamp01(rect.top / vh)); // 1 → a screen away, 0 → card centred
    section.style.setProperty("--rise", `${(RISE * vh * approach).toFixed(2)}px`);
    section.style.setProperty("--rise-scale", (1 - RISE_SCALE * approach).toFixed(4));
  }
  /* Auto-complete the opening: once the window starts to open while scrolling down,
     glide the rest of the way to the fully open, locked screen. Once per entry;
     scrolling up is never hijacked. Trackpad inertia is held off only for the
     short glide itself (it would otherwise cancel a native smooth scroll). */
  const GLIDE_MS = 1000;
  const ARROW_GLIDE_MS = 1600;
  let lastY = window.scrollY;
  let snapArmed = true;
  let gliding = false;
  const holdInput = (e) => { if (gliding) e.preventDefault(); };
  window.addEventListener("wheel", holdInput, { passive: false });
  window.addEventListener("touchmove", holdInput, { passive: false });

  function glideTo(target, duration = GLIDE_MS) {
    const from = window.scrollY;
    const t0 = performance.now();
    gliding = true;
    const step = () => {
      const k = clamp01((performance.now() - t0) / duration);
      window.scrollTo({ top: from + (target - from) * ease(k), behavior: "instant" });
      if (k < 1) requestAnimationFrame(step);
      else { gliding = false; lastY = window.scrollY; }
    };
    requestAnimationFrame(step);
  }

  function maybeSnap() {
    const y = window.scrollY;
    const goingDown = y > lastY;
    lastY = y;
    if (gliding || !zoomEnabled()) return;
    const rect = section.getBoundingClientRect();
    const span = window.innerHeight * OPEN_SPAN;
    if (rect.top > 0) { snapArmed = true; return; } // back above the second screen: re-arm
    if (!snapArmed || !goingDown) return;
    if (rect.top < -2 && rect.top > -span + 2) {
      snapArmed = false;
      glideTo(y - rect.top + span);
    }
  }

  // Updated straight from the scroll event: it only writes a few CSS variables,
  // and rAF-throttling can leave the window half-open in background tabs.
  window.addEventListener("scroll", () => { updateWindow(); maybeSnap(); }, { passive: true });
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
    // Desktop: land just after the window locks full-screen.
    const target = zoomEnabled() ? top + window.innerHeight * (OPEN_SPAN + 0.1) : top - HEADER_OFFSET;
    // One scripted glide all the way; the auto-snap stays out of it (two competing
    // smooth scrolls caused the back-and-forth zoom).
    if (zoomEnabled()) {
      snapArmed = false;
      glideTo(target, ARROW_GLIDE_MS);
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
    history.replaceState(null, "", "#stadium");
  }));
})();
