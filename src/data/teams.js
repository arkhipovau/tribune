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
  // From the Tribune Instagram (partner posts 2025–2026). Logos and quotes still to come.
  wefootball: { id: "wefootball", name: "WeFootball Academy", logo: null, role: "Foundation partner" }, // @wefootballacademy, Kenya
  wifu: { id: "wifu", name: "Women in Football Uganda", logo: null, role: "Foundation partner" }, // @womeninfootballugandawifu
  weunited: { id: "weunited", name: "The WE United Project", logo: null, role: "Foundation partner" }, // @theweunitedproject, Nepal
  abuorg: { id: "abuorg", name: "Abu Org", logo: null, role: "Foundation partner" }, // @abuorg8, Accra, Ghana
  csg: { id: "csg", name: "Center for Sports and Growth", logo: null, role: "Foundation partner" }, // @centerforsportsandgrowth, Nairobi
};

const DESIGNERS = {
  do: { name: "Do buro", logo: "assets/svg/do-logo.svg", logoDark: "assets/svg/do-logo-dark.svg" },
};

/** Images of a team, made by `npm run team-images` from the team content pack. */
const media = (id) => {
  const dir = `assets/img/teams/${id}`;
  return {
    house: `${dir}/house.avif`,
    houseCard: `${dir}/house-card.avif`,
    crest: `${dir}/logo.avif`,
    photo: `${dir}/photo.avif`,
    poster: `${dir}/poster.avif`,
    kit: { front: `${dir}/kit-front.avif`, back: `${dir}/kit-back.avif` },
  };
};

// Ids match the 3D stadium (stadium-src TEAMS), so each house links to its club page.
// Names, countries and descriptions: team content pack (Nov 2026). Taglines: written from them.
const TEAMS = [
  {
    id: "carabell", name: "Carabell Club", country: "Philippines",
    tagline: "Forged in myth. Ringing with pride.",
    description: "Born from the imagination of young Filipino footballers, Carabell Club takes its spirit from the mighty carabao — a symbol of strength, resilience, and determination. Its bold red, blue, and yellow identity celebrates Filipino heritage, transforming a familiar national symbol into a fearless football mascot.",
    drawing: "assets/img/draw-bull.avif", drawings: 14, foundation: "ffh", designer: "do",
  },
  {
    id: "ffk", name: "Kids Football Club", country: "Philippines",
    tagline: "Brave. Bright. Born to kick.",
    description: "Led by a fierce dragon and powered by boundless imagination, Kids Football Club brings a world of color, energy, and adventure to the pitch. With bold blue and magenta jerseys, playful characters, and a futuristic clubhouse, the team celebrates friendship, creativity, and the joy of bringing kids together through football.",
    drawing: "assets/img/draw-kids.avif", drawings: 12, foundation: "ffh", designer: "do",
  },
  {
    id: "hanoman", name: "Hanoman", country: "Bali, Indonesia",
    tagline: "An ancient legend. A team of young heroes.",
    description: "Inspired by Bali’s legendary monkey hero Hanoman, this team brings the strength of ancient mythology into a world of young superheroes. Dressed in striking yellow and black, Hanoman combines Balinese cultural heritage with comic-book imagination, turning every young footballer into a hero of their own adventure.",
  },
  {
    id: "brave_eagles", name: "Brave Eagles", country: "Uganda",
    tagline: "Girls who fly without fear.",
    description: "Inspired by the fearless spirit of the eagle, Brave Eagles soar with courage, ambition, and pride. Dressed in Uganda’s vibrant yellow, red, and black, the team celebrates the power of girls in football, turning young dreams into a bold symbol of strength, freedom, and possibility.",
    foundation: "wifu",
    type: "girls", // the content pack describes it as a girls’ team
  },
  {
    id: "we", name: "WE Football Kisumu", country: "Kenya",
    tagline: "Everyone belongs in WE.",
    description: "United by the power of football, WE Football Kisumu is a team built on friendship, teamwork, and the belief that everyone belongs. Their bold purple-and-white stripes, vibrant green accents, and wave-inspired clubhouse reflect a playful spirit and a strong sense of identity. Together, these young players prove that the greatest victories begin with the power of WE.",
    foundation: "wefootball",
  },
  {
    id: "dreamchasers", name: "Dream Chasers", country: "Ghana",
    tagline: "Lion hearts. Superhero dreams.",
    description: "With the heart of a lion and the spirit of a superhero, Dream Chasers believe that every child has the power to achieve something extraordinary. Dressed in deep green and blazing orange, the team turns courage, imagination, and teamwork into a superpower — proving that no dream is too big to chase.",
    foundation: "abuorg",
  },
  {
    id: "firetails", name: "Firetails", country: "Nepal",
    tagline: "Fox-fast girls in neon pink.",
    description: "Fueled by the fiery spirit of a fox, Firetails bring speed, creativity, and unstoppable energy to the pitch. With glowing pink jerseys, neon colors, and a futuristic clubhouse, this fearless girls’ team turns every match into a dazzling adventure where passion burns bright and imagination knows no limits.",
    foundation: "weunited",
    type: "girls", // the content pack describes it as a girls’ team
  },
  {
    id: "lwf", name: "Life With Football", country: "Philippines",
    tagline: "Riding the wave, together.",
    description: "Inspired by the power of the ocean, Life With Football rides a wave of courage, unity, and determination. With a fearless shark as its emblem, striking blue-and-yellow colors, and a wave-shaped clubhouse, the team celebrates resilience, friendship, and the belief that football can bring people together.",
    foundation: "ffh",
  },
  {
    id: "mathare", name: "Mathare Stars", country: "Kenya",
    tagline: "Young heroes who shine together.",
    description: "Born from the vibrant spirit of Mathare, the Stars are a team of fearless young heroes powered by courage, creativity, and ambition. With their fiery red-and-gold identity, armored superhero mascot, and striking futuristic clubhouse, they turn every challenge into an opportunity to shine. Their greatest superpower is growing stronger together, on and off the pitch.",
    foundation: "csg",
  },
  {
    id: "redwoods", name: "Red Woods", country: "Philippines",
    tagline: "Rooted in magic. Growing together.",
    description: "Rooted in the spirit of nature, Red Woods is a team where strength, unity, and imagination grow together. Inspired by enchanted forests and a mysterious tree guardian, their deep red and vibrant green identity brings the magic of the woods onto the football pitch. Their treehouse-inspired clubhouse is a place where young players can explore, dream, and grow stronger together.",
    foundation: "ffh",
  },
].map((t) => ({ ...media(t.id), gallery: [], ...t })).map((t) => ({ ...t, gallery: [t.photo, t.poster, t.crest] }));

const PLACEHOLDER = { name: "New club", tagline: "Name and story coming soon", country: "" };

/** Team with display-safe defaults for houses whose story is not in yet. */
const withDefaults = (team) => (team.name ? { gallery: [], ...team } : { ...PLACEHOLDER, gallery: [], ...team, name: PLACEHOLDER.name, isPlaceholder: true });

export const TRIBUNE = Object.freeze({
  foundations: FOUNDATIONS,
  designers: DESIGNERS,
  teams: TEAMS.map(withDefaults),
  findTeam: (id) => TEAMS.map(withDefaults).find((t) => t.id === id) || null,
});
