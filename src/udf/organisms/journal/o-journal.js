import { el, img } from "../../runtime/dom.js";
import { JOURNAL } from "../../../data/journal.js";

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

export function renderPost(p) {
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

export function initJournal() {
  const list = document.querySelector(".posts");
  const posts = JOURNAL;
  if (!list || posts.length === 0) return;
  posts.slice(0, 4).forEach((p) => list.append(renderPost(p)));
}
