// Tag-cloud filter (Fonts In Use style): a facet switch, then large tags with superscript counts.
// Usage: initFilter(root, { facets, onChange }) — facets: [{ key, label, tags: [{ value, label, count }] }].
// The selection lives in the URL (?country=kenya) so a filtered view can be shared.

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

export function initFilter(root, { facets, total, onChange }) {
  const params = new URLSearchParams(location.search);
  const fromUrl = facets.find((f) => params.has(f.key));
  let facet = fromUrl || facets[0];
  let value = fromUrl ? params.get(fromUrl.key) : null;

  const switcher = el("div", "a-pill m-filter__facets");
  switcher.setAttribute("role", "tablist");
  switcher.setAttribute("aria-label", "Filter teams by");
  const tags = el("div", "m-filter__tags");
  root.append(switcher, tags);

  const facetButtons = facets.map((f) => {
    const b = el("button", "a-pill__item m-filter__facet", f.label);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => { if (f !== facet) { facet = f; value = null; render(true); } });
    switcher.append(b);
    return b;
  });

  const tagButton = (label, count, tagValue) => {
    const b = el("button", "m-filter__tag");
    b.type = "button";
    b.append(label);
    const sup = el("sup", "m-filter__count", String(count));
    b.append(sup);
    b.setAttribute("aria-pressed", String(value === tagValue));
    b.classList.toggle("is-active", value === tagValue);
    b.addEventListener("click", () => { value = value === tagValue ? null : tagValue; render(true); });
    return b;
  };

  function render(notify) {
    facetButtons.forEach((b, i) => b.setAttribute("aria-selected", String(facets[i] === facet)));
    tags.replaceChildren(tagButton("All teams", total, null), ...facet.tags.map((t) => tagButton(t.label, t.count, t.value)));
    tags.classList.toggle("is-filtered", value !== null);
    const url = new URL(location.href);
    facets.forEach((f) => url.searchParams.delete(f.key));
    if (value !== null) url.searchParams.set(facet.key, value);
    history.replaceState(null, "", url);
    if (notify) onChange({ key: facet.key, value });
  }

  render(false);
  onChange({ key: facet.key, value });
}
