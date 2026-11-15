// Teams page: one bento grid from src/data/teams.js.
// Every tile has the same anatomy: a surface (photo, logo or quote) and a
// caption underneath in the same two-line type. No text sits on the photos.
import { TRIBUNE } from "../../../data/teams.js";
import { initFilter } from "../../molecules/filter/m-filter.js";

export function initRoster() {

  const data = TRIBUNE;
  const grid = document.querySelector(".o-bento");
  if (!data || !grid) return;

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
    node.loading = "lazy";
    return node;
  };

  /** Shared tile: <a|div class="m-tile"> surface + caption(title, note). */
  function tile({ href, wide = false, surfaceClass = "", surface, title, note, extra }) {
    const node = el(href ? "a" : "div", `m-tile${wide ? " m-tile--wide" : ""}`);
    if (href) node.href = href;
    const box = el("div", `m-tile__surface ${surfaceClass}`.trim());
    box.append(...surface);
    const caption = el("div", "m-tile__caption");
    const text = el("span", "m-tile__text");
    text.append(el("span", "", title), el("span", "a-muted", note));
    caption.append(text);
    if (extra) caption.append(extra);
    node.append(box, caption);
    return node;
  }

  const countryOf = (team) => (team.country || "").split(",").pop().trim();
  const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  function teamTile(team) {
    let count = null;
    if (team.drawing) {
      count = el("span", "m-tile__count");
      count.append(img(team.drawing, "Drawings"), `(${team.drawings})`);
    }
    const node = tile({
      href: `team.html?id=${encodeURIComponent(team.id)}`,
      surfaceClass: `m-tile__surface--photo${team.isPlaceholder ? " is-soon" : ""}`,
      surface: [img(team.houseCard || team.house, `${team.name} — team house`)],
      title: team.country ? `${team.name}  •  ${team.country}` : team.name,
      note: team.tagline,
      extra: count,
    });
    Object.assign(node.dataset, { team: team.id, country: slug(countryOf(team)), foundation: team.foundation || "", type: team.type || "" });
    return node;
  }

  function foundationLogo(f) {
    const node = tile({
      surfaceClass: "m-tile__surface--logo",
      surface: [img(f.logo, f.name)],
      title: f.name,
      note: f.role,
    });
    node.dataset.foundationTile = f.id;
    return node;
  }

  function foundationQuote(f) {
    const crests = el("span", "m-tile__crests");
    data.teams
      .filter((t) => t.foundation === f.id && t.crest)
      .forEach((t) => crests.append(img(t.crest, t.name)));
    const node = tile({
      wide: true,
      surfaceClass: `m-tile__surface--quote is-${f.tone}`,
      surface: [el("blockquote", "m-tile__quote", f.quote)],
      title: f.author,
      note: f.role,
      extra: crests.childElementCount ? crests : null,
    });
    node.id = f.id;
    node.dataset.foundationTile = f.id;
    return node;
  }

  function invite() {
    return tile({
      href: "index.html#participate",
      surfaceClass: "m-tile__surface--invite",
      surface: [el("span", "m-tile__quote", "Your team here")],
      title: "Run a lab with us",
      note: "For teams, community centres and NGOs",
    });
  }

  // Foundations sit next to the teams that belong to them; the rest fill the rows.
  const [t0, t1, t2, t3, t4] = data.teams;
  const { ffh, spring } = data.foundations;
  const layout = [
    t0 && teamTile(t0), foundationLogo(ffh), foundationQuote(ffh),
    t1 && teamTile(t1), t2 && teamTile(t2), t3 && teamTile(t3), foundationLogo(spring),
    foundationQuote(spring), t4 && teamTile(t4), invite(),
  ];
  data.teams.slice(5).forEach((t) => layout.push(teamTile(t)));
  grid.append(...layout.filter(Boolean));
  const tiles = [...grid.children];
  tiles.forEach((t, i) => { t.style.viewTransitionName = `tile-${i}`; });

  /* Filter: countries, foundations, girls' teams. */
  const countBy = (list, keyOf, labelOf) => {
    const map = new Map();
    list.forEach((t) => { const k = keyOf(t); if (k) map.set(k, { value: k, label: labelOf(t), count: (map.get(k)?.count || 0) + 1 }); });
    return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  };
  const facets = [
    { key: "country", label: "Countries", tags: countBy(data.teams, (t) => slug(countryOf(t)), countryOf) },
    { key: "foundation", label: "Foundations", tags: countBy(data.teams, (t) => t.foundation, (t) => data.foundations[t.foundation].name) },
    { key: "type", label: "Girls’ teams", tags: countBy(data.teams, (t) => t.type, () => "Girls’ teams") },
  ];
  const filterRoot = document.createElement("div");
  filterRoot.className = "m-filter";
  grid.before(filterRoot);

  let animate = false;
  const apply = ({ key, value }) => {
    const matches = (tileNode) => {
      if (value === null) return true;
      if (tileNode.dataset.team) return tileNode.dataset[key] === value;
      // Foundation tiles stay next to their teams when filtering by that foundation.
      return key === "foundation" && tileNode.dataset.foundationTile === value;
    };
    const update = () => tiles.forEach((t) => { t.hidden = !matches(t); });
    // First paint is instant; later changes reflow with a view transition (if supported and motion is on).
    if (!animate || !document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) { update(); animate = true; return; }
    const transition = document.startViewTransition(update);
    // A transition can be skipped by the browser (e.g. during layout); the DOM update still applies.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  };
  initFilter(filterRoot, { facets, total: data.teams.length, onChange: apply });
}
