// Deep imports (embedded build): the barrel import pulled all of Babylon into the bundle.
import { EngineInstrumentation } from "@babylonjs/core/Instrumentation/engineInstrumentation";
import { SceneInstrumentation } from "@babylonjs/core/Instrumentation/sceneInstrumentation";
import { MultiMaterial } from "@babylonjs/core/Materials/multiMaterial";
import type { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import type { Effect } from "@babylonjs/core/Materials/effect";
import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Material } from "@babylonjs/core/Materials/material";
import type { Scene } from "@babylonjs/core/scene";

function logUnreadyWebGLEffects(scene: Scene, rowLimit: number) {
  // Temporary Babylon.js 9.29 diagnostic. Never use this cache to decide benchmark admission.
  const engine = scene.getEngine() as unknown as { _compiledEffects?: Record<string, Effect> };
  if (!engine._compiledEffects) {
    console.log("Not-ready WebGL effects: cache unavailable");
    return;
  }

  const unready = new Map<Effect, Set<string>>();
  for (const effect of Object.values(engine._compiledEffects)) {
    if (!effect.isReady()) unready.set(effect, new Set());
  }

  const debugEffects = new Map([
    ["DEBUG_spot_source", new Set<Effect>()],
    ["DEBUG_spot_target", new Set<Effect>()],
  ]);
  function link(effect: Effect | null, meshName: string, material: Material | null) {
    if (!effect) return;
    const owners = unready.get(effect);
    if (!owners) return;
    owners.add(`${meshName} / ${material?.name ?? "(no material)"}`);
    debugEffects.get(meshName)?.add(effect);
  }

  if (unready.size) {
    for (const mesh of scene.meshes) {
      const material = mesh.material;
      link(material?.getEffect() ?? null, mesh.name, material);
      for (const subMesh of mesh.subMeshes ?? []) {
        const subMaterial = material instanceof MultiMaterial
          ? material.subMaterials[subMesh.materialIndex] ?? null
          : material;
        link(subMesh.effect, mesh.name, subMaterial);
        link(subMaterial?.getEffect() ?? null, mesh.name, subMaterial);
      }
    }
  }

  const rows = [];
  let unattributed = 0;
  for (const [effect, owners] of unready) {
    if (!owners.size) unattributed++;
    if (rows.length < rowLimit) {
      rows.push({
        uniqueId: effect.uniqueId,
        shader: effect.name,
        compilationError: effect.getCompilationError(),
        "mesh / material": owners.size ? Array.from(owners).slice(0, 3).join("; ") : "unattributed (unknown)",
        ownerCount: owners.size,
      });
    }
  }
  console.log("Not-ready WebGL effects", { total: unready.size, shown: rows.length, unattributed });
  console.table(rows);
  console.table(Array.from(debugEffects, ([mesh, effects]) => ({
    mesh,
    matchedUnreadyEffects: effects.size,
    uniqueIds: Array.from(effects).slice(0, rowLimit).map(effect => effect.uniqueId).join(", "),
  })));
}

