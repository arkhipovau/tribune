// Dev harness: mounts the stadium module full-screen (npm run dev).
// By default it looks the way the site shows it (model only, site-style buttons).
// ?panels adds the MVP side list of clubs (for development only).
import "./style.css";
import { mountStadium } from "./stadium";

const app = document.getElementById("app")!;
app.style.cssText = "position:relative;width:100vw;height:100vh;";
mountStadium(app, {
  modelsUrl: "/models/",
  envUrl: "/env/environmentSpecular.env",
  meshoptDecoderUrl: "/meshopt_decoder.js",
  teamHref: (id) => `https://arkhipovau.github.io/tribune/team.html?id=${id}`,
  panels: new URLSearchParams(location.search).has("panels"),
});
