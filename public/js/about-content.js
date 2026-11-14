// Manifesto copy for the About page. One entry = one stand around the pitch.
// angle: where the stand sits (0 = far side / top of the sketch, 90 = right).
window.TRIBUNE_MANIFESTO = [
  {
    id: "tribune",
    title: "tribune",
    angle: 0,
    paragraphs: [
      "Where the game begins. Children sketch the vision. We shape it — together.",
      "A place where children speak first — then ideas find form. Football as common ground. Architecture as shared care. A world imagined by children. We’re just listening.",
    ],
  },
  {
    id: "how",
    title: "how it works?",
    angle: 270,
    paragraphs: [
      "Children lead. In workshops and after-school labs, children imagine their own clubs. They choose a name, colours and crest, sketch players, and write short rituals or chants. We listen first. Consent, care and safeguarding sit at the centre.",
      "We co-design. Designers and mentors translate the sketches into models—paper, clay, then digital. Nothing is “corrected”; we follow the child’s intent and check back for approval. Each team receives a small visual toolkit (badge, palette, type, textures).",
      "The stadium grows. Every team’s “house” is placed in a shared virtual stadium. Profiles open on the site; some clubs pair with ambassadors and develop limited kits based on the drawings.",
    ],
  },
  {
    id: "further",
    title: "what further?",
    angle: 90,
    paragraphs: [
      "Once the stadium is full, each team will be paired with an ambassador. Limited-edition kits, based on the kids’ drawings, will be released—one for each team. They’ll be auctioned or collected, with proceeds donated to foundations working with children in vulnerable places, using football as a language of care.",
      "Funds raised support partner foundations using football for social good, and progress is shared in the Journal.",
    ],
  },
  {
    id: "who",
    title: "who am i and why i do it?",
    angle: 180,
    paragraphs: [
      "It started with drawings. Kids sitting on the floor, sketching stadiums with tilted goalposts, rooftops like wings, and flags made of sun. Not copying the world—but rewriting it. I’m an architect. I’m trained to think in structures and plans. But when I sat with these children, I realised: The most important thing I could build wasn’t a stadium. It was a space to be seen.",
      "Tribune is that space. A place where children imagine their own football clubs—each with its own name, colours, rituals, and crest. We don’t refine their ideas. We follow them. Designers and 3D artists turn these sketches into digital homes. Every house is different. Every house belongs.",
      "But this project isn’t about kits or collectors. It’s about what happens when a child’s vision is carried, not corrected. When imagination becomes architecture. That’s the kind of stadium I want to keep building.",
    ],
  },
];

// Plain-text version for the "Read as text" dialog (works without WebGL).
document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".about-text");
  if (!box) return;
  window.TRIBUNE_MANIFESTO.forEach((stand, i) => {
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
});
