// Dev harness: mounts the stadium module full-screen (npm run dev).
import "./style.css";
import { mountStadium } from "./stadium";

const app = document.getElementById("app")!;
app.style.cssText = "position:relative;width:100vw;height:100vh;";
mountStadium(app, {
  modelsUrl: new URLSearchParams(location.search).has("raw") ? "/models/" : "/models-opt/",
  envUrl: "/env/environmentSpecular.env",
  meshoptDecoderUrl: "/meshopt_decoder.js",
  teamHref: (id) => `/team.html?id=${id}`,
});
