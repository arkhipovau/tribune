// Tribune — page interactions (no dependencies).
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const img = (src, className = "", alt = "") => {
    const node = el("img", className);
    node.src = src;
    node.alt = alt;
    return node;
  };

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

  function initSteps() {
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

  /* ---------- In-page links: jump, don't scroll through everything ---------- */
  // A smooth scroll from the menu ran through the pinned stadium and How it works
  // (and could get caught by the stadium's auto-glide). Instead the page fades to
  // white for a moment, jumps, and fades back in. The fixed header stays visible.
  const VEIL_IN_MS = 180;

  function initAnchorJumps() {
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

  /* ---------- Word-by-word scroll reveal ---------- */

  function splitWords(container) {
    const units = [];
    [...container.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(" "); return; }
          const w = el("span", "w", part);
          units.push(w);
          frag.append(w);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
        node.classList.add("w");
        units.push(node);
      }
    });
    return units;
  }

  function initReveal() {
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

  /* ---------- Journal: Instagram-style cards (Figma), real posts ---------- */

  const IG_USER = "tribune_kids.space";
  const IG_AVATAR = "assets/img/journal/avatar.webp";

  const ago = (iso) => {
    if (!iso) return "";
    const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
    if (days < 1) return "today";
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.round(days / 7);
    if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  };

  function renderPost(p) {
    const post = el("a", "post");
    post.href = p.url;
    post.target = "_blank";
    post.rel = "noopener";
    post.setAttribute("aria-label", "Open this post on Instagram");

    const head = el("div", "post__head");
    const avatar = el("span", "post__avatar");
    avatar.append(img(IG_AVATAR));
    const who = el("span", "post__who");
    who.append(el("span", "post__user", IG_USER));
    if (p.location) who.append(el("span", "post__place", p.location));
    head.append(avatar, who, img("assets/svg/ig-more.svg", "post__more"));

    // Media: a small carousel when the post has several images.
    const media = el("div", "post__media");
    const track = el("div", "post__track");
    p.images.forEach((src, i) => track.append(img(src, "post__img", i === 0 ? "Instagram post" : "")));
    media.append(track);
    if (p.images.length > 1) {
      let index = 0;
      const dots = el("div", "post__dots");
      const dotEls = p.images.map(() => dots.appendChild(el("span")));
      const arrow = (dir) => {
        const b = el("button", `post__arrow post__arrow--${dir < 0 ? "prev" : "next"}`);
        b.type = "button";
        b.setAttribute("aria-label", dir < 0 ? "Previous image" : "Next image");
        b.append(img("assets/svg/arrow.svg"));
        b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); go(index + dir); });
        return b;
      };
      const prev = arrow(-1);
      const next = arrow(1);
      const go = (i) => {
        index = Math.max(0, Math.min(p.images.length - 1, i));
        track.style.transform = `translateX(${-100 * index}%)`;
        dotEls.forEach((d, k) => d.classList.toggle("is-on", k === index));
        prev.hidden = index === 0;
        next.hidden = index === p.images.length - 1;
      };
      media.append(prev, next, dots);
      go(0);
    }

    const icons = el("div", "post__icons");
    icons.append(
      img("assets/svg/ig-like.svg", "", "Like"),
      img("assets/svg/ig-comment.svg", "", "Comment"),
      img("assets/svg/ig-share.svg", "", "Share"),
      img("assets/svg/ig-save.svg", "post__save", "Save"),
    );

    const body = el("div", "post__body");
    const caption = el("p", "post__caption");
    caption.append(el("b", "", IG_USER), el("span", "post__caption-text", p.caption), el("span", "post__grey", "more"));
    body.append(el("b", "", `${p.likes} like${p.likes === 1 ? "" : "s"}`), caption);
    if (p.comments > 0) body.append(el("span", "post__grey", `View all ${p.comments} comment${p.comments === 1 ? "" : "s"}`));
    body.append(el("span", "post__time", ago(p.date)));

    post.append(head, media, icons, body);
    return post;
  }

  function initJournal() {
    const list = document.querySelector(".posts");
    const posts = window.TRIBUNE_JOURNAL || [];
    if (!list || posts.length === 0) return;
    posts.slice(0, 4).forEach((p) => list.append(renderPost(p)));
  }

  initSteps();
  initAnchorJumps();
  initReveal();
  initJournal();
})();
