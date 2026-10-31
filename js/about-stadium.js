// About page: the manifesto as a stadium. Each stand is a curved, sloped
// surface with text printed on it, arranged around a pitch.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const STANDS = window.TRIBUNE_MANIFESTO || [];

const COLORS = {
  bg: "#f0f0f0",
  ground: "#e8e6e2",
  stand: "#f7f6f3",
  standRow: "rgba(23, 16, 14, 0.05)",
  wall: "#dedad4",
  ink: "#17100e",
  inkSoft: "rgba(23, 16, 14, 0.55)",
  pitch: "#c8edbd",
  pitchLine: "#ffffff",
};

// Stadium geometry, in metres-ish scene units. Pitch is 6.8 x 10.5.
const PITCH = { w: 6.8, l: 10.5 };
const BOWL = { inner: 7.5, outer: 13, height: 4.5, lift: 0.15 };
const ARC = THREE.MathUtils.degToRad(78);
// Many height segments keep text rows straight: one trapezoid per stand warps the texture.
const STAND_ROWS = 32;
const TEX = { w: 3072, h: 1566, pad: 100, title: 150, titleGap: 70, body: 40, lead: 60, col: 1300, ink: "rgba(23, 16, 14, 0.78)" };

const FOCUS_MS = 1200;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const canvas = document.querySelector(".arena__canvas");
const arena = document.querySelector(".arena");
const loading = document.querySelector(".arena__loading");
const standNav = document.querySelector(".arena__stands");

/** Unit vector pointing from the centre to a stand. 0° = far side, 90° = right. */
const dirOf = (deg) => {
  const a = THREE.MathUtils.degToRad(deg);
  return new THREE.Vector3(Math.sin(a), 0, -Math.cos(a));
};

/* ---------- textures drawn on 2D canvases ---------- */

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function standTexture(stand, anisotropy) {
  const c = document.createElement("canvas");
  c.width = TEX.w;
  c.height = TEX.h;
  const ctx = c.getContext("2d");

  ctx.fillStyle = COLORS.stand;
  ctx.fillRect(0, 0, TEX.w, TEX.h);
  // Seat rows
  ctx.fillStyle = COLORS.standRow;
  for (let y = 0; y < TEX.h; y += TEX.lead * 1.5) ctx.fillRect(0, y, TEX.w, 3);

  ctx.fillStyle = COLORS.ink;
  ctx.textBaseline = "top";

  ctx.font = `450 ${TEX.body}px "Suisse Intl", sans-serif`;
  // One narrow centred column, centre-aligned, with balanced line lengths
  // (like CSS text-wrap: balance): each paragraph keeps its line count at the
  // narrowest width that allows it, so no line ends with a lonely word.
  const colWidth = TEX.col;
  const balanced = (text) => {
    const lines = wrapLines(ctx, text, colWidth).length;
    let lo = colWidth * 0.5, hi = colWidth;
    for (let i = 0; i < 14; i += 1) {
      const mid = (lo + hi) / 2;
      if (wrapLines(ctx, text, mid).length > lines) lo = mid; else hi = mid;
    }
    return wrapLines(ctx, text, hi);
  };
  const paraGap = TEX.lead; // one empty line between paragraphs
  const paras = stand.paragraphs.map(balanced);
  const bodyH = paras.reduce((h, lines, i) => h + lines.length * TEX.lead + (i ? paraGap : 0), 0);

  // Centre title + body vertically on the stand.
  const blockH = TEX.title + TEX.titleGap + bodyH;
  const shift = Math.max(0, (TEX.h - blockH) / 2 - TEX.pad);

  ctx.textAlign = "center";
  ctx.font = `500 ${TEX.title}px Youth, sans-serif`;
  ctx.letterSpacing = "-0.05em";
  ctx.fillText(stand.title, TEX.w / 2, TEX.pad + shift);
  ctx.letterSpacing = "0px";
  ctx.font = `450 ${TEX.body}px "Suisse Intl", sans-serif`;
  ctx.fillStyle = TEX.ink; // body a shade lighter than the title

  let y = TEX.pad + shift + TEX.title + TEX.titleGap;
  paras.forEach((lines, i) => {
    if (i) y += paraGap;
    lines.forEach((line) => { ctx.fillText(line, TEX.w / 2, y); y += TEX.lead; });
  });
  ctx.textAlign = "left";

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  // Seen from inside the bowl, so mirror horizontally to read left-to-right.
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = -1;
  tex.offset.x = 1;
  return tex;
}

