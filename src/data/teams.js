// Single source of truth for teams and partner foundations.
// Used by the home carousel, teams.html and team.html.
// Fields marked "TODO" are placeholders until the real copy arrives.

const FOUNDATIONS = {
  ffh: {
    id: "ffh",
    name: "Football for Humanity",
    logo: "assets/img/logo-ffh.avif",
    // TODO: replace with a real quote from the foundation.
    quote: "A few words from Football for Humanity about the kids, the labs and the teams will live here.",
    author: "Football for Humanity",
    role: "Foundation partner",
    tone: "green",
  },
  spring: {
    id: "spring",
    name: "The Spring Ubud",
    logo: "assets/img/logo-spring.avif",
    // TODO: replace with a real quote from the foundation.
    quote: "A few words from The Spring Ubud about drawing sessions with the children will live here.",
    author: "The Spring Ubud",
    role: "Foundation partner",
    tone: "sky",
  },
};

const DESIGNERS = {
  do: { name: "Do buro", logo: "assets/svg/do-logo.svg", logoDark: "assets/svg/do-logo-dark.svg" },
};

const TEAMS = [
  {
    id: "carabell",
    name: "Carabell Club",
    country: "Philippines",
    tagline: "Forged in myth. Ringing with pride.",
    house: "assets/img/team-carabell.avif",
    crest: "assets/img/logo-carabell.avif",
    drawing: "assets/img/draw-bull.avif",
    gallery: ["assets/img/mascot-bull.avif", "assets/img/logo-carabell.avif", "assets/img/draw-bull.avif"],
    drawings: 14,
    foundation: "ffh",
    designer: "do",
  },
  {
    id: "ffk",
    name: "Kids Football Club",
    country: "Philippines",
    tagline: "Brave. Bright. Born to kick.",
    house: "assets/img/team-ffk.avif",
    crest: "assets/img/logo-ffk.avif",
    drawing: "assets/img/draw-kids.avif",
    gallery: ["assets/img/logo-ffk.avif", "assets/img/draw-kids.avif"],
    drawings: 12,
    foundation: "ffh",
    designer: "do",
  },
  // TODO: names, countries, crests and drawings for the houses below.
  { id: "lantern", name: null, house: "assets/img/house-lantern.avif" },
  { id: "tree", name: null, house: "assets/img/house-tree.avif" },
  { id: "arch", name: null, house: "assets/img/house-arch.avif" },
];

const PLACEHOLDER = { name: "New club", tagline: "Name and story coming soon", country: "" };

/** Team with display-safe defaults for houses whose story is not in yet. */
const withDefaults = (team) => (team.name ? { gallery: [], ...team } : { ...PLACEHOLDER, gallery: [], ...team, name: PLACEHOLDER.name, isPlaceholder: true });

export const TRIBUNE = Object.freeze({
  foundations: FOUNDATIONS,
  designers: DESIGNERS,
  teams: TEAMS.map(withDefaults),
  findTeam: (id) => TEAMS.map(withDefaults).find((t) => t.id === id) || null,
});
