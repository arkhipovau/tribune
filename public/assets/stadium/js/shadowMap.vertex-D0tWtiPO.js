import { t as e } from "./shaderStore-CXjvw9c2.js";
import { helperFunctions as t } from "./helperFunctions-C_ZzvIUZ.js";
import { t as n } from "./sceneUboDeclaration-B1dWgwNU.js";
import { a as r, i, n as a, r as o, t as s } from "./bakedVertexAnimation-C84_EEyr.js";
import { n as c, t as l } from "./clipPlaneVertex-CoylEQdx.js";
import { t as u } from "./meshUboDeclaration-BwlcOBVb.js";
import { i as d, n as f, r as p, t as m } from "./morphTargetsVertex-BaK3QguC.js";
import { t as h } from "./sceneVertexDeclaration-BNBkocLl.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/meshVertexDeclaration.js
var g = "meshVertexDeclaration", _ = "uniform mat4 world;uniform float visibility;\n";
e.IncludesShadersStore[g] || (e.IncludesShadersStore[g] = _);
var v = {
	name: g,
	shader: _
}, y = "shadowMapVertexDeclaration", b = "#include<sceneVertexDeclaration>\n#include<meshVertexDeclaration>\n";
e.IncludesShadersStore[y] || (e.IncludesShadersStore[y] = b);
var x = {
	name: y,
	shader: b
}, S = "shadowMapUboDeclaration", C = "layout(std140,column_major) uniform;\n#include<sceneUboDeclaration>\n#include<meshUboDeclaration>\n";
e.IncludesShadersStore[S] || (e.IncludesShadersStore[S] = C);
var w = {
	name: S,
	shader: C
}, T = "shadowMapVertexExtraDeclaration", E = "#if SM_NORMALBIAS==1\nuniform vec3 lightDataSM;\n#endif\nuniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;\n#if SM_USEDISTANCE==1\nvarying vec3 vPositionWSM;\n#endif\n#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1\nvarying float zSM;\n#endif\n";
e.IncludesShadersStore[T] || (e.IncludesShadersStore[T] = E);
var D = {
	name: T,
	shader: E
}, O = "shadowMapVertexNormalBias", k = "#if SM_NORMALBIAS==1\n#if SM_DIRECTIONINLIGHTDATA==1\nvec3 worldLightDirSM=normalize(-lightDataSM.xyz);\n#else\nvec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);\n#endif\nfloat ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;\n#endif\n";
e.IncludesShadersStore[O] || (e.IncludesShadersStore[O] = k);
var A = {
	name: O,
	shader: k
}, j = "shadowMapVertexMetric", M = "#if SM_USEDISTANCE==1\nvPositionWSM=worldPos.xyz;\n#endif\n#if SM_DEPTHTEXTURE==1\n#ifdef IS_NDC_HALF_ZRANGE\n#define BIASFACTOR 0.5\n#else\n#define BIASFACTOR 1.0\n#endif\n#ifdef USE_REVERSE_DEPTHBUFFER\ngl_Position.z-=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;\n#else\ngl_Position.z+=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;\n#endif\n#endif\n#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1\nzSM=gl_Position.z;gl_Position.z=0.0;\n#elif SM_USEDISTANCE==0\n#ifdef USE_REVERSE_DEPTHBUFFER\nvDepthMetricSM=(-gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;\n#else\nvDepthMetricSM=(gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;\n#endif\n#endif\n";
e.IncludesShadersStore[j] || (e.IncludesShadersStore[j] = M);
var N = {
	name: j,
	shader: M
}, P = "shadowMapVertexShader", F = "attribute vec3 position;\n#ifdef NORMAL\nattribute vec3 normal;\n#endif\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#ifdef INSTANCES\nattribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;\n#endif\n#include<helperFunctions>\n#include<__decl__shadowMapVertex>\n#ifdef ALPHATEXTURE\nvarying vec2 vUV;uniform mat4 diffuseMatrix;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#endif\n#include<shadowMapVertexExtraDeclaration>\n#include<clipPlaneVertexDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void)\n{vec3 positionUpdated=position;\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#ifdef UV2\nvec2 uv2Updated=uv2;\n#endif\n#ifdef NORMAL\nvec3 normalUpdated=normal;\n#endif\n#include<morphTargetsVertexGlobal>\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvec4 worldPos=finalWorld*vec4(positionUpdated,1.0);\n#ifdef NORMAL\nmat3 normWorldSM=mat3(finalWorld);\n#if defined(INSTANCES) && defined(THIN_INSTANCES)\nvec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);\n#else\n#ifdef NONUNIFORMSCALING\nnormWorldSM=transposeMat3(inverseMat3(normWorldSM));\n#endif\nvec3 vNormalW=normalize(normWorldSM*normalUpdated);\n#endif\n#endif\n#include<shadowMapVertexNormalBias>\ngl_Position=viewProjection*worldPos;\n#include<shadowMapVertexMetric>\n#ifdef ALPHATEXTURE\n#ifdef UV1\nvUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef UV2\nvUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));\n#endif\n#endif\n#include<clipPlaneVertex>\n}";
e.ShadersStore[P] || (e.ShadersStore[P] = F);
var I = [
	r,
	i,
	d,
	p,
	t,
	h,
	v,
	x,
	n,
	u,
	w,
	D,
	c,
	f,
	m,
	o,
	a,
	s,
	A,
	N,
	l
];
for (let t of I) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var L = {
	name: P,
	shader: F
};
//#endregion
export { L as shadowMapVertexShader };
