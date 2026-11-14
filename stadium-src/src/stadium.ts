// Embedded build of the Tribune stadium MVP (tribune-web/src/main.ts, 13.11.2026).
// Scene, materials, lighting, adaptive resolution and models are the author's, unchanged.
// Only the embedding is adapted: mount into a given element instead of <body>,
// configurable asset URLs, no page-level styles, site-style controls, render pause off-screen.
// Deep imports keep the bundle to the parts of Babylon this scene uses.
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
import { Material } from "@babylonjs/core/Materials/material";
import { MaterialPluginBase } from "@babylonjs/core/Materials/materialPluginBase";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { UniformBuffer } from "@babylonjs/core/Materials/uniformBuffer";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { SubMesh } from "@babylonjs/core/Meshes/subMesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { MeshoptCompression } from "@babylonjs/core/Meshes/Compression/meshoptCompression";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import type { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import "@babylonjs/core/assetContainer";
// Side-effect modules the scene relies on (picking, glow, shadows, .env, glTF).
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Rendering/outlineRenderer";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
// Texture registers itself as a side effect; glTF materials (e.g. field.glb) need it before loading.
import "@babylonjs/core/Materials/Textures/texture";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/loaders/glTF/2.0";
import { logBenchmarkReadiness, PerformanceBenchmark } from "./diagnostics/performanceBenchmark";

export type StadiumOptions = {
  /** Folder with the GLB files, ending with "/". */
  modelsUrl: string;
  /** Prefiltered environment (.env) used for reflections. */
  envUrl: string;
  /** Self-hosted meshoptimizer decoder, used only if a GLB is meshopt-compressed. */
  meshoptDecoderUrl: string;
  /** Link for a team page, or null when the team has no page yet. */
  teamHref?: (teamId: string) => string | null;
  /** Kept for API compatibility (the MVP intro is disabled). */
  reducedMotion?: boolean;
  /** Side column (team list). Off = the model alone, for embedding. Default: true. */
  panels?: boolean;
  /** Overview clay tone, linear RGB 0..1. Default: the MVP graphite blue [0.087, 0.114, 0.180]. */
  overviewTint?: [number, number, number];
  /** Field line colour, linear RGB (values above 1 glow). Default: white [1.25, 1.25, 1.25]. */
  fieldLineTint?: [number, number, number];
  /** Hardware scaling (Babylon): >1 = fewer pixels. Default 1.25 (MVP). The site passes 1/devicePixelRatio for a crisp Retina image; adaptive resolution still lowers it when FPS drops. */
  hardwareScaling?: number;
  /** Overview clay brightness in shadow and in full light, e.g. [0.65, 1.3] (MVP default). A wider range reads as more volume. */
  overviewShading?: [number, number];
  /** Brightness of side faces vs faces turned up, e.g. [0.45, 1.15]. Default [1, 1] = off (MVP look). */
  overviewFacets?: [number, number];
  /** Soft light sweep across the stadium: brightness range from the shadow side to the lit side, an added colour on the lit side (linear RGB), sweep direction in world XZ and its half-width in world units. Default: off. */
  overviewSheen?: { color: [number, number, number]; range: [number, number]; direction: [number, number]; radius: number };
  /** Camera zoom-out of the overview: 1 = MVP framing, 1.1 = 10% more scene around the stadium. */
  overviewZoomOut?: number;
  /** Folder with light copies of the team houses (small textures) for the first view. When set, houses
   *  load from here and the full textures are swapped in when a house is opened. Default: off. */
  liteModelsUrl?: string;
};
export type StadiumHandle = { dispose: () => void };

