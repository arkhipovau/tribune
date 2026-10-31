import { S as e, i as t, s as n, x as r } from "./decorators-BI9FueCZ.js";
import { n as i } from "./engineStore-D0BoPdea.js";
import { l as a } from "./math.color.pure-Da-OlKtz.js";
import { n as o, t as s } from "./typeStore-pENEWnX2.js";
import { n as c } from "./tools.functions-tHn4_qrB.js";
import { t as l } from "./decorators.serialization-B05zOkuo.js";
import { t as u } from "./smartArray-cjjaK9ER.js";
import { n as d } from "./effectRenderer.pure-BRdUbEYc.js";
import { r as f, t as p } from "./abstractEngine.pure-CCvGJkky.js";
//#region node_modules/@babylonjs/core/PostProcesses/postProcess.pure.js
var m = (() => {
	var o;
	let f = [], p, m = [], h = [], g, _, v = [], y = [], b, x = [], S = [], C, w = [], T = [], E, D = [], O = [], k, A = [], j = [], M, N = [], P = [], F, I, L = [], R = [], z, B = [], V = [], H, U = [], W = [], G, K = [], q = [], J, Y = [], X = [], Z, Q = [], $ = [], te, ne = [], re = [];
	return o = class {
		static get ForceGLSL() {
			return d.ForceGLSL;
		}
		static set ForceGLSL(e) {
			d.ForceGLSL = e;
		}
		static RegisterShaderCodeProcessing(e, t) {
			d.RegisterShaderCodeProcessing(e, t);
		}
		get name() {
			return this._effectWrapper.name;
		}
		set name(e) {
			this._effectWrapper.name = e;
		}
		get alphaMode() {
			return this._effectWrapper.alphaMode;
		}
		set alphaMode(e) {
			this._effectWrapper.alphaMode = e;
		}
		get samples() {
			return this._samples;
		}
		set samples(e) {
			this._samples = Math.min(e, this._engine.getCaps().maxMSAASamples), this._textures.forEach((e) => {
				e.setSamples(this._samples);
			});
		}
		get shaderLanguage() {
			return this._shaderLanguage;
		}
		getEffectName() {
			return this._fragmentUrl;
		}
		set onActivate(e) {
			this._onActivateObserver && this.onActivateObservable.remove(this._onActivateObserver), e && (this._onActivateObserver = this.onActivateObservable.add(e));
		}
		set onSizeChanged(e) {
			this._onSizeChangedObserver && this.onSizeChangedObservable.remove(this._onSizeChangedObserver), this._onSizeChangedObserver = this.onSizeChangedObservable.add(e);
		}
		set onApply(e) {
			this._onApplyObserver && this.onApplyObservable.remove(this._onApplyObserver), this._onApplyObserver = this.onApplyObservable.add(e);
		}
		set onBeforeRender(e) {
			this._onBeforeRenderObserver && this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver), this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(e);
		}
		set onAfterRender(e) {
			this._onAfterRenderObserver && this.onAfterRenderObservable.remove(this._onAfterRenderObserver), this._onAfterRenderObserver = this.onAfterRenderObservable.add(e);
		}
		get inputTexture() {
			return this._textures.data[this._currentRenderTextureInd];
		}
		set inputTexture(e) {
			this._forcedOutputTexture = e;
		}
		restoreDefaultInputTexture() {
			this._forcedOutputTexture && (this._forcedOutputTexture = null, this.markTextureDirty());
		}
		getCamera() {
			return this._camera;
		}
		get texelSize() {
			return this._shareOutputWithPostProcess ? this._shareOutputWithPostProcess.texelSize : (this._forcedOutputTexture && this._texelSize.copyFromFloats(1 / this._forcedOutputTexture.width, 1 / this._forcedOutputTexture.height), this._texelSize);
		}
		constructor(t, n, r, s, c, l, p = 1, g, _, b = null, C = 0, E = "postprocess", k, M = !1, F = 5, I, z) {
			this._parentContainer = (e(this, f), null), this.uniqueId = e(this, m, void 0), this.width = (e(this, h), e(this, v, -1)), this.height = (e(this, y), e(this, x, -1)), this.nodeMaterialSource = (e(this, S), null), this._outputTexture = null, this.renderTargetSamplingMode = e(this, w, void 0), this.clearColor = (e(this, T), e(this, D, void 0)), this.autoClear = (e(this, O), e(this, A, !0)), this.forceAutoClearInAlphaMode = (e(this, j), e(this, N, !1)), this.alphaConstants = (e(this, P), e(this, L, void 0)), this.animations = (e(this, R), []), this.enablePixelPerfectMode = e(this, B, !1), this.forceFullscreenViewport = (e(this, V), e(this, U, !0)), this.inspectableCustomProperties = e(this, W), this.scaleMode = e(this, K, 1), this.alwaysForcePOT = (e(this, q), e(this, Y, !1)), this._samples = (e(this, X), e(this, Q, 1)), this.adaptScaleToCurrentViewport = (e(this, $), e(this, ne, !1)), this.doNotSerialize = (e(this, re), !1), this._webGPUReady = !1, this._reusable = !1, this._renderId = 0, this.externalTextureSamplerBinding = !1, this._textures = new u(2), this._textureCache = [], this._currentRenderTextureInd = 0, this._scaleRatio = new a(1, 1), this._texelSize = a.Zero(), this.onActivateObservable = new i(), this.onSizeChangedObservable = new i(), this.onApplyObservable = new i(), this.onBeforeRenderObservable = new i(), this.onAfterRenderObservable = new i(), this.onDisposeObservable = new i(), ee();
			let H = 1, G = null, J;
			if (r && !Array.isArray(r)) {
				let e = r;
				r = e.uniforms ?? null, s = e.samplers ?? null, H = e.size ?? 1, l = e.camera ?? null, p = e.samplingMode ?? 1, g = e.engine, _ = e.reusable, b = Array.isArray(e.defines) ? e.defines.join("\n") : e.defines ?? null, C = e.textureType ?? 0, E = e.vertexUrl ?? "postprocess", k = e.indexParameters, M = e.blockCompilation ?? !1, F = e.textureFormat ?? 5, I = e.shaderLanguage ?? 0, G = e.uniformBuffers ?? null, z = e.extraInitializations, J = e.effectWrapper;
			} else c && (H = typeof c == "number" ? c : {
				width: c.width,
				height: c.height
			});
			if (this._useExistingThinPostProcess = !!J, this._effectWrapper = J ?? new d({
				name: t,
				useShaderStore: !0,
				useAsPostProcess: !0,
				fragmentShader: n,
				engine: g || l?.getScene().getEngine(),
				uniforms: r,
				samplers: s,
				uniformBuffers: G,
				defines: b,
				vertexUrl: E,
				indexParameters: k,
				blockCompilation: !0,
				shaderLanguage: I,
				extraInitializations: void 0
			}), this.name = t, this.onEffectCreatedObservable = this._effectWrapper.onEffectCreatedObservable, l == null ? g && (this._engine = g, this._engine.postProcesses.push(this)) : (this._camera = l, this._scene = l.getScene(), l.attachPostProcess(this), this._engine = this._scene.getEngine(), this._scene.addPostProcess(this), this.uniqueId = this._scene.getUniqueId()), this._options = H, this.renderTargetSamplingMode = p || 1, this._reusable = _ || !1, this._textureType = C, this._textureFormat = F, this._shaderLanguage = I || 0, this._samplers = s || [], this._samplers.indexOf("textureSampler") === -1 && this._samplers.push("textureSampler"), this._fragmentUrl = n, this._vertexUrl = E, this._parameters = r || [], this._parameters.indexOf("scale") === -1 && this._parameters.push("scale"), this._uniformBuffers = G || [], this._indexParameters = k, !this._useExistingThinPostProcess) {
				this._webGPUReady = this._shaderLanguage === 1;
				let e = [];
				this._gatherImports(this._engine.isWebGPU && !o.ForceGLSL, e), this._effectWrapper._webGPUReady = this._webGPUReady, this._effectWrapper._postConstructor(M, b, z, e);
			}
		}
		_gatherImports(e = !1, t) {
			e && this._webGPUReady ? t.push(Promise.all([import("./postprocess.vertex-DpZYH6av.js")])) : t.push(Promise.all([import("./postprocess.vertex-7rFBNJhZ.js")]));
		}
		getClassName() {
			return "PostProcess";
		}
		getEngine() {
			return this._engine;
		}
		getEffect() {
			return this._effectWrapper.drawWrapper.effect;
		}
		shareOutputWith(e) {
			return this._disposeTextures(), this._shareOutputWithPostProcess = e, this;
		}
		useOwnOutput() {
			this._textures.length == 0 && (this._textures = new u(2)), this._shareOutputWithPostProcess = null;
		}
		updateEffect(e = null, t = null, n = null, r, i, a, o, s) {
			this._effectWrapper.updateEffect(e, t, n, r, i, a, o, s), this._postProcessDefines = Array.isArray(this._effectWrapper.options.defines) ? this._effectWrapper.options.defines.join("\n") : this._effectWrapper.options.defines;
		}
		isReusable() {
			return this._reusable;
		}
		markTextureDirty() {
			this.width = -1;
		}
		_createRenderTargetTexture(e, t, n = 0) {
			for (let r = 0; r < this._textureCache.length; r++) if (this._textureCache[r].texture.width === e.width && this._textureCache[r].texture.height === e.height && this._textureCache[r].postProcessChannel === n && this._textureCache[r].texture._generateDepthBuffer === t.generateDepthBuffer && this._textureCache[r].texture.samples === t.samples) return this._textureCache[r].texture;
			let r = this._engine.createRenderTargetTexture(e, t);
			return this._textureCache.push({
				texture: r,
				postProcessChannel: n,
				lastUsedRenderId: -1
			}), r;
		}
		_flushTextureCache() {
			let e = this._renderId;
			for (let t = this._textureCache.length - 1; t >= 0; t--) if (e - this._textureCache[t].lastUsedRenderId > 100) {
				let e = !1;
				for (let n = 0; n < this._textures.length; n++) if (this._textures.data[n] === this._textureCache[t].texture) {
					e = !0;
					break;
				}
				e || (this._textureCache[t].texture.dispose(), this._textureCache.splice(t, 1));
			}
		}
		resize(e, t, n = null, r = !1, i = !1) {
			this._textures.length > 0 && this._textures.reset(), this.width = e, this.height = t;
			let a = null;
			if (n) {
				for (let e = 0; e < n._postProcesses.length; e++) if (n._postProcesses[e] !== null) {
					a = n._postProcesses[e];
					break;
				}
			}
			let o = {
				width: this.width,
				height: this.height
			}, s = {
				generateMipMaps: r,
				generateDepthBuffer: i || a === this,
				generateStencilBuffer: (i || a === this) && this._engine.isStencilEnable,
				samplingMode: this.renderTargetSamplingMode,
				type: this._textureType,
				format: this._textureFormat,
				samples: this._samples,
				label: "PostProcessRTT-" + this.name
			};
			this._textures.push(this._createRenderTargetTexture(o, s, 0)), this._reusable && this._textures.push(this._createRenderTargetTexture(o, s, 1)), this._texelSize.copyFromFloats(1 / this.width, 1 / this.height), this.onSizeChangedObservable.notifyObservers(this);
		}
		_getTarget() {
			let e;
			if (this._shareOutputWithPostProcess) e = this._shareOutputWithPostProcess.inputTexture;
			else if (this._forcedOutputTexture) e = this._forcedOutputTexture, this.width = this._forcedOutputTexture.width, this.height = this._forcedOutputTexture.height;
			else {
				e = this.inputTexture;
				let t;
				for (let n = 0; n < this._textureCache.length; n++) if (this._textureCache[n].texture === e) {
					t = this._textureCache[n];
					break;
				}
				t && (t.lastUsedRenderId = this._renderId);
			}
			return e;
		}
		activate(e, t = null, n) {
			let r = e === null || e.cameraRigMode !== void 0 ? e || this._camera : null, i = r?.getScene() ?? e, a = i.getEngine(), o = a.getCaps().maxTextureSize, s = (t ? t.width : this._engine.getRenderWidth(!0)) * this._options | 0, l = (t ? t.height : this._engine.getRenderHeight(!0)) * this._options | 0, u = this._options.width || s, d = this._options.height || l, f = this.renderTargetSamplingMode !== 7 && this.renderTargetSamplingMode !== 1 && this.renderTargetSamplingMode !== 2, p = null;
			if (!this._shareOutputWithPostProcess && !this._forcedOutputTexture) {
				if (this.adaptScaleToCurrentViewport) {
					let e = a.currentViewport;
					e && (u *= e.width, d *= e.height);
				}
				(f || this.alwaysForcePOT) && (this._options.width || (u = a.needPOTTextures ? c(u, o, this.scaleMode) : u), this._options.height || (d = a.needPOTTextures ? c(d, o, this.scaleMode) : d)), (this.width !== u || this.height !== d || !(p = this._getTarget())) && this.resize(u, d, r, f, n), this._textures.forEach((e) => {
					e.samples !== this.samples && this._engine.updateRenderTargetTextureSampleCount(e, this.samples);
				}), this._flushTextureCache(), this._renderId++;
			}
			return p || (p = this._getTarget()), this.enablePixelPerfectMode ? (this._scaleRatio.copyFromFloats(s / u, l / d), this._engine.bindFramebuffer(p, 0, s, l, this.forceFullscreenViewport)) : (this._scaleRatio.copyFromFloats(1, 1), this._engine.bindFramebuffer(p, 0, void 0, void 0, this.forceFullscreenViewport)), this._engine._debugInsertMarker?.(`post process ${this.name} input`), this.onActivateObservable.notifyObservers(r), this.autoClear && (this.alphaMode === 0 || this.forceAutoClearInAlphaMode) && this._engine.clear(this.clearColor ? this.clearColor : i.clearColor, i._allowPostProcessClearColor, !0, !0), this._reusable && (this._currentRenderTextureInd = (this._currentRenderTextureInd + 1) % 2), p;
		}
		get isSupported() {
			return this._effectWrapper.drawWrapper.effect.isSupported;
		}
		get aspectRatio() {
			return this._shareOutputWithPostProcess ? this._shareOutputWithPostProcess.aspectRatio : this._forcedOutputTexture ? this._forcedOutputTexture.width / this._forcedOutputTexture.height : this.width / this.height;
		}
		isReady() {
			return this._effectWrapper.isReady();
		}
		apply() {
			if (!this._effectWrapper.isReady()) return null;
			this._engine.enableEffect(this._effectWrapper.drawWrapper), this._engine.setState(!1), this._engine.setDepthBuffer(!1), this._engine.setDepthWrite(!1), this.alphaConstants && this.getEngine().setAlphaConstants(this.alphaConstants.r, this.alphaConstants.g, this.alphaConstants.b, this.alphaConstants.a), this._engine.setAlphaMode(this.alphaMode);
			let e;
			return e = this._shareOutputWithPostProcess ? this._shareOutputWithPostProcess.inputTexture : this._forcedOutputTexture ? this._forcedOutputTexture : this.inputTexture, this.externalTextureSamplerBinding || this._effectWrapper.drawWrapper.effect._bindTexture("textureSampler", e?.texture), this._effectWrapper.drawWrapper.effect.setVector2("scale", this._scaleRatio), this.onApplyObservable.notifyObservers(this._effectWrapper.drawWrapper.effect), this._effectWrapper.bind(!0), this._effectWrapper.drawWrapper.effect;
		}
		_disposeTextures() {
			if (this._shareOutputWithPostProcess || this._forcedOutputTexture) {
				this._disposeTextureCache();
				return;
			}
			this._disposeTextureCache(), this._textures.dispose();
		}
		_disposeTextureCache() {
			for (let e = this._textureCache.length - 1; e >= 0; e--) this._textureCache[e].texture.dispose();
			this._textureCache.length = 0;
		}
		setPrePassRenderer(e) {
			return this._prePassEffectConfiguration ? (this._prePassEffectConfiguration = e.addEffectConfiguration(this._prePassEffectConfiguration), this._prePassEffectConfiguration.enabled = !0, !0) : !1;
		}
		dispose(e) {
			e = e || this._camera, this._useExistingThinPostProcess || this._effectWrapper.dispose(), this._disposeTextures(), this._scene && this._scene.removePostProcess(this);
			let t;
			if (this._parentContainer && (t = this._parentContainer.postProcesses.indexOf(this), t > -1 && this._parentContainer.postProcesses.splice(t, 1), this._parentContainer = null), t = this._engine.postProcesses.indexOf(this), t !== -1 && this._engine.postProcesses.splice(t, 1), this.onDisposeObservable.notifyObservers(), e) {
				if (e.detachPostProcess(this), t = e._postProcesses.indexOf(this), t === 0 && e._postProcesses.length > 0) {
					let e = this._camera._getFirstPostProcess();
					e && e.markTextureDirty();
				}
				this.onActivateObservable.clear(), this.onAfterRenderObservable.clear(), this.onApplyObservable.clear(), this.onBeforeRenderObservable.clear(), this.onSizeChangedObservable.clear(), this.onEffectCreatedObservable.clear();
			}
		}
		serialize() {
			let e = l.Serialize(this), t = this.getCamera() || this._scene && this._scene.activeCamera;
			return e.customType = "BABYLON." + this.getClassName(), e.cameraId = t ? t.id : null, e.reusable = this._reusable, e.textureType = this._textureType, e.fragmentUrl = this._fragmentUrl, e.parameters = this._parameters, e.samplers = this._samplers, e.uniformBuffers = this._uniformBuffers, e.options = this._options, e.defines = this._postProcessDefines, e.textureFormat = this._textureFormat, e.vertexUrl = this._vertexUrl, e.indexParameters = this._indexParameters, e;
		}
		clone() {
			let e = this.serialize();
			e._engine = this._engine, e.cameraId = null;
			let t = o.Parse(e, this._scene, "");
			return t ? (t.onActivateObservable = this.onActivateObservable.clone(), t.onSizeChangedObservable = this.onSizeChangedObservable.clone(), t.onApplyObservable = this.onApplyObservable.clone(), t.onBeforeRenderObservable = this.onBeforeRenderObservable.clone(), t.onAfterRenderObservable = this.onAfterRenderObservable.clone(), t._prePassEffectConfiguration = this._prePassEffectConfiguration, t) : null;
		}
		static Parse(e, t, n) {
			let r = s(e.customType);
			if (!r || !r._Parse) return null;
			let i = t ? t.getCameraById(e.cameraId) : null;
			return r._Parse(e, i, t, n);
		}
		static _Parse(e, t, n, r) {
			return l.Parse(() => new o(e.name, e.fragmentUrl, e.parameters, e.samplers, e.options, t, e.renderTargetSamplingMode, e._engine, e.reusable, e.defines, e.textureType, e.vertexUrl, e.indexParameters, !1, e.textureFormat), e, n, r);
		}
	}, (() => {
		let e = typeof Symbol == "function" && Symbol.metadata ? Object.create(null) : void 0;
		p = [t()], g = [t()], _ = [t()], b = [t()], C = [t()], E = [n()], k = [t()], M = [t()], F = [t()], I = [t()], z = [t()], H = [t()], G = [t()], J = [t()], Z = [t("samples")], te = [t()], r(o, null, g, {
			kind: "getter",
			name: "name",
			static: !1,
			private: !1,
			access: {
				has: (e) => "name" in e,
				get: (e) => e.name
			},
			metadata: e
		}, null, f), r(o, null, F, {
			kind: "getter",
			name: "alphaMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "alphaMode" in e,
				get: (e) => e.alphaMode
			},
			metadata: e
		}, null, f), r(null, null, p, {
			kind: "field",
			name: "uniqueId",
			static: !1,
			private: !1,
			access: {
				has: (e) => "uniqueId" in e,
				get: (e) => e.uniqueId,
				set: (e, t) => {
					e.uniqueId = t;
				}
			},
			metadata: e
		}, m, h), r(null, null, _, {
			kind: "field",
			name: "width",
			static: !1,
			private: !1,
			access: {
				has: (e) => "width" in e,
				get: (e) => e.width,
				set: (e, t) => {
					e.width = t;
				}
			},
			metadata: e
		}, v, y), r(null, null, b, {
			kind: "field",
			name: "height",
			static: !1,
			private: !1,
			access: {
				has: (e) => "height" in e,
				get: (e) => e.height,
				set: (e, t) => {
					e.height = t;
				}
			},
			metadata: e
		}, x, S), r(null, null, C, {
			kind: "field",
			name: "renderTargetSamplingMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "renderTargetSamplingMode" in e,
				get: (e) => e.renderTargetSamplingMode,
				set: (e, t) => {
					e.renderTargetSamplingMode = t;
				}
			},
			metadata: e
		}, w, T), r(null, null, E, {
			kind: "field",
			name: "clearColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "clearColor" in e,
				get: (e) => e.clearColor,
				set: (e, t) => {
					e.clearColor = t;
				}
			},
			metadata: e
		}, D, O), r(null, null, k, {
			kind: "field",
			name: "autoClear",
			static: !1,
			private: !1,
			access: {
				has: (e) => "autoClear" in e,
				get: (e) => e.autoClear,
				set: (e, t) => {
					e.autoClear = t;
				}
			},
			metadata: e
		}, A, j), r(null, null, M, {
			kind: "field",
			name: "forceAutoClearInAlphaMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "forceAutoClearInAlphaMode" in e,
				get: (e) => e.forceAutoClearInAlphaMode,
				set: (e, t) => {
					e.forceAutoClearInAlphaMode = t;
				}
			},
			metadata: e
		}, N, P), r(null, null, I, {
			kind: "field",
			name: "alphaConstants",
			static: !1,
			private: !1,
			access: {
				has: (e) => "alphaConstants" in e,
				get: (e) => e.alphaConstants,
				set: (e, t) => {
					e.alphaConstants = t;
				}
			},
			metadata: e
		}, L, R), r(null, null, z, {
			kind: "field",
			name: "enablePixelPerfectMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "enablePixelPerfectMode" in e,
				get: (e) => e.enablePixelPerfectMode,
				set: (e, t) => {
					e.enablePixelPerfectMode = t;
				}
			},
			metadata: e
		}, B, V), r(null, null, H, {
			kind: "field",
			name: "forceFullscreenViewport",
			static: !1,
			private: !1,
			access: {
				has: (e) => "forceFullscreenViewport" in e,
				get: (e) => e.forceFullscreenViewport,
				set: (e, t) => {
					e.forceFullscreenViewport = t;
				}
			},
			metadata: e
		}, U, W), r(null, null, G, {
			kind: "field",
			name: "scaleMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "scaleMode" in e,
				get: (e) => e.scaleMode,
				set: (e, t) => {
					e.scaleMode = t;
				}
			},
			metadata: e
		}, K, q), r(null, null, J, {
			kind: "field",
			name: "alwaysForcePOT",
			static: !1,
			private: !1,
			access: {
				has: (e) => "alwaysForcePOT" in e,
				get: (e) => e.alwaysForcePOT,
				set: (e, t) => {
					e.alwaysForcePOT = t;
				}
			},
			metadata: e
		}, Y, X), r(null, null, Z, {
			kind: "field",
			name: "_samples",
			static: !1,
			private: !1,
			access: {
				has: (e) => "_samples" in e,
				get: (e) => e._samples,
				set: (e, t) => {
					e._samples = t;
				}
			},
			metadata: e
		}, Q, $), r(null, null, te, {
			kind: "field",
			name: "adaptScaleToCurrentViewport",
			static: !1,
			private: !1,
			access: {
				has: (e) => "adaptScaleToCurrentViewport" in e,
				get: (e) => e.adaptScaleToCurrentViewport,
				set: (e, t) => {
					e.adaptScaleToCurrentViewport = t;
				}
			},
			metadata: e
		}, ne, re), e && Object.defineProperty(o, Symbol.metadata, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: e
		});
	})(), o;
})(), h = !1;
function ee() {
	h || (h = !0, p.prototype.setTextureFromPostProcess = function(e, t, n) {
		let r = null;
		t && (t._forcedOutputTexture ? r = t._forcedOutputTexture : t._textures.data[t._currentRenderTextureInd] && (r = t._textures.data[t._currentRenderTextureInd])), this._bindTexture(e, r?.texture ?? null, n);
	}, p.prototype.setTextureFromPostProcessOutput = function(e, t, n) {
		this._bindTexture(e, t?._outputTexture?.texture ?? null, n);
	}, f.prototype.setTextureFromPostProcess = function(e, t) {
		this._engine.setTextureFromPostProcess(this._samplers[e], t, e);
	}, f.prototype.setTextureFromPostProcessOutput = function(e, t) {
		this._engine.setTextureFromPostProcessOutput(this._samplers[e], t, e);
	}, o("BABYLON.PostProcess", m));
}
//#endregion
export { m as t };
