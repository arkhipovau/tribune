// Single source of truth for teams and partner foundations.
// Used by the home carousel, teams.html and team.html.
// Fields marked "TODO" are placeholders until the real copy arrives.
(() => {
  "use strict";

  const FOUNDATIONS = {
    ffh: {
      id: "ffh",
      name: "Football for Humanity",
      logo: "assets/img/logo-ffh.webp",
      // TODO: replace with a real quote from the foundation.
      quote: "A few words from Football for Humanity about the kids, the labs and the teams will live here.",
      author: "Football for Humanity",
      role: "Foundation partner",
      tone: "green",
    },
    spring: {
      id: "spring",
      name: "The Spring Ubud",
      logo: "assets/img/logo-spring.webp",
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
      house: "assets/img/team-carabell.webp",
      crest: "assets/img/logo-carabell.webp",
      drawing: "assets/img/draw-bull.webp",
      gallery: ["assets/img/mascot-bull.webp", "assets/img/logo-carabell.webp", "assets/img/draw-bull.webp"],
      drawings: 14,
      foundation: "ffh",
      designer: "do",
    },
    {
      id: "ffk",
      name: "Kids Football Club",
      country: "Philippines",
      tagline: "Brave. Bright. Born to kick.",
      house: "assets/img/team-ffk.webp",
      crest: "assets/img/logo-ffk.webp",
      drawing: "assets/img/draw-kids.webp",
      gallery: ["assets/img/logo-ffk.webp", "assets/img/draw-kids.webp"],
      drawings: 12,
      foundation: "ffh",
      designer: "do",
    },
    // TODO: names, countries, crests and drawings for the houses below.
    { id: "lantern", name: null, house: "assets/img/house-lantern.webp" },
    { id: "tree", name: null, house: "assets/img/house-tree.webp" },
    { id: "arch", name: null, house: "assets/img/house-arch.webp" },
  ];

  const PLACEHOLDER = { name: "New club", tagline: "Name and story coming soon", country: "" };

  /** Team with display-safe defaults for houses whose story is not in yet. */
  const withDefaults = (team) => (team.name ? { gallery: [], ...team } : { ...PLACEHOLDER, gallery: [], ...team, name: PLACEHOLDER.name, isPlaceholder: true });

  window.TRIBUNE = Object.freeze({
    foundations: FOUNDATIONS,
    designers: DESIGNERS,
    teams: TEAMS.map(withDefaults),
    findTeam: (id) => TEAMS.map(withDefaults).find((t) => t.id === id) || null,
  });
})();
