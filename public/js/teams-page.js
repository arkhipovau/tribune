// Teams page: one bento grid from window.TRIBUNE data.
// Every tile has the same anatomy: a surface (photo, logo or quote) and a
// caption underneath in the same two-line type. No text sits on the photos.
(() => {
  "use strict";

  const data = window.TRIBUNE;
  const grid = document.querySelector(".bento");
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

  /** Shared tile: <a|div class="tile"> surface + caption(title, note). */
  function tile({ href, wide = false, surfaceClass = "", surface, title, note, extra }) {
    const node = el(href ? "a" : "div", `tile${wide ? " tile--wide" : ""}`);
    if (href) node.href = href;
    const box = el("div", `tile__surface ${surfaceClass}`.trim());
    box.append(...surface);
    const caption = el("div", "tile__caption");
    const text = el("span", "tile__text");
    text.append(el("span", "", title), el("span", "muted", note));
    caption.append(text);
    if (extra) caption.append(extra);
    node.append(box, caption);
    return node;
  }

  function teamTile(team) {
    let count = null;
    if (team.drawing) {
      count = el("span", "tile__count");
      count.append(img(team.drawing, "Drawings"), `(${team.drawings})`);
    }
    return tile({
      href: `team.html?id=${encodeURIComponent(team.id)}`,
      surfaceClass: `tile__surface--photo${team.isPlaceholder ? " is-soon" : ""}`,
      surface: [img(team.house, `${team.name} — team house`)],
      title: team.country ? `${team.name}  •  ${team.country}` : team.name,
      note: team.tagline,
      extra: count,
    });
  }

  function foundationLogo(f) {
    return tile({
      surfaceClass: "tile__surface--logo",
      surface: [img(f.logo, f.name)],
      title: f.name,
      note: f.role,
    });
  }

  function foundationQuote(f) {
    const crests = el("span", "tile__crests");
    data.teams
      .filter((t) => t.foundation === f.id && t.crest)
      .forEach((t) => crests.append(img(t.crest, t.name)));
    const node = tile({
      wide: true,
      surfaceClass: `tile__surface--quote is-${f.tone}`,
      surface: [el("blockquote", "tile__quote", f.quote)],
      title: f.author,
      note: f.role,
      extra: crests.childElementCount ? crests : null,
    });
    node.id = f.id;
    return node;
  }

  function invite() {
    return tile({
      href: "index.html#participate",
      surfaceClass: "tile__surface--invite",
      surface: [el("span", "tile__quote", "Your team here")],
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
})();