export function mountStadium(root: HTMLElement, options: StadiumOptions): StadiumHandle {
MeshoptCompression.Configuration = { decoder: { url: options.meshoptDecoderUrl } };
// GLSL literal for the overview clay tone (see StadiumOptions.overviewTint).
const OVERVIEW_TINT = (options.overviewTint ?? [0.087, 0.114, 0.180]).map((v) => v.toFixed(4)).join(", ");
const BASE_SCALE = options.hardwareScaling ?? 1.25;
// Shadow/light range of the overview clay (see StadiumOptions.overviewShading).
// Facet shading of the overview clay: brightness of side faces vs top faces (see overviewFacets).
const FACET_SHADING = (options.overviewFacets ?? [1, 1]).map((v) => v.toFixed(4)).join(", ");
// Light sweep over the overview clay (see StadiumOptions.overviewSheen). Default: off.
const SHEEN = options.overviewSheen ?? { color: [0, 0, 0], range: [1, 1], direction: [-1, -1], radius: 160 };
const glsl = (v: number[]) => v.map((x) => x.toFixed(4)).join(", ");
const SHEEN_COLOR = glsl(SHEEN.color), SHEEN_RANGE = glsl(SHEEN.range), SHEEN_DIR = glsl(SHEEN.direction), SHEEN_RADIUS = SHEEN.radius.toFixed(1);
const OVERVIEW_SHADING = (options.overviewShading ?? [0.65, 1.3]).map((v) => v.toFixed(4)).join(", ");
const FIELD_LINE_TINT = (options.fieldLineTint ?? [1.25, 1.25, 1.25]).map((v) => v.toFixed(4)).join(", ");
// TRIBUNE / AXONOMETRIC EDITION
// Models must exist in public/models/. All exported GLBs must share one origin and scale.
const SETTINGS = {
  stadiumFile: "stadium.glb", roofFile: "roof.glb", columnsFile: "columns.glb",
  fieldFile: "field.glb", billboardFile: "billboard.glb", blankFile: "blank_1.glb",
  background: "#2f3847",
  overviewShadeStrength: 0.97, // 0 = original GLB, 1 = full overview tint
  detailSurroundRadius: 48, // retained for reference; close-up now follows spotlight footprint // world-space radius of visible environment around the selected house
  detailSurroundFeather: 0.36, // retained for reference // fraction of radius used for soft edge
  spotlightRadius: 24, // world units; adjust to the stadium scale
  spotlightSoftness: 0.20, // softer reveal edge // fraction of radius
  triggerRadiusMultiplier: 1.35,
  teamGlowFadeIn: 0.12, teamGlowFadeOut: 0.30,
  introHoldMs: 900, introWipeMs: 2200,
  introEnabled: false, // no roof wipe: reveal the stadium immediately
  orthoHalfHeight: 140, cameraAlpha: -Math.PI / 2.8,
  cameraBeta: 0.55, cameraRadius: 450,
  cameraRotationDegreesPerSecond: 2.0, // full revolution in 3 minutes
  teamCameraBeta: 1.50, // nearly horizontal view from pitch level
  teamCameraFov: 0.75, // perspective field of view in radians
  teamCameraDistanceMultiplier: 3.4,
  teamTransitionSeconds: 1.8,
  // Transition profiling: disable costly detail shadow rendering while flying.
  detailShadowsDuringFlight: false,
  // V5: keep shader-affecting image-processing/fog features stable during flight.
  stableShaderFeatures: true,
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
  detailCameraLookUpDegrees: 5,
  teamCameraPreferredDistance: 35, // original Carabell framing; increase only for larger houses
  detailCameraSideAngleDegrees: -10, // reveal two facades, still approach from the pitch
  detailHouseFrameFraction: 0.72, // desired fraction of viewport height
  detailSunIntensity: 0.35, // ambient daylight only; spotlight is the key light
  detailAmbientIntensity: 0.55,
  detailEnvironmentIntensity: 0.40,
  detailExposure: 0.95,
  detailContrast: 1.40,
};

const TEAMS = [
  { id:"carabell", name:"Carabell Club", file:"Carabell.glb", country:"Philippines", info:"Football for Humanity", color:"#F23C38" },
  { id:"brave_eagles", name:"Brave Eagles", file:"brave_eagles.glb", country:"", info:"", color:"#FFB515" },
  { id:"dreamchasers", name:"Dreamchasers", file:"dreamchasers.glb", country:"", info:"", color:"#F58224" },
  { id:"ffk", name:"FFK", file:"ffk.glb", country:"", info:"", color:"#36C8F3" },
  { id:"firetails", name:"Firetails", file:"firetails.glb", country:"", info:"", color:"#F45B9C" },
  { id:"hanoman", name:"Hanoman", file:"hanoman.glb", country:"Indonesia", info:"Bali", color:"#FFD429" },
  { id:"lwf", name:"Life With Football", file:"lwf.glb", country:"Philippines", info:"Malabon", color:"#3477DF" },
  { id:"mathare", name:"Mathare", file:"mathare.glb", country:"", info:"", color:"#F6A521" },
  { id:"redwoods", name:"Red Woods", file:"redwoods.glb", country:"Philippines", info:"", color:"#CF352D" },
  { id:"we", name:"WE", file:"we.glb", country:"", info:"", color:"#8A59C6" },
];
type TeamConfig = typeof TEAMS[number];
type LoadedTeam = { config: TeamConfig; meshes: Mesh[]; center: Vector3; radius: number };

// TRIBUNE / SEAMLESS OVERVIEW -> CIRCULAR DETAIL
// Fill the available frame with the canvas; the circular aperture is sized from its width.
const diagnosticsEnabled = new URLSearchParams(window.location.search).get("diagnostics") === "1";
const STYLE_ID = "tribune-stadium-style";
const pageStyle = (document.getElementById(STYLE_ID) as HTMLStyleElement | null) ?? document.createElement("style");
pageStyle.id = STYLE_ID;
pageStyle.textContent = `
  #tribuneLayout { position:absolute; inset:0; display:grid; grid-template-columns:minmax(190px,1fr) minmax(0,1000px) minmax(190px,1fr); align-items:stretch; gap:clamp(12px,2.2vw,40px); padding:clamp(16px,3vw,48px); box-sizing:border-box; background:#2f3847; color:#d6e8ed; font-family:Arial,sans-serif; }
  #tribuneViewport { grid-column:2; width:100%; height:100%; min-height:0; max-width:100%; border-radius:0; clip-path:none; overflow:hidden; position:relative; justify-self:center; background:transparent; border:0; box-shadow:none; transition:none; }
  #tribuneViewport.tribuneDetail { clip-path:none; background:transparent; }
  #renderCanvas { position:absolute !important; inset:0 !important; display:block !important; width:100% !important; height:100% !important; max-width:none !important; max-height:none !important; border:0 !important; outline:0 !important; touch-action:none; }
  .tribuneSide { min-width:0; max-width:300px; display:flex; flex-direction:column; gap:18px; }
  #tribuneTeamList { display:flex; flex-wrap:wrap; gap:7px; }
  .tribuneTeamButton { border:1px solid #294857; color:#9bbbc7; background:#10202d; border-radius:4px; padding:7px 9px; font-size:11px; cursor:pointer; }
  .tribuneTeamButton:hover { color:#d7f9ff; border-color:#66c8db; }
  #tribuneRight { grid-column:3; }
  /* Embedded mode: only the model; controls float over the scene. */
  #tribuneLayout.tribuneBare { position:absolute; inset:0; min-height:0; grid-template-columns:1fr; padding:0; gap:0; }
  #tribuneLayout.tribuneBare .tribuneSide { display:none; }
  #tribuneLayout.tribuneBare #tribuneViewport { grid-column:1; width:100%; height:100%; }
  /* Site-style controls, centred at the bottom of the widget (embedded mode). */
  #tribuneLayout .tribuneActions { position:absolute; left:50%; bottom:24px; transform:translateX(-50%); z-index:5; display:none; gap:0; padding:4px; border-radius:1000px; background:rgba(255,255,255,.6); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
  #tribuneLayout .tribuneActions.isOpen { display:flex; }
  #tribuneLayout .tribuneActions > * { display:inline-flex; align-items:center; height:36px; padding:0 16px; border:0; border-radius:1000px; background:transparent; color:#17100e; font:450 14px/1.1 "Suisse Intl", system-ui, sans-serif; letter-spacing:0; text-decoration:none; white-space:nowrap; cursor:pointer; transition:background .2s, transform .15s; }
  #tribuneLayout .tribuneActions > *:hover { background:rgba(23,16,14,.05); }
  #tribuneLayout .tribuneActions > *:active { transform:scale(.97); }
  #tribuneLayout .tribuneActions > .tribuneTeamLink { background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.06); font-weight:600; }
  @media (max-width:950px) {
    #tribuneLayout { position:relative; min-height:100%; grid-template-columns:1fr; justify-items:center; padding:22px 16px 60px; gap:20px; }
    #tribuneViewport { grid-column:1; width:min(85vw, 650px); height:min(85vw, 650px); }
    .tribuneSide { max-width:min(85vw,650px); width:100%; }
    #tribuneRight { grid-column:1; }
  }
`;
if (!pageStyle.isConnected) document.head.appendChild(pageStyle);
const layout = document.createElement("main");
layout.id = "tribuneLayout";
layout.innerHTML = `
  <div id="tribuneViewport" aria-label="Interactive 3D stadium"></div>
  <section class="tribuneSide" id="tribuneRight">
    <div id="tribuneTeamList"></div>
  </section>`;
root.appendChild(layout);
const bare = options.panels === false;
if (bare) layout.classList.add("tribuneBare");
// Embedded mode: "Back to stadium" + "Open club page" share one pill at the bottom.
const actions = document.createElement("div");
actions.className = "tribuneActions";
const teamLink = document.createElement("a");
teamLink.className = "tribuneTeamLink";
teamLink.textContent = "Open club page";
teamLink.style.display = "none";

const viewport = document.getElementById("tribuneViewport")!;
const teamList = document.getElementById("tribuneTeamList")!;
const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
viewport.appendChild(canvas);
const engine = new Engine(canvas, true, { premultipliedAlpha: false });
// Larger hardware scaling = fewer physical pixels; 1.25 is a conservative starting point.
engine.setHardwareScalingLevel(BASE_SCALE);
// V9: conservative adaptive render resolution. Never changes geometry, materials,
// spotlight logic, or the camera. Hardware scaling > 1 means fewer render pixels.
const adaptiveResolution = {
  enabled: true,
  baseScale: BASE_SCALE,
  currentScale: BASE_SCALE,
  minScale: BASE_SCALE * 0.8,
  maxScale: BASE_SCALE * 1.6,
  targetFPS: 45,
  samples: [] as number[],
  lastAdjustment: performance.now(),
  cooldownMs: 3500,
  lowFPSWindows: 0,
  highFPSWindows: 0,
};
function updateAdaptiveResolution(frameMs: number, now: number, isFlying: boolean) {
  if (!adaptiveResolution.enabled || document.hidden) return;
  // Avoid measuring stalled tabs and shader-compilation outliers as steady load.
  if (frameMs < 1 || frameMs > 250) return;
  adaptiveResolution.samples.push(frameMs);
  if (adaptiveResolution.samples.length < 90) return;
  const sorted = adaptiveResolution.samples.slice().sort((a, b) => a - b);
  adaptiveResolution.samples.length = 0;
  const medianMs = sorted[Math.floor(sorted.length / 2)];
  const estimatedFPS = 1000 / medianMs;
  // The transition itself is expensive; allow downscaling but avoid upscaling
  // in the middle of the flight.
  if (estimatedFPS < adaptiveResolution.targetFPS - 7) {
    adaptiveResolution.lowFPSWindows++;
    adaptiveResolution.highFPSWindows = 0;
  } else if (estimatedFPS > adaptiveResolution.targetFPS + 12 && !isFlying) {
    adaptiveResolution.highFPSWindows++;
    adaptiveResolution.lowFPSWindows = 0;
  } else {
    adaptiveResolution.lowFPSWindows = 0;
    adaptiveResolution.highFPSWindows = 0;
  }
  if (now - adaptiveResolution.lastAdjustment < adaptiveResolution.cooldownMs) return;
  let next = adaptiveResolution.currentScale;
  if (adaptiveResolution.lowFPSWindows >= 2) {
    next = Math.min(adaptiveResolution.maxScale, next + 0.15);
  } else if (adaptiveResolution.highFPSWindows >= 3) {
    next = Math.max(adaptiveResolution.baseScale, next - 0.10);
  }
  if (Math.abs(next - adaptiveResolution.currentScale) > 0.001) {
    adaptiveResolution.currentScale = Math.round(next * 100) / 100;
    engine.setHardwareScalingLevel(adaptiveResolution.currentScale);
    console.info("[Tribune adaptive resolution]", {
      scale: adaptiveResolution.currentScale,
      sampledFPS: Math.round(estimatedFPS),
      transition: isFlying
    });
    adaptiveResolution.lastAdjustment = now;
    adaptiveResolution.lowFPSWindows = 0;
    adaptiveResolution.highFPSWindows = 0;
  }
}
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
// Transparent WebGL clear: the actual page (including future website backgrounds) shows through.
scene.clearColor = new Color4(0, 0, 0, 0);
const camera = new ArcRotateCamera("fixedAxonometric", SETTINGS.cameraAlpha, SETTINGS.cameraBeta,
  SETTINGS.cameraRadius, Vector3.Zero(), scene);
camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
// No attachControl: fixed architectural view; cursor moves the spotlight, not the camera.
// overviewZoomOut > 1 shows more of the scene around the stadium (the canvas itself stays full size).
let currentOrthoHalfHeight = SETTINGS.orthoHalfHeight * (options.overviewZoomOut ?? 1);
camera.fov = SETTINGS.teamCameraFov;
function updateOrtho() {
  const halfH = currentOrthoHalfHeight;
  const halfW = halfH * engine.getRenderWidth() / Math.max(1, engine.getRenderHeight());
  camera.orthoLeft = -halfW; camera.orthoRight = halfW;
  camera.orthoTop = halfH; camera.orthoBottom = -halfH;
}
updateOrtho();
const resizeViewport = () => {
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
// Babylon takes the full opening angle. The mask uses its half-angle.
const spotlight = {
  position: new Vector3(0, 100, 0),
  direction: new Vector3(0, -1, 0),
  angle: SETTINGS.detailSpotAngle,
  range: 250,
  softness: SETTINGS.spotlightSoftness,
  intensity: 0,
  coneLimits: new Vector3(),
};
const detailSpot = new SpotLight(
  "teamDetailSpot", spotlight.position.clone(), spotlight.direction.clone(),
  spotlight.angle, 2, scene
);
detailSpot.diffuse = new Color3(1, 0.94, 0.85);
detailSpot.specular = new Color3(1, 0.94, 0.85);
detailSpot.intensity = spotlight.intensity;
detailSpot.range = spotlight.range;
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
scene.fogColor = Color3.FromHexString("#2f3847");
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
// V5: choose one shader feature set for both camera states. This changes the
// close-up grade (no ACES/curves/fog) intentionally, for an isolated FPS test.
if (SETTINGS.stableShaderFeatures) {
  imageProcessing.toneMappingEnabled = false;
  imageProcessing.colorCurvesEnabled = false;
  scene.fogMode = Scene.FOGMODE_NONE;
}
const overviewExposure = imageProcessing.exposure;
const overviewContrast = imageProcessing.contrast;
// Compare fill lighting against sun-only lighting without touching the overview.
let spotlightOnlyTest = false;
const pipeline = new DefaultRenderingPipeline("post", true, scene, [camera]);
pipeline.fxaaEnabled = true;
// Smooth thin pitch markings before bloom and FXAA sample the scene.
const effectsSamples = Math.min(2, engine.getCaps().maxMSAASamples);
pipeline.samples = effectsSamples;
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.65;
pipeline.bloomWeight = 0.08;
pipeline.bloomKernel = 48;

// ONE GEOMETRY PASS PER OBJECT: no extracted edge lines or depth-only clones.
// Original imported materials are preserved; a shader plugin applies the clay
// treatment outside the cursor spotlight, then clips the close-up environment.
let unifiedSpotlight = true;
let spotlightCenter = new Vector3(0, -10000, 0);
let spotlightActive = false;
const savedOverviewSpot = { center: Vector3.Zero(), active: false };
let introFinished = false;
let detailMode = false;
let selectedDetailTeam: LoadedTeam | null = null;
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
let projectionBlend = 0;

// Each GLB material clone owns its own shader uniforms, but never extra geometry.
// For the selected team the plugin keeps the house fully visible in detail view.
// Shader diagnostic modes are uniforms: switching them does not clone materials
// or request new shader variants. 0 full; 1 no distance; 2 no clay;
// 3 no dither; 4 bypass all atmosphere fragment logic.
let spotlightShaderTest = 0;
let activeTeamAccentColor: Color3 | null = null;
const inactiveTeamAccentColor = Color3.Black();
class AtmospherePlugin extends MaterialPluginBase {
  selected = false;
  role: AtmosphereRole = "normal";
  private readonly kind: "architecture" | "roof";
  constructor(material: Material, kind: "architecture" | "roof") {
    super(material, "TribuneAtmosphere_" + kind, 210, { TRIBUNE_ATMOSPHERE: true });
    this.kind = kind;
    this._enable(true);
  }
  getClassName() { return "TribuneAtmosphere"; }
  getUniforms() {
    return { ubo: [
      { name: "tribuneCenter", size: 3, type: "vec3" },
      { name: "tribuneDetailCenter", size: 3, type: "vec3" },
      { name: "tribuneConePosition", size: 3, type: "vec3" },
      { name: "tribuneConeDirection", size: 3, type: "vec3" },
      { name: "tribuneConeLimits", size: 3, type: "vec3" },
      { name: "tribuneUseCone", size: 1, type: "float" },
      { name: "tribuneRadius", size: 1, type: "float" },
      { name: "tribuneSoftness", size: 1, type: "float" },
      { name: "tribuneDetailBlend", size: 1, type: "float" },
      { name: "tribuneSelected", size: 1, type: "float" },
      { name: "tribuneShade", size: 1, type: "float" },
      { name: "tribuneFieldMarkings", size: 1, type: "float" },
      { name: "tribuneSurroundRadius", size: 1, type: "float" },
      { name: "tribuneSurroundFeather", size: 1, type: "float" },
      { name: "tribuneHoverColor", size: 3, type: "vec3" },
      { name: "tribuneHoverStrength", size: 1, type: "float" },
       { name: "tribuneShaderTest", size: 1, type: "float" },
    ],
    // Declarations for the non-UBO shader path (embedded build). Without them some
    // materials fail to compile ("undeclared identifier") and the stadium does not draw.
    fragment: `#ifdef TRIBUNE_ATMOSPHERE
      uniform vec3 tribuneCenter;
      uniform vec3 tribuneDetailCenter;
      uniform vec3 tribuneConePosition;
      uniform vec3 tribuneConeDirection;
      uniform vec3 tribuneConeLimits;
      uniform float tribuneUseCone;
      uniform float tribuneRadius;
      uniform float tribuneSoftness;
      uniform float tribuneDetailBlend;
      uniform float tribuneSelected;
      uniform float tribuneShade;
      uniform float tribuneFieldMarkings;
      uniform float tribuneSurroundRadius;
      uniform float tribuneSurroundFeather;
      uniform vec3 tribuneHoverColor;
      uniform float tribuneHoverStrength;
      uniform float tribuneShaderTest;
    #endif` };
  }
  bindForSubMesh(ubo: UniformBuffer, _scene: Scene, _engine: Engine, _subMesh: SubMesh) {
    const useCone = unifiedSpotlight && selectedDetailTeam !== null;
    const overviewActive = useCone ? savedOverviewSpot.active : spotlightActive;
    ubo.updateVector3("tribuneCenter", useCone ? savedOverviewSpot.center : spotlightCenter);
    ubo.updateFloat("tribuneUseCone", useCone ? 1 : 0);
    if (useCone) {
      ubo.updateVector3("tribuneConePosition", spotlight.position);
      ubo.updateVector3("tribuneConeDirection", spotlight.direction);
      ubo.updateVector3("tribuneConeLimits", spotlight.coneLimits);
    }
    ubo.updateVector3("tribuneDetailCenter", selectedDetailTeam?.center ?? spotlightCenter);
    ubo.updateFloat("tribuneRadius", overviewActive ? SETTINGS.spotlightRadius : -1);
    ubo.updateFloat("tribuneSoftness", SETTINGS.spotlightSoftness);
    ubo.updateFloat("tribuneDetailBlend", detailBlend);
    ubo.updateFloat("tribuneSelected", this.selected ? 1 : 0);
    ubo.updateFloat("tribuneShade", SETTINGS.overviewShadeStrength);
    ubo.updateFloat("tribuneFieldMarkings", this.role === "fieldMarkings" ? 1 : 0);
    ubo.updateFloat("tribuneSurroundRadius", SETTINGS.detailSurroundRadius);
    ubo.updateFloat("tribuneSurroundFeather", SETTINGS.detailSurroundFeather);
    const accentColor = this.role === "fieldMarkings" || this.role === "billboard"
      ? activeTeamAccentColor : null;
    ubo.updateColor3("tribuneHoverColor", accentColor ?? inactiveTeamAccentColor);
    ubo.updateFloat("tribuneHoverStrength", accentColor ? 1 : 0);
    ubo.updateFloat("tribuneShaderTest", spotlightShaderTest);
  }
  getCustomCode(shaderType: string) {
    if (shaderType !== "fragment") return null;
    const coneCoverage = `
      float tribuneConeCoverage(vec3 worldPosition) {
        vec3 offset = worldPosition - tribuneConePosition;
        float distanceSquared = dot(offset, offset);
        float axial = dot(offset, tribuneConeDirection);
        if (axial < 0.0 || distanceSquared >= tribuneConeLimits.z) return 0.0;
        // Compare squared cosines to skip normalizing the offset per fragment.
        float cosSquared = axial * axial / max(distanceSquared, 1e-8);
        return smoothstep(tribuneConeLimits.x, tribuneConeLimits.y, cosSquared);
      }
    `;
    if (this.kind === "roof") return {
      CUSTOM_FRAGMENT_DEFINITIONS: coneCoverage,
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        // Hide the roof/columns in overview; show only nearby parts in detail.
        if (tribuneShaderTest < 3.5) {
          if (tribuneDetailBlend < 0.999) discard;
          if (tribuneUseCone > 0.5) {
            if (tribuneConeCoverage(vPositionW) <= 0.0) discard;
          } else if (distance(vPositionW.xz, tribuneDetailCenter.xz) > tribuneSurroundRadius) {
            discard;
          }
        }
      `,
    };
    return {
      CUSTOM_FRAGMENT_DEFINITIONS: coneCoverage,
      CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
        if (tribuneShaderTest < 3.5) {
        float spotCoverage = tribuneShaderTest > 0.5 && tribuneShaderTest < 1.5 ? 1.0 : 0.0;
        if (tribuneShaderTest < 0.5 || tribuneShaderTest > 1.5) {
        if (tribuneRadius > 0.0 && (tribuneUseCone < 0.5 || tribuneDetailBlend < 1.0)) {
          float d = distance(vPositionW.xz, tribuneCenter.xz);
          float inner = tribuneRadius * (1.0 - tribuneSoftness);
          spotCoverage = 1.0 - smoothstep(inner, max(inner + 0.001, tribuneRadius), d);
        }
        }
        vec3 graphite = vec3(${OVERVIEW_TINT});
        float luminance = dot(max(finalColor.rgb, vec3(0.0)), vec3(0.2126, 0.7152, 0.0722));
        vec3 toned = graphite * mix(${OVERVIEW_SHADING}, clamp(luminance, 0.0, 1.0));
        // Facet shading: faces turned to a soft top light read lighter, sides darker (volume).
        float tribuneFacing = clamp(dot(normalize(vNormalW), normalize(vec3(-0.35, 1.0, -0.25))), 0.0, 1.0);
        toned *= mix(${FACET_SHADING}, tribuneFacing);
        // Sheen: a soft light sweep across the whole stadium (world space), with a colour tint on the lit side.
        float tribuneSweep = smoothstep(-1.0, 1.0, dot(normalize(vec2(${SHEEN_DIR})), vPositionW.xz) / ${SHEEN_RADIUS});
        toned = toned * mix(${SHEEN_RANGE}, tribuneSweep) + vec3(${SHEEN_COLOR}) * tribuneSweep * tribuneSweep;
        // Both luminous surfaces use the same team color and spotlight mask.
        if (tribuneFieldMarkings > 0.5 || tribuneHoverStrength > 0.5) {
          toned = mix(vec3(${FIELD_LINE_TINT}), tribuneHoverColor * 1.65, tribuneHoverStrength);
        }
        // The overview tint reaches zero wherever the spotlight fully reveals the surface.
        float tintWeight = tribuneShade * (1.0 - spotCoverage);
        vec3 overviewColor = (tribuneShaderTest > 1.5 && tribuneShaderTest < 2.5)
          ? finalColor.rgb : mix(finalColor.rgb, toned, tintWeight);
        // Overview: architectural clay remains visible; only the empty WebGL background is transparent.
        // Detail: selected house always stays visible, all other geometry only inside
        // the WORLD-SPACE spotlight. No circular CSS frame or rectangular cutoff.
        if (tribuneShaderTest < 2.5 &&
            tribuneDetailBlend > 0.0001 && tribuneSelected < 0.5) {
          bool skipDistance = tribuneShaderTest > 0.5 && tribuneShaderTest < 1.5;
          float detailCoverage = spotCoverage;
          if (tribuneUseCone > 0.5 && !skipDistance) {
            detailCoverage = tribuneConeCoverage(vPositionW);
          }
          float visibility = mix(1.0, detailCoverage, tribuneDetailBlend);
          // Ordered Bayer dithering: avoids expensive alpha blending and sorting.
          vec2 pixel = mod(floor(gl_FragCoord.xy), 4.0);
          float index = pixel.x + pixel.y * 4.0;
          float threshold = 0.0;
          if (index < 0.5) threshold = 0.03125;
          else if (index < 1.5) threshold = 0.53125;
          else if (index < 2.5) threshold = 0.15625;
          else if (index < 3.5) threshold = 0.65625;
          else if (index < 4.5) threshold = 0.78125;
          else if (index < 5.5) threshold = 0.28125;
          else if (index < 6.5) threshold = 0.90625;
          else if (index < 7.5) threshold = 0.40625;
          else if (index < 8.5) threshold = 0.21875;
          else if (index < 9.5) threshold = 0.71875;
          else if (index < 10.5) threshold = 0.09375;
          else if (index < 11.5) threshold = 0.59375;
          else if (index < 12.5) threshold = 0.96875;
          else if (index < 13.5) threshold = 0.46875;
          else if (index < 14.5) threshold = 0.84375;
          else threshold = 0.34375;
          if (visibility < threshold) discard;
        }
        finalColor.rgb = mix(overviewColor, finalColor.rgb, tribuneDetailBlend);
        } // shader test 4: bypass the entire atmosphere fragment code
      `,
    };
  }
}
const atmosphereByMesh = new Map<Mesh, AtmospherePlugin>();
// Keep imported materials for an isolated plugin-on/off performance comparison.
const importedMaterialByMesh = new Map<Mesh, Material>();
// V5: separate hover highlight from the clay/spotlight fragment shader.
const teamHighlight = new HighlightLayer("tribuneTeamHighlight", scene, { blurHorizontalSize: 0.7, blurVerticalSize: 0.7 });
let lastGlowTeam: LoadedTeam | null = null;
// V10: A GLB is an independent selection domain. Sharing a material *within*
// one import preserves per-team selected state and per-role accent behavior.
// Never deduplicate by name: materials with equal names can have different data.
const materialOptimization = {
  enabled: true,
  importedMeshes: 0,
  uniqueOriginalMaterials: new Set<Material>(),
  originalClones: 0,
  optimizedClones: 0,
  actualClones: 0,
  sharedMeshCount: 0,
};
const unoptimizedMaterialByMesh = new Map<Mesh, Material>();
const optimizedMaterialByMesh = new Map<Mesh, Material>();
const pluginByMaterial = new Map<Material, AtmospherePlugin>();
const materialKindByMesh = new Map<Mesh, "architecture" | "roof">();
type AtmosphereRole = "normal" | "billboard" | "field" | "fieldMarkings";
function addAtmosphere(meshes: Mesh[], kind: "architecture" | "roof" = "architecture", role: AtmosphereRole = "normal") {
  // Local cache is deliberate: each call is a separate team/architectural domain.
  const sharedByOriginal = new Map<Material, Material>();
  for (const mesh of meshes) {
    if (!mesh.material) mesh.material = new StandardMaterial("fallback_" + mesh.name, scene);
    const original = mesh.material;
    importedMaterialByMesh.set(mesh, original);
    materialKindByMesh.set(mesh, kind);
    materialOptimization.importedMeshes++;
    materialOptimization.uniqueOriginalMaterials.add(original);
    materialOptimization.originalClones++;
    const existing = sharedByOriginal.get(original);
    let optimized: Material;
    if (!existing) {
      const cloned = original.clone(original.name + "_atmosphere_" + mesh.uniqueId);
      if (!cloned) continue;
      const plugin = new AtmospherePlugin(cloned, kind);
      plugin.role = role;
      pluginByMaterial.set(cloned, plugin);
      sharedByOriginal.set(original, cloned);
      optimized = cloned;
      unoptimizedMaterialByMesh.set(mesh, cloned);
      materialOptimization.optimizedClones++;
    } else {
      optimized = existing;
      materialOptimization.sharedMeshCount++;
      // Create the old per-mesh material lazily, only if baseline is requested.
    }
    optimizedMaterialByMesh.set(mesh, optimized);
    mesh.material = optimized;
    atmosphereByMesh.set(mesh, pluginByMaterial.get(optimized)!);
  }
  refreshMaterialOptimizerPanel();
}
function applyMaterialOptimization() {
  // Switch material ownership only when not in the Flat/GLB substitution test.
  // Shared material instances remain scoped to one GLB import, so team selection
  // and role uniforms do not leak between teams.
  if (perfMode === "C" || perfMode === "D") {
    console.info("[Tribune materials] Switch to A, B, E or F before comparing optimization");
    return;
  }
  for (const [mesh, optimized] of optimizedMaterialByMesh) {
    if (mesh.isDisposed()) continue;
    let material = materialOptimization.enabled ? optimized : unoptimizedMaterialByMesh.get(mesh);
    if (!material && !materialOptimization.enabled) {
      const original = importedMaterialByMesh.get(mesh);
      if (!original) continue;
      const cloned = original.clone(original.name + "_baseline_" + mesh.uniqueId);
      if (!cloned) continue;
      const basePlugin = pluginByMaterial.get(optimized);
      const plugin = new AtmospherePlugin(cloned, materialKindByMesh.get(mesh) ?? "architecture");
      plugin.role = basePlugin?.role ?? "normal";
      plugin.selected = basePlugin?.selected ?? false;
      pluginByMaterial.set(cloned, plugin);
      unoptimizedMaterialByMesh.set(mesh, cloned);
      material = cloned;
    }
    if (!material) continue;
    mesh.material = material;
    atmosphereByMesh.set(mesh, pluginByMaterial.get(material)!);
  }
  updateSelectedAtmosphere(selectedDetailTeam);
  refreshMaterialOptimizerPanel();
}
function logMaterialAudit() {
  const activeMaterials = new Set<Material>();
  for (const mesh of atmosphereByMesh.keys()) if (!mesh.isDisposed() && mesh.material) activeMaterials.add(mesh.material);
  const report = {
    importedMeshes: materialOptimization.importedMeshes,
    uniqueOriginalMaterialObjects: materialOptimization.uniqueOriginalMaterials.size,
    baselineAtmosphereMaterials: materialOptimization.originalClones,
    optimizedAtmosphereMaterials: materialOptimization.optimizedClones,
    potentialSavedMaterials: materialOptimization.originalClones - materialOptimization.optimizedClones,
    activeAtmosphereMaterials: activeMaterials.size,
    enabled: materialOptimization.enabled,
  };
  console.table(report);
  return report;
}
let materialOptimizerLabel: HTMLElement | null = null;
function refreshMaterialOptimizerPanel() {
  if (!materialOptimizerLabel) return;
  materialOptimizerLabel.textContent = `Materials: ${materialOptimization.enabled ? "SHARED" : "BASELINE"} · ${materialOptimization.optimizedClones}/${materialOptimization.originalClones} clones`;
}

function updateSelectedAtmosphere(team: LoadedTeam | null) {
  for (const plugin of pluginByMaterial.values()) plugin.selected = false;
  if (team) for (const mesh of team.meshes) {
    for (const material of [optimizedMaterialByMesh.get(mesh), unoptimizedMaterialByMesh.get(mesh)]) {
      const plugin = material && pluginByMaterial.get(material);
      if (plugin) plugin.selected = true;
    }
  }
}

let stadiumMeshes: Mesh[]=[];
let highlightAmount = 0;
let teamData:LoadedTeam[]=[];
// Constant-time mesh-to-team lookup for scene picking.
const teamByMesh = new Map<Mesh, LoadedTeam>();
let stadiumCenter = Vector3.Zero();
const worldPointer = new Vector3(0,-10000,0);
const pointer = new Vector2(-9999,-9999);
let pointerInside=false;

// HighlightLayer uses original team meshes. The former depth-only proxy material
// suppressed its color output, making the glow practically invisible.
const teamLabel=document.createElement("div");
teamLabel.style.cssText="position:fixed;display:none;padding:12px 16px;background:rgba(5,10,18,.92);color:white;border:1px solid #29647a;border-radius:8px;font:14px Arial,sans-serif;pointer-events:none;z-index:1000";
if (diagnosticsEnabled) document.body.appendChild(teamLabel);
let materialDiagnosticMode: "masked" | "original" | "standard" = "masked";
function applyMaterialDiagnostic() {
  const carabell = teamData.find(t => t.config.id === "carabell");
  if (!carabell) return;
  // Keep the architectural shader active in this edition.
  for (const mesh of carabell.meshes) {
    mesh.material = maskedTeamMaterials.get(mesh) ?? mesh.material;
  }
  materialDiagnosticStatus.textContent = "????????? Carabell: ? ??????";
}
// Load renderable meshes from an exported GLB; keep the original material setup.
let loadedModelCount = 0;
let worldLoaded = false;
async function importModel(file: string, folder: string = options.modelsUrl): Promise<Mesh[]> {
  const result = await SceneLoader.ImportMeshAsync("", folder, file, scene);
  const meshes = result.meshes.filter((mesh): mesh is Mesh =>
    mesh instanceof Mesh && mesh.getTotalVertices() > 0
  );
  if (meshes.length) loadedModelCount++;
  return meshes;
}

const maskedTeamMaterials = new Map<Mesh, Material | null>();
let billboardMeshes: Mesh[] = [];

function widenFieldMarkings(mesh: Mesh) {
  const positions = mesh.getVerticesData(VertexBuffer.PositionKind, true, true);
  const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
  if (!positions || !normals) return;

  // The GLB splits vertices between the top and side faces. Move coincident
  // vertices together, using the horizontal normals from the sides.
  const vertexKey = (i: number) =>
    `${Math.round(positions[i] * 10000)},${Math.round(positions[i + 2] * 10000)}`;
  const outwardByVertex = new Map<string, Vector3>();
  for (let i = 0; i < positions.length; i += 3) {
    if (Math.abs(normals[i + 1]) > 0.5) continue;
    const key = vertexKey(i);
    const outward = outwardByVertex.get(key) ?? Vector3.Zero();
    outward.x += normals[i];
    outward.z += normals[i + 2];
    outwardByVertex.set(key, outward);
  }
  // Add 0.225 m on each side of the original 0.15 m strip.
  const edgeOffset = 0.225;
  for (let i = 0; i < positions.length; i += 3) {
    const outward = outwardByVertex.get(vertexKey(i));
    if (!outward) continue;
    outward.normalize();
    positions[i] += outward.x * edgeOffset;
    positions[i + 2] += outward.z * edgeOffset;
  }
  mesh.makeGeometryUnique();
  mesh.setVerticesData(VertexBuffer.PositionKind, positions);
}

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
    addAtmosphere(stadiumMeshes);
    for(const m of stadiumMeshes) {m.receiveShadows=true;shadows.addShadowCaster(m);m.isPickable=false;}
  } catch(e) {console.error("STADIUM FAILED:",e);}

   // Field and blank structures now use the same clay/reveal shader as the stadium.
   try {
     const fieldMeshes = await importModel(SETTINGS.fieldFile);
     let minFieldY = Infinity;
     for (const mesh of fieldMeshes) {
       mesh.computeWorldMatrix(true);
       minFieldY = Math.min(minFieldY, mesh.getBoundingInfo().boundingBox.minimumWorld.y);
       mesh.isPickable = false;
     }
     if (Number.isFinite(minFieldY)) pitchGroundY = minFieldY;
     // Circle009 is the painted line geometry in field.glb. The other meshes are the goals.
     const markings = fieldMeshes.filter(mesh => mesh.name === "Circle009");
     for (const mesh of markings) widenFieldMarkings(mesh);
     addAtmosphere(fieldMeshes.filter(mesh => !markings.includes(mesh)), "architecture", "field");
     if (markings.length) addAtmosphere(markings, "architecture", "fieldMarkings");
   } catch(e) { console.error("FIELD FAILED:", e); }
   // Blank houses deliberately not loaded in this experiment.

  // All houses are requested at once (they used to load one after another); each appears as it arrives.
  await Promise.all(TEAMS.map(async (config) => {
    try {
      const meshes=await importModel(config.file, options.liteModelsUrl ?? options.modelsUrl);
      if(!meshes.length) return;
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
      addAtmosphere(meshes);
      if (config.id === "carabell") for (const mesh of meshes) maskedTeamMaterials.set(mesh, mesh.material);
      const center=min.add(max).scale(.5);
      const radius=max.subtract(min).length()*.5;
      const loadedTeam: LoadedTeam = {config,meshes,center,radius};
      teamData.push(loadedTeam);
      for (const mesh of meshes) teamByMesh.set(mesh, loadedTeam);
    } catch(e){console.error("TEAM FAILED:",config.file,e);}
  }));
  // Keep the original team order regardless of arrival order.
  teamData.sort((a, b) => TEAMS.indexOf(a.config) - TEAMS.indexOf(b.config));

  // billboard: separate luminous surface, ready for later animated content.
  try {
    const billboards = await importModel(SETTINGS.billboardFile);
billboardMeshes = billboards;
lastBillboardEnabled = null;
addAtmosphere(billboards, "architecture", "billboard");

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
      addAtmosphere(meshes, "roof");
      for(const m of meshes){
        m.isPickable=false;
        m.receiveShadows=true;
        shadows.addShadowCaster(m);
        // The architectural spotlight illuminates the selected house, not the roof above it.
        detailSpot.excludedMeshes.push(m);
      }
    }catch(e){console.error("INTRO PART FAILED:",file,e);}
  }
  introFinished=!SETTINGS.introEnabled;
  if(introFinished){for(const m of roofMeshes)m.setEnabled(false);}
  else {
    // Wait, then sweep 0 -> 1; the mask reveals the stadium without camera motion.
    const start=performance.now()+SETTINGS.introHoldMs;
    const tick=()=>{
      const t=Math.min(1,Math.max(0,(performance.now()-start)/SETTINGS.introWipeMs));
      if(t<1) requestAnimationFrame(tick);
      else {introFinished=true;for(const m of roofMeshes)m.setEnabled(false);}
    };
    requestAnimationFrame(tick);
  }
  console.log("TRIBUNE READY; teams:",teamData.length);
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

