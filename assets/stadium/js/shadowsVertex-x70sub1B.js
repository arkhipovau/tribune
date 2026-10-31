import { t as e } from "./shaderStore-CXjvw9c2.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/lightVxFragmentDeclaration.js
var t = "lightVxFragmentDeclaration", n = "#ifdef LIGHT{X}\nuniform vec4 vLightData{X};uniform vec4 vLightDiffuse{X};\n#ifdef SPECULARTERM\nuniform vec4 vLightSpecular{X};\n#else\nvec4 vLightSpecular{X}=vec4(0.);\n#endif\n#ifdef SHADOW{X}\n#ifdef SHADOWCSM{X}\nuniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};\n#elif defined(SHADOWCUBE{X})\n#else\nvarying vec4 vPositionFromLight{X};varying float vDepthMetric{X};uniform mat4 lightMatrix{X};\n#endif\nuniform vec4 shadowsInfo{X};uniform vec2 depthValues{X};\n#endif\n#ifdef SPOTLIGHT{X}\nuniform vec4 vLightDirection{X};uniform vec4 vLightFalloff{X};\n#elif defined(POINTLIGHT{X})\nuniform vec4 vLightFalloff{X};\n#elif defined(HEMILIGHT{X})\nuniform vec3 vLightGround{X};\n#endif\n#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)\nuniform vec4 vLightWidth{X};uniform vec4 vLightHeight{X};\n#endif\n#endif\n";
e.IncludesShadersStore[t] || (e.IncludesShadersStore[t] = n);
var r = {
	name: t,
	shader: n
}, i = "lightVxUboDeclaration", a = "#ifdef LIGHT{X}\nuniform Light{X}\n{vec4 vLightData;vec4 vLightDiffuse;vec4 vLightSpecular;\n#ifdef SPOTLIGHT{X}\nvec4 vLightDirection;vec4 vLightFalloff;\n#elif defined(POINTLIGHT{X})\nvec4 vLightFalloff;\n#elif defined(HEMILIGHT{X})\nvec3 vLightGround;\n#elif defined(CLUSTLIGHT{X})\nvec2 vSliceData;vec2 vSliceRanges[CLUSTLIGHT_SLICES];\n#endif\n#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)\nvec4 vLightWidth;vec4 vLightHeight;\n#endif\nvec4 shadowsInfo;vec2 depthValues;} light{X};\n#ifdef SHADOW{X}\n#ifdef SHADOWCSM{X}\nuniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};\n#elif defined(SHADOWCUBE{X})\n#else\nvarying vec4 vPositionFromLight{X};varying float vDepthMetric{X};uniform mat4 lightMatrix{X};\n#endif\n#endif\n#endif\n";
e.IncludesShadersStore[i] || (e.IncludesShadersStore[i] = a);
var o = {
	name: i,
	shader: a
}, s = "shadowsVertex", c = "#ifdef SHADOWS\n#if defined(SHADOWCSM{X})\nvPositionFromCamera{X}=view*worldPos;for (int i=0; i<SHADOWCSMNUM_CASCADES{X}; i++) {vPositionFromLight{X}[i]=lightMatrix{X}[i]*worldPos;\n#ifdef USE_REVERSE_DEPTHBUFFER\nvDepthMetric{X}[i]=(-vPositionFromLight{X}[i].z+light{X}.depthValues.x)/light{X}.depthValues.y;\n#else\nvDepthMetric{X}[i]=(vPositionFromLight{X}[i].z+light{X}.depthValues.x)/light{X}.depthValues.y;\n#endif\n}\n#elif defined(SHADOW{X}) && !defined(SHADOWCUBE{X})\nvPositionFromLight{X}=lightMatrix{X}*worldPos;\n#ifdef USE_REVERSE_DEPTHBUFFER\nvDepthMetric{X}=(-vPositionFromLight{X}.z+light{X}.depthValues.x)/light{X}.depthValues.y;\n#else\nvDepthMetric{X}=(vPositionFromLight{X}.z+light{X}.depthValues.x)/light{X}.depthValues.y;\n#endif\n#endif\n#endif\n";
e.IncludesShadersStore[s] || (e.IncludesShadersStore[s] = c);
var l = {
	name: s,
	shader: c
};
//#endregion
export { o as n, r, l as t };
