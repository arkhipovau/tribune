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

  function initSteps() {
    const steps = [...document.querySelectorAll(".step")];
    steps.forEach((step) => {
      step.querySelector(".step__head").addEventListener("click", () => {
        steps.forEach((s) => {
          const on = s === step;
          s.classList.toggle("is-active", on);
          s.querySelector(".step__head").setAttribute("aria-expanded", String(on));
        });
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

  /* ---------- Journal ---------- */

  // Paste post links from instagram.com/tribune_kids.space here (newest first).
  // While the list is empty the design placeholders are shown.
  const INSTAGRAM_POSTS = [];
  const INSTAGRAM_EMBED_SRC = "https://www.instagram.com/embed.js";

  function renderEmbed(url) {
    const quote = el("blockquote", "instagram-media");
    quote.setAttribute("data-instgrm-permalink", url);
    quote.setAttribute("data-instgrm-version", "14");
    const link = el("a", "", "View this post on Instagram");
    link.href = url;
    link.rel = "noopener";
    quote.append(link);
    const wrap = el("div", "post-embed");
    wrap.append(quote);
    return wrap;
  }

  function loadInstagramEmbeds(list) {
    const run = () => {
      if (window.instgrm) { window.instgrm.Embeds.process(); return; }
      const s = el("script");
      s.async = true;
      s.src = INSTAGRAM_EMBED_SRC;
      document.body.append(s);
    };
    // Load Instagram's script only when the journal is about to be seen.
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); run(); }
    }, { rootMargin: "600px 0px" });
    io.observe(list);
  }

  const POSTS = Array.from({ length: 4 }, () => ({
    user: "terrylucas",
    image: "assets/img/post.webp",
    likes: "1.069",
    caption: "Imperdiet in sit rhoncus, eleifend tellus augue lectus potenti pellentesque",
    comments: 100,
    time: "1 hour ago",
  }));

  function renderPost(p) {
    const post = el("article", "post");

    const head = el("div", "post__head");
    const avatar = el("span", "post__avatar");
    avatar.append(img(p.image));
    head.append(avatar, el("span", "post__user", p.user), img("assets/svg/ig-more.svg", "post__more"));

    const icons = el("div", "post__icons");
    icons.append(
      img("assets/svg/ig-like.svg", "", "Like"),
      img("assets/svg/ig-comment.svg", "", "Comment"),
      img("assets/svg/ig-share.svg", "", "Share"),
      img("assets/svg/ig-save.svg", "post__save", "Save"),
    );

    const body = el("div", "post__body");
    const caption = el("p", "post__caption");
    caption.append(el("b", "", p.user), el("span", "post__caption-text", p.caption), el("span", "", "...more"));
    body.append(
      el("b", "", `${p.likes} likes`),
      caption,
      el("span", "post__grey", `View all ${p.comments} comments`),
      el("span", "post__time", p.time),
    );

    const add = el("div", "post__add");
    add.append(img("assets/svg/ig-emoji.svg"), el("span", "", "Add a comment..."), el("span", "", "Post"));

    post.append(head, img(p.image, "post__img", "Journal post"), icons, body, add);
    return post;
  }

  function initJournal() {
    const list = document.querySelector(".posts");
    if (!list) return;
    if (INSTAGRAM_POSTS.length > 0) {
      list.classList.add("posts--embeds");
      INSTAGRAM_POSTS.slice(0, 4).forEach((url) => list.append(renderEmbed(url)));
      loadInstagramEmbeds(list);
      return;
    }
    POSTS.forEach((p) => list.append(renderPost(p)));
  }

  initSteps();
  initReveal();
  initJournal();
})();