function updateTeamHighlight() {
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


  // Re-evaluate picking every frame because the camera rotates even with a still pointer.
  const hoveredTeam = getHoveredTeam();
  if (diagnosticsEnabled) teamLabel.style.display = hoveredTeam ? "block" : "none";
  if (diagnosticsEnabled && hoveredTeam) {
    teamLabel.textContent = [
      hoveredTeam.config.name.toUpperCase(),
      hoveredTeam.config.country,
      hoveredTeam.config.info
    ].filter(Boolean).join(" · ");
    const rect = canvas.getBoundingClientRect();
    teamLabel.style.left = (rect.left + pointer.x + 18) + "px";
    teamLabel.style.top = (rect.top + pointer.y + 18) + "px";
  }
  canvas.style.cursor = hoveredTeam ? "pointer" : "default";
  // Resolve one color for the house outline and both luminous surfaces.
  const accentTeam = detailMode ? null : (hoveredTeam ?? nearest);
  if (accentTeam !== lastGlowTeam) {
    if (lastGlowTeam) {
      for (const mesh of lastGlowTeam.meshes) teamHighlight.removeMesh(mesh);
    }
    activeTeamAccentColor = accentTeam ? Color3.FromHexString(accentTeam.config.color) : null;
    if (accentTeam && activeTeamAccentColor) {
      for (const mesh of accentTeam.meshes) teamHighlight.addMesh(mesh, activeTeamAccentColor);
    }
    lastGlowTeam = accentTeam;
  }
  highlightAmount = accentTeam ? 1 : 0;
}
// SPOTLIGHT SHADER PROFILER: choose A (Full) or E (Plugin) in the right panel.
// D (GLB) bypasses the plugin completely, so this control has no effect in D.
const shaderPanel = document.createElement("div");
shaderPanel.style.cssText = "position:fixed;left:12px;top:98px;z-index:2100;background:#07131de8;color:#d9f6ff;border:1px solid #39768b;border-radius:7px;padding:10px;font:12px/1.5 monospace;max-width:310px";
const shaderTitle = document.createElement("div");
shaderTitle.textContent = "TRIBUNE · SPOTLIGHT PROFILER";
shaderTitle.style.cssText = "font-weight:bold;margin-bottom:6px";
shaderPanel.appendChild(shaderTitle);
const shaderHelp = document.createElement("div");
shaderHelp.style.cssText = "font-size:11px;color:#9fc7d4;margin-bottom:7px";
shaderHelp.textContent = "Выбери E · Plugin справа. Сравни FPS при одинаковом ракурсе. Режимы меняют внешний вид намеренно.";
shaderPanel.appendChild(shaderHelp);
const shaderButtons = document.createElement("div");
shaderButtons.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:5px";
shaderPanel.appendChild(shaderButtons);
const shaderStatus = document.createElement("div");
shaderStatus.style.cssText = "font-size:11px;margin-top:7px;color:#9fc7d4";
shaderPanel.appendChild(shaderStatus);
if (diagnosticsEnabled) document.body.appendChild(shaderPanel);
const shaderButtonMap = new Map<number, HTMLButtonElement>();
function chooseShaderTest(mode: number) {
  spotlightShaderTest = mode;
  for (const [id, button] of shaderButtonMap) {
    button.style.background = id === mode ? "#27728a" : "#122b39";
    button.style.color = id === mode ? "white" : "#a9c6d3";
  }
  shaderStatus.textContent = ["0 · Full mask", "1 · No distance", "2 · No clay",
    "3 · No dither/discard", "4 · Plugin bypass"][mode];
  console.log("TRIBUNE SPOTLIGHT SHADER TEST", mode);
}
for (const [mode, label] of [
  [0, "0 · Full mask"], [1, "1 · No distance"],
  [2, "2 · No clay"], [3, "3 · No discard"],
  [4, "4 · Bypass plugin"]
] as const) {
  const button = document.createElement("button");
  button.textContent = label;
  button.style.cssText = "cursor:pointer;padding:7px 5px;border:1px solid #39768b;border-radius:4px;background:#122b39;color:#a9c6d3;font:11px Arial";
  button.addEventListener("click", () => chooseShaderTest(mode));
  shaderButtons.appendChild(button);
  shaderButtonMap.set(mode, button);
}
chooseShaderTest(0);
// TRANSITION ISOLATION: each option changes only the flight, not steady-state rendering.
type FlightTest = "NORMAL" | "NO_MORPH" | "FIXED_LIGHT" | "DEFER_MASK";
let flightTest: FlightTest = "NORMAL";
const flightTestPanel = document.createElement("div");
flightTestPanel.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:2100;background:#07131de8;color:#d9f6ff;border:1px solid #39768b;border-radius:7px;padding:10px;font:12px/1.5 monospace;max-width:340px";
flightTestPanel.innerHTML = "<b>TRIBUNE · FLIGHT ISOLATION</b><div style='font-size:11px;color:#a7c6d2;margin:5px 0'>Тестируй в режиме D · GLB, затем в A · Full</div>";
const flightTestButtons = document.createElement("div");
flightTestButtons.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:5px";
flightTestPanel.appendChild(flightTestButtons);
const flightTestStatus = document.createElement("div");
flightTestStatus.style.cssText = "font-size:11px;margin-top:6px;color:#9fc7d4";
flightTestPanel.appendChild(flightTestStatus);
if (diagnosticsEnabled) document.body.appendChild(flightTestPanel);
const flightTestButtonMap = new Map<FlightTest, HTMLButtonElement>();
function chooseFlightTest(mode: FlightTest) {
  if (cameraTransition) return; // do not change a test mid-flight
  flightTest = mode;
  for (const [id, button] of flightTestButtonMap) {
    button.style.background = id === mode ? "#27728a" : "#122b39";
    button.style.color = id === mode ? "#fff" : "#a9c6d3";
  }
  flightTestStatus.textContent = "Flight: " + mode;
  console.log("TRIBUNE FLIGHT TEST", mode);
}
for (const [mode, label] of [
  ["NORMAL", "1 · Normal"], ["NO_MORPH", "2 · No morph"],
  ["FIXED_LIGHT", "3 · Fixed light"], ["DEFER_MASK", "4 · Deferred mask"]
] as const) {
  const button = document.createElement("button");
  button.textContent = label;
  button.style.cssText = "cursor:pointer;padding:7px 5px;border:1px solid #39768b;border-radius:4px;background:#122b39;color:#a9c6d3;font:11px Arial";
  button.title = ({
    NORMAL:"Current camera, lighting and masking",
    NO_MORPH:"Camera flies normally; projection switches at the endpoint",
    FIXED_LIGHT:"Hold overview lighting until arrival, then restore detail lighting",
    DEFER_MASK:"Do not update selected-house masking until arrival"
  })[mode];
  button.addEventListener("click", () => chooseFlightTest(mode));
  flightTestButtons.appendChild(button);
  flightTestButtonMap.set(mode, button);
}
chooseFlightTest("NORMAL");
let deferredMaskPending = false;
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
  if (flightTest === "NO_MORPH") {
    // Intentional projection jump at the endpoint; isolate the morph cost.
    updateProjectionMorph(a.fromProjectionBlend);
  } else {
    updateProjectionMorph(a.fromProjectionBlend + (a.toProjectionBlend-a.fromProjectionBlend)*projectionEase);
  }
  if(t>=1){
    if (flightTest === "NO_MORPH") updateProjectionMorph(a.toProjectionBlend);
    cameraTransition=null;
    if (deferredMaskPending && selectedDetailTeam && !returningToOverview) {
      updateSelectedAtmosphere(selectedDetailTeam);
      deferredMaskPending = false;
    }
    a.onComplete?.();
  }
}

