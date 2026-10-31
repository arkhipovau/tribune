// Deep imports keep the bundle to the parts of Babylon this scene actually uses.
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Matrix, Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { ColorCurves } from "@babylonjs/core/Materials/colorCurves";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Material } from "@babylonjs/core/Materials/material";
import { MaterialPluginBase } from "@babylonjs/core/Materials/materialPluginBase";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { UniformBuffer } from "@babylonjs/core/Materials/uniformBuffer";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { SubMesh } from "@babylonjs/core/Meshes/subMesh";
import { CreateLineSystem } from "@babylonjs/core/Meshes/Builders/linesBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { MeshoptCompression } from "@babylonjs/core/Meshes/Compression/meshoptCompression";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
// Side-effect modules the scene relies on (picking, outlines, glow, shadows, .env, glTF).
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Rendering/outlineRenderer";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/loaders/glTF/2.0";


export type StadiumOptions = {
  /** Folder with the GLB files, ending with "/". */
  modelsUrl: string;
  /** Prefiltered environment (.env) used for reflections. */
  envUrl: string;
  /** Self-hosted meshoptimizer decoder (UMD) for the compressed GLBs. */
  meshoptDecoderUrl: string;
  /** Link for a team page, or null when the team has no page yet. */
  teamHref?: (teamId: string) => string | null;
  /** Skip the intro wipe (prefers-reduced-motion). */
  reducedMotion?: boolean;
  /** Side columns (title, team list). Off = the model alone, for embedding. Default: true. */
  panels?: boolean;
};
export type StadiumHandle = { dispose: () => void };