export function logBenchmarkReadiness(scene: Scene, environmentReady: boolean) {
  const rowLimit = 20;
  console.groupCollapsed("TRIBUNE BENCHMARK READINESS");
  try {
    const environment = scene.environmentTexture;
    console.log("Start blocked by", environmentReady ? "scene.isReady(true)" : "environmentTexture.isReady()");
    console.log("environmentTexture", environment ? {
      name: environment.name,
      url: "url" in environment ? environment.url : undefined,
      isReady: environmentReady,
      loadingError: environment.loadingError,
      errorObject: environment.errorObject,
    } : null);

    // Capture these signals before the extra scene and mesh readiness probes can compile shaders.
    const pendingCount = scene.getWaitingItemsCount();
    const isLoading = scene.isLoading;
    const effectsReady = scene.getEngine().areAllEffectsReady();
    logUnreadyWebGLEffects(scene, rowLimit);
    const active = scene.getActiveMeshes();
    const activeMeshes = new Set(active.data.slice(0, active.length));
    let textureCount = 0;
    const textures = [];
    for (const texture of scene.textures) {
      if (texture === environment ? environmentReady : texture.isReady()) continue;
      textureCount++;
      if (textures.length < rowLimit) {
        textures.push({
          name: texture.name,
          url: "url" in texture ? texture.url : undefined,
          isReady: false,
          isBlocking: texture.isBlocking,
        });
      }
    }
    if (environment && !environmentReady && !scene.textures.includes(environment)) textureCount++;

    console.log("Scene readiness", {
      "scene.isReady(false)": scene.isReady(false),
      "scene.isReady(true)": scene.isReady(true),
      "scene.getWaitingItemsCount()": pendingCount,
      "scene.isLoading": isLoading,
      "engine.areAllEffectsReady()": effectsReady,
    });

    let meshCount = 0;
    const meshes = [];
    for (const mesh of scene.meshes) {
      if (mesh.isReady(true)) continue;
      meshCount++;
      if (meshes.length < rowLimit) {
        meshes.push({
          name: mesh.name,
          isEnabled: mesh.isEnabled(),
          active: activeMeshes.has(mesh),
          material: mesh.material?.name ?? null,
        });
      }
    }
    console.log("Problem resources", {
      total: textureCount + meshCount,
      textures: textureCount,
      meshes: meshCount,
      pendingItems: pendingCount,
    });
    console.log(`Not-ready textures (showing ${textures.length}/${textureCount}; see environment above)`);
    console.table(textures);
    console.log(`Not-ready meshes (showing ${meshes.length}/${meshCount})`);
    console.table(meshes);
  } catch (error) {
    console.warn("Readiness diagnostic failed", error);
  } finally {
    console.groupEnd();
  }
}

const durationMs = 15_000;
const maxFrames = 16_384;

type Settings = Record<string, string | number | boolean | null>;
type Mode = "overview" | "detail" | "flight";

type PassDraws = { refraction: number; highlight: number; shadow: number };

type Capture = {
  mode: Mode;
  parameters: Settings;
  startedAt: number | null;
  frameTimes: Float64Array;
  frames: number;
  frameTimeSum: number;
  cpuSum: number;
  cpuMax: number;
  drawsSum: number;
  passDraws: PassDraws;
  drawsMax: number;
  activeMeshesSum: number;
  activeMaterialsSum: number;
  activeTexturesSum: number;
  gpu: EngineInstrumentation | null;
  gpuCounterCount: number;
  gpuSamples: number;
  gpuSum: number;
  gpuMax: number;
  skipFirstGpuResult: boolean;
  inventory: { meshes: number; materials: number; textures: number };
};

function percentile(sorted: Float64Array, fraction: number) {
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  return sorted[lower] + (sorted[Math.ceil(position)] - sorted[lower]) * (position - lower);
}

export class PerformanceBenchmark {
  private readonly sceneInstrumentation: SceneInstrumentation;
  private readonly settings: Settings = {};
  private materials = new WeakMap<Material, { frame: number; textures: BaseTexture[] }>();
  private textures = new WeakMap<BaseTexture, number>();
  private capture: Capture | null = null;
  private gpuUsed = false;
  private resultJson = "";
  private readonly startButton = document.createElement("button");
  private readonly copyButton = document.createElement("button");
  private readonly status = document.createElement("span");
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly readSettings: (settings: Settings) => Mode;

