// Partner marquee: repeats the logo set until the track is at least twice the
// viewport, so the loop never shows an empty tail on wide screens.
(() => {
  "use strict";

  const SPEED = 50; // px per second

  document.querySelectorAll(".marquee").forEach((marquee) => {
    const track = marquee.querySelector(".marquee__track");
    if (!track) return;
    const set = [...track.children].slice(0, 2).map((n) => n.cloneNode(true));

    const build = () => {
      track.replaceChildren();
      // One half of the loop must be wider than the viewport.
      const half = document.createDocumentFragment();
      const items = [];
      while (items.length < 4 || items.length * 200 < window.innerWidth + 400) {
        set.forEach((n) => items.push(n.cloneNode(true)));
      }
      items.forEach((n) => half.append(n));
      track.append(half);
      const copy = [...track.children].map((n) => {
        const c = n.cloneNode(true);
        c.alt = "";
        c.setAttribute("aria-hidden", "true");
        return c;
      });
      track.append(...copy);
      const halfWidth = track.scrollWidth / 2;
      track.style.setProperty("--marquee-duration", `${(halfWidth / SPEED).toFixed(1)}s`);
    };

    build();
    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 200); });
  });
})();
