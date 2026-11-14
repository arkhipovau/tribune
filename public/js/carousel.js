// Home "Already in the game" carousel.
// Every team is a real card on one track. Side cards are the same card scaled
// down (508 → 265px, as in the Figma frame) with only the photo blurred, so the
// rounded edges stay crisp. Changing team slides and scales the cards together.
(() => {
  "use strict";

  const TEAMS = (window.TRIBUNE && window.TRIBUNE.teams) || [];
  const root = document.querySelector(".teams");
  if (!root || TEAMS.length === 0) return;

  const SIDE_SCALE = 265 / 508;
  const SIDE_TOP = 122; // side cards sit lower: 294 - 172 in the frame
  const POSITIONS = { 1: 426.5, 2: 731.5 }; // centre-to-centre distances

  const track = root.querySelector(".teams__track");
  const ticks = root.querySelector(".teams__ticks");
  const arrows = root.querySelectorAll(".teams__arrows .round-btn");
  const { foundations, designers } = window.TRIBUNE;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const img = (src, alt = "", className = "") => {
    const node = el("img", className);
    node.src = src;
    node.alt = alt;
    return node;
  };
  const glass = (src, alt, className) => {
    const g = el("span", "glass");
    g.append(img(src, alt, className));
    return g;
  };

  function buildSlide(team) {
    const slide = el("article", "slide");
    const href = `team.html?id=${encodeURIComponent(team.id)}`;

    const media = el("a", "team-card__media");
    media.href = href;
    media.append(img(team.house, `${team.name} — team house`, "team-card__photo"));
    if (team.crest) media.append(Object.assign(glass(team.crest, `${team.name} crest`), { className: "glass team-card__crest" }));
    if (team.foundation) {
      const partners = el("span", "team-card__partners");
      partners.append(glass(foundations[team.foundation].logo, foundations[team.foundation].name));
      if (team.designer) partners.append(glass(designers[team.designer].logo, designers[team.designer].name, "team-card__do"));
      media.append(partners);
    }

    const bar = el("a", "team-card__bar");
    bar.href = href;
    const text = el("span", "team-card__text");
    text.append(
      el("span", "team-card__name", team.country ? `${team.name}  •  ${team.country}` : team.name),
      el("span", "team-card__tagline", team.tagline),
    );
    bar.append(text);
    if (team.drawing) {
      const count = el("span", "team-card__count");
      count.append(img(team.drawing, "", "team-card__drawing"), el("span", "", `(${team.drawings})`));
      bar.append(count);
    }
    slide.append(media, bar);
    return slide;
  }

  /* Infinite strip: cards live at virtual positions (…, -1, 0, 1, …).
     Team = position mod n. Cards past ±2 sit off-screen; a card leaving the
     view keeps sliding out and is removed, a new copy slides in from the
     other edge — nothing ever jumps across the stage. */
  const n = TEAMS.length;
  const mod = (v) => ((v % n) + n) % n;
  const RANGE = 3; // ±2 visible, ±3 parked just outside the viewport
  const LEAVE_MS = 1000;
  let pos = 0;
  const nodes = new Map(); // virtual position -> element

  const offstage = () => Math.max(1040, window.innerWidth / 2 + 300);

  function transformFor(o) {
    const abs = Math.abs(o);
    if (abs === 0) return "translate3d(0, 0, 0) scale(1)";
    const x = Math.sign(o) * (abs <= 2 ? POSITIONS[abs] : offstage());
    return `translate3d(${x}px, ${SIDE_TOP}px, 0) scale(${SIDE_SCALE})`;
  }

  function nodeAt(v, enterFrom) {
    if (nodes.has(v)) return nodes.get(v);
    const slide = buildSlide(TEAMS[mod(v)]);
    slide.classList.add("no-anim");
    slide.style.transform = transformFor(enterFrom);
    slide.addEventListener("click", (e) => {
      if (!slide.classList.contains("is-center")) { e.preventDefault(); go(slide._v); }
    });
    slide._v = v;
    track.append(slide);
    nodes.set(v, slide);
    return slide;
  }

  function render(direction = 0) {
    // Create what is needed; new cards start parked beyond the edge they come from.
    for (let v = pos - RANGE; v <= pos + RANGE; v += 1) {
      const o = v - pos;
      nodeAt(v, direction === 0 ? o : Math.sign(o || direction) * RANGE);
    }
    // Commit the parked start positions, then animate everything in the same tick
    // (no rAF: background tabs may never deliver the frame).
    void track.offsetWidth;
    {
      nodes.forEach((slide, v) => {
        slide.classList.remove("no-anim");
        const o = v - pos;
        if (Math.abs(o) > RANGE) {
          // Keep sliding out, then drop it.
          slide.style.transform = transformFor(Math.sign(o) * RANGE);
          slide.classList.remove("is-center");
          slide.toggleAttribute("inert", true);
          nodes.delete(v);
          window.setTimeout(() => slide.remove(), LEAVE_MS);
          return;
        }
        slide.style.transform = transformFor(o);
        slide.style.zIndex = String(10 - Math.abs(o));
        slide.classList.toggle("is-center", o === 0);
        slide.toggleAttribute("inert", o !== 0);
      });
    }

    tickButtons.forEach((b, i) => {
      b.classList.toggle("is-active", i === mod(pos));
      b.setAttribute("aria-selected", String(i === mod(pos)));
    });
  }

  const tickButtons = TEAMS.map((team, i) => {
    const b = el("button", "tick");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", team.name);
    b.addEventListener("click", () => {
      // Shortest way round to that team.
      let d = (i - mod(pos)) % n;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      go(pos + d);
    });
    ticks.append(b);
    return b;
  });

  function go(target) {
    if (target === pos) return;
    const direction = Math.sign(target - pos);
    pos = target;
    render(direction);
  }

  arrows.forEach((a) => {
    a.disabled = n < 2;
    a.addEventListener("click", () => go(pos + Number(a.dataset.dir)));
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(pos + 1);
    if (e.key === "ArrowLeft") go(pos - 1);
  });

  let touchX = null;
  track.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(pos + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  render();
})();
