// Team page: fills the panel from window.TRIBUNE using ?id=<team-id>.
(() => {
  "use strict";

  const data = window.TRIBUNE;
  if (!data) return;

  const params = new URLSearchParams(window.location.search);
  const team = data.findTeam(params.get("id")) || data.teams[0];
  const foundation = team.foundation ? data.foundations[team.foundation] : null;
  const designer = team.designer ? data.designers[team.designer] : null;

  const $ = (s) => document.querySelector(s);
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

  document.title = `${team.name} — Tribune`;
  $(".team__stage").style.backgroundImage = `url("${team.house}")`;
  $(".tp-hero__title").textContent = team.name;
  if (team.isPlaceholder) $(".team").classList.add("team--soon");

  /* Club switcher: ← current → plus a searchable list, so it scales to any number of clubs. */
  const switcher = $(".team-switch");
  const index = data.teams.findIndex((t) => t.id === team.id);
  const total = data.teams.length;
  const hrefOf = (t) => `team.html?id=${encodeURIComponent(t.id)}`;
  const neighbour = (step) => data.teams[(index + step + total) % total];

  const arrow = (step, label) => {
    const a = el("a", `team-switch__arrow${step < 0 ? " is-prev" : ""}`);
    a.href = hrefOf(neighbour(step));
    a.setAttribute("aria-label", label);
    a.append(img("assets/svg/arrow.svg", ""));
    return a;
  };

  const current = el("button", "team-switch__current");
  current.type = "button";
  current.setAttribute("aria-haspopup", "listbox");
  current.setAttribute("aria-expanded", "false");
  current.append(
    el("span", "team-switch__name", team.name),
    el("span", "team-switch__count", `${index + 1} / ${total}`),
  );

  const menu = el("div", "team-switch__menu");
  menu.hidden = true;
  const search = el("input", "team-switch__search");
  search.type = "search";
  search.placeholder = "Find a club";
  search.setAttribute("aria-label", "Find a club");
  const list = el("ul", "team-switch__list");
  list.setAttribute("role", "listbox");
  const rows = data.teams.map((t) => {
    const li = el("li");
    const a = el("a");
    a.href = hrefOf(t);
    a.setAttribute("role", "option");
    if (t.id === team.id) a.setAttribute("aria-selected", "true");
    const label = el("span", "team-switch__label");
    label.append(el("span", "", t.name), el("span", "muted", t.country || t.tagline));
    a.append(label);
    li.append(a);
    li.dataset.search = `${t.name} ${t.country || ""}`.toLowerCase();
    list.append(li);
    return li;
  });
  const empty = el("p", "team-switch__empty", "No clubs found");
  empty.hidden = true;
  menu.append(search, list, empty);

  const setOpen = (open) => {
    menu.hidden = !open;
    current.setAttribute("aria-expanded", String(open));
    if (open) { search.value = ""; filter(); search.focus(); }
  };
  const filter = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach((li) => { const ok = !q || li.dataset.search.includes(q); li.hidden = !ok; shown += ok; });
    empty.hidden = shown > 0;
  };
  current.addEventListener("click", () => setOpen(menu.hidden));
  search.addEventListener("input", filter);
  document.addEventListener("click", (e) => { if (!switcher.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { setOpen(false); current.focus(); }
    const typing = e.target instanceof HTMLInputElement;
    if (!typing && menu.hidden && total > 1) {
      if (e.key === "ArrowLeft") window.location.href = hrefOf(neighbour(-1));
      if (e.key === "ArrowRight") window.location.href = hrefOf(neighbour(1));
    }
  });

  switcher.append(arrow(-1, "Previous club"), current, arrow(1, "Next club"), menu);
  if (total < 2) switcher.querySelectorAll(".team-switch__arrow").forEach((a) => a.remove());

  /* Gallery: mascot / crest / drawings, switched by the ticks. */
  const gallery = $(".tp-hero__gallery");
  const ticks = $(".tp-hero__ticks");
  const shots = team.gallery.length > 0 ? team.gallery : [team.house];
  const frames = shots.map((src, i) => gallery.appendChild(img(src, `${team.name} — image ${i + 1}`)));
  const tickButtons = shots.map((_, i) => {
    const b = el("button", "tick");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Image ${i + 1}`);
    b.addEventListener("click", () => show(i));
    return ticks.appendChild(b);
  });
  function show(index) {
    frames.forEach((f, i) => f.classList.toggle("is-active", i === index));
    tickButtons.forEach((b, i) => {
      b.classList.toggle("is-active", i === index);
      b.setAttribute("aria-selected", String(i === index));
    });
  }
  show(0);
  ticks.hidden = shots.length < 2;

  /* About row */
  $(".tp-about__tagline").textContent = team.tagline;
  if (team.crest) $(".tp-about__crest").append(img(team.crest, `${team.name} crest`));

  /* Credits row: foundation, country, designer */
  const credits = $(".tp-credits__text");
  const line = (...parts) => {
    const row = el("span");
    parts.filter(Boolean).forEach((p, i) => {
      if (i > 0) row.append(el("span", "sep", "•"));
      row.append(p);
    });
    return row;
  };
  credits.append(line("Foundation", foundation && foundation.name, team.country));
  if (designer) credits.append(line("Designer", designer.name));

  const tiles = $(".tp-credits__tiles");
  if (foundation) {
    const t = el("span", "glass");
    t.append(img(foundation.logo, foundation.name));
    tiles.append(t);
  }
  if (designer) {
    const t = el("span", "glass");
    t.append(img(designer.logoDark, designer.name, "tp-do"));
    tiles.append(t);
  }

  /* Patron button carries the team's drawing */
  const drawing = $(".tp-patron__drawing");
  if (team.drawing) drawing.src = team.drawing;
  else drawing.remove();
})();