export function mountStadium(root: HTMLElement, options: StadiumOptions): StadiumHandle {
MeshoptCompression.Configuration = { decoder: { url: options.meshoptDecoderUrl } };
// TRIBUNE / AXONOMETRIC EDITION
// Models must exist in public/models/. All exported GLBs must share one origin and scale.
const SETTINGS = {
  stadiumFile: "stadium.glb", roofFile: "roof.glb", columnsFile: "columns.glb",
  fieldFile: "field.glb", billboardFile: "billboard.glb", blankFile: "blank_1.glb",
  background: "#050910", outlineColor: new Color3(0.02, 0.58, 0.78),
  outlineBrightness: 1.9, edgeThreshold: 0.90,
  spotlightRadius: 24, // world units; adjust to the stadium scale
  spotlightSoftness: 0.1, // fraction of radius
  triggerRadiusMultiplier: 1.35,
  teamGlowFadeIn: 0.12, teamGlowFadeOut: 0.30,
  introHoldMs: 900, introWipeMs: 2200,
  introEnabled: true,
  orthoHalfHeight: 140, cameraAlpha: -Math.PI / 2.8,
  cameraBeta: 0.55, cameraRadius: 450,
  cameraRotationDegreesPerSecond: 2.0, // full revolution in 3 minutes
  teamCameraBeta: 1.50, // nearly horizontal view from pitch level
  teamCameraFov: 0.75, // perspective field of view in radians
  teamCameraDistanceMultiplier: 3.4,
  teamTransitionSeconds: 1.8,
  // Transition profiling: disable costly detail shadow rendering while flying.
  detailShadowsDuringFlight: false,
  // Turn this off temporarily to test whether the shadow map is the bottleneck.
  detailShadowsEnabled: true, // Low-resolution spotlight shadows, selected house only
  detailSpotIntensity: 3.0, // key light for the close-up; adjust 2–4
  detailSpotAngle: 1.3, // wide beam at the beginning of the flight
  detailSpotFocusMargin: 1.12, // house bounding sphere + 12% margin
  detailSpotMinAngle: 0.18, // radians: prevent a pinhole beam
  detailSpotMaxAngle: 1.35, // allow enough coverage from the pitch center
  detailSpotHeightAbovePitch: 30, // standard close-up source height
  debugSpotDistanceFromHouse: 24, // diagnostic source: 24 units toward the pitch
  debugSpotHeightAboveHouse: 14, // diagnostic source: 14 units above house center
  detailFogDensity: 0.002, // subtle cool atmospheric depth in close-up
  teamCameraHeightOffset: 2.0, // eye is 2 world units above HOUSE center, as in the original version
  teamCameraPreferredDistance: 35, // original Carabell framing; increase only for larger houses
  detailCameraSideAngleDegrees: 18, // reveal two facades, still approach from the pitch
  detailHouseFrameFraction: 0.72, // desired fraction of viewport height
  detailSunIntensity: 0.35, // ambient daylight only; spotlight is the key light
  detailAmbientIntensity: 0.55,
  detailEnvironmentIntensity: 0.40,
  detailExposure: 0.95,
  detailContrast: 1.40,
};

const TEAMS = [
  { id:"carabell", name:"Carabell Club", file:"Carabell.glb", country:"Philippines", info:"Football for Humanity", color:"#FF591A" },
  { id:"brave_eagles", name:"Brave Eagles", file:"brave_eagles.glb", country:"", info:"", color:"#F2C35B" },
  { id:"dreamchasers", name:"Dreamchasers", file:"dreamchasers.glb", country:"", info:"", color:"#9C85FF" },
  { id:"ffk", name:"FFK", file:"ffk.glb", country:"", info:"", color:"#7CE2CC" },
  { id:"firetails", name:"Firetails", file:"firetails.glb", country:"", info:"", color:"#FF773D" },
  { id:"hanoman", name:"Hanoman", file:"hanoman.glb", country:"Indonesia", info:"Bali", color:"#FFD447" },
  { id:"lwf", name:"Life With Football", file:"lwf.glb", country:"Philippines", info:"Malabon", color:"#48A7FF" },
  { id:"mathare", name:"Mathare", file:"mathare.glb", country:"", info:"", color:"#72D7A2" },
  { id:"redwoods", name:"Red Woods", file:"redwoods.glb", country:"Philippines", info:"", color:"#E54848" },
  { id:"we", name:"WE", file:"we.glb", country:"", info:"", color:"#F3A6DA" },
];
type TeamConfig = typeof TEAMS[number];
type LoadedTeam = { config: TeamConfig; meshes: Mesh[]; center: Vector3; radius: number };

// TRIBUNE / SEAMLESS OVERVIEW -> CIRCULAR DETAIL
// Fill the available frame with the canvas; the circular aperture is sized from its width.
const STYLE_ID = "tribune-stadium-style";
const pageStyle = (document.getElementById(STYLE_ID) as HTMLStyleElement | null) ?? document.createElement("style");
pageStyle.id = STYLE_ID;
pageStyle.textContent = `
  #tribuneLayout { position:absolute; inset:0; display:grid; grid-template-columns:minmax(190px,1fr) minmax(0,1000px) minmax(190px,1fr); align-items:stretch; gap:clamp(12px,2.2vw,40px); padding:clamp(16px,3vw,48px); box-sizing:border-box; background:#2f3847; color:#d6e8ed; font-family:Arial,sans-serif; }
  #tribuneViewport { width:100%; height:100%; min-height:0; max-width:100%; border-radius:0; clip-path:circle(var(--tribune-overview-radius, 400px) at 50% 50%); overflow:hidden; position:relative; justify-self:center; background:#2f3847; border:0; box-shadow:none; transition:clip-path 1.8s cubic-bezier(0.45,0,0.55,1); }
  #tribuneViewport.tribuneDetail { clip-path:circle(var(--tribune-detail-radius, 336px) at 50% 50%); background:#2f3847; }
  #renderCanvas { position:absolute !important; inset:0 !important; display:block !important; width:100% !important; height:100% !important; max-width:none !important; max-height:none !important; border:0 !important; outline:0 !important; touch-action:none; }
  .tribuneSide { min-width:0; max-width:300px; display:flex; flex-direction:column; gap:18px; }
  .tribuneEyebrow { font-size:10px; letter-spacing:.22em; color:#78b7c6; }
  .tribuneTitle { font-size:clamp(20px,2.4vw,35px); font-weight:600; letter-spacing:.12em; margin:0; color:#e7f8fa; }
  .tribuneText { color:#91aeb9; font-size:13px; line-height:1.65; margin:0; }
  .tribuneRule { height:1px; background:#284150; }
  #tribuneSelectedName { font-size:clamp(17px,1.7vw,26px); font-weight:600; color:#e7f8fa; }
  #tribuneSelectedMeta { font-size:12px; color:#9ab8c5; }
  #tribuneTeamList { display:flex; flex-wrap:wrap; gap:7px; }
  .tribuneTeamButton { border:1px solid #294857; color:#9bbbc7; background:#10202d; border-radius:4px; padding:7px 9px; font-size:11px; cursor:pointer; }
  .tribuneTeamButton:hover { color:#d7f9ff; border-color:#66c8db; }
  #tribuneTeamLink { display:none; align-self:flex-start; padding:9px 14px; border:1px solid #66c8db; border-radius:999px; color:#d7f9ff; font-size:12px; letter-spacing:.12em; text-decoration:none; }
  #tribuneTeamLink:hover { background:#10202d; }
  #tribuneStatus { font-size:11px; letter-spacing:.18em; color:#78b7c6; }
  /* Embedded mode: only the model; the club link floats over the scene. */
  #tribuneLayout.tribuneBare { position:absolute; inset:0; min-height:0; grid-template-columns:1fr; padding:0; gap:0; }
  #tribuneLayout.tribuneBare .tribuneSide { display:none; }
  #tribuneLayout.tribuneBare #tribuneViewport,
  #tribuneLayout.tribuneBare #tribuneViewport.tribuneDetail { width:100%; height:100%; grid-row:auto; clip-path:none; } /* no circular aperture when embedded */
  /* Site-style controls, centred at the bottom of the widget (embedded mode). */
  #tribuneLayout .tribuneActions { position:absolute; left:50%; bottom:24px; transform:translateX(-50%); z-index:5; display:none; gap:0; padding:4px; border-radius:1000px; background:rgba(255,255,255,.6); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
  #tribuneLayout .tribuneActions.isOpen { display:flex; }
  #tribuneLayout .tribuneActions > * { display:inline-flex; align-items:center; height:36px; padding:0 16px; border:0; border-radius:1000px; background:transparent; color:#17100e; font:450 14px/1.1 "Suisse Intl", system-ui, sans-serif; letter-spacing:0; text-decoration:none; white-space:nowrap; cursor:pointer; transition:background .2s, transform .15s; }
  #tribuneLayout .tribuneActions > *:hover { background:rgba(23,16,14,.05); }
  #tribuneLayout .tribuneActions > *:active { transform:scale(.97); }
  #tribuneLayout .tribuneActions > #tribuneTeamLink { background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.06); font-weight:600; }
  #tribuneLayout.tribuneBare .tribuneTip { padding:8px 14px !important; background:#fff !important; color:#17100e !important; border:0 !important; border-radius:1000px !important; font:450 14px/1.1 "Suisse Intl", system-ui, sans-serif !important; box-shadow:0 2px 8px rgba(0,0,0,.12); }
  @media (max-width:950px) {
    #tribuneLayout { position:relative; min-height:100%; grid-template-columns:1fr; justify-items:center; padding:22px 16px 60px; gap:20px; }
    #tribuneViewport { width:min(85vw, 650px); height:min(85vw, 650px); grid-row:2; }
    .tribuneSide { max-width:min(85vw,650px); width:100%; }
    #tribuneRight { grid-row:3; }
  }
`;
if (!pageStyle.isConnected) document.head.appendChild(pageStyle);
const layout = document.createElement("main");
layout.id = "tribuneLayout";
layout.innerHTML = `
  <section class="tribuneSide" id="tribuneLeft">
    <div class="tribuneEyebrow">TRIBUNE / KIDS.SPACE</div>
    <h1 class="tribuneTitle">THE STADIUM</h1>
    <div class="tribuneRule"></div>
    <p class="tribuneText">A digital stadium built from children's imagination. Explore the clubhouses created for football teams around the world.</p>
    <div class="tribuneEyebrow">INTERACTIVE ARCHITECTURE · 001</div>
    <div id="tribuneStatus">LOADING THE STADIUM…</div>
  </section>
  <div id="tribuneViewport" aria-label="Interactive 3D stadium"></div>
  <section class="tribuneSide" id="tribuneRight">
    <div class="tribuneEyebrow">SELECTED TEAM</div>
    <div id="tribuneSelectedName">EXPLORE THE TEAMS</div>
    <div id="tribuneSelectedMeta">Move the cursor over the stadium</div>
    <a id="tribuneTeamLink" href="#">OPEN CLUB PAGE →</a>
    <div class="tribuneRule"></div>
    <div class="tribuneEyebrow">10 CLUBHOUSES</div>
    <div id="tribuneTeamList"></div>
  </section>`;
root.appendChild(layout);
const bare = options.panels === false;
if (bare) layout.classList.add("tribuneBare");
const viewport = document.getElementById("tribuneViewport")!;
const selectedName = document.getElementById("tribuneSelectedName")!;
const selectedMeta = document.getElementById("tribuneSelectedMeta")!;
const teamList = document.getElementById("tribuneTeamList")!;
const teamLink = document.getElementById("tribuneTeamLink") as HTMLAnchorElement;
const statusLine = document.getElementById("tribuneStatus")!;
// Embedded mode: "Back to stadium" + "Open club page" share one pill at the bottom.
const actions = document.createElement("div");
actions.className = "tribuneActions";
if (bare) layout.appendChild(actions);
const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
viewport.appendChild(canvas);
// Render at the screen's real pixel density, capped at 2x for speed.
// (The MVP used a fixed 1.25 downscale without DPR support: soft and jagged on Retina.)
const MAX_PIXEL_RATIO = 2;
const engine = new Engine(canvas, true, { antialias: true }, true);
engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
const scene = new Scene(engine);
// TEST: use Babylon Standard light attenuation for every PBR material.
// This also applies to PBR materials created later (including masked clones).
function forceStandardLightFalloff(material: Material): void {
  if (material instanceof PBRMaterial) {
    material.usePhysicalLightFalloff = false;
  }
}
scene.onNewMaterialAddedObservable.add(forceStandardLightFalloff);
scene.materials.forEach(forceStandardLightFalloff);
scene.clearColor = Color4.FromHexString("#050910FF");
const camera = new ArcRotateCamera("fixedAxonometric", SETTINGS.cameraAlpha, SETTINGS.cameraBeta,
  SETTINGS.cameraRadius, Vector3.Zero(), scene);
camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
// No attachControl: fixed architectural view; cursor moves the spotlight, not the camera.
let currentOrthoHalfHeight = SETTINGS.orthoHalfHeight;
camera.fov = SETTINGS.teamCameraFov;
function updateOrtho() {
  const halfH = currentOrthoHalfHeight;
  const halfW = halfH * engine.getRenderWidth() / Math.max(1, engine.getRenderHeight());
  camera.orthoLeft = -halfW; camera.orthoRight = halfW;
  camera.orthoTop = halfH; camera.orthoBottom = -halfH;
}
updateOrtho();
const resizeViewport = () => {
  // The aperture radius follows the smaller side so the circle always fits the frame
  // (a wide embedded card would otherwise crop it top and bottom).
  const box = viewport.getBoundingClientRect();
  const size = Math.min(box.width, box.height || box.width);
  viewport.style.setProperty("--tribune-overview-radius", `${size * 0.5}px`);
  viewport.style.setProperty("--tribune-detail-radius", `${size * 0.42}px`);
  engine.resize();
  updateOrtho();
};
window.addEventListener("resize", resizeViewport);
new ResizeObserver(resizeViewport).observe(viewport);
requestAnimationFrame(resizeViewport);

const ambient = new HemisphericLight("ambient", new Vector3(0,1,0), scene);
const overviewAmbientIntensity = 0.65;
ambient.intensity = 0.65;
ambient.diffuse = new Color3(0.65,0.75,1);
ambient.groundColor = new Color3(0.35,0.40,0.55);
const sun = new DirectionalLight("sun", new Vector3(-1,-2,-1), scene);
const overviewSunIntensity = 1.6;
sun.intensity = 1.6;
sun.diffuse = new Color3(1,0.86,0.72);
const shadows = new ShadowGenerator(2048, sun);
shadows.usePercentageCloserFiltering = true;
shadows.normalBias = 0.012;
shadows.bias = 0.0008;
sun.position = new Vector3(100, 240, 120);
sun.autoCalcShadowZBounds = true;
// Shadows are rendered only in the close-up and during its transition.
sun.shadowEnabled = false;
const detailSpot = new SpotLight(
  "teamDetailSpot", new Vector3(0, 100, 0), new Vector3(0, -1, 0),
  SETTINGS.detailSpotAngle, 2, scene
);
detailSpot.diffuse = new Color3(1, 0.94, 0.85);
detailSpot.specular = new Color3(1, 0.94, 0.85);
detailSpot.intensity = 0;
detailSpot.range = 250;
// Independent shadow map for the selected-house spotlight. No roof or stadium
// casters are added here: the light should reach the house through the roof.
const detailSpotShadows = new ShadowGenerator(512, detailSpot);
detailSpotShadows.usePercentageCloserFiltering = true;
detailSpotShadows.bias = 0.0008;
detailSpotShadows.normalBias = 0.015;
detailSpot.shadowEnabled = false;
scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
  options.envUrl, scene);