function pitchTexture() {
  const s = 100; // px per unit
  const c = document.createElement("canvas");
  c.width = PITCH.w * s;
  c.height = PITCH.l * s;
  const ctx = c.getContext("2d");
  ctx.fillStyle = COLORS.pitch;
  ctx.fillRect(0, 0, c.width, c.height);
  // Mowing stripes
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 10; i += 2) ctx.fillRect(0, (i * c.height) / 10, c.width, c.height / 10);

  ctx.strokeStyle = COLORS.pitchLine;
  ctx.lineWidth = 6;
  const m = 20;
  const W = c.width - m * 2;
  const L = c.height - m * 2;
  ctx.strokeRect(m, m, W, L);
  ctx.beginPath(); ctx.moveTo(m, c.height / 2); ctx.lineTo(c.width - m, c.height / 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(c.width / 2, c.height / 2, 0.87 * s, 0, Math.PI * 2); ctx.stroke();
  const boxW = W * 0.6;
  const boxL = L * 0.16;
  const goalW = W * 0.28;
  const goalL = L * 0.055;
  [m, c.height - m].forEach((edge, i) => {
    const dir = i === 0 ? 1 : -1;
    ctx.strokeRect((c.width - boxW) / 2, edge, boxW, dir * boxL);
    ctx.strokeRect((c.width - goalW) / 2, edge, goalW, dir * goalL);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------- scene ---------- */

function buildScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.Fog(COLORS.bg, 40, 90);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(60, 96),
    new THREE.MeshBasicMaterial({ color: COLORS.ground }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(PITCH.w, PITCH.l),
    new THREE.MeshBasicMaterial({ map: pitchTexture() }),
  );
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = 0.01;
  scene.add(pitch);

  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const standMeshes = STANDS.map((stand) => {
    // CylinderGeometry measures theta from +z towards +x; convert from our "0 = far side" angle.
    const theta = Math.PI - THREE.MathUtils.degToRad(stand.angle);
    const geo = new THREE.CylinderGeometry(BOWL.outer, BOWL.inner, BOWL.height, 96, STAND_ROWS, true, theta - ARC / 2, ARC);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: standTexture(stand, anisotropy), side: THREE.DoubleSide }));
    mesh.position.y = BOWL.height / 2 + BOWL.lift;
    mesh.userData.stand = stand;
    scene.add(mesh);

    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(BOWL.outer, BOWL.outer, BOWL.height + BOWL.lift, 64, 1, true, theta - ARC / 2, ARC),
      new THREE.MeshBasicMaterial({ color: COLORS.wall, side: THREE.DoubleSide }),
    );
    wall.position.y = (BOWL.height + BOWL.lift) / 2;
    scene.add(wall);
    return mesh;
  });

  return { scene, standMeshes };
}

/* ---------- camera moves ---------- */

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Three-quarter view of each stand: from the stand's normal (so the text faces us)
// swung sideways and slightly lowered, for a more cinematic, angled close-up.
const VIEW_DISTANCE = 18;
const VIEW_SWING = THREE.MathUtils.degToRad(16);
function viewFor(stand) {
  const d = dirOf(stand.angle);
  const mid = (BOWL.inner + BOWL.outer) / 2;
  const centre = d.clone().multiplyScalar(mid).add(new THREE.Vector3(0, BOWL.lift + BOWL.height / 2, 0));
  const run = BOWL.outer - BOWL.inner;
  const slope = Math.hypot(run, BOWL.height);
  const normal = d.clone().multiplyScalar(-BOWL.height / slope).add(new THREE.Vector3(0, run / slope, 0));
  const side = new THREE.Vector3(-d.z, 0, d.x); // horizontal, along the stand
  const dir = normal.multiplyScalar(Math.cos(VIEW_SWING)).add(side.multiplyScalar(Math.sin(VIEW_SWING))).normalize();
  dir.y *= 0.92; // a touch lower than the normal
  return { target: centre, position: centre.clone().add(dir.normalize().multiplyScalar(VIEW_DISTANCE)) };
}

const OVERVIEW = { position: new THREE.Vector3(0, 34, 22), target: new THREE.Vector3(0, 0, 0) };

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (error) {
    arena.classList.add("arena--no-webgl");
    loading.textContent = "3D is not available in this browser — read the manifesto as text.";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  camera.position.copy(OVERVIEW.position);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(OVERVIEW.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4;
  controls.maxDistance = 48;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.autoRotate = !prefersReducedMotion;
  controls.autoRotateSpeed = 0.35;
  controls.addEventListener("start", () => { controls.autoRotate = false; flight = null; });

  const { scene, standMeshes } = buildScene(renderer);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resize);
  resize();

  /* Flights between views */
  let flight = null;
  function flyTo(view) {
    controls.autoRotate = false;
    if (prefersReducedMotion) {
      camera.position.copy(view.position);
      controls.target.copy(view.target);
      return;
    }
    flight = {
      from: { position: camera.position.clone(), target: controls.target.clone() },
      to: view,
      t0: performance.now(),
    };
  }

  const buttons = new Map();
  function focusStand(stand) {
    flyTo(viewFor(stand));
    buttons.forEach((b, id) => b.setAttribute("aria-pressed", String(id === stand.id)));
  }

  const overview = document.createElement("button");
  overview.type = "button";
  overview.className = "pill__item";
  overview.textContent = "Overview";
  overview.addEventListener("click", () => {
    flyTo(OVERVIEW);
    buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
  });
  standNav.append(overview);
  STANDS.forEach((stand) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pill__item";
    b.textContent = stand.title.charAt(0).toUpperCase() + stand.title.slice(1);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => focusStand(stand));
    buttons.set(stand.id, b);
    standNav.append(b);
  });

  /* Click (not drag) on a stand flies to it */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downAt = null;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(standMeshes)[0];
    return hit ? hit.object.userData.stand : null;
  };
  canvas.addEventListener("pointerdown", (e) => { downAt = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener("pointerup", (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) return;
    const stand = pick(e);
    if (stand) focusStand(stand);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.buttons) return;
    canvas.style.cursor = pick(e) ? "pointer" : "grab";
  });

  const tick = () => {
    if (flight) {
      // Same clock as flight.t0; clamp so a late/early frame can't overshoot.
      const k = THREE.MathUtils.clamp((performance.now() - flight.t0) / FOCUS_MS, 0, 1);
      const e = easeInOut(k);
      camera.position.lerpVectors(flight.from.position, flight.to.position, e);
      controls.target.lerpVectors(flight.from.target, flight.to.target, e);
      if (k === 1) flight = null;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  arena.classList.add("is-ready");

  const initial = STANDS.find((s) => `#${s.id}` === window.location.hash);
  if (initial) window.setTimeout(() => focusStand(initial), 600);
}

// Canvas text needs the web fonts before drawing.
Promise.all([
  document.fonts.load('500 150px "Youth"'),
  document.fonts.load('450 40px "Suisse Intl"'),
]).catch(() => {}).finally(start);
