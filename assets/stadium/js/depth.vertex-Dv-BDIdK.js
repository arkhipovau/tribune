import { t as e } from "./shaderStore-CXjvw9c2.js";
import { a as t, i as n, n as r, r as i, t as a } from "./bakedVertexAnimation-C84_EEyr.js";
import { t as o } from "./instancesDeclaration-CspCqzBt.js";
import { n as s, t as c } from "./clipPlaneVertex-CoylEQdx.js";
import { i as l, n as u, r as d, t as f } from "./morphTargetsVertex-BaK3QguC.js";
import { t as p } from "./pointCloudVertex-NYugcXwU.js";
//#region node_modules/@babylonjs/core/Shaders/ShadersInclude/pointCloudVertexDeclaration.js
var m = "pointCloudVertexDeclaration", h = "#ifdef POINTSIZE\nuniform float pointSize;\n#endif\n";
e.IncludesShadersStore[m] || (e.IncludesShadersStore[m] = h);
var g = {
	name: m,
	shader: h
}, _ = "depthVertexShader", v = "attribute vec3 position;\n#include<bonesDeclaration>\n#include<bakedVertexAnimationDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#include<clipPlaneVertexDeclaration>\n#include<instancesDeclaration>\nuniform mat4 viewProjection;uniform vec2 depthValues;\n#if defined(ALPHATEST) || defined(NEED_UV)\nvarying vec2 vUV;uniform mat4 diffuseMatrix;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#endif\n#ifdef STORE_CAMERASPACE_Z\nuniform mat4 view;varying vec4 vViewPos;\n#endif\n#include<pointCloudVertexDeclaration>\nvarying float vDepthMetric;\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void)\n{vec3 positionUpdated=position;\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#ifdef UV2\nvec2 uv2Updated=uv2;\n#endif\n#include<morphTargetsVertexGlobal>\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#include<instancesVertex>\n#include<bonesVertex>\n#include<bakedVertexAnimation>\nvec4 worldPos=finalWorld*vec4(positionUpdated,1.0);\n#include<clipPlaneVertex>\ngl_Position=viewProjection*worldPos;\n#ifdef STORE_CAMERASPACE_Z\nvViewPos=view*worldPos;\n#else\n#ifdef USE_REVERSE_DEPTHBUFFER\nvDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));\n#else\nvDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));\n#endif\n#endif\n#if defined(ALPHATEST) || defined(BASIC_RENDER)\n#ifdef UV1\nvUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef UV2\nvUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));\n#endif\n#endif\n#include<pointCloudVertex>\n}\n";
e.ShadersStore[_] || (e.ShadersStore[_] = v);
var y = [
	t,
	n,
	l,
	d,
	s,
	o,
	g,
	u,
	f,
	i,
	r,
	a,
	c,
	p
];
for (let t of y) e.IncludesShadersStore[t.name] || (e.IncludesShadersStore[t.name] = t.shader);
var b = {
	name: _,
	shader: v
};
//#endregion
export { b as depthVertexShader };