scene.environmentIntensity = 0.5;
const overviewEnvironmentIntensity = scene.environmentIntensity;
scene.fogMode = Scene.FOGMODE_NONE;
scene.fogColor = new Color3(0.66, 0.75, 0.88);
// Reproduce the original architectural grade in detail mode only.
const imageProcessing = scene.imageProcessingConfiguration;
const detailCurves = new ColorCurves();
detailCurves.globalSaturation = 15;
detailCurves.globalDensity = 5;
detailCurves.shadowsHue = 230;
detailCurves.shadowsDensity = 40;
detailCurves.shadowsSaturation = 10;
detailCurves.highlightsHue = 35;
detailCurves.highlightsDensity = 8;
detailCurves.highlightsSaturation = 5;
imageProcessing.colorCurves = detailCurves;
imageProcessing.colorCurvesEnabled = false;
imageProcessing.vignetteEnabled = false;
imageProcessing.colorGradingEnabled = false;
const overviewExposure = imageProcessing.exposure;
const overviewContrast = imageProcessing.contrast;
// Compare fill lighting against sun-only lighting without touching the overview.
let spotlightOnlyTest = false;
const pipeline = new DefaultRenderingPipeline("post", true, scene, [camera]);
pipeline.fxaaEnabled = true;
pipeline.samples = 1; // FXAA is enabled; MSAA can be tested separately
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.65;
pipeline.bloomWeight = 0.08;
pipeline.bloomKernel = 48;

const glow = new HighlightLayer("teamOutlines", scene);
glow.innerGlow = false;
glow.outerGlow = true;

glow.blurHorizontalSize = 0.5;
glow.blurVerticalSize = 0.5;

glow.isEnabled = false;