// Back to the overview: one site-style pill at the bottom of the widget, together with
// the club link. (The MVP's separate "← К СТАДИОНУ" button is not used on the site.)
const backButton=document.createElement("button");
backButton.type = "button";
backButton.textContent = "Back to stadium";
backButton.style.display = "none";
actions.append(backButton, teamLink);
layout.appendChild(actions);

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
const debugLamp = MeshBuilder.CreateSphere("DEBUG_spot_source", { diameter: 2.2, segments: 12 }, scene);
debugLamp.material = debugLampMaterial;
debugLamp.isPickable = false;
debugLamp.setEnabled(false);
const debugTargetMaterial = new StandardMaterial("debugSpotTargetLit", scene);
debugTargetMaterial.diffuseColor = new Color3(1, 1, 1);
debugTargetMaterial.specularColor = new Color3(0, 0, 0);
const debugTarget = MeshBuilder.CreateSphere("DEBUG_spot_target", { diameter: 3, segments: 16 }, scene);
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
if (diagnosticsEnabled) document.body.appendChild(lightingPanel);

// Lite houses → full textures when a house is opened (see StadiumOptions.liteModelsUrl).
// glTF textures are named "<material> (<slot>)", identical in both copies, so they are matched by name.
const TEXTURE_SLOTS = ["albedoTexture", "bumpTexture", "metallicTexture", "emissiveTexture", "ambientTexture",
  "opacityTexture", "reflectivityTexture", "microSurfaceTexture", "lightmapTexture", "metallicReflectanceTexture", "reflectanceTexture"];
