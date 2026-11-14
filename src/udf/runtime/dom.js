// Small DOM helpers shared by components.
export const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

export const img = (src, className = "", alt = "") => {
  const node = el("img", className);
  node.src = src;
  node.alt = alt;
  return node;
};

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