// These material plugins keep the ORIGINAL imported PBR/Standard materials and textures.
// The reveal plugin clips pixels outside the world-space spotlight, with a soft dither edge.
// The wipe plugin clips roof/columns by angle around the stadium centre.
let spotlightCenter = new Vector3(0,-10000,0);
let spotlightActive = false;
let wipeProgress = 0;
let introFinished = false;
let detailMode = false;
let selectedDetailTeam: LoadedTeam | null = null;
// 0 = stadium linework, 1 = fully revealed architectural close-up.
let detailBlend = 0;
let roofDetailMeshes: Mesh[] = [];
let columnDetailMeshes: Mesh[] = [];
let pitchGroundY = 0;
let returningToOverview = false;
let cameraTransition: null | {
  elapsed: number; duration: number;
  fromAlpha: number; toAlpha: number;
  fromBeta: number; toBeta: number;
  fromRadius: number; toRadius: number;
  fromHeight: number; toHeight: number;
  fromTarget: Vector3; toTarget: Vector3;
  fromPosition: Vector3; toPosition: Vector3;
  fromProjectionBlend: number; toProjectionBlend: number;
  onComplete?: () => void;
} = null;
let savedOverview: null | {alpha: number; beta: number; radius: number; height: number; target: Vector3} = null;
let projectionBlend = 0; // 0 = orthographic, 1 = perspective
const plugins: MaskPlugin[] = [];
class MaskPlugin extends MaterialPluginBase {
  private kind: "spot"|"wipe"|"inverseSpot"|"roof"|"columns";
  constructor(material: Material, kind: "spot"|"wipe"|"inverseSpot"|"roof"|"columns") {
    super(material, "TribuneMask_" + kind, 210, { TRIBUNE_MASK: true });
    this.kind = kind;
    this._enable(true);
  }
  getClassName() { return "TribuneMask"; }
  getUniforms() {
    return { ubo: [
      { name: "tribuneCenter", size: 3, type: "vec3" },
      { name: "tribuneRadius", size: 1, type: "float" },
      { name: "tribuneSoftness", size: 1, type: "float" },
      { name: "tribuneWipe", size: 1, type: "float" },
      { name: "tribuneDetailBlend", size: 1, type: "float" },
      { name: "tribuneViewportWidth", size: 1, type: "float" },
    ],
    // Declarations for the non-UBO path; without them some materials fail to compile.
    fragment: `#ifdef TRIBUNE_MASK
      uniform vec3 tribuneCenter;
      uniform float tribuneRadius;
      uniform float tribuneSoftness;
      uniform float tribuneWipe;
      uniform float tribuneDetailBlend;
      uniform float tribuneViewportWidth;
    #endif` };
  }
  bindForSubMesh(ubo: UniformBuffer, _scene: Scene, _engine: Engine, _subMesh: SubMesh) {
    ubo.updateVector3("tribuneCenter", spotlightCenter);
    ubo.updateFloat("tribuneRadius", spotlightActive ? SETTINGS.spotlightRadius : -1);
    ubo.updateFloat("tribuneSoftness", SETTINGS.spotlightSoftness);
    ubo.updateFloat("tribuneWipe", wipeProgress);
    ubo.updateFloat("tribuneDetailBlend", detailBlend);
    ubo.updateFloat("tribuneViewportWidth", Math.max(1, engine.getRenderWidth()));
  }
  getCustomCode(shaderType: string) {
    if (shaderType !== "fragment") return null;
    // Clean screen-space wipe: no stochastic pixels scattered over the stadium.
    // The transition boundary moves left-to-right during the 1.8s camera flight.
    const wipeCode = `
      float screenX = gl_FragCoord.x / max(1.0, tribuneViewportWidth);
      float revealed = step(screenX, tribuneDetailBlend);
    `;
    // The roof must be visible BEFORE the intro wipe, and disappear as it sweeps.
    // On close-up it reappears only inside the screen-space reveal.
    if (this.kind === "roof") return {
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        ${wipeCode}
        if (tribuneDetailBlend > 0.00001) {
          if (revealed < 0.5) discard;
        } else {
          float a = atan(vPositionW.z - tribuneCenter.z, vPositionW.x - tribuneCenter.x);
          float normalizedAngle = fract((a + 3.14159265) / 6.2831853);
          if (normalizedAngle < tribuneWipe) discard;
        }
      `,
    };
    // Columns share the intro wipe but return with the roof in architectural view.
    if (this.kind === "columns") return {
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        ${wipeCode}
        if (tribuneDetailBlend > 0.00001) {
          if (revealed < 0.5) discard;
        } else {
          float a = atan(vPositionW.z - tribuneCenter.z, vPositionW.x - tribuneCenter.x);
          float normalizedAngle = fract((a + 3.14159265) / 6.2831853);
          if (normalizedAngle < tribuneWipe) discard;
        }
      `,
    };
    if (this.kind === "inverseSpot") return {
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        ${wipeCode}
        float coverage = 0.0;
        if (tribuneRadius > 0.0) {
          float d = distance(vPositionW.xz, tribuneCenter.xz);
          float inner = tribuneRadius * (1.0 - tribuneSoftness);
          coverage = 1.0 - smoothstep(inner, tribuneRadius, d);
        }
        // During close-up the blank-house occluders vanish behind the wipe.
        if (revealed > 0.5 || coverage > 0.5) discard;
      `,
    };
    if (this.kind === "spot") return {
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        ${wipeCode}
        float coverage = 0.0;
        if (tribuneRadius > 0.0) {
          float d = distance(vPositionW.xz, tribuneCenter.xz);
          float inner = tribuneRadius * (1.0 - tribuneSoftness);
          coverage = 1.0 - smoothstep(inner, max(inner + 0.001, tribuneRadius), d);
        }
        // Fully visible in revealed portion; otherwise only under spotlight.
        if (revealed < 0.5 && coverage < 0.5) discard;
      `,
    };
    return {
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        ${wipeCode}
        // Intro angular wipe when overview is active; screen wipe for close-up.
        if (tribuneDetailBlend > 0.0) {
          if (revealed < 0.5) discard;
        } else {
          float a = atan(vPositionW.z - tribuneCenter.z, vPositionW.x - tribuneCenter.x);
          float normalizedAngle = fract((a + 3.14159265) / 6.2831853);
          if (normalizedAngle < tribuneWipe) discard;
        }
      `,
    };
  }
}
function addMask(meshes: Mesh[], kind: "spot"|"wipe"|"roof"|"columns") {
  const unique = new Set<Material>();
  for (const mesh of meshes) {
    // Clone material per mesh: a material shared by stadium/roof must not share mask behavior.
    if (!mesh.material) {
      mesh.material = new StandardMaterial("fallback_" + mesh.name, scene);
    }
    const original = mesh.material;
    const cloned = original.clone(original.name + "_" + kind + "_" + mesh.uniqueId);
    if (!cloned) continue;
    mesh.material = cloned;
    if (unique.has(cloned)) continue;
    unique.add(cloned);
    plugins.push(new MaskPlugin(cloned, kind));
  }
}

// Permanent cyan outlines from meaningful mesh edges (not triangle diagonals).
// World-space line vertices remain fixed in the axonometric view.
function extractEdges(mesh: Mesh): Vector3[][] {
  const positions = mesh.getVerticesData("position");
  const indices = mesh.getIndices();
  if (!positions || !indices) return [];
  mesh.computeWorldMatrix(true);
  const world = mesh.getWorldMatrix();
  const vertices: Vector3[] = [];
  for (let i=0; i<positions.length; i+=3)
    vertices.push(Vector3.TransformCoordinates(new Vector3(positions[i],positions[i+1],positions[i+2]), world));
  const edges = new Map<string,{a:number;b:number;normals:Vector3[]}>();
  const add = (a:number,b:number,n:Vector3) => {
    const key = Math.min(a,b)+":"+Math.max(a,b);
    const existing = edges.get(key);
    if (existing) existing.normals.push(n);
    else edges.set(key,{a,b,normals:[n]});
  };
  for (let i=0;i+2<indices.length;i+=3) {
    const a=Number(indices[i]),b=Number(indices[i+1]),c=Number(indices[i+2]);
    const n=Vector3.Cross(vertices[b].subtract(vertices[a]),vertices[c].subtract(vertices[a]));
    if (n.lengthSquared()<1e-10) continue;
    n.normalize(); add(a,b,n); add(b,c,n); add(c,a,n);
  }
  const lines: Vector3[][]=[];
  for (const e of edges.values())
    if (e.normals.length===1 || e.normals.some(n=>Vector3.Dot(n,e.normals[0])<SETTINGS.edgeThreshold))
      lines.push([vertices[e.a],vertices[e.b]]);
  return lines;
}
Effect.ShadersStore["tribuneLinesVertexShader"] = `
  precision highp float;

  attribute vec3 position;

  uniform mat4 worldViewProjection;
  uniform mat4 world;

  varying vec3 vWorldPosition;

  void main() {
    vWorldPosition = (world * vec4(position, 1.0)).xyz;
    gl_Position = worldViewProjection * vec4(position, 1.0);
  }
`;
Effect.ShadersStore["tribuneLinesFragmentShader"] = `
  precision highp float;

  uniform vec3 lineColor;
  uniform float lineBrightness;

  uniform vec3 spotCenter;
  uniform float spotRadius;
  uniform float spotSoftness;
  uniform float hideInSpot;
  uniform float detailBlend;

  varying vec3 vWorldPosition;

  void main() {
    float brightness = 1.0;

    if (hideInSpot > 0.5 && spotRadius > 0.0) {
      float d = distance(vWorldPosition.xz, spotCenter.xz);

      float inner = spotRadius * (1.0 - spotSoftness);

      brightness = smoothstep(
        inner,
        spotRadius,
        d
      );

      if (brightness < 0.01) discard;
    }

    if (hideInSpot > 0.5) brightness *= (1.0 - detailBlend);
    if (brightness < 0.01) discard;
    gl_FragColor = vec4(
      lineColor * lineBrightness * brightness,
      1.0
    );
  }
`;
const outlineMaterial = new ShaderMaterial("cyanLines", scene,
  {vertex:"tribuneLines",fragment:"tribuneLines"},
  {attributes:["position"],uniforms:["worldViewProjection","world","lineColor","lineBrightness","spotCenter","spotRadius","spotSoftness","hideInSpot","detailBlend"]});
outlineMaterial.setColor3("lineColor",SETTINGS.outlineColor);
outlineMaterial.setFloat("lineBrightness",SETTINGS.outlineBrightness);
outlineMaterial.disableDepthWrite = true;
outlineMaterial.backFaceCulling = false;
outlineMaterial.depthFunction = Engine.LEQUAL;

// The field is always visible. Stadium and blank lines disappear under the spotlight.
outlineMaterial.setFloat("hideInSpot", 0);
outlineMaterial.setFloat("detailBlend", 0);
const revealOutlineMaterial = outlineMaterial.clone("revealOutlineMaterial")!;
revealOutlineMaterial.setFloat("hideInSpot", 1);
revealOutlineMaterial.setFloat("detailBlend", 0);
revealOutlineMaterial.setVector3("spotCenter", spotlightCenter);
revealOutlineMaterial.setFloat("spotRadius", -1);
revealOutlineMaterial.setFloat("spotSoftness", SETTINGS.spotlightSoftness);

// Invisible depth geometry occludes rear edges; it writes Z but not color.
const depthMaterial = new StandardMaterial("occlusionOnly",scene);
depthMaterial.disableColorWrite = true;
depthMaterial.disableDepthWrite = false;
depthMaterial.backFaceCulling = true;
// Lines draw in group 1, after all depth occluders in group 0.
scene.setRenderingAutoClearDepthStencil(1,false);

const stadiumDepthMaterial = depthMaterial.clone("stadiumDepthMaterial")!;
new MaskPlugin(stadiumDepthMaterial, "inverseSpot");

const blankDepthMaterial = depthMaterial.clone(
  "blankDepthMaterial"
)!;

new MaskPlugin(blankDepthMaterial, "inverseSpot");

async function importModel(file:string): Promise<Mesh[]> {
  const result = await SceneLoader.ImportMeshAsync("",options.modelsUrl,file,scene);
  return result.meshes.filter((m):m is Mesh=>m instanceof Mesh && m.getTotalVertices()>0);
}
function createOutlines(label:string, meshes:Mesh[], occlude:boolean) {
const lines: Vector3[][] = [];

for (const mesh of meshes) {
  const edges = extractEdges(mesh);

  for (const edge of edges) {
    lines.push(edge);
  }
}
  if (lines.length) {
    const outline = CreateLineSystem(label+"_outlines",{lines},scene);
    outline.isPickable=false;
    outline.applyFog=false;
    outline.renderingGroupId=1;
    outline.material=(label === "blank" || label === "stadium")
      ? revealOutlineMaterial : outlineMaterial;
  }
  if (occlude) for (const m of meshes) {
    m.material =
  label === "blank"
    ? blankDepthMaterial
    : depthMaterial;
    m.isPickable=false;
    m.renderingGroupId=0;
    m.receiveShadows=false;
  }
  
}

let stadiumMeshes: Mesh[]=[];
let teamData:LoadedTeam[]=[];
// Constant-time mesh-to-team lookup for scene picking.
const teamByMesh = new Map<Mesh, LoadedTeam>();
let stadiumCenter = Vector3.Zero();
const worldPointer = new Vector3(0,-10000,0);
const pointer = new Vector2(-9999,-9999);
let pointerInside=false;
let activeTeam:LoadedTeam|null=null;
let currentGlowStrength=0;
let desiredGlowStrength=0;
// HighlightLayer uses original team meshes. The former depth-only proxy material
// suppressed its color output, making the glow practically invisible.
const teamLabel=document.createElement("div");
teamLabel.className="tribuneTip";
teamLabel.style.cssText="position:absolute;display:none;padding:12px 16px;background:rgba(5,10,18,.92);color:white;border:1px solid #29647a;border-radius:8px;font:14px Arial,sans-serif;pointer-events:none;z-index:1000";
layout.appendChild(teamLabel);
const introText=document.createElement("div");
introText.textContent="TRIBUNE";
introText.hidden = bare; // the intro caption belongs to the standalone page only
introText.style.cssText="position:absolute;left:50%;top:8%;transform:translateX(-50%);color:#7be9ff;letter-spacing:.55em;font:600 18px Arial;pointer-events:none;z-index:20;text-shadow:0 0 25px #14c6ff";
layout.appendChild(introText);
// Diagnostic: preserve untouched GLB materials before adding the reveal plugin.
const originalTeamMaterials = new Map<Mesh, Material | null>();
let materialDiagnosticMode: "masked" | "original" | "standard" = "masked";
let diagnosticStandardMesh: Mesh | null = null;
const diagnosticStandardMaterial = new StandardMaterial("DEBUG_Carabell_standard", scene);
diagnosticStandardMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
diagnosticStandardMaterial.specularColor = new Color3(0.04, 0.04, 0.04);
function applyMaterialDiagnostic() {
  const carabell = teamData.find(t => t.config.id === "carabell");
  if (!carabell) return;
  // Only replace materials after the flight finishes; restore before flying back.
  const active = detailMode && !returningToOverview && !cameraTransition &&
    selectedDetailTeam?.config.id === "carabell";
  const mode = active ? materialDiagnosticMode : "masked";
  if (!diagnosticStandardMesh) {
    const candidates = carabell.meshes.filter(m => m.getTotalVertices() > 0 && m.getVerticesData("normal"));
    diagnosticStandardMesh = candidates.reduce<Mesh | null>((best, m) =>
      !best || m.getTotalVertices() > best.getTotalVertices() ? m : best, null);
  }
  for (const mesh of carabell.meshes) {
    const masked = maskedTeamMaterials.get(mesh);
    const original = originalTeamMaterials.get(mesh);
    if (mode === "masked") mesh.material = masked ?? mesh.material;
    else if (mode === "standard" && mesh === diagnosticStandardMesh) mesh.material = diagnosticStandardMaterial;
    else mesh.material = original ?? masked ?? mesh.material;
  }
  materialDiagnosticStatus.textContent =
    `Материалы Carabell: ${mode === "masked" ? "с маской" : mode === "original" ? "оригинальные GLB" : "StandardMaterial на одном меше"}` +
    (mode === "standard" && diagnosticStandardMesh ? ` · ${diagnosticStandardMesh.name}` : "");
}
const maskedTeamMaterials = new Map<Mesh, Material | null>();
let billboardMeshes: Mesh[] = [];
async function loadWorld() {
  try {
    stadiumMeshes=await importModel(SETTINGS.stadiumFile);
    if (!stadiumMeshes.length) throw new Error("stadium.glb contains no renderable meshes");
    let min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
    for(const m of stadiumMeshes) {
      m.computeWorldMatrix(true);
      const b=m.getBoundingInfo().boundingBox;
      min=Vector3.Minimize(min,b.minimumWorld);max=Vector3.Maximize(max,b.maximumWorld);
    }
    stadiumCenter=min.add(max).scale(.5);
    camera.setTarget(stadiumCenter);
    spotlightCenter=stadiumCenter.clone();
    spotlightCenter.y=-10000;
    addMask(stadiumMeshes,"spot");
    for(const m of stadiumMeshes) {m.receiveShadows=true;shadows.addShadowCaster(m);m.isPickable=false;}
    // Separate depth-only copies for edge occlusion. Their source materials remain intact.
    const stadiumOccluders=stadiumMeshes.map(m=>{
      const clone=m.clone("depth_"+m.name,null,false)!;
      clone.material=stadiumDepthMaterial;clone.isPickable=false;clone.renderingGroupId=0;
      clone.receiveShadows=false;
      return clone;
    });
    void stadiumOccluders;

    createOutlines("stadium",stadiumMeshes,false);  } catch(e) {console.error("STADIUM FAILED:",e);}

  // field: cyan lines only; stadium surface already provides the pitch.
  try {
    const fieldMeshes = await importModel(SETTINGS.fieldFile);
    // Pitch surface reference: unlike stadiumCenter.y, this is near the actual field level.
    let minFieldY = Infinity;
    for (const mesh of fieldMeshes) {
      mesh.computeWorldMatrix(true);
      minFieldY = Math.min(minFieldY, mesh.getBoundingInfo().boundingBox.minimumWorld.y);
    }
    if (Number.isFinite(minFieldY)) pitchGroundY = minFieldY;
    createOutlines("field", fieldMeshes, true);
  } catch(e){console.error("FIELD FAILED:",e);}
  // blanks: cyan lines only; invisible depth geometry hides rear edges.
  try {createOutlines("blank",await importModel(SETTINGS.blankFile),true);} catch(e){console.error("BLANK FAILED:",e);}

  for(const config of TEAMS) {
    try {
      const meshes=await importModel(config.file);
      if(!meshes.length) continue;
      let min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
      for(const m of meshes){
        m.computeWorldMatrix(true);
        const b=m.getBoundingInfo().boundingBox;
        min=Vector3.Minimize(min,b.minimumWorld);max=Vector3.Maximize(max,b.maximumWorld);
        m.isPickable=true; // enable geometric pointer picking for team labels
        m.receiveShadows=true;
        shadows.addShadowCaster(m);
        // Detail shadow casters are assigned only for the selected team.
      }
      if (config.id === "carabell") for (const mesh of meshes) originalTeamMaterials.set(mesh, mesh.material);
      addMask(meshes,"spot");
      if (config.id === "carabell") for (const mesh of meshes) maskedTeamMaterials.set(mesh, mesh.material);
      const center=min.add(max).scale(.5);
      const radius=max.subtract(min).length()*.5;
      const loadedTeam: LoadedTeam = {config,meshes,center,radius};
      teamData.push(loadedTeam);
      for (const mesh of meshes) teamByMesh.set(mesh, loadedTeam);
    } catch(e){console.error("TEAM FAILED:",config.file,e);}
  }

  // billboard: separate luminous surface, ready for later animated content.
  try {
    const billboards = await importModel(SETTINGS.billboardFile);
billboardMeshes = billboards;
lastBillboardEnabled = null;
addMask(billboards, "spot");

for (const m of billboards) {
  m.isPickable = false;
  m.receiveShadows = false;
}
  }catch(e){console.error("BILLBOARD FAILED:",e);}

  const roofMeshes:Mesh[]=[];
  for(const file of [SETTINGS.roofFile,SETTINGS.columnsFile]){
    try {
      const meshes=await importModel(file);
      roofMeshes.push(...meshes);
      if (file === SETTINGS.roofFile) roofDetailMeshes.push(...meshes);
      else columnDetailMeshes.push(...meshes);
      addMask(meshes, file === SETTINGS.roofFile ? "roof" : "columns");
      for(const m of meshes){
        m.isPickable=false;
        m.receiveShadows=true;
        shadows.addShadowCaster(m);
        // The architectural spotlight illuminates the selected house, not the roof above it.
        detailSpot.excludedMeshes.push(m);
      }
    }catch(e){console.error("INTRO PART FAILED:",file,e);}
  }
  statusLine.style.display="none";
  await whenVisible();
  introFinished=!SETTINGS.introEnabled || !!options.reducedMotion;
  if(introFinished){wipeProgress=1;introText.style.display="none";for(const m of roofMeshes)m.setEnabled(false);}
  else {
    // Wait, then sweep 0 -> 1; the mask reveals the stadium without camera motion.
    const start=performance.now()+SETTINGS.introHoldMs;
    const tick=()=>{
      const t=Math.min(1,Math.max(0,(performance.now()-start)/SETTINGS.introWipeMs));
      wipeProgress=t*t*(3-2*t);
      if(t<1) requestAnimationFrame(tick);
      else {introFinished=true;introText.style.display="none";for(const m of roofMeshes)m.setEnabled(false);}
    };
    requestAnimationFrame(tick);
  }
  
}

// The spotlight follows the intersection of the pointer ray with the horizontal
// plane of the stadium. It is a WORLD-SPACE circle, not a 2D screen overlay.
function updatePointerPosition() {
  // Lock the reveal spotlight to the selected house throughout the close-up.
  if (detailMode && selectedDetailTeam) {
    spotlightCenter.copyFrom(selectedDetailTeam.center);
    spotlightActive = true;
    return;
  }
  if(!pointerInside || !introFinished){spotlightActive=false;return;}
  const ray=scene.createPickingRay(pointer.x,pointer.y,null,camera);
  const planeY=stadiumCenter.y;
  if(Math.abs(ray.direction.y)<1e-6){spotlightActive=false;return;}
  const t=(planeY-ray.origin.y)/ray.direction.y;
  if(t<=0){spotlightActive=false;return;}
  worldPointer.copyFrom(ray.origin.add(ray.direction.scale(t)));
  spotlightCenter.copyFrom(worldPointer);
  spotlightActive=true;
}
// Picking is independent of the spotlight proximity used for team outlines.
function getHoveredTeam(): LoadedTeam | null {
  if (detailMode || cameraTransition) return null;
  if (!pointerInside || !introFinished) return null;
  const hit = scene.pick(
    pointer.x,
    pointer.y,
    mesh => teamByMesh.has(mesh as Mesh)
  );
  if (!hit?.hit || !hit.pickedMesh) return null;
  return teamByMesh.get(hit.pickedMesh as Mesh) ?? null;
}

function updateTeamHighlight(dt:number) {
  let nearest: LoadedTeam | null = null;
  let best = Infinity;
  if (!detailMode && spotlightActive) for (const team of teamData) {
    const dx = team.center.x - spotlightCenter.x;
    const dz = team.center.z - spotlightCenter.z;
    const dist = Math.hypot(dx, dz);
    if (dist < SETTINGS.spotlightRadius * SETTINGS.triggerRadiusMultiplier + team.radius && dist < best) {
      nearest = team;
      best = dist;
    }
  }

  // Only spotlight proximity controls the team outline.
  if (nearest !== activeTeam) {
    if (activeTeam) for (const mesh of activeTeam.meshes) {
      glow.removeMesh(mesh);
      mesh.renderOutline = false;
    }
    activeTeam = nearest;
    if (activeTeam) {
      const color = Color3.FromHexString(activeTeam.config.color);
      for (const mesh of activeTeam.meshes) {
        mesh.outlineColor = color;
        mesh.outlineWidth = 0.08;
        mesh.renderOutline = true;
      }
    }
    currentGlowStrength = 0;
    if (activeTeam) {
      const glowColor = Color3.FromHexString(activeTeam.config.color).scale(2.5);
      for (const mesh of activeTeam.meshes) glow.addMesh(mesh, glowColor);
    }
  }

  desiredGlowStrength = activeTeam ? 1 : 0;
  const speed = dt / Math.max(.001, desiredGlowStrength ? SETTINGS.teamGlowFadeIn : SETTINGS.teamGlowFadeOut);
  currentGlowStrength += (desiredGlowStrength - currentGlowStrength) * Math.min(1, speed);
  glow.blurHorizontalSize = 2 + currentGlowStrength * 2;
  glow.blurVerticalSize = 2 + currentGlowStrength * 2;

  // Re-evaluate picking every frame because the camera rotates even with a still pointer.
  const hoveredTeam = getHoveredTeam();
  teamLabel.style.display = hoveredTeam ? "block" : "none";
  if (hoveredTeam) {
    teamLabel.textContent = [
      hoveredTeam.config.name.toUpperCase(),
      hoveredTeam.config.country,
      hoveredTeam.config.info
    ].filter(Boolean).join(" · ");
    const rect = canvas.getBoundingClientRect();
    const box = layout.getBoundingClientRect();
    teamLabel.style.left = (rect.left - box.left + pointer.x + 18) + "px";
    teamLabel.style.top = (rect.top - box.top + pointer.y + 18) + "px";
  }
  canvas.style.cursor = hoveredTeam ? "pointer" : "default";
  const shownTeam = selectedDetailTeam ?? hoveredTeam;
  selectedName.textContent = shownTeam?.config.name.toUpperCase() ?? "EXPLORE THE TEAMS";
  selectedMeta.textContent = shownTeam
    ? [shownTeam.config.country, shownTeam.config.info].filter(Boolean).join(" · ") || "Football club"
    : "Move the cursor over the stadium";
}
// Smooth projection morph: interpolate the projection matrices over the same 1.8s.
// At both ends the camera uses Babylon's native projection (no frozen matrix).
function updateProjectionMorph(blend: number) {
  projectionBlend = Math.max(0, Math.min(1, blend));
  camera.unfreezeProjectionMatrix();
  if (projectionBlend <= 0.0001) {
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    return;
  }
  if (projectionBlend >= 0.9999) {
    camera.mode = Camera.PERSPECTIVE_CAMERA;
    return;
  }
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  const ortho = camera.getProjectionMatrix(true).clone();
  camera.mode = Camera.PERSPECTIVE_CAMERA;
  const perspective = camera.getProjectionMatrix(true).clone();
  camera.freezeProjectionMatrix(Matrix.Lerp(ortho, perspective, projectionBlend));
}

// Flight ends on the radial line connecting the centre of the pitch to the house.
// The house is viewed from the pitch side, not from the overhead overview direction.
function animateCamera(to: {alpha:number;beta:number;radius:number;height:number;target:Vector3}, onComplete?:()=>void) {
  const endPosition = new Vector3(
    to.target.x + Math.cos(to.alpha) * Math.sin(to.beta) * to.radius,
    to.target.y + Math.cos(to.beta) * to.radius,
    to.target.z + Math.sin(to.alpha) * Math.sin(to.beta) * to.radius
  );
  // No forced waypoint over the pitch: it caused the initial visual pull-back.
  const delta = Math.atan2(Math.sin(to.alpha-camera.alpha), Math.cos(to.alpha-camera.alpha));
  cameraTransition = {
    elapsed:0, duration:SETTINGS.teamTransitionSeconds,
    fromAlpha:camera.alpha, toAlpha:camera.alpha+delta,
    fromBeta:camera.beta, toBeta:to.beta,
    fromRadius:camera.radius, toRadius:to.radius,
    fromHeight:currentOrthoHalfHeight, toHeight:to.height,
    fromTarget:camera.target.clone(), toTarget:to.target.clone(),
    fromPosition:camera.position.clone(), toPosition:endPosition,
    fromProjectionBlend:projectionBlend,
    toProjectionBlend:returningToOverview ? 0 : 1,
    onComplete
  };
}
function updateCameraTransition(dt:number) {
  const a = cameraTransition;
  if (!a) return;
  a.elapsed += dt;
  const t = Math.min(1,a.elapsed/a.duration);
  const k = t*t*(3-2*t);
  const mix=(x:number,y:number)=>x+(y-x)*k;
  // Direct eased flight; position and target use the same parameter.
  const position = Vector3.Lerp(a.fromPosition, a.toPosition, k);
  const target = Vector3.Lerp(a.fromTarget, a.toTarget, k);
  camera.setTarget(target);
  camera.setPosition(position);
  currentOrthoHalfHeight = mix(a.fromHeight,a.toHeight);
  updateOrtho();
  // Match the perspective frustum to the current orthographic vertical scale
  // BEFORE mixing matrices. Prevents apparent zoom-out as projection changes.
  const distance = Math.max(0.01, Vector3.Distance(position, target));
  camera.fov = Math.max(0.05, Math.min(2.5, 2 * Math.atan(currentOrthoHalfHeight / distance)));
  // Smoother quintic easing for projection, with zero velocity and acceleration at endpoints.
  const projectionEase = k*k*k*(k*(k*6-15)+10);
  updateProjectionMorph(a.fromProjectionBlend + (a.toProjectionBlend-a.fromProjectionBlend)*projectionEase);
  if(t>=1){ cameraTransition=null; a.onComplete?.(); }
}

const backButton=document.createElement("button");
backButton.textContent = bare ? "Back to stadium" : "← BACK TO STADIUM";
backButton.type = "button";
backButton.style.cssText="position:absolute;top:24px;right:24px;z-index:1001;display:none;padding:12px 18px;background:#050a12e8;color:#a7efff;border:1px solid #29647a;border-radius:6px;font:600 13px Arial;letter-spacing:.1em;cursor:pointer";
if (bare) {
  backButton.style.cssText = "display:none";
  teamLink.textContent = "Open club page";
  actions.append(backButton, teamLink);
} else {
  layout.appendChild(backButton);
}

// One diagnostic switch: isolate the house spotlight from all other lighting.
// Only visible during close-up; it never changes the overview.
const lightingPanel = document.createElement("div");
lightingPanel.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:1002;display:none;padding:10px;background:#050a12e8;border:1px solid #29647a;border-radius:7px;color:#bcefff;font:12px Arial";
const spotlightTestButton = document.createElement("button");
spotlightTestButton.textContent = "Только прожектор: ВЫКЛ";
spotlightTestButton.style.cssText = "padding:8px 12px;background:#132330;color:#bcefff;border:1px solid #29647a;border-radius:4px;cursor:pointer";
spotlightTestButton.addEventListener("click", () => {
  spotlightOnlyTest = !spotlightOnlyTest;
  spotlightTestButton.textContent = spotlightOnlyTest
    ? "Только прожектор: ВКЛ" : "Только прожектор: ВЫКЛ";
  spotlightTestButton.style.background = spotlightOnlyTest ? "#27657c" : "#132330";
  debugLamp.setEnabled(spotlightOnlyTest && detailMode);
  debugTarget.setEnabled(spotlightOnlyTest && detailMode);
  debugSpotInfo.style.display = spotlightOnlyTest ? "block" : "none";
});
// Diagnostic objects use emissive and diffuse materials to separate geometry
// visibility from the actual Babylon spotlight illumination.
const debugLampMaterial = new StandardMaterial("debugLampEmissive", scene);
debugLampMaterial.disableLighting = true;
debugLampMaterial.emissiveColor = new Color3(1, 0.25, 0.08);
const debugLamp = CreateSphere("DEBUG_spot_source", { diameter: 2.2, segments: 12 }, scene);
debugLamp.material = debugLampMaterial;
debugLamp.isPickable = false;
debugLamp.setEnabled(false);
const debugTargetMaterial = new StandardMaterial("debugSpotTargetLit", scene);
debugTargetMaterial.diffuseColor = new Color3(1, 1, 1);
debugTargetMaterial.specularColor = new Color3(0, 0, 0);
const debugTarget = CreateSphere("DEBUG_spot_target", { diameter: 3, segments: 16 }, scene);
debugTarget.material = debugTargetMaterial;
debugTarget.isPickable = false;
debugTarget.receiveShadows = false;
debugTarget.setEnabled(false);
const debugSpotInfo = document.createElement("div");
debugSpotInfo.style.cssText = "margin-top:8px;max-width:320px;white-space:pre-line;line-height:1.45;color:#fff;font:12px monospace";
lightingPanel.appendChild(debugSpotInfo);
debugSpotInfo.style.display = "none";
lightingPanel.appendChild(spotlightTestButton);
const materialDiagnosticControls = document.createElement("div");
materialDiagnosticControls.style.cssText = "margin-top:10px;display:flex;gap:5px;flex-wrap:wrap";
const materialDiagnosticStatus = document.createElement("div");
materialDiagnosticStatus.style.cssText = "margin-top:7px;max-width:330px;line-height:1.4";
for (const [mode, label] of [
  ["masked", "1 · С маской"],
  ["original", "2 · Оригинал GLB"],
  ["standard", "3 · StandardMaterial"],
] as const) {
  const button = document.createElement("button");
  button.textContent = label;
  button.style.cssText = "padding:7px;background:#132330;color:#bcefff;border:1px solid #29647a;border-radius:4px;cursor:pointer";
  button.addEventListener("click", () => { materialDiagnosticMode = mode; applyMaterialDiagnostic(); });
  materialDiagnosticControls.appendChild(button);
}
lightingPanel.appendChild(materialDiagnosticControls);
lightingPanel.appendChild(materialDiagnosticStatus);


function openTeam(team:LoadedTeam) {
  if(detailMode || cameraTransition) return;
  savedOverview={alpha:camera.alpha,beta:camera.beta,radius:camera.radius,height:currentOrthoHalfHeight,target:camera.target.clone()};
  detailMode=true;
  // The circular aperture shrinks from 50% to 42% of the viewport width during the flight.
  viewport.classList.add("tribuneDetail");
  selectedDetailTeam=team;
  returningToOverview=false;
  // Spotlight shadows must not render all ten houses for one close-up.
  const spotCasters = detailSpotShadows.getShadowMap()?.renderList;
  if (spotCasters) {
    spotCasters.length = 0;
    for (const mesh of team.meshes) spotCasters.push(mesh);
  }
  // Keep the roof loaded; its shader fades it in as detailBlend increases.
  for (const mesh of [...roofDetailMeshes, ...columnDetailMeshes]) mesh.setEnabled(true);
  spotlightCenter.copyFrom(team.center);
  spotlightActive=true;
  teamLabel.style.display="none";
  backButton.style.display = bare ? "" : "block";
  actions.classList.add("isOpen");
  const href = options.teamHref?.(team.config.id) ?? null;
  teamLink.style.display = href ? (bare ? "" : "inline-block") : "none";
  if (href) teamLink.href = href;
  materialDiagnosticMode = "masked";
  // Restore the original Carabell camera geometry for EVERY house:
  // position lies toward the pitch, just above the HOUSE centre (not pitch level).
  const towardPitch = stadiumCenter.subtract(team.center);
  towardPitch.y = 0;
  if (towardPitch.lengthSquared() > 0.001) towardPitch.normalize();
  else towardPitch.set(0, 0, 1);
  const aspect = engine.getRenderWidth() / Math.max(1, engine.getRenderHeight());
  const halfVerticalFov = SETTINGS.teamCameraFov * 0.5;
  const halfHorizontalFov = Math.atan(Math.tan(halfVerticalFov) * aspect);
  // Separate horizontal and vertical fit limits are applied below.
  // Preserve 35-unit framing for ordinary houses; enlarge distance only if necessary.
  // Framing is calculated below from the house bounding box.
  // Rotate the radial direction slightly so the architecture has visible depth.
  const sideAngle = SETTINGS.detailCameraSideAngleDegrees * Math.PI / 180;
  const rotatedDirection = new Vector3(
    towardPitch.x * Math.cos(sideAngle) - towardPitch.z * Math.sin(sideAngle),
    0,
    towardPitch.x * Math.sin(sideAngle) + towardPitch.z * Math.cos(sideAngle)
  );
  // Use the actual vertical bounding-box extent, not the bounding sphere alone.
  let minHouseY = Infinity, maxHouseY = -Infinity;
  for (const mesh of team.meshes) {
    mesh.computeWorldMatrix(true);
    const bounds = mesh.getBoundingInfo().boundingBox;
    minHouseY = Math.min(minHouseY, bounds.minimumWorld.y);
    maxHouseY = Math.max(maxHouseY, bounds.maximumWorld.y);
  }
  const houseHeight = Math.max(1, maxHouseY - minHouseY);
  const fitHeightDistance = houseHeight / (2 * Math.tan(halfVerticalFov) * SETTINGS.detailHouseFrameFraction);
  const fitWidthDistance = team.radius / Math.max(0.1, Math.sin(halfHorizontalFov)) * 0.90;
  const framedDistance = Math.max(SETTINGS.teamCameraPreferredDistance * 0.6, fitHeightDistance, fitWidthDistance);
  const eye = team.center.add(rotatedDirection.scale(framedDistance));
  eye.y = team.center.y + SETTINGS.teamCameraHeightOffset;
  const offset = eye.subtract(team.center);
  const radius = offset.length();
  const beta = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));
  const alpha = Math.atan2(offset.z, offset.x);
  const height = radius * Math.tan(halfVerticalFov);
  animateCamera({alpha, beta, radius, height, target:team.center}, enableFreeDetailCamera);
}
function closeTeam() {
  if(!detailMode || !savedOverview) return;
  const previous=savedOverview;
  disableFreeDetailCamera();
  materialDiagnosticMode = "masked";
  applyMaterialDiagnostic();
  returningToOverview=true;
  // Expand the circular aperture back to 50% of the viewport width during return.
  viewport.classList.remove("tribuneDetail");
  backButton.style.display="none";
  teamLink.style.display="none";
  actions.classList.remove("isOpen");
  debugLamp.setEnabled(false);
  debugTarget.setEnabled(false);
  animateCamera(previous,()=>{
    detailMode=false; selectedDetailTeam=null; savedOverview=null; returningToOverview=false;
    for (const mesh of [...roofDetailMeshes, ...columnDetailMeshes]) mesh.setEnabled(false);
  });
}
// TEMPORARY DETAIL CAMERA DEBUG: orbit, pan, zoom and fly around the house.
// Controls are enabled ONLY after the 1.8-second close-up flight completes.
let freeDetailCamera = false;
const freeMoveKeys = new Set<string>();
const freeCameraHelp = document.createElement("div");
freeCameraHelp.textContent = "КАМЕРА: ЛКМ — вращение · ПКМ — панорама · колесо — масштаб · WASD — движение · Q/E — вниз/вверх";
freeCameraHelp.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:1003;display:none;padding:9px 13px;background:#050a12dc;border:1px solid #29647a;border-radius:6px;color:#bcefff;font:12px Arial;pointer-events:none;white-space:nowrap";

function enableFreeDetailCamera() {
  if (!detailMode || returningToOverview || cameraTransition || freeDetailCamera) return;
  freeDetailCamera = true;
  camera.lowerRadiusLimit = 1;
  camera.upperRadiusLimit = 1000;
  camera.lowerBetaLimit = 0.05;
  camera.upperBetaLimit = Math.PI - 0.05;
  camera.wheelPrecision = 25;
  camera.panningSensibility = 120;
  camera.angularSensibilityX = 1100;
  camera.angularSensibilityY = 1100;
  camera.attachControl(canvas, true);
}
function disableFreeDetailCamera() {
  freeDetailCamera = false;
  freeMoveKeys.clear();
  camera.detachControl();
  freeCameraHelp.style.display = "none";
}
window.addEventListener("keydown", e => {
  if (!freeDetailCamera || e.altKey || e.ctrlKey || e.metaKey) return;
  const key = e.key.toLowerCase();
  if (["w","a","s","d","q","e"].includes(key)) {
    freeMoveKeys.add(key);
    e.preventDefault();
  }
});
window.addEventListener("keyup", e => freeMoveKeys.delete(e.key.toLowerCase()));
window.addEventListener("blur", () => freeMoveKeys.clear());
function updateFreeDetailCamera(dt: number) {
  if (!freeDetailCamera || cameraTransition) return;
  // Translate the camera AND its target, preserving the current view direction.
  const forward = camera.target.subtract(camera.position);
  forward.y = 0;
  if (forward.lengthSquared() < 1e-6) return;
  forward.normalize();
  const right = new Vector3(-forward.z, 0, forward.x);
  const delta = Vector3.Zero();
  if (freeMoveKeys.has("w")) delta.addInPlace(forward);
  if (freeMoveKeys.has("s")) delta.subtractInPlace(forward);
  if (freeMoveKeys.has("d")) delta.addInPlace(right);
  if (freeMoveKeys.has("a")) delta.subtractInPlace(right);
  if (freeMoveKeys.has("e")) delta.y += 1;
  if (freeMoveKeys.has("q")) delta.y -= 1;
  if (delta.lengthSquared() < 1e-6) return;
  delta.normalize().scaleInPlace(18 * dt);
  camera.setTarget(camera.target.add(delta));
  camera.setPosition(camera.position.add(delta));
}

// The side list reuses the same guided camera transition as clicking a house.
for (const config of TEAMS) {
  const button = document.createElement("button");
  button.className = "tribuneTeamButton";
  button.textContent = config.name;
  button.addEventListener("click", () => {
    if (detailMode || cameraTransition || !introFinished) return;
    const team = teamData.find(t => t.config.id === config.id);
    if (team) openTeam(team);
  });
  teamList.appendChild(button);
}
backButton.addEventListener("click",closeTeam);

canvas.addEventListener("pointermove", e => {
  const rect = canvas.getBoundingClientRect();

  pointer.set(
    (e.clientX - rect.left) * canvas.clientWidth / rect.width,
    (e.clientY - rect.top) * canvas.clientHeight / rect.height
  );

  pointerInside = true;
});
canvas.addEventListener("pointerleave",()=>{pointerInside=false;teamLabel.style.display="none";});
canvas.addEventListener("click",()=>{
  const clickedTeam = getHoveredTeam();
  if(clickedTeam) openTeam(clickedTeam);
});

const fpsCounter=document.createElement("div");
fpsCounter.style.cssText="position:fixed;top:16px;left:16px;padding:8px 12px;background:#0009;color:#66ffaa;font:14px monospace;pointer-events:none;z-index:100";

let lastBillboardEnabled: boolean | null = null;
let lastAppliedDiagnosticMode = "";
let lastAppliedDiagnosticActive = false;
let last=performance.now();
// Lightweight, always-visible diagnostics during flight (no Inspector required).
const flightStats = document.createElement("div");
flightStats.style.cssText = "position:fixed;left:16px;top:54px;z-index:1100;background:#050a12dd;color:#a8f3ff;padding:8px 10px;border:1px solid #29647a;border-radius:5px;font:12px monospace;pointer-events:none;display:none";

const frame = ()=>{
  const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
  // Orbit the camera slowly around the stadium after the intro.
  if (introFinished && !detailMode && !cameraTransition) camera.alpha += SETTINGS.cameraRotationDegreesPerSecond * Math.PI / 180 * dt;
  updateCameraTransition(dt);
  updateFreeDetailCamera(dt);
  // Smoothstep blends visual modes in sync with the camera animation.
  if (cameraTransition) {
    const t = Math.min(1, cameraTransition.elapsed / cameraTransition.duration);
    const smooth = t * t * (3 - 2 * t);
    detailBlend = returningToOverview ? (1 - smooth) : smooth;
  } else {
    detailBlend = detailMode ? 1 : 0;
  }
  updatePointerPosition();
  // Diagnostic spotlight-only mode disables all other direct/fill light.
  // Low-resolution spotlight shadows are enabled only after the camera flight.
  sun.shadowEnabled = false;
  // Shadow-map rendering is a likely transition bottleneck: delay it until
  // the flight completes. The selected house alone casts spotlight shadows.
  detailSpot.shadowEnabled = SETTINGS.detailShadowsEnabled && !spotlightOnlyTest &&
    detailBlend > 0.001 && !returningToOverview &&
    (SETTINGS.detailShadowsDuringFlight || !cameraTransition);
  const detailSun = spotlightOnlyTest ? 0 : SETTINGS.detailSunIntensity;
  const detailAmbient = spotlightOnlyTest ? 0 : SETTINGS.detailAmbientIntensity;
  const detailEnvironment = spotlightOnlyTest ? 0 : SETTINGS.detailEnvironmentIntensity;
  sun.intensity = overviewSunIntensity + (detailSun - overviewSunIntensity) * detailBlend;
  ambient.intensity = overviewAmbientIntensity + (detailAmbient - overviewAmbientIntensity) * detailBlend;
  scene.environmentIntensity = overviewEnvironmentIntensity + (detailEnvironment - overviewEnvironmentIntensity) * detailBlend;
  // Restore original tone/contrast/curves as the camera enters architectural view.
  // ACES is enabled for detail only; exposure and contrast blend continuously.
  // Delay the abrupt ACES switch until the close-up is mostly revealed.
  imageProcessing.toneMappingEnabled = detailBlend > 0.90;
  imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
  imageProcessing.exposure = overviewExposure + (SETTINGS.detailExposure - overviewExposure) * detailBlend;
  imageProcessing.contrast = overviewContrast + (SETTINGS.detailContrast - overviewContrast) * detailBlend;
  imageProcessing.colorCurvesEnabled = detailBlend > 0.98;
  // Aerial perspective is used only for the realistic close-up.
  // Avoid switching fog shader variants at the start of the camera flight.
  scene.fogMode = detailBlend > 0.90 ? Scene.FOGMODE_EXP2 : Scene.FOGMODE_NONE;
  scene.fogDensity = SETTINGS.detailFogDensity * Math.max(0, (detailBlend - 0.90) / 0.10);
  // Keep a focused light on the chosen house. Fade it together with the camera transition.
  detailSpot.intensity = (spotlightOnlyTest ? 100 : SETTINGS.detailSpotIntensity) * detailBlend;
  if (selectedDetailTeam) {
    const center = selectedDetailTeam.center;
    // Place the actual Babylon SpotLight over the middle of the PITCH,
    // not over the roof and not behind the selected house.
    const lightPosition = new Vector3(
      stadiumCenter.x,
      pitchGroundY + SETTINGS.detailSpotHeightAbovePitch,
      stadiumCenter.z
    );
    // DIAGNOSTIC ONLY: move the lamp close to the house and make the cone wide.
    // Keep the existing cinematic spotlight exactly as it was when test is OFF.
    const towardPitch = stadiumCenter.subtract(center);
    towardPitch.y = 0;
    if (towardPitch.lengthSquared() < 0.0001) towardPitch.set(0, 0, 1);
    towardPitch.normalize();
    if (spotlightOnlyTest) {
      lightPosition.copyFrom(center.add(towardPitch.scale(SETTINGS.debugSpotDistanceFromHouse)));
      lightPosition.y = center.y + SETTINGS.debugSpotHeightAboveHouse;
    }
    detailSpot.position.copyFrom(lightPosition);
    detailSpot.direction.copyFrom(center.subtract(lightPosition).normalize());

    const beamDistance = Vector3.Distance(lightPosition, center);
    const halfWidth = selectedDetailTeam.radius * SETTINGS.detailSpotFocusMargin;
    const targetAngle = Math.max(
      SETTINGS.detailSpotMinAngle,
      Math.min(SETTINGS.detailSpotMaxAngle, 2 * Math.atan2(halfWidth, beamDistance))
    );
    const easedFocus = detailBlend * detailBlend * (3 - 2 * detailBlend);
    detailSpot.angle = spotlightOnlyTest ? 2.4 :
      SETTINGS.detailSpotAngle + (targetAngle - SETTINGS.detailSpotAngle) * easedFocus;
    detailSpot.range = spotlightOnlyTest ? 1000 :
      Math.max(250, beamDistance + selectedDetailTeam.radius * 3);
    if (spotlightOnlyTest) {
      debugLamp.position.copyFrom(lightPosition);
      debugTarget.position.copyFrom(center.add(towardPitch.scale(Math.max(5, selectedDetailTeam.radius * 0.65))));
      debugTarget.position.y = center.y + 2;
      debugSpotInfo.textContent =
        `Источник (оранжевый): ${lightPosition.x.toFixed(1)}, ${lightPosition.y.toFixed(1)}, ${lightPosition.z.toFixed(1)}\n` +
        `Дом: ${center.x.toFixed(1)}, ${center.y.toFixed(1)}, ${center.z.toFixed(1)}\n` +
        `Дистанция: ${beamDistance.toFixed(1)} · Угол: ${detailSpot.angle.toFixed(2)} rad\n` +
        `Белая сфера должна освещаться прожектором. Оранжевая светится сама.`;
    }

  }
  revealOutlineMaterial.setVector3("spotCenter", spotlightCenter);
  revealOutlineMaterial.setFloat("detailBlend", detailBlend);
  revealOutlineMaterial.setFloat("spotRadius", spotlightActive ? SETTINGS.spotlightRadius : -1);
  const billboardEnabled = detailMode || spotlightActive;
  if (billboardEnabled !== lastBillboardEnabled) {
    for (const mesh of billboardMeshes) mesh.setEnabled(billboardEnabled);
    lastBillboardEnabled = billboardEnabled;
  }
  updateTeamHighlight(dt);
  // Apply only when the active test/transition changes (no shader rebuild each frame).
  if (lastAppliedDiagnosticMode !== materialDiagnosticMode || lastAppliedDiagnosticActive !== (detailMode && !returningToOverview && !cameraTransition && selectedDetailTeam?.config.id === "carabell")) {
    applyMaterialDiagnostic();
    lastAppliedDiagnosticMode = materialDiagnosticMode;
    lastAppliedDiagnosticActive = !!(detailMode && !returningToOverview && !cameraTransition && selectedDetailTeam?.config.id === "carabell");
  }
  scene.render();
};
// Render only while the stadium is on screen and the tab is visible.
let onScreen = false;
let running = false;
const visibleWaiters: Array<() => void> = [];
const whenVisible = () => new Promise<void>(resolve => onScreen ? resolve() : visibleWaiters.push(resolve));
const syncLoop = () => {
  const shouldRun = onScreen && !document.hidden;
  if (shouldRun && !running) { last = performance.now(); engine.runRenderLoop(frame); running = true; }
  if (!shouldRun && running) { engine.stopRenderLoop(frame); running = false; }
};
const visibility = new IntersectionObserver(entries => {
  onScreen = entries.some(e => e.isIntersecting);
  if (onScreen) visibleWaiters.splice(0).forEach(r => r());
  syncLoop();
}, { threshold: 0.05 });
visibility.observe(root);
document.addEventListener("visibilitychange", syncLoop);
const onKeyEscape = (e: KeyboardEvent) => { if (e.key === "Escape") closeTeam(); };
window.addEventListener("keydown", onKeyEscape);
function dispose() {
  visibility.disconnect();
  document.removeEventListener("visibilitychange", syncLoop);
  window.removeEventListener("keydown", onKeyEscape);
  window.removeEventListener("resize", resizeViewport);
  engine.stopRenderLoop();
  engine.dispose();
  layout.remove();
}
void loadWorld().then(() => {
  // Reapply after all GLBs and MaskPlugin material clones have been created.
  scene.materials.forEach(forceStandardLightFalloff);
  
});

  return { dispose };
}