  constructor(
    engine: Engine,
    scene: Scene,
    container: HTMLElement,
    readSettings: (settings: Settings) => Mode,
    canStart: () => string | null,
  ) {
    this.engine = engine;
    this.scene = scene;
    this.readSettings = readSettings;
    this.sceneInstrumentation = new SceneInstrumentation(scene);
    this.startButton.type = this.copyButton.type = "button";
    this.startButton.className = this.copyButton.className = "tribuneTeamButton";
    this.startButton.textContent = "Benchmark (15 s)";
    this.copyButton.textContent = "Copy JSON";
    this.copyButton.disabled = true;
    this.status.setAttribute("role", "status");
    const controls = document.createElement("div");
    controls.append(this.startButton, this.copyButton, this.status);
    container.appendChild(controls);

    this.startButton.addEventListener("click", () => {
      const reason = canStart();
      if (reason) {
        this.status.textContent = reason;
        return;
      }
      this.start();
    });
    this.copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.resultJson);
        this.status.textContent = "JSON copied";
      } catch {
        this.status.textContent = "Clipboard unavailable. Copy JSON from the console.";
      }
    });
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    scene.onDisposeObservable.addOnce(() => {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.finish("Scene disposed", performance.now());
      this.sceneInstrumentation.dispose();
      controls.remove();
    });
  }

  get drawCalls() {
    return this.sceneInstrumentation.drawCallsCounter.current;
  }

  private readonly onVisibilityChange = () => {
    if (document.hidden) this.finish("Tab hidden", performance.now());
  };

  private start() {
    if (this.capture) return;
    const mode = this.readSettings(this.settings);
    if (mode === "flight") {
      this.status.textContent = "Wait for the camera flight to finish.";
      return;
    }
    const gpu = this.engine.getCaps().timerQuery ? new EngineInstrumentation(this.engine) : null;
    const { meshes, materials, textures } = this.scene;
    this.capture = {
      mode,
      parameters: { ...this.settings },
      startedAt: null,
      frameTimes: new Float64Array(maxFrames),
      frames: 0,
      frameTimeSum: 0,
      cpuSum: 0,
      cpuMax: 0,
      drawsSum: 0,
      passDraws: { refraction: 0, highlight: 0, shadow: 0 },
      drawsMax: 0,
      activeMeshesSum: 0,
      activeMaterialsSum: 0,
      activeTexturesSum: 0,
      gpu,
      gpuCounterCount: gpu?.gpuFrameTimeCounter.count ?? 0,
      gpuSamples: 0,
      gpuSum: 0,
      gpuMax: 0,
      // Babylon can retain a pending query when capture is disabled.
      skipFirstGpuResult: this.gpuUsed,
      inventory: { meshes: meshes.length, materials: materials.length, textures: textures.length },
    };
    this.startButton.disabled = true;
    this.copyButton.disabled = true;
    this.status.textContent = "Measuring…";
  }

  recordFrame(now: number, frameMs: number, cpuMs: number, drawCalls: number, passes?: PassDraws) {
    const run = this.capture;
    if (!run) return;
    if (this.readSettings(this.settings) !== run.mode) {
      this.finishAfterFrame("Scene mode changed", now);
      return;
    }
    for (const key in this.settings) {
      // Overview orbits continuously in normal use.
      if (key === "cameraAlpha" && run.mode === "overview") continue;
      if (this.settings[key] !== run.parameters[key]) {
        this.finishAfterFrame(`Setting changed: ${key}`, now);
        return;
      }
    }
    if (run.startedAt === null) {
      run.startedAt = now;
      run.parameters.cameraAlpha = this.settings.cameraAlpha;
      if (run.gpu) {
        run.gpu.captureGPUFrameTime = true;
        this.gpuUsed = true;
      }
      return;
    }
    if (run.frames === run.frameTimes.length) {
      this.finishAfterFrame("Frame sample capacity reached", now);
      return;
    }

    run.frameTimes[run.frames++] = frameMs;
    run.frameTimeSum += frameMs;
    run.cpuSum += cpuMs;
    run.cpuMax = Math.max(run.cpuMax, cpuMs);
    run.drawsSum += drawCalls;
    if (passes) {
      run.passDraws.refraction += passes.refraction;
      run.passDraws.highlight += passes.highlight;
      run.passDraws.shadow += passes.shadow;
    }
    run.drawsMax = Math.max(run.drawsMax, drawCalls);
    this.countActiveResources(run);

    const counter = run.gpu?.gpuFrameTimeCounter;
    if (counter && counter.count !== run.gpuCounterCount) {
      run.gpuCounterCount = counter.count;
      if (run.skipFirstGpuResult) {
        run.skipFirstGpuResult = false;
      } else {
        const gpuMs = counter.current / 1e6;
        run.gpuSamples++;
        run.gpuSum += gpuMs;
        run.gpuMax = Math.max(run.gpuMax, gpuMs);
      }
    }
    if (now - run.startedAt >= durationMs) this.finishAfterFrame(null, now);
  }

  private finishAfterFrame(reason: string | null, now: number) {
    // Let Babylon close the current timer query before removing its frame observers.
    this.engine.onEndFrameObservable.addOnce(() => this.finish(reason, now));
  }

  private countActiveResources(run: Capture) {
    const active = this.scene.getActiveMeshes();
    run.activeMeshesSum += active.length;
    for (let index = 0; index < active.length; index++) {
      const mesh = active.data[index];
      const material = mesh.material;
      if (material instanceof MultiMaterial) {
        for (const subMesh of mesh.subMeshes) {
          this.addMaterial(run, material.subMaterials[subMesh.materialIndex]);
        }
      } else {
        this.addMaterial(run, material);
      }
    }
  }

  private addMaterial(run: Capture, material: Material | null | undefined) {
    if (!material) return;
    let entry = this.materials.get(material);
    if (!entry) {
      entry = { frame: 0, textures: material.getActiveTextures() };
      this.materials.set(material, entry);
    }
    if (entry.frame === run.frames) return;
    entry.frame = run.frames;
    run.activeMaterialsSum++;
    for (const texture of entry.textures) {
      if (this.textures.get(texture) === run.frames) continue;
      this.textures.set(texture, run.frames);
      run.activeTexturesSum++;
    }
  }

  private finish(reason: string | null, now: number) {
    const run = this.capture;
    if (!run) return;
    this.capture = null;
    if (run.gpu) {
      // EngineInstrumentation.dispose() alone leaves the engine's GPU observers installed.
      run.gpu.captureGPUFrameTime = false;
      run.gpu.dispose();
    }
    this.materials = new WeakMap();
    this.textures = new WeakMap();

    const frames = run.frames;
    const times = run.frameTimes.subarray(0, frames).sort();
    const metrics = frames ? {
      fps: frames * 1000 / run.frameTimeSum,
      frameTimeMs: { median: percentile(times, 0.5), p95: percentile(times, 0.95) },
      cpuSceneRenderMs: { average: run.cpuSum / frames, maximum: run.cpuMax },
      drawCallsPerFrame: { average: run.drawsSum / frames, maximum: run.drawsMax },
      passDrawCallsAverage: {
        refraction: run.passDraws.refraction / frames,
        highlight: run.passDraws.highlight / frames,
        spotlightShadow: run.passDraws.shadow / frames,
      },
      activeMeshesAverage: run.activeMeshesSum / frames,
      activeMeshMaterialsAverage: run.activeMaterialsSum / frames,
      activeMeshTexturesAverage: run.activeTexturesSum / frames,
      gpuFrameTimeMs: run.gpuSamples ? {
        average: run.gpuSum / run.gpuSamples,
        maximum: run.gpuMax,
      } : "n/a",
    } : null;
    const report = {
      version: 1,
      valid: reason === null,
      invalidReason: reason,
      mode: run.mode,
      targetDurationMs: durationMs,
      elapsedMs: run.startedAt === null ? 0 : now - run.startedAt,
      frames,
      parameters: run.parameters,
      sceneInventoryAtStart: run.inventory,
      gpuTimerSupported: run.gpu !== null,
      gpuSamples: run.gpuSamples,
      metrics,
    };
    this.resultJson = JSON.stringify(report, null, 2);
    this.startButton.disabled = false;
    this.copyButton.disabled = false;
    this.status.textContent = reason ? `Invalid: ${reason}` : "Benchmark complete";
    console.info("[Tribune benchmark]", run.mode, this.status.textContent, metrics);
    console.log(this.resultJson);
  }
}
