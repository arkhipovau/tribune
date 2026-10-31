import { S as e, b as t, i as n, n as r, t as i, x as a, y as o } from "./decorators-BI9FueCZ.js";
import { a as s, c, d as l, l as u, n as d, t as f, u as p } from "./math.color.pure-Da-OlKtz.js";
import { n as m } from "./typeStore-pENEWnX2.js";
import { S as h } from "./tools.functions-tHn4_qrB.js";
import { t as g } from "./decorators.serialization-B05zOkuo.js";
import { t as _ } from "./logger-DQIzSR_y.js";
import { r as v } from "./tools.pure-HxVNGKAP.js";
import { t as ee } from "./smartArray-cjjaK9ER.js";
import { a as te, n as y, o as b } from "./scene.pure-ClMQe4Bu.js";
import { n as x } from "./buffer.pure-CZNiDQBs.js";
import { A as ne, C as re, D as ie, E as ae, F as S, M as C, N as oe, O as se, P as ce, S as le, T as ue, _ as de, a as fe, b as pe, c as me, d as he, f as ge, g as _e, h as ve, i as ye, j as w, k as be, l as xe, m as Se, n as Ce, o as we, p as Te, r as Ee, s as De, t as T, u as E, v as Oe, w as ke, x as Ae } from "./material.pure-Dru9oyYU.js";
import { t as je } from "./texture.pure-B3R45RBu.js";
import { r as D } from "./renderingManager-DCsVJChb.js";
import { _ as O, a as Me, d as k, g as Ne, h as Pe, i as Fe, l as A, m as Ie, n as j, o as Le, p as Re, r as M, s as N, t as ze, u as Be, v as P } from "./imageProcessing-DbBOwhLr.js";
import { n as F, t as I } from "./multiRenderTarget.pure-ZVfacmbv.js";
//#region node_modules/@babylonjs/core/Materials/environmentLighting.defines.js
function L(e) {
	return class extends e {
		constructor() {
			super(...arguments), this.REFLECTION = !1, this.REFLECTIONMAP_3D = !1, this.REFLECTIONMAP_SPHERICAL = !1, this.REFLECTIONMAP_PLANAR = !1, this.REFLECTIONMAP_CUBIC = !1, this.USE_LOCAL_REFLECTIONMAP_CUBIC = !1, this.REFLECTIONMAP_PROJECTION = !1, this.REFLECTIONMAP_SKYBOX = !1, this.REFLECTIONMAP_EXPLICIT = !1, this.REFLECTIONMAP_EQUIRECTANGULAR = !1, this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = !1, this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = !1, this.INVERTCUBICMAP = !1, this.USESPHERICALFROMREFLECTIONMAP = !1, this.USEIRRADIANCEMAP = !1, this.USE_IRRADIANCE_DOMINANT_DIRECTION = !1, this.USESPHERICALINVERTEX = !1, this.REFLECTIONMAP_OPPOSITEZ = !1, this.LODINREFLECTIONALPHA = !1, this.GAMMAREFLECTION = !1, this.RGBDREFLECTION = !1;
		}
	};
}
//#endregion
//#region node_modules/@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.pure.js
var R = class {
	constructor(e) {
		this.name = D.NAME_GEOMETRYBUFFERRENDERER, this.scene = e;
	}
	register() {
		this.scene._gatherRenderTargetsStage.registerStep(D.STEP_GATHERRENDERTARGETS_GEOMETRYBUFFERRENDERER, this, this._gatherRenderTargets);
	}
	rebuild() {}
	dispose() {}
	_gatherRenderTargets(e) {
		this.scene._geometryBufferRenderer && e.push(this.scene._geometryBufferRenderer.getGBuffer());
	}
}, z = !1;
function B(e) {
	z || (z = !0, Object.defineProperty(y.prototype, "geometryBufferRenderer", {
		get: function() {
			return this._geometryBufferRenderer;
		},
		set: function(e) {
			e && e.isSupported && (this._geometryBufferRenderer = e);
		},
		enumerable: !0,
		configurable: !0
	}), y.prototype.enableGeometryBufferRenderer = function(t = 1, n = 15, r) {
		return this._geometryBufferRenderer ? this._geometryBufferRenderer : (this._geometryBufferRenderer = new e(this, t, n, r), this._geometryBufferRenderer.isSupported || (this._geometryBufferRenderer = null), this._geometryBufferRenderer);
	}, y.prototype.disableGeometryBufferRenderer = function() {
		this._geometryBufferRenderer && (this._geometryBufferRenderer.dispose(), this._geometryBufferRenderer = null);
	}, e._SceneComponentInitialization = (e) => {
		let t = e._getComponent(D.NAME_GEOMETRYBUFFERRENDERER);
		t || (t = new R(e), e._addComponent(t));
	});
}
//#endregion
//#region node_modules/@babylonjs/core/Meshes/meshBlendingTag.js
function V(e) {
	return e.shaderPlatformName !== "NATIVE" && (e.isWebGPU || e.webGLVersion === 2);
}
var H;
(function(e) {
	e[e.Small = 0] = "Small", e[e.Medium = 1] = "Medium", e[e.Large = 2] = "Large", e[e.ExtraLarge = 3] = "ExtraLarge";
})(H || (H = {}));
//#endregion
//#region node_modules/@babylonjs/core/Rendering/geometryBufferRenderer.pure.js
var U = [
	"diffuseSampler",
	"bumpSampler",
	"reflectivitySampler",
	"albedoSampler",
	"morphTargets",
	"boneSampler",
	"transmissionWeightSampler",
	"subsurfaceWeightSampler",
	"iblShadowSampler"
], W = /* @__PURE__ */ "world.mBones.viewProjection.diffuseMatrix.alphaCutOff.view.previousWorld.previousViewProjection.mPreviousBones.bumpMatrix.reflectivityMatrix.albedoMatrix.reflectivityColor.albedoColor.reflectionMatrix.vTransmissionWeight.vSubsurfaceWeight.vEyePosition.vTransmissionScatterAnisotropy.vSubsurfaceScatterAnisotropy.shadowTextureSize.metallic.glossiness.vTangentSpaceParams.vBumpInfos.morphTargetInfluences.morphTargetCount.morphTargetTextureInfo.morphTargetTextureIndices.boneTextureInfo.objectId.meshBlendTag".split("."), G = class e {
	get renderTransparentMeshes() {
		return this._renderTransparentMeshes;
	}
	set renderTransparentMeshes(e) {
		if (e && this._enableMeshBlendTag && !this._scene.getEngine().getCaps().blendParametersPerTarget) throw Error("GeometryBufferRenderer: transparent mesh-blending tags require per-target blend parameters");
		this._renderTransparentMeshes = e;
	}
	get normalsAreUnsigned() {
		return this._normalsAreUnsigned;
	}
	_linkPrePassRenderer(e) {
		if (this._enableObjectId || this._enableMeshBlendTag) throw Error("GeometryBufferRenderer: object ID and mesh-blending tag textures are not supported when linked to the PrePassRenderer");
		this._linkedWithPrePass = !0, this._prePassRenderer = e, this._scene._setPreviousWorldMatricesRequired(this, !1), this._multiRenderTarget && (this._multiRenderTarget.onClearObservable.clear(), this._multiRenderTarget.onClearObservable.add(() => {}));
	}
	_unlinkPrePassRenderer() {
		this._linkedWithPrePass = !1, this._createRenderTargets();
	}
	_resetLayout() {
		this._enableDepth = !0, this._enableNormal = !0, this._enablePosition = !1, this._enableReflectivity = !1, this._enableVelocity = !1, this._enableVelocityLinear = !1, this._enableScreenspaceDepth = !1, this._enableIrradiance = !1, this._enableObjectId = !1, this._enableMeshBlendTag = !1, this._attachmentsFromPrePass = [], this._scene._setPreviousWorldMatricesRequired(this, !1);
	}
	_forceTextureType(t, n) {
		t === e.POSITION_TEXTURE_TYPE ? (this._positionIndex = n, this._enablePosition = !0) : t === e.VELOCITY_TEXTURE_TYPE ? (this._velocityIndex = n, this._enableVelocity = !0) : t === e.VELOCITY_LINEAR_TEXTURE_TYPE ? (this._velocityLinearIndex = n, this._enableVelocityLinear = !0) : t === e.REFLECTIVITY_TEXTURE_TYPE ? (this._reflectivityIndex = n, this._enableReflectivity = !0) : t === e.DEPTH_TEXTURE_TYPE ? (this._depthIndex = n, this._enableDepth = !0) : t === e.NORMAL_TEXTURE_TYPE ? (this._normalIndex = n, this._enableNormal = !0) : t === e.SCREENSPACE_DEPTH_TEXTURE_TYPE ? (this._screenspaceDepthIndex = n, this._enableScreenspaceDepth = !0) : t === e.IRRADIANCE_TEXTURE_TYPE ? (this._irradianceIndex = n, this._enableIrradiance = !0) : t === e.OBJECT_ID_TEXTURE_TYPE ? (this._objectIdIndex = n, this._enableObjectId = !0) : t === e.MESH_BLEND_TAG_TEXTURE_TYPE && (this._meshBlendTagIndex = n, this._enableMeshBlendTag = !0);
	}
	_setAttachments(e) {
		this._attachmentsFromPrePass = e;
	}
	_linkInternalTexture(e) {
		this._multiRenderTarget.setInternalTexture(e, 0, !1);
	}
	get renderList() {
		return this._multiRenderTarget.renderList;
	}
	set renderList(e) {
		this._multiRenderTarget.renderList = e;
	}
	get isSupported() {
		return this._multiRenderTarget.isSupported;
	}
	getTextureIndex(t) {
		switch (t) {
			case e.POSITION_TEXTURE_TYPE: return this._positionIndex;
			case e.VELOCITY_TEXTURE_TYPE: return this._velocityIndex;
			case e.VELOCITY_LINEAR_TEXTURE_TYPE: return this._velocityLinearIndex;
			case e.REFLECTIVITY_TEXTURE_TYPE: return this._reflectivityIndex;
			case e.DEPTH_TEXTURE_TYPE: return this._depthIndex;
			case e.NORMAL_TEXTURE_TYPE: return this._normalIndex;
			case e.SCREENSPACE_DEPTH_TEXTURE_TYPE: return this._screenspaceDepthIndex;
			case e.IRRADIANCE_TEXTURE_TYPE: return this._irradianceIndex;
			case e.OBJECT_ID_TEXTURE_TYPE: return this._objectIdIndex;
			case e.MESH_BLEND_TAG_TEXTURE_TYPE: return this._meshBlendTagIndex;
			default: return -1;
		}
	}
	get enableDepth() {
		return this._enableDepth;
	}
	set enableDepth(e) {
		this._enableDepth = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableNormal() {
		return this._enableNormal;
	}
	set enableNormal(e) {
		this._enableNormal = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enablePosition() {
		return this._enablePosition;
	}
	set enablePosition(e) {
		this._enablePosition = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableVelocity() {
		return this._enableVelocity;
	}
	set enableVelocity(e) {
		this._enableVelocity = e, e || (this._previousTransformationMatrices = {}), this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableVelocityLinear() {
		return this._enableVelocityLinear;
	}
	set enableVelocityLinear(e) {
		this._enableVelocityLinear = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableReflectivity() {
		return this._enableReflectivity;
	}
	set enableReflectivity(e) {
		this._enableReflectivity = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableScreenspaceDepth() {
		return this._enableScreenspaceDepth;
	}
	set enableScreenspaceDepth(e) {
		this._enableScreenspaceDepth = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableIrradiance() {
		return this._enableIrradiance;
	}
	set enableIrradiance(e) {
		this._enableIrradiance = e, this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableObjectId() {
		return this._enableObjectId;
	}
	set enableObjectId(e) {
		if (e && this._linkedWithPrePass) throw Error("GeometryBufferRenderer: object ID textures are not supported when linked to the PrePassRenderer");
		if (e && this.samples !== 1) throw Error("GeometryBufferRenderer: object ID textures currently require samples to be 1");
		if (e && !this._enableObjectId && !this._linkedWithPrePass) {
			let e = this._scene.getEngine(), t = Math.min(e.getCaps().maxDrawBuffers ?? 1, 8), n = this._assignRenderTargetIndices()[0] + 1;
			if (e.getCaps().drawBuffersExtension && n > t) throw Error(`GeometryBufferRenderer: ${n} color attachments were requested, but this engine supports at most ${t}`);
		}
		this._enableObjectId = e, e || (this._objectIdIndex = -1), this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
	}
	get enableMeshBlendingTag() {
		return this._enableMeshBlendTag;
	}
	set enableMeshBlendingTag(e) {
		if (this._enableMeshBlendTag !== e) {
			if (e) {
				let e = this._scene.getEngine();
				if (!V(e)) throw Error("GeometryBufferRenderer: mesh-blending tag textures require WebGL2 or WebGPU");
				if (this.renderTransparentMeshes && !e.isWebGPU && !e.getCaps().blendParametersPerTarget) throw Error("GeometryBufferRenderer: transparent mesh-blending tags require per-target blend parameters");
				if (this._linkedWithPrePass) throw Error("GeometryBufferRenderer: mesh-blending tag textures are not supported when linked to the PrePassRenderer");
				if (this.samples !== 1) throw Error("GeometryBufferRenderer: mesh-blending tag textures require samples to be 1");
				if (!this._enableMeshBlendTag) {
					let t = Math.min(e.getCaps().maxDrawBuffers ?? 1, 8), n = this._assignRenderTargetIndices()[0] + 1;
					if (e.getCaps().drawBuffersExtension && n > t) throw Error(`GeometryBufferRenderer: ${n} color attachments were requested, but this engine supports at most ${t}`);
				}
			}
			this._enableMeshBlendTag = e, e || (this._meshBlendTagIndex = -1), this._linkedWithPrePass || (this.dispose(), this._createRenderTargets());
		}
	}
	get scene() {
		return this._scene;
	}
	get ratio() {
		return typeof this._ratioOrDimensions == "object" ? 1 : this._ratioOrDimensions;
	}
	get shaderLanguage() {
		return this._shaderLanguage;
	}
	constructor(t, n = 1, r = 15, i) {
		this._previousTransformationMatrices = {}, this._previousBonesTransformationMatrices = {}, this.excludedSkinnedMeshesFromVelocity = [], this._renderTransparentMeshes = !0, this.generateNormalsInWorldSpace = !1, this._normalsAreUnsigned = !1, this._resizeObserver = null, this._enableDepth = !0, this._enableNormal = !0, this._enablePosition = !1, this._enableVelocity = !1, this._enableVelocityLinear = !1, this._enableReflectivity = !1, this._enableScreenspaceDepth = !1, this._enableIrradiance = !1, this._enableObjectId = !1, this._enableMeshBlendTag = !1, this._clearColor = new d(0, 0, 0, 0), this._clearDepthColor = new d(0, 0, 0, 1), this._positionIndex = -1, this._velocityIndex = -1, this._velocityLinearIndex = -1, this._reflectivityIndex = -1, this._depthIndex = -1, this._normalIndex = -1, this._screenspaceDepthIndex = -1, this._irradianceIndex = -1, this._objectIdIndex = -1, this._meshBlendTagIndex = -1, this._linkedWithPrePass = !1, this.generateIrradianceWithScatterMask = !1, this.useSpecificClearForDepthTexture = !1, this._shaderLanguage = 0, this._shadersLoaded = !1, this._scene = t, this._ratioOrDimensions = n, this._useUbo = t.getEngine().supportsUniformBuffers, this._depthFormat = r, this._textureTypesAndFormats = i || {}, this._initShaderSourceAsync(), B(e), e._SceneComponentInitialization(this._scene), this._createRenderTargets();
	}
	async _initShaderSourceAsync() {
		this._scene.getEngine().isWebGPU && !e.ForceGLSL ? (this._shaderLanguage = 1, await Promise.all([import("./geometry.vertex-Ly7ZBRYU.js"), import("./geometry.fragment-D99ta-nj.js")])) : await Promise.all([import("./geometry.vertex-w3_QpVNn.js"), import("./geometry.fragment-fN6hGuXi.js")]), this._shadersLoaded = !0;
	}
	isReady(e, t) {
		if (!this._shadersLoaded) return !1;
		let n = e.getMaterial();
		if (n && n.disableDepthWrite || F(e.getMesh())) return !1;
		let r = [], i = [x.PositionKind], a = e.getMesh();
		a.isVerticesDataPresent(x.NormalKind) && (r.push("#define HAS_NORMAL_ATTRIBUTE"), i.push(x.NormalKind));
		let o = !1, s = !1;
		if (n) {
			let e = !1;
			if (n.needAlphaTestingForMesh(a) && n.getAlphaTestTexture() && (r.push("#define ALPHATEST"), r.push(`#define ALPHATEST_UV${n.getAlphaTestTexture().coordinatesIndex + 1}`), e = !0), (n.bumpTexture || n.normalTexture || n.geometryNormalTexture) && C.BumpTextureEnabled) {
				let t = n.bumpTexture || n.normalTexture || n.geometryNormalTexture;
				r.push("#define BUMP"), r.push(`#define BUMP_UV${t.coordinatesIndex + 1}`), e = !0;
			}
			if (this._enableReflectivity) {
				let t = !1;
				if (n.getClassName() === "PBRMetallicRoughnessMaterial") n.metallicRoughnessTexture && (r.push("#define ORMTEXTURE"), r.push(`#define REFLECTIVITY_UV${n.metallicRoughnessTexture.coordinatesIndex + 1}`), r.push("#define METALLICWORKFLOW"), e = !0, t = !0), n.metallic != null && (r.push("#define METALLIC"), r.push("#define METALLICWORKFLOW"), t = !0), n.roughness != null && (r.push("#define ROUGHNESS"), r.push("#define METALLICWORKFLOW"), t = !0), t && (n.baseTexture && (r.push("#define ALBEDOTEXTURE"), r.push(`#define ALBEDO_UV${n.baseTexture.coordinatesIndex + 1}`), n.baseTexture.gammaSpace && r.push("#define GAMMAALBEDO"), e = !0), n.baseColor && r.push("#define ALBEDOCOLOR"));
				else if (n.getClassName() === "PBRSpecularGlossinessMaterial") n.specularGlossinessTexture ? (r.push("#define SPECULARGLOSSINESSTEXTURE"), r.push(`#define REFLECTIVITY_UV${n.specularGlossinessTexture.coordinatesIndex + 1}`), e = !0, n.specularGlossinessTexture.gammaSpace && r.push("#define GAMMAREFLECTIVITYTEXTURE")) : n.specularColor && r.push("#define REFLECTIVITYCOLOR"), n.glossiness != null && r.push("#define GLOSSINESS");
				else if (n.getClassName() === "PBRMaterial") n.metallicTexture && (r.push("#define ORMTEXTURE"), r.push(`#define REFLECTIVITY_UV${n.metallicTexture.coordinatesIndex + 1}`), r.push("#define METALLICWORKFLOW"), e = !0, t = !0), n.metallic != null && (r.push("#define METALLIC"), r.push("#define METALLICWORKFLOW"), t = !0), n.roughness != null && (r.push("#define ROUGHNESS"), r.push("#define METALLICWORKFLOW"), t = !0), t ? (n.albedoTexture && (r.push("#define ALBEDOTEXTURE"), r.push(`#define ALBEDO_UV${n.albedoTexture.coordinatesIndex + 1}`), n.albedoTexture.gammaSpace && r.push("#define GAMMAALBEDO"), e = !0), n.albedoColor && r.push("#define ALBEDOCOLOR")) : (n.reflectivityTexture ? (r.push("#define SPECULARGLOSSINESSTEXTURE"), r.push(`#define REFLECTIVITY_UV${n.reflectivityTexture.coordinatesIndex + 1}`), n.reflectivityTexture.gammaSpace && r.push("#define GAMMAREFLECTIVITYTEXTURE"), e = !0) : n.reflectivityColor && r.push("#define REFLECTIVITYCOLOR"), n.microSurface != null && r.push("#define GLOSSINESS"));
				else if (n.getClassName() === "StandardMaterial") n.specularTexture && (r.push("#define REFLECTIVITYTEXTURE"), r.push(`#define REFLECTIVITY_UV${n.specularTexture.coordinatesIndex + 1}`), n.specularTexture.gammaSpace && r.push("#define GAMMAREFLECTIVITYTEXTURE"), e = !0), n.specularColor && r.push("#define REFLECTIVITYCOLOR");
				else if (n.getClassName() === "OpenPBRMaterial") {
					let t = n;
					r.push("#define METALLIC"), r.push("#define ROUGHNESS"), t._useRoughnessFromMetallicTextureGreen && t.baseMetalnessTexture ? (r.push("#define ORMTEXTURE"), r.push(`#define REFLECTIVITY_UV${t.baseMetalnessTexture.coordinatesIndex + 1}`), e = !0) : t.baseMetalnessTexture ? (r.push("#define METALLIC_TEXTURE"), r.push(`#define METALLIC_UV${t.baseMetalnessTexture.coordinatesIndex + 1}`), e = !0) : t.specularRoughnessTexture && (r.push("#define ROUGHNESS_TEXTURE"), r.push(`#define ROUGHNESS_UV${t.specularRoughnessTexture.coordinatesIndex + 1}`), e = !0), t.baseColorTexture && (r.push("#define ALBEDOTEXTURE"), r.push(`#define ALBEDO_UV${t.baseColorTexture.coordinatesIndex + 1}`), t.baseColorTexture.gammaSpace && r.push("#define GAMMAALBEDO"), e = !0), t.baseColor && r.push("#define ALBEDOCOLOR");
				}
			}
			if (this._enableIrradiance && this.generateIrradianceWithScatterMask && (r.push("#define IRRADIANCE_SCATTER_MASK"), n.getClassName() === "OpenPBRMaterial")) {
				let t = n;
				t.subsurfaceWeight > 0 && t.subsurfaceWeightTexture && (r.push("#define SUBSURFACE_WEIGHT"), r.push(`#define SUBSURFACEWEIGHT_UV${t.subsurfaceWeightTexture.coordinatesIndex + 1}`), e = !0), t.transmissionWeight > 0 && t.transmissionWeightTexture && (r.push("#define TRANSMISSION_WEIGHT"), r.push(`#define TRANSMISSIONWEIGHT_UV${t.transmissionWeightTexture.coordinatesIndex + 1}`), e = !0);
			}
			e && (r.push("#define NEED_UV"), a.isVerticesDataPresent(x.UVKind) && (i.push(x.UVKind), r.push("#define UV1"), o = !0), a.isVerticesDataPresent(x.UV2Kind) && (i.push(x.UV2Kind), r.push("#define UV2"), s = !0));
		}
		if (this._enableDepth && (r.push("#define DEPTH"), r.push("#define DEPTH_INDEX " + this._depthIndex)), this._enableNormal && (r.push("#define NORMAL"), r.push("#define NORMAL_INDEX " + this._normalIndex)), this._enablePosition && (r.push("#define POSITION"), r.push("#define POSITION_INDEX " + this._positionIndex)), this._enableVelocity && (r.push("#define VELOCITY"), r.push("#define VELOCITY_INDEX " + this._velocityIndex), this.excludedSkinnedMeshesFromVelocity.indexOf(a) === -1 && r.push("#define BONES_VELOCITY_ENABLED")), this._enableVelocityLinear && (r.push("#define VELOCITY_LINEAR"), r.push("#define VELOCITY_LINEAR_INDEX " + this._velocityLinearIndex), this.excludedSkinnedMeshesFromVelocity.indexOf(a) === -1 && r.push("#define BONES_VELOCITY_ENABLED")), this._enableReflectivity && (r.push("#define REFLECTIVITY"), r.push("#define REFLECTIVITY_INDEX " + this._reflectivityIndex)), this._enableScreenspaceDepth && this._screenspaceDepthIndex !== -1 && (r.push("#define SCREENSPACE_DEPTH_INDEX " + this._screenspaceDepthIndex), r.push("#define SCREENSPACE_DEPTH")), this._enableIrradiance && this._irradianceIndex !== -1) {
			r.push("#define IRRADIANCE_INDEX " + this._irradianceIndex), r.push("#define IRRADIANCE");
			let e = this._scene;
			if (e.environmentTexture) {
				let t = {}, i = !1, a = 0;
				(n.getClassName() === "OpenPBRMaterial" || n.getClassName() === "StandardMaterial" || n.getClassName() === "PBRMetallicRoughnessMaterial" || n.getClassName() === "PBRSpecularGlossinessMaterial" || n.getClassName() === "PBRMaterial") && (i = !!n.realtimeFiltering, a = n.realtimeFilteringQuality || 0), Ae(e, e.environmentTexture, t, i, a, !0);
				for (let e in t) t[e] && r.push("#define " + e);
				t.USEIRRADIANCEMAP || r.push("#define SPHERICAL_HARMONICS");
				let o = e.postProcessRenderPipelineManager.supportedPipelines.find((e) => e.getClassName() === "IBLShadowsRenderPipeline");
				if (o) {
					let e = o;
					e._getAccumulatedTexture() && (r.push("#define IBL_SHADOW_TEXTURE"), e.coloredShadows && r.push("#define COLORED_IBL_SHADOWS"));
				}
			}
		}
		this._enableObjectId && (r.push("#define OBJECT_ID"), r.push("#define OBJECT_ID_INDEX " + this._objectIdIndex)), this._enableMeshBlendTag && (r.push("#define MESH_BLEND_TAG"), r.push("#define MESH_BLEND_TAG_INDEX " + this._meshBlendTagIndex)), this.generateNormalsInWorldSpace && r.push("#define NORMAL_WORLDSPACE"), this._normalsAreUnsigned && r.push("#define ENCODE_NORMAL"), a.useBones && a.computeBonesUsingShaders && a.skeleton ? (i.push(x.MatricesIndicesKind), i.push(x.MatricesWeightsKind), a.numBoneInfluencers > 4 && (i.push(x.MatricesIndicesExtraKind), i.push(x.MatricesWeightsExtraKind)), r.push("#define NUM_BONE_INFLUENCERS " + a.numBoneInfluencers), r.push("#define BONETEXTURE " + a.skeleton.isUsingTextureForMatrices), r.push("#define BonesPerMesh " + (a.skeleton.bones.length + 1))) : (r.push("#define NUM_BONE_INFLUENCERS 0"), r.push("#define BONETEXTURE false"), r.push("#define BonesPerMesh 0"));
		let c = a.morphTargetManager ? de(a.morphTargetManager, r, i, a, !0, !0, !1, o, s, !1) : 0;
		t && (r.push("#define INSTANCES"), w(i, this._enableVelocity || this._enableVelocityLinear), e.getRenderingMesh().hasThinInstances && r.push("#define THIN_INSTANCES")), this._linkedWithPrePass ? r.push("#define SCENE_MRT_COUNT " + this._attachmentsFromPrePass.length) : r.push("#define SCENE_MRT_COUNT " + this._multiRenderTarget.textures.length), S(n, this._scene, r);
		let l = this._scene.getEngine(), u = e._getDrawWrapper(void 0, !0), d = u.defines, f = r.join("\n");
		return d !== f && u.setEffect(l.createEffect("geometry", {
			attributes: i,
			uniformsNames: W,
			samplers: U,
			defines: f,
			onCompiled: null,
			fallbacks: null,
			onError: null,
			uniformBuffersNames: ["Scene"],
			indexParameters: {
				buffersCount: this._multiRenderTarget.textures.length - 1,
				maxSimultaneousMorphTargets: c
			},
			shaderLanguage: this.shaderLanguage
		}, l), f), u.effect.isReady();
	}
	getGBuffer() {
		return this._multiRenderTarget;
	}
	get samples() {
		return this._multiRenderTarget.samples;
	}
	set samples(e) {
		if (this._enableObjectId && e !== 1) throw Error("GeometryBufferRenderer: object ID textures currently require samples to be 1");
		if (this._enableMeshBlendTag && e !== 1) throw Error("GeometryBufferRenderer: mesh-blending tag textures require samples to be 1");
		this._multiRenderTarget.samples = e;
	}
	dispose() {
		this._scene._setPreviousWorldMatricesRequired(this, !1), this._resizeObserver && (this._scene.getEngine().onResizeObservable.remove(this._resizeObserver), this._resizeObserver = null), this._multiRenderTarget?.renderTarget && this.scene.getEngine()._currentRenderTarget === this._multiRenderTarget.renderTarget && this.scene.getEngine().unBindFramebuffer(this._multiRenderTarget?.renderTarget), this.getGBuffer().dispose();
	}
	_assignRenderTargetIndices() {
		let t = [], n = [], r = 0;
		return this._enableDepth && (this._depthIndex = r, r++, t.push("gBuffer_Depth"), n.push(this._textureTypesAndFormats[e.DEPTH_TEXTURE_TYPE])), this._enableNormal && (this._normalIndex = r, r++, t.push("gBuffer_Normal"), n.push(this._textureTypesAndFormats[e.NORMAL_TEXTURE_TYPE])), this._enablePosition && (this._positionIndex = r, r++, t.push("gBuffer_Position"), n.push(this._textureTypesAndFormats[e.POSITION_TEXTURE_TYPE])), this._enableVelocity && (this._velocityIndex = r, r++, t.push("gBuffer_Velocity"), n.push(this._textureTypesAndFormats[e.VELOCITY_TEXTURE_TYPE])), this._enableVelocityLinear && (this._velocityLinearIndex = r, r++, t.push("gBuffer_VelocityLinear"), n.push(this._textureTypesAndFormats[e.VELOCITY_LINEAR_TEXTURE_TYPE])), this._enableReflectivity && (this._reflectivityIndex = r, r++, t.push("gBuffer_Reflectivity"), n.push(this._textureTypesAndFormats[e.REFLECTIVITY_TEXTURE_TYPE])), this._enableScreenspaceDepth && (this._screenspaceDepthIndex = r, r++, t.push("gBuffer_ScreenspaceDepth"), n.push(this._textureTypesAndFormats[e.SCREENSPACE_DEPTH_TEXTURE_TYPE])), this._enableIrradiance && (this._irradianceIndex = r, r++, t.push("gBuffer_Irradiance"), n.push(this._textureTypesAndFormats[e.IRRADIANCE_TEXTURE_TYPE])), this._enableObjectId && (this._objectIdIndex = r, r++, t.push("gBuffer_ObjectId"), n.push({
			textureType: 0,
			textureFormat: 5,
			samplingMode: 1
		})), this._enableMeshBlendTag && (this._meshBlendTagIndex = r, r++, t.push("gBuffer_MeshBlendTag"), n.push({
			textureType: 0,
			textureFormat: 8,
			samplingMode: 1
		})), [
			r,
			t,
			n
		];
	}
	_createRenderTargets() {
		let t = this._scene.getEngine(), [n, r, i] = this._assignRenderTargetIndices(), a = Math.min(t.getCaps().maxDrawBuffers ?? 1, 8);
		if (t.getCaps().drawBuffersExtension && n > a) throw Error(`GeometryBufferRenderer: ${n} color attachments were requested, but this engine supports at most ${a}`);
		let o = 0;
		t._caps.textureFloat && t._caps.textureFloatLinearFiltering ? o = 1 : t._caps.textureHalfFloat && t._caps.textureHalfFloatLinearFiltering && (o = 2);
		let c = this._getRenderTargetDimensions(), l = [], u = [], d = [];
		for (let e of i) e ? (l.push(e.textureType), u.push(e.textureFormat), d.push(e.samplingMode ?? 2)) : (l.push(o), u.push(5), d.push(2));
		if (this._normalsAreUnsigned = l[e.NORMAL_TEXTURE_TYPE] === 11 || l[e.NORMAL_TEXTURE_TYPE] === 13, this._multiRenderTarget = new I("gBuffer", c, n, this._scene, {
			generateMipMaps: !1,
			generateDepthTexture: !0,
			types: l,
			formats: u,
			samplingModes: d,
			depthTextureFormat: this._depthFormat
		}, r.concat("gBuffer_DepthBuffer")), !this.isSupported) return;
		this._scene._setPreviousWorldMatricesRequired(this, !this._linkedWithPrePass && (this._enableVelocity || this._enableVelocityLinear)), this._multiRenderTarget.wrapU = je.CLAMP_ADDRESSMODE, this._multiRenderTarget.wrapV = je.CLAMP_ADDRESSMODE, this._multiRenderTarget.refreshRate = 1, this._multiRenderTarget.renderParticles = !1, this._multiRenderTarget.renderList = null;
		let f = [!0], p = [!1], m = [!0];
		for (let e = 1; e < n; ++e) f.push(!0), m.push(!1), p.push(!0);
		let h = t.buildTextureLayout(f), g = t.buildTextureLayout(p), _ = t.buildTextureLayout(m);
		this._multiRenderTarget.onClearObservable.add((e) => {
			let t = this.useSpecificClearForDepthTexture ? g : h;
			e.clearAttachments(this._clearColor, t, !0, !0, !0), this.useSpecificClearForDepthTexture && e.clearAttachments(this._clearDepthColor, _, !0, !1, !1), e.bindAttachments(h);
		}), this._resizeObserver = t.onResizeObservable.add(() => {
			this._multiRenderTarget && this._multiRenderTarget.resize(this._getRenderTargetDimensions());
		});
		let v = (e) => {
			let t = e.getRenderingMesh(), n = e.getEffectiveMesh(), r = this._scene, i = r.getEngine(), a = e.getMaterial();
			if (!a) return;
			if (n._internalAbstractMeshDataInfo._isActiveIntermediate = !1, (this._enableVelocity || this._enableVelocityLinear) && !this._previousTransformationMatrices[n.uniqueId] && (this._previousTransformationMatrices[n.uniqueId] = {
				world: s.Identity(),
				viewProjection: r.getTransformMatrix()
			}, t.skeleton)) {
				let e = t.skeleton.getTransformMatrices(t);
				this._previousBonesTransformationMatrices[t.uniqueId] = this._copyBonesTransformationMatrices(e, new Float32Array(e.length));
			}
			let o = t._getInstancesRenderList(e._id, !!e.getReplacementMesh());
			if (o.mustReturn) return;
			let c = i.getCaps().instancedArrays && (o.visibleInstances[e._id] !== null || t.hasThinInstances), l = n.getWorldMatrix();
			if (this.isReady(e, c)) {
				let s = e._getDrawWrapper();
				if (!s) return;
				let u = s.effect;
				i.enableEffect(s), c || t._bind(e, u, a.fillMode), this._useUbo ? (E(u, this._scene.getSceneUniformBuffer()), this._scene.finalizeSceneUbo()) : (u.setMatrix("viewProjection", r.getTransformMatrix()), u.setMatrix("view", r.getViewMatrix()), this._scene.bindEyePosition(u, "vEyePosition"));
				let d;
				if (!t._instanceDataStorage.isFrozen && (a.backFaceCulling || a.sideOrientation !== null)) {
					let e = n._getWorldMatrixDeterminant();
					d = a._getEffectiveOrientation(t), e < 0 && (d = d === T.ClockWiseSideOrientation ? T.CounterClockWiseSideOrientation : T.ClockWiseSideOrientation);
				} else d = t._effectiveSideOrientation;
				if (a._preBind(s, d), a.needAlphaTestingForMesh(n)) {
					let e = a.getAlphaTestTexture();
					e && (u.setTexture("diffuseSampler", e), u.setMatrix("diffuseMatrix", e.getTextureMatrix()), u.setFloat("alphaCutOff", a.alphaCutOff ?? .4));
				}
				if ((a.bumpTexture || a.normalTexture || a.geometryNormalTexture) && r.getEngine().getCaps().standardDerivatives && C.BumpTextureEnabled) {
					let e = a.bumpTexture || a.normalTexture || a.geometryNormalTexture;
					u.setFloat3("vBumpInfos", e.coordinatesIndex, 1 / e.level, a.parallaxScaleBias), u.setMatrix("bumpMatrix", e.getTextureMatrix()), u.setTexture("bumpSampler", e), u.setFloat2("vTangentSpaceParams", a.invertNormalMapX ? -1 : 1, a.invertNormalMapY ? -1 : 1);
				}
				if (this._enableReflectivity) {
					if (a.getClassName() === "PBRMetallicRoughnessMaterial") a.metallicRoughnessTexture !== null && (u.setTexture("reflectivitySampler", a.metallicRoughnessTexture), u.setMatrix("reflectivityMatrix", a.metallicRoughnessTexture.getTextureMatrix())), a.metallic !== null && u.setFloat("metallic", a.metallic), a.roughness !== null && u.setFloat("glossiness", 1 - a.roughness), a.baseTexture !== null && (u.setTexture("albedoSampler", a.baseTexture), u.setMatrix("albedoMatrix", a.baseTexture.getTextureMatrix())), a.baseColor !== null && u.setColor3("albedoColor", a.baseColor);
					else if (a.getClassName() === "PBRSpecularGlossinessMaterial") a.specularGlossinessTexture === null ? a.specularColor !== null && u.setColor3("reflectivityColor", a.specularColor) : (u.setTexture("reflectivitySampler", a.specularGlossinessTexture), u.setMatrix("reflectivityMatrix", a.specularGlossinessTexture.getTextureMatrix())), a.glossiness !== null && u.setFloat("glossiness", a.glossiness);
					else if (a.getClassName() === "PBRMaterial") a.metallicTexture !== null && (u.setTexture("reflectivitySampler", a.metallicTexture), u.setMatrix("reflectivityMatrix", a.metallicTexture.getTextureMatrix())), a.metallic !== null && u.setFloat("metallic", a.metallic), a.roughness !== null && u.setFloat("glossiness", 1 - a.roughness), a.roughness !== null || a.metallic !== null || a.metallicTexture !== null ? (a.albedoTexture !== null && (u.setTexture("albedoSampler", a.albedoTexture), u.setMatrix("albedoMatrix", a.albedoTexture.getTextureMatrix())), a.albedoColor !== null && u.setColor3("albedoColor", a.albedoColor)) : (a.reflectivityTexture === null ? a.reflectivityColor !== null && u.setColor3("reflectivityColor", a.reflectivityColor) : (u.setTexture("reflectivitySampler", a.reflectivityTexture), u.setMatrix("reflectivityMatrix", a.reflectivityTexture.getTextureMatrix())), a.microSurface !== null && u.setFloat("glossiness", a.microSurface));
					else if (a.getClassName() === "StandardMaterial") a.specularTexture !== null && (u.setTexture("reflectivitySampler", a.specularTexture), u.setMatrix("reflectivityMatrix", a.specularTexture.getTextureMatrix())), a.specularColor !== null && u.setColor3("reflectivityColor", a.specularColor);
					else if (a.getClassName() === "OpenPBRMaterial") {
						let e = a;
						e._useRoughnessFromMetallicTextureGreen && e.baseMetalnessTexture ? (u.setTexture("reflectivitySampler", e.baseMetalnessTexture), u.setMatrix("reflectivityMatrix", e.baseMetalnessTexture.getTextureMatrix())) : e.baseMetalnessTexture ? (u.setTexture("metallicSampler", e.baseMetalnessTexture), u.setMatrix("metallicMatrix", e.baseMetalnessTexture.getTextureMatrix())) : e.specularRoughnessTexture && (u.setTexture("roughnessSampler", e.specularRoughnessTexture), u.setMatrix("roughnessMatrix", e.specularRoughnessTexture.getTextureMatrix())), u.setFloat("metallic", e.baseMetalness), u.setFloat("glossiness", 1 - e.specularRoughness), e.baseColorTexture !== null && (u.setTexture("albedoSampler", e.baseColorTexture), u.setMatrix("albedoMatrix", e.baseColorTexture.getTextureMatrix())), e.baseColor !== null && u.setColor3("albedoColor", e.baseColor);
					}
				}
				if (this._enableIrradiance && r.environmentTexture) {
					let e = r.environmentTexture, t = r.postProcessRenderPipelineManager.supportedPipelines.find((e) => e.getClassName() === "IBLShadowsRenderPipeline");
					if (t) {
						let e = t._getAccumulatedTexture();
						e && (u.setTexture("iblShadowSampler", e), u.setFloat2("shadowTextureSize", e.getSize().width, e.getSize().height));
					}
					if (u.setMatrix("reflectionMatrix", e.getReflectionTextureMatrix()), u.setFloat2("vReflectionInfos", e.level * r.iblIntensity, 0), u.setTexture("reflectionSampler", e), e.irradianceTexture && (u.setTexture("irradianceSampler", e.irradianceTexture), e.irradianceTexture._dominantDirection && u.setVector3("vReflectionDominantDirection", e.irradianceTexture._dominantDirection)), e.sphericalPolynomial) {
						let t = e.sphericalPolynomial;
						if (t.preScaledHarmonics) {
							let e = t.preScaledHarmonics;
							u.setVector3("vSphericalL00", e.l00), u.setVector3("vSphericalL1_1", e.l1_1), u.setVector3("vSphericalL10", e.l10), u.setVector3("vSphericalL11", e.l11), u.setVector3("vSphericalL2_2", e.l2_2), u.setVector3("vSphericalL2_1", e.l2_1), u.setVector3("vSphericalL20", e.l20), u.setVector3("vSphericalL21", e.l21), u.setVector3("vSphericalL22", e.l22);
						} else u.setFloat3("vSphericalX", t.x.x, t.x.y, t.x.z), u.setFloat3("vSphericalY", t.y.x, t.y.y, t.y.z), u.setFloat3("vSphericalZ", t.z.x, t.z.y, t.z.z), u.setFloat3("vSphericalXX_ZZ", t.xx.x - t.zz.x, t.xx.y - t.zz.y, t.xx.z - t.zz.z), u.setFloat3("vSphericalYY_ZZ", t.yy.x - t.zz.x, t.yy.y - t.zz.y, t.yy.z - t.zz.z), u.setFloat3("vSphericalZZ", t.zz.x, t.zz.y, t.zz.z), u.setFloat3("vSphericalXY", t.xy.x, t.xy.y, t.xy.z), u.setFloat3("vSphericalYZ", t.yz.x, t.yz.y, t.yz.z), u.setFloat3("vSphericalZX", t.zx.x, t.zx.y, t.zx.z);
					}
					if (this.generateIrradianceWithScatterMask && a.getClassName() === "OpenPBRMaterial") {
						let e = a;
						u.setFloat("vSubsurfaceWeight", e.subsurfaceWeight), e.subsurfaceWeightTexture && (u.setTexture("subsurfaceWeightSampler", e.subsurfaceWeightTexture), u.setMatrix("subsurfaceWeightMatrix", e.subsurfaceWeightTexture.getTextureMatrix())), u.setFloat("vTransmissionWeight", e.transmissionWeight), e.transmissionWeightTexture && (u.setTexture("transmissionWeightSampler", e.transmissionWeightTexture), u.setMatrix("transmissionWeightMatrix", e.transmissionWeightTexture.getTextureMatrix())), u.setFloat("vTransmissionScatterAnisotropy", e.transmissionScatterAnisotropy), u.setFloat("vSubsurfaceScatterAnisotropy", e.subsurfaceScatterAnisotropy);
					}
				}
				if (ce(u, a, this._scene), t.useBones && t.computeBonesUsingShaders && t.skeleton) {
					let e = t.skeleton;
					if (e.isUsingTextureForMatrices && u.getUniformIndex("boneTextureInfo") > -1) {
						let n = e.getTransformMatrixTexture(t);
						u.setTexture("boneSampler", n), u.setFloat2("boneTextureInfo", e._textureWidth, e._textureHeight);
					} else u.setMatrices("mBones", t.skeleton.getTransformMatrices(t));
					(this._enableVelocity || this._enableVelocityLinear) && u.setMatrices("mPreviousBones", this._previousBonesTransformationMatrices[t.uniqueId]);
				}
				if (xe(t, u), t.morphTargetManager && t.morphTargetManager.isUsingTextureForTargets && t.morphTargetManager._bind(u), (this._enableVelocity || this._enableVelocityLinear) && (u.setMatrix("previousWorld", this._previousTransformationMatrices[n.uniqueId].world), u.setMatrix("previousViewProjection", this._previousTransformationMatrices[n.uniqueId].viewProjection)), this._enableObjectId) {
					let e = t.uniqueId;
					if (this.objectIdProvider) e = P(t, this.objectIdProvider);
					else if (e > 16777215) throw Error(`Invalid geometry object ID ${e} for mesh "${t.name}". Object IDs must be integers between 0 and 0xFFFFFF.`);
					u.setFloat("objectId", e);
				}
				if (this._enableMeshBlendTag) {
					let e = this.meshBlendTagProvider ? O(t, this.meshBlendTagProvider) : t.meshBlendingTag;
					u.setInt("meshBlendTag", e);
				}
				c && t.hasThinInstances && u.setMatrix("world", l), t._processRendering(n, e, u, a.fillMode, o, c, (e, t) => {
					e || u.setMatrix("world", t);
				});
			}
			(this._enableVelocity || this._enableVelocityLinear) && (this._previousTransformationMatrices[n.uniqueId].world = l.clone(), this._previousTransformationMatrices[n.uniqueId].viewProjection = this._scene.getTransformMatrix().clone(), t.skeleton && this._copyBonesTransformationMatrices(t.skeleton.getTransformMatrices(t), this._previousBonesTransformationMatrices[n.uniqueId]));
		};
		this._multiRenderTarget.customIsReadyFunction = (e, n, r) => {
			if ((r || n === 0) && e.subMeshes) for (let n = 0; n < e.subMeshes.length; ++n) {
				let r = e.subMeshes[n], i = r.getMaterial(), a = r.getRenderingMesh();
				if (!i) continue;
				let o = a._getInstancesRenderList(r._id, !!r.getReplacementMesh()), s = t.getCaps().instancedArrays && (o.visibleInstances[r._id] !== null || a.hasThinInstances);
				if (!this.isReady(r, s)) return !1;
			}
			return !0;
		}, this._multiRenderTarget.customRenderFunction = (e, n, r, i) => {
			let a;
			if (this._linkedWithPrePass) {
				if (!this._prePassRenderer.enabled) return;
				this._scene.getEngine().bindAttachments(this._attachmentsFromPrePass);
			}
			if (i.length) {
				for (t.setColorWrite(!1), a = 0; a < i.length; a++) v(i.data[a]);
				t.setColorWrite(!0);
			}
			for (a = 0; a < e.length; a++) v(e.data[a]);
			for (t.setDepthWrite(!1), a = 0; a < n.length; a++) v(n.data[a]);
			if (this.renderTransparentMeshes) for (a = 0; a < r.length; a++) v(r.data[a]);
			t.setDepthWrite(!0);
		};
	}
	_getRenderTargetDimensions() {
		if (typeof this._ratioOrDimensions == "object") return {
			width: Math.max(1, Math.floor(this._ratioOrDimensions.width)),
			height: Math.max(1, Math.floor(this._ratioOrDimensions.height))
		};
		let e = this._scene.getEngine();
		return {
			width: Math.max(1, Math.floor(e.getRenderWidth() * this._ratioOrDimensions)),
			height: Math.max(1, Math.floor(e.getRenderHeight() * this._ratioOrDimensions))
		};
	}
	_copyBonesTransformationMatrices(e, t) {
		for (let n = 0; n < e.length; n++) t[n] = e[n];
		return t;
	}
};
G.ForceGLSL = !1, G.DEPTH_TEXTURE_TYPE = 0, G.NORMAL_TEXTURE_TYPE = 1, G.POSITION_TEXTURE_TYPE = 2, G.VELOCITY_TEXTURE_TYPE = 3, G.REFLECTIVITY_TEXTURE_TYPE = 4, G.SCREENSPACE_DEPTH_TEXTURE_TYPE = 5, G.VELOCITY_LINEAR_TEXTURE_TYPE = 6, G.IRRADIANCE_TEXTURE_TYPE = 7, G.OBJECT_ID_TEXTURE_TYPE = 8, G.MESH_BLEND_TAG_TEXTURE_TYPE = 9, G._SceneComponentInitialization = (e) => {
	throw h("GeometryBufferRendererSceneComponent");
};
//#endregion
//#region node_modules/@babylonjs/core/Materials/PBR/openpbrMaterial.pure.js
var K = {
	effect: null,
	subMesh: null
};
function q(e) {
	if (typeof e == "number") return 1;
	if (e instanceof u) return 2;
	if (e instanceof p || e instanceof f) return 3;
	if (e instanceof l || e instanceof d) return 4;
	throw Error("Unsupported OpenPBR property type.");
}
var Ve = class e {
	populateVectorFromLinkedProperties(t) {
		let n = q(t);
		for (let t in this.linkedProperties) {
			let r = this.linkedProperties[t], i = r.numComponents;
			if (n < i || r.targetUniformComponentOffset > n - i) {
				i == 1 ? _.Error(`Float property ${r.name} has an offset that is too large.`) : _.Error(`Vector${i} property ${r.name} won't fit in Vector${n} or has an offset that is too large.`);
				return;
			}
			typeof r.value == "number" ? e._tmpArray[r.targetUniformComponentOffset] = r.value : r.value.toArray(e._tmpArray, r.targetUniformComponentOffset);
		}
		t.fromArray(e._tmpArray);
	}
	constructor(e, t) {
		this.linkedProperties = {}, this.firstLinkedKey = "", this.name = e, this.numComponents = t;
	}
};
Ve._tmpArray = [
	0,
	0,
	0,
	0
];
var J = class {
	constructor(e, t, n, r, i = 0, a) {
		this.targetUniformComponentNum = 4, this.targetUniformComponentOffset = 0, this.name = e, this.targetUniformName = n, this.defaultValue = t, this.value = t, this.targetUniformComponentNum = r, this.targetUniformComponentOffset = i, this.requiredDefine = a;
	}
	get numComponents() {
		return typeof this.defaultValue == "number" ? 1 : q(this.defaultValue);
	}
}, Y = class {
	get samplerName() {
		return this.samplerPrefix + "Sampler";
	}
	get samplerInfoName() {
		return "v" + this.samplerPrefix.charAt(0).toUpperCase() + this.samplerPrefix.slice(1) + "Infos";
	}
	get samplerMatrixName() {
		return this.samplerPrefix + "Matrix";
	}
	constructor(e, t, n) {
		this.value = null, this.samplerPrefix = "", this.textureDefine = "", this.name = e, this.samplerPrefix = t, this.textureDefine = n;
	}
}, X = class extends j(M(k)) {}, Z = class extends L(X) {}, He = class extends A(Z) {
	constructor(e) {
		super(e), this.NUM_SAMPLES = "0", this.REALTIME_FILTERING = !1, this.IBL_CDF_FILTERING = !1, this.LIGHTCOUNT = 0, this.VERTEXCOLOR = !1, this.BAKED_VERTEX_ANIMATION_TEXTURE = !1, this.VERTEXALPHA = !1, this.ALPHATEST = !1, this.DEPTHPREPASS = !1, this.ALPHABLEND = !1, this.ALPHA_FROM_BASE_COLOR_TEXTURE = !1, this.ALPHATESTVALUE = "0.5", this.PREMULTIPLYALPHA = !1, this.REFLECTIVITY_GAMMA = !1, this.REFLECTIVITYDIRECTUV = 0, this.SPECULARTERM = !1, this.LODBASEDMICROSFURACE = !0, this.SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN = !1, this.BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE = !1, this.AOSTOREINMETALMAPRED = !1, this.SPECULAR_WEIGHT_IN_ALPHA = !1, this.SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE = !1, this.SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = !1, this.COAT_ROUGHNESS_FROM_GREEN_CHANNEL = !1, this.COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = !1, this.USE_GLTF_STYLE_ANISOTROPY = !1, this.THIN_FILM_THICKNESS_FROM_THIN_FILM_TEXTURE = !1, this.FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA = !1, this.SUBSURFACE_WEIGHT_FROM_TEXTURE_ALPHA = !1, this.GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL = !1, this.ENVIRONMENTBRDF = !1, this.ENVIRONMENTBRDF_RGBD = !1, this.FUZZENVIRONMENTBRDF = !1, this.NORMAL = !1, this.TANGENT = !1, this.OBJECTSPACE_NORMALMAP = !1, this.PARALLAX = !1, this.PARALLAX_RHS = !1, this.PARALLAXOCCLUSION = !1, this.NORMALXYSCALE = !0, this.ANISOTROPIC = !1, this.ANISOTROPIC_OPENPBR = !0, this.ANISOTROPIC_BASE = !1, this.ANISOTROPIC_COAT = !1, this.FUZZ_IBL_SAMPLES = 6, this.REFRACTION_HIGH_QUALITY_BLUR = !1, this.FUZZ = !1, this.THIN_FILM = !1, this.IRIDESCENCE = !1, this.DISPERSION = !1, this.SCATTERING = !1, this.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING = !1, this.SSS_SAMPLE_COUNT = 16, this.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER = !1, this.TRANSMISSION_SLAB = !1, this.TRANSMISSION_SLAB_VOLUME = !1, this.SUBSURFACE_SLAB = !1, this.GEOMETRY_THIN_WALLED = !1, this.REFRACTED_BACKGROUND = !1, this.REFRACTED_LIGHTS = !1, this.REFRACTED_ENVIRONMENT = !1, this.REFRACTED_ENVIRONMENT_OPPOSITEZ = !1, this.REFRACTED_ENVIRONMENT_LOCAL_CUBE = !1, this.RADIANCEOCCLUSION = !1, this.HORIZONOCCLUSION = !1, this.INSTANCES = !1, this.THIN_INSTANCES = !1, this.INSTANCESCOLOR = !1, this.NUM_BONE_INFLUENCERS = 0, this.BonesPerMesh = 0, this.BONETEXTURE = !1, this.BONES_VELOCITY_ENABLED = !1, this.NONUNIFORMSCALING = !1, this.MORPHTARGETS = !1, this.MORPHTARGETS_POSITION = !1, this.MORPHTARGETS_NORMAL = !1, this.MORPHTARGETS_TANGENT = !1, this.MORPHTARGETS_UV = !1, this.MORPHTARGETS_UV2 = !1, this.MORPHTARGETS_COLOR = !1, this.MORPHTARGETTEXTURE_HASPOSITIONS = !1, this.MORPHTARGETTEXTURE_HASNORMALS = !1, this.MORPHTARGETTEXTURE_HASTANGENTS = !1, this.MORPHTARGETTEXTURE_HASUVS = !1, this.MORPHTARGETTEXTURE_HASUV2S = !1, this.MORPHTARGETTEXTURE_HASCOLORS = !1, this.NUM_MORPH_INFLUENCERS = 0, this.MORPHTARGETS_TEXTURE = !1, this.USEPHYSICALLIGHTFALLOFF = !1, this.USEGLTFLIGHTFALLOFF = !1, this.TWOSIDEDLIGHTING = !1, this.MIRRORED = !1, this.SHADOWFLOAT = !1, this.CLIPPLANE = !1, this.CLIPPLANE2 = !1, this.CLIPPLANE3 = !1, this.CLIPPLANE4 = !1, this.CLIPPLANE5 = !1, this.CLIPPLANE6 = !1, this.POINTSIZE = !1, this.FOG = !1, this.LOGARITHMICDEPTH = !1, this.CAMERA_ORTHOGRAPHIC = !1, this.CAMERA_PERSPECTIVE = !1, this.AREALIGHTSUPPORTED = !0, this.FORCENORMALFORWARD = !1, this.SPECULARAA = !1, this.UNLIT = !1, this.DECAL_AFTER_DETAIL = !1, this.TEXTURE_REPETITION_MODE = 0, this.DEBUGMODE = 0, this.USE_VERTEX_PULLING = !1, this.VERTEX_PULLING_USE_INDEX_BUFFER = !1, this.VERTEX_PULLING_INDEX_BUFFER_32BITS = !1, this.RIGHT_HANDED = !1, this.CLUSTLIGHT_SLICES = 0, this.CLUSTLIGHT_BATCH = 0, this.BRDF_V_HEIGHT_CORRELATED = !0, this.MS_BRDF_ENERGY_CONSERVATION = !0, this.SPHERICAL_HARMONICS = !0, this.SPECULAR_GLOSSINESS_ENERGY_CONSERVATION = !0, this.MIX_IBL_RADIANCE_WITH_IRRADIANCE = !0, this.LEGACY_SPECULAR_ENERGY_CONSERVATION = !1, this.BASE_DIFFUSE_MODEL = 0, this.DIELECTRIC_SPECULAR_MODEL = 1, this.CONDUCTOR_SPECULAR_MODEL = 1, this.rebuild();
	}
	reset() {
		super.reset(), this.ALPHATESTVALUE = "0.5", this.NORMALXYSCALE = !0;
	}
}, Ue = class extends ze(N) {}, Q = (() => {
	var s, d, p, m, h, y, b, S, de, w, E, D, O, k, A, j, M, N, ze, P, F, I, L, R, z, B, V, H, U, W, q, X, Z, Q, $, We, Ge, Ke, qe, Je, Ye, Xe, Ze, Qe, $e, et, tt, nt, rt, it, at, ot, st, ct, lt, ut, dt, ft, pt, mt, ht, gt, _t, vt, yt, bt, xt, St, Ct, wt, Tt, Et, Dt, Ot, kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn;
	let an = Ue, on = [], sn, cn = [], ln = [], un, dn = [], fn = [], pn, mn = [], hn = [], gn, _n = [], vn = [], yn, bn = [], xn = [], Sn, Cn = [], wn = [], Tn, En = [], Dn = [], On, kn = [], An = [], jn, Mn = [], Nn = [], Pn, Fn = [], In = [], Ln, Rn = [], zn = [], Bn, Vn = [], Hn = [], Un, Wn = [], Gn = [], Kn, qn = [], Jn = [], Yn, Xn = [], Zn = [], Qn, $n = [], er = [], tr, nr = [], rr = [], ir, ar = [], or = [], sr, cr = [], lr = [], ur, dr = [], fr = [], pr, mr = [], hr = [], gr, _r = [], vr = [], yr, br = [], xr = [], Sr, Cr = [], wr = [], Tr, Er = [], Dr = [], Or, kr = [], Ar = [], jr, Mr = [], Nr = [], Pr, Fr = [], Ir = [], Lr, Rr = [], zr = [], Br, Vr = [], Hr = [], Ur, Wr = [], Gr = [], Kr, qr = [], Jr = [], Yr, Xr = [], Zr = [], Qr, $r = [], ei = [], ti, ni = [], ri = [], ii, ai = [], oi = [], si, ci = [], li = [], ui, di = [], fi = [], pi, mi = [], hi = [], gi, _i = [], vi = [], yi, bi = [], xi = [], Si, Ci = [], wi = [], Ti, Ei = [], Di = [], Oi, ki = [], Ai = [], ji, Mi = [], Ni = [], Pi, Fi = [], Ii = [], Li, Ri = [], zi = [], Bi, Vi = [], Hi = [], Ui, Wi = [], Gi = [], Ki, qi = [], Ji = [], Yi, Xi = [], Zi = [], Qi, $i = [], ea = [], ta, na = [], ra = [], ia, aa = [], oa = [], sa, ca = [], la = [], ua, da = [], fa = [], pa, ma = [], ha = [], ga, _a = [], va = [], ya, ba = [], xa = [], Sa, Ca = [], wa = [], Ta, Ea = [], Da = [], Oa, ka = [], Aa = [], ja, Ma = [], Na = [], Pa, Fa = [], Ia = [], La, Ra = [], za = [], Ba, Va = [], Ha = [], Ua, Wa = [], Ga = [], Ka, qa = [], Ja = [], Ya, Xa = [], Za = [], Qa, $a = [], eo = [], to, no = [], ro = [], io, ao = [], oo = [], so, co = [], lo = [], uo, fo = [], po = [], mo, ho = [], go = [], _o, vo = [], yo = [], bo, xo = [], So = [], Co, wo = [], To = [], Eo, Do = [], Oo = [], ko, Ao = [], jo = [], Mo, No = [], Po = [], Fo, Io = [], Lo = [], Ro, zo, Bo, Vo = [], Ho = [], Uo, Wo = [], Go = [], Ko, qo = [], Jo = [], Yo, Xo = [], Zo = [], Qo, $o = [], es = [], ts, ns = [], rs = [], is, as = [], os = [], ss, cs = [], ls = [], us, ds = [], fs = [], ps, ms = [], hs = [], gs, _s = [], vs = [], ys, bs = [], xs = [], Ss, Cs = [], ws = [], Ts, Es = [], Ds = [], Os, ks = [], As = [], js, Ms = [], Ns = [], Ps, Fs = [], Is = [], Ls, Rs = [], zs = [], Bs, Vs = [], Hs = [], Us, Ws = [], Gs = [], Ks;
	return s = class extends an {
		get baseWeight() {
			return o(this, d, "f");
		}
		set baseWeight(e) {
			t(this, d, e, "f");
		}
		get baseWeightTexture() {
			return o(this, p, "f");
		}
		set baseWeightTexture(e) {
			t(this, p, e, "f");
		}
		get baseColor() {
			return o(this, m, "f");
		}
		set baseColor(e) {
			t(this, m, e, "f");
		}
		get baseColorTexture() {
			return o(this, h, "f");
		}
		set baseColorTexture(e) {
			t(this, h, e, "f");
		}
		get baseDiffuseRoughness() {
			return o(this, y, "f");
		}
		set baseDiffuseRoughness(e) {
			t(this, y, e, "f");
		}
		get baseDiffuseRoughnessTexture() {
			return o(this, b, "f");
		}
		set baseDiffuseRoughnessTexture(e) {
			t(this, b, e, "f");
		}
		get baseMetalness() {
			return o(this, S, "f");
		}
		set baseMetalness(e) {
			t(this, S, e, "f");
		}
		get baseMetalnessTexture() {
			return o(this, de, "f");
		}
		set baseMetalnessTexture(e) {
			t(this, de, e, "f");
		}
		get specularWeight() {
			return o(this, w, "f");
		}
		set specularWeight(e) {
			t(this, w, e, "f");
		}
		get specularWeightTexture() {
			return o(this, E, "f");
		}
		set specularWeightTexture(e) {
			t(this, E, e, "f");
		}
		get specularColor() {
			return o(this, D, "f");
		}
		set specularColor(e) {
			t(this, D, e, "f");
		}
		get specularColorTexture() {
			return o(this, O, "f");
		}
		set specularColorTexture(e) {
			t(this, O, e, "f");
		}
		get specularRoughness() {
			return o(this, k, "f");
		}
		set specularRoughness(e) {
			t(this, k, e, "f");
		}
		get specularRoughnessTexture() {
			return o(this, A, "f");
		}
		set specularRoughnessTexture(e) {
			t(this, A, e, "f");
		}
		get specularRoughnessAnisotropy() {
			return o(this, j, "f");
		}
		set specularRoughnessAnisotropy(e) {
			t(this, j, e, "f");
		}
		get specularRoughnessAnisotropyTexture() {
			return o(this, M, "f");
		}
		set specularRoughnessAnisotropyTexture(e) {
			t(this, M, e, "f");
		}
		get specularIor() {
			return o(this, N, "f");
		}
		set specularIor(e) {
			t(this, N, e, "f");
		}
		get transmissionWeight() {
			return o(this, ze, "f");
		}
		set transmissionWeight(e) {
			t(this, ze, e, "f");
		}
		get transmissionWeightTexture() {
			return o(this, P, "f");
		}
		set transmissionWeightTexture(e) {
			t(this, P, e, "f");
		}
		get transmissionColor() {
			return o(this, F, "f");
		}
		set transmissionColor(e) {
			t(this, F, e, "f");
		}
		get transmissionColorTexture() {
			return o(this, I, "f");
		}
		set transmissionColorTexture(e) {
			t(this, I, e, "f");
		}
		get transmissionDepth() {
			return o(this, L, "f");
		}
		set transmissionDepth(e) {
			t(this, L, e, "f");
		}
		get transmissionDepthTexture() {
			return o(this, R, "f");
		}
		set transmissionDepthTexture(e) {
			t(this, R, e, "f");
		}
		get transmissionScatter() {
			return o(this, z, "f");
		}
		set transmissionScatter(e) {
			t(this, z, e, "f");
		}
		get transmissionScatterTexture() {
			return o(this, B, "f");
		}
		set transmissionScatterTexture(e) {
			t(this, B, e, "f");
		}
		get transmissionScatterAnisotropy() {
			return o(this, V, "f");
		}
		set transmissionScatterAnisotropy(e) {
			t(this, V, e, "f");
		}
		get transmissionDispersionScale() {
			return o(this, H, "f");
		}
		set transmissionDispersionScale(e) {
			t(this, H, e, "f");
		}
		get transmissionDispersionScaleTexture() {
			return o(this, U, "f");
		}
		set transmissionDispersionScaleTexture(e) {
			t(this, U, e, "f");
		}
		get transmissionDispersionAbbeNumber() {
			return o(this, W, "f");
		}
		set transmissionDispersionAbbeNumber(e) {
			t(this, W, e, "f");
		}
		get subsurfaceWeight() {
			return o(this, q, "f");
		}
		set subsurfaceWeight(e) {
			t(this, q, e, "f");
		}
		get subsurfaceWeightTexture() {
			return o(this, X, "f");
		}
		set subsurfaceWeightTexture(e) {
			t(this, X, e, "f");
		}
		get subsurfaceColor() {
			return o(this, Z, "f");
		}
		set subsurfaceColor(e) {
			t(this, Z, e, "f");
		}
		get subsurfaceColorTexture() {
			return o(this, Q, "f");
		}
		set subsurfaceColorTexture(e) {
			t(this, Q, e, "f");
		}
		get subsurfaceRadius() {
			return o(this, $, "f");
		}
		set subsurfaceRadius(e) {
			t(this, $, e, "f");
		}
		get subsurfaceRadiusScale() {
			return o(this, We, "f");
		}
		set subsurfaceRadiusScale(e) {
			t(this, We, e, "f");
		}
		get subsurfaceRadiusScaleTexture() {
			return o(this, Ge, "f");
		}
		set subsurfaceRadiusScaleTexture(e) {
			t(this, Ge, e, "f");
		}
		get subsurfaceScatterAnisotropy() {
			return o(this, Ke, "f");
		}
		set subsurfaceScatterAnisotropy(e) {
			t(this, Ke, e, "f");
		}
		get coatWeight() {
			return o(this, qe, "f");
		}
		set coatWeight(e) {
			t(this, qe, e, "f");
		}
		get coatWeightTexture() {
			return o(this, Je, "f");
		}
		set coatWeightTexture(e) {
			t(this, Je, e, "f");
		}
		get coatColor() {
			return o(this, Ye, "f");
		}
		set coatColor(e) {
			t(this, Ye, e, "f");
		}
		get coatColorTexture() {
			return o(this, Xe, "f");
		}
		set coatColorTexture(e) {
			t(this, Xe, e, "f");
		}
		get coatRoughness() {
			return o(this, Ze, "f");
		}
		set coatRoughness(e) {
			t(this, Ze, e, "f");
		}
		get coatRoughnessTexture() {
			return o(this, Qe, "f");
		}
		set coatRoughnessTexture(e) {
			t(this, Qe, e, "f");
		}
		get coatRoughnessAnisotropy() {
			return o(this, $e, "f");
		}
		set coatRoughnessAnisotropy(e) {
			t(this, $e, e, "f");
		}
		get coatRoughnessAnisotropyTexture() {
			return o(this, et, "f");
		}
		set coatRoughnessAnisotropyTexture(e) {
			t(this, et, e, "f");
		}
		get coatIor() {
			return o(this, tt, "f");
		}
		set coatIor(e) {
			t(this, tt, e, "f");
		}
		get coatDarkening() {
			return o(this, nt, "f");
		}
		set coatDarkening(e) {
			t(this, nt, e, "f");
		}
		get coatDarkeningTexture() {
			return o(this, rt, "f");
		}
		set coatDarkeningTexture(e) {
			t(this, rt, e, "f");
		}
		get fuzzWeight() {
			return o(this, it, "f");
		}
		set fuzzWeight(e) {
			t(this, it, e, "f");
		}
		get fuzzWeightTexture() {
			return o(this, at, "f");
		}
		set fuzzWeightTexture(e) {
			t(this, at, e, "f");
		}
		get fuzzColor() {
			return o(this, ot, "f");
		}
		set fuzzColor(e) {
			t(this, ot, e, "f");
		}
		get fuzzColorTexture() {
			return o(this, st, "f");
		}
		set fuzzColorTexture(e) {
			t(this, st, e, "f");
		}
		get fuzzRoughness() {
			return o(this, ct, "f");
		}
		set fuzzRoughness(e) {
			t(this, ct, e, "f");
		}
		get fuzzRoughnessTexture() {
			return o(this, lt, "f");
		}
		set fuzzRoughnessTexture(e) {
			t(this, lt, e, "f");
		}
		get geometryThinWalled() {
			return o(this, ut, "f");
		}
		set geometryThinWalled(e) {
			t(this, ut, e, "f");
		}
		get geometryNormalTexture() {
			return o(this, dt, "f");
		}
		set geometryNormalTexture(e) {
			t(this, dt, e, "f");
		}
		get geometryTangent() {
			return o(this, ft, "f");
		}
		set geometryTangent(e) {
			t(this, ft, e, "f");
		}
		get geometryTangentAngle() {
			return Math.atan2(this.geometryTangent.y, this.geometryTangent.x);
		}
		set geometryTangentAngle(e) {
			this.geometryTangent = new u(Math.cos(e), Math.sin(e));
		}
		get geometryTangentTexture() {
			return o(this, pt, "f");
		}
		set geometryTangentTexture(e) {
			t(this, pt, e, "f");
		}
		get geometryCoatNormalTexture() {
			return o(this, mt, "f");
		}
		set geometryCoatNormalTexture(e) {
			t(this, mt, e, "f");
		}
		get geometryCoatTangent() {
			return o(this, ht, "f");
		}
		set geometryCoatTangent(e) {
			t(this, ht, e, "f");
		}
		get geometryCoatTangentAngle() {
			return Math.atan2(this.geometryCoatTangent.y, this.geometryCoatTangent.x);
		}
		set geometryCoatTangentAngle(e) {
			this.geometryCoatTangent = new u(Math.cos(e), Math.sin(e));
		}
		get geometryCoatTangentTexture() {
			return o(this, gt, "f");
		}
		set geometryCoatTangentTexture(e) {
			t(this, gt, e, "f");
		}
		get geometryOpacity() {
			return o(this, _t, "f");
		}
		set geometryOpacity(e) {
			t(this, _t, e, "f");
		}
		get geometryOpacityTexture() {
			return o(this, vt, "f");
		}
		set geometryOpacityTexture(e) {
			t(this, vt, e, "f");
		}
		get geometryThickness() {
			return o(this, yt, "f");
		}
		set geometryThickness(e) {
			t(this, yt, e, "f");
		}
		get geometryThicknessTexture() {
			return o(this, bt, "f");
		}
		set geometryThicknessTexture(e) {
			t(this, bt, e, "f");
		}
		get emissionLuminance() {
			return o(this, xt, "f");
		}
		set emissionLuminance(e) {
			t(this, xt, e, "f");
		}
		get emissionColor() {
			return o(this, St, "f");
		}
		set emissionColor(e) {
			t(this, St, e, "f");
		}
		get emissionColorTexture() {
			return o(this, Ct, "f");
		}
		set emissionColorTexture(e) {
			t(this, Ct, e, "f");
		}
		get thinFilmWeight() {
			return o(this, wt, "f");
		}
		set thinFilmWeight(e) {
			t(this, wt, e, "f");
		}
		get thinFilmWeightTexture() {
			return o(this, Tt, "f");
		}
		set thinFilmWeightTexture(e) {
			t(this, Tt, e, "f");
		}
		get thinFilmThickness() {
			return o(this, Et, "f");
		}
		set thinFilmThickness(e) {
			t(this, Et, e, "f");
		}
		get thinFilmThicknessMin() {
			return o(this, Dt, "f");
		}
		set thinFilmThicknessMin(e) {
			t(this, Dt, e, "f");
		}
		get thinFilmThicknessTexture() {
			return o(this, Ot, "f");
		}
		set thinFilmThicknessTexture(e) {
			t(this, Ot, e, "f");
		}
		get thinFilmIor() {
			return o(this, kt, "f");
		}
		set thinFilmIor(e) {
			t(this, kt, e, "f");
		}
		get ambientOcclusionTexture() {
			return o(this, At, "f");
		}
		set ambientOcclusionTexture(e) {
			t(this, At, e, "f");
		}
		get sssQuality() {
			return this._sssQuality;
		}
		set sssQuality(e) {
			this._sssQuality !== e && (this._sssQuality = e, this.markAsDirty(1));
		}
		get sssIrradianceTexture() {
			return this._sssIrradianceTexture;
		}
		set sssIrradianceTexture(e) {
			this._sssIrradianceTexture !== e && (this._sssIrradianceTexture = e, this._markAllSubMeshesAsTexturesDirty());
		}
		get sssDepthTexture() {
			return this._sssDepthTexture;
		}
		set sssDepthTexture(e) {
			this._sssDepthTexture !== e && (this._sssDepthTexture = e, this._markAllSubMeshesAsTexturesDirty());
		}
		get directIntensity() {
			return o(this, jt, "f");
		}
		set directIntensity(e) {
			t(this, jt, e, "f");
		}
		get environmentIntensity() {
			return o(this, Mt, "f");
		}
		set environmentIntensity(e) {
			t(this, Mt, e, "f");
		}
		get useSpecularWeightFromTextureAlpha() {
			return o(this, Nt, "f");
		}
		set useSpecularWeightFromTextureAlpha(e) {
			t(this, Nt, e, "f");
		}
		get forceAlphaTest() {
			return o(this, Pt, "f");
		}
		set forceAlphaTest(e) {
			t(this, Pt, e, "f");
		}
		get alphaCutOff() {
			return o(this, Ft, "f");
		}
		set alphaCutOff(e) {
			t(this, Ft, e, "f");
		}
		get useAmbientOcclusionFromMetallicTextureRed() {
			return o(this, It, "f");
		}
		set useAmbientOcclusionFromMetallicTextureRed(e) {
			t(this, It, e, "f");
		}
		get useAmbientInGrayScale() {
			return o(this, Lt, "f");
		}
		set useAmbientInGrayScale(e) {
			t(this, Lt, e, "f");
		}
		get hasTransparency() {
			return this.subsurfaceWeight > 0 || this.transmissionWeight > 0;
		}
		get hasScattering() {
			return this.transmissionWeight > 0 && this.transmissionDepth > 0 && !this.transmissionScatter.equals(f.BlackReadOnly) || this.subsurfaceWeight > 0;
		}
		get usePhysicalLightFalloff() {
			return this._lightFalloff === T.LIGHTFALLOFF_PHYSICAL;
		}
		set usePhysicalLightFalloff(e) {
			e !== this.usePhysicalLightFalloff && (this._markAllSubMeshesAsTexturesDirty(), this._lightFalloff = e ? T.LIGHTFALLOFF_PHYSICAL : T.LIGHTFALLOFF_STANDARD);
		}
		get useGLTFLightFalloff() {
			return this._lightFalloff === T.LIGHTFALLOFF_GLTF;
		}
		set useGLTFLightFalloff(e) {
			e !== this.useGLTFLightFalloff && (this._markAllSubMeshesAsTexturesDirty(), this._lightFalloff = e ? T.LIGHTFALLOFF_GLTF : T.LIGHTFALLOFF_STANDARD);
		}
		get useObjectSpaceNormalMap() {
			return o(this, Rt, "f");
		}
		set useObjectSpaceNormalMap(e) {
			t(this, Rt, e, "f");
		}
		get useParallax() {
			return o(this, zt, "f");
		}
		set useParallax(e) {
			t(this, zt, e, "f");
		}
		get useParallaxOcclusion() {
			return o(this, Bt, "f");
		}
		set useParallaxOcclusion(e) {
			t(this, Bt, e, "f");
		}
		get parallaxScaleBias() {
			return o(this, Vt, "f");
		}
		set parallaxScaleBias(e) {
			t(this, Vt, e, "f");
		}
		get disableLighting() {
			return o(this, Ht, "f");
		}
		set disableLighting(e) {
			t(this, Ht, e, "f");
		}
		get forceIrradianceInFragment() {
			return o(this, Ut, "f");
		}
		set forceIrradianceInFragment(e) {
			t(this, Ut, e, "f");
		}
		get maxSimultaneousLights() {
			return o(this, Wt, "f");
		}
		set maxSimultaneousLights(e) {
			t(this, Wt, e, "f");
		}
		get invertNormalMapX() {
			return o(this, Gt, "f");
		}
		set invertNormalMapX(e) {
			t(this, Gt, e, "f");
		}
		get invertNormalMapY() {
			return o(this, Kt, "f");
		}
		set invertNormalMapY(e) {
			t(this, Kt, e, "f");
		}
		get twoSidedLighting() {
			return o(this, qt, "f");
		}
		set twoSidedLighting(e) {
			t(this, qt, e, "f");
		}
		get useAlphaFresnel() {
			return o(this, Jt, "f");
		}
		set useAlphaFresnel(e) {
			t(this, Jt, e, "f");
		}
		get useLinearAlphaFresnel() {
			return o(this, Yt, "f");
		}
		set useLinearAlphaFresnel(e) {
			t(this, Yt, e, "f");
		}
		get environmentBRDFTexture() {
			return o(this, Xt, "f");
		}
		set environmentBRDFTexture(e) {
			t(this, Xt, e, "f");
		}
		get forceNormalForward() {
			return o(this, Zt, "f");
		}
		set forceNormalForward(e) {
			t(this, Zt, e, "f");
		}
		get enableSpecularAntiAliasing() {
			return o(this, Qt, "f");
		}
		set enableSpecularAntiAliasing(e) {
			t(this, Qt, e, "f");
		}
		get useHorizonOcclusion() {
			return o(this, $t, "f");
		}
		set useHorizonOcclusion(e) {
			t(this, $t, e, "f");
		}
		get useRadianceOcclusion() {
			return o(this, en, "f");
		}
		set useRadianceOcclusion(e) {
			t(this, en, e, "f");
		}
		get unlit() {
			return o(this, tn, "f");
		}
		set unlit(e) {
			t(this, tn, e, "f");
		}
		get applyDecalMapAfterDetailMap() {
			return o(this, nn, "f");
		}
		set applyDecalMapAfterDetailMap(e) {
			t(this, nn, e, "f");
		}
		get backgroundRefractionTexture() {
			return this._backgroundRefractionTexture;
		}
		set backgroundRefractionTexture(e) {
			this._backgroundRefractionTexture = e, this._markAllSubMeshesAsTexturesDirty();
		}
		get refractionHighQualityBlur() {
			return this._refractionHighQualityBlur;
		}
		set refractionHighQualityBlur(e) {
			this._refractionHighQualityBlur !== e && (this._refractionHighQualityBlur = e, this.markAsDirty(1));
		}
		get realTimeFiltering() {
			return this._realTimeFiltering;
		}
		set realTimeFiltering(e) {
			this._realTimeFiltering = e, this.markAsDirty(1);
		}
		get realTimeFilteringQuality() {
			return this._realTimeFilteringQuality;
		}
		set realTimeFilteringQuality(e) {
			this._realTimeFilteringQuality = e, this.markAsDirty(1);
		}
		get fuzzSampleNumber() {
			return this._fuzzSampleNumber;
		}
		set fuzzSampleNumber(e) {
			this._fuzzSampleNumber = e, this.markAsDirty(1);
		}
		get canRenderToMRT() {
			return !0;
		}
		get debugMode() {
			return o(this, rn, "f");
		}
		set debugMode(e) {
			t(this, rn, e, "f");
		}
		constructor(t, n, r = !1) {
			super(t, n, void 0, r || s.ForceGLSL), d.set(this, (e(this, on), e(this, cn, void 0))), this._baseWeight = (e(this, ln), new J("base_weight", 1, "vBaseWeight", 1)), p.set(this, e(this, dn, void 0)), this._baseWeightTexture = (e(this, fn), new Y("base_weight", "baseWeight", "BASE_WEIGHT")), m.set(this, e(this, mn, void 0)), this._baseColor = (e(this, hn), new J("base_color", f.White(), "vBaseColor", 4)), h.set(this, e(this, _n, void 0)), this._baseColorTexture = (e(this, vn), new Y("base_color", "baseColor", "BASE_COLOR")), y.set(this, e(this, bn, void 0)), this._baseDiffuseRoughness = (e(this, xn), new J("base_diffuse_roughness", 0, "vBaseDiffuseRoughness", 1)), b.set(this, e(this, Cn, void 0)), this._baseDiffuseRoughnessTexture = (e(this, wn), new Y("base_diffuse_roughness", "baseDiffuseRoughness", "BASE_DIFFUSE_ROUGHNESS")), S.set(this, e(this, En, void 0)), this._baseMetalness = (e(this, Dn), new J("base_metalness", 0, "vReflectanceInfo", 4, 0)), de.set(this, e(this, kn, void 0)), this._baseMetalnessTexture = (e(this, An), new Y("base_metalness", "baseMetalness", "BASE_METALNESS")), w.set(this, e(this, Mn, void 0)), this._specularWeight = (e(this, Nn), new J("specular_weight", 1, "vReflectanceInfo", 4, 3)), E.set(this, e(this, Fn, void 0)), this._specularWeightTexture = (e(this, In), new Y("specular_weight", "specularWeight", "SPECULAR_WEIGHT")), D.set(this, e(this, Rn, void 0)), this._specularColor = (e(this, zn), new J("specular_color", f.White(), "vSpecularColor", 4)), O.set(this, e(this, Vn, void 0)), this._specularColorTexture = (e(this, Hn), new Y("specular_color", "specularColor", "SPECULAR_COLOR")), k.set(this, e(this, Wn, void 0)), this._specularRoughness = (e(this, Gn), new J("specular_roughness", .3, "vReflectanceInfo", 4, 1)), A.set(this, e(this, qn, void 0)), this._specularRoughnessTexture = (e(this, Jn), new Y("specular_roughness", "specularRoughness", "SPECULAR_ROUGHNESS")), j.set(this, e(this, Xn, void 0)), this._specularRoughnessAnisotropy = (e(this, Zn), new J("specular_roughness_anisotropy", 0, "vSpecularAnisotropy", 3, 2)), M.set(this, e(this, $n, void 0)), this._specularRoughnessAnisotropyTexture = (e(this, er), new Y("specular_roughness_anisotropy", "specularRoughnessAnisotropy", "SPECULAR_ROUGHNESS_ANISOTROPY")), N.set(this, e(this, nr, void 0)), this._specularIor = (e(this, rr), new J("specular_ior", 1.5, "vReflectanceInfo", 4, 2)), ze.set(this, e(this, ar, void 0)), this._transmissionWeight = (e(this, or), new J("transmission_weight", 0, "vTransmissionWeight", 1)), P.set(this, e(this, cr, void 0)), this._transmissionWeightTexture = (e(this, lr), new Y("transmission_weight", "transmissionWeight", "TRANSMISSION_WEIGHT")), F.set(this, e(this, dr, void 0)), this._transmissionColor = (e(this, fr), new J("transmission_color", f.White(), "vTransmissionColor", 3, 0)), I.set(this, e(this, mr, void 0)), this._transmissionColorTexture = (e(this, hr), new Y("transmission_color", "transmissionColor", "TRANSMISSION_COLOR")), L.set(this, e(this, _r, void 0)), this._transmissionDepth = (e(this, vr), new J("transmission_depth", 0, "vTransmissionDepth", 1, 0)), R.set(this, e(this, br, void 0)), this._transmissionDepthTexture = (e(this, xr), new Y("transmission_depth", "transmissionDepth", "TRANSMISSION_DEPTH")), z.set(this, e(this, Cr, void 0)), this._transmissionScatter = (e(this, wr), new J("transmission_scatter", f.Black(), "vTransmissionScatter", 3, 0)), B.set(this, e(this, Er, void 0)), this._transmissionScatterTexture = (e(this, Dr), new Y("transmission_scatter", "transmissionScatter", "TRANSMISSION_SCATTER")), V.set(this, e(this, kr, void 0)), this._transmissionScatterAnisotropy = (e(this, Ar), new J("transmission_scatter_anisotropy", 0, "vTransmissionScatterAnisotropy", 1, 0)), H.set(this, e(this, Mr, void 0)), this._transmissionDispersionScale = (e(this, Nr), new J("transmission_dispersion_scale", 0, "vTransmissionDispersionScale", 1, 0)), U.set(this, e(this, Fr, void 0)), this._transmissionDispersionScaleTexture = (e(this, Ir), new Y("transmission_dispersion_scale", "transmissionDispersionScale", "TRANSMISSION_DISPERSION_SCALE")), W.set(this, e(this, Rr, void 0)), this._transmissionDispersionAbbeNumber = (e(this, zr), new J("transmission_dispersion_abbe_number", 20, "vTransmissionDispersionAbbeNumber", 1, 0)), q.set(this, e(this, Vr, void 0)), this._subsurfaceWeight = (e(this, Hr), new J("subsurface_weight", 0, "vSubsurfaceWeight", 1, 0, "SUBSURFACE_SLAB")), X.set(this, e(this, Wr, void 0)), this._subsurfaceWeightTexture = (e(this, Gr), new Y("subsurface_weight", "subsurfaceWeight", "SUBSURFACE_WEIGHT")), Z.set(this, e(this, qr, void 0)), this._subsurfaceColor = (e(this, Jr), new J("subsurface_color", new f(.8, .8, .8), "vSubsurfaceColor", 3, 0, "SUBSURFACE_SLAB")), Q.set(this, e(this, Xr, void 0)), this._subsurfaceColorTexture = (e(this, Zr), new Y("subsurface_color", "subsurfaceColor", "SUBSURFACE_COLOR")), $.set(this, e(this, $r, void 0)), this._subsurfaceRadius = (e(this, ei), new J("subsurface_radius", .1, "vSubsurfaceRadius", 1, 0, "SUBSURFACE_SLAB")), We.set(this, e(this, ni, void 0)), this._subsurfaceRadiusScale = (e(this, ri), new J("subsurface_radius_scale", new f(1, .5, .25), "vSubsurfaceRadiusScale", 3, 0, "SUBSURFACE_SLAB")), Ge.set(this, e(this, ai, void 0)), this._subsurfaceRadiusScaleTexture = (e(this, oi), new Y("subsurface_radius_scale", "subsurfaceRadiusScale", "SUBSURFACE_RADIUS_SCALE")), Ke.set(this, e(this, ci, void 0)), this._subsurfaceScatterAnisotropy = (e(this, li), new J("subsurface_scatter_anisotropy", 0, "vSubsurfaceScatterAnisotropy", 1, 0, "SUBSURFACE_SLAB")), qe.set(this, e(this, di, void 0)), this._coatWeight = (e(this, fi), new J("coat_weight", 0, "vCoatWeight", 1, 0)), Je.set(this, e(this, mi, void 0)), this._coatWeightTexture = (e(this, hi), new Y("coat_weight", "coatWeight", "COAT_WEIGHT")), Ye.set(this, e(this, _i, void 0)), this._coatColor = (e(this, vi), new J("coat_color", f.White(), "vCoatColor", 3, 0)), Xe.set(this, e(this, bi, void 0)), this._coatColorTexture = (e(this, xi), new Y("coat_color", "coatColor", "COAT_COLOR")), Ze.set(this, e(this, Ci, void 0)), this._coatRoughness = (e(this, wi), new J("coat_roughness", 0, "vCoatRoughness", 1, 0)), Qe.set(this, e(this, Ei, void 0)), this._coatRoughnessTexture = (e(this, Di), new Y("coat_roughness", "coatRoughness", "COAT_ROUGHNESS")), $e.set(this, e(this, ki, void 0)), this._coatRoughnessAnisotropy = (e(this, Ai), new J("coat_roughness_anisotropy", 0, "vCoatRoughnessAnisotropy", 1)), et.set(this, e(this, Mi, void 0)), this._coatRoughnessAnisotropyTexture = (e(this, Ni), new Y("coat_roughness_anisotropy", "coatRoughnessAnisotropy", "COAT_ROUGHNESS_ANISOTROPY")), tt.set(this, e(this, Fi, void 0)), this._coatIor = (e(this, Ii), new J("coat_ior", 1.5, "vCoatIor", 1, 0)), nt.set(this, e(this, Ri, void 0)), this._coatDarkening = (e(this, zi), new J("coat_darkening", 1, "vCoatDarkening", 1, 0)), rt.set(this, e(this, Vi, void 0)), this._coatDarkeningTexture = (e(this, Hi), new Y("coat_darkening", "coatDarkening", "COAT_DARKENING")), this.useCoatRoughnessFromWeightTexture = !1, it.set(this, e(this, Wi, void 0)), this._fuzzWeight = (e(this, Gi), new J("fuzz_weight", 0, "vFuzzWeight", 1, 0)), at.set(this, e(this, qi, void 0)), this._fuzzWeightTexture = (e(this, Ji), new Y("fuzz_weight", "fuzzWeight", "FUZZ_WEIGHT")), ot.set(this, e(this, Xi, void 0)), this._fuzzColor = (e(this, Zi), new J("fuzz_color", f.White(), "vFuzzColor", 3, 0)), st.set(this, e(this, $i, void 0)), this._fuzzColorTexture = (e(this, ea), new Y("fuzz_color", "fuzzColor", "FUZZ_COLOR")), ct.set(this, e(this, na, void 0)), this._fuzzRoughness = (e(this, ra), new J("fuzz_roughness", .5, "vFuzzRoughness", 1, 0)), lt.set(this, e(this, aa, void 0)), this._fuzzRoughnessTexture = (e(this, oa), new Y("fuzz_roughness", "fuzzRoughness", "FUZZ_ROUGHNESS")), ut.set(this, e(this, ca, void 0)), this._geometryThinWalled = (e(this, la), new J("geometry_thin_walled", 0, "vGeometryThinWalled", 1, 0)), dt.set(this, e(this, da, void 0)), this._geometryNormalTexture = (e(this, fa), new Y("geometry_normal", "geometryNormal", "GEOMETRY_NORMAL")), ft.set(this, e(this, ma, void 0)), this._geometryTangent = (e(this, ha), new J("geometry_tangent", new u(1, 0), "vSpecularAnisotropy", 3, 0)), pt.set(this, e(this, _a, void 0)), this._geometryTangentTexture = (e(this, va), new Y("geometry_tangent", "geometryTangent", "GEOMETRY_TANGENT")), mt.set(this, e(this, ba, void 0)), this._geometryCoatNormalTexture = (e(this, xa), new Y("geometry_coat_normal", "geometryCoatNormal", "GEOMETRY_COAT_NORMAL")), ht.set(this, e(this, Ca, void 0)), this._geometryCoatTangent = (e(this, wa), new J("geometry_coat_tangent", new u(1, 0), "vGeometryCoatTangent", 2, 0)), gt.set(this, e(this, Ea, void 0)), this._geometryCoatTangentTexture = (e(this, Da), new Y("geometry_coat_tangent", "geometryCoatTangent", "GEOMETRY_COAT_TANGENT")), _t.set(this, e(this, ka, void 0)), this._geometryOpacity = (e(this, Aa), new J("geometry_opacity", 1, "vBaseColor", 4, 3)), vt.set(this, e(this, Ma, void 0)), this._geometryOpacityTexture = (e(this, Na), new Y("geometry_opacity", "geometryOpacity", "GEOMETRY_OPACITY")), yt.set(this, e(this, Fa, void 0)), this._geometryThickness = (e(this, Ia), new J("geometry_thickness", 0, "vGeometryThickness", 1, 0)), bt.set(this, e(this, Ra, void 0)), this._geometryThicknessTexture = (e(this, za), new Y("geometry_thickness", "geometryThickness", "GEOMETRY_THICKNESS")), xt.set(this, e(this, Va, void 0)), this._emissionLuminance = (e(this, Ha), new J("emission_luminance", 1, "vLightingIntensity", 4, 1)), St.set(this, e(this, Wa, void 0)), this._emissionColor = (e(this, Ga), new J("emission_color", f.Black(), "vEmissionColor", 3)), Ct.set(this, e(this, qa, void 0)), this._emissionColorTexture = (e(this, Ja), new Y("emission_color", "emissionColor", "EMISSION_COLOR")), wt.set(this, e(this, Xa, void 0)), this._thinFilmWeight = (e(this, Za), new J("thin_film_weight", 0, "vThinFilmWeight", 1, 0)), Tt.set(this, e(this, $a, void 0)), this._thinFilmWeightTexture = (e(this, eo), new Y("thin_film_weight", "thinFilmWeight", "THIN_FILM_WEIGHT")), Et.set(this, e(this, no, void 0)), this._thinFilmThickness = (e(this, ro), new J("thin_film_thickness", .5, "vThinFilmThickness", 2, 0)), Dt.set(this, e(this, ao, void 0)), this._thinFilmThicknessMin = (e(this, oo), new J("thin_film_thickness_min", 0, "vThinFilmThickness", 2, 1)), Ot.set(this, e(this, co, void 0)), this._thinFilmThicknessTexture = (e(this, lo), new Y("thin_film_thickness", "thinFilmThickness", "THIN_FILM_THICKNESS")), kt.set(this, e(this, fo, void 0)), this._thinFilmIor = (e(this, po), new J("thin_film_ior", 1.4, "vThinFilmIor", 1, 0)), At.set(this, e(this, ho, void 0)), this._ambientOcclusionTexture = (e(this, go), new Y("ambient_occlusion", "ambientOcclusion", "AMBIENT_OCCLUSION")), this._sssQuality = s.SSS_QUALITY_MEDIUM, this._sssIrradianceTexture = null, this._sssDepthTexture = null, this._uniformsList = {}, this._uniformsArray = [], this._samplersList = {}, this._samplerDefines = {}, jt.set(this, e(this, vo, 1)), Mt.set(this, (e(this, yo), e(this, xo, 1))), Nt.set(this, (e(this, So), e(this, wo, !1))), Pt.set(this, (e(this, To), e(this, Do, !1))), Ft.set(this, (e(this, Oo), e(this, Ao, .4))), It.set(this, (e(this, jo), e(this, No, !1))), Lt.set(this, (e(this, Po), e(this, Io, !1))), Rt.set(this, (e(this, Lo), e(this, Vo, !1))), zt.set(this, (e(this, Ho), e(this, Wo, !1))), Bt.set(this, (e(this, Go), e(this, qo, !1))), Vt.set(this, (e(this, Jo), e(this, Xo, .05))), Ht.set(this, (e(this, Zo), e(this, $o, !1))), Ut.set(this, (e(this, es), e(this, ns, !1))), Wt.set(this, (e(this, rs), e(this, as, 4))), Gt.set(this, (e(this, os), e(this, cs, !1))), Kt.set(this, (e(this, ls), e(this, ds, !1))), qt.set(this, (e(this, fs), e(this, ms, !1))), Jt.set(this, (e(this, hs), e(this, _s, !1))), Yt.set(this, (e(this, vs), e(this, bs, !1))), Xt.set(this, (e(this, xs), e(this, Cs, null))), Zt.set(this, (e(this, ws), e(this, Es, !1))), Qt.set(this, (e(this, Ds), e(this, ks, !1))), $t.set(this, (e(this, As), e(this, Ms, !0))), en.set(this, (e(this, Ns), e(this, Fs, !0))), tn.set(this, (e(this, Is), e(this, Rs, !1))), nn.set(this, (e(this, zs), e(this, Vs, !1))), this._lightingInfos = (e(this, Hs), new l(this.directIntensity, 1, this.environmentIntensity, 1)), this._radianceTexture = null, this._useSpecularWeightFromAlpha = !1, this._useSpecularWeightFromSpecularColorTexture = !1, this._useSpecularRoughnessAnisotropyFromTangentTexture = !1, this._useCoatRoughnessAnisotropyFromTangentTexture = !1, this._useCoatRoughnessFromGreenChannel = !1, this._useGltfStyleAnisotropy = !1, this._useFuzzRoughnessFromTextureAlpha = !1, this._useSubsurfaceWeightFromTextureAlpha = !1, this._useHorizonOcclusion = !0, this._useRadianceOcclusion = !0, this._useAlphaFromBaseColorTexture = !1, this._useAmbientOcclusionFromMetallicTextureRed = !1, this._useRoughnessFromMetallicTextureGreen = !1, this._useMetallicFromMetallicTextureBlue = !1, this._useThinFilmThicknessFromTextureGreen = !1, this._useGeometryThicknessFromGreenChannel = !1, this._lightFalloff = T.LIGHTFALLOFF_PHYSICAL, this._useObjectSpaceNormalMap = !1, this._useParallax = !1, this._useParallaxOcclusion = !1, this._parallaxScaleBias = .05, this._disableLighting = !1, this._maxSimultaneousLights = 4, this._invertNormalMapX = !1, this._invertNormalMapY = !1, this._twoSidedLighting = !1, this._alphaCutOff = .4, this._useAlphaFresnel = !1, this._useLinearAlphaFresnel = !1, this._environmentBRDFTexture = null, this._environmentFuzzBRDFTexture = null, this._backgroundRefractionTexture = null, this._refractionHighQualityBlur = !0, this._forceIrradianceInFragment = !1, this._realTimeFiltering = !1, this._realTimeFilteringQuality = 8, this._fuzzSampleNumber = 4, this._forceNormalForward = !1, this._enableSpecularAntiAliasing = !1, this._renderTargets = new ee(16), this._unlit = !1, this._applyDecalMapAfterDetailMap = !1, this._debugMode = 0, this._breakShaderLoadedCheck = !1, this._vertexPullingMetadata = null, rn.set(this, e(this, Ws, 0)), this.debugLimit = (e(this, Gs), -1), this.debugFactor = 1, this._cacheHasRenderTargetTextures = !1, this._transparencyMode = T.MATERIAL_OPAQUE, this.getScene() && !this.getScene()?.getEngine().isWebGPU && this.getScene().getEngine().webGLVersion < 2 && _.Error("OpenPBRMaterial: WebGL 2.0 or above is required for this material."), s._noiseTextures[this.getScene().uniqueId] || (s._noiseTextures[this.getScene().uniqueId] = new je(v.GetAssetUrl("https://assets.babylonjs.com/core/blue_noise/blue_noise_rgb.png"), this.getScene(), !1, !0, 1), this.getScene().onDisposeObservable.addOnce(() => {
				s._noiseTextures[this.getScene().uniqueId]?.dispose(), delete s._noiseTextures[this.getScene().uniqueId];
			})), this._attachImageProcessingConfiguration(null), this.getRenderTargetTextures = () => (this._renderTargets.reset(), C.ReflectionTextureEnabled && this._radianceTexture && this._radianceTexture.isRenderTarget && this._renderTargets.push(this._radianceTexture), C.RefractionTextureEnabled && this._backgroundRefractionTexture && this._backgroundRefractionTexture.isRenderTarget && this._renderTargets.push(this._backgroundRefractionTexture), this._eventInfo.renderTargets = this._renderTargets, this._callbackPluginEventFillRenderTargetTextures(this._eventInfo), this._renderTargets), this._environmentBRDFTexture = Ie(this.getScene()), this._environmentFuzzBRDFTexture = Re(this.getScene()), this.prePassConfiguration = new Be(), this._propertyList = {};
			for (let e of Object.getOwnPropertyNames(this)) {
				let t = this[e];
				t instanceof J && (this._propertyList[e] = t);
			}
			Object.keys(this._propertyList).forEach((e) => {
				let t = this._propertyList[e], n = this._uniformsList[t.targetUniformName];
				n ? n.numComponents === t.targetUniformComponentNum ? n.requiredDefine !== t.requiredDefine && (n.requiredDefine = void 0) : _.Error(`Uniform ${t.targetUniformName} already exists of size ${n.numComponents}, but trying to set it to ${t.targetUniformComponentNum}.`) : (n = new Ve(t.targetUniformName, t.targetUniformComponentNum), n.requiredDefine = t.requiredDefine, this._uniformsList[t.targetUniformName] = n), n.firstLinkedKey === "" && (n.firstLinkedKey = t.name), n.linkedProperties[t.name] = t;
			}), this._uniformsArray = Object.values(this._uniformsList), this._samplersList = {};
			for (let e of Object.getOwnPropertyNames(this)) {
				let t = this[e];
				t instanceof Y && (this._samplersList[e] = t);
			}
			for (let e in this._samplersList) {
				let t = this._samplersList[e].textureDefine;
				this._samplerDefines[t] = {
					type: "boolean",
					default: !1
				}, this._samplerDefines[t + "DIRECTUV"] = {
					type: "number",
					default: 0
				}, this._samplerDefines[t + "_GAMMA"] = {
					type: "boolean",
					default: !1
				};
			}
			this._baseWeight, this._baseWeightTexture, this._baseColor, this._baseColorTexture, this._baseDiffuseRoughness, this._baseDiffuseRoughnessTexture, this._baseMetalness, this._baseMetalnessTexture, this._specularWeight, this._specularWeightTexture, this._specularColor, this._specularColorTexture, this._specularRoughness, this._specularIor, this._specularRoughnessTexture, this._specularRoughnessAnisotropy, this._specularRoughnessAnisotropyTexture, this._transmissionWeight, this._transmissionWeightTexture, this._transmissionColor, this._transmissionColorTexture, this._transmissionDepth, this._transmissionDepthTexture, this._transmissionScatter, this._transmissionScatterTexture, this._transmissionScatterAnisotropy, this._transmissionDispersionScale, this._transmissionDispersionScaleTexture, this._transmissionDispersionAbbeNumber, this._subsurfaceWeight, this._subsurfaceWeightTexture, this._subsurfaceColor, this._subsurfaceColorTexture, this._subsurfaceRadius, this._subsurfaceRadiusScale, this._subsurfaceRadiusScaleTexture, this._subsurfaceScatterAnisotropy, this._coatWeight, this._coatWeightTexture, this._coatColor, this._coatColorTexture, this._coatRoughness, this._coatRoughnessTexture, this._coatRoughnessAnisotropy, this._coatRoughnessAnisotropyTexture, this._coatIor, this._coatDarkening, this._coatDarkeningTexture, this._fuzzWeight, this._fuzzWeightTexture, this._fuzzColor, this._fuzzColorTexture, this._fuzzRoughness, this._fuzzRoughnessTexture, this._geometryThinWalled, this._geometryNormalTexture, this._geometryTangent, this._geometryTangentTexture, this._geometryCoatNormalTexture, this._geometryCoatTangent, this._geometryCoatTangentTexture, this._geometryOpacity, this._geometryOpacityTexture, this._geometryThickness, this._geometryThicknessTexture, this._thinFilmWeight, this._thinFilmWeightTexture, this._thinFilmThickness, this._thinFilmThicknessMin, this._thinFilmThicknessTexture, this._thinFilmIor, this._emissionLuminance, this._emissionColor, this._emissionColorTexture, this._ambientOcclusionTexture;
		}
		get hasRenderTargetTextures() {
			return C.ReflectionTextureEnabled && this._radianceTexture && this._radianceTexture.isRenderTarget || C.RefractionTextureEnabled && this._backgroundRefractionTexture && this._backgroundRefractionTexture.isRenderTarget ? !0 : this._cacheHasRenderTargetTextures;
		}
		get isPrePassCapable() {
			return !this.disableDepthWrite;
		}
		getClassName() {
			return "OpenPBRMaterial";
		}
		get transparencyMode() {
			return this._transparencyMode;
		}
		set transparencyMode(e) {
			this._transparencyMode !== e && (this._transparencyMode = e, this._markAllSubMeshesAsTexturesAndMiscDirty());
		}
		_shouldUseAlphaFromBaseColorTexture() {
			return this._hasAlphaChannel() && this._transparencyMode !== T.MATERIAL_OPAQUE && !this.geometryOpacityTexture;
		}
		_hasAlphaChannel() {
			return this.baseColorTexture != null && this.baseColorTexture.hasAlpha && this._useAlphaFromBaseColorTexture || this.geometryOpacityTexture != null;
		}
		needAlphaBlending() {
			return this.geometryOpacity < 1 || this.geometryOpacityTexture != null;
		}
		needAlphaBlendingForMesh(e) {
			return this.geometryOpacity < 1 || this.geometryOpacityTexture != null || super.needAlphaBlendingForMesh(e);
		}
		clone(e, t = !0, n = "") {
			let r = g.Clone(() => new s(e, this.getScene()), this, { cloneTexturesOnlyOnce: t });
			return r.id = e, r.name = e, this.stencil.copyTo(r.stencil), this._clonePlugins(r, n), r;
		}
		serialize() {
			let e = super.serialize();
			return e.customType = "BABYLON.OpenPBRMaterial", e;
		}
		static Parse(e, t, n) {
			let r = g.Parse(() => new s(e.name, t), e, t, n);
			return e.stencil && r.stencil.parse(e.stencil, t, n), T._ParsePlugins(e, r, t, n), r;
		}
		forceCompilation(e, t, n) {
			let r = {
				clipPlane: !1,
				useInstances: !1,
				...n
			};
			this._uniformBufferLayoutBuilt || this.buildUniformLayout(), this._callbackPluginEventGeneric(4, this._eventInfo), (() => {
				if (this._breakShaderLoadedCheck) return;
				let n = new He({
					...this._eventInfo.defineNames || {},
					...this._samplerDefines || {}
				}), i = this._prepareEffect(e, e, n, void 0, void 0, r.useInstances, r.clipPlane);
				this._onEffectCreatedObservable && (K.effect = i, K.subMesh = null, this._onEffectCreatedObservable.notifyObservers(K)), i.isReady() ? t && t(this) : i.onCompileObservable.add(() => {
					t && t(this);
				});
			})();
		}
		isReadyForSubMesh(e, t, n) {
			this._uniformBufferLayoutBuilt || this.buildUniformLayout();
			let r = t._drawWrapper;
			if (r.effect && this.isFrozen && r._wasPreviouslyReady && r._wasPreviouslyUsingInstances === n) return !0;
			t.materialDefines || (this._callbackPluginEventGeneric(4, this._eventInfo), t.materialDefines = new He({
				...this._eventInfo.defineNames || {},
				...this._samplerDefines || {}
			}));
			let i = t.materialDefines;
			if (this._isReadyForSubMesh(t)) return !0;
			let a = this.getScene(), o = a.getEngine();
			if (i._areTexturesDirty && (this._eventInfo.hasRenderTargetTextures = !1, this._callbackPluginEventHasRenderTargetTextures(this._eventInfo), this._cacheHasRenderTargetTextures = this._eventInfo.hasRenderTargetTextures, a.texturesEnabled)) {
				for (let e in this._samplersList) {
					let t = this._samplersList[e];
					if (t.value && !t.value.isReadyOrNotBlocking()) return !1;
				}
				let e = this._getRadianceTexture();
				if (e && C.ReflectionTextureEnabled) {
					if (!e.isReadyOrNotBlocking()) return !1;
					if (e.irradianceTexture) {
						if (!e.irradianceTexture.isReadyOrNotBlocking()) return !1;
					} else if (!e.sphericalPolynomial && e.getInternalTexture()?._sphericalPolynomialPromise) return !1;
				}
				if (this._environmentBRDFTexture && C.ReflectionTextureEnabled && !this._environmentBRDFTexture.isReady() || this._environmentFuzzBRDFTexture && C.ReflectionTextureEnabled && !this._environmentFuzzBRDFTexture.isReady() || this._backgroundRefractionTexture && C.RefractionTextureEnabled && !this._backgroundRefractionTexture.isReadyOrNotBlocking() || s._noiseTextures[a.uniqueId] && !s._noiseTextures[a.uniqueId].isReady() || this._sssIrradianceTexture && this._sssDepthTexture && (!this._sssIrradianceTexture.isReady() || !this._sssDepthTexture.isReady())) return !1;
			}
			if (this._eventInfo.isReadyForSubMesh = !0, this._eventInfo.defines = i, this._eventInfo.subMesh = t, this._callbackPluginEventIsReadyForSubMesh(this._eventInfo), !this._eventInfo.isReadyForSubMesh || i._areImageProcessingDirty && this._imageProcessingConfiguration && !this._imageProcessingConfiguration.isReady()) return !1;
			if (i.AREALIGHTUSED) {
				for (let t = 0; t < e.lightSources.length; t++) if (!e.lightSources[t]._isReady()) return !1;
			}
			if (!o.getCaps().standardDerivatives && !e.isVerticesDataPresent(x.NormalKind) && (e.createNormals(!0), _.Warn("OpenPBRMaterial: Normals have been created for the mesh: " + e.name)), !Ce(a, e, this._maxSimultaneousLights, this._disableLighting)) return !1;
			let c = t.effect, l = i._areLightsDisposed, u = this._prepareEffect(e, t.getRenderingMesh(), i, this.onCompiled, this.onError, n, null), d = !1;
			if (u) {
				if (this._onEffectCreatedObservable && (K.effect = u, K.subMesh = t, this._onEffectCreatedObservable.notifyObservers(K)), this.allowShaderHotSwapping && c && !u.isReady()) {
					if (i.markAsUnprocessed(), d = this.isFrozen, l) return i._areLightsDisposed = !0, !1;
				} else a.resetCachedMaterial(), t.setEffect(u, i, this._materialContext);
			}
			return !t.effect || !t.effect.isReady() ? !1 : (i._renderId = a.getRenderId(), r._wasPreviouslyReady = !d, r._wasPreviouslyUsingInstances = !!n, this._checkScenePerformancePriority(), !0);
		}
		buildUniformLayout() {
			let e = this._uniformBuffer;
			e.addUniform("vTangentSpaceParams", 2), e.addUniform("vLightingIntensity", 4), e.addUniform("pointSize", 1), e.addUniform("vDebugMode", 2), e.addUniform("renderTargetSize", 2), e.addUniform("cameraInfo", 4), e.addUniform("vTextureRepetitionHexTilingParams", 4), e.addUniform("backgroundRefractionMatrix", 16), e.addUniform("vBackgroundRefractionInfos", 3), se(e, !0, !0, !0, !0, !0), Object.values(this._uniformsList).forEach((t) => {
				e.addUniform(t.name, t.numComponents);
			}), Object.values(this._samplersList).forEach((t) => {
				e.addUniform(t.samplerInfoName, 2), e.addUniform(t.samplerMatrixName, 16);
			}), super.buildUniformLayout();
		}
		bindPropertiesForSubMesh(e, t, n, r) {
			if (this.geometryThickness === 0) e.updateFloat("vGeometryThickness", 0);
			else {
				r.getRenderingMesh().getWorldMatrix().decompose(c.Vector3[0]);
				let t = Math.max(Math.abs(c.Vector3[0].x), Math.abs(c.Vector3[0].y), Math.abs(c.Vector3[0].z));
				e.updateFloat("vGeometryThickness", this.geometryThickness * t);
			}
		}
		bindForSubMesh(e, t, n) {
			let r = this.getScene(), i = n.materialDefines;
			if (!i) return;
			let a = n.effect;
			if (!a) return;
			this._activeEffect = a, t.getMeshUniformBuffer().bindToEffect(a, "Mesh"), t.transferToEffect(e);
			let o = r.getEngine();
			this._uniformBuffer.bindToEffect(a, "Material"), this.prePassConfiguration.bindForSubMesh(this._activeEffect, r, t, e, this.isFrozen), Ne.Bind(o.currentRenderPassId, this._activeEffect, t, e, this);
			let l = r.activeCamera;
			l ? this._uniformBuffer.updateFloat4("cameraInfo", l.minZ, l.maxZ, 0, 0) : this._uniformBuffer.updateFloat4("cameraInfo", 0, 0, 0, 0);
			let u = this.textureRepetitionHexTilingParams;
			this._uniformBuffer.updateFloat4("vTextureRepetitionHexTilingParams", u[0], u[1], u[2], u[3]), this._eventInfo.subMesh = n, this._callbackPluginEventHardBindForSubMesh(this._eventInfo), i.OBJECTSPACE_NORMALMAP && (e.toNormalMatrix(this._normalMatrix), this.bindOnlyNormalMatrix(this._normalMatrix));
			let d = this._mustRebind(r, a, n, t.visibility), p = o._features.needToAlwaysBindUniformBuffers;
			Ee(t, this._activeEffect, this.prePassConfiguration), this._vertexPullingMetadata && Me(this._activeEffect, this._vertexPullingMetadata);
			let m = this._uniformBuffer;
			if (d) {
				this.bindViewProjection(a);
				let e = this._getRadianceTexture();
				if (!m.useUbo || !this.isFrozen || !m.isSync || n._drawWrapper._forceRebindOnNextCall) {
					if (r.texturesEnabled) {
						for (let e in this._samplersList) {
							let t = this._samplersList[e];
							t.value && (m.updateFloat2(t.samplerInfoName, t.value.coordinatesIndex, t.value.level), he(t.value, m, t.samplerPrefix));
						}
						(this.geometryNormalTexture || this.geometryCoatNormalTexture) && (r._mirroredCameraPosition ? m.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1 : -1, this._invertNormalMapY ? 1 : -1) : m.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1 : 1, this._invertNormalMapY ? -1 : 1)), fe(r, i, m, f.White(), e, this.realTimeFiltering, !0, !0, !0, !0, !0);
					}
					this.pointsCloud && m.updateFloat("pointSize", this.pointSize);
					let t = this._uniformsArray;
					for (let e = 0, n = t.length; e < n; e++) {
						let n = t[e];
						(n.requiredDefine === void 0 || i[n.requiredDefine]) && (n.numComponents === 4 ? (n.populateVectorFromLinkedProperties(c.Vector4[0]), m.updateVector4(n.name, c.Vector4[0])) : n.numComponents === 3 ? (n.populateVectorFromLinkedProperties(c.Vector3[0]), m.updateVector3(n.name, c.Vector3[0])) : n.numComponents === 2 ? (n.populateVectorFromLinkedProperties(c.Vector2[0]), m.updateFloat2(n.name, c.Vector2[0].x, c.Vector2[0].y)) : n.numComponents === 1 && m.updateFloat(n.name, n.linkedProperties[n.firstLinkedKey].value));
					}
					this._lightingInfos.x = this.directIntensity, this._lightingInfos.y = this.emissionLuminance, this._lightingInfos.z = this.environmentIntensity * r.environmentIntensity, this._lightingInfos.w = 1, m.updateVector4("vLightingIntensity", this._lightingInfos), m.updateFloat2("vDebugMode", this.debugLimit, this.debugFactor);
				}
				if (r.texturesEnabled) {
					for (let e in this._samplersList) {
						let t = this._samplersList[e];
						t.value && m.setTexture(t.samplerName, t.value);
					}
					if (we(r, i, m, e, this.realTimeFiltering), i.ENVIRONMENTBRDF && m.setTexture("environmentBrdfSampler", this._environmentBRDFTexture), i.FUZZENVIRONMENTBRDF && m.setTexture("environmentFuzzBrdfSampler", this._environmentFuzzBRDFTexture), i.REFRACTED_BACKGROUND && (m.setTexture("backgroundRefractionSampler", this._backgroundRefractionTexture), m.updateMatrix("backgroundRefractionMatrix", this._backgroundRefractionTexture.getReflectionTextureMatrix()), c.Vector3[1].set(Math.log2(this._backgroundRefractionTexture.getSize().width), 0, 0), m.updateVector3("vBackgroundRefractionInfos", c.Vector3[1])), (i.ANISOTROPIC || i.FUZZ || i.REFRACTED_BACKGROUND || i.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && m.setTexture("blueNoiseSampler", s._noiseTextures[this.getScene().uniqueId]), i.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING && this.sssIrradianceTexture && this.sssDepthTexture) {
						let e = this.sssIrradianceTexture.getSize().width, t = this.sssIrradianceTexture.getSize().height;
						m.setTexture("sceneIrradianceSampler", this.sssIrradianceTexture), m.setTexture("sceneDepthSampler", this.sssDepthTexture), m.updateFloat2("renderTargetSize", e, t);
					}
				}
				this.getScene().useOrderIndependentTransparency && this.needAlphaBlendingForMesh(t) && this.getScene().depthPeelingRenderer.bind(a), this._eventInfo.subMesh = n, this._callbackPluginEventBindForSubMesh(this._eventInfo), ce(this._activeEffect, this, r), this.bindEyePosition(a);
			} else p && (this._needToBindSceneUbo = !0);
			this.bindPropertiesForSubMesh(this._uniformBuffer, r, r.getEngine(), n), (d || !this.isFrozen || p) && r.lightsEnabled && !this._disableLighting && De(r, t, this._activeEffect, i, this._maxSimultaneousLights), (d || !this.isFrozen) && (this.bindView(a), ye(r, t, this._activeEffect, !0), i.NUM_MORPH_INFLUENCERS && xe(t, this._activeEffect), i.BAKED_VERTEX_ANIMATION_TEXTURE && t.bakedVertexAnimationManager?.bind(a, i.INSTANCES), this._imageProcessingConfiguration.bind(this._activeEffect), me(i, this._activeEffect, r)), this._afterBind(t, this._activeEffect, n), m.update();
		}
		getAnimatables() {
			let e = super.getAnimatables();
			for (let t in this._samplersList) {
				let n = this._samplersList[t];
				n.value && n.value.animations && n.value.animations.length > 0 && e.push(n.value);
			}
			return this._radianceTexture && this._radianceTexture.animations && this._radianceTexture.animations.length > 0 && e.push(this._radianceTexture), e;
		}
		getActiveTextures() {
			let e = super.getActiveTextures();
			for (let t in this._samplersList) {
				let n = this._samplersList[t];
				n.value && e.push(n.value);
			}
			return this._radianceTexture && e.push(this._radianceTexture), e;
		}
		hasTexture(e) {
			if (super.hasTexture(e)) return !0;
			for (let t in this._samplersList) if (this._samplersList[t].value === e) return !0;
			return this._radianceTexture === e;
		}
		setPrePassRenderer() {
			return !1;
		}
		dispose(e, t) {
			if (this._breakShaderLoadedCheck = !0, t) {
				this._environmentBRDFTexture && this.getScene().openPBREnvironmentBRDFTexture !== this._environmentBRDFTexture && this._environmentBRDFTexture.dispose(), this._environmentFuzzBRDFTexture && this.getScene().environmentFuzzBRDFTexture !== this._environmentFuzzBRDFTexture && this._environmentFuzzBRDFTexture.dispose(), this._backgroundRefractionTexture = null;
				for (let e in this._samplersList) this._samplersList[e].value?.dispose();
				this._radianceTexture?.dispose();
			}
			this._renderTargets.dispose(), this._imageProcessingConfiguration && this._imageProcessingObserver && this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver), super.dispose(e, t);
		}
		_getRadianceTexture() {
			return this._radianceTexture ? this._radianceTexture : this.getScene().environmentTexture;
		}
		_prepareEffect(e, t, n, r = null, i = null, a = null, o = null) {
			if (this._prepareDefines(e, t, n, a, o), !n.isDirty) return null;
			n.markAsProcessed();
			let c = this.getScene().getEngine(), l = new Pe(), u = 0;
			n.USESPHERICALINVERTEX && l.addFallback(u++, "USESPHERICALINVERTEX"), n.FOG && l.addFallback(u, "FOG"), n.SPECULARAA && l.addFallback(u, "SPECULARAA"), n.POINTSIZE && l.addFallback(u, "POINTSIZE"), n.LOGARITHMICDEPTH && l.addFallback(u, "LOGARITHMICDEPTH"), n.PARALLAX && l.addFallback(u, "PARALLAX"), n.PARALLAX_RHS && l.addFallback(u, "PARALLAX_RHS"), n.PARALLAXOCCLUSION && l.addFallback(u++, "PARALLAXOCCLUSION"), n.ENVIRONMENTBRDF && l.addFallback(u++, "ENVIRONMENTBRDF"), n.TANGENT && l.addFallback(u++, "TANGENT"), u = ge(n, l, this._maxSimultaneousLights, u), n.SPECULARTERM && l.addFallback(u++, "SPECULARTERM"), n.USESPHERICALFROMREFLECTIONMAP && l.addFallback(u++, "USESPHERICALFROMREFLECTIONMAP"), n.USEIRRADIANCEMAP && l.addFallback(u++, "USEIRRADIANCEMAP"), n.NORMAL && l.addFallback(u++, "NORMAL"), n.VERTEXCOLOR && l.addFallback(u++, "VERTEXCOLOR"), n.MORPHTARGETS && l.addFallback(u++, "MORPHTARGETS"), n.MULTIVIEW && l.addFallback(0, "MULTIVIEW");
			let d = [x.PositionKind];
			n.NORMAL && d.push(x.NormalKind), n.TANGENT && d.push(x.TangentKind);
			for (let e = 1; e <= 6; ++e) n["UV" + e] && d.push(`uv${e === 1 ? "" : e}`);
			n.VERTEXCOLOR && d.push(x.ColorKind), Se(d, e, n, l), ve(d, n), _e(d, e, n), Te(d, e, n);
			let f = "openpbr", p = [
				"world",
				"view",
				"viewProjection",
				"projection",
				"vEyePosition",
				"inverseProjection",
				"renderTargetSize",
				"vLightsType",
				"visibility",
				"vFogInfos",
				"vFogColor",
				"pointSize",
				"mBones",
				"normalMatrix",
				"vLightingIntensity",
				"logarithmicDepthConstant",
				"vTangentSpaceParams",
				"boneTextureInfo",
				"vDebugMode",
				"morphTargetTextureInfo",
				"morphTargetTextureIndices",
				"cameraInfo",
				"vTextureRepetitionHexTilingParams",
				"backgroundRefractionMatrix",
				"vBackgroundRefractionInfos"
			];
			for (let e in this._uniformsList) p.push(e);
			let m = [
				"environmentBrdfSampler",
				"boneSampler",
				"morphTargets",
				"oitDepthSampler",
				"oitFrontColorSampler",
				"areaLightsLTC1Sampler",
				"areaLightsLTC2Sampler"
			];
			n.FUZZENVIRONMENTBRDF && m.push("environmentFuzzBrdfSampler"), n.REFRACTED_BACKGROUND && m.push("backgroundRefractionSampler"), (n.ANISOTROPIC || n.FUZZ || n.REFRACTED_BACKGROUND || n.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && m.push("blueNoiseSampler"), n.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING && (m.push("sceneIrradianceSampler"), m.push("sceneDepthSampler"));
			for (let e in this._samplersList) {
				let t = this._samplersList[e];
				m.push(t.samplerName), p.push(t.samplerInfoName), p.push(t.samplerMatrixName);
			}
			be(p, m, !0);
			let h = [
				"Material",
				"Scene",
				"Mesh"
			], g = {
				maxSimultaneousLights: this._maxSimultaneousLights,
				maxSimultaneousMorphTargets: n.NUM_MORPH_INFLUENCERS
			};
			if (this._eventInfo.fallbacks = l, this._eventInfo.fallbackRank = u, this._eventInfo.defines = n, this._eventInfo.uniforms = p, this._eventInfo.attributes = d, this._eventInfo.samplers = m, this._eventInfo.uniformBuffersNames = h, this._eventInfo.customCode = void 0, this._eventInfo.mesh = e, this._eventInfo.indexParameters = g, this._callbackPluginEventGeneric(128, this._eventInfo), Ne.AddUniformsAndSamplers(p, m), Be.AddUniforms(p), Be.AddSamplers(m), oe(p), this._useVertexPulling) {
				let e = t?.geometry;
				e && (this._vertexPullingMetadata = Le(e), this._vertexPullingMetadata && this._vertexPullingMetadata.forEach((e, t) => {
					p.push(`vp_${t}_info`);
				}));
			} else this._vertexPullingMetadata = null;
			te && (te.PrepareUniforms(p, n), te.PrepareSamplers(m, n)), ne({
				uniformsNames: p,
				uniformBuffersNames: h,
				samplers: m,
				defines: n,
				maxSimultaneousLights: this._maxSimultaneousLights,
				shaderLanguage: this._shaderLanguage
			});
			let _ = {};
			this.customShaderNameResolve && (f = this.customShaderNameResolve(f, p, h, m, n, d, _));
			let v = n.toString(), ee = c.createEffect(f, {
				attributes: d,
				uniformsNames: p,
				uniformBuffersNames: h,
				samplers: m,
				defines: v,
				fallbacks: l,
				onCompiled: r,
				onError: i,
				indexParameters: g,
				processFinalCode: _.processFinalCode,
				processCodeAfterIncludes: this._eventInfo.customCode,
				multiTarget: n.PREPASS,
				shaderLanguage: this._shaderLanguage,
				extraInitializationsAsync: s._ShaderLoader.getLoadCallback(this._shaderLanguage)
			}, c);
			return this._eventInfo.customCode = void 0, ee;
		}
		_prepareDefines(e, t, n, r = null, i = null) {
			let a = t.hasThinInstances, o = this.getScene(), c = o.getEngine();
			le(o, e, n, !0, this._maxSimultaneousLights, this._disableLighting), n._needNormals = !0, ue(o, n);
			let l = this.needAlphaBlendingForMesh(e) && this.getScene().useOrderIndependentTransparency;
			if (ie(o, n, this.canRenderToMRT && !l), ae(o, n, l), Ne.PrepareDefines(c.currentRenderPassId, e, n), n._areTexturesDirty) {
				n._needUVs = !1;
				for (let e = 1; e <= 6; ++e) n["MAINUV" + e] = !1;
				if (o.texturesEnabled) {
					for (let e in this._samplersList) {
						let t = this._samplersList[e];
						t.value ? (re(t.value, n, t.textureDefine), n[t.textureDefine + "_GAMMA"] = t.value.gammaSpace) : n[t.textureDefine] = !1;
					}
					let e = this._getRadianceTexture(), t = this._forceIrradianceInFragment || this.realTimeFiltering || this._twoSidedLighting || c.getCaps().maxVaryingVectors <= 8 || this._baseDiffuseRoughnessTexture != null;
					if (Ae(o, e, n, this.realTimeFiltering, this.realTimeFilteringQuality, !t), this._baseMetalnessTexture && (n.AOSTOREINMETALMAPRED = this._useAmbientOcclusionFromMetallicTextureRed), n.SPECULAR_WEIGHT_IN_ALPHA = this._useSpecularWeightFromAlpha, n.SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE = this._useSpecularWeightFromSpecularColorTexture, n.SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = this._useSpecularRoughnessAnisotropyFromTangentTexture, n.COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = this._useCoatRoughnessAnisotropyFromTangentTexture, n.COAT_ROUGHNESS_FROM_GREEN_CHANNEL = this._useCoatRoughnessFromGreenChannel, n.SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN = this._useRoughnessFromMetallicTextureGreen, n.FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA = this._useFuzzRoughnessFromTextureAlpha, n.SUBSURFACE_WEIGHT_FROM_TEXTURE_ALPHA = this._useSubsurfaceWeightFromTextureAlpha, n.BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE = this._useMetallicFromMetallicTextureBlue, n.THIN_FILM_THICKNESS_FROM_THIN_FILM_TEXTURE = this._useThinFilmThicknessFromTextureGreen, n.GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL = this._useGeometryThicknessFromGreenChannel, this.geometryNormalTexture ? (this._useParallax && this.baseColorTexture && C.DiffuseTextureEnabled ? (n.PARALLAX = !0, n.PARALLAX_RHS = o.useRightHandedSystem, n.PARALLAXOCCLUSION = !!this._useParallaxOcclusion) : n.PARALLAX = !1, n.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap) : (n.PARALLAX = !1, n.PARALLAX_RHS = !1, n.PARALLAXOCCLUSION = !1, n.OBJECTSPACE_NORMALMAP = !1), this._environmentBRDFTexture && C.ReflectionTextureEnabled ? (n.ENVIRONMENTBRDF = !0, n.ENVIRONMENTBRDF_RGBD = this._environmentBRDFTexture.isRGBD) : (n.ENVIRONMENTBRDF = !1, n.ENVIRONMENTBRDF_RGBD = !1), n.FUZZENVIRONMENTBRDF = !!this._environmentFuzzBRDFTexture, this.hasTransparency) {
						n.REFRACTED_BACKGROUND = !!this._backgroundRefractionTexture && C.RefractionTextureEnabled, n.REFRACTION_HIGH_QUALITY_BLUR = this._refractionHighQualityBlur, n.REFRACTED_LIGHTS = !0;
						let e = this._getRadianceTexture();
						e ? (n.REFRACTED_ENVIRONMENT = C.RefractionTextureEnabled, n.REFRACTED_ENVIRONMENT_OPPOSITEZ = this.getScene().useRightHandedSystem ? !e.invertZ : e.invertZ, n.REFRACTED_ENVIRONMENT_LOCAL_CUBE = e.isCube && e.boundingBoxSize) : n.REFRACTED_ENVIRONMENT = !1;
					} else n.REFRACTED_BACKGROUND = !1, n.REFRACTED_LIGHTS = !1, n.REFRACTED_ENVIRONMENT = !1;
					n.ALPHA_FROM_BASE_COLOR_TEXTURE = !!this._shouldUseAlphaFromBaseColorTexture();
				}
				this._lightFalloff === T.LIGHTFALLOFF_STANDARD ? (n.USEPHYSICALLIGHTFALLOFF = !1, n.USEGLTFLIGHTFALLOFF = !1) : this._lightFalloff === T.LIGHTFALLOFF_GLTF ? (n.USEPHYSICALLIGHTFALLOFF = !1, n.USEGLTFLIGHTFALLOFF = !0) : (n.USEPHYSICALLIGHTFALLOFF = !0, n.USEGLTFLIGHTFALLOFF = !1), n.TWOSIDEDLIGHTING = !(this.backFaceCulling || !this._twoSidedLighting), n.MIRRORED = !!o._mirroredCameraPosition, n.SPECULARAA = c.getCaps().standardDerivatives && this._enableSpecularAntiAliasing;
			}
			if ((n._areTexturesDirty || n._areMiscDirty) && (n.ALPHATESTVALUE = `${this._alphaCutOff}${this._alphaCutOff % 1 == 0 ? "." : ""}`, n.PREMULTIPLYALPHA = this.alphaMode === 7 || this.alphaMode === 8, n.ALPHABLEND = this.needAlphaBlendingForMesh(e)), n._areTexturesDirty && (n.TEXTURE_REPETITION_MODE = c.version > 1 || c.isWebGPU ? this.textureRepetitionMode : 0), n._areImageProcessingDirty && this._imageProcessingConfiguration && this._imageProcessingConfiguration.prepareDefines(n), n.FORCENORMALFORWARD = this._forceNormalForward, n.RADIANCEOCCLUSION = this._useRadianceOcclusion, n.HORIZONOCCLUSION = this._useHorizonOcclusion, (this.specularRoughnessAnisotropy > 0 || this.coatRoughnessAnisotropy > 0) && s._noiseTextures[o.uniqueId] && C.ReflectionTextureEnabled ? (n.ANISOTROPIC = !0, e.isVerticesDataPresent(x.TangentKind) || (n._needUVs = !0, n.MAINUV1 = !0), this._useGltfStyleAnisotropy && (n.USE_GLTF_STYLE_ANISOTROPY = !0), n.ANISOTROPIC_BASE = this.specularRoughnessAnisotropy > 0, n.ANISOTROPIC_COAT = this.coatRoughnessAnisotropy > 0) : (n.ANISOTROPIC = !1, n.USE_GLTF_STYLE_ANISOTROPY = !1, n.ANISOTROPIC_BASE = !1, n.ANISOTROPIC_COAT = !1), n.THIN_FILM = this.thinFilmWeight > 0, n.IRIDESCENCE = this.thinFilmWeight > 0, n.DISPERSION = this.transmissionDispersionScale > 0, n.SCATTERING = this.hasScattering, n.SSS_SAMPLE_COUNT = [
				8,
				16,
				32
			][this._sssQuality] ?? 16, n.TRANSMISSION_SLAB = this.transmissionWeight > 0, n.TRANSMISSION_SLAB_VOLUME = this.transmissionWeight > 0 && this.transmissionDepth > 0, n.SUBSURFACE_SLAB = this.subsurfaceWeight > 0, !n.PREPASS && (n.SUBSURFACE_SLAB || n.TRANSMISSION_SLAB_VOLUME)) {
				let e = !1;
				if (!this.sssIrradianceTexture && o.geometryBufferRenderer) {
					let t = o.geometryBufferRenderer.getTextureIndex(G.IRRADIANCE_TEXTURE_TYPE);
					this.sssIrradianceTexture = o.geometryBufferRenderer.getGBuffer().textures[t], e = !0;
				}
				if (!this.sssDepthTexture && o.geometryBufferRenderer) {
					let t = o.geometryBufferRenderer.getTextureIndex(G.SCREENSPACE_DEPTH_TEXTURE_TYPE);
					this.sssDepthTexture = o.geometryBufferRenderer.getGBuffer().textures[t], e = !0;
				}
				this.sssIrradianceTexture && this.sssDepthTexture && (n.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING = !0, e && (n.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER = !0));
			}
			n.FUZZ = this.fuzzWeight > 0 && C.ReflectionTextureEnabled, n.GEOMETRY_THIN_WALLED = this.geometryThinWalled != 0, n.FUZZ ? (e.isVerticesDataPresent(x.TangentKind) || (n._needUVs = !0, n.MAINUV1 = !0), this._environmentFuzzBRDFTexture = Re(this.getScene()), n.FUZZ_IBL_SAMPLES = this.fuzzSampleNumber) : (this._environmentFuzzBRDFTexture = null, n.FUZZENVIRONMENTBRDF = !1, n.FUZZ_IBL_SAMPLES = 0), n._areMiscDirty && (ke(e, o, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this.needAlphaTestingForMesh(e), n, this._applyDecalMapAfterDetailMap, this._useVertexPulling, t, this._isVertexOutputInvariant), n.UNLIT = this._unlit || (this.pointsCloud || this.wireframe) && !e.isVerticesDataPresent(x.NormalKind), n.DEBUGMODE = this._debugMode), pe(o, c, this, n, !!r, i, a), this._eventInfo.defines = n, this._eventInfo.mesh = e, this._callbackPluginEventPrepareDefinesBeforeAttributes(this._eventInfo), Oe(e, n, !0, !0, !0, this._transparencyMode !== T.MATERIAL_OPAQUE), this._callbackPluginEventPrepareDefines(this._eventInfo);
		}
	}, d = /* @__PURE__ */ new WeakMap(), p = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new WeakMap(), h = /* @__PURE__ */ new WeakMap(), y = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), de = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), ze = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakMap(), I = /* @__PURE__ */ new WeakMap(), L = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap(), z = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), Ke = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap(), Ze = /* @__PURE__ */ new WeakMap(), Qe = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ new WeakMap(), st = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ new WeakMap(), lt = /* @__PURE__ */ new WeakMap(), ut = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ new WeakMap(), pt = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), It = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), Vt = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap(), Ut = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap(), Gt = /* @__PURE__ */ new WeakMap(), Kt = /* @__PURE__ */ new WeakMap(), qt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), Yt = /* @__PURE__ */ new WeakMap(), Xt = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakMap(), $t = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new WeakMap(), tn = /* @__PURE__ */ new WeakMap(), nn = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new WeakMap(), (() => {
		let e = typeof Symbol == "function" && Symbol.metadata ? Object.create(an[Symbol.metadata] ?? null) : void 0;
		sn = [i("_markAllSubMeshesAsTexturesDirty")], un = [i("_markAllSubMeshesAsTexturesDirty")], pn = [i("_markAllSubMeshesAsTexturesDirty")], gn = [i("_markAllSubMeshesAsTexturesDirty")], yn = [i("_markAllSubMeshesAsTexturesDirty")], Sn = [i("_markAllSubMeshesAsTexturesDirty")], Tn = [i("_markAllSubMeshesAsTexturesDirty")], On = [i("_markAllSubMeshesAsTexturesDirty")], jn = [i("_markAllSubMeshesAsTexturesDirty")], Pn = [i("_markAllSubMeshesAsTexturesDirty")], Ln = [i("_markAllSubMeshesAsTexturesDirty")], Bn = [i("_markAllSubMeshesAsTexturesDirty")], Un = [i("_markAllSubMeshesAsTexturesDirty")], Kn = [i("_markAllSubMeshesAsTexturesDirty")], Yn = [i("_markAllSubMeshesAsTexturesDirty")], Qn = [i("_markAllSubMeshesAsTexturesDirty")], tr = [i("_markAllSubMeshesAsTexturesDirty")], ir = [i("_markAllSubMeshesAsTexturesDirty")], sr = [i("_markAllSubMeshesAsTexturesDirty")], ur = [i("_markAllSubMeshesAsTexturesDirty")], pr = [i("_markAllSubMeshesAsTexturesDirty")], gr = [i("_markAllSubMeshesAsTexturesDirty")], yr = [i("_markAllSubMeshesAsTexturesDirty")], Sr = [i("_markAllSubMeshesAsTexturesDirty")], Tr = [i("_markAllSubMeshesAsTexturesDirty")], Or = [i("_markAllSubMeshesAsTexturesDirty")], jr = [i("_markAllSubMeshesAsTexturesDirty")], Pr = [i("_markAllSubMeshesAsTexturesDirty")], Lr = [i("_markAllSubMeshesAsTexturesDirty")], Br = [i("_markAllSubMeshesAsTexturesDirty")], Ur = [i("_markAllSubMeshesAsTexturesDirty")], Kr = [i("_markAllSubMeshesAsTexturesDirty")], Yr = [i("_markAllSubMeshesAsTexturesDirty")], Qr = [i("_markAllSubMeshesAsTexturesDirty")], ti = [i("_markAllSubMeshesAsTexturesDirty")], ii = [i("_markAllSubMeshesAsTexturesDirty")], si = [i("_markAllSubMeshesAsTexturesDirty")], ui = [i("_markAllSubMeshesAsTexturesDirty")], pi = [i("_markAllSubMeshesAsTexturesDirty")], gi = [i("_markAllSubMeshesAsTexturesDirty")], yi = [i("_markAllSubMeshesAsTexturesDirty")], Si = [i("_markAllSubMeshesAsTexturesDirty")], Ti = [i("_markAllSubMeshesAsTexturesDirty")], Oi = [i("_markAllSubMeshesAsTexturesDirty")], ji = [i("_markAllSubMeshesAsTexturesDirty")], Pi = [i("_markAllSubMeshesAsTexturesDirty")], Li = [i("_markAllSubMeshesAsTexturesDirty")], Bi = [i("_markAllSubMeshesAsTexturesDirty")], Ui = [i("_markAllSubMeshesAsTexturesDirty")], Ki = [i("_markAllSubMeshesAsTexturesDirty")], Yi = [i("_markAllSubMeshesAsTexturesDirty")], Qi = [i("_markAllSubMeshesAsTexturesDirty")], ta = [i("_markAllSubMeshesAsTexturesDirty")], ia = [i("_markAllSubMeshesAsTexturesDirty")], sa = [i("_markAllSubMeshesAsTexturesDirty")], ua = [i("_markAllSubMeshesAsTexturesDirty")], pa = [i("_markAllSubMeshesAsTexturesDirty")], ga = [i("_markAllSubMeshesAsTexturesDirty")], ya = [i("_markAllSubMeshesAsTexturesDirty")], Sa = [i("_markAllSubMeshesAsTexturesDirty")], Ta = [i("_markAllSubMeshesAsTexturesDirty")], Oa = [i("_markAllSubMeshesAsTexturesDirty")], ja = [i("_markAllSubMeshesAsTexturesDirty")], Pa = [i("_markAllSubMeshesAsTexturesDirty")], La = [i("_markAllSubMeshesAsTexturesDirty")], Ba = [i("_markAllSubMeshesAsTexturesDirty")], Ua = [i("_markAllSubMeshesAsTexturesDirty")], Ka = [i("_markAllSubMeshesAsTexturesDirty")], Ya = [i("_markAllSubMeshesAsTexturesDirty")], Qa = [i("_markAllSubMeshesAsTexturesDirty")], to = [i("_markAllSubMeshesAsTexturesDirty")], io = [i("_markAllSubMeshesAsTexturesDirty")], so = [i("_markAllSubMeshesAsTexturesDirty")], uo = [i("_markAllSubMeshesAsTexturesDirty")], mo = [i("_markAllSubMeshesAsTexturesDirty")], _o = [n(), r("_markAllSubMeshesAsTexturesDirty")], bo = [n(), r("_markAllSubMeshesAsTexturesDirty")], Co = [n(), r("_markAllSubMeshesAsTexturesDirty")], Eo = [n(), r("_markAllSubMeshesAsTexturesAndMiscDirty")], ko = [n(), r("_markAllSubMeshesAsTexturesAndMiscDirty")], Mo = [n(), r("_markAllSubMeshesAsTexturesDirty")], Fo = [n(), r("_markAllSubMeshesAsTexturesDirty")], Ro = [n()], zo = [n()], Bo = [n(), r("_markAllSubMeshesAsTexturesDirty")], Uo = [n(), r("_markAllSubMeshesAsTexturesDirty")], Ko = [n(), r("_markAllSubMeshesAsTexturesDirty")], Yo = [n(), r("_markAllSubMeshesAsTexturesDirty")], Qo = [n(), r("_markAllSubMeshesAsLightsDirty")], ts = [n(), r("_markAllSubMeshesAsTexturesDirty")], is = [n(), r("_markAllSubMeshesAsLightsDirty")], ss = [n(), r("_markAllSubMeshesAsTexturesDirty")], us = [n(), r("_markAllSubMeshesAsTexturesDirty")], ps = [n(), r("_markAllSubMeshesAsTexturesDirty")], gs = [n(), r("_markAllSubMeshesAsTexturesDirty")], ys = [n(), r("_markAllSubMeshesAsTexturesDirty")], Ss = [r("_markAllSubMeshesAsTexturesDirty")], Ts = [n(), r("_markAllSubMeshesAsTexturesDirty")], Os = [n(), r("_markAllSubMeshesAsTexturesDirty")], js = [n(), r("_markAllSubMeshesAsTexturesDirty")], Ps = [n(), r("_markAllSubMeshesAsTexturesDirty")], Ls = [n(), r("_markAllSubMeshesAsMiscDirty")], Bs = [n(), r("_markAllSubMeshesAsMiscDirty")], Us = [r("_markAllSubMeshesAsMiscDirty")], Ks = [n()], a(s, null, sn, {
			kind: "accessor",
			name: "baseWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseWeight" in e,
				get: (e) => e.baseWeight,
				set: (e, t) => {
					e.baseWeight = t;
				}
			},
			metadata: e
		}, cn, ln), a(s, null, un, {
			kind: "accessor",
			name: "baseWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseWeightTexture" in e,
				get: (e) => e.baseWeightTexture,
				set: (e, t) => {
					e.baseWeightTexture = t;
				}
			},
			metadata: e
		}, dn, fn), a(s, null, pn, {
			kind: "accessor",
			name: "baseColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseColor" in e,
				get: (e) => e.baseColor,
				set: (e, t) => {
					e.baseColor = t;
				}
			},
			metadata: e
		}, mn, hn), a(s, null, gn, {
			kind: "accessor",
			name: "baseColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseColorTexture" in e,
				get: (e) => e.baseColorTexture,
				set: (e, t) => {
					e.baseColorTexture = t;
				}
			},
			metadata: e
		}, _n, vn), a(s, null, yn, {
			kind: "accessor",
			name: "baseDiffuseRoughness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseDiffuseRoughness" in e,
				get: (e) => e.baseDiffuseRoughness,
				set: (e, t) => {
					e.baseDiffuseRoughness = t;
				}
			},
			metadata: e
		}, bn, xn), a(s, null, Sn, {
			kind: "accessor",
			name: "baseDiffuseRoughnessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseDiffuseRoughnessTexture" in e,
				get: (e) => e.baseDiffuseRoughnessTexture,
				set: (e, t) => {
					e.baseDiffuseRoughnessTexture = t;
				}
			},
			metadata: e
		}, Cn, wn), a(s, null, Tn, {
			kind: "accessor",
			name: "baseMetalness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseMetalness" in e,
				get: (e) => e.baseMetalness,
				set: (e, t) => {
					e.baseMetalness = t;
				}
			},
			metadata: e
		}, En, Dn), a(s, null, On, {
			kind: "accessor",
			name: "baseMetalnessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "baseMetalnessTexture" in e,
				get: (e) => e.baseMetalnessTexture,
				set: (e, t) => {
					e.baseMetalnessTexture = t;
				}
			},
			metadata: e
		}, kn, An), a(s, null, jn, {
			kind: "accessor",
			name: "specularWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularWeight" in e,
				get: (e) => e.specularWeight,
				set: (e, t) => {
					e.specularWeight = t;
				}
			},
			metadata: e
		}, Mn, Nn), a(s, null, Pn, {
			kind: "accessor",
			name: "specularWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularWeightTexture" in e,
				get: (e) => e.specularWeightTexture,
				set: (e, t) => {
					e.specularWeightTexture = t;
				}
			},
			metadata: e
		}, Fn, In), a(s, null, Ln, {
			kind: "accessor",
			name: "specularColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularColor" in e,
				get: (e) => e.specularColor,
				set: (e, t) => {
					e.specularColor = t;
				}
			},
			metadata: e
		}, Rn, zn), a(s, null, Bn, {
			kind: "accessor",
			name: "specularColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularColorTexture" in e,
				get: (e) => e.specularColorTexture,
				set: (e, t) => {
					e.specularColorTexture = t;
				}
			},
			metadata: e
		}, Vn, Hn), a(s, null, Un, {
			kind: "accessor",
			name: "specularRoughness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularRoughness" in e,
				get: (e) => e.specularRoughness,
				set: (e, t) => {
					e.specularRoughness = t;
				}
			},
			metadata: e
		}, Wn, Gn), a(s, null, Kn, {
			kind: "accessor",
			name: "specularRoughnessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularRoughnessTexture" in e,
				get: (e) => e.specularRoughnessTexture,
				set: (e, t) => {
					e.specularRoughnessTexture = t;
				}
			},
			metadata: e
		}, qn, Jn), a(s, null, Yn, {
			kind: "accessor",
			name: "specularRoughnessAnisotropy",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularRoughnessAnisotropy" in e,
				get: (e) => e.specularRoughnessAnisotropy,
				set: (e, t) => {
					e.specularRoughnessAnisotropy = t;
				}
			},
			metadata: e
		}, Xn, Zn), a(s, null, Qn, {
			kind: "accessor",
			name: "specularRoughnessAnisotropyTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularRoughnessAnisotropyTexture" in e,
				get: (e) => e.specularRoughnessAnisotropyTexture,
				set: (e, t) => {
					e.specularRoughnessAnisotropyTexture = t;
				}
			},
			metadata: e
		}, $n, er), a(s, null, tr, {
			kind: "accessor",
			name: "specularIor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "specularIor" in e,
				get: (e) => e.specularIor,
				set: (e, t) => {
					e.specularIor = t;
				}
			},
			metadata: e
		}, nr, rr), a(s, null, ir, {
			kind: "accessor",
			name: "transmissionWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionWeight" in e,
				get: (e) => e.transmissionWeight,
				set: (e, t) => {
					e.transmissionWeight = t;
				}
			},
			metadata: e
		}, ar, or), a(s, null, sr, {
			kind: "accessor",
			name: "transmissionWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionWeightTexture" in e,
				get: (e) => e.transmissionWeightTexture,
				set: (e, t) => {
					e.transmissionWeightTexture = t;
				}
			},
			metadata: e
		}, cr, lr), a(s, null, ur, {
			kind: "accessor",
			name: "transmissionColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionColor" in e,
				get: (e) => e.transmissionColor,
				set: (e, t) => {
					e.transmissionColor = t;
				}
			},
			metadata: e
		}, dr, fr), a(s, null, pr, {
			kind: "accessor",
			name: "transmissionColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionColorTexture" in e,
				get: (e) => e.transmissionColorTexture,
				set: (e, t) => {
					e.transmissionColorTexture = t;
				}
			},
			metadata: e
		}, mr, hr), a(s, null, gr, {
			kind: "accessor",
			name: "transmissionDepth",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionDepth" in e,
				get: (e) => e.transmissionDepth,
				set: (e, t) => {
					e.transmissionDepth = t;
				}
			},
			metadata: e
		}, _r, vr), a(s, null, yr, {
			kind: "accessor",
			name: "transmissionDepthTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionDepthTexture" in e,
				get: (e) => e.transmissionDepthTexture,
				set: (e, t) => {
					e.transmissionDepthTexture = t;
				}
			},
			metadata: e
		}, br, xr), a(s, null, Sr, {
			kind: "accessor",
			name: "transmissionScatter",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionScatter" in e,
				get: (e) => e.transmissionScatter,
				set: (e, t) => {
					e.transmissionScatter = t;
				}
			},
			metadata: e
		}, Cr, wr), a(s, null, Tr, {
			kind: "accessor",
			name: "transmissionScatterTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionScatterTexture" in e,
				get: (e) => e.transmissionScatterTexture,
				set: (e, t) => {
					e.transmissionScatterTexture = t;
				}
			},
			metadata: e
		}, Er, Dr), a(s, null, Or, {
			kind: "accessor",
			name: "transmissionScatterAnisotropy",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionScatterAnisotropy" in e,
				get: (e) => e.transmissionScatterAnisotropy,
				set: (e, t) => {
					e.transmissionScatterAnisotropy = t;
				}
			},
			metadata: e
		}, kr, Ar), a(s, null, jr, {
			kind: "accessor",
			name: "transmissionDispersionScale",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionDispersionScale" in e,
				get: (e) => e.transmissionDispersionScale,
				set: (e, t) => {
					e.transmissionDispersionScale = t;
				}
			},
			metadata: e
		}, Mr, Nr), a(s, null, Pr, {
			kind: "accessor",
			name: "transmissionDispersionScaleTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionDispersionScaleTexture" in e,
				get: (e) => e.transmissionDispersionScaleTexture,
				set: (e, t) => {
					e.transmissionDispersionScaleTexture = t;
				}
			},
			metadata: e
		}, Fr, Ir), a(s, null, Lr, {
			kind: "accessor",
			name: "transmissionDispersionAbbeNumber",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transmissionDispersionAbbeNumber" in e,
				get: (e) => e.transmissionDispersionAbbeNumber,
				set: (e, t) => {
					e.transmissionDispersionAbbeNumber = t;
				}
			},
			metadata: e
		}, Rr, zr), a(s, null, Br, {
			kind: "accessor",
			name: "subsurfaceWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceWeight" in e,
				get: (e) => e.subsurfaceWeight,
				set: (e, t) => {
					e.subsurfaceWeight = t;
				}
			},
			metadata: e
		}, Vr, Hr), a(s, null, Ur, {
			kind: "accessor",
			name: "subsurfaceWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceWeightTexture" in e,
				get: (e) => e.subsurfaceWeightTexture,
				set: (e, t) => {
					e.subsurfaceWeightTexture = t;
				}
			},
			metadata: e
		}, Wr, Gr), a(s, null, Kr, {
			kind: "accessor",
			name: "subsurfaceColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceColor" in e,
				get: (e) => e.subsurfaceColor,
				set: (e, t) => {
					e.subsurfaceColor = t;
				}
			},
			metadata: e
		}, qr, Jr), a(s, null, Yr, {
			kind: "accessor",
			name: "subsurfaceColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceColorTexture" in e,
				get: (e) => e.subsurfaceColorTexture,
				set: (e, t) => {
					e.subsurfaceColorTexture = t;
				}
			},
			metadata: e
		}, Xr, Zr), a(s, null, Qr, {
			kind: "accessor",
			name: "subsurfaceRadius",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceRadius" in e,
				get: (e) => e.subsurfaceRadius,
				set: (e, t) => {
					e.subsurfaceRadius = t;
				}
			},
			metadata: e
		}, $r, ei), a(s, null, ti, {
			kind: "accessor",
			name: "subsurfaceRadiusScale",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceRadiusScale" in e,
				get: (e) => e.subsurfaceRadiusScale,
				set: (e, t) => {
					e.subsurfaceRadiusScale = t;
				}
			},
			metadata: e
		}, ni, ri), a(s, null, ii, {
			kind: "accessor",
			name: "subsurfaceRadiusScaleTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceRadiusScaleTexture" in e,
				get: (e) => e.subsurfaceRadiusScaleTexture,
				set: (e, t) => {
					e.subsurfaceRadiusScaleTexture = t;
				}
			},
			metadata: e
		}, ai, oi), a(s, null, si, {
			kind: "accessor",
			name: "subsurfaceScatterAnisotropy",
			static: !1,
			private: !1,
			access: {
				has: (e) => "subsurfaceScatterAnisotropy" in e,
				get: (e) => e.subsurfaceScatterAnisotropy,
				set: (e, t) => {
					e.subsurfaceScatterAnisotropy = t;
				}
			},
			metadata: e
		}, ci, li), a(s, null, ui, {
			kind: "accessor",
			name: "coatWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatWeight" in e,
				get: (e) => e.coatWeight,
				set: (e, t) => {
					e.coatWeight = t;
				}
			},
			metadata: e
		}, di, fi), a(s, null, pi, {
			kind: "accessor",
			name: "coatWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatWeightTexture" in e,
				get: (e) => e.coatWeightTexture,
				set: (e, t) => {
					e.coatWeightTexture = t;
				}
			},
			metadata: e
		}, mi, hi), a(s, null, gi, {
			kind: "accessor",
			name: "coatColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatColor" in e,
				get: (e) => e.coatColor,
				set: (e, t) => {
					e.coatColor = t;
				}
			},
			metadata: e
		}, _i, vi), a(s, null, yi, {
			kind: "accessor",
			name: "coatColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatColorTexture" in e,
				get: (e) => e.coatColorTexture,
				set: (e, t) => {
					e.coatColorTexture = t;
				}
			},
			metadata: e
		}, bi, xi), a(s, null, Si, {
			kind: "accessor",
			name: "coatRoughness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatRoughness" in e,
				get: (e) => e.coatRoughness,
				set: (e, t) => {
					e.coatRoughness = t;
				}
			},
			metadata: e
		}, Ci, wi), a(s, null, Ti, {
			kind: "accessor",
			name: "coatRoughnessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatRoughnessTexture" in e,
				get: (e) => e.coatRoughnessTexture,
				set: (e, t) => {
					e.coatRoughnessTexture = t;
				}
			},
			metadata: e
		}, Ei, Di), a(s, null, Oi, {
			kind: "accessor",
			name: "coatRoughnessAnisotropy",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatRoughnessAnisotropy" in e,
				get: (e) => e.coatRoughnessAnisotropy,
				set: (e, t) => {
					e.coatRoughnessAnisotropy = t;
				}
			},
			metadata: e
		}, ki, Ai), a(s, null, ji, {
			kind: "accessor",
			name: "coatRoughnessAnisotropyTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatRoughnessAnisotropyTexture" in e,
				get: (e) => e.coatRoughnessAnisotropyTexture,
				set: (e, t) => {
					e.coatRoughnessAnisotropyTexture = t;
				}
			},
			metadata: e
		}, Mi, Ni), a(s, null, Pi, {
			kind: "accessor",
			name: "coatIor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatIor" in e,
				get: (e) => e.coatIor,
				set: (e, t) => {
					e.coatIor = t;
				}
			},
			metadata: e
		}, Fi, Ii), a(s, null, Li, {
			kind: "accessor",
			name: "coatDarkening",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatDarkening" in e,
				get: (e) => e.coatDarkening,
				set: (e, t) => {
					e.coatDarkening = t;
				}
			},
			metadata: e
		}, Ri, zi), a(s, null, Bi, {
			kind: "accessor",
			name: "coatDarkeningTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "coatDarkeningTexture" in e,
				get: (e) => e.coatDarkeningTexture,
				set: (e, t) => {
					e.coatDarkeningTexture = t;
				}
			},
			metadata: e
		}, Vi, Hi), a(s, null, Ui, {
			kind: "accessor",
			name: "fuzzWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "fuzzWeight" in e,
				get: (e) => e.fuzzWeight,
				set: (e, t) => {
					e.fuzzWeight = t;
				}
			},
			metadata: e
		}, Wi, Gi), a(s, null, Ki, {
			kind: "accessor",
			name: "fuzzWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "fuzzWeightTexture" in e,
				get: (e) => e.fuzzWeightTexture,
				set: (e, t) => {
					e.fuzzWeightTexture = t;
				}
			},
			metadata: e
		}, qi, Ji), a(s, null, Yi, {
			kind: "accessor",
			name: "fuzzColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "fuzzColor" in e,
				get: (e) => e.fuzzColor,
				set: (e, t) => {
					e.fuzzColor = t;
				}
			},
			metadata: e
		}, Xi, Zi), a(s, null, Qi, {
			kind: "accessor",
			name: "fuzzColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "fuzzColorTexture" in e,
				get: (e) => e.fuzzColorTexture,
				set: (e, t) => {
					e.fuzzColorTexture = t;
				}
			},
			metadata: e
		}, $i, ea), a(s, null, ta, {
			kind: "accessor",
			name: "fuzzRoughness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "fuzzRoughness" in e,
				get: (e) => e.fuzzRoughness,
				set: (e, t) => {
					e.fuzzRoughness = t;
				}
			},
			metadata: e
		}, na, ra), a(s, null, ia, {
			kind: "accessor",
			name: "fuzzRoughnessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "fuzzRoughnessTexture" in e,
				get: (e) => e.fuzzRoughnessTexture,
				set: (e, t) => {
					e.fuzzRoughnessTexture = t;
				}
			},
			metadata: e
		}, aa, oa), a(s, null, sa, {
			kind: "accessor",
			name: "geometryThinWalled",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryThinWalled" in e,
				get: (e) => e.geometryThinWalled,
				set: (e, t) => {
					e.geometryThinWalled = t;
				}
			},
			metadata: e
		}, ca, la), a(s, null, ua, {
			kind: "accessor",
			name: "geometryNormalTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryNormalTexture" in e,
				get: (e) => e.geometryNormalTexture,
				set: (e, t) => {
					e.geometryNormalTexture = t;
				}
			},
			metadata: e
		}, da, fa), a(s, null, pa, {
			kind: "accessor",
			name: "geometryTangent",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryTangent" in e,
				get: (e) => e.geometryTangent,
				set: (e, t) => {
					e.geometryTangent = t;
				}
			},
			metadata: e
		}, ma, ha), a(s, null, ga, {
			kind: "accessor",
			name: "geometryTangentTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryTangentTexture" in e,
				get: (e) => e.geometryTangentTexture,
				set: (e, t) => {
					e.geometryTangentTexture = t;
				}
			},
			metadata: e
		}, _a, va), a(s, null, ya, {
			kind: "accessor",
			name: "geometryCoatNormalTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryCoatNormalTexture" in e,
				get: (e) => e.geometryCoatNormalTexture,
				set: (e, t) => {
					e.geometryCoatNormalTexture = t;
				}
			},
			metadata: e
		}, ba, xa), a(s, null, Sa, {
			kind: "accessor",
			name: "geometryCoatTangent",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryCoatTangent" in e,
				get: (e) => e.geometryCoatTangent,
				set: (e, t) => {
					e.geometryCoatTangent = t;
				}
			},
			metadata: e
		}, Ca, wa), a(s, null, Ta, {
			kind: "accessor",
			name: "geometryCoatTangentTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryCoatTangentTexture" in e,
				get: (e) => e.geometryCoatTangentTexture,
				set: (e, t) => {
					e.geometryCoatTangentTexture = t;
				}
			},
			metadata: e
		}, Ea, Da), a(s, null, Oa, {
			kind: "accessor",
			name: "geometryOpacity",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryOpacity" in e,
				get: (e) => e.geometryOpacity,
				set: (e, t) => {
					e.geometryOpacity = t;
				}
			},
			metadata: e
		}, ka, Aa), a(s, null, ja, {
			kind: "accessor",
			name: "geometryOpacityTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryOpacityTexture" in e,
				get: (e) => e.geometryOpacityTexture,
				set: (e, t) => {
					e.geometryOpacityTexture = t;
				}
			},
			metadata: e
		}, Ma, Na), a(s, null, Pa, {
			kind: "accessor",
			name: "geometryThickness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryThickness" in e,
				get: (e) => e.geometryThickness,
				set: (e, t) => {
					e.geometryThickness = t;
				}
			},
			metadata: e
		}, Fa, Ia), a(s, null, La, {
			kind: "accessor",
			name: "geometryThicknessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "geometryThicknessTexture" in e,
				get: (e) => e.geometryThicknessTexture,
				set: (e, t) => {
					e.geometryThicknessTexture = t;
				}
			},
			metadata: e
		}, Ra, za), a(s, null, Ba, {
			kind: "accessor",
			name: "emissionLuminance",
			static: !1,
			private: !1,
			access: {
				has: (e) => "emissionLuminance" in e,
				get: (e) => e.emissionLuminance,
				set: (e, t) => {
					e.emissionLuminance = t;
				}
			},
			metadata: e
		}, Va, Ha), a(s, null, Ua, {
			kind: "accessor",
			name: "emissionColor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "emissionColor" in e,
				get: (e) => e.emissionColor,
				set: (e, t) => {
					e.emissionColor = t;
				}
			},
			metadata: e
		}, Wa, Ga), a(s, null, Ka, {
			kind: "accessor",
			name: "emissionColorTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "emissionColorTexture" in e,
				get: (e) => e.emissionColorTexture,
				set: (e, t) => {
					e.emissionColorTexture = t;
				}
			},
			metadata: e
		}, qa, Ja), a(s, null, Ya, {
			kind: "accessor",
			name: "thinFilmWeight",
			static: !1,
			private: !1,
			access: {
				has: (e) => "thinFilmWeight" in e,
				get: (e) => e.thinFilmWeight,
				set: (e, t) => {
					e.thinFilmWeight = t;
				}
			},
			metadata: e
		}, Xa, Za), a(s, null, Qa, {
			kind: "accessor",
			name: "thinFilmWeightTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "thinFilmWeightTexture" in e,
				get: (e) => e.thinFilmWeightTexture,
				set: (e, t) => {
					e.thinFilmWeightTexture = t;
				}
			},
			metadata: e
		}, $a, eo), a(s, null, to, {
			kind: "accessor",
			name: "thinFilmThickness",
			static: !1,
			private: !1,
			access: {
				has: (e) => "thinFilmThickness" in e,
				get: (e) => e.thinFilmThickness,
				set: (e, t) => {
					e.thinFilmThickness = t;
				}
			},
			metadata: e
		}, no, ro), a(s, null, io, {
			kind: "accessor",
			name: "thinFilmThicknessMin",
			static: !1,
			private: !1,
			access: {
				has: (e) => "thinFilmThicknessMin" in e,
				get: (e) => e.thinFilmThicknessMin,
				set: (e, t) => {
					e.thinFilmThicknessMin = t;
				}
			},
			metadata: e
		}, ao, oo), a(s, null, so, {
			kind: "accessor",
			name: "thinFilmThicknessTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "thinFilmThicknessTexture" in e,
				get: (e) => e.thinFilmThicknessTexture,
				set: (e, t) => {
					e.thinFilmThicknessTexture = t;
				}
			},
			metadata: e
		}, co, lo), a(s, null, uo, {
			kind: "accessor",
			name: "thinFilmIor",
			static: !1,
			private: !1,
			access: {
				has: (e) => "thinFilmIor" in e,
				get: (e) => e.thinFilmIor,
				set: (e, t) => {
					e.thinFilmIor = t;
				}
			},
			metadata: e
		}, fo, po), a(s, null, mo, {
			kind: "accessor",
			name: "ambientOcclusionTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "ambientOcclusionTexture" in e,
				get: (e) => e.ambientOcclusionTexture,
				set: (e, t) => {
					e.ambientOcclusionTexture = t;
				}
			},
			metadata: e
		}, ho, go), a(s, null, _o, {
			kind: "accessor",
			name: "directIntensity",
			static: !1,
			private: !1,
			access: {
				has: (e) => "directIntensity" in e,
				get: (e) => e.directIntensity,
				set: (e, t) => {
					e.directIntensity = t;
				}
			},
			metadata: e
		}, vo, yo), a(s, null, bo, {
			kind: "accessor",
			name: "environmentIntensity",
			static: !1,
			private: !1,
			access: {
				has: (e) => "environmentIntensity" in e,
				get: (e) => e.environmentIntensity,
				set: (e, t) => {
					e.environmentIntensity = t;
				}
			},
			metadata: e
		}, xo, So), a(s, null, Co, {
			kind: "accessor",
			name: "useSpecularWeightFromTextureAlpha",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useSpecularWeightFromTextureAlpha" in e,
				get: (e) => e.useSpecularWeightFromTextureAlpha,
				set: (e, t) => {
					e.useSpecularWeightFromTextureAlpha = t;
				}
			},
			metadata: e
		}, wo, To), a(s, null, Eo, {
			kind: "accessor",
			name: "forceAlphaTest",
			static: !1,
			private: !1,
			access: {
				has: (e) => "forceAlphaTest" in e,
				get: (e) => e.forceAlphaTest,
				set: (e, t) => {
					e.forceAlphaTest = t;
				}
			},
			metadata: e
		}, Do, Oo), a(s, null, ko, {
			kind: "accessor",
			name: "alphaCutOff",
			static: !1,
			private: !1,
			access: {
				has: (e) => "alphaCutOff" in e,
				get: (e) => e.alphaCutOff,
				set: (e, t) => {
					e.alphaCutOff = t;
				}
			},
			metadata: e
		}, Ao, jo), a(s, null, Mo, {
			kind: "accessor",
			name: "useAmbientOcclusionFromMetallicTextureRed",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useAmbientOcclusionFromMetallicTextureRed" in e,
				get: (e) => e.useAmbientOcclusionFromMetallicTextureRed,
				set: (e, t) => {
					e.useAmbientOcclusionFromMetallicTextureRed = t;
				}
			},
			metadata: e
		}, No, Po), a(s, null, Fo, {
			kind: "accessor",
			name: "useAmbientInGrayScale",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useAmbientInGrayScale" in e,
				get: (e) => e.useAmbientInGrayScale,
				set: (e, t) => {
					e.useAmbientInGrayScale = t;
				}
			},
			metadata: e
		}, Io, Lo), a(s, null, Ro, {
			kind: "getter",
			name: "usePhysicalLightFalloff",
			static: !1,
			private: !1,
			access: {
				has: (e) => "usePhysicalLightFalloff" in e,
				get: (e) => e.usePhysicalLightFalloff
			},
			metadata: e
		}, null, on), a(s, null, zo, {
			kind: "getter",
			name: "useGLTFLightFalloff",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useGLTFLightFalloff" in e,
				get: (e) => e.useGLTFLightFalloff
			},
			metadata: e
		}, null, on), a(s, null, Bo, {
			kind: "accessor",
			name: "useObjectSpaceNormalMap",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useObjectSpaceNormalMap" in e,
				get: (e) => e.useObjectSpaceNormalMap,
				set: (e, t) => {
					e.useObjectSpaceNormalMap = t;
				}
			},
			metadata: e
		}, Vo, Ho), a(s, null, Uo, {
			kind: "accessor",
			name: "useParallax",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useParallax" in e,
				get: (e) => e.useParallax,
				set: (e, t) => {
					e.useParallax = t;
				}
			},
			metadata: e
		}, Wo, Go), a(s, null, Ko, {
			kind: "accessor",
			name: "useParallaxOcclusion",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useParallaxOcclusion" in e,
				get: (e) => e.useParallaxOcclusion,
				set: (e, t) => {
					e.useParallaxOcclusion = t;
				}
			},
			metadata: e
		}, qo, Jo), a(s, null, Yo, {
			kind: "accessor",
			name: "parallaxScaleBias",
			static: !1,
			private: !1,
			access: {
				has: (e) => "parallaxScaleBias" in e,
				get: (e) => e.parallaxScaleBias,
				set: (e, t) => {
					e.parallaxScaleBias = t;
				}
			},
			metadata: e
		}, Xo, Zo), a(s, null, Qo, {
			kind: "accessor",
			name: "disableLighting",
			static: !1,
			private: !1,
			access: {
				has: (e) => "disableLighting" in e,
				get: (e) => e.disableLighting,
				set: (e, t) => {
					e.disableLighting = t;
				}
			},
			metadata: e
		}, $o, es), a(s, null, ts, {
			kind: "accessor",
			name: "forceIrradianceInFragment",
			static: !1,
			private: !1,
			access: {
				has: (e) => "forceIrradianceInFragment" in e,
				get: (e) => e.forceIrradianceInFragment,
				set: (e, t) => {
					e.forceIrradianceInFragment = t;
				}
			},
			metadata: e
		}, ns, rs), a(s, null, is, {
			kind: "accessor",
			name: "maxSimultaneousLights",
			static: !1,
			private: !1,
			access: {
				has: (e) => "maxSimultaneousLights" in e,
				get: (e) => e.maxSimultaneousLights,
				set: (e, t) => {
					e.maxSimultaneousLights = t;
				}
			},
			metadata: e
		}, as, os), a(s, null, ss, {
			kind: "accessor",
			name: "invertNormalMapX",
			static: !1,
			private: !1,
			access: {
				has: (e) => "invertNormalMapX" in e,
				get: (e) => e.invertNormalMapX,
				set: (e, t) => {
					e.invertNormalMapX = t;
				}
			},
			metadata: e
		}, cs, ls), a(s, null, us, {
			kind: "accessor",
			name: "invertNormalMapY",
			static: !1,
			private: !1,
			access: {
				has: (e) => "invertNormalMapY" in e,
				get: (e) => e.invertNormalMapY,
				set: (e, t) => {
					e.invertNormalMapY = t;
				}
			},
			metadata: e
		}, ds, fs), a(s, null, ps, {
			kind: "accessor",
			name: "twoSidedLighting",
			static: !1,
			private: !1,
			access: {
				has: (e) => "twoSidedLighting" in e,
				get: (e) => e.twoSidedLighting,
				set: (e, t) => {
					e.twoSidedLighting = t;
				}
			},
			metadata: e
		}, ms, hs), a(s, null, gs, {
			kind: "accessor",
			name: "useAlphaFresnel",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useAlphaFresnel" in e,
				get: (e) => e.useAlphaFresnel,
				set: (e, t) => {
					e.useAlphaFresnel = t;
				}
			},
			metadata: e
		}, _s, vs), a(s, null, ys, {
			kind: "accessor",
			name: "useLinearAlphaFresnel",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useLinearAlphaFresnel" in e,
				get: (e) => e.useLinearAlphaFresnel,
				set: (e, t) => {
					e.useLinearAlphaFresnel = t;
				}
			},
			metadata: e
		}, bs, xs), a(s, null, Ss, {
			kind: "accessor",
			name: "environmentBRDFTexture",
			static: !1,
			private: !1,
			access: {
				has: (e) => "environmentBRDFTexture" in e,
				get: (e) => e.environmentBRDFTexture,
				set: (e, t) => {
					e.environmentBRDFTexture = t;
				}
			},
			metadata: e
		}, Cs, ws), a(s, null, Ts, {
			kind: "accessor",
			name: "forceNormalForward",
			static: !1,
			private: !1,
			access: {
				has: (e) => "forceNormalForward" in e,
				get: (e) => e.forceNormalForward,
				set: (e, t) => {
					e.forceNormalForward = t;
				}
			},
			metadata: e
		}, Es, Ds), a(s, null, Os, {
			kind: "accessor",
			name: "enableSpecularAntiAliasing",
			static: !1,
			private: !1,
			access: {
				has: (e) => "enableSpecularAntiAliasing" in e,
				get: (e) => e.enableSpecularAntiAliasing,
				set: (e, t) => {
					e.enableSpecularAntiAliasing = t;
				}
			},
			metadata: e
		}, ks, As), a(s, null, js, {
			kind: "accessor",
			name: "useHorizonOcclusion",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useHorizonOcclusion" in e,
				get: (e) => e.useHorizonOcclusion,
				set: (e, t) => {
					e.useHorizonOcclusion = t;
				}
			},
			metadata: e
		}, Ms, Ns), a(s, null, Ps, {
			kind: "accessor",
			name: "useRadianceOcclusion",
			static: !1,
			private: !1,
			access: {
				has: (e) => "useRadianceOcclusion" in e,
				get: (e) => e.useRadianceOcclusion,
				set: (e, t) => {
					e.useRadianceOcclusion = t;
				}
			},
			metadata: e
		}, Fs, Is), a(s, null, Ls, {
			kind: "accessor",
			name: "unlit",
			static: !1,
			private: !1,
			access: {
				has: (e) => "unlit" in e,
				get: (e) => e.unlit,
				set: (e, t) => {
					e.unlit = t;
				}
			},
			metadata: e
		}, Rs, zs), a(s, null, Bs, {
			kind: "accessor",
			name: "applyDecalMapAfterDetailMap",
			static: !1,
			private: !1,
			access: {
				has: (e) => "applyDecalMapAfterDetailMap" in e,
				get: (e) => e.applyDecalMapAfterDetailMap,
				set: (e, t) => {
					e.applyDecalMapAfterDetailMap = t;
				}
			},
			metadata: e
		}, Vs, Hs), a(s, null, Us, {
			kind: "accessor",
			name: "debugMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "debugMode" in e,
				get: (e) => e.debugMode,
				set: (e, t) => {
					e.debugMode = t;
				}
			},
			metadata: e
		}, Ws, Gs), a(s, null, Ks, {
			kind: "getter",
			name: "transparencyMode",
			static: !1,
			private: !1,
			access: {
				has: (e) => "transparencyMode" in e,
				get: (e) => e.transparencyMode
			},
			metadata: e
		}, null, on), e && Object.defineProperty(s, Symbol.metadata, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: e
		});
	})(), s.SSS_QUALITY_LOW = 0, s.SSS_QUALITY_MEDIUM = 1, s.SSS_QUALITY_HIGH = 2, s._noiseTextures = {}, s.ForceGLSL = !1, s._ShaderLoader = new Fe(() => [import("./openpbr.vertex-BvM52rqc.js"), import("./openpbr.fragment-DxEL5InE.js")], () => [import("./openpbr.vertex-BJJXc6jc.js"), import("./openpbr.fragment-DH8D4Xvo.js")]), s;
})(), $ = !1;
function We() {
	$ || ($ = !0, b(), m("BABYLON.OpenPBRMaterial", Q));
}
//#endregion
export { Q as OpenPBRMaterial, He as OpenPBRMaterialDefines, We as RegisterOpenpbrMaterial };