const upgradedTeams = new Set<string>();
async function upgradeTeamTextures(team: LoadedTeam) {
  if (!options.liteModelsUrl || upgradedTeams.has(team.config.id)) return;
  upgradedTeams.add(team.config.id);
  try {
    const container = await SceneLoader.LoadAssetContainerAsync(options.modelsUrl, team.config.file, scene);
    const full = new Map(container.textures.map((t) => [t.name, t] as const));
    const lite = new Set<BaseTexture>();
    for (const mesh of team.meshes) mesh.material?.getActiveTextures().forEach((t) => lite.add(t));
    const used = new Set<BaseTexture>();
    const swap = (owner: Record<string, unknown> | null | undefined, slot: string) => {
      const current = owner?.[slot] as BaseTexture | null | undefined;
      if (!owner || !current || !lite.has(current)) return;
      const replacement = full.get(current.name);
      if (replacement) { owner[slot] = replacement; used.add(replacement); }
    };
    // Every material that shares these textures (clones made for the atmosphere shader included).
    for (const material of scene.materials) {
      const m = material as unknown as Record<string, unknown>;
      for (const slot of TEXTURE_SLOTS) swap(m, slot);
      const clearCoat = m.clearCoat as Record<string, unknown> | undefined;
      for (const slot of ["texture", "textureRoughness", "bumpTexture"]) swap(clearCoat, slot);
    }
    container.textures = container.textures.filter((t) => !used.has(t));
    container.dispose();
  } catch (e) {
    upgradedTeams.delete(team.config.id);
    console.error("FULL TEXTURES FAILED:", team.config.file, e);
  }
}
function openTeam(team:LoadedTeam) {
  if(detailMode || cameraTransition) return;
  void upgradeTeamTextures(team);
  savedOverview={alpha:camera.alpha,beta:camera.beta,radius:camera.radius,height:currentOrthoHalfHeight,target:camera.target.clone()};
  savedOverviewSpot.center.copyFrom(spotlightCenter);
  savedOverviewSpot.active = spotlightActive;
  detailMode=true;
  // Seamless rectangular viewport: no CSS aperture in either mode.
  viewport.classList.add("tribuneDetail");
  selectedDetailTeam=team;
  returningToOverview=false;
  // Spotlight shadows must not render all ten houses for one close-up.
  const spotCasters = detailSpotShadows.getShadowMap()?.renderList;
  if (spotCasters) {
    spotCasters.length = 0;
    for (const mesh of team.meshes) spotCasters.push(mesh);
  }
  // The roof remains hidden to keep the selected house unobstructed.
  for (const mesh of [...roofDetailMeshes, ...columnDetailMeshes]) mesh.setEnabled(false);
  if (flightTest === "DEFER_MASK") deferredMaskPending = true;
  else updateSelectedAtmosphere(team);
  spotlightCenter.copyFrom(team.center);
  spotlightActive=true;
  teamLabel.style.display="none";
  backButton.style.display = "";
  lightingPanel.style.display="none"; // hidden in visual test
  actions.classList.add("isOpen");
  const href = options.teamHref?.(team.config.id) ?? null;
  teamLink.style.display = href ? "" : "none";
  if (href) teamLink.href = href;
  materialDiagnosticMode = "masked";
  // Use the pitch center for azimuth and a fixed upward angle for every house.
  const towardPitch = new Vector3(-team.center.x, 0, -team.center.z);
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
  const lookUpAngle = SETTINGS.detailCameraLookUpDegrees * Math.PI / 180;
  const offset = rotatedDirection.scale(framedDistance * Math.cos(lookUpAngle));
  offset.y = -framedDistance * Math.sin(lookUpAngle);
  const radius = offset.length();
  const beta = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));
  const alpha = Math.atan2(offset.z, offset.x);
  const height = radius * Math.tan(halfVerticalFov);
  animateCamera({alpha, beta, radius, height, target:team.center});
}
function closeTeam() {
  if(!detailMode || !savedOverview) return;
  const previous=savedOverview;
  materialDiagnosticMode = "masked";
  applyMaterialDiagnostic();
  returningToOverview=true;
  // Restore overview mode without introducing a frame boundary.
  viewport.classList.remove("tribuneDetail");
  backButton.style.display="none";
  lightingPanel.style.display="none";
  teamLink.style.display="none";
  actions.classList.remove("isOpen");
  debugLamp.setEnabled(false);
  debugTarget.setEnabled(false);
  animateCamera(previous,()=>{
    detailMode=false; selectedDetailTeam=null; savedOverview=null; returningToOverview=false;
    deferredMaskPending = false;
    updateSelectedAtmosphere(null);
    for (const mesh of [...roofDetailMeshes, ...columnDetailMeshes]) mesh.setEnabled(false);
  });
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
const onKeyEscape = (e: KeyboardEvent) => { if (e.key === "Escape") closeTeam(); };
window.addEventListener("keydown", onKeyEscape);

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

// TRIBUNE PERFORMANCE A-F — reversible rendering diagnostics.
// A: full scene; B: no post FX; C: flat unlit;
// D: imported GLB materials, no plugin/FX/highlight;
// E: atmosphere plugin, no FX/highlight; F: plugin + FX, no highlight.
// Compare D/E for plugin cost, E/B for highlight, E/F for post FX.
type PerfMode = "A" | "B" | "C" | "D" | "E" | "F";
let perfMode: PerfMode = "A";
const perfOriginalMaterials = new Map<Mesh, Material | null>();
const perfFlatMaterial = new StandardMaterial("TRIBUNE_PERF_FLAT", scene);
perfFlatMaterial.disableLighting = true;
perfFlatMaterial.diffuseColor = new Color3(0.65, 0.72, 0.79);
perfFlatMaterial.emissiveColor = new Color3(0.65, 0.72, 0.79);
perfFlatMaterial.specularColor = Color3.Black();
const perfPanel = document.createElement("div");
perfPanel.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:2000;min-width:275px;max-width:calc(100vw - 24px);background:#07131de8;color:#d9f6ff;border:1px solid #39768b;border-radius:7px;padding:11px;font:12px/1.5 monospace;box-shadow:0 4px 18px #0005";
const perfTitle = document.createElement("div");
perfTitle.textContent = "TRIBUNE · ISOLATION TEST A–F";
perfTitle.style.cssText = "font-weight:bold;letter-spacing:.08em;margin-bottom:8px";
perfPanel.appendChild(perfTitle);
const perfButtons = document.createElement("div");
perfButtons.style.cssText = "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-bottom:9px";
perfPanel.appendChild(perfButtons);
const perfReadout = document.createElement("div");
perfReadout.style.whiteSpace = "pre-line";
perfPanel.appendChild(perfReadout);
const perfHelp = document.createElement("div");
perfHelp.style.cssText = "color:#86a8b8;margin-top:7px;font:11px/1.4 Arial";
perfHelp.textContent = "Тестируй в общем виде: D ↔ E = плагин, E ↔ B = highlight, E ↔ F = FX. После смены жди 5–10 сек, затем сравни FPS.";
perfPanel.appendChild(perfHelp);
if (diagnosticsEnabled) document.body.appendChild(perfPanel);
const perfModeButtons = new Map<PerfMode, HTMLButtonElement>();
function setPerfMode(next: PerfMode) {
  if (next === perfMode) return;
  // Restore atmosphere materials after any material-substitution test.
  for (const [mesh, material] of perfOriginalMaterials) {
    if (!mesh.isDisposed()) mesh.material = material;
  }
  perfOriginalMaterials.clear();
  perfMode = next;
  pipeline.bloomEnabled = next === "A" || next === "F";
  pipeline.fxaaEnabled = next === "A" || next === "F";
  pipeline.samples = pipeline.fxaaEnabled ? effectsSamples : 1;
  teamHighlight.isEnabled = next === "A" || next === "B";
  if (next === "C" || next === "D") {
    for (const mesh of atmosphereByMesh.keys()) {
      if (mesh.isDisposed()) continue;
      perfOriginalMaterials.set(mesh, mesh.material);
      mesh.material = next === "C" ? perfFlatMaterial :
        (importedMaterialByMesh.get(mesh) ?? mesh.material);
    }
  }
  for (const [mode, button] of perfModeButtons) {
    button.style.background = mode === next ? "#27728a" : "#122b39";
    button.style.color = mode === next ? "white" : "#a9c6d3";
  }
  perfSamples = 0;
  perfTotalRenderMs = 0;
  perfMaxRenderMs = 0;
  perfTotalDrawCalls = 0;
  perfLastReport = performance.now();
  console.log("TRIBUNE PERF MODE", next, "substituted meshes:", perfOriginalMaterials.size);
}
for (const [mode, label] of [
  ["A", "A · Full"], ["B", "B · No FX"], ["C", "C · Flat"],
  ["D", "D · GLB"], ["E", "E · Plugin"], ["F", "F · FX"]
] as const) {
  const button = document.createElement("button");
  button.textContent = label;
  button.title = ({ A: "Full rendering", B: "No bloom/FXAA, highlight ON",
    C: "Flat unlit, no bloom/FXAA/highlight", D: "Original GLB, no plugin/FX/highlight",
    E: "Plugin, no FX/highlight", F: "Plugin and FX, no highlight" })[mode];
  button.style.cssText = "cursor:pointer;padding:7px 4px;border:1px solid #39768b;border-radius:4px;background:#122b39;color:#a9c6d3;font:11px Arial";
  button.addEventListener("click", () => setPerfMode(mode));
  perfButtons.appendChild(button);
  perfModeButtons.set(mode, button);
}
perfModeButtons.get("A")!.style.background = "#27728a";
perfModeButtons.get("A")!.style.color = "white";
let perfSamples = 0;
let perfTotalRenderMs = 0;
let perfMaxRenderMs = 0;
let perfTotalDrawCalls = 0;
let perfLastReport = performance.now();
function recordPerfFrame(renderMs: number, drawCalls: number) {
  perfSamples++;
  perfTotalRenderMs += renderMs;
  perfMaxRenderMs = Math.max(perfMaxRenderMs, renderMs);
  perfTotalDrawCalls += drawCalls;
  const now = performance.now();
  if (now - perfLastReport < 1000) return;
  const average = perfTotalRenderMs / Math.max(1, perfSamples);
  const drawText = (perfTotalDrawCalls / perfSamples).toFixed(0);
  perfReadout.textContent =
    `MODE ${perfMode} / ${flightTest} / shader ${spotlightShaderTest} | FPS ${engine.getFps().toFixed(0)}\n` +
    `scene.render avg: ${average.toFixed(1)} ms\n` +
    `scene.render max: ${perfMaxRenderMs.toFixed(1)} ms\n` +
    `draw calls/frame: ${drawText}\n` +
    `active meshes: ${scene.getActiveMeshes().length}\n` +
    `shadows: ${detailSpot.shadowEnabled ? "ON" : "OFF"}`;
  console.log("TRIBUNE PERF SAMPLE", {
    mode: perfMode, fps: Math.round(engine.getFps()),
    renderAvgMs: Number(average.toFixed(2)), renderMaxMs: Number(perfMaxRenderMs.toFixed(2)),
    drawCallsPerFrame: Number(drawText), activeMeshes: scene.getActiveMeshes().length,
    spotlightShadows: detailSpot.shadowEnabled,
  });
  perfSamples = 0;
  perfTotalRenderMs = 0;
  perfMaxRenderMs = 0;
  perfTotalDrawCalls = 0;
  perfLastReport = now;
}

const fpsCounter=document.createElement("div");
fpsCounter.style.cssText="position:fixed;top:16px;left:16px;padding:8px 12px;background:#0009;color:#66ffaa;font:14px monospace;pointer-events:none;z-index:100";
if (diagnosticsEnabled) document.body.appendChild(fpsCounter);
const materialOptimizerPanel = document.createElement("div");
materialOptimizerPanel.style.cssText = "position:fixed;right:12px;bottom:62px;z-index:2200;background:#07131de8;color:#d9f6ff;border:1px solid #39768b;border-radius:7px;padding:9px;font:12px monospace";
const materialOptimizerButton = document.createElement("button");
materialOptimizerButton.style.cssText = "cursor:pointer;background:#164457;color:#fff;border:1px solid #39768b;border-radius:4px;padding:6px 9px";
materialOptimizerLabel = materialOptimizerButton;
materialOptimizerButton.addEventListener("click", () => {
  if (perfMode === "C" || perfMode === "D") {
    console.warn("Material comparison requires A, B, E or F");
    return;
  }
  materialOptimization.enabled = !materialOptimization.enabled;
  applyMaterialOptimization();
  logMaterialAudit();
});
materialOptimizerPanel.appendChild(materialOptimizerButton);
const materialOptimizerAuditButton = document.createElement("button");
materialOptimizerAuditButton.textContent = "Audit → Console";
materialOptimizerAuditButton.style.cssText = "cursor:pointer;margin-left:6px;background:#122b39;color:#d9f6ff;border:1px solid #39768b;border-radius:4px;padding:6px 9px";
materialOptimizerAuditButton.addEventListener("click", () => logMaterialAudit());
materialOptimizerPanel.appendChild(materialOptimizerAuditButton);
if (diagnosticsEnabled) document.body.appendChild(materialOptimizerPanel);
refreshMaterialOptimizerPanel();
const adaptivePanel = document.createElement("div");
adaptivePanel.style.cssText="position:fixed;right:12px;bottom:12px;z-index:2200;background:#07131de8;color:#d9f6ff;border:1px solid #39768b;border-radius:7px;padding:9px;font:12px monospace";
const adaptiveToggle = document.createElement("button");
adaptiveToggle.style.cssText="cursor:pointer;background:#164457;color:#fff;border:1px solid #39768b;border-radius:4px;padding:6px 9px";
function refreshAdaptivePanel() {
  adaptiveToggle.textContent = `Adaptive ${adaptiveResolution.enabled ? "ON" : "OFF"} · ${adaptiveResolution.currentScale.toFixed(2)}x`;
}
adaptiveToggle.addEventListener("click", () => {
  adaptiveResolution.enabled = !adaptiveResolution.enabled;
  adaptiveResolution.samples.length = 0;
  adaptiveResolution.lowFPSWindows = 0;
  adaptiveResolution.highFPSWindows = 0;
  if (!adaptiveResolution.enabled) {
    adaptiveResolution.currentScale = adaptiveResolution.baseScale;
    engine.setHardwareScalingLevel(adaptiveResolution.baseScale);
  }
  refreshAdaptivePanel();
});
adaptivePanel.appendChild(adaptiveToggle);
if (diagnosticsEnabled) document.body.appendChild(adaptivePanel);
refreshAdaptivePanel();
let lastAdaptivePanelRefresh=0;
let lastBillboardEnabled: boolean | null = null;
let lastAppliedDiagnosticMode = "";
let lastAppliedDiagnosticActive = false;
let last=performance.now();
let lastFpsUpdate = 0;
let lastTransitionDiagnostic = 0;
// Lightweight, always-visible diagnostics during flight (no Inspector required).
const flightStats = document.createElement("div");
flightStats.style.cssText = "position:fixed;left:16px;top:54px;z-index:1100;background:#050a12dd;color:#a8f3ff;padding:8px 10px;border:1px solid #29647a;border-radius:5px;font:12px monospace;pointer-events:none;display:none";
if (diagnosticsEnabled) document.body.appendChild(flightStats);
let lastFlightStats = 0;
const spotlightModeButton = document.createElement("button");
spotlightModeButton.type = "button";
spotlightModeButton.className = "tribuneTeamButton";
spotlightModeButton.textContent = "Unified Spotlight";
spotlightModeButton.setAttribute("aria-pressed", "true");
spotlightModeButton.addEventListener("click", () => {
  unifiedSpotlight = !unifiedSpotlight;
  spotlightModeButton.textContent = unifiedSpotlight ? "Unified Spotlight" : "Legacy Spotlight";
  spotlightModeButton.setAttribute("aria-pressed", String(unifiedSpotlight));
});
if (diagnosticsEnabled) teamList.appendChild(spotlightModeButton);

const benchmark = diagnosticsEnabled ? new PerformanceBenchmark(engine, scene, teamList, (settings) => {
  settings.team = selectedDetailTeam?.config.id ?? null;
  settings.perfMode = perfMode;
  settings.flightTest = flightTest;
  settings.spotlightShaderTest = spotlightShaderTest;
  settings.spotlightMode = unifiedSpotlight ? "unified" : "legacy";
  settings.spotlightOnlyTest = spotlightOnlyTest;
  settings.materialDiagnosticMode = materialDiagnosticMode;
  settings.materialSharing = materialOptimization.enabled;
  settings.adaptive = adaptiveResolution.enabled;
  settings.hardwareScaling = engine.getHardwareScalingLevel();
  settings.renderWidth = engine.getRenderWidth();
  settings.renderHeight = engine.getRenderHeight();
  settings.devicePixelRatio = window.devicePixelRatio;
  settings.bloom = pipeline.bloomEnabled;
  settings.fxaa = pipeline.fxaaEnabled;
  settings.msaaSamples = pipeline.samples;
  settings.highlight = teamHighlight.isEnabled;
  settings.stableShaderFeatures = SETTINGS.stableShaderFeatures;
  settings.spotlightShadows = detailSpot.shadowEnabled;
  settings.billboard = lastBillboardEnabled;
  settings.spotlight = spotlightActive;
  settings.pointerX = !detailMode && pointerInside ? pointer.x : null;
  settings.pointerY = !detailMode && pointerInside ? pointer.y : null;
  settings.camera = scene.activeCamera?.name ?? null;
  settings.cameraAlpha = camera.alpha;
  settings.cameraBeta = camera.beta;
  settings.cameraRadius = camera.radius;
  settings.cameraTargetX = camera.target.x;
  settings.cameraTargetY = camera.target.y;
  settings.cameraTargetZ = camera.target.z;
  settings.cameraFov = camera.fov;
  settings.freeDetailCamera = false;
  settings.warmingMaterials = warmingMaterials;
  return cameraTransition ? "flight" : detailMode ? "detail" : "overview";
}, () => {
  if (!worldLoaded || !introFinished) return "Wait for the scene to load.";
  if (loadedModelCount !== TEAMS.length + 5) return "Benchmark requires all stadium and team GLBs.";
  if (cameraTransition || warmingMaterials) return "Wait for the flight or warmup to finish.";
  const environmentReady = scene.environmentTexture?.isReady() ?? false;
  if (!environmentReady || !scene.isReady(true)) {
    logBenchmarkReadiness(scene, environmentReady);
    return "Wait for textures and shaders to finish loading.";
  }
  return null;
}) : null;
const frame = ()=>{
  const now=performance.now();
  const rawFrameMs = now-last;
  const dt=Math.min(.1,rawFrameMs/1000);
  last=now;
  updateAdaptiveResolution(rawFrameMs, now, !!cameraTransition);
  if (diagnosticsEnabled && now-lastAdaptivePanelRefresh>1000) {
    refreshAdaptivePanel();
    lastAdaptivePanelRefresh=now;
  }
  // Orbit the camera slowly around the stadium after the intro.
  if (introFinished && !detailMode && !cameraTransition) camera.alpha += SETTINGS.cameraRotationDegreesPerSecond * Math.PI / 180 * dt;
  updateCameraTransition(dt);
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
  const flightLightingBlend = flightTest === "FIXED_LIGHT" && cameraTransition
    ? (returningToOverview ? 1 : 0) : detailBlend;
  const detailSun = spotlightOnlyTest ? 0 : SETTINGS.detailSunIntensity;
  const detailAmbient = spotlightOnlyTest ? 0 : SETTINGS.detailAmbientIntensity;
  const detailEnvironment = spotlightOnlyTest ? 0 : SETTINGS.detailEnvironmentIntensity;
  sun.intensity = overviewSunIntensity + (detailSun - overviewSunIntensity) * flightLightingBlend;
  ambient.intensity = overviewAmbientIntensity + (detailAmbient - overviewAmbientIntensity) * flightLightingBlend;
  scene.environmentIntensity = overviewEnvironmentIntensity + (detailEnvironment - overviewEnvironmentIntensity) * flightLightingBlend;
  // Delay the abrupt ACES switch until the close-up is mostly revealed.
  if (!SETTINGS.stableShaderFeatures) imageProcessing.toneMappingEnabled = detailBlend > 0.90;
  imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
  // Hold the previous grade during flight to avoid invalidating materials each frame.
  if (!cameraTransition) {
    imageProcessing.exposure = detailMode ? SETTINGS.detailExposure : overviewExposure;
    imageProcessing.contrast = detailMode ? SETTINGS.detailContrast : overviewContrast;
  }
  if (!SETTINGS.stableShaderFeatures) imageProcessing.colorCurvesEnabled = detailBlend > 0.98;
  // Aerial perspective is used only for the realistic close-up.
  // Avoid switching fog shader variants at the start of the camera flight.
  if (!SETTINGS.stableShaderFeatures) scene.fogMode = detailBlend > 0.90 ? Scene.FOGMODE_EXP2 : Scene.FOGMODE_NONE;
  if (!SETTINGS.stableShaderFeatures) scene.fogDensity = SETTINGS.detailFogDensity * Math.max(0, (detailBlend - 0.90) / 0.10);
  // Keep a focused light on the chosen house. Fade it together with the camera transition.
  spotlight.intensity = (spotlightOnlyTest ? 100 : SETTINGS.detailSpotIntensity) * flightLightingBlend;
  detailSpot.intensity = spotlight.intensity;
  if (selectedDetailTeam) {
    const center = selectedDetailTeam.center;
    // Place the actual Babylon SpotLight over the middle of the PITCH,
    // not over the roof and not behind the selected house.
    const lightPosition = spotlight.position.set(
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
    const direction = center.subtractToRef(lightPosition, spotlight.direction);
    const beamDistance = direction.length();
    if (beamDistance > 1e-6) direction.scaleInPlace(1 / beamDistance);
    else direction.set(0, -1, 0);
    const halfWidth = selectedDetailTeam.radius * SETTINGS.detailSpotFocusMargin;
    const targetAngle = Math.max(
      SETTINGS.detailSpotMinAngle,
      Math.min(SETTINGS.detailSpotMaxAngle, 2 * Math.atan2(halfWidth, beamDistance))
    );
    const easedFocus = detailBlend * detailBlend * (3 - 2 * detailBlend);
    spotlight.angle = spotlightOnlyTest ? 2.4 :
      SETTINGS.detailSpotAngle + (targetAngle - SETTINGS.detailSpotAngle) * easedFocus;
    spotlight.range = spotlightOnlyTest ? 1000 :
      Math.max(250, beamDistance + selectedDetailTeam.radius * 3);
    detailSpot.position.copyFrom(spotlight.position);
    detailSpot.direction.copyFrom(spotlight.direction);
    detailSpot.angle = spotlight.angle;
    detailSpot.range = spotlight.range;
    const outerCos = Math.cos(spotlight.angle * 0.5);
    const innerCos = Math.cos(spotlight.angle * 0.5 * (1 - spotlight.softness));
    spotlight.coneLimits.set(outerCos * outerCos, innerCos * innerCos, spotlight.range * spotlight.range);
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
  const billboardEnabled = detailMode || spotlightActive || highlightAmount > 0.01;
  if (billboardEnabled !== lastBillboardEnabled) {
    for (const mesh of billboardMeshes) mesh.setEnabled(billboardEnabled);
    lastBillboardEnabled = billboardEnabled;
  }
  updateTeamHighlight();
  // Apply only when the active test/transition changes (no shader rebuild each frame).
  if (lastAppliedDiagnosticMode !== materialDiagnosticMode || lastAppliedDiagnosticActive !== (detailMode && !returningToOverview && !cameraTransition && selectedDetailTeam?.config.id === "carabell")) {
    applyMaterialDiagnostic();
    lastAppliedDiagnosticMode = materialDiagnosticMode;
    lastAppliedDiagnosticActive = !!(detailMode && !returningToOverview && !cameraTransition && selectedDetailTeam?.config.id === "carabell");
  }
  // Keep substituted materials when the Carabell diagnostic changes them.
  if (perfMode === "C" || perfMode === "D") {
    for (const mesh of perfOriginalMaterials.keys()) {
      const expected = perfMode === "C" ? perfFlatMaterial : importedMaterialByMesh.get(mesh);
      if (!mesh.isDisposed() && expected && mesh.material !== expected) mesh.material = expected;
    }
  }
  const perfRenderStart = diagnosticsEnabled ? performance.now() : 0;
  scene.render();
  if (!benchmark) return;
  const renderMs = performance.now() - perfRenderStart;
  const drawCalls = benchmark.drawCalls;
  benchmark.recordFrame(now, rawFrameMs, renderMs, drawCalls);
  recordPerfFrame(renderMs, drawCalls);
  if (cameraTransition && now-lastFlightStats > 250) {
    flightStats.textContent = `FLIGHT ${engine.getFps().toFixed(0)} FPS | ${scene.getActiveMeshes().length} meshes | shadows ${detailSpot.shadowEnabled ? "on" : "off"}`;
    lastFlightStats = now;
  }
  flightStats.style.display = cameraTransition ? "block" : "none";
  if (cameraTransition && now - lastTransitionDiagnostic > 1000) {
    console.log("TRIBUNE TRANSITION PERF", {
      fps: Math.round(engine.getFps()),
      frameMs: Number((1000 / Math.max(1, engine.getFps())).toFixed(1)),
      drawCalls,
      activeMeshes: scene.getActiveMeshes().length,
      spotlightShadows: detailSpot.shadowEnabled,
      spotlightCasters: detailSpotShadows.getShadowMap()?.renderList?.length ?? 0,
      projectionBlend: Number(projectionBlend.toFixed(2)),
      detailBlend: Number(detailBlend.toFixed(2)),
      shaderFeaturesFixed: SETTINGS.stableShaderFeatures,
      toneMapping: imageProcessing.toneMappingEnabled,
      fogMode: scene.fogMode,
    });
    lastTransitionDiagnostic = now;
  }
  // The FPS counter does not need a DOM update on every rendered frame.
  if (now - lastFpsUpdate >= 250) {
    fpsCounter.textContent="FPS: "+engine.getFps().toFixed(0);
    lastFpsUpdate = now;
  }
};
// Render only while the stadium is on screen and the tab is visible.
let onScreen = false;
let running = false;
const syncLoop = () => {
  const shouldRun = onScreen && !document.hidden;
  if (shouldRun && !running) { last = performance.now(); engine.runRenderLoop(frame); running = true; }
  if (!shouldRun && running) { engine.stopRenderLoop(frame); running = false; }
};
const visibility = new IntersectionObserver(entries => {
  onScreen = entries.some(e => e.isIntersecting);
  syncLoop();
}, { threshold: 0.05 });
visibility.observe(root);
document.addEventListener("visibilitychange", syncLoop);
// Press P to compile visible model materials before repeating a flight.
// This is optional because forcing compilation of hundreds of materials can
// itself cause a noticeable one-off pause. Compare first and second flights.
let warmingMaterials = false;
window.addEventListener("keydown", async (event) => {
  if (!diagnosticsEnabled || event.key.toLowerCase() !== "p" || event.repeat || warmingMaterials) return;
  warmingMaterials = true;
  const materialMeshes = new Map<Material, Mesh>();
  for (const mesh of atmosphereByMesh.keys()) if (mesh.material && !materialMeshes.has(mesh.material)) materialMeshes.set(mesh.material, mesh);
  const candidates = [...materialMeshes.keys()];
  let completed = 0;
  const started = performance.now();
  console.log("TRIBUNE WARMUP START", candidates.length, "materials");
  for (const material of candidates) {
    const mesh = materialMeshes.get(material);
    if (!mesh) continue;
    try {
      // Babylon materials may support forceCompilationAsync; skip if unavailable.
      const compilable = material as Material & { forceCompilationAsync?: (mesh: Mesh) => Promise<unknown> };
      if (compilable.forceCompilationAsync) await compilable.forceCompilationAsync(mesh);
    } catch (error) { console.warn("TRIBUNE WARMUP MATERIAL FAILED", material.name, error); }
    completed++;
    if (completed % 25 === 0) {
      console.log("TRIBUNE WARMUP", completed, "/", candidates.length);
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  }
  console.log("TRIBUNE WARMUP DONE", completed, "materials", Math.round(performance.now() - started), "ms");
  warmingMaterials = false;
});
void loadWorld().then(() => {
  logMaterialAudit();
  // Reapply after all GLBs and MaskPlugin material clones have been created.
  scene.materials.forEach(forceStandardLightFalloff);
  worldLoaded = true;
  console.log("TRIBUNE V5 READY — P: optional shader warmup; fixed shader features:", SETTINGS.stableShaderFeatures);
  console.log("STANDARD LIGHT FALLOFF:", scene.materials.filter(m => m instanceof PBRMaterial && !m.usePhysicalLightFalloff).length, "PBR materials configured");
});
function dispose() {
  visibility.disconnect();
  document.removeEventListener("visibilitychange", syncLoop);
  window.removeEventListener("keydown", onKeyEscape);
  window.removeEventListener("resize", resizeViewport);
  engine.stopRenderLoop();
  engine.dispose();
  layout.remove();
}
return { dispose };
}
