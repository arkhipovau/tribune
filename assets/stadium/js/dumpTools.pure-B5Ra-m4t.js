import { d as e, t } from "./math.scalar.functions-D7lyzZPV.js";
import { S as n, r, x as i } from "./decorators-BI9FueCZ.js";
import { t as a } from "./engineStore-D0BoPdea.js";
import { t as o } from "./logger-DQIzSR_y.js";
import { C as s, r as c } from "./tools.pure-HxVNGKAP.js";
import { n as l, t as u } from "./effectRenderer.pure-BRdUbEYc.js";
//#region node_modules/@babylonjs/core/Misc/dumpTools.pure.js
var d = /* @__PURE__ */ e({
	Dispose: () => b,
	DumpData: () => y,
	DumpDataAsync: () => v,
	DumpFramebuffer: () => _,
	DumpTools: () => x,
	EncodeImageAsync: () => g,
	RegisterDumpTools: () => C
}), f = null;
async function p() {
	let e = a.LastCreatedEngine?.createCanvas(100, 100) ?? new OffscreenCanvas(100, 100);
	e instanceof OffscreenCanvas && o.Warn("DumpData: OffscreenCanvas will be used for dumping data. This may result in lossy alpha values.");
	let { ThinEngine: t } = await import("./thinEngine.pure-DqiSVI2K.js").then((e) => e.n);
	if (!t.IsSupported) throw Error("DumpData: No WebGL context available. Cannot dump data.");
	let n = new t(e, !1, {
		preserveDrawingBuffer: !0,
		depth: !1,
		stencil: !1,
		alpha: !0,
		premultipliedAlpha: !1,
		antialias: !1,
		failIfMajorPerformanceCaveat: !1
	});
	a.Instances.pop(), a.OnEnginesDisposedObservable.add((e) => {
		n && e !== n && !n.isDisposed && a.Instances.length === 0 && b();
	}), n.getCaps().parallelShaderCompile = void 0;
	let r = new u(n), { passPixelShader: i } = await import("./pass.fragment-DUzd5yX2.js");
	return {
		canvas: e,
		dumpEngine: {
			engine: n,
			renderer: r,
			wrapper: new l({
				engine: n,
				name: i.name,
				fragmentShader: i.shader,
				samplerNames: ["textureSampler"]
			})
		}
	};
}
async function m() {
	return f || (f = p()), await f;
}
var h = (() => {
	var e;
	let t = [], a;
	return e = class {
		static async EncodeImageAsync(e, t, n, r, i, a) {
			let o = await m(), s = o.dumpEngine;
			s.engine.setSize(t, n, !0);
			let l = s.engine.createRawTexture(e, t, n, 5, !1, !i, 1);
			return s.renderer.setViewport(), s.renderer.applyEffectWrapper(s.wrapper), s.wrapper.effect._bindTexture("textureSampler", l), s.renderer.draw(), l.dispose(), await new Promise((e, t) => {
				c.ToBlob(o.canvas, (n) => {
					n ? e(n) : t(/* @__PURE__ */ Error("EncodeImageAsync: Failed to convert canvas to blob."));
				}, r, a);
			});
		}
	}, (() => {
		let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(null) : void 0;
		a = [r], i(e, null, a, {
			kind: "method",
			name: "EncodeImageAsync",
			static: !0,
			private: !1,
			access: {
				has: (e) => "EncodeImageAsync" in e,
				get: (e) => e.EncodeImageAsync
			},
			metadata: o
		}, null, t), o && Object.defineProperty(e, Symbol.metadata, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: o
		}), n(e, t);
	})(), e;
})(), g = h.EncodeImageAsync;
async function _(e, t, n, r, i = "image/png", a, o) {
	let s = await n.readPixels(0, 0, e, t);
	y(e, t, new Uint8Array(s.buffer), r, i, a, !0, void 0, o);
}
async function v(e, n, r, i = "image/png", a, l = !1, u = !1, d) {
	if (r instanceof Float32Array) {
		let e = new Uint8Array(r.length), n = r.length;
		for (; n--;) {
			let i = r[n];
			e[n] = Math.round(t(i) * 255);
		}
		r = e;
	}
	let f = await h.EncodeImageAsync(r, e, n, i, l, d);
	a !== void 0 && c.DownloadBlob(f, a), f.type !== i && o.Warn(`DumpData: The requested mimeType '${i}' is not supported. The result has mimeType '${f.type}' instead.`);
	let p = await f.arrayBuffer();
	return u ? p : `data:${i};base64,${s(p)}`;
}
function y(e, t, n, r, i = "image/png", a, o = !1, s = !1, c) {
	a === void 0 && !r && (a = ""), v(e, t, n, i, a, o, s, c).then((e) => {
		r && r(e);
	});
}
function b() {
	f && (f?.then((e) => {
		e.canvas instanceof HTMLCanvasElement && e.canvas.remove(), e.dumpEngine && (e.dumpEngine.engine.dispose(), e.dumpEngine.renderer.dispose(), e.dumpEngine.wrapper.dispose());
	}), f = null);
}
var x = {
	DumpData: y,
	DumpDataAsync: v,
	DumpFramebuffer: _,
	Dispose: b
}, S = !1;
function C() {
	S || (S = !0, c.DumpData = y, c.DumpDataAsync = v, c.DumpFramebuffer = _);
}
//#endregion
export { d as t };
