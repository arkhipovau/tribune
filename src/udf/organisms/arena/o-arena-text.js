import { MANIFESTO } from "../../../data/manifesto.js";

// Plain-text version for the "Read as text" dialog (works without WebGL).
export function initArenaText() {
  const box = document.querySelector(".about-text");
  if (!box) return;
  MANIFESTO.forEach((stand, i) => {
    // The dialog headline already says "tribune", so the first section goes without its own title.
    if (i > 0) {
      const h = document.createElement("h3");
      h.id = `text-${stand.id}`;
      h.textContent = stand.title;
      box.append(h);
    }
    stand.paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      box.append(p);
    });
  });
}
